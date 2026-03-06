export type Theme = 'light' | 'dark'
export type PageSize = 'A4' | 'Letter' | 'Legal'

export interface PdfMargins {
  top: number
  right: number
  bottom: number
  left: number
}

export interface Settings {
  theme: Theme
  editorFontSize: number
  previewFontSize: number
  showLineNumbers: boolean
  wordWrap: boolean
  pdfPageSize: PageSize
  pdfMargins: PdfMargins
}
