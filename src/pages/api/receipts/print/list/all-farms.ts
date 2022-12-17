import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import puppeteer from 'puppeteer'

const saveAsPdf = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.goto('http://localhost:3000/receipts/print/list/all-farms', {
    waitUntil: 'networkidle0',
  })

  const result = await page.pdf({
    format: 'a4',
    printBackground: true,
  })

  await browser.close()

  return result
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, authOptions)

  if (!session) {
    return res.send({
      message: 'You are not authorized to access this content',
    })
  }

  res.setHeader('Content-Type', 'application/pdf')

  const pdf = await saveAsPdf()

  return res.send(pdf)
}
