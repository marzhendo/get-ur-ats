import ReactPDF from '@react-pdf/renderer'
import fs from 'fs'
import path from 'path'
import { CVDocument } from '../lib/pdf'
import type { CVData } from '../types/cv'

const fixturesPath = path.resolve(__dirname, '../fixtures/cv-multi-page.json')
const fixtures = JSON.parse(fs.readFileSync(fixturesPath, 'utf8'))

const outputDir = path.resolve(__dirname, '../test-output')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

async function run() {
  console.log('Rendering cvOnePage...')
  const pdf1 = path.join(outputDir, 'cv-1page.pdf')
  await ReactPDF.renderToFile(
    CVDocument({ data: fixtures.cvOnePage as CVData, locale: 'en' }),
    pdf1
  )
  console.log('Saved:', pdf1)

  console.log('Rendering cvTwoPage...')
  const pdf2 = path.join(outputDir, 'cv-2page.pdf')
  await ReactPDF.renderToFile(
    CVDocument({ data: fixtures.cvTwoPage as CVData, locale: 'en' }),
    pdf2
  )
  console.log('Saved:', pdf2)

  console.log('Rendering cvThreePage...')
  const pdf3 = path.join(outputDir, 'cv-3page.pdf')
  await ReactPDF.renderToFile(
    CVDocument({ data: fixtures.cvThreePage as CVData, locale: 'en' }),
    pdf3
  )
  console.log('Saved:', pdf3)

  console.log('All 3 PDFs generated successfully!')
}

run().catch((err) => {
  console.error('Failed to render:', err)
  process.exit(1)
})
