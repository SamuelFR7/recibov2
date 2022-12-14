import { GetServerSideProps } from 'next'
import { prisma } from '@/server/db/prisma'
import { z } from 'zod'
import { AsyncReturnType } from '@/utils/ts-bs'
import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { trpc } from '@/utils/trpc'
import { Input } from '@/components/Form/Input'
import { Container } from '@/components/Container'
import { Button } from '@/components/Button'

const fetchReceiptSchema = z.object({
  date: z.date().transform((arg) => arg.toISOString().slice(0, 10)),
  historic: z.string().nullable(),
  value: z.any().transform((arg) => Number(arg)),
  payerAddress: z.string().nullable(),
  payerDocument: z.string().nullable(),
  payerName: z.string().nullable(),
  recipientName: z.string(),
  recipientAddress: z.string().nullable(),
  recipientDocument: z.string().nullable(),
  Farm: z.object({
    name: z.string(),
  }),
})

const receiptSchema = z.object({
  date: z.string().min(1, { message: 'É preciso uma data' }),
  value: z
    .string()
    .min(1, { message: 'É preciso fornecer um valor' })
    .transform((arg) => Number(arg)),
  historic: z.string().nullable(),
  recipientName: z.string().min(1, { message: 'É preciso de um nome' }),
  recipientAddress: z.string().nullable(),
  recipientDocument: z.string().nullable(),
  payerName: z.string().nullable(),
  payerAddress: z.string().nullable(),
  payerDocument: z.string().nullable(),
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
      Farm: {
        select: {
          name: true,
        },
      },
    },
  })

  if (!receipt) {
    throw new Error('receipt does not exists')
  }

  const parsedReceipt = fetchReceiptSchema.parse(receipt)

  return parsedReceipt
}

type ReceiptAsyncResult = AsyncReturnType<typeof getReceipt>

const EditReceipt: React.FC<{ receipt: ReceiptAsyncResult }> = ({
  receipt,
}) => {
  const router = useRouter()
  const { id } = router.query
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReceiptAsyncResult>({
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
    <div>
      <Container classNames="mt-[10rem] text-sm">
        <div className="flex flex-col w-full bg-white rounded-md shadow-header">
          <h1 className="text-md p-5 font-semibold">Editar recibo</h1>
          <form
            onSubmit={handleSubmit(handleEditReceipt)}
            className="flex w-full flex-col gap-4 px-5 pb-5"
          >
            <div className="flex flex-col gap-5">
              <div className="px-3 grid grid-cols-3 gap-2 [&_div]:flex [&_div]:flex-col">
                <Input
                  disabled
                  name="Fazenda"
                  label="Fazenda"
                  defaultValue={receipt.Farm.name}
                />
                <Input
                  error={errors.date}
                  label="Data"
                  placeholder="Data"
                  {...register('date')}
                  type="date"
                />
                <Input
                  error={errors.value}
                  label="Valor"
                  placeholder="Valor"
                  {...register('value')}
                  type="number"
                />
              </div>
              <div>
                <h2 className="text-md">Beneficiario</h2>
                <div className="px-3 mt-5">
                  <Input
                    error={errors.recipientName}
                    label="Nome"
                    placeholder="Nome"
                    {...register('recipientName')}
                  />
                  <div className="grid grid-cols-2 gap-5 mt-3">
                    <Input
                      error={errors.recipientAddress}
                      label="Endereço"
                      placeholder="Endereço"
                      {...register('recipientAddress')}
                    />
                    <Input
                      error={errors.recipientDocument}
                      label="Documento"
                      placeholder="Documento"
                      {...register('recipientDocument')}
                    />
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-md">Pagador</h2>
                <div className="px-3 mt-5">
                  <Input
                    error={errors.payerName}
                    label="Nome"
                    placeholder="Nome"
                    {...register('payerName')}
                  />
                  <div className="grid grid-cols-2 gap-5 mt-3">
                    <Input
                      error={errors.payerAddress}
                      label="Endereço"
                      placeholder="Endereço"
                      {...register('payerAddress')}
                    />
                    <Input
                      error={errors.payerDocument}
                      label="Documento"
                      placeholder="Documento"
                      {...register('payerDocument')}
                    />
                  </div>
                </div>
              </div>
              <div className="px-3">
                <Input
                  error={errors.historic}
                  label="Histórico"
                  placeholder="Histórico"
                  {...register('historic')}
                />
              </div>
            </div>
            <div className="px-3 w-full">
              <Button type="submit">Editar</Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
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
