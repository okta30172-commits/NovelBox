import React, { useState, useMemo } from 'react';
import { Novel } from '../types/novel';
import { NovelCard } from './NovelCard';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  LayoutGrid, 
  List, 
  PlusCircle, 
  BookX,
  BookOpen
} from 'lucide-react';

interface CollectionViewProps {
  novels: Novel[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onReadNovel: (novel: Novel) => void;
  onSelectNovel: (novel: Novel) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onEditNovel: (novel: Novel, e: React.MouseEvent) => void;
  onDeleteNovel: (novel: Novel, e: React.MouseEvent) => void;
  onOpenAddModal: () => void;
  title?: string;
  subtitle?: string;
  onlyFavorites?: boolean;
}

export const CollectionView: React.FC<CollectionViewProps> = ({
  novels,
  searchQuery,
  onSearchChange,
  onReadNovel,
  onSelectNovel,
  onToggleFavorite,
  onEditNovel,
  onDeleteNovel,
  onOpenAddModal,
  title = 'Koleksi Novel Saya',
  subtitle = 'Kelola dan baca seluruh koleksi novel digital Anda dalam satu tempat yang terorganisasi.',
  onlyFavorites = false,
}) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('semua');
  const [sortBy, setSortBy] = useState<string>('terbaru');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Extract all available genres
  const availableGenres = useMemo(() => {
    const set = new Set<string>();
    novels.forEach(n => set.add(n.genre));
    return ['Semua', ...Array.from(set)];
  }, [novels]);

  // Filtering & Sorting
  const filteredNovels = useMemo(() => {
    let result = novels;

    if (onlyFavorites) {
      result = result.filter(n => n.isFavorite);
    }

    // Search query (title or author)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        n => n.title.toLowerCase().includes(q) || n.author.toLowerCase().includes(q) || n.genre.toLowerCase().includes(q)
      );
    }

    // Genre filter
    if (selectedGenre !== 'Semua') {
      result = result.filter(n => n.genre.toLowerCase() === selectedGenre.toLowerCase());
    }

    // Status filter
    if (selectedStatus === 'membaca') {
      result = result.filter(n => n.currentPage > 1 && n.currentPage < n.totalPages);
    } else if (selectedStatus === 'selesai') {
      result = result.filter(n => n.currentPage >= n.totalPages);
    } else if (selectedStatus === 'belum') {
      result = result.filter(n => n.currentPage <= 1);
    } else if (selectedStatus === 'unggahan') {
      result = result.filter(n => n.isCustom);
    }

    // Sorting
    return [...result].sort((a, b) => {
      if (sortBy === 'terbaru') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'terlama') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'judul-az') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'judul-za') {
        return b.title.localeCompare(a.title);
      }
      if (sortBy === 'terakhir-dibaca') {
        const timeA = a.lastReadAt ? new Date(a.lastReadAt).getTime() : 0;
        const timeB = b.lastReadAt ? new Date(b.lastReadAt).getTime() : 0;
        return timeB - timeA;
      }
      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      }
      return 0;
    });
  }, [novels, searchQuery, selectedGenre, selectedStatus, sortBy, onlyFavorites]);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-novel text-2xl sm:text-3xl font-extrabold text-[#3B2C21]">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-[#73675C] mt-1">
            {subtitle}
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#697D67] hover:bg-[#5A6D58] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Novel Baru</span>
        </button>
      </div>

      {/* Control Bar: Search, Filters & View Toggles */}
      <div className="p-4 rounded-3xl bg-white border border-[#EBE3D3] shadow-sm space-y-4">
        
        {/* Top row: Search input & View switcher */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9E8E81]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari berdasarkan judul novel atau nama penulis..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FAF6F0] border border-[#E0D5C3] text-xs sm:text-sm text-[#4A3326] placeholder-[#9E8E81] focus:outline-none focus:ring-2 focus:ring-[#8C6D58]/20 focus:border-[#8C6D58]"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <div className="relative flex-1 sm:flex-none">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto px-3.5 py-2.5 rounded-2xl bg-[#FAF6F0] border border-[#E0D5C3] text-xs font-semibold text-[#4A3326] focus:outline-none cursor-pointer"
              >
                <option value="terbaru">Terbaru Ditambahkan</option>
                <option value="terakhir-dibaca">Terakhir Dibaca</option>
                <option value="judul-az">Judul (A - Z)</option>
                <option value="judul-za">Judul (Z - A)</option>
                <option value="rating">Rating Tertinggi</option>
                <option value="terlama">Terlama</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-2xl bg-[#FAF6F0] border border-[#E0D5C3]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-xl transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white shadow-sm text-[#4A3326]'
                    : 'text-[#9E8E81] hover:text-[#4A3326]'
                }`}
                title="Tampilan Kisi (Grid)"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-xl transition-all ${
                  viewMode === 'list'
                    ? 'bg-white shadow-sm text-[#4A3326]'
                    : 'text-[#9E8E81] hover:text-[#4A3326]'
                }`}
                title="Tampilan Daftar (List)"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'semua', label: 'Semua Status' },
            { id: 'membaca', label: 'Sedang Dibaca' },
            { id: 'selesai', label: 'Selesai Dibaca' },
            { id: 'belum', label: 'Belum Dibaca' },
            { id: 'unggahan', label: 'Unggahan Sendiri' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all font-medium ${
                selectedStatus === tab.id
                  ? 'bg-[#4A3326] text-white shadow-sm'
                  : 'bg-[#FAF6F0] text-[#7A533E] hover:bg-[#EBE3D3]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Genre Filter Pills */}
        <div className="pt-2 border-t border-[#F0E7D9] flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[#8C6D58] text-[11px] font-semibold flex items-center gap-1 shrink-0">
            <Filter className="w-3 h-3" />
            Genre:
          </span>
          {availableGenres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-all text-xs ${
                selectedGenre === genre
                  ? 'bg-[#697D67] text-white font-semibold shadow-sm'
                  : 'bg-white border border-[#E0D5C3] text-[#63554A] hover:bg-[#F5EFE6]'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

      </div>

      {/* Novel Results Counter */}
      <div className="flex items-center justify-between text-xs text-[#8C6D58] px-1 font-medium">
        <span>Menampilkan {filteredNovels.length} dari {novels.length} novel</span>
        {(searchQuery || selectedGenre !== 'Semua' || selectedStatus !== 'semua') && (
          <button
            onClick={() => {
              onSearchChange('');
              setSelectedGenre('Semua');
              setSelectedStatus('semua');
            }}
            className="text-[#697D67] hover:underline font-semibold"
          >
            Reset Semua Filter
          </button>
        )}
      </div>

      {/* Novels Display (Grid or List) */}
      {filteredNovels.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-white border border-[#EBE3D3] shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#FAF6F0] border border-[#E0D5C3] flex items-center justify-center text-[#8C6D58] mx-auto mb-4">
            <BookX className="w-8 h-8" />
          </div>
          <h3 className="font-serif-novel text-lg font-bold text-[#3B2C21]">
            Tidak Ada Novel yang Sesuai
          </h3>
          <p className="text-xs text-[#73675C] mt-1 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian, pilih genre lain, atau tambahkan novel baru ke koleksi Anda.
          </p>
          <div className="flex items-center justify-center gap-3 mt-5">
            <button
              onClick={() => {
                onSearchChange('');
                setSelectedGenre('Semua');
                setSelectedStatus('semua');
              }}
              className="px-4 py-2 rounded-full bg-[#FAF6F0] hover:bg-[#EBE3D3] text-[#4A3326] text-xs font-semibold border border-[#E0D5C3]"
            >
              Reset Filter
            </button>
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 rounded-full bg-[#697D67] hover:bg-[#5A6D58] text-white text-xs font-semibold shadow-sm flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Tambah Novel</span>
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredNovels.map((novel) => (
            <NovelCard
              key={novel.id}
              novel={novel}
              onRead={onReadNovel}
              onSelect={onSelectNovel}
              onToggleFavorite={onToggleFavorite}
              onEdit={onEditNovel}
              onDelete={onDeleteNovel}
              layout="grid"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNovels.map((novel) => (
            <NovelCard
              key={novel.id}
              novel={novel}
              onRead={onReadNovel}
              onSelect={onSelectNovel}
              onToggleFavorite={onToggleFavorite}
              onEdit={onEditNovel}
              onDelete={onDeleteNovel}
              layout="list"
            />
          ))}
        </div>
      )}

    </div>
  );
};
