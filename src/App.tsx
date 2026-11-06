/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Novel } from './types/novel';
import { NovelStorage, UserSettings, DEFAULT_SETTINGS } from './services/storage';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { HomeView } from './components/HomeView';
import { CollectionView } from './components/CollectionView';
import { BrowseView } from './components/BrowseView';
import { DetailView } from './components/DetailView';
import { NovelReader } from './components/NovelReader';
import { AddNovelModal } from './components/AddNovelModal';
import { EditNovelModal } from './components/EditNovelModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { SettingsView } from './components/SettingsView';
import { WelcomeHeroModal } from './components/WelcomeHeroModal';
import { SupabaseSetupModal } from './components/SupabaseSetupModal';
import { ToastContainer, ToastMessage, ToastType } from './components/Toast';
import { Database, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';

export default function App() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('beranda');
  
  // Navigation stack states
  const [selectedNovel, setSelectedNovel] = useState<Novel | null>(null);
  const [readingNovel, setReadingNovel] = useState<Novel | null>(null);

  // Search
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingNovel, setEditingNovel] = useState<Novel | null>(null);
  const [deletingNovel, setDeletingNovel] = useState<Novel | null>(null);
  const [isWelcomeHeroOpen, setIsWelcomeHeroOpen] = useState<boolean>(true);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);

  // Supabase Status
  const [isSupabaseActive, setIsSupabaseActive] = useState<boolean>(false);
  const [needSqlSetup, setNeedSqlSetup] = useState<boolean>(false);

  // Settings
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, message?: string, type: ToastType = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Check Supabase health & sync
  const checkSupabase = async (): Promise<boolean> => {
    const status = await NovelStorage.checkSupabaseStatus();
    if (status.connected && status.tableExists) {
      setIsSupabaseActive(true);
      setNeedSqlSetup(false);
      // Reload library from Supabase
      const res = await NovelStorage.initLibrary();
      setNovels(res.novels);
      return true;
    } else if (status.connected && !status.tableExists) {
      setIsSupabaseActive(false);
      setNeedSqlSetup(true);
      return false;
    } else {
      setIsSupabaseActive(false);
      return false;
    }
  };

  // Initialize Library & Settings
  const loadLibrary = async () => {
    setIsLoading(true);
    try {
      const res = await NovelStorage.initLibrary();
      setNovels(res.novels);
      setIsSupabaseActive(res.isSupabaseActive);
      setNeedSqlSetup(res.needSqlSetup);

      const userSettings = NovelStorage.getUserSettings();
      setSettings(userSettings);
    } catch (err) {
      console.error('Failed to load library:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLibrary();
  }, []);

  // Update Settings
  const handleSaveSettings = (updated: Partial<UserSettings>) => {
    const newSettings = NovelStorage.saveUserSettings(updated);
    setSettings(newSettings);
  };

  // Toggle Favorite
  const handleToggleFavorite = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newState = await NovelStorage.toggleFavorite(id);
    setNovels((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isFavorite: newState } : n))
    );
    if (selectedNovel && selectedNovel.id === id) {
      setSelectedNovel((prev) => (prev ? { ...prev, isFavorite: newState } : null));
    }
    showToast(
      newState ? 'Ditambahkan ke Favorit' : 'Dihapus dari Favorit',
      newState ? 'Novel berhasil disimpan dalam daftar favorit Anda.' : 'Novel dikeluarkan dari daftar favorit.',
      newState ? 'success' : 'info'
    );
  };

  // Reading Actions
  const handleStartReading = (novel: Novel) => {
    setReadingNovel(novel);
    NovelStorage.updateReadingProgress(novel.id, novel.currentPage || 1);
  };

  const handleUpdateProgress = async (novelId: string, page: number) => {
    await NovelStorage.updateReadingProgress(novelId, page);
    setNovels((prev) =>
      prev.map((n) =>
        n.id === novelId
          ? { ...n, currentPage: page, lastReadAt: new Date().toISOString() }
          : n
      )
    );
    if (selectedNovel && selectedNovel.id === novelId) {
      setSelectedNovel((prev) =>
        prev ? { ...prev, currentPage: page, lastReadAt: new Date().toISOString() } : null
      );
    }
  };

  // Edit Novel
  const handleOpenEdit = (novel: Novel, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingNovel(novel);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updated: Novel) => {
    await NovelStorage.saveNovel(updated);
    setNovels((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    if (selectedNovel && selectedNovel.id === updated.id) {
      setSelectedNovel(updated);
    }
  };

  // Delete Novel
  const handleOpenDelete = (novel: Novel, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDeletingNovel(novel);
  };

  const handleConfirmDelete = async (novel: Novel) => {
    await NovelStorage.deleteNovel(novel.id);
    setNovels((prev) => prev.filter((n) => n.id !== novel.id));
    if (selectedNovel && selectedNovel.id === novel.id) {
      setSelectedNovel(null);
    }
    if (readingNovel && readingNovel.id === novel.id) {
      setReadingNovel(null);
    }
    setDeletingNovel(null);
    showToast('Novel Dihapus', `Novel "${novel.title}" telah dihapus.`, 'info');
  };

  // Add Novel
  const handleNovelAdded = (newNovel: Novel) => {
    setNovels((prev) => [newNovel, ...prev]);
  };

  // Download PDF
  const handleDownloadPdf = async (novel: Novel) => {
    try {
      showToast('Menyiapkan Berkas PDF...', 'Sedang memproses dokumen untuk diunduh.', 'info');
      const url = await NovelStorage.getNovelPdfUrl(novel);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = novel.pdfFileName || `${novel.title.replace(/\s+/g, '_')}_NOVEA.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      showToast('Unduhan Dimulai', `File PDF "${novel.title}" siap dinikmati.`, 'success');
    } catch {
      showToast('Gagal Mengunduh', 'Tidak dapat mengunduh berkas PDF.', 'error');
    }
  };

  const favoritesCount = novels.filter((n) => n.isFavorite).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#2C241E] font-sans selection:bg-[#E8DEC8] selection:text-[#3B2C21]">
      
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Supabase Setup Modal */}
      <SupabaseSetupModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        isTableReady={isSupabaseActive}
        onCheckStatus={checkSupabase}
        onShowToast={showToast}
      />

      {/* Welcome Hero / Poster Modal */}
      <WelcomeHeroModal
        isOpen={isWelcomeHeroOpen}
        onClose={() => setIsWelcomeHeroOpen(false)}
        onStartReading={() => {
          setIsWelcomeHeroOpen(false);
          setActiveTab('koleksi');
        }}
      />

      {/* IF READING A NOVEL: Fullscreen Novel Reader */}
      {readingNovel ? (
        <NovelReader
          novel={readingNovel}
          onBackToDetail={() => {
            setSelectedNovel(readingNovel);
            setReadingNovel(null);
          }}
          onBackToHome={() => {
            setReadingNovel(null);
            setSelectedNovel(null);
            setActiveTab('beranda');
          }}
          onUpdateProgress={handleUpdateProgress}
          onShowToast={showToast}
        />
      ) : (
        /* STANDARD APP LAYOUT */
        <>
          {/* Top Navbar */}
          <Navbar
            searchQuery={searchQuery}
            onSearchChange={(q) => {
              setSearchQuery(q);
              if (selectedNovel) setSelectedNovel(null);
              if (activeTab !== 'koleksi' && q.trim()) {
                setActiveTab('koleksi');
              }
            }}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onOpenWelcome={() => setIsWelcomeHeroOpen(true)}
            onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
            isSupabaseActive={isSupabaseActive}
            activeTab={activeTab}
            onTabChange={(tab) => {
              setSelectedNovel(null);
              setActiveTab(tab);
            }}
            favoritesCount={favoritesCount}
            totalNovelsCount={novels.length}
            userName={settings.userName || 'Budi'}
          />

          {/* Banner notification if Supabase table needs SQL schema setup */}
          {needSqlSetup && (
            <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white px-4 py-2 text-xs flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2 max-w-4xl mx-auto flex-1">
                <Database className="w-4 h-4 shrink-0" />
                <span>
                  <strong>Koneksi Supabase Aktif:</strong> Jalankan skrip SQL satu kali di Dashboard Supabase untuk membuat tabel cloud.
                </span>
              </div>
              <button
                onClick={() => setIsSupabaseModalOpen(true)}
                className="px-3 py-1 rounded-full bg-white text-amber-900 font-bold hover:bg-amber-50 shrink-0 transition-all cursor-pointer shadow-xs"
              >
                Salin Skrip SQL &rarr;
              </button>
            </div>
          )}

          {/* Main Body with Sidebar */}
          <div className="flex-1 flex max-w-7xl w-full mx-auto">
            {/* Sidebar Desktop */}
            <Sidebar
              activeTab={activeTab}
              onTabChange={(tab) => {
                setSelectedNovel(null);
                setActiveTab(tab);
              }}
              favoritesCount={favoritesCount}
              totalNovelsCount={novels.length}
              onOpenAddModal={() => setIsAddModalOpen(true)}
            />

            {/* Dynamic Content View */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
              
              {/* IF A NOVEL IS SELECTED FOR DETAILS */}
              {selectedNovel ? (
                <DetailView
                  novel={selectedNovel}
                  onBackToCollection={() => setSelectedNovel(null)}
                  onBackToHome={() => {
                    setSelectedNovel(null);
                    setActiveTab('beranda');
                  }}
                  onReadNovel={handleStartReading}
                  onToggleFavorite={handleToggleFavorite}
                  onEditNovel={(novel) => handleOpenEdit(novel)}
                  onDeleteNovel={(novel) => handleOpenDelete(novel)}
                  onDownloadPdf={handleDownloadPdf}
                />
              ) : activeTab === 'beranda' ? (
                /* TAB 1: BERANDA */
                <HomeView
                  novels={novels}
                  onReadNovel={handleStartReading}
                  onSelectNovel={(novel) => setSelectedNovel(novel)}
                  onToggleFavorite={handleToggleFavorite}
                  onNavigateTab={(tab) => {
                    setSelectedNovel(null);
                    setActiveTab(tab);
                  }}
                  onOpenAddModal={() => setIsAddModalOpen(true)}
                  onOpenWelcomeHero={() => setIsWelcomeHeroOpen(true)}
                  userName={settings.userName || 'Budi'}
                />
              ) : activeTab === 'koleksi' ? (
                /* TAB 2: KOLEKSI SAYA */
                <CollectionView
                  novels={novels}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onReadNovel={handleStartReading}
                  onSelectNovel={(novel) => setSelectedNovel(novel)}
                  onToggleFavorite={handleToggleFavorite}
                  onEditNovel={handleOpenEdit}
                  onDeleteNovel={handleOpenDelete}
                  onOpenAddModal={() => setIsAddModalOpen(true)}
                  title="Koleksi Novel Lengkap"
                  subtitle="Seluruh pustaka novel digital Anda. Cari berdasarkan judul, penulis, atau filter genre."
                />
              ) : activeTab === 'jelajahi' ? (
                /* TAB 3: JELAJAHI NOVEL */
                <BrowseView
                  novels={novels}
                  onReadNovel={handleStartReading}
                  onSelectNovel={(novel) => setSelectedNovel(novel)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ) : activeTab === 'favorit' ? (
                /* TAB 4: NOVEL FAVORIT */
                <CollectionView
                  novels={novels}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onReadNovel={handleStartReading}
                  onSelectNovel={(novel) => setSelectedNovel(novel)}
                  onToggleFavorite={handleToggleFavorite}
                  onEditNovel={handleOpenEdit}
                  onDeleteNovel={handleOpenDelete}
                  onOpenAddModal={() => setIsAddModalOpen(true)}
                  title="Novel Favorit Saya"
                  subtitle="Daftar kisah kesayangan yang telah Anda beri tanda hati."
                  onlyFavorites={true}
                />
              ) : (
                /* TAB 5: PENGATURAN */
                <SettingsView
                  settings={settings}
                  onSaveSettings={handleSaveSettings}
                  novels={novels}
                  onReloadNovels={loadLibrary}
                  onOpenWelcomeHero={() => setIsWelcomeHeroOpen(true)}
                  onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
                  isSupabaseActive={isSupabaseActive}
                  onShowToast={showToast}
                />
              )}

            </main>
          </div>
        </>
      )}

      {/* Add Novel Modal */}
      <AddNovelModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onNovelAdded={handleNovelAdded}
        onShowToast={showToast}
      />

      {/* Edit Novel Modal */}
      <EditNovelModal
        isOpen={isEditModalOpen}
        novel={editingNovel}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingNovel(null);
        }}
        onSave={handleSaveEdit}
        onShowToast={showToast}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deletingNovel !== null}
        novel={deletingNovel}
        onClose={() => setDeletingNovel(null)}
        onConfirm={handleConfirmDelete}
      />

    </div>
  );
}
