import React, { useState, useEffect } from 'react';
import { Novel, NovelGenre } from '../types/novel';
import { X, Edit3, Save, Star } from 'lucide-react';

interface EditNovelModalProps {
  isOpen: boolean;
  novel: Novel | null;
  onClose: () => void;
  onSave: (updatedNovel: Novel) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

export const EditNovelModal: React.FC<EditNovelModalProps> = ({
  isOpen,
  novel,
  onClose,
  onSave,
  onShowToast,
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState<NovelGenre>('Klasik');
  const [description, setDescription] = useState('');
  const [totalPages, setTotalPages] = useState<number>(30);
  const [rating, setRating] = useState<number>(5);
  const [publishedYear, setPublishedYear] = useState<number>(2024);

  useEffect(() => {
    if (novel) {
      setTitle(novel.title);
      setAuthor(novel.author);
      setGenre(novel.genre as NovelGenre);
      setDescription(novel.description);
      setTotalPages(novel.totalPages || 30);
      setRating(novel.rating || 5);
      setPublishedYear(novel.publishedYear || 2024);
    }
  }, [novel]);

  if (!isOpen || !novel) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) {
      onShowToast('Data Tidak Lengkap', 'Judul dan penulis harus diisi.', 'error');
      return;
    }

    const updated: Novel = {
      ...novel,
      title: title.trim(),
      author: author.trim(),
      genre,
      description: description.trim(),
      totalPages: Math.max(1, totalPages),
      rating,
      publishedYear,
      updatedAt: new Date().toISOString(),
    };

    onSave(updated);
    onShowToast('Perubahan Disimpan', `Informasi novel "${updated.title}" berhasil diperbarui.`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#FAF6F0] border border-[#E8DEC8] shadow-2xl p-6 sm:p-8">
        
        <div className="flex items-center justify-between pb-4 border-b border-[#E8DEC8]">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-[#8C6D58]" />
            <h2 className="font-serif-novel text-xl font-bold text-[#3B2C21]">
              Edit Informasi Novel
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[#EBE3D3] text-[#7A533E]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#4A3326] mb-1">Judul Novel</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E0D5C3] text-sm text-[#4A3326] focus:outline-none focus:ring-2 focus:ring-[#8C6D58]/30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A3326] mb-1">Nama Penulis</label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E0D5C3] text-sm text-[#4A3326] focus:outline-none focus:ring-2 focus:ring-[#8C6D58]/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#4A3326] mb-1">Genre</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value as NovelGenre)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E0D5C3] text-xs font-semibold text-[#4A3326] focus:outline-none"
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
              <label className="block text-xs font-bold text-[#4A3326] mb-1">Jumlah Halaman</label>
              <input
                type="number"
                min="1"
                value={totalPages}
                onChange={(e) => setTotalPages(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E0D5C3] text-xs font-semibold text-[#4A3326]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A3326] mb-1">Rating Koleksi</label>
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-[#E0D5C3]">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-[#4A3326] ml-2">{rating} Bintang</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A3326] mb-1">Sinopsis</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E0D5C3] text-xs sm:text-sm text-[#4A3326] focus:outline-none focus:ring-2 focus:ring-[#8C6D58]/30"
            />
          </div>

          <div className="pt-4 border-t border-[#E8DEC8] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-white hover:bg-[#EBE3D3] text-[#4A3326] text-xs font-semibold border border-[#E0D5C3]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-gradient-to-r from-[#8C6D58] to-[#5F4634] hover:from-[#7A583E] hover:to-[#4A3326] text-white text-xs font-semibold shadow-sm flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
