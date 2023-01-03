import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/server/db/prisma'
import PDFDocument from 'pdfkit'
import { z } from 'zod'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

async function getReceipt(id: string) {
  const receipt = await prisma.receipt.findUnique({
    where: {
      id,
    },
  })

  if (!receipt) {
    throw new Error('does not exists')
  }

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

  return receiptSchema.parse(receipt)
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

  const receipt = await getReceipt(id as string)

  const chunks: Buffer[] = []

  const pdfDoc = new PDFDocument({
    autoFirstPage: false,
  })

  pdfDoc.addPage({
    margin: 0,
    size: 'A4',
  })

  pdfDoc
    .fontSize(20)
    .text('RECIBO', 20, 20)
    .fontSize(20)
    .text(
      `${new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(receipt.value)}`,
      480,
      20,
    )

  pdfDoc
    .fontSize(16)
    .text('Pagador', 20, 70)
    .fontSize(12)
    .text('NOME:', 20, 100)
    .text(`${receipt.payerName}`, 100, 100)
    .text('ENDEREÇO:', 20, 120)
    .text(`${receipt.payerAddress}`, 100, 120)
    .text('CPF/CNPJ:', 20, 140)
    .text(`${receipt.payerDocument}`, 100, 140)

  pdfDoc
    .fontSize(16)
    .text('Beneficiário', 20, 180)
    .fontSize(12)
    .text('NOME:', 20, 210)
    .text(`${receipt.recipientName}`, 100, 210)
    .text('ENDEREÇO:', 20, 230)
    .text(`${receipt.recipientAddress}`, 100, 230)
    .text('CPF/CNPJ:', 20, 250)
    .text(`${receipt.recipientDocument}`, 100, 250)

  pdfDoc
    .fontSize(16)
    .text('Histórico', 20, 290)
    .fontSize(12)
    .text(`${receipt.historic}`, 20, 320)

  pdfDoc
    .fontSize(12)
    .text('Data:', 20, 380)
    .text(
      new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(
        new Date(receipt.date),
      ),
      55,
      380,
    )

  pdfDoc.moveTo(150, 390).lineTo(550, 390).stroke()

  pdfDoc.text(`${receipt.recipientName}`, 300, 395)

  res.setHeader('Content-Type', 'application/pdf')

  pdfDoc.on('data', (chunk) => chunks.push(chunk))

  pdfDoc.end()

  pdfDoc.on('end', () => {
    const result = Buffer.concat(chunks)
    return res.end(result)
  })
}
