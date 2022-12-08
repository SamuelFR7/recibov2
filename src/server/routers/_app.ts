import { z } from 'zod'
import { procedure, router } from '../trpc'
import { prisma } from '../db/prisma'

export const appRouter = router({
  getReceipts: procedure.query(async () => {
    const allReceipts = await prisma.receipt.findMany({
      include: {
        Farm: {
          select: {
            name: true,
          },
        },
      },
    })

    return allReceipts
  }),
  createReceipt: procedure
    .input(
      z.object({
        date: z.string().transform((arg) => new Date(arg)),
        value: z.number(),
        historic: z.string().nullable(),
        recipientName: z.string(),
        recipientAddress: z.string().nullable(),
        recipientDocument: z.string().nullable(),
        payerName: z.string().nullable(),
        payerAddress: z.string().nullable(),
        payerDocument: z.string().nullable(),
        farmId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      console.log(input.date)
      const newReceipt = await prisma.receipt.create({
        data: {
          date: input.date,
          value: input.value,
          historic: input.historic?.toUpperCase(),
          recipientName: input.recipientName.toUpperCase(),
          recipientAddress: input.recipientAddress?.toUpperCase(),
          recipientDocument: input.recipientDocument?.toUpperCase(),
          payerName: input.payerName?.toUpperCase(),
          payerAddress: input.payerAddress?.toUpperCase(),
          payerDocument: input.payerDocument?.toUpperCase(),
          farmId: input.farmId,
        },
      })

      return newReceipt
    }),
  editReceipt: procedure
    .input(
      z.object({
        id: z.string(),
        number: z.number(),
        date: z.date(),
        value: z.number(),
        historic: z.string().nullable(),
        recipientName: z.string(),
        recipientAddress: z.string().nullable(),
        recipientDocument: z.string().nullable(),
        payerName: z.string().nullable(),
        payerAddress: z.string().nullable(),
        payerDocument: z.string().nullable(),
      }),
    )
    .mutation(async ({ input }) => {
      const editedReceipt = await prisma.receipt.update({
        where: {
          id: input.id,
        },
        data: {
          number: input.number,
          date: input.date,
          value: input.value,
          historic: input.historic?.toUpperCase(),
          recipientName: input.recipientName.toUpperCase(),
          recipientAddress: input.recipientAddress?.toUpperCase(),
          recipientDocument: input.recipientDocument?.toUpperCase(),
          payerName: input.payerName?.toUpperCase(),
          payerAddress: input.payerAddress?.toUpperCase(),
          payerDocument: input.payerDocument?.toUpperCase(),
        },
      })

      return editedReceipt
    }),
  deleteReceipt: procedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const deletedReceipt = await prisma.receipt.delete({
        where: {
          id: input.id,
        },
      })

      return deletedReceipt
    }),
  getFarms: procedure.query(async () => {
    const allFarms = await prisma.farm.findMany({})

    return allFarms
  }),
  getFarmById: procedure
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
  createFarm: procedure
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
  editFarm: procedure
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
  deleteFarm: procedure
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

export type AppRouter = typeof appRouter
