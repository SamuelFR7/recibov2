import { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { prisma } from '@/server/db/prisma'
import PDFDocument from 'pdfkit-table'
import { z } from 'zod'

const receiptsSchema = z
  .object({
    number: z.number(),
    date: z.date().transform((arg) => String(arg)),
    value: z.any().transform((arg) => Number(arg)),
    recipientName: z.string(),
    recipientDocument: z.string().nullable(),
  })
  .array()

const getFarms = async () => {
  const farmsSchema = z.object({
    id: z.string(),
    name: z.string(),
    receipts: receiptsSchema,
  })

  const farmsInDatabase = await prisma.farm.findMany({
    select: {
      id: true,
      name: true,
      receipts: {
        select: {
          number: true,
          date: true,
          value: true,
          recipientName: true,
          recipientDocument: true,
        },
      },
    },
  })

  const farms = farmsInDatabase.map((item) => {
    return farmsSchema.parse(item)
  })

  return farms
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, authOptions)

  if (!session) {
    return res.send({
      message: 'You are not authorized to access this content',
    })
  }

  const farms = await getFarms()

  const chunks: Buffer[] = []

  const pdfDoc = new PDFDocument({
    margin: 20,
    size: 'A4',
  })

  farms.map((farm, index) => {
    const tableRows = farm.receipts.map((receipt) => {
      return [
        new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(
          new Date(receipt.date),
        ),
        String(receipt.number),
        receipt.recipientName ?? '',
        receipt.recipientDocument ?? '',
        new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(receipt.value),
      ]
    })

    const table = {
      title: 'Listagem de recibos',
      subtitle: `Fazenda: ${farm.name}`,
      headers: ['Data', 'Numero', 'Beneficiário', 'CPF/CNPJ', 'Valor'],
      rows: tableRows,
    }

    if (index !== 0) {
      pdfDoc.moveDown()
    }
    pdfDoc.table(table)
  })

  res.setHeader('Content-Type', 'application/pdf')

  pdfDoc.on('data', (chunk) => chunks.push(chunk))

  pdfDoc.end()

  pdfDoc.on('end', () => {
    const result = Buffer.concat(chunks)
    return res.end(result)
  })
}
