import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/server/db/prisma'
import PDFDocument from 'pdfkit'
import { z } from 'zod'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

async function getReceipt(id: string) {
  const receipts =
    id !== '0'
      ? await prisma.receipt.findMany({
          where: {
            farmId: id,
          },
        })
      : await prisma.receipt.findMany()

  const receiptSchema = z.object({
    date: z.date().transform((arg) => arg.toISOString().slice(0, 10)),
    value: z.any().transform((arg) => Number(arg)),
    number: z.number(),
    historic: z.string().nullable(),
    recipientAddress: z.string().nullable(),
    recipientName: z.string(),
    recipientDocument: z.string().nullable(),
    payerAddress: z.string().nullable(),
    payerDocument: z.string().nullable(),
    payerName: z.string().nullable(),
    farmId: z.string(),
  })

  const parsedReceipts = receipts.map((item) => {
    return receiptSchema.parse(item)
  })

  return parsedReceipts
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const supabase = createServerSupabaseClient({ req, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return res.send({
      message: 'You are not authorized to access this content',
    })
  }

  const { id } = req.query

  const receipts = await getReceipt(id as string)

  const chunks: Buffer[] = []

  const pdfDoc = new PDFDocument({
    margin: 0,
    size: 'A4',
  })

  let headerStartY = 20
  let payerY = 70
  let recipientY = 180
  let historicY = 290
  let dateY = 380

  receipts.map((receipt, index) => {
    if (index % 2 === 0 && index !== 0) {
      pdfDoc.addPage({
        margin: 0,
        size: 'A4',
      })
    }

    if (index % 2 === 0) {
      headerStartY = 20
      payerY = 70
      recipientY = 180
      historicY = 290
      dateY = 380
    } else {
      headerStartY = 420
      payerY = 470
      recipientY = 580
      historicY = 690
      dateY = 780
    }

    pdfDoc
      .fontSize(20)
      .text('RECIBO', 20, headerStartY)
      .fontSize(20)
      .text(
        `${new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(receipt.value)}`,
        480,
        headerStartY,
      )

    pdfDoc
      .fontSize(16)
      .text('Pagador', 20, payerY)
      .fontSize(12)
      .text('NOME:', 20, payerY + 30)
      .text(`${receipt.payerName ?? ''}`, 100, payerY + 30)
      .text('ENDEREÇO:', 20, payerY + 50)
      .text(`${receipt.payerAddress ?? ''}`, 100, payerY + 50)
      .text('CPF/CNPJ:', 20, payerY + 70)
      .text(`${receipt.payerDocument ?? ''}`, 100, payerY + 70)

    pdfDoc
      .fontSize(16)
      .text('Beneficiário', 20, recipientY)
      .fontSize(12)
      .text('NOME:', 20, recipientY + 30)
      .text(`${receipt.recipientName}`, 100, recipientY + 30)
      .text('ENDEREÇO:', 20, recipientY + 50)
      .text(`${receipt.recipientAddress ?? ''}`, 100, recipientY + 50)
      .text('CPF/CNPJ:', 20, recipientY + 70)
      .text(`${receipt.recipientDocument ?? ''}`, 100, recipientY + 70)

    pdfDoc
      .fontSize(16)
      .text('Histórico', 20, historicY)
      .fontSize(12)
      .text(`${receipt.historic ?? ''}`, 20, historicY + 30)

    pdfDoc
      .fontSize(12)
      .text('Data:', 20, dateY)
      .text(
        new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(
          new Date(receipt.date),
        ),
        55,
        dateY,
      )

    pdfDoc
      .moveTo(150, dateY + 10)
      .lineTo(550, dateY + 10)
      .stroke()

    pdfDoc.text(`${receipt.recipientName}`, 300, dateY + 15)
  })

  res.setHeader('Content-Type', 'application/pdf')

  pdfDoc.on('data', (chunk) => chunks.push(chunk))

  pdfDoc.end()

  pdfDoc.on('end', () => {
    const result = Buffer.concat(chunks)
    return res.end(result)
  })
}
