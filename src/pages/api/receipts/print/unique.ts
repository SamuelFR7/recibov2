import { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import puppeteer from 'puppeteer'
import { authOptions } from '../../auth/[...nextauth]'
import chrome from 'chrome-aws-lambda'

const saveAsPdf = async (id: string) => {
  const browser = await puppeteer.launch(
    process.env.NODE_ENV === 'production'
      ? {
          args: chrome.args,
          executablePath: await chrome.executablePath,
          headless: chrome.headless,
        }
      : {},
  )
  const page = await browser.newPage()

  await page.goto(`http://localhost:3000/receipts/print/unique/${id}`, {
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

  const { id } = req.query

  res.setHeader('Content-Type', 'application/pdf')

  const pdf = await saveAsPdf(id as string)

  return res.send(pdf)
}
