import React from 'react';
import { 
  Home, 
  Library, 
  Compass, 
  Heart, 
  PlusCircle, 
  Settings, 
  BookMarked,
  Quote
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  favoritesCount: number;
  totalNovelsCount: number;
  onOpenAddModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  favoritesCount,
  totalNovelsCount,
  onOpenAddModal,
}) => {
  const navItems = [
    {
      id: 'beranda',
      label: 'Beranda',
      icon: Home,
      badge: null,
    },
    {
      id: 'koleksi',
      label: 'Koleksi Saya',
      icon: Library,
      badge: totalNovelsCount,
    },
    {
      id: 'jelajahi',
      label: 'Jelajahi Novel',
      icon: Compass,
      badge: null,
    },
    {
      id: 'favorit',
      label: 'Favorit',
      icon: Heart,
      badge: favoritesCount > 0 ? favoritesCount : null,
      badgeColor: 'bg-rose-100 text-rose-700',
    },
    {
      id: 'tambah',
      label: 'Tambahkan Novel',
      icon: PlusCircle,
      isAction: true,
      action: onOpenAddModal,
    },
    {
      id: 'pengaturan',
      label: 'Pengaturan',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-[#F5EFE6]/60 border-r border-[#E8DEC8] p-4 min-h-[calc(100vh-65px)] justify-between">
        <div className="space-y-6">
          
          {/* Main Navigation */}
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-[#9E8E81] mb-2">
              Menu Utama
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.isAction && item.action) {
                      item.action();
                    } else {
                      onTabChange(item.id);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#697D67] to-[#4E5D4C] text-white shadow-md shadow-[#697D67]/20 font-semibold'
                      : 'text-[#4A3326] hover:bg-[#EAE0D2]/70 hover:text-[#2C241E]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#8C6D58]'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== null && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeColor || 'bg-[#E5D7C5] text-[#4A3326]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Stats Card */}
          <div className="p-4 rounded-2xl bg-white/70 border border-[#E5DAC8] shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-[#4A3326] mb-2">
              <BookMarked className="w-4 h-4 text-[#697D67]" />
              <span>Status Koleksi Budi</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-[#FAF6F0] border border-[#EBE3D3]">
                <p className="text-[10px] text-[#8C6D58]">Total Buku</p>
                <p className="text-base font-bold text-[#4A3326]">{totalNovelsCount}</p>
              </div>
              <div className="p-2 rounded-xl bg-[#FAF6F0] border border-[#EBE3D3]">
                <p className="text-[10px] text-[#8C6D58]">Favorit</p>
                <p className="text-base font-bold text-rose-600">{favoritesCount}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Quote Widget */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#EBF1EA] to-[#E3EBE2] border border-[#CCD8CB] text-xs text-[#3F5241]">
          <Quote className="w-4 h-4 text-[#697D67] mb-1.5 opacity-70" />
          <p className="italic leading-relaxed font-serif text-[11.5px]">
            &ldquo;Setiap buku adalah jendela menuju semesta baru yang menanti untuk dijelajahi.&rdquo;
          </p>
          <p className="mt-2 text-[10px] text-[#697D67] font-semibold">
            — Filosofi Perpustakaan NOVEA
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF6F0]/95 backdrop-blur-md border-t border-[#E8DEC8] px-2 py-1.5 flex items-center justify-around shadow-lg">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.isAction && item.action) {
                  item.action();
                } else {
                  onTabChange(item.id);
                }
              }}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all relative ${
                isActive ? 'text-[#3F5241] font-bold' : 'text-[#8C6D58] hover:text-[#4A3326]'
              }`}
            >
              <div
                className={`p-1 rounded-lg ${
                  isActive ? 'bg-[#EBF1EA]' : ''
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
              {item.badge !== null && (
                <span className="absolute top-1 right-2 w-3.5 h-3.5 bg-rose-500 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};
