import { GetServerSideProps } from 'next'
import { prisma } from '@/server/db/prisma'
import { z } from 'zod'
import { AsyncReturnType } from '@/utils/ts-bs'
import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { trpc } from '@/utils/trpc'

const receiptSchema = z.object({
  date: z.date().transform((arg) => arg.toISOString().slice(0, 10)),
  historic: z.string().nullable(),
  value: z.any().transform((arg) => Number(arg)),
  payerAddress: z.string().nullable(),
  payerDocument: z.string().nullable(),
  payerName: z.string().nullable(),
  recipientName: z.string(),
  recipientAddress: z.string().nullable(),
  recipientDocument: z.string().nullable(),
})

async function getReceipt(id: string) {
  const receipt = await prisma.receipt.findUnique({
    where: {
      id,
    },
    select: {
      date: true,
      historic: true,
      value: true,
      payerAddress: true,
      payerDocument: true,
      payerName: true,
      recipientAddress: true,
      recipientDocument: true,
      recipientName: true,
    },
  })

  if (!receipt) {
    throw new Error('receipt does not exists')
  }

  const parsedReceipt = receiptSchema.parse(receipt)

  return parsedReceipt
}

type ReceiptAsyncResult = AsyncReturnType<typeof getReceipt>

const EditReceipt: React.FC<{ receipt: ReceiptAsyncResult }> = ({
  receipt,
}) => {
  const router = useRouter()
  const { id } = router.query
  const { register, handleSubmit } = useForm<ReceiptAsyncResult>({
    resolver: zodResolver(receiptSchema),
    defaultValues: receipt,
  })

  const mutation = trpc.editReceipt.useMutation()

  const handleEditReceipt: SubmitHandler<ReceiptAsyncResult> = async (
    values,
  ) => {
    mutation.mutate({
      id: id as string,
      ...values,
    })
    router.push('/')
  }

  return (
    <form
      className="flex flex-col gap-4 [&_input]:bg-gray-300 max-w-[500px]"
      onSubmit={handleSubmit(handleEditReceipt)}
    >
      <input
        {...register('date', {
          valueAsDate: true,
        })}
        type="date"
        placeholder="Data"
      />
      <input {...register('historic')} placeholder="Historico" />
      <input {...register('value')} placeholder="Valor" />
      <input {...register('recipientName')} placeholder="Recebedor Nome" />
      <input
        {...register('recipientAddress')}
        placeholder="Recebedor endereço"
      />
      <input
        {...register('recipientDocument')}
        placeholder="Recebedor documento"
      />
      <input {...register('payerName')} placeholder="Pagador nome" />
      <input {...register('payerAddress')} placeholder="Pagador Endereço" />
      <input {...register('payerDocument')} placeholder="Pagador documento" />
      <button type="submit">Editar</button>
    </form>
  )
}

export default EditReceipt

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query

  const receipt = await getReceipt(id as string)

  return {
    props: {
      receipt,
    },
  }
}
