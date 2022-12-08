import { trpc } from '../utils/trpc'

export default function HomePage() {
  const { data } = trpc.hello.useQuery({
    text: 'Samuel',
  })

  return <h1 className="text-2xl">{data?.greeting}</h1>
}
