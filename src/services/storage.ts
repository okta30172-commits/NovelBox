import { Novel, Bookmark } from '../types/novel';
import { SAMPLE_NOVELS } from '../data/sampleNovels';
import { generateNovelPdfBlob } from './pdfGenerator';

const DB_NAME = 'novea_digital_library_db';
const DB_VERSION = 1;

const STORES = {
  NOVELS: 'novels',
  BLOBS: 'blobs',
  BOOKMARKS: 'bookmarks',
  SETTINGS: 'settings'
};

const LOCALSTORAGE_KEY = 'novea_novels_meta';
const SETTINGS_KEY = 'novea_user_settings';

export interface UserSettings {
  userName: string;
  userBio: string;
  themePreference: 'cream' | 'sage' | 'sepia' | 'dark';
  defaultViewMode: 'grid' | 'list';
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  showWelcomeHero: boolean;
}

export const DEFAULT_SETTINGS: UserSettings = {
  userName: 'Budi (Kolektor Novel)',
  userBio: 'Pecinta sastra klasik dan kisah fantasi Nusantara.',
  themePreference: 'cream',
  defaultViewMode: 'grid',
  fontSize: 'base',
  showWelcomeHero: true,
};

// Open or initialize IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB tidak didukung pada browser ini.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORES.NOVELS)) {
        db.createObjectStore(STORES.NOVELS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.BLOBS)) {
        db.createObjectStore(STORES.BLOBS); // key is string (blobId)
      }
      if (!db.objectStoreNames.contains(STORES.BOOKMARKS)) {
        const bmStore = db.createObjectStore(STORES.BOOKMARKS, { keyPath: 'id' });
        bmStore.createIndex('novelId', 'novelId', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        db.createObjectStore(STORES.SETTINGS);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// In-memory object URL cache so we can revoke them on unload or replace
const blobUrlCache = new Map<string, string>();

export const NovelStorage = {
  /**
   * Initializes library with sample novels if empty
   */
  async initLibrary(): Promise<Novel[]> {
    try {
      const existing = await this.getAllNovels();
      if (existing && existing.length > 0) {
        return existing;
      }
      // Populate with sample novels
      for (const novel of SAMPLE_NOVELS) {
        await this.saveNovel(novel);
      }
      return SAMPLE_NOVELS;
    } catch (err) {
      console.warn('Fallback init with local storage:', err);
      const cached = localStorage.getItem(LOCALSTORAGE_KEY);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {}
      }
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(SAMPLE_NOVELS));
      return SAMPLE_NOVELS;
    }
  },

  /**
   * Get all novels
   */
  async getAllNovels(): Promise<Novel[]> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORES.NOVELS, 'readonly');
        const store = tx.objectStore(STORES.NOVELS);
        const req = store.getAll();
        req.onsuccess = () => {
          const list = req.result as Novel[];
          // Backup to local storage for quick offline sync
          try {
            localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(list));
          } catch {}
          resolve(list);
        };
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      const cached = localStorage.getItem(LOCALSTORAGE_KEY);
      return cached ? JSON.parse(cached) : [];
    }
  },

  /**
   * Get novel by ID
   */
  async getNovelById(id: string): Promise<Novel | undefined> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORES.NOVELS, 'readonly');
        const store = tx.objectStore(STORES.NOVELS);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result as Novel | undefined);
        req.onerror = () => reject(req.error);
      });
    } catch {
      const all = await this.getAllNovels();
      return all.find(n => n.id === id);
    }
  },

  /**
   * Save or update novel
   */
  async saveNovel(novel: Novel): Promise<void> {
    try {
      const db = await openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORES.NOVELS, 'readwrite');
        const store = tx.objectStore(STORES.NOVELS);
        const req = store.put(novel);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
      // sync with localStorage
      const all = await this.getAllNovels();
      try {
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(all));
      } catch {}
    } catch (err) {
      console.error('Error saving novel:', err);
    }
  },

  /**
   * Delete novel and associated binary files
   */
  async deleteNovel(id: string): Promise<void> {
    try {
      const novel = await this.getNovelById(id);
      const db = await openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction([STORES.NOVELS, STORES.BLOBS], 'readwrite');
        tx.objectStore(STORES.NOVELS).delete(id);
        if (novel?.pdfBlobId) {
          tx.objectStore(STORES.BLOBS).delete(novel.pdfBlobId);
        }
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });

      // Cleanup blob url cache
      if (blobUrlCache.has(id)) {
        URL.revokeObjectURL(blobUrlCache.get(id)!);
        blobUrlCache.delete(id);
      }

      // Sync
      const all = await this.getAllNovels();
      try {
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(all));
      } catch {}
    } catch (err) {
      console.error('Error deleting novel:', err);
    }
  },

  /**
   * Store binary PDF blob into IndexedDB
   */
  async storePdfBlob(blobId: string, blob: Blob): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.BLOBS, 'readwrite');
      const req = tx.objectStore(STORES.BLOBS).put(blob, blobId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },

  /**
   * Retrieve binary PDF blob from IndexedDB
   */
  async getPdfBlob(blobId: string): Promise<Blob | undefined> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORES.BLOBS, 'readonly');
        const req = tx.objectStore(STORES.BLOBS).get(blobId);
        req.onsuccess = () => resolve(req.result as Blob | undefined);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return undefined;
    }
  },

  /**
   * Get accessible PDF URL for reading (returns cached or newly created Blob URL)
   */
  async getNovelPdfUrl(novel: Novel): Promise<string> {
    if (blobUrlCache.has(novel.id)) {
      return blobUrlCache.get(novel.id)!;
    }

    // Check if custom uploaded blob exists
    if (novel.pdfBlobId) {
      const storedBlob = await this.getPdfBlob(novel.pdfBlobId);
      if (storedBlob) {
        const url = URL.createObjectURL(storedBlob);
        blobUrlCache.set(novel.id, url);
        return url;
      }
    }

    // If novel has a predefined direct URL
    if (novel.pdfUrl && novel.pdfUrl.startsWith('http')) {
      return novel.pdfUrl;
    }

    // Synthesize valid PDF Blob for sample novel
    const synthesizedBlob = generateNovelPdfBlob({
      title: novel.title,
      author: novel.author,
      genre: novel.genre,
      description: novel.description,
      contentPages: novel.contentPages
    });

    const url = URL.createObjectURL(synthesizedBlob);
    blobUrlCache.set(novel.id, url);
    return url;
  },

  /**
   * Toggle favorite state
   */
  async toggleFavorite(id: string): Promise<boolean> {
    const novel = await this.getNovelById(id);
    if (!novel) return false;
    const newState = !novel.isFavorite;
    novel.isFavorite = newState;
    novel.updatedAt = new Date().toISOString();
    await this.saveNovel(novel);
    return newState;
  },

  /**
   * Update reading progress
   */
  async updateReadingProgress(id: string, pageNumber: number): Promise<void> {
    const novel = await this.getNovelById(id);
    if (!novel) return;
    novel.currentPage = Math.max(1, Math.min(pageNumber, novel.totalPages));
    novel.lastReadAt = new Date().toISOString();
    novel.updatedAt = new Date().toISOString();
    await this.saveNovel(novel);
  },

  /**
   * Bookmarks management
   */
  async getBookmarks(novelId: string): Promise<Bookmark[]> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORES.BOOKMARKS, 'readonly');
        const store = tx.objectStore(STORES.BOOKMARKS);
        const index = store.index('novelId');
        const req = index.getAll(novelId);
        req.onsuccess = () => resolve(req.result as Bookmark[]);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return [];
    }
  },

  async addBookmark(bookmark: Bookmark): Promise<void> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORES.BOOKMARKS, 'readwrite');
        const req = tx.objectStore(STORES.BOOKMARKS).put(bookmark);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.error(err);
    }
  },

  async removeBookmark(bookmarkId: string): Promise<void> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORES.BOOKMARKS, 'readwrite');
        const req = tx.objectStore(STORES.BOOKMARKS).delete(bookmarkId);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.error(err);
    }
  },

  /**
   * User Settings
   */
  getUserSettings(): UserSettings {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {}
    return DEFAULT_SETTINGS;
  },

  saveUserSettings(settings: Partial<UserSettings>): UserSettings {
    const current = this.getUserSettings();
    const updated = { ...current, ...settings };
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    } catch {}
    return updated;
  },

  /**
   * Reset library to defaults
   */
  async resetToDefaults(): Promise<Novel[]> {
    const all = await this.getAllNovels();
    for (const n of all) {
      await this.deleteNovel(n.id);
    }
    for (const novel of SAMPLE_NOVELS) {
      await this.saveNovel(novel);
    }
    return SAMPLE_NOVELS;
  }
};
