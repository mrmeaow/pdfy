import { useRef } from 'react'
import { useMermaid } from './useMermaid'
import { useSettingsStore } from '../../store/settingsStore'

interface MarkdownPreviewProps {
  html: string
}

export default function MarkdownPreview({ html }: MarkdownPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null)
  const { theme, previewFontSize } = useSettingsStore()

  useMermaid(previewRef, html, theme)

  return (
    <div
      className="h-full overflow-auto"
      style={{ backgroundColor: 'var(--bg-preview)' }}
    >
      <div
        ref={previewRef}
        className="preview-content max-w-none p-6 lg:p-10"
        style={{ fontSize: `${previewFontSize}px` }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
