import React from 'react';
import { Novel } from '../types/novel';
import { 
  ArrowLeft, 
  BookOpen, 
  Heart, 
  Download, 
  Edit3, 
  Trash2, 
  Clock, 
  Calendar, 
  Globe, 
  FileText,
  Star,
  CheckCircle,
  Home,
  BookmarkCheck
} from 'lucide-react';

interface DetailViewProps {
  novel: Novel;
  onBackToCollection: () => void;
  onBackToHome: () => void;
  onReadNovel: (novel: Novel) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onEditNovel: (novel: Novel) => void;
  onDeleteNovel: (novel: Novel) => void;
  onDownloadPdf: (novel: Novel) => void;
}

export const DetailView: React.FC<DetailViewProps> = ({
  novel,
  onBackToCollection,
  onBackToHome,
  onReadNovel,
  onToggleFavorite,
  onEditNovel,
  onDeleteNovel,
  onDownloadPdf,
}) => {
  const progressPercent = Math.round((novel.currentPage / (novel.totalPages || 1)) * 100);
  const isStarted = novel.currentPage > 1;
  const isCompleted = novel.currentPage >= novel.totalPages;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-16">
      
      {/* Top Navigation & Return Buttons (CRITICAL MANDATE: NEVER TRAP USER) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white/80 border border-[#EBE3D3] shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToCollection}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF6F0] hover:bg-[#EBE3D3] text-[#4A3326] text-xs sm:text-sm font-semibold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#8C6D58]" />
            <span>Kembali ke Koleksi</span>
          </button>

          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-[#FAF6F0] text-[#7A533E] text-xs sm:text-sm font-medium transition-all cursor-pointer"
          >
            <Home className="w-4 h-4 text-[#8C6D58]" />
            <span className="hidden sm:inline">Ke Beranda</span>
          </button>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEditNovel(novel)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF6F0] hover:bg-[#EBE3D3] text-[#4A3326] text-xs font-semibold transition-all"
            title="Edit Informasi Novel"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#8C6D58]" />
            <span className="hidden sm:inline">Edit</span>
          </button>

          <button
            onClick={() => onDeleteNovel(novel)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition-all"
            title="Hapus Novel"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
            <span className="hidden sm:inline">Hapus</span>
          </button>
        </div>
      </div>

      {/* Main Details Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8DEC8] shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Book Cover & Quick Meta */}
          <div className="md:col-span-4 flex flex-col items-center">
            
            {/* Realistic Book Cover Frame */}
            <div className="relative w-56 sm:w-64 aspect-[3/4.2] rounded-2xl overflow-hidden shadow-2xl bg-[#EDE4D5] border-4 border-white group">
              <img
                src={novel.coverUrl}
                alt={novel.title}
                className="w-full h-full object-cover"
              />
              {/* Spine shadow */}
              <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/50 via-black/15 to-transparent pointer-events-none" />
              {/* Gloss highlight */}
              <div className="absolute inset-y-0 left-4 w-6 bg-gradient-to-r from-white/20 to-transparent pointer-events-none" />
            </div>

            {/* Quick Badges below cover */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span className="px-3 py-1 rounded-full bg-[#EBF1EA] text-[#3F5241] text-xs font-bold border border-[#CCD8CB]">
                {novel.genre}
              </span>
              {novel.isCustom && (
                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200">
                  Unggahan Koleksi
                </span>
              )}
            </div>

            {/* Rating Stars */}
            <div className="flex items-center gap-1 mt-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= (novel.rating || 5)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-xs font-bold text-[#4A3326] ml-1.5">
                {novel.rating || 5}.0
              </span>
            </div>

          </div>

          {/* Right Column: Title, Author, Synopsis & CTA */}
          <div className="md:col-span-8 flex flex-col justify-between space-y-6">
            
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="font-serif-novel text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#3B2C21] leading-tight">
                    {novel.title}
                  </h1>
                  <p className="text-sm sm:text-base text-[#7A533E] font-medium mt-1">
                    Karya Penulis: <span className="text-[#4A3326] font-bold">{novel.author}</span>
                  </p>
                </div>

                {/* Favorite Toggle Button */}
                <button
                  onClick={(e) => onToggleFavorite(novel.id, e)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer shadow-sm ${
                    novel.isFavorite
                      ? 'bg-rose-50 border-rose-200 text-rose-500'
                      : 'bg-[#FAF6F0] border-[#E5DAC8] text-gray-400 hover:text-rose-500'
                  }`}
                  title={novel.isFavorite ? 'Hapus dari Favorit' : 'Tambahkan ke Favorit'}
                >
                  <Heart className={`w-5 h-5 ${novel.isFavorite ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Specs Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5">
                <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#EBE3D3] text-center">
                  <div className="flex items-center justify-center gap-1 text-[11px] text-[#8C6D58] mb-0.5">
                    <FileText className="w-3.5 h-3.5 text-[#697D67]" />
                    <span>Halaman</span>
                  </div>
                  <p className="text-xs font-bold text-[#3B2C21]">{novel.totalPages} Hal</p>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#EBE3D3] text-center">
                  <div className="flex items-center justify-center gap-1 text-[11px] text-[#8C6D58] mb-0.5">
                    <Clock className="w-3.5 h-3.5 text-[#697D67]" />
                    <span>Estimasi</span>
                  </div>
                  <p className="text-xs font-bold text-[#3B2C21]">
                    {novel.readTimeMinutes ? `${novel.readTimeMinutes} mnt` : '~3 jam'}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#EBE3D3] text-center">
                  <div className="flex items-center justify-center gap-1 text-[11px] text-[#8C6D58] mb-0.5">
                    <Calendar className="w-3.5 h-3.5 text-[#697D67]" />
                    <span>Tahun</span>
                  </div>
                  <p className="text-xs font-bold text-[#3B2C21]">
                    {novel.publishedYear || 'Klasik'}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#EBE3D3] text-center">
                  <div className="flex items-center justify-center gap-1 text-[11px] text-[#8C6D58] mb-0.5">
                    <Globe className="w-3.5 h-3.5 text-[#697D67]" />
                    <span>Bahasa</span>
                  </div>
                  <p className="text-xs font-bold text-[#3B2C21]">
                    {novel.language === 'id' ? 'Indonesia' : 'Inggris'}
                  </p>
                </div>
              </div>

              {/* Progress Card */}
              <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#EAE0D2] mt-5">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-[#4A3326] flex items-center gap-1.5">
                    <BookmarkCheck className="w-4 h-4 text-[#697D67]" />
                    <span>Progres Membaca Terakhir</span>
                  </span>
                  <span className="font-bold text-[#697D67]">
                    {isCompleted ? 'Selesai 100%' : `Halaman ${novel.currentPage} dari ${novel.totalPages} (${progressPercent}%)`}
                  </span>
                </div>
                <div className="w-full bg-[#E5DAC8] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isCompleted ? 'bg-emerald-600' : 'bg-[#697D67]'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Sinopsis Section */}
              <div className="mt-5 space-y-2">
                <h3 className="font-serif-novel text-base font-bold text-[#3B2C21]">
                  Sinopsis Novel
                </h3>
                <p className="text-xs sm:text-sm text-[#5C4D42] leading-relaxed whitespace-pre-line">
                  {novel.description}
                </p>
              </div>

              {/* Tags */}
              {novel.tags && novel.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mt-4">
                  <span className="text-[11px] font-semibold text-[#8C6D58] mr-1">Topik:</span>
                  {novel.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#FAF6F0] text-[#7A533E] border border-[#E5DAC8]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#F0E7D9] flex flex-wrap items-center gap-3">
              <button
                onClick={() => onReadNovel(novel)}
                className="flex-1 py-3.5 px-6 rounded-full bg-gradient-to-r from-[#697D67] to-[#4E5D4C] hover:from-[#5A6D58] hover:to-[#3F4D3D] text-white text-sm font-semibold shadow-md shadow-[#697D67]/25 flex items-center justify-center gap-2 cursor-pointer transition-all transform hover:-translate-y-0.5"
              >
                <BookOpen className="w-4 h-4" />
                <span>
                  {isStarted && !isCompleted
                    ? `Lanjutkan Membaca (Hal. ${novel.currentPage})`
                    : isCompleted
                    ? 'Baca Kembali dari Awal'
                    : 'Baca Sekarang'}
                </span>
              </button>

              <button
                onClick={(e) => onToggleFavorite(novel.id, e)}
                className={`px-4 py-3.5 rounded-full text-xs sm:text-sm font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                  novel.isFavorite
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-[#FAF6F0] hover:bg-[#EBE3D3] border-[#E0D5C3] text-[#4A3326]'
                }`}
              >
                <Heart className={`w-4 h-4 ${novel.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{novel.isFavorite ? 'Favorit' : 'Tambah Favorit'}</span>
              </button>

              <button
                onClick={() => onDownloadPdf(novel)}
                className="px-4 py-3.5 rounded-full bg-[#FAF6F0] hover:bg-[#EBE3D3] border border-[#E0D5C3] text-[#4A3326] text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Unduh Salinan PDF Novel"
              >
                <Download className="w-4 h-4 text-[#8C6D58]" />
                <span className="hidden sm:inline">Unduh PDF</span>
              </button>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
