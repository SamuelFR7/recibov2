import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { trpc } from '@/utils/trpc'
import { Header } from '@/components/Header'
import Head from 'next/head'
import { Session, SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/router'

function App({ Component, pageProps }: AppProps<{ initialSession: Session }>) {
  const router = useRouter()
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Head>
        <title>Recibo</title>
      </Head>
      {!router.asPath.startsWith('/auth/') && <Header />}
      <Component {...pageProps} />
    </SessionContextProvider>
  )
}

export default trpc.withTRPC(App)
