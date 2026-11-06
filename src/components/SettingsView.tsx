import React, { useState } from 'react';
import { Novel } from '../types/novel';
import { UserSettings, NovelStorage } from '../services/storage';
import { SUPABASE_URL } from '../services/supabase';
import { 
  User, 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  FileCode,
  ExternalLink,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

interface SettingsViewProps {
  settings: UserSettings;
  onSaveSettings: (settings: Partial<UserSettings>) => void;
  novels: Novel[];
  onReloadNovels: () => void;
  onOpenWelcomeHero: () => void;
  onOpenSupabaseModal: () => void;
  isSupabaseActive: boolean;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  novels,
  onReloadNovels,
  onOpenWelcomeHero,
  onOpenSupabaseModal,
  isSupabaseActive,
  onShowToast,
}) => {
  const [userName, setUserName] = useState(settings.userName || 'Budi');
  const [userBio, setUserBio] = useState(settings.userBio || 'Kolektor novel digital dan penikmat sastra.');
  const [isSaved, setIsSaved] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

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

  // Sync all to Supabase
  const handleSyncToSupabase = async () => {
    setIsSyncing(true);
    try {
      const res = await NovelStorage.syncAllToSupabase(novels);
      if (res.success) {
        onShowToast('Sinkronisasi Berhasil!', `${res.count} novel berhasil diunggah ke Supabase Cloud.`, 'success');
      } else {
        onShowToast('Gagal Sinkronisasi', res.error || 'Pastikan tabel di Supabase sudah siap.', 'error');
      }
    } finally {
      setIsSyncing(false);
    }
  };

  // Reset to default sample novels
  const handleResetDefaults = async () => {
    if (window.confirm('Apakah Anda ingin memulihkan novel contoh bawaan? Novel contoh akan diperbarui di perpustakaan.')) {
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
          Sesuaikan profil kolektor, kelola koneksi Supabase Cloud, dan atur pencadangan data.
        </p>
      </div>

      {/* Supabase Cloud Connection Status Card */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8DEC8] shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0E7D9]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-novel text-lg font-bold text-[#3B2C21]">
                Database & Storage Supabase Cloud
              </h2>
              <p className="text-xs text-[#8C6D58]">
                Koneksi aktif ke Supabase PostgreSQL & Bucket Storage
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-emerald-50 text-emerald-800 border-emerald-300">
            <span className={`w-2 h-2 rounded-full ${isSupabaseActive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span>{isSupabaseActive ? 'Cloud Online' : 'Perlu Setup Tabel'}</span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#EBE3D3]">
            <p className="text-[#8C6D58] font-medium">Supabase Project Endpoint:</p>
            <p className="font-mono text-[11px] font-bold text-[#3B2C21] mt-0.5 truncate">{SUPABASE_URL}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#EBE3D3]">
            <p className="text-[#8C6D58] font-medium">Storage Bucket ("novels"):</p>
            <p className="font-bold text-emerald-800 mt-0.5 flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Terkonfigurasi untuk Berkas PDF & Gambar</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={onOpenSupabaseModal}
            className="px-4 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <FileCode className="w-4 h-4" />
            <span>Buka Skrip SQL & Pengaturan Supabase</span>
          </button>

          <button
            onClick={handleSyncToSupabase}
            disabled={isSyncing}
            className="px-4 py-2.5 rounded-full bg-[#FAF6F0] hover:bg-[#EBE3D3] text-[#4A3326] text-xs font-semibold border border-[#E0D5C3] flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Novel ke Supabase'}</span>
          </button>

          <a
            href="https://supabase.com/dashboard/project/zzfdbszptsokcqchgydi"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-full hover:bg-[#FAF6F0] text-[#7A533E] text-xs font-medium flex items-center gap-1.5 transition-all"
          >
            <span>Buka Dashboard Supabase</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

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

      {/* Tampilan Poster Awal Banner */}
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
            Statistik & Cadangan Berkas
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
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          <div>
            <p className="font-bold text-[#4A3326]">NOVEA Digital Novel Library &bull; Supabase Edition</p>
            <p className="text-[11px]">Terhubung ke Supabase PostgreSQL & Storage di cloud.</p>
          </div>
        </div>
        <span className="text-[11px] text-[#8C6D58] italic font-serif">
          Every Book Holds a New World
        </span>
      </section>

    </div>
  );
};
