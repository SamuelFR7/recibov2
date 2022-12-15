import { GetServerSideProps } from 'next'
import React from 'react'
import { z } from 'zod'
import { prisma } from '@/server/db/prisma'
import { AsyncReturnType } from '@/utils/ts-bs'
import { Page } from '@/components/Print/Page'
import { Receipt } from '@/components/Print/Receipt'

const getReceipts = async (id: string) => {
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

  if (id !== '0') {
    const receiptInPrisma = await prisma.receipt.findMany({
      where: {
        farmId: id,
      },
      select: {
        number: true,
        date: true,
        value: true,
        historic: true,
        recipientAddress: true,
        recipientName: true,
        recipientDocument: true,
        payerAddress: true,
        payerDocument: true,
        payerName: true,
        farmId: true,
      },
    })

    const receipts = receiptInPrisma.map((item) => {
      return receiptSchema.parse(item)
    })

    return receipts
  }

  const receiptInPrisma = await prisma.receipt.findMany({
    select: {
      number: true,
      date: true,
      value: true,
      historic: true,
      recipientAddress: true,
      recipientName: true,
      recipientDocument: true,
      payerAddress: true,
      payerDocument: true,
      payerName: true,
      farmId: true,
    },
  })

  const receipts = receiptInPrisma.map((item) => {
    return receiptSchema.parse(item)
  })

  return receipts
}

type ReceiptQueryResult = AsyncReturnType<typeof getReceipts>

const Print: React.FC<{ receipts: ReceiptQueryResult }> = ({ receipts }) => {
  return (
    <div className="w-full flex justify-center">
      <Page>
        {receipts.map((receipt, index) => (
          <>
            <Receipt key={index} receipt={receipt} />
          </>
        ))}
      </Page>
    </div>
  )
}

export default Print

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query

  const receipts = await getReceipts(id as string)

  return {
    props: {
      receipts,
    },
  }
}
