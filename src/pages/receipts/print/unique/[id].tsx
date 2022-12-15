import { GetServerSideProps } from 'next'
import React from 'react'
import { z } from 'zod'
import { prisma } from '@/server/db/prisma'
import { AsyncReturnType } from '@/utils/ts-bs'
import { Page } from '@/components/Print/Page'
import { Receipt } from '@/components/Print/Receipt'

const getReceipt = async (id: string) => {
  const receiptInPrisma = await prisma.receipt.findUnique({
    where: {
      id,
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

  if (receiptInPrisma === null) {
    throw new Error('not exists')
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

  const receipt = receiptSchema.parse(receiptInPrisma)

  return receipt
}

type ReceiptQueryResult = AsyncReturnType<typeof getReceipt>

const Print: React.FC<{ receipt: ReceiptQueryResult }> = ({ receipt }) => {
  return (
    <div className="w-full flex justify-center">
      <Page>
        <Receipt receipt={receipt} />
      </Page>
    </div>
  )
}

export default Print

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query

  const receipt = await getReceipt(id as string)

  return {
    props: {
      receipt,
    },
  }
}
