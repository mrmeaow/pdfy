import { useRef, useEffect, useCallback } from 'react'
import { EditorState } from '@codemirror/state'
import { EditorView, lineNumbers, highlightActiveLine, highlightActiveLineGutter, keymap } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching } from '@codemirror/language'
import { autocompletion } from '@codemirror/autocomplete'
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search'
import { oneDarkHighlightStyle } from '@codemirror/theme-one-dark'
import { lightTheme, darkTheme } from './editorTheme'
import { emojiCompletion } from './emojiCompletion'
import type { Theme } from '../../types/settings'

interface UseCodeMirrorOptions {
  initialValue: string
  onChange: (value: string) => void
  theme: Theme
  fontSize: number
  showLineNumbers: boolean
  wordWrap: boolean
}

export function useCodeMirror({
  initialValue,
  onChange,
  theme,
  fontSize,
  showLineNumbers,
  wordWrap,
}: UseCodeMirrorOptions) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const onChangeRef = useRef(onChange)
  const suppressChangeRef = useRef(false)
  onChangeRef.current = onChange

  useEffect(() => {
    if (!containerRef.current) return

    const extensions = [
      history(),
      bracketMatching(),
      highlightActiveLine(),
      highlightActiveLineGutter(),
      highlightSelectionMatches(),
      markdown({ base: markdownLanguage }),
      autocompletion({
        override: [emojiCompletion],
        icons: false,
      }),
      keymap.of([
        ...defaultKeymap,
        ...historyKeymap,
        ...searchKeymap,
        indentWithTab,
      ]),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          if (suppressChangeRef.current) return
          onChangeRef.current(update.state.doc.toString())
        }
      }),
      EditorView.baseTheme({
        '.cm-content': {
          fontSize: `${fontSize}px`,
        },
        '.cm-gutters': {
          fontSize: `${fontSize - 1}px`,
        },
      }),
    ]

    if (showLineNumbers) {
      extensions.push(lineNumbers())
    }

    if (wordWrap) {
      extensions.push(EditorView.lineWrapping)
    }

    if (theme === 'dark') {
      extensions.push(darkTheme, syntaxHighlighting(oneDarkHighlightStyle))
    } else {
      extensions.push(lightTheme, syntaxHighlighting(defaultHighlightStyle))
    }

    const state = EditorState.create({
      doc: initialValue,
      extensions,
    })

    const view = new EditorView({
      state,
      parent: containerRef.current,
    })

    viewRef.current = view

    return () => {
      view.destroy()
      viewRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, fontSize, showLineNumbers, wordWrap])

  const setValue = useCallback((value: string, silent = true) => {
    const view = viewRef.current
    if (view) {
      suppressChangeRef.current = silent
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: value },
      })
      suppressChangeRef.current = false
    }
  }, [])

  return { containerRef, viewRef, setValue }
}
