import React from 'react';
import { Novel } from '../types/novel';
import { NovelCard } from './NovelCard';
import { 
  BookOpen, 
  Sparkles, 
  Flame, 
  Clock, 
  Heart, 
  CheckCircle2, 
  ArrowRight, 
  BookMarked,
  Compass
} from 'lucide-react';

interface HomeViewProps {
  novels: Novel[];
  onReadNovel: (novel: Novel) => void;
  onSelectNovel: (novel: Novel) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onNavigateTab: (tab: string) => void;
  onOpenAddModal: () => void;
  onOpenWelcomeHero: () => void;
  userName: string;
}

export const HomeView: React.FC<HomeViewProps> = ({
  novels,
  onReadNovel,
  onSelectNovel,
  onToggleFavorite,
  onNavigateTab,
  onOpenAddModal,
  onOpenWelcomeHero,
  userName,
}) => {
  // Stats
  const totalCount = novels.length;
  const readingCount = novels.filter(n => n.currentPage > 1 && n.currentPage < n.totalPages).length;
  const completedCount = novels.filter(n => n.currentPage >= n.totalPages).length;
  const favoriteCount = novels.filter(n => n.isFavorite).length;

  // Last read novel (sorted by lastReadAt)
  const lastReadNovel = [...novels]
    .filter(n => n.lastReadAt && n.currentPage > 0)
    .sort((a, b) => new Date(b.lastReadAt!).getTime() - new Date(a.lastReadAt!).getTime())[0] 
    || novels.find(n => n.currentPage > 1) 
    || novels[0];

  // Recommendations (e.g., highly rated or favorites or classics)
  const recommendedNovels = novels
    .filter(n => n.rating >= 4)
    .slice(0, 4);

  // Latest added novels
  const latestNovels = [...novels]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const genres = [
    { name: 'Semua', count: novels.length },
    { name: 'Klasik', count: novels.filter(n => n.genre === 'Klasik').length },
    { name: 'Romansa', count: novels.filter(n => n.genre === 'Romansa').length },
    { name: 'Fantasi', count: novels.filter(n => n.genre === 'Fantasi').length },
    { name: 'Misteri', count: novels.filter(n => n.genre === 'Misteri').length },
    { name: 'Petualangan', count: novels.filter(n => n.genre === 'Petualangan').length },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#F5ECE1] via-[#EFE6D8] to-[#E5DAC8] border border-[#E0D5C3] p-6 sm:p-8 shadow-sm">
        {/* Subtle decorative circles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/30 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 right-24 w-40 h-40 rounded-full bg-[#E88B97]/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#D5C6B1] text-[#7A533E] text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#E07A8A]" />
              <span>Selamat Datang Kembali, {userName}</span>
            </div>

            <h1 className="font-serif-novel text-2xl sm:text-4xl font-extrabold text-[#3B2C21] tracking-tight leading-tight">
              NOVEA – Your Digital Novel Library
            </h1>

            <p className="mt-2 text-sm sm:text-base text-[#6F5B4C] font-serif italic">
              &ldquo;Every Book Holds a New World.&rdquo;
            </p>

            <p className="mt-2 text-xs sm:text-sm text-[#73675C] max-w-xl leading-relaxed">
              Jelajahi kembali lembaran kisah kesayangan Anda. Baca novel dalam format PDF dengan nyaman, kelola perpustakaan pribadi, dan temukan petualangan tak terbatas di setiap halaman.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-5">
              <button
                onClick={() => onNavigateTab('koleksi')}
                className="px-5 py-2.5 rounded-full bg-[#697D67] hover:bg-[#5A6D58] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#697D67]/25 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>Buka Koleksi Buku</span>
              </button>

              <button
                onClick={onOpenWelcomeHero}
                className="px-4 py-2.5 rounded-full bg-white/90 hover:bg-white text-[#C95D6F] text-xs sm:text-sm font-semibold border border-[#F3CCD6] shadow-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#E07A8A]" />
                <span>Lihat Poster Awal</span>
              </button>
            </div>
          </div>

          {/* Mini Art Card Preview */}
          <div 
            onClick={onOpenWelcomeHero}
            className="hidden lg:flex flex-col items-center p-3 rounded-2xl bg-white/80 border border-[#E5DAC8] shadow-md hover:scale-105 transition-transform cursor-pointer group"
          >
            <div className="w-28 aspect-[9/16] rounded-xl overflow-hidden shadow-inner bg-[#FDEAEF]">
              <img
                src="/assets/aistudio/gambar_novelBox_9e9d682e.jpeg"
                alt="NovelBox NOVEA"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="mt-2 text-[11px] font-semibold text-[#8C6D58] group-hover:text-[#4A3326]">
              Tampilan Poster Awal
            </span>
          </div>
        </div>
      </section>

      {/* Library Stats Section */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EBE3D3] shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#F5ECE1] border border-[#E0D5C3] flex items-center justify-center text-[#7A533E] shrink-0">
            <BookMarked className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#8C6D58] font-medium">Total Koleksi</p>
            <p className="text-xl sm:text-2xl font-extrabold text-[#3B2C21]">{totalCount} Novel</p>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EBE3D3] shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#EBF1EA] border border-[#CCD8CB] flex items-center justify-center text-[#3F5241] shrink-0">
            <BookOpen className="w-6 h-6 text-[#697D67]" />
          </div>
          <div>
            <p className="text-xs text-[#697D67] font-medium">Sedang Dibaca</p>
            <p className="text-xl sm:text-2xl font-extrabold text-[#3F5241]">{readingCount} Novel</p>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EBE3D3] shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#E6F4EA] border border-[#C2E7C9] flex items-center justify-center text-emerald-700 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-emerald-700 font-medium">Selesai Dibaca</p>
            <p className="text-xl sm:text-2xl font-extrabold text-emerald-900">{completedCount} Novel</p>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EBE3D3] shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#FDF0F3] border border-[#F5CCD6] flex items-center justify-center text-rose-600 shrink-0">
            <Heart className="w-6 h-6 fill-rose-100" />
          </div>
          <div>
            <p className="text-xs text-rose-600 font-medium">Novel Favorit</p>
            <p className="text-xl sm:text-2xl font-extrabold text-[#C95D6F]">{favoriteCount} Novel</p>
          </div>
        </div>
      </section>

      {/* Novel Terakhir Dibaca (Continue Reading) */}
      {lastReadNovel && (
        <section className="p-6 rounded-3xl bg-white border border-[#E8DEC8] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#8C6D58]" />
              <h2 className="font-serif-novel text-lg sm:text-xl font-bold text-[#3B2C21]">
                Lanjutkan Membaca
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('koleksi')}
              className="text-xs font-semibold text-[#8C6D58] hover:text-[#4A3326] flex items-center gap-1"
            >
              <span>Koleksi Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-[#FAF6F0] border border-[#EBE3D3]">
            {/* Cover */}
            <div 
              onClick={() => onSelectNovel(lastReadNovel)}
              className="w-24 sm:w-28 aspect-[3/4] rounded-xl overflow-hidden shadow-md bg-[#EDE4D5] cursor-pointer shrink-0"
            >
              <img
                src={lastReadNovel.coverUrl}
                alt={lastReadNovel.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>

            {/* Content & Progress */}
            <div className="flex-1 w-full text-center sm:text-left">
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#EBF1EA] text-[#3F5241] text-[10px] font-bold border border-[#CCD8CB] mb-1.5">
                {lastReadNovel.genre}
              </div>

              <h3 
                onClick={() => onSelectNovel(lastReadNovel)}
                className="font-serif-novel text-lg sm:text-xl font-bold text-[#3B2C21] cursor-pointer hover:text-[#697D67] transition-colors"
              >
                {lastReadNovel.title}
              </h3>

              <p className="text-xs text-[#7A533E] font-medium mb-3">
                Oleh: {lastReadNovel.author}
              </p>

              {/* Progress Bar */}
              <div className="space-y-1.5 max-w-md mx-auto sm:mx-0">
                <div className="flex items-center justify-between text-xs text-[#8C6D58]">
                  <span>Halaman {lastReadNovel.currentPage} dari {lastReadNovel.totalPages}</span>
                  <span className="font-bold">
                    {Math.round((lastReadNovel.currentPage / (lastReadNovel.totalPages || 1)) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-[#E5DAC8] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#697D67] h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.round((lastReadNovel.currentPage / (lastReadNovel.totalPages || 1)) * 100)}%`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Read Button */}
            <div className="shrink-0 w-full sm:w-auto">
              <button
                onClick={() => onReadNovel(lastReadNovel)}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-[#8C6D58] to-[#5F4634] hover:from-[#7A583E] hover:to-[#4A3326] text-white text-xs sm:text-sm font-semibold shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform hover:-translate-y-0.5"
              >
                <BookOpen className="w-4 h-4" />
                <span>Lanjutkan Halaman {lastReadNovel.currentPage}</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Rekomendasi Novel */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-600" />
            <h2 className="font-serif-novel text-xl font-bold text-[#3B2C21]">
              Rekomendasi Novel Pilihan
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('jelajahi')}
            className="text-xs font-semibold text-[#8C6D58] hover:text-[#4A3326] flex items-center gap-1"
          >
            <span>Lihat Semua Rekomendasi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {recommendedNovels.map((novel) => (
            <NovelCard
              key={novel.id}
              novel={novel}
              onRead={onReadNovel}
              onSelect={onSelectNovel}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </section>

      {/* Novel Terbaru Ditambahkan */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#697D67]" />
            <h2 className="font-serif-novel text-xl font-bold text-[#3B2C21]">
              Novel Terbaru di Koleksi
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('koleksi')}
            className="text-xs font-semibold text-[#8C6D58] hover:text-[#4A3326] flex items-center gap-1"
          >
            <span>Koleksi Lengkap ({totalCount})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {latestNovels.map((novel) => (
            <NovelCard
              key={novel.id}
              novel={novel}
              onRead={onReadNovel}
              onSelect={onSelectNovel}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </section>

    </div>
  );
};
