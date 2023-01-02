import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { useSession } from '@supabase/auth-helpers-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { SignOut } from 'phosphor-react'
import { Container } from './Container'
import { NavItem } from './NavItem'

export function Header() {
  const router = useRouter()
  const session = useSession()
  const supabase = createBrowserSupabaseClient()

  async function handleSignOut() {
    await supabase.auth.signOut()

    router.push('/login')
  }

  return (
    <header className="w-full bg-primary">
      <Container classNames="flex h-[var(--header-height)] items-center">
        <Link href="/">
          <h1 className="text-md text-white font-bold">Recibo</h1>
        </Link>

        {session && (
          <>
            <nav className="flex ml-auto items-center gap-5">
              <NavItem href="/" title="Recibos" />
              <NavItem href="/farms" title="Fazendas" />
            </nav>
            <button
              onClick={handleSignOut}
              className="ml-auto flex items-center text-white hover:text-text text-sm gap-3 font-semibold"
            >
              <SignOut weight="bold" className="w-5 h-5" />
              <span>Sair</span>
            </button>
          </>
        )}
      </Container>
    </header>
  )
}
