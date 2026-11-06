import React, { useState } from 'react';
import { 
  Database, 
  Copy, 
  Check, 
  ExternalLink, 
  X, 
  RefreshCw, 
  ShieldCheck, 
  AlertTriangle,
  HardDrive,
  FileCode
} from 'lucide-react';
import { SQL_SCHEMA_SCRIPT, SUPABASE_URL } from '../services/supabase';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  isTableReady: boolean;
  onCheckStatus: () => Promise<boolean>;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({
  isOpen,
  onClose,
  isTableReady,
  onCheckStatus,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SQL_SCHEMA_SCRIPT);
    setCopied(true);
    onShowToast('Skrip SQL Disalin!', 'Tempelkan skrip di SQL Editor Supabase lalu klik Run.', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCheckNow = async () => {
    setIsChecking(true);
    try {
      const ready = await onCheckStatus();
      if (ready) {
        onShowToast('Koneksi Supabase Sukses!', 'Tabel novels terdeteksi. Data telah tersinkronisasi ke cloud!', 'success');
      } else {
        onShowToast('Tabel Belum Ditemukan', 'Pastikan skrip SQL sudah dijalankan di Supabase SQL Editor.', 'info');
      }
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#FAF6F0] border border-[#E8DEC8] shadow-2xl p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8DEC8]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-novel text-xl font-bold text-[#3B2C21]">
                Koneksi Database Supabase Cloud
              </h2>
              <p className="text-xs text-[#8C6D58]">
                Proyek: <span className="font-mono text-emerald-800 font-semibold">{SUPABASE_URL}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[#EBE3D3] text-[#7A533E]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Indicators */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
            isTableReady 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              isTableReady ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
            }`}>
              {isTableReady ? <ShieldCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-xs font-bold">
                {isTableReady ? 'Tabel Cloud Aktif' : 'Perlu Inisialisasi Tabel'}
              </p>
              <p className="text-[11px] opacity-80">
                {isTableReady 
                  ? 'Tabel "novels" & "bookmarks" siap di Supabase.' 
                  : 'Jalankan skrip SQL di bawah di SQL Editor.'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl border bg-emerald-50 border-emerald-200 text-emerald-900 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold">Storage Bucket: Siap</p>
              <p className="text-[11px] opacity-80">
                Bucket "novels" aktif untuk penyimpanan file PDF & cover.
              </p>
            </div>
          </div>
        </div>

        {/* Steps Guide */}
        <div className="mt-5 p-4 rounded-2xl bg-white border border-[#E8DEC8] space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A533E] flex items-center gap-1.5">
            <FileCode className="w-4 h-4 text-emerald-600" />
            <span>Langkah Menyiapkan Tabel Supabase (Hanya 1 Menit)</span>
          </h3>

          <ol className="text-xs text-[#5C4D42] space-y-2 list-decimal list-inside leading-relaxed">
            <li>
              Klik tombol <strong>&ldquo;Salin Skrip SQL&rdquo;</strong> di bawah.
            </li>
            <li>
              Buka link <a 
                href="https://supabase.com/dashboard/project/zzfdbszptsokcqchgydi/sql/new" 
                target="_blank" 
                rel="noreferrer"
                className="text-emerald-700 font-bold underline inline-flex items-center gap-1 hover:text-emerald-800"
              >
                <span>Supabase SQL Editor</span>
                <ExternalLink className="w-3 h-3" />
              </a>.
            </li>
            <li>
              Tempelkan (Paste) skrip SQL pada editor lalu klik tombol hijau <strong>&ldquo;Run&rdquo;</strong>.
            </li>
            <li>
              Kembali ke sini dan klik tombol <strong>&ldquo;Cek & Sinkronkan Sekarang&rdquo;</strong>.
            </li>
          </ol>
        </div>

        {/* Code Preview Box */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4A3326]">Skrip SQL (CREATE TABLE & RLS Policy):</span>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin Skrip SQL'}</span>
            </button>
          </div>

          <div className="relative rounded-2xl bg-[#1E1E24] text-[#E0E0E0] p-4 font-mono text-[11px] max-h-48 overflow-y-auto border border-neutral-700 select-all">
            <pre className="whitespace-pre-wrap">{SQL_SCHEMA_SCRIPT}</pre>
          </div>
        </div>

        {/* Action Footer */}
        <div className="mt-6 pt-4 border-t border-[#E8DEC8] flex flex-wrap items-center justify-between gap-3">
          <a
            href="https://supabase.com/dashboard/project/zzfdbszptsokcqchgydi/sql/new"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-full bg-white hover:bg-[#EBE3D3] text-[#4A3326] text-xs font-semibold border border-[#E0D5C3] flex items-center gap-1.5 transition-all"
          >
            <span>Buka Dashboard Supabase</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#8C6D58]" />
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-full bg-white hover:bg-[#EBE3D3] text-[#4A3326] text-xs font-semibold border border-[#E0D5C3]"
            >
              Tutup
            </button>

            <button
              onClick={handleCheckNow}
              disabled={isChecking}
              className="px-5 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-md flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
              <span>{isChecking ? 'Memeriksa...' : 'Cek & Sinkronkan Sekarang'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
