import puppeteer from 'puppeteer'
import htmlToDocx from 'html-to-docx'
import { generateResumeHtml } from '../utils/resumeHtml.js'

const FALLBACK_TEMPLATE = 'classic'
const FALLBACK_ACCENT = '#3FA9F5'
const DOCX_CONTENT_TYPE =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

const slugify = (value, fallback) => {
  const base = String(value || '').trim().toLowerCase()
  const slug = base
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
  return slug || fallback
}

const ensureResume = (payload) => {
  if (!payload || typeof payload !== 'object') {
    const error = new Error('Missing required fields: resume object')
    error.status = 400
    throw error
  }
}

const resolveTemplate = (resume, template) =>
  String(template || resume?.template || FALLBACK_TEMPLATE)

const resolveAccent = (resume, accentColor) =>
  String(accentColor || resume?.accent_color || FALLBACK_ACCENT)

const buildFilename = (resume, templateName, extension) => {
  const base = slugify(resume?.title, 'resume')
  const variant = slugify(templateName, FALLBACK_TEMPLATE)
  return `${base}_${variant}.${extension}`
}

const launchBrowser = async () => {
  try {
    return await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath:
        process.env.CHROMIUM_PATH || process.env.PUPPETEER_EXECUTABLE_PATH,
    })
  } catch (err) {
    try {
      return await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      })
    } catch (inner) {
      const error = new Error('PUPPETEER_UNAVAILABLE')
      error.status = 503
      throw error
    }
  }
}

export const exportDocx = async (req, res) => {
  try {
    const { resume, template, accentColor, margin, padding } = req.body || {}
    ensureResume(resume)

    const templateName = resolveTemplate(resume, template)
    const accent = resolveAccent(resume, accentColor)
    const html = generateResumeHtml(resume, templateName, accent, padding)
    const buffer = await htmlToDocx(html, null, {
      table: { row: { cantSplit: true } },
      footer: false,
      pageNumber: false,
      margins: {
        top: margin || 720,
        right: margin || 720,
        bottom: margin || 720,
        left: margin || 720,
      }
    })

    const filename = buildFilename(resume, templateName, 'docx')

    res.setHeader('Content-Type', DOCX_CONTENT_TYPE)
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${filename}"`
    )
    return res.send(Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer))
  } catch (err) {
    const status = err.status || 500
    return res.status(status).json({ message: err.message })
  }
}

export const exportPdf = async (req, res) => {
  let browser
  try {
    const { resume, template, accentColor, margin, padding } = req.body || {}
    ensureResume(resume)

    const templateName = resolveTemplate(resume, template)
    const accent = resolveAccent(resume, accentColor)
    const html = generateResumeHtml(resume, templateName, accent, padding)

    browser = await launchBrowser()
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })
    const pdfBuffer = await page.pdf({
      format: 'Letter',
      printBackground: true,
      margin: {
        top: margin || '0.5in',
        bottom: margin || '0.5in',
        left: margin || '0.5in',
        right: margin || '0.5in',
      },
    })

    const filename = buildFilename(resume, templateName, 'pdf')

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${filename}"`
    )
    return res.send(pdfBuffer)
  } catch (err) {
    const status = err.status || 500
    return res.status(status).json({ message: err.message })
  } finally {
    if (browser) {
      try {
        await browser.close()
      } catch {
        // ignore close errors
      }
    }
  }
}
