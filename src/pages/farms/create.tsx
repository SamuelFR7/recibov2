import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { useForm, SubmitHandler } from 'react-hook-form'
import { z } from 'zod'
import { trpc } from '@/utils/trpc'
import { Container } from '@/components/Container'
import { Input } from '@/components/Form/Input'
import { Button } from '@/components/Button'
import { getServerAuthSession } from '@/server/common/get-server-auth-session'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'

const farmSchema = z.object({
  name: z.string().min(1, { message: 'É preciso de um nome' }),
  payerName: z.string().nullable(),
  payerAddress: z.string().nullable(),
  payerDocument: z.string().nullable(),
})

type FarmSchemaType = z.infer<typeof farmSchema>

export default function NewFarm() {
  const utils = trpc.useContext()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FarmSchemaType>({
    resolver: zodResolver(farmSchema),
  })

  const mutation = trpc.farms.create.useMutation({
    onSuccess() {
      utils.farms.getAll.invalidate()
      router.push('/farms')
    },
    onError() {
      setError('name', {
        message: 'Já existe uma fazenda com este nome',
      })
    },
  })

  const handleCreateFarm: SubmitHandler<FarmSchemaType> = async (values) => {
    mutation.mutate({
      ...values,
    })
  }

  return (
    <div>
      <Container classNames="mt-[10rem] text-sm">
        <div className="flex flex-col w-full bg-white rounded-md shadow-header">
          <h1 className="text-md p-5 font-medium">Nova fazenda</h1>
          <form
            onSubmit={handleSubmit(handleCreateFarm)}
            className="flex w-full flex-col gap-4 px-5 pb-5"
          >
            <div className="px-3">
              <Input
                error={errors.name}
                label="Fazenda"
                placeholder="Nome Fazenda"
                {...register('name')}
                type="text"
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
                Criar
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext,
) => {
  const session = await getServerAuthSession(ctx)

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
    },
  }
}
