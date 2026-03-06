import { useState, useEffect, useCallback, useRef } from 'react'
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels'
import TopBar from './components/TopBar/TopBar'
import MarkdownEditor from './components/Editor/MarkdownEditor'
import MarkdownPreview from './components/Preview/MarkdownPreview'
import { processMarkdown } from './lib/markdown/processor'
import { useDocumentStore } from './store/documentStore'
import { useSettingsStore } from './store/settingsStore'
import { printPdf } from './lib/pdf/printPdf'
import { downloadPdf } from './lib/pdf/downloadPdf'
import './styles/preview.css'
import './styles/callouts.css'
import './styles/code-highlight.css'
import './styles/mermaid.css'
import './styles/print.css'

export default function App() {
  const { markdown, setMarkdown, saveDocument, currentDocId, documents } = useDocumentStore()
  const { theme, pdfPageSize, pdfMargins } = useSettingsStore()
  const [renderedHTML, setRenderedHTML] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  // Apply theme on mount and when it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Process markdown with debounce
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const html = await processMarkdown(markdown)
        setRenderedHTML(html)
      } catch (err) {
        console.error('Markdown processing error:', err)
      }
    }, 150)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [markdown])

  // Debounced auto-save to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      saveDocument()
    }, 300)
    return () => clearTimeout(timer)
  }, [markdown, saveDocument])

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey

      if (ctrl && e.key === 's') {
        e.preventDefault()
        saveDocument()
      }

      if (ctrl && e.key === 'p') {
        e.preventDefault()
        printPdf()
      }

      if (ctrl && e.shiftKey && e.key === 'E') {
        e.preventDefault()
        const previewEl = document.querySelector('.preview-content') as HTMLElement
        if (!previewEl) return
        const currentDoc = documents.find((d) => d.id === currentDocId)
        const filename = currentDoc?.title?.replace(/[^a-zA-Z0-9-_]/g, '_') || 'document'
        downloadPdf({ element: previewEl, filename, pageSize: pdfPageSize, margins: pdfMargins })
      }

      if (ctrl && e.key === 'n') {
        e.preventDefault()
        useDocumentStore.getState().newDocument()
      }
    },
    [saveDocument, currentDocId, documents, pdfPageSize, pdfMargins]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="h-full flex flex-col">
      <TopBar />
      <PanelGroup orientation="horizontal" className="flex-1">
        <Panel defaultSize={50} minSize={25} className="editor-pane">
          <MarkdownEditor
            value={markdown}
            onChange={setMarkdown}
          />
        </Panel>
        <PanelResizeHandle className="resize-handle w-[3px] bg-[var(--resize-handle)] hover:bg-[var(--resize-handle-hover)] transition-colors cursor-col-resize" />
        <Panel defaultSize={50} minSize={25} className="preview-pane">
          <MarkdownPreview html={renderedHTML} />
        </Panel>
      </PanelGroup>
    </div>
  )
}
