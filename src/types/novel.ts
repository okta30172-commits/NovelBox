export interface NovelChapter {
  id: string;
  title: string;
  page: number;
  content: string;
}

export interface Bookmark {
  id: string;
  novelId: string;
  page: number;
  chapterTitle?: string;
  note?: string;
  createdAt: string;
}

export type NovelGenre = 
  | 'Klasik'
  | 'Romansa'
  | 'Fantasi'
  | 'Misteri'
  | 'Petualangan'
  | 'Fiksi Ilmiah'
  | 'Drama'
  | 'Sejarah'
  | 'Horor'
  | 'Lainnya';

export interface Novel {
  id: string;
  title: string;
  author: string;
  genre: NovelGenre | string;
  description: string;
  coverUrl: string;
  pdfUrl?: string; // Blob URL or data URL
  pdfBlobId?: string; // ID in IndexedDB for binary PDF
  pdfFileName?: string;
  pdfFileSize?: number;
  totalPages: number;
  currentPage: number;
  lastReadAt?: string;
  isFavorite: boolean;
  rating: number; // 1 to 5
  publishedYear?: number;
  language: 'id' | 'en' | string;
  readTimeMinutes?: number;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
  isCustom?: boolean;
  chapters?: NovelChapter[];
  contentPages?: string[]; // Array of text content per page for digital reading
}

export type ViewMode = 'grid' | 'list';
export type ReaderTheme = 'cream' | 'white' | 'sage' | 'night';
export type ReaderFontSize = 'sm' | 'base' | 'lg' | 'xl';
