import { useEffect, useCallback } from 'react'
import { useCodeMirror } from './useCodeMirror'
import { useSettingsStore } from '../../store/settingsStore'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const { theme, editorFontSize, showLineNumbers, wordWrap } = useSettingsStore()

  const handleChange = useCallback(
    (newValue: string) => {
      onChange(newValue)
    },
    [onChange]
  )

  const { containerRef, setValue } = useCodeMirror({
    initialValue: value,
    onChange: handleChange,
    theme,
    fontSize: editorFontSize,
    showLineNumbers,
    wordWrap,
  })

  useEffect(() => {
    setValue(value, true)
  }, [value, setValue])

  return (
    <div
      ref={containerRef}
      className="h-full overflow-hidden"
      style={{ backgroundColor: 'var(--bg-editor)' }}
    />
  )
}
