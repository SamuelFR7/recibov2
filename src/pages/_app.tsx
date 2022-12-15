import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { trpc } from '@/utils/trpc'
import { Header } from '@/components/Header'
import { useRouter } from 'next/router'

function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  return (
    <>
      {!router.asPath.includes('print') ? <Header /> : null}
      <Component {...pageProps} />
    </>
  )
}

export default trpc.withTRPC(App)
