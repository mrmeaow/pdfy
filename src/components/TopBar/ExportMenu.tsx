import { Printer, FileDown } from 'lucide-react'
import DropdownMenu, { MenuItem, MenuSeparator } from '../ui/DropdownMenu'
import { printPdf } from '../../lib/pdf/printPdf'
import { downloadPdf } from '../../lib/pdf/downloadPdf'
import { useDocumentStore } from '../../store/documentStore'
import { useSettingsStore } from '../../store/settingsStore'

export default function ExportMenu() {
  const { documents, currentDocId } = useDocumentStore()
  const { pdfPageSize, pdfMargins } = useSettingsStore()

  const currentDoc = documents.find((d) => d.id === currentDocId)
  const filename = currentDoc?.title?.replace(/[^a-zA-Z0-9-_]/g, '_') || 'document'

  const handleDownloadPdf = () => {
    const previewEl = document.querySelector('.preview-content') as HTMLElement
    if (!previewEl) return
    downloadPdf({
      element: previewEl,
      filename,
      pageSize: pdfPageSize,
      margins: pdfMargins,
    })
  }

  return (
    <DropdownMenu trigger="Export">
      <MenuItem
        icon={<Printer size={14} />}
        label="Print"
        shortcut="Ctrl+P"
        onClick={printPdf}
      />
      <MenuItem
        icon={<FileDown size={14} />}
        label="Download as PDF"
        shortcut="Ctrl+Shift+E"
        onClick={handleDownloadPdf}
      />
      <MenuSeparator />
      <div className="px-3 py-1.5 text-xs text-[var(--text-muted)]">
        Page size: {pdfPageSize}
      </div>
    </DropdownMenu>
  )
}
