import { NextApiRequest, NextApiResponse } from 'next'
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
  res.setHeader('Content-Type', 'application/pdf')

  const pdf = await saveAsPdf()

  return res.send(pdf)
}
