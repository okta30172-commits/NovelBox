import React from 'react';
import { BookOpen, PlusCircle, Search, Sparkles, Menu, Heart } from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenAddModal: () => void;
  onOpenWelcome: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  favoritesCount: number;
  totalNovelsCount: number;
  userName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenAddModal,
  onOpenWelcome,
  onTabChange,
  favoritesCount,
  userName,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FAF6F0]/90 backdrop-blur-md border-b border-[#EBE3D3] px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onTabChange('beranda')}
            className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8C6D58] to-[#4A3326] flex items-center justify-center text-white shadow-md shadow-[#8C6D58]/20 group-hover:shadow-lg transition-all">
              <BookOpen className="w-5 h-5 text-[#FBF8F3]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif-novel text-xl sm:text-2xl font-bold tracking-tight text-[#4A3326]">
                  NOVEA
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#EBF1EA] text-[#3F5241] font-semibold border border-[#D5E3D4] hidden sm:inline-block">
                  Digital Library
                </span>
              </div>
              <p className="text-[11px] text-[#8C6D58] hidden md:block italic">
                Every Book Holds a New World
              </p>
            </div>
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md mx-2 hidden sm:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9E8E81]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari judul novel atau nama penulis..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-white/90 border border-[#E0D5C3] text-sm text-[#4A3326] placeholder-[#9E8E81] focus:outline-none focus:ring-2 focus:ring-[#8C6D58]/30 focus:border-[#8C6D58] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9E8E81] hover:text-[#4A3326] px-1.5 py-0.5 rounded bg-gray-100"
              >
                Hapus
              </button>
            )}
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Welcome Screen Button */}
          <button
            onClick={onOpenWelcome}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#FDF0F3] hover:bg-[#FCE3EA] text-[#C95D6F] text-xs font-semibold border border-[#F3CCD6] transition-all cursor-pointer shadow-sm"
            title="Buka Tampilan Awal / Cover Poster"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tampilan Awal</span>
          </button>

          {/* Favorites shortcut on mobile */}
          <button
            onClick={() => onTabChange('favorit')}
            className="p-2 sm:px-3 sm:py-2 rounded-full bg-white/80 hover:bg-white text-[#7A533E] border border-[#E6DAC8] text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm"
            title="Lihat Novel Favorit"
          >
            <Heart className="w-4 h-4 text-rose-500 fill-rose-100" />
            <span className="hidden sm:inline font-semibold text-[#4A3326]">{favoritesCount}</span>
          </button>

          {/* Add Novel CTA */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-gradient-to-r from-[#697D67] to-[#4E5D4C] hover:from-[#5A6D58] hover:to-[#3F4D3D] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#697D67]/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Novel</span>
          </button>

          {/* User Profile Capsule */}
          <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-[#E6DAC8]">
            <div className="w-8 h-8 rounded-full bg-[#E5D7C5] border border-[#CBB9A5] flex items-center justify-center font-bold text-[#4A3326] text-xs">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="text-left text-xs">
              <p className="font-semibold text-[#4A3326] leading-none">{userName}</p>
              <p className="text-[10px] text-[#8C6D58] leading-tight">Kolektor</p>
            </div>
          </div>

        </div>

      </div>

      {/* Mobile search input */}
      <div className="mt-2.5 sm:hidden">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9E8E81]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari novel atau penulis..."
            className="w-full pl-9 pr-3 py-1.5 rounded-full bg-white/90 border border-[#E0D5C3] text-xs text-[#4A3326] focus:outline-none focus:ring-1 focus:ring-[#8C6D58]"
          />
        </div>
      </div>
    </header>
  );
};
