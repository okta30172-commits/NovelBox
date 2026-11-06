import React, { useState, useRef } from 'react';
import { Novel, NovelGenre } from '../types/novel';
import { NovelStorage } from '../services/storage';
import { 
  X, 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  Sparkles, 
  Check, 
  AlertCircle,
  BookOpen,
  CloudUpload
} from 'lucide-react';

interface AddNovelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNovelAdded: (novel: Novel) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

const PRESET_COVERS = [
  {
    id: 'cover-1',
    name: 'Perpustakaan Vintage',
    url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'cover-2',
    name: 'Hutan Pinus Kabut',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'cover-3',
    name: 'Kamar Buku Senja',
    url: 'https://images.unsplash.com/photo-1507842229451-9f01079ca4b5?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'cover-4',
    name: 'Misteri Malam Anggrek',
    url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'cover-5',
    name: 'Fantasi Negeri Ajaib',
    url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'cover-6',
    name: 'Taman Rahasia Flora',
    url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80',
  },
];

export const AddNovelModal: React.FC<AddNovelModalProps> = ({
  isOpen,
  onClose,
  onNovelAdded,
  onShowToast,
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState<NovelGenre>('Klasik');
  const [description, setDescription] = useState('');
  const [totalPages, setTotalPages] = useState<number>(30);
  const [publishedYear, setPublishedYear] = useState<number>(new Date().getFullYear());
  
  // Cover selection
  const [selectedCoverUrl, setSelectedCoverUrl] = useState<string>(PRESET_COVERS[0].url);
  const [customCoverFile, setCustomCoverFile] = useState<File | null>(null);
  const [customCoverPreview, setCustomCoverPreview] = useState<string | null>(null);

  // PDF file state
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const pdfInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle PDF file selection with strict validation
  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPdfError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Strict validation: Only PDF accepted
    const isPdfMime = file.type === 'application/pdf';
    const isPdfExt = file.name.toLowerCase().endsWith('.pdf');

    if (!isPdfMime && !isPdfExt) {
      setPdfError('File harus berupa dokumen format PDF (*.pdf). File lain tidak diizinkan.');
      setPdfFile(null);
      if (pdfInputRef.current) pdfInputRef.current.value = '';
      return;
    }

    setPdfFile(file);

    // Auto-fill title from filename if title is empty
    if (!title) {
      const cleanName = file.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');
      setTitle(cleanName);
    }
  };

  // Handle Cover image upload
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onShowToast('Format Gambar Salah', 'Silakan pilih file gambar (JPG, PNG, WebP).', 'error');
      return;
    }

    setCustomCoverFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setCustomCoverPreview(result);
      setSelectedCoverUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !description.trim()) {
      onShowToast('Formulir Belum Lengkap', 'Mohon isi judul, penulis, dan sinopsis novel.', 'error');
      return;
    }

    setIsSubmitting(true);
    setUploadStatus('Menyimpan ke Supabase Cloud...');

    try {
      const novelId = `novel-${Date.now()}`;
      let finalCoverUrl = selectedCoverUrl;
      let finalPdfUrl: string | undefined = undefined;
      let pdfBlobId: string | undefined = undefined;

      // 1. Upload cover image to Supabase if custom file selected
      if (customCoverFile) {
        setUploadStatus('Mengunggah gambar cover ke Supabase Storage...');
        const cloudCover = await NovelStorage.uploadCoverToCloud(customCoverFile, customCoverFile.name);
        if (cloudCover) {
          finalCoverUrl = cloudCover;
        }
      }

      // 2. Upload PDF file to Supabase Storage ('novels' bucket)
      if (pdfFile) {
        setUploadStatus('Mengunggah berkas PDF ke Supabase Storage...');
        const cloudPdf = await NovelStorage.uploadPdfToCloud(pdfFile, pdfFile.name);
        if (cloudPdf) {
          finalPdfUrl = cloudPdf;
        } else {
          // Backup locally if network blip
          pdfBlobId = `blob-${novelId}`;
          await NovelStorage.storePdfBlob(pdfBlobId, pdfFile);
        }
      }

      setUploadStatus('Mendaftarkan data novel ke Database Supabase...');

      const newNovel: Novel = {
        id: novelId,
        title: title.trim(),
        author: author.trim(),
        genre: genre,
        description: description.trim(),
        coverUrl: finalCoverUrl,
        pdfUrl: finalPdfUrl,
        pdfBlobId: pdfBlobId,
        pdfFileName: pdfFile ? pdfFile.name : undefined,
        pdfFileSize: pdfFile ? pdfFile.size : undefined,
        totalPages: Math.max(1, totalPages),
        currentPage: 1,
        isFavorite: false,
        rating: 5,
        publishedYear: publishedYear || new Date().getFullYear(),
        language: 'id',
        readTimeMinutes: Math.round(totalPages * 8),
        tags: [genre, 'Supabase Cloud', 'PDF'],
        createdAt: new Date().toISOString(),
        isCustom: true,
        contentPages: [
          `${title.trim()} - ${author.trim()}\n\nSinopsis:\n${description.trim()}\n\nNovel ini telah berhasil tersimpan di perpustakaan digital Supabase Cloud.`
        ]
      };

      await NovelStorage.saveNovel(newNovel);
      onNovelAdded(newNovel);
      onShowToast('Berhasil Ditambahkan ke Supabase!', `Novel "${newNovel.title}" kini tersimpan di database cloud.`, 'success');
      onClose();
    } catch (err) {
      console.error(err);
      onShowToast('Gagal Menyimpan', 'Terjadi kesalahan saat menyimpan novel ke cloud.', 'error');
    } finally {
      setIsSubmitting(false);
      setUploadStatus('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#FAF6F0] border border-[#E8DEC8] shadow-2xl p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8DEC8]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <CloudUpload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-novel text-xl font-bold text-[#3B2C21]">
                Tambahkan Novel ke Supabase Cloud
              </h2>
              <p className="text-xs text-[#8C6D58]">
                Unggah berkas PDF dan metadata langsung ke database & penyimpanan Supabase.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[#EBE3D3] text-[#7A533E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          
          {/* Title & Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#4A3326] mb-1.5">
                Judul Novel <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Bumi Manusia"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E0D5C3] text-xs sm:text-sm text-[#4A3326] focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A3326] mb-1.5">
                Nama Penulis <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Contoh: Pramoedya Ananta Toer"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E0D5C3] text-xs sm:text-sm text-[#4A3326] focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-700"
              />
            </div>
          </div>

          {/* Genre, Year, Total Pages */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#4A3326] mb-1.5">
                Genre Novel <span className="text-rose-500">*</span>
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value as NovelGenre)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E0D5C3] text-xs sm:text-sm text-[#4A3326] focus:outline-none focus:ring-2 focus:ring-emerald-600/30 cursor-pointer"
              >
                <option value="Klasik">Klasik</option>
                <option value="Romansa">Romansa</option>
                <option value="Fantasi">Fantasi</option>
                <option value="Misteri">Misteri</option>
                <option value="Petualangan">Petualangan</option>
                <option value="Fiksi Ilmiah">Fiksi Ilmiah</option>
                <option value="Drama">Drama</option>
                <option value="Horor">Horor</option>
                <option value="Sejarah">Sejarah</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A3326] mb-1.5">
                Tahun Terbit
              </label>
              <input
                type="number"
                value={publishedYear}
                onChange={(e) => setPublishedYear(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E0D5C3] text-xs sm:text-sm text-[#4A3326] focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A3326] mb-1.5">
                Estimasi Halaman
              </label>
              <input
                type="number"
                min="1"
                value={totalPages}
                onChange={(e) => setTotalPages(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E0D5C3] text-xs sm:text-sm text-[#4A3326] focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
              />
            </div>
          </div>

          {/* Synopsis */}
          <div>
            <label className="block text-xs font-bold text-[#4A3326] mb-1.5">
              Sinopsis Novel <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tuliskan gambaran singkat cerita atau alasan Anda menyukai novel ini..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E0D5C3] text-xs sm:text-sm text-[#4A3326] focus:outline-none focus:ring-2 focus:ring-emerald-600/30 leading-relaxed"
            />
          </div>

          {/* PDF File Upload */}
          <div className="p-4 rounded-2xl bg-white border border-[#E0D5C3] space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#4A3326] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>Upload File Novel (Wajib Format PDF ke Supabase)</span>
              </label>
              <span className="text-[10px] text-emerald-800 font-semibold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                Supabase Storage
              </span>
            </div>

            <input
              type="file"
              ref={pdfInputRef}
              accept=".pdf,application/pdf"
              onChange={handlePdfChange}
              className="hidden"
            />

            <div 
              onClick={() => pdfInputRef.current?.click()}
              className="border-2 border-dashed border-[#D5C6B1] hover:border-emerald-600 rounded-xl p-4 text-center cursor-pointer transition-all bg-[#FAF6F0] hover:bg-emerald-50/40"
            >
              {pdfFile ? (
                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-800">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>File terpilih: <strong>{pdfFile.name}</strong> ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <Upload className="w-6 h-6 text-emerald-700 mx-auto" />
                  <p className="text-xs font-semibold text-[#4A3326]">
                    Klik untuk memilih file PDF dari komputer / perangkat Anda
                  </p>
                  <p className="text-[11px] text-[#8C6D58]">
                    File akan diunggah langsung ke Supabase Storage (Bucket "novels")
                  </p>
                </div>
              )}
            </div>

            {pdfError && (
              <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium mt-1">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{pdfError}</span>
              </div>
            )}
          </div>

          {/* Cover Selector: Upload or Presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#4A3326] flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#8C6D58]" />
                <span>Cover Novel (Unggah Gambar atau Pilih Template)</span>
              </label>
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                + Unggah Gambar Cover
              </button>
            </div>

            <input
              type="file"
              ref={coverInputRef}
              accept="image/*"
              onChange={handleCoverChange}
              className="hidden"
            />

            {/* Presets Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_COVERS.map((preset) => {
                const isSelected = selectedCoverUrl === preset.url && !customCoverPreview;
                return (
                  <div
                    key={preset.id}
                    onClick={() => {
                      setSelectedCoverUrl(preset.url);
                      setCustomCoverPreview(null);
                      setCustomCoverFile(null);
                    }}
                    className={`relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                      isSelected ? 'border-emerald-600 ring-2 ring-emerald-600/30 scale-95' : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-emerald-700/30 flex items-center justify-center">
                        <div className="w-5 h-5 rounded-full bg-white text-emerald-700 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 font-bold" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {customCoverPreview && (
              <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Gambar cover kustom terpilih untuk diunggah ke Supabase!</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#E8DEC8] flex items-center justify-between gap-3">
            {uploadStatus ? (
              <span className="text-xs text-emerald-800 font-semibold animate-pulse">
                {uploadStatus}
              </span>
            ) : <div />}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-full bg-white hover:bg-[#EBE3D3] text-[#4A3326] text-xs sm:text-sm font-semibold border border-[#E0D5C3] transition-all cursor-pointer"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-md flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Mengunggah...</span>
                  </>
                ) : (
                  <>
                    <CloudUpload className="w-4 h-4" />
                    <span>Simpan ke Supabase</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
