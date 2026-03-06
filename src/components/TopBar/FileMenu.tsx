import {
  FilePlus,
  FolderOpen,
  Save,
  Download,
  Trash2,
} from 'lucide-react'
import DropdownMenu, { MenuItem, MenuSeparator } from '../ui/DropdownMenu'
import { useDocumentStore } from '../../store/documentStore'

export default function FileMenu() {
  const { documents, currentDocId, newDocument, loadDocument, saveDocument, downloadMarkdown, deleteDocument } =
    useDocumentStore()

  const currentDoc = documents.find((d) => d.id === currentDocId)

  return (
    <DropdownMenu trigger="File">
      <MenuItem
        icon={<FilePlus size={14} />}
        label="New Document"
        shortcut="Ctrl+N"
        onClick={newDocument}
      />
      <MenuItem
        icon={<Save size={14} />}
        label="Save"
        shortcut="Ctrl+S"
        onClick={saveDocument}
      />
      <MenuItem
        icon={<Download size={14} />}
        label="Download .md"
        onClick={downloadMarkdown}
      />
      <MenuSeparator />
      {documents.length > 0 && (
        <>
          <div className="px-3 py-1 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
            Documents
          </div>
          {documents.map((doc) => (
            <MenuItem
              key={doc.id}
              icon={<FolderOpen size={14} />}
              label={doc.title + (doc.id === currentDocId ? ' (current)' : '')}
              onClick={() => loadDocument(doc.id)}
            />
          ))}
          <MenuSeparator />
        </>
      )}
      {currentDoc && documents.length > 1 && (
        <MenuItem
          icon={<Trash2 size={14} />}
          label={`Delete "${currentDoc.title}"`}
          onClick={() => deleteDocument(currentDocId)}
          danger
        />
      )}
    </DropdownMenu>
  )
}
