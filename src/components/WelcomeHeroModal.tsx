import React from 'react';
import { BookOpen, Sparkles, ArrowRight, X, Heart, Library } from 'lucide-react';

interface WelcomeHeroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartReading: () => void;
}

export const WelcomeHeroModal: React.FC<WelcomeHeroModalProps> = ({
  isOpen,
  onClose,
  onStartReading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-fadeIn">
      {/* Container */}
      <div className="relative w-full max-w-md sm:max-w-4xl max-h-[92vh] overflow-hidden rounded-3xl bg-[#FAF6F0] shadow-2xl border border-[#E8DEC8] flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/80 hover:bg-white text-[#7A533E] hover:text-[#4A3326] shadow-md transition-all duration-200"
          title="Tutup & Masuk ke Perpustakaan"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Visual Artwork Column (User Attachment) */}
        <div className="relative md:w-1/2 w-full h-80 md:h-auto bg-[#F7E7EC] overflow-hidden flex items-center justify-center">
          <img
            src="/assets/aistudio/gambar_novelBox_9e9d682e.jpeg"
            alt="NOVEA - Digital Novel Library"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:hidden" />
          
          <div className="absolute bottom-4 left-4 right-4 md:hidden text-white drop-shadow-md">
            <h3 className="font-serif-novel text-2xl font-bold">NOVEA</h3>
            <p className="text-xs text-rose-100">Every Book Holds a New World</p>
          </div>
        </div>

        {/* Content Column */}
        <div className="md:w-1/2 w-full p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-b from-[#FAF6F0] via-[#FCF9F3] to-[#F5EFE6] overflow-y-auto">
          
          {/* Top Brand Badge */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF1EA] border border-[#CCD8CB] text-[#3F5241] text-xs font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#697D67]" />
              <span>Perpustakaan Novel Digital Terkurasi</span>
            </div>

            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E07A8A] to-[#C95D6F] flex items-center justify-center text-white shadow-md">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#4A3326] font-serif-novel">
                  NOVEA
                </h1>
                <p className="text-xs text-[#8C6D58] font-medium">Digital Novel Library</p>
              </div>
            </div>

            <p className="text-sm italic font-serif text-[#7A533E] mb-4">
              &ldquo;Every Book Holds a New World.&rdquo;
            </p>

            <div className="p-4 rounded-2xl bg-white/70 border border-[#EAE0D2] shadow-sm mb-5">
              <div className="flex items-center gap-2 text-rose-600 font-semibold text-sm mb-1.5">
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                <span>Baca lebih banyak, temukan cerita favoritmu!</span>
              </div>
              <p className="text-xs text-[#73675C] leading-relaxed">
                Platform khusus untuk kolektor seperti Budi. Simpan berkas novel PDF, cari judul atau penulis favorit dalam sekejap, dan nikmati bacaan nyaman dengan progres tersimpan otomatis.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 gap-2.5 mb-6 text-xs text-[#4A3326]">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF1F3] border border-[#F2D7DE]">
                <span className="w-2 h-2 rounded-full bg-[#E07A8A]" />
                <span className="font-medium">Pembaca PDF Terpadu</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F0F5EF] border border-[#D5E3D4]">
                <span className="w-2 h-2 rounded-full bg-[#697D67]" />
                <span className="font-medium">Progres Baca Tersimpan</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FBF3E8] border border-[#EED9C0]">
                <span className="w-2 h-2 rounded-full bg-[#C4A482]" />
                <span className="font-medium">Koleksi Klasik & Lokal</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F3EFF8] border border-[#DDD4EA]">
                <span className="w-2 h-2 rounded-full bg-[#9370DB]" />
                <span className="font-medium">Katalog Favorit Rapi</span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-2 border-t border-[#EAE0D2]">
            <button
              onClick={onStartReading}
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#E07A8A] via-[#E88B97] to-[#D96B7C] hover:from-[#D86879] hover:to-[#C65667] text-white font-semibold text-sm sm:text-base shadow-lg shadow-rose-200/50 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span>Mulai Membaca</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 mt-3.5 text-xs text-[#8C6D58]">
              <Library className="w-3.5 h-3.5 text-[#697D67]" />
              <span>Teman terbaik untuk pecinta novel</span>
              <Heart className="w-3 h-3 text-rose-400 fill-rose-300" />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
