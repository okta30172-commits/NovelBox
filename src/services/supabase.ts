import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Novel, Bookmark } from '../types/novel';
import { SAMPLE_NOVELS } from '../data/sampleNovels';

// Supabase Project Credentials provided by user
export const SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_URL || 'https://zzfdbszptsokcqchgydi.supabase.co';

export const SUPABASE_ANON_KEY = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6ZmRic3pwdHNva2NxY2hneWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM5NDI4OTUsImV4cCI6MjEwOTUxODg5NX0.QHqwgQOtg9jO5fy20vE3AZ2SiJJhS5ijT_RRqP_fcjM';

export const SUPABASE_SERVICE_ROLE = 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6ZmRic3pwdHNva2NxY2hneWRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5Mzk0Mjg5NSwiZXhwIjoyMTA5NTE4ODk1fQ.8riZYskZVsX53SamjkosFVWp2FjVckk2n4OkEpQAtYg';

// Public client
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Admin client for bypass storage/RLS operations
export const supabaseAdmin: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

export const SQL_SCHEMA_SCRIPT = `-- ==========================================
-- SKRIP SETUP DATABASE NOVEA UNTUK SUPABASE
-- Jalankan skrip ini di SQL Editor Supabase:
-- https://supabase.com/dashboard/project/zzfdbszptsokcqchgydi/sql/new
-- ==========================================

-- 1. Buat Tabel Novels
CREATE TABLE IF NOT EXISTS public.novels (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  genre TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  pdf_url TEXT,
  pdf_file_name TEXT,
  pdf_file_size BIGINT,
  total_pages INT DEFAULT 30,
  current_page INT DEFAULT 1,
  last_read_at TIMESTAMPTZ,
  is_favorite BOOLEAN DEFAULT FALSE,
  rating INT DEFAULT 5,
  published_year INT,
  language TEXT DEFAULT 'id',
  read_time_minutes INT,
  tags TEXT[],
  is_custom BOOLEAN DEFAULT FALSE,
  chapters JSONB,
  content_pages JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Buat Tabel Bookmarks
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id TEXT PRIMARY KEY,
  novel_id TEXT REFERENCES public.novels(id) ON DELETE CASCADE,
  page INT NOT NULL,
  chapter_title TEXT,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Buat Tabel Pengaturan Pengguna
CREATE TABLE IF NOT EXISTS public.user_settings (
  id TEXT PRIMARY KEY DEFAULT 'budi_collector',
  user_name TEXT DEFAULT 'Budi (Kolektor Novel)',
  user_bio TEXT DEFAULT 'Pecinta sastra klasik dan kisah fantasi Nusantara.',
  theme_preference TEXT DEFAULT 'cream',
  default_view_mode TEXT DEFAULT 'grid',
  font_size TEXT DEFAULT 'base',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Aktifkan Row Level Security (RLS) & Berikan Kebijakan Akses Publik
ALTER TABLE public.novels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Kebijakan Akses Novels
DROP POLICY IF EXISTS "Public access on novels" ON public.novels;
CREATE POLICY "Public access on novels" ON public.novels FOR ALL USING (true) WITH CHECK (true);

-- Kebijakan Akses Bookmarks
DROP POLICY IF EXISTS "Public access on bookmarks" ON public.bookmarks;
CREATE POLICY "Public access on bookmarks" ON public.bookmarks FOR ALL USING (true) WITH CHECK (true);

-- Kebijakan Akses User Settings
DROP POLICY IF EXISTS "Public access on user_settings" ON public.user_settings;
CREATE POLICY "Public access on user_settings" ON public.user_settings FOR ALL USING (true) WITH CHECK (true);

-- 5. Kebijakan Storage Bucket 'novels'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('novels', 'novels', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Read Novels Bucket" ON storage.objects;
CREATE POLICY "Public Read Novels Bucket" ON storage.objects FOR SELECT USING (bucket_id = 'novels');

DROP POLICY IF EXISTS "Public Insert Novels Bucket" ON storage.objects;
CREATE POLICY "Public Insert Novels Bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'novels');

DROP POLICY IF EXISTS "Public Update Novels Bucket" ON storage.objects;
CREATE POLICY "Public Update Novels Bucket" ON storage.objects FOR UPDATE USING (bucket_id = 'novels');

DROP POLICY IF EXISTS "Public Delete Novels Bucket" ON storage.objects;
CREATE POLICY "Public Delete Novels Bucket" ON storage.objects FOR DELETE USING (bucket_id = 'novels');
`;

// Helper: Convert Database Row to Novel interface
export function mapRowToNovel(row: any): Novel {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    genre: row.genre,
    description: row.description || '',
    coverUrl: row.cover_url || '',
    pdfUrl: row.pdf_url || undefined,
    pdfFileName: row.pdf_file_name || undefined,
    pdfFileSize: row.pdf_file_size ? Number(row.pdf_file_size) : undefined,
    totalPages: row.total_pages || 30,
    currentPage: row.current_page || 1,
    lastReadAt: row.last_read_at || undefined,
    isFavorite: Boolean(row.is_favorite),
    rating: row.rating || 5,
    publishedYear: row.published_year || undefined,
    language: row.language || 'id',
    readTimeMinutes: row.read_time_minutes || 180,
    tags: Array.isArray(row.tags) ? row.tags : [],
    isCustom: Boolean(row.is_custom),
    chapters: row.chapters || [],
    contentPages: row.content_pages || [],
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || undefined,
  };
}

// Helper: Convert Novel interface to Database Row
export function mapNovelToRow(novel: Novel): any {
  return {
    id: novel.id,
    title: novel.title,
    author: novel.author,
    genre: novel.genre,
    description: novel.description,
    cover_url: novel.coverUrl,
    pdf_url: novel.pdfUrl || null,
    pdf_file_name: novel.pdfFileName || null,
    pdf_file_size: novel.pdfFileSize || null,
    total_pages: novel.totalPages || 30,
    current_page: novel.currentPage || 1,
    last_read_at: novel.lastReadAt || null,
    is_favorite: novel.isFavorite,
    rating: novel.rating || 5,
    published_year: novel.publishedYear || null,
    language: novel.language || 'id',
    read_time_minutes: novel.readTimeMinutes || null,
    tags: novel.tags || [],
    is_custom: Boolean(novel.isCustom),
    chapters: novel.chapters || null,
    content_pages: novel.contentPages || null,
    created_at: novel.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export interface SupabaseHealthStatus {
  connected: boolean;
  tableExists: boolean;
  storageReady: boolean;
  errorMessage?: string;
  count?: number;
}

export const SupabaseService = {
  /**
   * Check connection and schema readiness
   */
  async checkHealth(): Promise<SupabaseHealthStatus> {
    try {
      const { data, error, count } = await supabase
        .from('novels')
        .select('id', { count: 'exact', head: true });

      if (error) {
        // Code PGRST205 means table doesn't exist yet in Supabase
        if (error.code === 'PGRST205' || error.message?.includes('not find the table')) {
          return {
            connected: true,
            tableExists: false,
            storageReady: true,
            errorMessage: 'Tabel "novels" belum dibuat di Supabase.',
          };
        }
        return {
          connected: false,
          tableExists: false,
          storageReady: false,
          errorMessage: error.message,
        };
      }

      return {
        connected: true,
        tableExists: true,
        storageReady: true,
        count: count ?? undefined,
      };
    } catch (err: any) {
      return {
        connected: false,
        tableExists: false,
        storageReady: false,
        errorMessage: err?.message || 'Gagal tersambung ke Supabase.',
      };
    }
  },

  /**
   * Fetch all novels from Supabase
   */
  async getNovels(): Promise<{ novels: Novel[]; fromSupabase: boolean; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('novels')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return { novels: [], fromSupabase: false, error: error.message };
      }

      if (!data || data.length === 0) {
        // Table exists but is empty -> seed sample novels!
        const seeded = await this.seedSampleNovels();
        return { novels: seeded, fromSupabase: true };
      }

      return {
        novels: data.map(mapRowToNovel),
        fromSupabase: true,
      };
    } catch (err: any) {
      return { novels: [], fromSupabase: false, error: err?.message };
    }
  },

  /**
   * Seed sample novels into Supabase
   */
  async seedSampleNovels(): Promise<Novel[]> {
    try {
      const rows = SAMPLE_NOVELS.map(mapNovelToRow);
      const { error } = await supabaseAdmin.from('novels').upsert(rows, { onConflict: 'id' });
      if (error) {
        console.warn('Gagal seed ke Supabase:', error.message);
      }
      return SAMPLE_NOVELS;
    } catch (e) {
      console.warn(e);
      return SAMPLE_NOVELS;
    }
  },

  /**
   * Save or Update a Novel in Supabase
   */
  async saveNovel(novel: Novel): Promise<boolean> {
    try {
      const row = mapNovelToRow(novel);
      const { error } = await supabaseAdmin.from('novels').upsert(row, { onConflict: 'id' });
      if (error) {
        console.error('Supabase saveNovel error:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  /**
   * Delete a Novel from Supabase
   */
  async deleteNovel(id: string): Promise<boolean> {
    try {
      const { error } = await supabaseAdmin.from('novels').delete().eq('id', id);
      if (error) {
        console.error('Supabase deleteNovel error:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  /**
   * Update reading progress in Supabase
   */
  async updateProgress(id: string, currentPage: number): Promise<void> {
    try {
      await supabaseAdmin
        .from('novels')
        .update({
          current_page: currentPage,
          last_read_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
    } catch (err) {
      console.warn('Failed to update progress in Supabase:', err);
    }
  },

  /**
   * Toggle favorite in Supabase
   */
  async toggleFavorite(id: string, isFavorite: boolean): Promise<void> {
    try {
      await supabaseAdmin
        .from('novels')
        .update({
          is_favorite: isFavorite,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
    } catch (err) {
      console.warn('Failed to toggle favorite in Supabase:', err);
    }
  },

  /**
   * Upload PDF to Supabase Storage ('novels' bucket)
   */
  async uploadPdfFile(file: File | Blob, fileName: string): Promise<string | null> {
    try {
      const cleanName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const filePath = `pdfs/${cleanName}`;

      const { data, error } = await supabaseAdmin.storage
        .from('novels')
        .upload(filePath, file, {
          contentType: 'application/pdf',
          upsert: true,
        });

      if (error) {
        console.error('Supabase upload error:', error);
        return null;
      }

      // Get public URL
      const { data: publicData } = supabase.storage
        .from('novels')
        .getPublicUrl(filePath);

      return publicData.publicUrl;
    } catch (err) {
      console.error('Upload exception:', err);
      return null;
    }
  },

  /**
   * Upload Cover image to Supabase Storage
   */
  async uploadCoverImage(file: File | Blob, fileName: string): Promise<string | null> {
    try {
      const cleanName = `${Date.now()}_cover_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const filePath = `covers/${cleanName}`;

      const { data, error } = await supabaseAdmin.storage
        .from('novels')
        .upload(filePath, file, {
          upsert: true,
        });

      if (error) {
        console.error('Cover upload error:', error);
        return null;
      }

      const { data: publicData } = supabase.storage
        .from('novels')
        .getPublicUrl(filePath);

      return publicData.publicUrl;
    } catch (err) {
      console.error('Cover upload exception:', err);
      return null;
    }
  },

  /**
   * Get / Save user settings in Supabase
   */
  async getUserSettings(): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .limit(1)
        .single();

      if (error || !data) return null;
      return {
        userName: data.user_name,
        userBio: data.user_bio,
        themePreference: data.theme_preference,
        defaultViewMode: data.default_view_mode,
        fontSize: data.font_size,
      };
    } catch {
      return null;
    }
  },

  async saveUserSettings(settings: any): Promise<void> {
    try {
      await supabaseAdmin.from('user_settings').upsert({
        id: 'budi_collector',
        user_name: settings.userName,
        user_bio: settings.userBio,
        theme_preference: settings.themePreference,
        default_view_mode: settings.defaultViewMode,
        font_size: settings.fontSize,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn(e);
    }
  },
};
