import { trpc } from '../utils/trpc'

export default function HomePage() {
  const utils = trpc.useContext()
  const receipts = trpc.getReceipts.useQuery()
  const deleteMutation = trpc.deleteReceipt.useMutation({
    onSuccess() {
      utils.getReceipts.invalidate()
    },
  })

  function handleDelete(id: string) {
    deleteMutation.mutate({
      id,
    })
  }

  function handlePrint(id: string) {
    window.open(`/api/receipts/print?id=${id}`)
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Fazenda</th>
            <th>Beneficiario</th>
            <th>Numero</th>
            <th>Valor</th>
            <th>Imprimir</th>
            <th>Editar</th>
            <th>Excluir</th>
          </tr>
        </thead>
        <tbody>
          {!receipts.isLoading &&
            receipts.data &&
            receipts.data.map((item, index) => (
              <tr key={index}>
                <td>{item.Farm.name}</td>
                <td>{item.recipientName}</td>
                <td>{item.number}</td>
                <td>{item.value}</td>
                <td>
                  <button onClick={() => handlePrint(item.id)}>Imprimir</button>
                </td>
                <td>
                  <button>Edit</button>
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
