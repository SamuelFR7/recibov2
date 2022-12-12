import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { useForm, SubmitHandler } from 'react-hook-form'
import { z } from 'zod'
import { trpc } from '@/utils/trpc'

const farmSchema = z.object({
  name: z.string(),
  payerName: z.string().nullable(),
  payerAddress: z.string().nullable(),
  payerDocument: z.string().nullable(),
})

type FarmSchemaType = z.infer<typeof farmSchema>

export default function EditFarm() {
  const router = useRouter()
  const { id } = router.query

  const { register, handleSubmit } = useForm<FarmSchemaType>({
    resolver: zodResolver(farmSchema),
  })

  const farmToEdit = trpc.getFarmById.useQuery({
    id: String(id),
  })

  const mutation = trpc.editFarm.useMutation()

  const handleEditFarm: SubmitHandler<FarmSchemaType> = async (values) => {
    console.log('aqui')
    mutation.mutate({
      id: String(id),
      ...values,
    })

    router.push('/farms')
  }

  if (farmToEdit.isLoading || !farmToEdit.data) return <h1>Loading...</h1>

  return (
    <form
      onSubmit={handleSubmit(handleEditFarm)}
      className="flex flex-col gap-4 [&_input]:bg-slate-200 max-w-xl"
    >
      <input
        type="text"
        placeholder="Nome Fazenda"
        defaultValue={farmToEdit.data.name}
        {...register('name')}
      />
      <input
        type="text"
        defaultValue={String(farmToEdit.data.payerName)}
        placeholder="Nome pagador"
        {...register('payerName')}
      />
      <input
        type="text"
        placeholder="Endereço"
        defaultValue={String(farmToEdit.data.payerAddress)}
        {...register('payerAddress')}
      />
      <input
        type="text"
        defaultValue={String(farmToEdit.data.payerDocument)}
        placeholder="Documento"
        {...register('payerDocument')}
      />
      <button type="submit">Edit</button>
    </form>
  )
}
