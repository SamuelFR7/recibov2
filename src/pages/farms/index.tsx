import { useRouter } from 'next/router'
import { trpc } from '@/utils/trpc'

export default function FarmsPage() {
  const utils = trpc.useContext()
  const router = useRouter()
  const farms = trpc.getFarms.useQuery()

  const deleteFarm = trpc.deleteFarm.useMutation({
    onSuccess() {
      utils.getFarms.invalidate()
    },
  })

  function handleDelete(id: string) {
    deleteFarm.mutate({
      id,
    })
  }

  function handleEdit(id: string) {
    router.push(`/farms/edit/${id}`)
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Nome Pagador</th>
            <th>Endereço Pagador</th>
            <th>Editar</th>
            <th>Excluir</th>
          </tr>
        </thead>
        <tbody>
          {!farms.isLoading &&
            farms.data &&
            farms.data.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.payerName}</td>
                <td>{item.payerAddress}</td>
                <td>
                  <button onClick={() => handleEdit(item.id)}>Edit</button>
                </td>
                <td>
                  <button onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}
