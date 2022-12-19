import chromium from 'chrome-aws-lambda'
import puppeteer from 'puppeteer'

export const saveAsPdf = async (url: string) => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  })
  const page = await browser.newPage()

  await page.goto(url, {
    waitUntil: 'networkidle0',
  })

  const result = await page.pdf({
    format: 'a4',
    printBackground: true,
  })

  await browser.close()

  return result
}
