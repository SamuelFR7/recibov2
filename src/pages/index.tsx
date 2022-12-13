import { Container } from '@/components/Container'
import { trpc } from '@/utils/trpc'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function HomePage() {
  const router = useRouter()
  const utils = trpc.useContext()
  const [search, setSearch] = useState('')

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
    window.open(`/api/receipts/print/unique?id=${id}`)
  }

  function handleEdit(id: string) {
    router.push(`/receipts/edit/${id}`)
  }

  if (!receipts.data || receipts.isLoading) return <h1>Loading...</h1>

  const filteredReceipts =
    search.length > 0
      ? receipts.data.filter((item) => {
          return item.recipientName.includes(search.toUpperCase())
        })
      : receipts.data

  return (
    <div>
      <Container classNames="pt-[10rem]">
        <div className="bg-white p-5 text-sm flex justify-between shadow-header rounded-t-md">
          <div className="flex">
            <div className="flex items-center mr-5">
              <span>Mostrar</span>
              <select className="bg-white ml-2 pl-4 pr-10 py-2 border border-border rounded-md">
                <option>10</option>
              </select>
            </div>
            <button className="py-3 px-5 bg-primary hover:bg-primaryHover rounded-md text-white font-semibold">
              Adicionar Recibo
            </button>
          </div>
          <div className="flex items-center">
            <span>Pesquisar</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar aqui"
              className={classNames(
                'ml-2 mr-5 px-3 py-2',
                'bg-white border border-border rounded-md',
                'focus:placeholder:px-1 placeholder:duration-200',
                'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary',
              )}
            />
          </div>
        </div>
        <table className="w-full text-sm border border-y-0 border-x-border">
          <thead className="bg-gray border border-y-border border-x-0">
            <tr className="[&_th]:px-5 [&_th]:py-3 text-left">
              <th>Fazenda</th>
              <th>Beneficiario</th>
              <th>Numero</th>
              <th>Valor</th>
              <th className="text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredReceipts.map((item, index) => (
              <tr
                className="[&_td]:px-5 [&_td]:py-3 text-left [&_td]:border [&_td]:border-x-0 [&_td]:border-t-0  [&_td]:border-b-border"
                key={index}
              >
                <td>{item.Farm.name}</td>
                <td>{item.recipientName}</td>
                <td>{item.number}</td>
                <td>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(Number(item.value))}
                </td>
                <td className="text-center">
                  <button onClick={() => handlePrint(item.id)}>Imprimir</button>
                  <button onClick={() => handleEdit(item.id)}>Edit</button>
                  <button onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Container>
    </div>
  )
}
