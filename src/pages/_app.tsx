import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { trpc } from '@/utils/trpc'
import { Header } from '@/components/Header'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { SessionProvider } from 'next-auth/react'

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter()

  return (
    <SessionProvider session={session}>
      <Head>
        <title>Recibo</title>
      </Head>
      {!router.asPath.startsWith('/auth/') && <Header />}
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default trpc.withTRPC(App)
