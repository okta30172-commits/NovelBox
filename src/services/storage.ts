import { Novel, Bookmark } from '../types/novel';
import { SAMPLE_NOVELS } from '../data/sampleNovels';
import { generateNovelPdfBlob } from './pdfGenerator';
import { SupabaseService, SupabaseHealthStatus } from './supabase';

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

// Open or initialize IndexedDB for local fallback/cache
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
        db.createObjectStore(STORES.BLOBS);
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

const blobUrlCache = new Map<string, string>();

export const NovelStorage = {
  /**
   * Check Supabase Cloud Connection & Health
   */
  async checkSupabaseStatus(): Promise<SupabaseHealthStatus> {
    return await SupabaseService.checkHealth();
  },

  /**
   * Initializes library:
   * First tries Supabase Cloud Database!
   * If table exists and has data, loads from Supabase.
   * If table doesn't exist yet, falls back to local cache & signals caller.
   */
  async initLibrary(): Promise<{ novels: Novel[]; isSupabaseActive: boolean; needSqlSetup: boolean }> {
    try {
      const health = await SupabaseService.checkHealth();

      if (health.connected && health.tableExists) {
        const { novels, fromSupabase } = await SupabaseService.getNovels();
        if (fromSupabase && novels.length > 0) {
          // Sync with local cache
          try {
            localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(novels));
          } catch {}
          return { novels, isSupabaseActive: true, needSqlSetup: false };
        }
      }

      // If Supabase is connected but table is not yet created
      const needSqlSetup = health.connected && !health.tableExists;

      // Fallback to local cache or sample novels
      const existing = await this.getAllNovelsLocal();
      if (existing && existing.length > 0) {
        return { novels: existing, isSupabaseActive: false, needSqlSetup };
      }

      // Seed local sample novels
      for (const novel of SAMPLE_NOVELS) {
        await this.saveNovelLocal(novel);
      }
      return { novels: SAMPLE_NOVELS, isSupabaseActive: false, needSqlSetup };
    } catch (err) {
      console.warn('Fallback init with local storage:', err);
      const cached = localStorage.getItem(LOCALSTORAGE_KEY);
      const novels = cached ? JSON.parse(cached) : SAMPLE_NOVELS;
      return { novels, isSupabaseActive: false, needSqlSetup: true };
    }
  },

  /**
   * Migrate current local novels into Supabase cloud database
   */
  async syncAllToSupabase(novelsToSync: Novel[]): Promise<{ success: boolean; count: number; error?: string }> {
    try {
      let count = 0;
      for (const novel of novelsToSync) {
        const ok = await SupabaseService.saveNovel(novel);
        if (ok) count++;
      }
      return { success: true, count };
    } catch (err: any) {
      return { success: false, count: 0, error: err?.message };
    }
  },

  /**
   * Get all novels from local IndexedDB
   */
  async getAllNovelsLocal(): Promise<Novel[]> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORES.NOVELS, 'readonly');
        const store = tx.objectStore(STORES.NOVELS);
        const req = store.getAll();
        req.onsuccess = () => {
          const list = req.result as Novel[];
          try {
            localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(list));
          } catch {}
          resolve(list);
        };
        req.onerror = () => reject(req.error);
      });
    } catch {
      const cached = localStorage.getItem(LOCALSTORAGE_KEY);
      return cached ? JSON.parse(cached) : [];
    }
  },

  /**
   * Get novel by ID
   */
  async getNovelById(id: string): Promise<Novel | undefined> {
    try {
      const all = await this.getAllNovelsLocal();
      return all.find(n => n.id === id);
    } catch {
      return undefined;
    }
  },

  /**
   * Save novel to Supabase Cloud AND Local Storage
   */
  async saveNovel(novel: Novel): Promise<void> {
    // 1. Save to Supabase Cloud
    await SupabaseService.saveNovel(novel);

    // 2. Save locally
    await this.saveNovelLocal(novel);
  },

  async saveNovelLocal(novel: Novel): Promise<void> {
    try {
      const db = await openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORES.NOVELS, 'readwrite');
        const store = tx.objectStore(STORES.NOVELS);
        const req = store.put(novel);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
      const all = await this.getAllNovelsLocal();
      try {
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(all));
      } catch {}
    } catch (err) {
      console.error('Error saving novel locally:', err);
    }
  },

  /**
   * Delete novel from Supabase Cloud AND Local Storage
   */
  async deleteNovel(id: string): Promise<void> {
    // 1. Delete from Supabase Cloud
    await SupabaseService.deleteNovel(id);

    // 2. Delete locally
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

      if (blobUrlCache.has(id)) {
        URL.revokeObjectURL(blobUrlCache.get(id)!);
        blobUrlCache.delete(id);
      }
    } catch (err) {
      console.error('Error deleting novel locally:', err);
    }
  },

  /**
   * Upload PDF to Supabase Storage (Cloud)
   */
  async uploadPdfToCloud(file: File, fileName: string): Promise<string | null> {
    return await SupabaseService.uploadPdfFile(file, fileName);
  },

  /**
   * Upload Cover to Supabase Storage (Cloud)
   */
  async uploadCoverToCloud(file: File, fileName: string): Promise<string | null> {
    return await SupabaseService.uploadCoverImage(file, fileName);
  },

  /**
   * Store binary PDF blob into IndexedDB (as fallback or local cache)
   */
  async storePdfBlob(blobId: string, blob: Blob): Promise<void> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORES.BLOBS, 'readwrite');
        const req = tx.objectStore(STORES.BLOBS).put(blob, blobId);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.warn('storePdfBlob error:', e);
    }
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
   * Get accessible PDF URL for reading
   */
  async getNovelPdfUrl(novel: Novel): Promise<string> {
    // If novel has a cloud URL (Supabase storage or external)
    if (novel.pdfUrl && novel.pdfUrl.startsWith('http')) {
      return novel.pdfUrl;
    }

    if (blobUrlCache.has(novel.id)) {
      return blobUrlCache.get(novel.id)!;
    }

    // Check if custom uploaded blob exists in local IndexedDB
    if (novel.pdfBlobId) {
      const storedBlob = await this.getPdfBlob(novel.pdfBlobId);
      if (storedBlob) {
        const url = URL.createObjectURL(storedBlob);
        blobUrlCache.set(novel.id, url);
        return url;
      }
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
   * Toggle favorite state in Cloud and Local
   */
  async toggleFavorite(id: string): Promise<boolean> {
    const novel = await this.getNovelById(id);
    if (!novel) return false;
    const newState = !novel.isFavorite;
    novel.isFavorite = newState;
    novel.updatedAt = new Date().toISOString();

    // Save to Supabase Cloud
    await SupabaseService.toggleFavorite(id, newState);

    // Save locally
    await this.saveNovelLocal(novel);
    return newState;
  },

  /**
   * Update reading progress in Cloud and Local
   */
  async updateReadingProgress(id: string, pageNumber: number): Promise<void> {
    const novel = await this.getNovelById(id);
    if (!novel) return;
    const clamped = Math.max(1, Math.min(pageNumber, novel.totalPages));
    novel.currentPage = clamped;
    novel.lastReadAt = new Date().toISOString();
    novel.updatedAt = new Date().toISOString();

    // Update in Supabase Cloud
    await SupabaseService.updateProgress(id, clamped);

    // Update locally
    await this.saveNovelLocal(novel);
  },

  /**
   * Bookmarks
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
      await new Promise<void>((resolve, reject) => {
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
      await new Promise<void>((resolve, reject) => {
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
      SupabaseService.saveUserSettings(updated);
    } catch {}
    return updated;
  },

  /**
   * Reset library to defaults
   */
  async resetToDefaults(): Promise<Novel[]> {
    for (const novel of SAMPLE_NOVELS) {
      await this.saveNovel(novel);
    }
    return SAMPLE_NOVELS;
  }
};
