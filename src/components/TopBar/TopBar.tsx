import { FileText, Pencil } from 'lucide-react'
import { useState } from 'react'
import FileMenu from './FileMenu'
import ExportMenu from './ExportMenu'
import SettingsMenu from './SettingsMenu'
import { useDocumentStore } from '../../store/documentStore'

export default function TopBar() {
  const { documents, currentDocId, isDirty, renameDocument } = useDocumentStore()
  const currentDoc = documents.find((d) => d.id === currentDocId)
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState('')

  const startRename = () => {
    setTitle(currentDoc?.title || '')
    setEditing(true)
  }

  const finishRename = () => {
    if (title.trim()) {
      renameDocument(currentDocId, title.trim())
    }
    setEditing(false)
  }

  return (
    <div className="topbar h-11 flex items-center border-b border-[var(--border-color)] bg-[var(--bg-topbar)] px-2 gap-1 select-none shrink-0">
      <div className="flex items-center gap-1.5 mr-3 pl-1">
        <FileText size={18} className="text-[var(--accent-color)]" />
        <span className="font-semibold text-sm text-[var(--text-primary)]">PDFy</span>
      </div>

      <FileMenu />
      <ExportMenu />

      <div className="flex-1 flex items-center justify-center gap-1.5 min-w-0">
        {editing ? (
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={finishRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') finishRename()
              if (e.key === 'Escape') setEditing(false)
            }}
            className="text-sm text-center bg-transparent border-b border-[var(--accent-color)] outline-none text-[var(--text-primary)] w-48"
          />
        ) : (
          <button
            onClick={startRename}
            className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <span className="truncate max-w-[200px]">{currentDoc?.title || 'Untitled'}</span>
            {isDirty && <span className="text-[var(--accent-color)]" title="Unsaved changes">*</span>}
            <Pencil size={12} className="opacity-40" />
          </button>
        )}
      </div>

      <SettingsMenu />
    </div>
  )
}
