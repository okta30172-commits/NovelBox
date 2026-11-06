import React from 'react';
import { Novel } from '../types/novel';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  novel: Novel | null;
  onClose: () => void;
  onConfirm: (novel: Novel) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  novel,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !novel) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-white border border-[#F5C2C2] shadow-2xl p-6 text-center">
        
        <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-200">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h3 className="font-serif-novel text-xl font-bold text-[#3B2C21] mb-2">
          Hapus Novel dari Koleksi?
        </h3>

        <p className="text-xs sm:text-sm text-[#73675C] mb-4 leading-relaxed">
          Apakah Anda yakin ingin menghapus novel <strong>&ldquo;{novel.title}&rdquo;</strong> karya <em>{novel.author}</em>? Berkas PDF dan progres baca novel ini akan dihapus dari perpustakaan lokal Anda.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-[#FAF6F0] hover:bg-[#EBE3D3] text-[#4A3326] text-xs font-semibold border border-[#E0D5C3] transition-all cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={() => onConfirm(novel)}
            className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md shadow-red-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Ya, Hapus Novel</span>
          </button>
        </div>

      </div>
    </div>
  );
};
