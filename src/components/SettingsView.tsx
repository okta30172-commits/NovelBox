import React, { useState } from 'react';
import { Novel } from '../types/novel';
import { UserSettings, NovelStorage } from '../services/storage';
import { 
  Settings, 
  User, 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  BookMarked,
  Heart
} from 'lucide-react';

interface SettingsViewProps {
  settings: UserSettings;
  onSaveSettings: (settings: Partial<UserSettings>) => void;
  novels: Novel[];
  onReloadNovels: () => void;
  onOpenWelcomeHero: () => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  novels,
  onReloadNovels,
  onOpenWelcomeHero,
  onShowToast,
}) => {
  const [userName, setUserName] = useState(settings.userName || 'Budi');
  const [userBio, setUserBio] = useState(settings.userBio || 'Kolektor novel digital dan penikmat sastra.');
  const [isSaved, setIsSaved] = useState(false);

  // Backup export
  const handleExportBackup = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(novels, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `NOVEA_Library_Backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      onShowToast('Cadangan Berhasil Diekspor', 'File JSON perpustakaan Anda berhasil diunduh.', 'success');
    } catch {
      onShowToast('Gagal Ekspor', 'Terjadi kesalahan saat mengekspor data.', 'error');
    }
  };

  // Restore import
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            if (item.id && item.title) {
              await NovelStorage.saveNovel(item);
            }
          }
          onReloadNovels();
          onShowToast('Impor Berhasil', `Berhasil memulihkan ${parsed.length} novel ke perpustakaan!`, 'success');
        } else {
          onShowToast('Format Tidak Valid', 'File cadangan harus berupa array novel NOVEA.', 'error');
        }
      } catch {
        onShowToast('Gagal Impor', 'File JSON rusak atau tidak sesuai format.', 'error');
      }
    };
    reader.readAsText(file);
  };

  // Reset to default sample novels
  const handleResetDefaults = async () => {
    if (window.confirm('Apakah Anda ingin memulihkan novel contoh bawaan (Pride and Prejudice, Alice, Frankenstein, novel Nusantara, dll)? Novel kustom Anda akan direset.')) {
      await NovelStorage.resetToDefaults();
      onReloadNovels();
      onShowToast('Koleksi Dipulihkan', 'Novel contoh klasik dan lokal berhasil dipulihkan.', 'success');
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({ userName, userBio });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    onShowToast('Profil Diperbarui', 'Nama dan bio kolektor berhasil disimpan.', 'success');
  };

  const customUploadedCount = novels.filter(n => n.isCustom).length;
  const totalPagesRead = novels.reduce((acc, curr) => acc + (curr.currentPage || 1), 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-16">
      
      {/* Title */}
      <div>
        <h1 className="font-serif-novel text-2xl sm:text-3xl font-extrabold text-[#3B2C21]">
          Pengaturan Perpustakaan
        </h1>
        <p className="text-xs sm:text-sm text-[#73675C] mt-1">
          Sesuaikan profil kolektor, kelola pencadangan data, dan atur preferensi membaca.
        </p>
      </div>

      {/* Profil Kolektor */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8DEC8] shadow-sm">
        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[#F0E7D9]">
          <User className="w-5 h-5 text-[#697D67]" />
          <h2 className="font-serif-novel text-lg font-bold text-[#3B2C21]">
            Profil Kolektor
          </h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-xs font-bold text-[#4A3326] mb-1.5">
              Nama Kolektor / Pembaca
            </label>
            <input
              type="text"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#E0D5C3] text-sm text-[#4A3326] focus:outline-none focus:ring-2 focus:ring-[#697D67]/30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A3326] mb-1.5">
              Deskripsi Singkat / Bio
            </label>
            <textarea
              rows={2}
              value={userBio}
              onChange={(e) => setUserBio(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#E0D5C3] text-sm text-[#4A3326] focus:outline-none focus:ring-2 focus:ring-[#697D67]/30"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-full bg-[#697D67] hover:bg-[#5A6D58] text-white text-xs sm:text-sm font-semibold shadow-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            {isSaved ? <Check className="w-4 h-4" /> : null}
            <span>{isSaved ? 'Tersimpan!' : 'Simpan Profil'}</span>
          </button>
        </form>
      </section>

      {/* Tampilan Poster Awal Banner (Matching user image) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#FAF0F3] to-[#FCE8ED] border border-[#F3CCD6] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-rose-600 text-xs font-bold border border-rose-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tampilan Awal Estetik</span>
          </div>
          <h3 className="font-serif-novel text-xl font-bold text-[#3B2C21]">
            Poster & Sapaan Awal NOVEA
          </h3>
          <p className="text-xs text-[#73675C] max-w-md">
            Buka kembali ilustrasi jendela perpustakaan berbunga sakura dan pesan sambutan yang menyejukkan hati.
          </p>
        </div>

        <button
          onClick={onOpenWelcomeHero}
          className="px-5 py-3 rounded-full bg-gradient-to-r from-[#E07A8A] to-[#D96B7C] hover:from-[#D86879] hover:to-[#C65667] text-white text-xs sm:text-sm font-semibold shadow-md flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Buka Tampilan Awal</span>
        </button>
      </section>

      {/* Storage & Backup Section */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8DEC8] shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#F0E7D9]">
          <Database className="w-5 h-5 text-[#8C6D58]" />
          <h2 className="font-serif-novel text-lg font-bold text-[#3B2C21]">
            Penyimpanan & Cadangan Data
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#EBE3D3]">
            <p className="text-xs text-[#8C6D58]">Total Novel Terdaftar</p>
            <p className="text-xl font-extrabold text-[#3B2C21] mt-0.5">{novels.length}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#EBE3D3]">
            <p className="text-xs text-[#8C6D58]">Novel Diunggah Sendiri</p>
            <p className="text-xl font-extrabold text-[#3B2C21] mt-0.5">{customUploadedCount}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#EBE3D3]">
            <p className="text-xs text-[#8C6D58]">Total Halaman Terbaca</p>
            <p className="text-xl font-extrabold text-[#697D67] mt-0.5">{totalPagesRead} Hal</p>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Export */}
          <button
            onClick={handleExportBackup}
            className="p-4 rounded-2xl bg-[#FAF6F0] hover:bg-[#EBE3D3] border border-[#E0D5C3] text-left transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-white border border-[#D5C6B1] flex items-center justify-center text-[#7A533E] mb-2 group-hover:scale-105 transition-transform">
              <Download className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-[#3B2C21]">Ekspor Cadangan Koleksi</p>
            <p className="text-[11px] text-[#73675C] mt-0.5">Unduh file JSON cadangan seluruh katalog Anda.</p>
          </button>

          {/* Import */}
          <label className="p-4 rounded-2xl bg-[#FAF6F0] hover:bg-[#EBE3D3] border border-[#E0D5C3] text-left transition-all cursor-pointer group">
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
            <div className="w-8 h-8 rounded-xl bg-white border border-[#D5C6B1] flex items-center justify-center text-[#697D67] mb-2 group-hover:scale-105 transition-transform">
              <Upload className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-[#3B2C21]">Impor Cadangan</p>
            <p className="text-[11px] text-[#73675C] mt-0.5">Pulihkan daftar novel dari berkas JSON sebelumnya.</p>
          </label>

          {/* Reset Defaults */}
          <button
            onClick={handleResetDefaults}
            className="p-4 rounded-2xl bg-amber-50/60 hover:bg-amber-100/70 border border-amber-200 text-left transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-white border border-amber-300 flex items-center justify-center text-amber-700 mb-2 group-hover:scale-105 transition-transform">
              <RotateCcw className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-amber-900">Pulihkan Contoh Bawaan</p>
            <p className="text-[11px] text-amber-800/80 mt-0.5">Kembalikan 9 novel contoh klasik & Indonesia.</p>
          </button>
        </div>
      </section>

      {/* Info About NOVEA */}
      <section className="p-6 rounded-3xl bg-white/70 border border-[#E8DEC8] text-xs text-[#73675C] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-[#697D67]" />
          <div>
            <p className="font-bold text-[#4A3326]">NOVEA Digital Novel Library v2.0</p>
            <p className="text-[11px]">Didesain khusus untuk kenyamanan membaca novel dan pengelolaan berkas PDF.</p>
          </div>
        </div>
        <span className="text-[11px] text-[#8C6D58] italic font-serif">
          Every Book Holds a New World
        </span>
      </section>

    </div>
  );
};
