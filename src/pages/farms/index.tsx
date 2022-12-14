import { trpc } from '@/utils/trpc'
import { Container } from '@/components/Container'
import Link from 'next/link'
import { useState } from 'react'
import classnames from 'classnames'
import { Pencil, Trash } from 'phosphor-react'
import { Pagination } from '@/components/Pagination'

export default function FarmsPage() {
  const [page, setPage] = useState(1)
  const [farmsPerPage, setFarmsPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const utils = trpc.useContext()
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

  if (!farms.data || farms.isLoading) return <h1>Loading...</h1>

  const filteredFarms =
    search.length > 0
      ? farms.data.filter((farm) => {
          return farm.payerName?.includes(search.toUpperCase())
        })
      : farms.data.slice((page - 1) * farmsPerPage, page * farmsPerPage)

  return (
    <div>
      <Container classNames="mt-[10rem] shadow-header">
        <div className="bg-white p-5 text-sm flex justify-between rounded-t-md">
          <div className="flex">
            <div className="flex items-center mr-5">
              <span>Mostrar</span>
              <select
                onChange={(e) => setFarmsPerPage(Number(e.target.value))}
                className="bg-white ml-2 pl-4 pr-10 py-2 border border-border rounded-md"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
            </div>
            <Link href="/farms/create">
              <button className="py-3 px-5 bg-primary hover:bg-primaryHover rounded-md text-white font-semibold">
                Adicionar Fazenda
              </button>
            </Link>
          </div>
          <div className="flex items-center">
            <span>Pesquisar</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nome pagador"
              className={classnames(
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
              <th>Nome</th>
              <th>Nome Pagador</th>
              <th>Endereço Pagador</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredFarms.map((item, index) => (
              <tr
                className="[&_td]:px-5 [&_td]:py-3 text-left [&_td]:border [&_td]:border-x-0 [&_td]:border-t-0 [&_td]:last:border-b-0  [&_td]:border-b-border"
                key={index}
              >
                <td>{item.name}</td>
                <td>{item.payerName}</td>
                <td>{item.payerAddress}</td>
                <td>
                  <Link href={`/farms/edit/${item.id}`}>
                    <button>
                      <Pencil className="w-5 h-5" />
                    </button>
                  </Link>
                  <button
                    className="ml-2"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!search ? (
          <Pagination
            onPageChange={setPage}
            totalCountOfRegisters={farms.data.length}
            currentPage={page}
            registersPerPage={farmsPerPage}
          />
        ) : null}
      </Container>
    </div>
  )
}
