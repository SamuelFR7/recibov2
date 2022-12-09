import { GetServerSideProps } from 'next'
import React from 'react'
import { z } from 'zod'
import { prisma } from '../../../server/db/prisma'
import { AsyncReturnType } from '../../../utils/ts-bs'
import extenso from 'extenso'

const getReceipt = async (id: string) => {
  const receiptInPrisma = await prisma.receipt.findUnique({
    where: {
      id,
    },
    select: {
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

  const receiptSchma = z.object({
    date: z.date().transform((arg) => String(arg)),
    value: z.any().transform((arg) => Number(arg)),
    historic: z.string(),
    recipientAddress: z.string(),
    recipientName: z.string(),
    recipientDocument: z.string(),
    payerAddress: z.string(),
    payerDocument: z.string(),
    payerName: z.string(),
    farmId: z.string(),
  })

  const receipt = receiptSchma.parse(receiptInPrisma)

  return receipt
}

type ReceiptQueryResult = AsyncReturnType<typeof getReceipt>

const Print: React.FC<{ receipt: ReceiptQueryResult }> = ({ receipt }) => {
  return (
    <div className="bg-white text-black max-w-[21cm] mx-auto p-8">
      <div className="flex items-center justify-between ">
        <h2 className="text-4xl font-bold">RECIBO</h2>
        <div className="flex items-center gap-1">
          <div className="border border-black p-1 font-bold text-right w-[5cm] text-xl">
            <span>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(receipt.value)}
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-flow-col gap-2 w-full mt-2">
        <div className="flex flex-col">
          <div className="h-14" />
          <div className="w-full flex flex-col">
            <span className="pt-4 font-medium border-b border-black">
              PAGADOR:
            </span>
            <div className="flex flex-col gap-2 [&_span]:h-[29px] text-left ml-auto mr-10 font-medium">
              <span className="flex items-center">Nome:</span>
              <span className="flex items-center">Endereço:</span>
              <span className="flex items-center">CNPJ:</span>
            </div>
          </div>
          <div className="w-full flex flex-col">
            <span className="pt-4 font-medium border-b border-black">
              BENEFICIÁRIO:
            </span>
            <div className="flex flex-col gap-2 [&_span]:h-[29px] text-left ml-auto mr-10 font-medium">
              <span className="flex items-center">Nome:</span>
              <span className="flex items-center">Endereço:</span>
              <span className="flex items-center">CNPJ:</span>
            </div>
          </div>
          <span className="pt-4 font-medium border-b border-black">
            HISTÓRICO:
          </span>
          <span className="pt-[26px] mt-60 mx-auto font-medium">DATA:</span>
        </div>
        <div className="flex flex-col col-span-2">
          <span className="border border-black p-1 font-medium text-left w-full text-md h-14">
            {extenso(receipt.value).toUpperCase() + ' REAIS'}
          </span>
          <div className="flex flex-col w-full gap-2 mt-11 [&_span]:h-[29px]">
            <span className="p-1 border border-black font-medium text-left w-full text-md">
              {receipt?.payerName}
            </span>
            <span className="p-1 border border-black font-medium text-left w-full text-md">
              {receipt?.payerAddress}
            </span>
            <span className="p-1 border border-black font-medium text-left w-full text-md ">
              {receipt?.payerDocument}
            </span>
          </div>
          <div className="flex flex-col w-full gap-2 mt-11 [&_span]:h-[29px]">
            <span className="p-1 border border-black font-medium text-left w-full text-md">
              {receipt?.recipientName}
            </span>
            <span className="p-1 border border-black font-medium text-left w-full text-md">
              {receipt?.recipientAddress}
            </span>
            <span className="p-1 border border-black font-medium text-left w-full text-md ">
              {receipt?.recipientDocument}
            </span>
          </div>
          <div className="flex flex-col w-full gap-2 mt-11">
            <span className=" border border-black font-medium text-left w-full text-md h-60">
              {receipt?.historic}
            </span>
          </div>
          <div className="flex w-full mt-4 gap-4">
            <span className="font-medium">
              {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(
                new Date(receipt.date),
              )}
            </span>

            <div className="flex flex-col w-full mt-6">
              <div className="border-b border-black" />
              <span className="font-medium text-center">
                {receipt?.recipientName}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 border-b border-dotted border-black" />
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
