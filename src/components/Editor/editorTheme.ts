import { EditorView } from '@codemirror/view'

export const lightTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: 'var(--bg-editor)',
      color: 'var(--text-primary)',
      height: '100%',
    },
    '.cm-content': {
      fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", Monaco, "Cascadia Code", monospace',
      caretColor: 'var(--accent-color)',
    },
    '.cm-cursor': {
      borderLeftColor: 'var(--accent-color)',
    },
    '.cm-gutters': {
      backgroundColor: 'var(--bg-secondary)',
      color: 'var(--text-muted)',
      borderRight: '1px solid var(--border-color)',
    },
    '.cm-activeLineGutter': {
      backgroundColor: 'transparent',
      color: 'var(--text-primary)',
    },
    '.cm-activeLine': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
    '.cm-selectionBackground': {
      backgroundColor: 'rgba(9, 105, 218, 0.15) !important',
    },
    '.cm-matchingBracket': {
      backgroundColor: 'rgba(9, 105, 218, 0.2)',
      outline: 'none',
    },
    '.cm-searchMatch': {
      backgroundColor: 'rgba(255, 213, 0, 0.4)',
    },
    '.cm-tooltip': {
      backgroundColor: 'var(--bg-menu)',
      border: '1px solid var(--border-color)',
      borderRadius: '6px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
    '.cm-tooltip-autocomplete': {
      '& > ul > li': {
        padding: '4px 8px',
      },
      '& > ul > li[aria-selected]': {
        backgroundColor: 'var(--accent-color)',
        color: '#ffffff',
      },
    },
    '.cm-scroller': {
      overflow: 'auto',
    },
  },
  { dark: false }
)

export const darkTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: 'var(--bg-editor)',
      color: 'var(--text-primary)',
      height: '100%',
    },
    '.cm-content': {
      fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", Monaco, "Cascadia Code", monospace',
      caretColor: 'var(--accent-color)',
    },
    '.cm-cursor': {
      borderLeftColor: 'var(--accent-color)',
    },
    '.cm-gutters': {
      backgroundColor: 'var(--bg-secondary)',
      color: 'var(--text-muted)',
      borderRight: '1px solid var(--border-color)',
    },
    '.cm-activeLineGutter': {
      backgroundColor: 'transparent',
      color: 'var(--text-primary)',
    },
    '.cm-activeLine': {
      backgroundColor: 'rgba(255, 255, 255, 0.04)',
    },
    '.cm-selectionBackground': {
      backgroundColor: 'rgba(88, 166, 255, 0.2) !important',
    },
    '.cm-matchingBracket': {
      backgroundColor: 'rgba(88, 166, 255, 0.25)',
      outline: 'none',
    },
    '.cm-searchMatch': {
      backgroundColor: 'rgba(255, 213, 0, 0.25)',
    },
    '.cm-tooltip': {
      backgroundColor: 'var(--bg-menu)',
      border: '1px solid var(--border-color)',
      borderRadius: '6px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    },
    '.cm-tooltip-autocomplete': {
      '& > ul > li': {
        padding: '4px 8px',
      },
      '& > ul > li[aria-selected]': {
        backgroundColor: 'var(--accent-color)',
        color: '#ffffff',
      },
    },
    '.cm-scroller': {
      overflow: 'auto',
    },
  },
  { dark: true }
)
