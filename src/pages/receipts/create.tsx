import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { trpc } from '../../utils/trpc'
import { useRouter } from 'next/router'

const receiptSchema = z.object({
  date: z.string(),
  value: z.string().transform((arg) => Number(arg)),
  historic: z.string().nullable(),
  recipientName: z.string(),
  recipientAddress: z.string().nullable(),
  recipientDocument: z.string().nullable(),
  payerName: z.string().nullable(),
  payerAddress: z.string().nullable(),
  payerDocument: z.string().nullable(),
  farmId: z.string(),
})

type ReceiptSchemaType = z.infer<typeof receiptSchema>

export default function CreateReceipts() {
  const router = useRouter()
  const { register, handleSubmit } = useForm<ReceiptSchemaType>({
    resolver: zodResolver(receiptSchema),
  })

  const mutation = trpc.createReceipt.useMutation()

  const handleCreateReceipt: SubmitHandler<ReceiptSchemaType> = async (
    values,
  ) => {
    mutation.mutate({
      ...values,
    })

    router.push('/')
  }

  return (
    <form
      onSubmit={handleSubmit(handleCreateReceipt)}
      className="flex flex-col gap-4 [&_input]:bg-slate-200 max-w-xl"
    >
      <input {...register('farmId')} placeholder="Fazenda" />
      <input {...register('date')} type="date" placeholder="Data" />
      <input {...register('value')} placeholder="Valor" type="number" />
      <input {...register('historic')} placeholder="Historico" />
      <input {...register('recipientName')} placeholder="Nome recebedor" />
      <input
        {...register('recipientAddress')}
        placeholder="Endereço recebedor"
      />
      <input
        {...register('recipientDocument')}
        placeholder="Documento recebedor"
      />
      <input {...register('payerName')} placeholder="Nome pagador" />
      <input {...register('payerAddress')} placeholder="Endereço pagador" />
      <input {...register('payerDocument')} placeholder="Documento pagador" />
      <button type="submit">Criar</button>
    </form>
  )
}
