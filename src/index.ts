import { html } from './html'
import puppeteer from 'puppeteer'
import express from 'express'

const runServer = async () => {
  const server = express()

  server.get('/pdf/fromhtml', async (request, response) => {
    const pdf = await getPDFFromHTML(html)
    response.type('pdf')
    response.send(pdf)
  })

  server.listen(4000, () => {
    console.log('Start Server')
  })
}

const getPDFFromHTML = async (html: string) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()
  await page.setContent(html)
  await timeout(3)
  const pdf = await page.pdf({ format: 'A4', landscape: true })
  await browser.close()
  return pdf
}

const timeout = (seconds: number) => {
  return new Promise(res => {
    setTimeout(() => {
      res()
    }, seconds * 1000)
  })
}

runServer()
