import { GetServerSideProps } from 'next'
import React from 'react'
import { z } from 'zod'
import { prisma } from '@/server/db/prisma'
import { AsyncReturnType } from '@/utils/ts-bs'
import * as Separator from '@radix-ui/react-separator'

const getReceipts = async (id: string) => {
  const receiptSchma = z.object({
    date: z.date().transform((arg) => String(arg)),
    value: z.any().transform((arg) => Number(arg)),
    number: z.number(),
    historic: z.string(),
    recipientAddress: z.string(),
    recipientName: z.string(),
    recipientDocument: z.string(),
    payerAddress: z.string(),
    payerDocument: z.string(),
    payerName: z.string(),
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
      return receiptSchma.parse(item)
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
    return receiptSchma.parse(item)
  })

  return receipts
}

type ReceiptQueryResult = AsyncReturnType<typeof getReceipts>

const Print: React.FC<{ receipts: ReceiptQueryResult }> = ({ receipts }) => {
  return (
    <div className="text-text text-sm">
      <div className="p-[42px]">
        {receipts.map((receipt, index) => (
          <>
            <div key={index}>
              <div className="flex justify-between items-center">
                <h1 className="text-3xl">Recibo</h1>
                <div className="flex gap-2 text-2xl">
                  <h2>Valor:</h2>
                  <p>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(receipt.value)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <Separator.Root className="w-full rounded-md h-[10px] bg-gray-300 my-[21px]" />
                <div className="flex gap-2 [&_p]:font-medium [&_div]:flex [&_div]:gap-1">
                  <div>
                    <p>Número: </p>
                    <span>{receipt.number}</span>
                  </div>
                  <div>
                    <p>Data: </p>
                    <span>
                      {new Intl.DateTimeFormat('pt-BR', {
                        dateStyle: 'short',
                        timeZone: 'UTC',
                      }).format(new Date(receipt.date))}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <h2 className="bg-grayPrint text-black inline-block py-[8px] px-[15px] font-medium w-[100px] rounded-t-md text-center">
                  Pagador
                </h2>
                <Separator.Root className="w-full h-[1px] bg-gray-300" />
                <div className="mt-[15px] [&_b]:font-medium [&_b]:text-black">
                  <p>
                    <b>Nome: </b>
                    {receipt.payerName}
                  </p>
                  <p>
                    <b>Endreço: </b>
                    {receipt.payerAddress}
                  </p>
                  <p>
                    <b>CPF/CNPJ: </b>
                    {receipt.payerDocument}
                  </p>
                </div>

                <h2 className="bg-grayPrint text-black inline-block py-[8px] px-[15px] font-medium w-[100px] rounded-t-md text-center mt-[25px]">
                  Recebedor
                </h2>
                <Separator.Root className="w-full h-[1px] bg-gray-300" />
                <div className="mt-[15px] [&_b]:font-medium [&_b]:text-black">
                  <p>
                    <b>Nome: </b>
                    {receipt.recipientName}
                  </p>
                  <p>
                    <b>Endreço: </b>
                    {receipt.recipientAddress}
                  </p>
                  <p>
                    <b>CPF/CNPJ: </b>
                    {receipt.recipientDocument}
                  </p>
                </div>

                {receipt.historic.length > 0 ? (
                  <>
                    <h2 className="bg-grayPrint text-black inline-block py-[8px] px-[15px] font-medium w-[100px] rounded-t-md text-center mt-[25px]">
                      Histórico
                    </h2>
                    <Separator.Root className="w-full h-[1px] bg-gray-300" />
                    <div className="p-4">{receipt.historic}</div>
                  </>
                ) : null}

                <div className="mt-[25px] flex flex-col max-w-full items-center ">
                  <Separator.Root className="w-[500px] h-[1px] bg-slate-600" />
                  <span className="text-black mt-[2px]">
                    {receipt.recipientName}
                  </span>
                </div>
              </div>
            </div>
            {index !== receipts.length - 1 ? (
              <>
                <Separator.Root className="bg-gray-300 h-[1px] w-full my-[10px]" />
              </>
            ) : null}
          </>
        ))}
      </div>
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
