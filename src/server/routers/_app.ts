import { z } from 'zod'
import { procedure, router } from '../trpc'
import { prisma } from '../db/prisma'

export const appRouter = router({
  getReceipts: procedure.query(async () => {
    const allReceipts = await prisma.receipt.findMany({})

    return allReceipts
  }),
  createReceipt: procedure
    .input(
      z.object({
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
        farmId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const newReceipt = await prisma.receipt.create({
        data: {
          number: input.number,
          date: input.date,
          value: input.value,
          historic: input.historic,
          recipientName: input.recipientName,
          recipientAddress: input.recipientAddress,
          recipientDocument: input.recipientDocument,
          payerName: input.payerName,
          payerAddress: input.payerAddress,
          payerDocument: input.payerDocument,
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
    .query(async ({ input }) => {
      const editedReceipt = await prisma.receipt.update({
        where: {
          id: input.id,
        },
        data: {
          number: input.number,
          date: input.date,
          value: input.value,
          historic: input.historic,
          recipientName: input.recipientName,
          recipientAddress: input.recipientAddress,
          recipientDocument: input.recipientDocument,
          payerName: input.payerName,
          payerAddress: input.payerAddress,
          payerDocument: input.payerDocument,
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
    .query(async ({ input }) => {
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
  createFarm: procedure
    .input(
      z.object({
        name: z.string(),
        payerName: z.string().nullable(),
        payerAddress: z.string().nullable(),
        payerDocument: z.string().nullable(),
      }),
    )
    .query(async ({ input }) => {
      const newFarm = await prisma.farm.create({
        data: {
          name: input.name,
          payerName: input.payerName,
          payerAddress: input.payerAddress,
          payerDocument: input.payerDocument,
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
    .query(async ({ input }) => {
      const editedFarm = await prisma.farm.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          payerName: input.payerName,
          payerAddress: input.payerAddress,
          payerDocument: input.payerDocument,
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
    .query(async ({ input }) => {
      const deletedFarm = await prisma.farm.delete({
        where: {
          id: input.id,
        },
      })

      return deletedFarm
    }),
})

export type AppRouter = typeof appRouter
