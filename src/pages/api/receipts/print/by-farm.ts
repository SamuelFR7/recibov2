import { saveAsPdf } from '@/utils/saveAsPdf'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query

  res.setHeader('Content-Type', 'application/pdf')

  const pdf = await saveAsPdf(
    `http://localhost:3000/receipts/print/by-farm/${id}`,
  )

  return res.send(pdf)
}
