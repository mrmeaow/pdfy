import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Settings, Theme, PageSize } from '../types/settings'
import { indexedDbStorage, migrateLegacyLocalStorageToIndexedDb } from '../lib/storage/indexedDb'

interface SettingsStore extends Settings {
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  setEditorFontSize: (size: number) => void
  setPreviewFontSize: (size: number) => void
  setShowLineNumbers: (show: boolean) => void
  setWordWrap: (wrap: boolean) => void
  setPdfPageSize: (size: PageSize) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: 'light',
      editorFontSize: 14,
      previewFontSize: 16,
      showLineNumbers: true,
      wordWrap: true,
      pdfPageSize: 'A4',
      pdfMargins: { top: 10, right: 10, bottom: 10, left: 10 },

      setTheme: (theme) => {
        document.documentElement.setAttribute('data-theme', theme)
        set({ theme })
      },
      toggleTheme: () =>
        set((state) => {
          const next = state.theme === 'light' ? 'dark' : 'light'
          document.documentElement.setAttribute('data-theme', next)
          return { theme: next }
        }),
      setEditorFontSize: (editorFontSize) => set({ editorFontSize }),
      setPreviewFontSize: (previewFontSize) => set({ previewFontSize }),
      setShowLineNumbers: (showLineNumbers) => set({ showLineNumbers }),
      setWordWrap: (wordWrap) => set({ wordWrap }),
      setPdfPageSize: (pdfPageSize) => set({ pdfPageSize }),
    }),
    {
      name: 'pdfy-settings',
      storage: createJSONStorage(() => indexedDbStorage),
    }
  )
)

void migrateLegacyLocalStorageToIndexedDb()
