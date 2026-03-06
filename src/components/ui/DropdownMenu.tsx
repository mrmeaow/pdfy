import { useState, useRef, useEffect } from 'react'

interface DropdownMenuProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: 'left' | 'right'
}

export default function DropdownMenu({ trigger, children, align = 'left' }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2.5 py-1 text-sm rounded-md transition-colors
          text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-menu-hover)]"
      >
        {trigger}
      </button>
      {open && (
        <div
          className={`absolute top-full mt-1 z-50 min-w-[200px] py-1 rounded-lg border
            border-[var(--border-color)] bg-[var(--bg-menu)] shadow-lg
            ${align === 'right' ? 'right-0' : 'left-0'}`}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  )
}

interface MenuItemProps {
  icon?: React.ReactNode
  label: string
  shortcut?: string
  onClick?: () => void
  danger?: boolean
  disabled?: boolean
}

export function MenuItem({ icon, label, shortcut, onClick, danger, disabled }: MenuItemProps) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-sm text-left transition-colors
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        ${danger
          ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
          : 'text-[var(--text-primary)] hover:bg-[var(--bg-menu-hover)]'
        }`}
    >
      {icon && <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center">{icon}</span>}
      <span className="flex-1">{label}</span>
      {shortcut && (
        <span className="text-xs text-[var(--text-muted)] ml-4">{shortcut}</span>
      )}
    </button>
  )
}

export function MenuSeparator() {
  return <div className="my-1 border-t border-[var(--border-color)]" />
}
