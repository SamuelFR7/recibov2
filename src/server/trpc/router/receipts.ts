import { z } from 'zod'
import { protectedProcedure, router } from '@/server/trpc/trpc'
import { prisma } from '@/server/db/prisma'

export const receiptsRouter = router({
  getAll: protectedProcedure.query(async () => {
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
  create: protectedProcedure
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
  edit: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        date: z.string().transform((arg) => new Date(arg)),
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
  delete: protectedProcedure
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
})
