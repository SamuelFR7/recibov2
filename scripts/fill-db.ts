import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

interface IFarm {
  id: number
  nome: string
  pagadorNome: string
  pagadorEndereco: string
  pagadorDocumento: string
}

interface IReceipt {
  id: number
  fazenda: IFarm
  numero: number
  data: Date
  valor: number
  historico: string
  beneficiarioNome: string
  beneficiarioEndereco: string
  beneficiarioDocumento: string
  pagadorNome: string
  pagadorEndereco: string
  pagadorDocumento: string
}

interface IReceiptsRequest {
  pageNumber: number
  pageSize: number
  firstPage: string
  lastPage: string
  totalPages: number
  totalRecords: 5
  nextPage: null
  previousPage: null
  data: IReceipt[]
}

async function fillDb() {
  const farms = await fetch(`${process.env.FILLDB_API}/api/fazenda`)
    .then((res) => res.json())
    .then((data: IFarm[]) => data)

  const farmSchema = z.object({
    name: z.string(),
    payerName: z.string().nullish(),
    payerDocument: z.string().nullish(),
    payerAddress: z.string().nullish(),
  })

  const farmsInEnglish = farms.map((item) => {
    return {
      name: item.nome,
      payerName: item.pagadorNome,
      payerAddress: item.pagadorEndereco,
      payerDocument: item.pagadorDocumento,
    }
  })

  const parsedFarms = farmsInEnglish.map((item) => {
    return farmSchema.parse(item)
  })

  parsedFarms.map(async (item) => {
    await prisma.farm.create({
      data: item,
    })
  })

  for (let i = 1; i <= 75; i++) {
    const receipts: IReceiptsRequest = await fetch(
      `${process.env.FILLDB_API}/api/recibo?PageNumber=${i}`,
    ).then((res) => res.json())

    const receiptsInEnglish = receipts.data.map((item) => {
      return {
        date: item.data,
        value: item.valor,
        historic: item.historico,
        recipientName: item.beneficiarioNome,
        recipientAddress: item.beneficiarioEndereco,
        recipientDocument: item.beneficiarioDocumento,
        payerName: item.pagadorNome,
        payerAddress: item.pagadorEndereco,
        payerDocument: item.pagadorDocumento,
        farmName: item.fazenda.nome,
      }
    })

    const receiptSchema = z.object({
      date: z.string().transform((arg) => new Date(arg)),
      value: z.number(),
      historic: z.string().nullable(),
      recipientName: z.string(),
      recipientAddress: z.string().nullable(),
      recipientDocument: z.string().nullable(),
      payerName: z.string().nullable(),
      payerAddress: z.string().nullable(),
      payerDocument: z.string().nullable(),
      farmName: z.string(),
    })

    const receiptsParsed = receiptsInEnglish.map((item) => {
      return receiptSchema.parse(item)
    })

    receiptsParsed.map(async (item) => {
      await prisma.receipt.create({
        data: {
          date: item.date,
          recipientName: item.recipientName,
          value: item.value,
          historic: item.historic,
          payerAddress: item.payerAddress,
          payerDocument: item.payerDocument,
          payerName: item.payerName,
          recipientAddress: item.recipientAddress,
          recipientDocument: item.recipientDocument,
          Farm: {
            connect: {
              name: item.farmName,
            },
          },
        },
      })
    })
  }
}

fillDb()
