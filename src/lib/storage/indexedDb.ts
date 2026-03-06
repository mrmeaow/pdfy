import type { StateStorage } from 'zustand/middleware'

const DB_NAME = 'pdfy-db'
const STORE_NAME = 'kv'
let dbPromise: Promise<IDBDatabase> | null = null

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('Failed to open IndexedDB'))
  })

  return dbPromise
}

async function getFromDb(key: string): Promise<string | null> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const request = store.get(key)

    request.onsuccess = () => {
      const value = request.result
      resolve(typeof value === 'string' ? value : null)
    }
    request.onerror = () => reject(request.error ?? new Error(`Failed to read key: ${key}`))
  })
}

async function setInDb(key: string, value: string): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.put(value, key)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error ?? new Error(`Failed to write key: ${key}`))
  })
}

async function removeFromDb(key: string): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.delete(key)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error ?? new Error(`Failed to delete key: ${key}`))
  })
}

export const indexedDbStorage: StateStorage = {
  getItem: (name) => getFromDb(name),
  setItem: (name, value) => setInDb(name, value),
  removeItem: (name) => removeFromDb(name),
}

export async function getIndexedDbString(key: string): Promise<string | null> {
  return getFromDb(key)
}

export async function setIndexedDbString(key: string, value: string): Promise<void> {
  await setInDb(key, value)
}

export async function removeIndexedDbString(key: string): Promise<void> {
  await removeFromDb(key)
}

let migrationPromise: Promise<void> | null = null

export function migrateLegacyLocalStorageToIndexedDb(): Promise<void> {
  if (migrationPromise) return migrationPromise

  migrationPromise = (async () => {
    const keys = Object.keys(localStorage).filter(
      (k) => k === 'pdfy-documents' || k === 'pdfy-settings' || k.startsWith('pdfy-doc:')
    )

    await Promise.all(
      keys.map(async (key) => {
        const value = localStorage.getItem(key)
        if (value === null) return
        const existing = await getFromDb(key)
        if (existing === null) {
          await setInDb(key, value)
        }
      })
    )
  })()

  return migrationPromise
}
