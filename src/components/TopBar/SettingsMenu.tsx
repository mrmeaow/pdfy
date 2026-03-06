import {
  Sun,
  Moon,
  Type,
  Hash,
  WrapText,
  FileText,
} from 'lucide-react'
import DropdownMenu, { MenuItem, MenuSeparator } from '../ui/DropdownMenu'
import { useSettingsStore } from '../../store/settingsStore'
import type { PageSize } from '../../types/settings'

export default function SettingsMenu() {
  const {
    theme,
    toggleTheme,
    editorFontSize,
    setEditorFontSize,
    showLineNumbers,
    setShowLineNumbers,
    wordWrap,
    setWordWrap,
    pdfPageSize,
    setPdfPageSize,
  } = useSettingsStore()

  return (
    <DropdownMenu trigger="Settings" align="right">
      <MenuItem
        icon={theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        label={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        onClick={toggleTheme}
      />
      <MenuSeparator />
      <div className="px-3 py-1 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
        Editor
      </div>
      <div className="px-3 py-1.5 flex items-center gap-2 text-sm text-[var(--text-primary)]">
        <Type size={14} className="text-[var(--text-muted)]" />
        <span className="flex-1">Font Size</span>
        <button
          className="w-6 h-6 rounded border border-[var(--border-color)] text-xs hover:bg-[var(--bg-menu-hover)]"
          onClick={(e) => { e.stopPropagation(); setEditorFontSize(Math.max(10, editorFontSize - 1)) }}
        >
          -
        </button>
        <span className="w-6 text-center text-xs">{editorFontSize}</span>
        <button
          className="w-6 h-6 rounded border border-[var(--border-color)] text-xs hover:bg-[var(--bg-menu-hover)]"
          onClick={(e) => { e.stopPropagation(); setEditorFontSize(Math.min(24, editorFontSize + 1)) }}
        >
          +
        </button>
      </div>
      <MenuItem
        icon={<Hash size={14} />}
        label={showLineNumbers ? 'Hide Line Numbers' : 'Show Line Numbers'}
        onClick={() => setShowLineNumbers(!showLineNumbers)}
      />
      <MenuItem
        icon={<WrapText size={14} />}
        label={wordWrap ? 'Disable Word Wrap' : 'Enable Word Wrap'}
        onClick={() => setWordWrap(!wordWrap)}
      />
      <MenuSeparator />
      <div className="px-3 py-1 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
        PDF Page Size
      </div>
      {(['A4', 'Letter', 'Legal'] as PageSize[]).map((size) => (
        <MenuItem
          key={size}
          icon={<FileText size={14} />}
          label={`${size}${pdfPageSize === size ? ' (active)' : ''}`}
          onClick={() => setPdfPageSize(size)}
        />
      ))}
    </DropdownMenu>
  )
}
