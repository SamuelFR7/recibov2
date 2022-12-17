import React from 'react'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'

import { trpc } from '@/utils/trpc'
import { prisma } from '@/server/db/prisma'
import { AsyncReturnType } from '@/utils/ts-bs'

import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Container } from '@/components/Container'
import { Input } from '@/components/Form/Input'
import { Button } from '@/components/Button'

const farmSchema = z.object({
  name: z.string().min(1, { message: 'É preciso de um nome' }),
  payerName: z.string().nullable(),
  payerAddress: z.string().nullable(),
  payerDocument: z.string().nullable(),
})

type FarmSchemaType = z.infer<typeof farmSchema>

async function getFarm(id: string) {
  const farmToEdit = await prisma.farm.findUnique({
    where: {
      id,
    },
  })

  if (!farmToEdit) {
    throw new Error('farm does not exists')
  }

  const farm = farmSchema.parse(farmToEdit)

  return farm
}

type FarmAsyncResult = AsyncReturnType<typeof getFarm>

const EditFarm: React.FC<{ farm: FarmAsyncResult }> = ({ farm }) => {
  const router = useRouter()
  const { id } = router.query

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FarmSchemaType>({
    resolver: zodResolver(farmSchema),
    defaultValues: farm,
  })

  const mutation = trpc.farms.edit.useMutation()

  const handleEditFarm: SubmitHandler<FarmSchemaType> = async (values) => {
    console.log('aqui')
    mutation.mutate({
      id: String(id),
      ...values,
    })

    router.push('/farms')
  }

  return (
    <div>
      <Container classNames="mt-[10rem] text-sm">
        <div className="flex flex-col w-full bg-white rounded-md shadow-header">
          <h1 className="text-md p-5 font-semibold">Nova fazenda</h1>
          <form
            onSubmit={handleSubmit(handleEditFarm)}
            className="flex w-full flex-col gap-4 px-5 pb-5"
          >
            <div className="px-3">
              <Input
                label="Fazenda"
                error={errors.name}
                type="text"
                placeholder="Nome Fazenda"
                {...register('name')}
              />
            </div>
            <div>
              <h2 className="text-md">Pagador</h2>
              <div className="px-3 mt-5">
                <Input
                  label="Nome"
                  error={errors.payerName}
                  type="text"
                  placeholder="Nome pagador"
                  {...register('payerName')}
                />
                <div className="grid grid-cols-2 gap-5 mt-3">
                  <Input
                    label="Endereço"
                    error={errors.payerAddress}
                    type="text"
                    placeholder="Endereço"
                    {...register('payerAddress')}
                  />
                  <Input
                    label="Documento"
                    error={errors.payerDocument}
                    type="text"
                    placeholder="Documento"
                    {...register('payerDocument')}
                  />
                </div>
              </div>
            </div>
            <div className="w-full px-3">
              <Button font="medium" size="full" type="submit">
                Editar
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  )
}

export default EditFarm

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query

  const farm = await getFarm(id as string)

  return {
    props: {
      farm,
    },
  }
}
