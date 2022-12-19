import { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { prisma } from '@/server/db/prisma'
import PDFDocument from 'pdfkit-table'
import { z } from 'zod'

async function getReceipt(id: string) {
  const receipts = await prisma.receipt.findMany({
    where: {
      farmId: id,
    },
    include: {
      Farm: {
        select: {
          name: true,
        },
      },
    },
  })

  const receiptSchema = z.object({
    date: z.date().transform((arg) => arg.toISOString().slice(0, 10)),
    value: z.any().transform((arg) => Number(arg)),
    number: z.number(),
    recipientName: z.string(),
    recipientDocument: z.string().nullable(),
    Farm: z.object({
      name: z.string(),
    }),
  })

  const parsedReceipts = receipts.map((item) => {
    return receiptSchema.parse(item)
  })

  return parsedReceipts
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, authOptions)

  if (!session) {
    return res.send({
      message: 'You are not authorized to access this content',
    })
  }

  const { id } = req.query

  const receipts = await getReceipt(id as string)

  const chunks: Buffer[] = []

  const pdfDoc = new PDFDocument({
    margin: 20,
    size: 'A4',
  })

  const tableRows = receipts.map((receipt) => {
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
    subtitle: `Fazenda: ${receipts[0].Farm.name}`,
    headers: ['Data', 'Numero', 'Beneficiário', 'CPF/CNPJ', 'Valor'],
    rows: tableRows,
  }

  pdfDoc.table(table)

  res.setHeader('Content-Type', 'application/pdf')

  pdfDoc.on('data', (chunk) => chunks.push(chunk))

  pdfDoc.end()

  pdfDoc.on('end', () => {
    const result = Buffer.concat(chunks)
    return res.end(result)
  })
}
