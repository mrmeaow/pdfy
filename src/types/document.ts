export interface DocumentMeta {
  id: string
  title: string
  createdAt: number
  updatedAt: number
}

export interface Document extends DocumentMeta {
  markdown: string
}
