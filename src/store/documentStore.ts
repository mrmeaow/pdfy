import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import type { DocumentMeta } from '../types/document'
import { DEFAULT_MARKDOWN } from '../constants/defaultDocument'
import {
  getIndexedDbString,
  indexedDbStorage,
  migrateLegacyLocalStorageToIndexedDb,
  removeIndexedDbString,
  setIndexedDbString,
} from '../lib/storage/indexedDb'

interface DocumentStore {
  currentDocId: string
  markdown: string
  isDirty: boolean
  documents: DocumentMeta[]

  setMarkdown: (md: string) => void
  saveDocument: () => Promise<void>
  loadDocument: (id: string) => Promise<void>
  newDocument: () => Promise<void>
  deleteDocument: (id: string) => Promise<void>
  renameDocument: (id: string, title: string) => void
  downloadMarkdown: () => void
}

async function loadDocContentOrDefault(id: string): Promise<string> {
  const content = await getIndexedDbString(`pdfy-doc:${id}`)
  console.debug('CAUGHT NULL => ', content === null)
  return content === null ? DEFAULT_MARKDOWN : content
}

async function saveDocContent(id: string, markdown: string): Promise<void> {
  await setIndexedDbString(`pdfy-doc:${id}`, markdown)
}

async function deleteDocContent(id: string): Promise<void> {
  await removeIndexedDbString(`pdfy-doc:${id}`)
}

const initialId = nanoid()

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set, get) => ({
      currentDocId: initialId,
      markdown: DEFAULT_MARKDOWN,
      isDirty: false,
      documents: [
        {
          id: initialId,
          title: 'Welcome',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ],

      setMarkdown: (markdown) => set({ markdown, isDirty: true }),

      saveDocument: async () => {
        const { currentDocId, markdown, documents } = get()
        await saveDocContent(currentDocId, markdown)
        set({
          isDirty: false,
          documents: documents.map((d) =>
            d.id === currentDocId ? { ...d, updatedAt: Date.now() } : d
          ),
        })
      },

      loadDocument: async (id) => {
        const { currentDocId, markdown, isDirty, documents } = get()
        if (isDirty) {
          await saveDocContent(currentDocId, markdown)
          set({
            documents: documents.map((d) =>
              d.id === currentDocId ? { ...d, updatedAt: Date.now() } : d
            ),
          })
        }
        const content = await loadDocContentOrDefault(id)
        const doc = documents.find((d) => d.id === id)
        if (doc) {
          set({
            currentDocId: id,
            markdown: content,
            isDirty: false,
          })
        }
      },

      newDocument: async () => {
        const { currentDocId, markdown, isDirty, documents } = get()
        if (isDirty) {
          await saveDocContent(currentDocId, markdown)
        }
        const id = nanoid()
        const meta: DocumentMeta = {
          id,
          title: 'Untitled',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        await saveDocContent(id, '')
        set({
          currentDocId: id,
          markdown: '',
          isDirty: false,
          documents: [...documents, meta],
        })
      },

      deleteDocument: async (id) => {
        const { documents, currentDocId } = get()
        const remaining = documents.filter((d) => d.id !== id)
        await deleteDocContent(id)
        if (id === currentDocId && remaining.length > 0) {
          const next = remaining[0]
          const content = await loadDocContentOrDefault(next.id)
          set({
            documents: remaining,
            currentDocId: next.id,
            markdown: content,
            isDirty: false,
          })
        } else if (remaining.length === 0) {
          const newId = nanoid()
          const meta: DocumentMeta = {
            id: newId,
            title: 'Untitled',
            createdAt: Date.now(),
            updatedAt: Date.now(),
          }
          set({
            documents: [meta],
            currentDocId: newId,
            markdown: '',
            isDirty: false,
          })
        } else {
          set({ documents: remaining })
        }
      },

      renameDocument: (id, title) => {
        set({
          documents: get().documents.map((d) =>
            d.id === id ? { ...d, title } : d
          ),
        })
      },

      downloadMarkdown: () => {
        const { markdown, documents, currentDocId } = get()
        const doc = documents.find((d) => d.id === currentDocId)
        const name = (doc?.title || 'document').replace(/[^a-zA-Z0-9-_]/g, '_')
        const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${name}.md`
        a.click()
        URL.revokeObjectURL(url)
      },
    }),
    {
      name: 'pdfy-documents',
      storage: createJSONStorage(() => indexedDbStorage),
      partialize: (state) => ({
        currentDocId: state.currentDocId,
        documents: state.documents,
      }),
    }
  )
)

// On store rehydrate, load the document content from separate localStorage key
const unsub = useDocumentStore.persist.onFinishHydration(async (state) => {
  const content = await loadDocContentOrDefault(state.currentDocId)
  useDocumentStore.setState({ markdown: content, isDirty: false })
  unsub()
})

void migrateLegacyLocalStorageToIndexedDb()
