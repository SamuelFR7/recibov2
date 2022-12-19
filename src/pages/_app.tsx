import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { trpc } from '@/utils/trpc'
import { Header } from '@/components/Header'
import { SessionProvider } from 'next-auth/react'
import Head from 'next/head'

function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <title>Recibo</title>
      </Head>
      <Header />
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default trpc.withTRPC(App)
