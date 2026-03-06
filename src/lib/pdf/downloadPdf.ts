import type { PageSize, PdfMargins } from '../../types/settings'
import * as html2pdf from 'html2pdf.js'

interface DownloadPdfOptions {
  element: HTMLElement
  filename: string
  pageSize: PageSize
  margins: PdfMargins
}

const PAGE_FORMATS: Record<PageSize, [number, number]> = {
  A4: [210, 297],
  Letter: [215.9, 279.4],
  Legal: [215.9, 355.6],
}

export async function downloadPdf({ element, filename, pageSize, margins }: DownloadPdfOptions) {
  const [width, height] = PAGE_FORMATS[pageSize]
  const printableWidthMm = width - margins.left - margins.right
  const printableWidthPx = `${Math.floor(printableWidthMm * 3.7795275591)}px`

  const opt = {
    margin: [margins.top, margins.right, margins.bottom, margins.left],
    filename: `${filename}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      letterRendering: true,
    },
    jsPDF: {
      unit: 'mm',
      format: [width, height],
      orientation: 'portrait' as const,
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  }

  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.left = '-99999px'
  container.style.top = '0'
  container.style.width = printableWidthPx
  container.style.background = '#fff'
  container.style.padding = '0'
  container.style.margin = '0'

  const clone = element.cloneNode(true) as HTMLElement
  clone.style.margin = '0'
  clone.style.maxWidth = 'none'
  clone.style.width = '100%'
  clone.style.padding = '0'
  clone.style.boxSizing = 'border-box'

  container.appendChild(clone)
  document.body.appendChild(container)

  try {
    await html2pdf.default().set(opt as any).from(clone).save()
  } finally {
    container.remove()
  }
}
