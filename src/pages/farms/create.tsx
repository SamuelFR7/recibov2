import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { useForm, SubmitHandler } from 'react-hook-form'
import { z } from 'zod'
import { trpc } from '../../utils/trpc'

const farmSchema = z.object({
  name: z.string(),
  payerName: z.string().nullable(),
  payerAddress: z.string().nullable(),
  payerDocument: z.string().nullable(),
})

type FarmSchemaType = z.infer<typeof farmSchema>

export default function NewFarm() {
  const router = useRouter()
  const { register, handleSubmit } = useForm<FarmSchemaType>({
    resolver: zodResolver(farmSchema),
  })

  const mutation = trpc.createFarm.useMutation()

  const handleCreateFarm: SubmitHandler<FarmSchemaType> = async (values) => {
    mutation.mutate({
      ...values,
    })

    router.push('/farms')
  }

  return (
    <form
      onSubmit={handleSubmit(handleCreateFarm)}
      className="flex flex-col gap-4 [&_input]:bg-slate-200 max-w-xl"
    >
      <input type="text" placeholder="Nome Fazenda" {...register('name')} />
      <input
        type="text"
        placeholder="Nome pagador"
        {...register('payerName')}
      />
      <input type="text" placeholder="Endereço" {...register('payerAddress')} />
      <input
        type="text"
        placeholder="Documento"
        {...register('payerDocument')}
      />
      <button type="submit">Criar</button>
    </form>
  )
}
