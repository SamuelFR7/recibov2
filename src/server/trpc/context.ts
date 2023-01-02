import { Session } from '@supabase/supabase-js'
import { type inferAsyncReturnType } from '@trpc/server'
import { GetServerSidePropsContext } from 'next'
import { getServerAuthSession } from '../common/get-server-auth-session'

type CreateContextOptions = {
  session: Session | null
}

export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
  }
}

export const createContext = async (ctx: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(ctx)

  return await createContextInner({
    session,
  })
}

export type Context = inferAsyncReturnType<typeof createContext>
