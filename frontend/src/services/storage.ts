import { TranslationHistoryItem } from '../types';

const DB_NAME = 'LinguaAI_DB';
const STORE_NAME = 'translations';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('isFavorite', 'isFavorite', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveTranslation(item: TranslationHistoryItem): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(item);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    // Fallback to localStorage if IndexedDB is disabled or fails
    console.warn('IndexedDB failed, falling back to localStorage', err);
    const existing = getLocalHistory();
    const filtered = existing.filter((i) => i.id !== item.id);
    localStorage.setItem(STORE_NAME, JSON.stringify([item, ...filtered]));
  }
}

export async function getAllTranslations(): Promise<TranslationHistoryItem[]> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('timestamp');
    const request = index.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const results: TranslationHistoryItem[] = request.result || [];
        resolve(results.sort((a, b) => b.timestamp - a.timestamp));
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    return getLocalHistory();
  }
}

export async function deleteTranslation(id: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(id);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    const existing = getLocalHistory().filter((i) => i.id !== id);
    localStorage.setItem(STORE_NAME, JSON.stringify(existing));
  }
}

export async function toggleFavorite(id: string): Promise<boolean> {
  const items = await getAllTranslations();
  const target = items.find((i) => i.id === id);
  if (target) {
    target.isFavorite = !target.isFavorite;
    await saveTranslation(target);
    return target.isFavorite;
  }
  return false;
}

export async function clearAllTranslations(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.clear();
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    localStorage.removeItem(STORE_NAME);
  }
}

function getLocalHistory(): TranslationHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORE_NAME);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
