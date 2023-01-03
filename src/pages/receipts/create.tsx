import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { trpc } from '@/utils/trpc'
import { useRouter } from 'next/router'
import { Container } from '@/components/Container'
import { Input } from '@/components/Form/Input'
import { Button } from '@/components/Button'
import { Select } from '@/components/Form/Select'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { getServerAuthSession } from '@/server/common/get-server-auth-session'

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
  farmId: z.string().min(1, { message: 'UÉ preciso de uma fazenda' }),
})

type ReceiptSchemaType = z.infer<typeof receiptSchema>

export default function CreateReceipts() {
  const utils = trpc.useContext()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ReceiptSchemaType>({
    resolver: zodResolver(receiptSchema),
  })

  const mutation = trpc.receipts.create.useMutation({
    onSuccess() {
      utils.receipts.getAll.invalidate()
      router.push('/')
    },
  })

  const farms = trpc.farms.getAll.useQuery()

  const handleCreateReceipt: SubmitHandler<ReceiptSchemaType> = async (
    values,
  ) => {
    mutation.mutate({
      ...values,
    })
  }

  if (!farms.data || farms.isLoading)
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <img src="/loader.svg" alt="Loader" />
      </div>
    )

  function setPayerData(value: string) {
    const selectedFarm = farms.data?.find((farm) => {
      return farm.id.match(value)
    })

    if (!selectedFarm) {
      throw new Error('not exists?')
    }

    setValue('payerName', selectedFarm.payerName)
    setValue('payerAddress', selectedFarm.payerAddress)
    setValue('payerDocument', selectedFarm.payerDocument)
    setValue('farmId', value)
  }

  return (
    <div>
      <Container classNames="mt-[10rem] text-sm">
        <div className="flex flex-col w-full bg-white rounded-md shadow-header">
          <h1 className="text-md p-5 font-medium">Novo recibo</h1>
          <form
            onSubmit={handleSubmit(handleCreateReceipt)}
            className="flex w-full flex-col gap-4 px-5 pb-5"
          >
            <div className="flex flex-col gap-5">
              <div className="px-3 grid grid-cols-3 gap-2 [&_div]:flex [&_div]:flex-col">
                <Select
                  label="Fazenda"
                  placeholder="Fazenda"
                  {...register('farmId', {
                    onChange: (e) => setPayerData(e.target.value),
                  })}
                  error={errors.farmId}
                  defaultValue={0}
                >
                  <option disabled value={0}>
                    Selecione
                  </option>
                  {farms.data.map((farm, index) => {
                    return (
                      <option key={index} value={farm.id}>
                        {farm.name}
                      </option>
                    )
                  })}
                </Select>
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
