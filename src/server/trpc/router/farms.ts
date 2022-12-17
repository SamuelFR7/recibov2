import { z } from 'zod'
import { protectedProcedure, router } from '@/server/trpc/trpc'
import { prisma } from '@/server/db/prisma'

export const farmsReceipts = router({
  getAll: protectedProcedure.query(async () => {
    const allFarms = await prisma.farm.findMany({})

    return allFarms
  }),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const farm = await prisma.farm.findUnique({
        where: {
          id: input.id,
        },
      })

      return farm
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        payerName: z.string().nullable(),
        payerAddress: z.string().nullable(),
        payerDocument: z.string().nullable(),
      }),
    )
    .mutation(async ({ input }) => {
      const newFarm = await prisma.farm.create({
        data: {
          name: input.name.toUpperCase(),
          payerName: input.payerName?.toUpperCase(),
          payerAddress: input.payerAddress?.toUpperCase(),
          payerDocument: input.payerDocument?.toUpperCase(),
        },
      })

      return newFarm
    }),
  edit: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        payerName: z.string().nullable(),
        payerAddress: z.string().nullable(),
        payerDocument: z.string().nullable(),
      }),
    )
    .mutation(async ({ input }) => {
      const editedFarm = await prisma.farm.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name.toUpperCase(),
          payerName: input.payerName?.toUpperCase(),
          payerAddress: input.payerAddress?.toUpperCase(),
          payerDocument: input.payerDocument?.toUpperCase(),
        },
      })

      return editedFarm
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const deletedFarm = await prisma.farm.delete({
        where: {
          id: input.id,
        },
      })

      return deletedFarm
    }),
})
