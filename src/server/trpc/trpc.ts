import { initTRPC, TRPCError } from '@trpc/server'

import { type Context } from './context'

const t = initTRPC.context<Context>().create()

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return next({
    ctx: {
      session: { ...ctx.session },
    },
  })
})

export const protectedProcedure = t.procedure.use(isAuthed)

export const router = t.router
export const procedure = t.procedure
