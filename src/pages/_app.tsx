import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { trpc } from '@/utils/trpc'
import { Header } from '@/components/Header'
import { useRouter } from 'next/router'
import { SessionProvider } from 'next-auth/react'

function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  return (
    <SessionProvider session={pageProps.session}>
      {!router.asPath.includes('print') ? <Header /> : null}
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default trpc.withTRPC(App)
