import { GetServerSideProps } from 'next'
import React from 'react'
import { z } from 'zod'
import { prisma } from '@/server/db/prisma'
import { AsyncReturnType } from '@/utils/ts-bs'

const getReceipts = async (id: string) => {
  const receiptSchma = z.object({
    date: z.date().transform((arg) => String(arg)),
    value: z.any().transform((arg) => Number(arg)),
    number: z.number(),
    recipientName: z.string(),
    recipientDocument: z.string().nullable(),
    farmId: z.string(),
    Farm: z.object({
      name: z.string(),
    }),
  })

  const receiptInPrisma = await prisma.receipt.findMany({
    where: {
      farmId: id,
    },
    select: {
      number: true,
      date: true,
      value: true,
      recipientName: true,
      recipientDocument: true,
      farmId: true,
      Farm: {
        select: {
          name: true,
        },
      },
    },
  })

  const receipts = receiptInPrisma.map((item) => {
    return receiptSchma.parse(item)
  })

  return receipts
}

type ReceiptQueryResult = AsyncReturnType<typeof getReceipts>

function getTotalReceipts(receipts: ReceiptQueryResult) {
  let total = 0

  receipts.map((item) => {
    return (total = total + item.value)
  })

  return total
}

const Print: React.FC<{ receipts: ReceiptQueryResult }> = ({ receipts }) => {
  const totalReceipts = getTotalReceipts(receipts)

  return (
    <div className="text-text text-sm">
      <div className="p-[42px]">
        <div className="flex flex-col">
          <h2 className="text-lg">Listagem dos recibos</h2>
          <div className="mt-[20px]">
            <div className="flex text-md gap-2">
              <h2 className="font-semibold">Fazenda:</h2>
              <span>{receipts[0].Farm.name}</span>
            </div>
            <table className="mt-[10px] rounded-md border-text w-full">
              <thead>
                <tr className="text-left bg-grayHover border border-b-0 text-black [&_th]:px-[15px] [&_th]:py-[15px]">
                  <th>Data</th>
                  <th>Número</th>
                  <th>Beneficiário</th>
                  <th>CPF/CNPJ</th>
                  <th className="text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((receipt, index) => (
                  <>
                    <tr
                      key={index}
                      className="border border-text [&_td]:py-[10px] [&_td]:px-[15px] "
                    >
                      <td>
                        {new Intl.DateTimeFormat('pt-BR', {
                          dateStyle: 'short',
                          timeZone: 'UTC',
                        }).format(new Date(receipt.date))}
                      </td>
                      <td>{receipt.number}</td>
                      <td>{receipt.recipientName}</td>
                      <td>{receipt.recipientDocument}</td>
                      <td className="text-right">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(receipt.value)}
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-[10px] px-2">
            <div className="flex gap-4">
              <p>{receipts.length}</p>
              <span>registros</span>
            </div>
            <div className="flex gap-4 text-md">
              <h3 className="font-semibold">Total:</h3>
              <span>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(totalReceipts)}
              </span>
            </div>
          </div>
        </div>
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
