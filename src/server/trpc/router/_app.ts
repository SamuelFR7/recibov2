import { router } from '@/server/trpc/trpc'
import { receiptsRouter } from './receipts'
import { farmsReceipts } from './farms'

export const appRouter = router({
  receipts: receiptsRouter,
  farms: farmsReceipts,
})

export type AppRouter = typeof appRouter
