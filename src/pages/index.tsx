import { Alert } from '@/components/Alert'
import { Container } from '@/components/Container'
import { Pagination } from '@/components/Pagination'
import { trpc } from '@/utils/trpc'
import classNames from 'classnames'
import Link from 'next/link'
import { Pencil, Printer, Trash } from 'phosphor-react'
import { useState } from 'react'

export default function HomePage() {
  const utils = trpc.useContext()
  const [receiptsPerPage, setReceiptsPerPage] = useState(10)
  const [page, setPage] = useState(1)
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

  if (!receipts.data || receipts.isLoading) return <h1>Loading...</h1>

  const filteredReceipts =
    search.length > 0
      ? receipts.data.filter((item) => {
          return item.recipientName.includes(search.toUpperCase())
        })
      : receipts.data.slice(
          (page - 1) * receiptsPerPage,
          page * receiptsPerPage,
        )

  return (
    <div>
      <Container classNames="mt-[10rem] shadow-header">
        <div className="bg-white p-5 text-sm flex justify-between rounded-t-md">
          <div className="flex">
            <div className="flex items-center mr-5">
              <span>Mostrar</span>
              <select
                onChange={(e) => setReceiptsPerPage(Number(e.target.value))}
                className="bg-white ml-2 pl-4 pr-10 py-2 border border-border rounded-md"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
            </div>
            <Link href="/receipts/create">
              <button className="py-3 px-5 bg-primary hover:bg-primaryHover rounded-md text-white font-semibold">
                Adicionar Recibo
              </button>
            </Link>
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
        <table className="w-full text-sm">
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
                className="[&_td]:px-5 [&_td]:py-3 text-left [&_td]:border [&_td]:border-x-0 [&_td]:border-t-0 [&_td]:last:border-b-0  [&_td]:border-b-border"
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
                <td className="flex justify-center gap-3">
                  <button onClick={() => handlePrint(item.id)}>
                    <Printer className="w-5 h-5" />
                  </button>
                  <Link href={`/receipts/edit/${item.id}`}>
                    <button>
                      <Pencil className="w-5 h-5" />
                    </button>
                  </Link>
                  <Alert action={() => handleDelete(item.id)}>
                    <button>
                      <Trash className="w-5 h-5" />
                    </button>
                  </Alert>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!search ? (
          <Pagination
            onPageChange={setPage}
            totalCountOfRegisters={receipts.data.length}
            currentPage={page}
            registersPerPage={receiptsPerPage}
          />
        ) : null}
      </Container>
    </div>
  )
}
