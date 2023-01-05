import { trpc } from '@/utils/trpc'
import { Container } from '@/components/Container'
import Link from 'next/link'
import { useState } from 'react'
import { Pencil, Trash } from 'phosphor-react'
import { Pagination } from '@/components/Pagination'
import { Alert } from '@/components/Alert'
import { Input } from '@/components/Form/Input'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { getServerAuthSession } from '@/server/common/get-server-auth-session'
import { Button } from '@/components/Button'

export default function FarmsPage() {
  const [page, setPage] = useState(1)
  const [farmsPerPage, setFarmsPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const utils = trpc.useContext()
  const farms = trpc.farms.getAll.useQuery()

  const deleteFarm = trpc.farms.delete.useMutation({
    onSuccess() {
      utils.farms.getAll.invalidate()
    },
  })

  function handleDelete(id: string) {
    deleteFarm.mutate({
      id,
    })
  }

  if (!farms.data || farms.isLoading)
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <img src="/loader.svg" alt="Loader" />
      </div>
    )

  const filteredFarms =
    search.length > 0
      ? farms.data.filter((farm) => {
          return farm.name.includes(search.toUpperCase())
        })
      : farms.data.slice((page - 1) * farmsPerPage, page * farmsPerPage)

  return (
    <div>
      <Container classNames="mt-[8rem] shadow-header mb-8">
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
            <div className="flex items-center">
              <Input
                label=""
                name="Search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar"
              />
            </div>
          </div>
          <Link href="/farms/create">
            <Button type="button" size="medium">
              Adicionar Fazenda
            </Button>
          </Link>
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
                  <Alert action={() => handleDelete(item.id)}>
                    <button className="ml-2">
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
            totalCountOfRegisters={farms.data.length}
            currentPage={page}
            registersPerPage={farmsPerPage}
          />
        ) : null}
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
        destination: '/auth/signin',
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
