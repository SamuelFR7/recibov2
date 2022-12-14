import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { trpc } from '@/utils/trpc'
import { Header } from '@/components/Header'

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  )
}

export default trpc.withTRPC(App)
