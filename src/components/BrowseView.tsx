import React, { useState } from 'react';
import { Novel } from '../types/novel';
import { NovelCard } from './NovelCard';
import { Compass, Sparkles, BookOpen, Award, Globe, ArrowRight } from 'lucide-react';

interface BrowseViewProps {
  novels: Novel[];
  onReadNovel: (novel: Novel) => void;
  onSelectNovel: (novel: Novel) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

export const BrowseView: React.FC<BrowseViewProps> = ({
  novels,
  onReadNovel,
  onSelectNovel,
  onToggleFavorite,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'semua' | 'klasik' | 'nusantara' | 'fantasi'>('semua');

  const classics = novels.filter(n => n.genre === 'Klasik' || n.publishedYear! < 1950);
  const nusantara = novels.filter(n => 
    n.tags.some(t => t.toLowerCase().includes('nusantara') || t.toLowerCase().includes('indonesia')) ||
    ['Rian Pratama', 'Seno Adiwangsa', 'Dian Maharani'].includes(n.author)
  );
  const fantasyAndAdventure = novels.filter(n => ['Fantasi', 'Petualangan', 'Misteri'].includes(n.genre));

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF1EA] text-[#3F5241] text-xs font-bold border border-[#CCD8CB] mb-2">
          <Compass className="w-3.5 h-3.5 text-[#697D67]" />
          <span>Eksplorasi Katalog Novel</span>
        </div>
        <h1 className="font-serif-novel text-2xl sm:text-3xl font-extrabold text-[#3B2C21]">
          Jelajahi Dunia Novel
        </h1>
        <p className="text-xs sm:text-sm text-[#73675C] mt-1">
          Temukan mahakarya sastra dunia yang melintasi zaman serta fiksi orisinal Indonesia yang penuh misteri dan petualangan.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'semua', label: 'Semua Kurasi' },
          { id: 'klasik', label: 'Klasik Sastra Dunia' },
          { id: 'nusantara', label: 'Fiksi Orisinal Indonesia' },
          { id: 'fantasi', label: 'Fantasi & Petualangan' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id as any)}
            className={`px-4 py-2 rounded-full font-semibold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === tab.id
                ? 'bg-[#697D67] text-white shadow-sm'
                : 'bg-white hover:bg-[#F5EFE6] text-[#7A533E] border border-[#E0D5C3]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SECTION 1: Mahakarya Sastra Klasik Dunia */}
      {(selectedCategory === 'semua' || selectedCategory === 'klasik') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E8DEC8]">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#8C6D58]" />
              <div>
                <h2 className="font-serif-novel text-xl font-bold text-[#3B2C21]">
                  Karya Klasik Abadi Dunia
                </h2>
                <p className="text-[11px] text-[#8C6D58]">
                  Karya abadi Jane Austen, Lewis Carroll, Mary Shelley, Mark Twain, dan penulis legendaris lainnya.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {classics.map((novel) => (
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
      )}

      {/* SECTION 2: Fiksi Orisinal Indonesia */}
      {(selectedCategory === 'semua' || selectedCategory === 'nusantara') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E8DEC8]">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#697D67]" />
              <div>
                <h2 className="font-serif-novel text-xl font-bold text-[#3B2C21]">
                  Fiksi Orisinal Berbahasa Indonesia
                </h2>
                <p className="text-[11px] text-[#8C6D58]">
                  Kisah misteri Kaliurang, petualangan Lembah Kabut Merbabu, dan romansa Kota Tua Batavia.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {nusantara.map((novel) => (
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
      )}

      {/* SECTION 3: Fantasi & Petualangan Menegangkan */}
      {(selectedCategory === 'semua' || selectedCategory === 'fantasi') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E8DEC8]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C95D6F]" />
              <div>
                <h2 className="font-serif-novel text-xl font-bold text-[#3B2C21]">
                  Fantasi, Misteri & Petualangan
                </h2>
                <p className="text-[11px] text-[#8C6D58]">
                  Menjelajahi dunia baru yang penuh teka-teki, magis, dan aksi seru.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {fantasyAndAdventure.map((novel) => (
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
      )}

    </div>
  );
};
