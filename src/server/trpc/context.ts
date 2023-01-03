import { Session } from '@supabase/supabase-js'
import { type inferAsyncReturnType } from '@trpc/server'
import { CreateNextContextOptions } from '@trpc/server/adapters/next'
import { getServerAuthSession } from '../common/get-server-auth-session'

type CreateContextOptions = {
  session: Session | null
}

export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
  }
}

export const createContext = async (ctx: CreateNextContextOptions) => {
  const session = await getServerAuthSession({
    req: ctx.req,
    res: ctx.res,
    query: {},
    resolvedUrl: '/',
  })

  return await createContextInner({
    session,
  })
}

export type Context = inferAsyncReturnType<typeof createContext>
