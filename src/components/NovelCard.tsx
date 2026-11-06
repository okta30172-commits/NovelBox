import React from 'react';
import { Novel } from '../types/novel';
import { BookOpen, Heart, MoreVertical, Edit3, Trash2, FileText, CheckCircle } from 'lucide-react';

interface NovelCardProps {
  novel: Novel;
  onRead: (novel: Novel) => void;
  onSelect: (novel: Novel) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onEdit?: (novel: Novel, e: React.MouseEvent) => void;
  onDelete?: (novel: Novel, e: React.MouseEvent) => void;
  layout?: 'grid' | 'list';
}

export const NovelCard: React.FC<NovelCardProps> = ({
  novel,
  onRead,
  onSelect,
  onToggleFavorite,
  onEdit,
  onDelete,
  layout = 'grid',
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const progressPercent = Math.round((novel.currentPage / (novel.totalPages || 1)) * 100);
  const isCompleted = novel.currentPage >= novel.totalPages;
  const isStarted = novel.currentPage > 1 && !isCompleted;

  // Genre badge color mapping
  const getGenreColor = (genre: string) => {
    switch (genre) {
      case 'Klasik':
        return 'bg-[#F2ECE1] text-[#7A533E] border-[#E0D5C3]';
      case 'Romansa':
        return 'bg-[#FDF0F3] text-[#C95D6F] border-[#F5CCD6]';
      case 'Fantasi':
        return 'bg-[#F3EFF8] text-[#7D52A0] border-[#E0D3EF]';
      case 'Misteri':
        return 'bg-[#ECEFF3] text-[#475569] border-[#D1D9E2]';
      case 'Petualangan':
        return 'bg-[#EBF1EA] text-[#3F5241] border-[#CCD8CB]';
      case 'Horor':
        return 'bg-[#F8EFEF] text-[#991B1B] border-[#F2D1D1]';
      default:
        return 'bg-[#F5F2EB] text-[#63554A] border-[#E5DFD4]';
    }
  };

  if (layout === 'list') {
    return (
      <div className="relative group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#EBE3D3] hover:border-[#D5C6B1] shadow-sm hover:shadow-md transition-all duration-200">
        
        {/* Left: Thumbnail & Details */}
        <div 
          onClick={() => onSelect(novel)}
          className="flex items-start gap-4 flex-1 cursor-pointer"
        >
          {/* Cover thumbnail */}
          <div className="relative w-16 sm:w-20 aspect-[3/4] shrink-0 rounded-xl overflow-hidden shadow-md bg-[#EDE4D5]">
            <img
              src={novel.coverUrl}
              alt={novel.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            {/* Spine shading */}
            <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-r from-black/30 to-transparent" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getGenreColor(novel.genre)}`}>
                {novel.genre}
              </span>
              {novel.isCustom && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                  Unggahan Anda
                </span>
              )}
            </div>

            <h3 className="font-serif-novel text-base sm:text-lg font-bold text-[#3B2C21] truncate group-hover:text-[#697D67] transition-colors">
              {novel.title}
            </h3>

            <p className="text-xs text-[#7A533E] font-medium mb-1.5">
              Oleh: <span className="text-[#4A3326] font-semibold">{novel.author}</span>
            </p>

            <p className="text-xs text-[#73675C] line-clamp-1 max-w-xl">
              {novel.description}
            </p>

            {/* Reading progress in list */}
            <div className="flex items-center gap-3 mt-2 text-xs">
              <div className="flex-1 max-w-xs bg-[#EAE0D2] h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isCompleted ? 'bg-emerald-600' : 'bg-[#697D67]'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[11px] text-[#8C6D58] font-medium">
                {novel.currentPage} / {novel.totalPages} hal ({progressPercent}%)
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F0E8DC]">
          <button
            onClick={(e) => onToggleFavorite(novel.id, e)}
            className="p-2 rounded-xl hover:bg-[#FDF0F3] text-gray-400 hover:text-rose-500 transition-colors"
            title={novel.isFavorite ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
          >
            <Heart
              className={`w-4 h-4 ${
                novel.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-gray-400'
              }`}
            />
          </button>

          <button
            onClick={() => onRead(novel)}
            className="flex-1 sm:flex-none px-4 py-2 rounded-full bg-gradient-to-r from-[#8C6D58] to-[#5F4634] hover:from-[#7A583E] hover:to-[#4A3326] text-white text-xs font-semibold shadow-sm flex items-center justify-center gap-1.5 transition-all"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{novel.currentPage > 1 ? 'Lanjutkan' : 'Baca'}</span>
          </button>
        </div>

      </div>
    );
  }

  // Grid layout (Standard Library Card)
  return (
    <div className="relative group flex flex-col rounded-3xl bg-white border border-[#EBE3D3] hover:border-[#D0C0A9] overflow-hidden book-card-hover transition-all duration-300">
      
      {/* Cover Container */}
      <div 
        onClick={() => onSelect(novel)}
        className="relative w-full aspect-[3/4.2] overflow-hidden bg-[#ECE3D5] cursor-pointer"
      >
        <img
          src={novel.coverUrl}
          alt={novel.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Realistic Book Spine Effect */}
        <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/40 via-black/10 to-transparent pointer-events-none" />
        
        {/* Top Badges & Actions Overlay */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-start justify-between pointer-events-none">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm backdrop-blur-md pointer-events-auto border ${getGenreColor(novel.genre)}`}>
            {novel.genre}
          </span>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            {/* Favorite Button */}
            <button
              onClick={(e) => onToggleFavorite(novel.id, e)}
              className="p-1.5 rounded-full bg-white/85 hover:bg-white text-gray-400 hover:text-rose-500 shadow-md backdrop-blur-sm transition-all"
              title={novel.isFavorite ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  novel.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-gray-400'
                }`}
              />
            </button>

            {/* Menu Popover Toggle */}
            {(onEdit || onDelete) && (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  className="p-1.5 rounded-full bg-white/85 hover:bg-white text-[#4A3326] shadow-md backdrop-blur-sm transition-all"
                  title="Opsi Novel"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>

                {showMenu && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-8 z-30 w-36 rounded-2xl bg-white border border-[#E8DEC8] shadow-xl p-1 text-xs"
                  >
                    {onEdit && (
                      <button
                        onClick={(e) => {
                          setShowMenu(false);
                          onEdit(novel, e);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-[#F5EFE6] text-[#4A3326] text-left"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#8C6D58]" />
                        <span>Edit Informasi</span>
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={(e) => {
                          setShowMenu(false);
                          onDelete(novel, e);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-red-50 text-red-600 text-left"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        <span>Hapus Novel</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Status completion badge */}
        {isCompleted && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-emerald-600/90 text-white text-[10px] font-bold flex items-center gap-1 shadow-md">
            <CheckCircle className="w-3 h-3" />
            <span>Selesai</span>
          </div>
        )}
      </div>

      {/* Info Container */}
      <div className="p-4 flex flex-col justify-between flex-1 bg-gradient-to-b from-white to-[#FAF7F2]">
        <div>
          <h3 
            onClick={() => onSelect(novel)}
            className="font-serif-novel text-base font-bold text-[#3B2C21] line-clamp-1 cursor-pointer hover:text-[#697D67] transition-colors"
            title={novel.title}
          >
            {novel.title}
          </h3>

          <p className="text-xs text-[#7A533E] font-medium mt-0.5 truncate">
            {novel.author}
          </p>

          <p className="text-[11px] text-[#8C7E72] mt-1.5 line-clamp-2 leading-relaxed">
            {novel.description}
          </p>
        </div>

        {/* Progress & Read Action */}
        <div className="mt-3.5 pt-3 border-t border-[#F0E7D9]">
          
          {/* Progress bar */}
          <div className="mb-2.5">
            <div className="flex items-center justify-between text-[10px] text-[#8C6D58] mb-1 font-medium">
              <span>{isStarted ? `Hal. ${novel.currentPage}` : 'Belum dibaca'}</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#EAE0D2] h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isCompleted ? 'bg-emerald-600' : 'bg-[#697D67]'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSelect(novel)}
              className="py-1.5 px-2 rounded-xl bg-[#F5EFE6] hover:bg-[#EBE3D3] text-[#4A3326] text-xs font-semibold text-center transition-colors cursor-pointer"
            >
              Detail
            </button>
            <button
              onClick={() => onRead(novel)}
              className="py-1.5 px-2 rounded-xl bg-gradient-to-r from-[#697D67] to-[#4E5D4C] hover:from-[#5A6D58] hover:to-[#3F4D3D] text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer"
            >
              <BookOpen className="w-3 h-3" />
              <span>{novel.currentPage > 1 ? 'Lanjut' : 'Baca'}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
