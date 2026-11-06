import React, { useState, useEffect, useRef } from 'react';
import { Novel, Bookmark, ReaderTheme, ReaderFontSize } from '../types/novel';
import { NovelStorage } from '../services/storage';
import { 
  ArrowLeft, 
  Home, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Minimize, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark as BookmarkIcon, 
  BookmarkCheck,
  Type, 
  Palette, 
  Layers, 
  FileText, 
  BookOpen, 
  RotateCcw,
  Check,
  ListOrdered,
  Download
} from 'lucide-react';

interface NovelReaderProps {
  novel: Novel;
  onBackToDetail: () => void;
  onBackToHome: () => void;
  onUpdateProgress: (novelId: string, page: number) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

export const NovelReader: React.FC<NovelReaderProps> = ({
  novel,
  onBackToDetail,
  onBackToHome,
  onUpdateProgress,
  onShowToast,
}) => {
  // Page tracking
  const [currentPage, setCurrentPage] = useState<number>(novel.currentPage || 1);
  const totalPages = novel.totalPages || 1;

  // View mode: 'pdf' for embedded document view, or 'reader' for digital book format
  const [readMode, setReadMode] = useState<'pdf' | 'book'>('book');
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [isLoadingPdf, setIsLoadingPdf] = useState<boolean>(false);

  // Zoom controls
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Reader customization
  const [theme, setTheme] = useState<ReaderTheme>('cream');
  const [fontSize, setFontSize] = useState<ReaderFontSize>('base');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showToc, setShowToc] = useState<boolean>(false);
  const [showAppearance, setShowAppearance] = useState<boolean>(false);

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const isCurrentPageBookmarked = bookmarks.some(b => b.page === currentPage);

  // Container refs
  const readerContainerRef = useRef<HTMLDivElement>(null);

  // Fetch or generate PDF URL on mount
  useEffect(() => {
    let isMounted = true;
    setIsLoadingPdf(true);
    NovelStorage.getNovelPdfUrl(novel).then(url => {
      if (isMounted) {
        setPdfUrl(url);
        setIsLoadingPdf(false);
      }
    }).catch(err => {
      console.error(err);
      if (isMounted) setIsLoadingPdf(false);
    });

    // Load bookmarks
    NovelStorage.getBookmarks(novel.id).then(bms => {
      if (isMounted) setBookmarks(bms);
    });

    return () => {
      isMounted = false;
    };
  }, [novel]);

  // Sync progress when page changes
  const handlePageChange = (newPage: number) => {
    const clamped = Math.max(1, Math.min(newPage, totalPages));
    setCurrentPage(clamped);
    onUpdateProgress(novel.id, clamped);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (currentPage < totalPages) handlePageChange(currentPage + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentPage > 1) handlePageChange(currentPage - 1);
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, isFullscreen]);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      readerContainerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Toggle bookmark
  const handleToggleBookmark = async () => {
    if (isCurrentPageBookmarked) {
      const target = bookmarks.find(b => b.page === currentPage);
      if (target) {
        await NovelStorage.removeBookmark(target.id);
        setBookmarks(prev => prev.filter(b => b.id !== target.id));
        onShowToast('Bookmark Dihapus', `Penanda pada halaman ${currentPage} telah dihapus.`);
      }
    } else {
      const newBm: Bookmark = {
        id: `bm-${Date.now()}`,
        novelId: novel.id,
        page: currentPage,
        chapterTitle: novel.chapters?.[currentPage - 1]?.title || `Halaman ${currentPage}`,
        createdAt: new Date().toISOString(),
      };
      await NovelStorage.addBookmark(newBm);
      setBookmarks(prev => [...prev, newBm]);
      onShowToast('Bookmark Disimpan', `Halaman ${currentPage} berhasil ditandai!`, 'success');
    }
  };

  // Reader Themes mapping
  const getThemeClasses = () => {
    switch (theme) {
      case 'white':
        return 'bg-[#FFFFFF] text-[#1F2937] border-[#E5E7EB]';
      case 'sage':
        return 'bg-[#EEF3ED] text-[#2D3B2C] border-[#CCD8CB]';
      case 'night':
        return 'bg-[#181A1B] text-[#D1D5DB] border-[#2E3235]';
      case 'cream':
      default:
        return 'bg-[#FAF6EE] text-[#33271E] border-[#EAE0D2]';
    }
  };

  // Reader Font Size mapping
  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'sm':
        return 'text-sm sm:text-base leading-relaxed';
      case 'lg':
        return 'text-lg sm:text-xl leading-loose';
      case 'xl':
        return 'text-xl sm:text-2xl leading-loose';
      case 'base':
      default:
        return 'text-base sm:text-lg leading-relaxed';
    }
  };

  // Content for current page
  const pageText = novel.contentPages?.[currentPage - 1] 
    || novel.chapters?.[currentPage - 1]?.content 
    || `${novel.title}\n\nHalaman ${currentPage}\n\n${novel.description}`;

  const currentChapterTitle = novel.chapters?.[currentPage - 1]?.title;

  return (
    <div 
      ref={readerContainerRef}
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        isFullscreen ? 'fixed inset-0 z-50 bg-[#FAF6EE]' : 'relative'
      }`}
    >
      
      {/* Top Reader Bar (CRITICAL MANDATE: Provide Back to Detail & Back to Home) */}
      <header className="sticky top-0 z-40 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#E8DEC8] px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 shadow-sm">
        
        {/* Left: Return Navigation */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onBackToDetail}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-[#EBE3D3] text-[#4A3326] text-xs sm:text-sm font-semibold border border-[#E0D5C3] transition-all cursor-pointer shadow-xs"
            title="Kembali ke Detail Novel"
          >
            <ArrowLeft className="w-4 h-4 text-[#8C6D58]" />
            <span className="hidden sm:inline">Detail</span>
          </button>

          <button
            onClick={onBackToHome}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-[#FAF6F0] text-[#7A533E] text-xs sm:text-sm font-medium transition-all cursor-pointer"
            title="Kembali ke Beranda"
          >
            <Home className="w-4 h-4 text-[#8C6D58]" />
            <span className="hidden md:inline">Beranda</span>
          </button>
        </div>

        {/* Center: Title & Reading Mode Switcher */}
        <div className="flex flex-col items-center max-w-xs sm:max-w-md text-center">
          <h2 className="font-serif-novel text-xs sm:text-sm font-bold text-[#3B2C21] truncate max-w-[200px] sm:max-w-xs">
            {novel.title}
          </h2>
          
          {/* Dual Mode Switcher */}
          <div className="flex items-center p-0.5 rounded-full bg-[#EAE0D2] border border-[#DDD1BE] text-[10px] font-semibold mt-0.5">
            <button
              onClick={() => setReadMode('book')}
              className={`px-2.5 py-0.5 rounded-full transition-all ${
                readMode === 'book'
                  ? 'bg-white text-[#4A3326] shadow-xs font-bold'
                  : 'text-[#7A533E] hover:text-[#3B2C21]'
              }`}
            >
              Mode Buku
            </button>
            <button
              onClick={() => setReadMode('pdf')}
              className={`px-2.5 py-0.5 rounded-full transition-all ${
                readMode === 'pdf'
                  ? 'bg-white text-[#4A3326] shadow-xs font-bold'
                  : 'text-[#7A533E] hover:text-[#3B2C21]'
              }`}
            >
              Mode Dokumen PDF
            </button>
          </div>
        </div>

        {/* Right: Controls & Preferences */}
        <div className="flex items-center gap-1 sm:gap-2">
          
          {/* Bookmark Toggle */}
          <button
            onClick={handleToggleBookmark}
            className={`p-2 rounded-xl transition-all cursor-pointer border ${
              isCurrentPageBookmarked
                ? 'bg-amber-100/80 border-amber-300 text-amber-700'
                : 'bg-white/80 hover:bg-white border-[#E0D5C3] text-gray-400 hover:text-amber-600'
            }`}
            title={isCurrentPageBookmarked ? 'Hapus Bookmark' : 'Tandai Halaman Ini'}
          >
            {isCurrentPageBookmarked ? (
              <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-600" />
            ) : (
              <BookmarkIcon className="w-4 h-4" />
            )}
          </button>

          {/* Table of contents drawer toggle */}
          <button
            onClick={() => setShowToc(!showToc)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              showToc ? 'bg-[#697D67] text-white border-[#697D67]' : 'bg-white/80 hover:bg-white border-[#E0D5C3] text-[#4A3326]'
            }`}
            title="Daftar Bab & Bookmark"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          {/* Reader Appearance popover */}
          <div className="relative">
            <button
              onClick={() => setShowAppearance(!showAppearance)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                showAppearance ? 'bg-[#8C6D58] text-white border-[#8C6D58]' : 'bg-white/80 hover:bg-white border-[#E0D5C3] text-[#4A3326]'
              }`}
              title="Pengaturan Tampilan & Warna"
            >
              <Palette className="w-4 h-4" />
            </button>

            {/* Appearance dropdown */}
            {showAppearance && (
              <div className="absolute right-0 top-11 z-50 w-64 p-4 rounded-2xl bg-white border border-[#E8DEC8] shadow-2xl space-y-4 animate-scaleUp">
                <div>
                  <label className="text-xs font-bold text-[#4A3326] block mb-2">Tema Warna Kertas</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'cream', name: 'Krem Perpustakaan', bg: 'bg-[#FAF6EE]', text: 'text-[#33271E]', border: 'border-[#EAE0D2]' },
                      { id: 'white', name: 'Putih Alabaster', bg: 'bg-[#FFFFFF]', text: 'text-[#1F2937]', border: 'border-gray-200' },
                      { id: 'sage', name: 'Sage Teduh', bg: 'bg-[#EEF3ED]', text: 'text-[#2D3B2C]', border: 'border-[#CCD8CB]' },
                      { id: 'night', name: 'Malam Gelap', bg: 'bg-[#181A1B]', text: 'text-[#D1D5DB]', border: 'border-neutral-700' },
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id as ReaderTheme)}
                        className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-between ${t.bg} ${t.text} ${t.border} ${
                          theme === t.id ? 'ring-2 ring-[#8C6D58]' : ''
                        }`}
                      >
                        <span>{t.name}</span>
                        {theme === t.id && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#4A3326] block mb-2">Ukuran Huruf</label>
                  <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-[#FAF6F0] border border-[#E0D5C3]">
                    {(['sm', 'base', 'lg', 'xl'] as ReaderFontSize[]).map(sz => (
                      <button
                        key={sz}
                        onClick={() => setFontSize(sz)}
                        className={`py-1 rounded-lg text-xs font-bold transition-all ${
                          fontSize === sz ? 'bg-white text-[#4A3326] shadow-xs' : 'text-[#8C6D58]'
                        }`}
                      >
                        {sz.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Fullscreen toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-white/80 hover:bg-white border border-[#E0D5C3] text-[#4A3326] transition-all cursor-pointer"
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

        </div>

      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Table of Contents Drawer */}
        {showToc && (
          <aside className="w-72 sm:w-80 border-r border-[#E8DEC8] bg-[#FAF6F0] p-4 overflow-y-auto shrink-0 z-20 space-y-5 animate-slideRight">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-novel text-sm font-bold text-[#3B2C21]">
                Daftar Isi & Penanda
              </h3>
              <button 
                onClick={() => setShowToc(false)}
                className="text-xs text-[#8C6D58] hover:text-[#4A3326]"
              >
                Tutup
              </button>
            </div>

            {/* Chapters list */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#9E8E81] mb-2">
                Bab Novel
              </p>
              <div className="space-y-1">
                {(novel.chapters && novel.chapters.length > 0 ? novel.chapters : [
                  { id: 'c1', title: 'Halaman 1 - Pembuka', page: 1 },
                  { id: 'c2', title: 'Halaman 2 - Kisah Berlanjut', page: 2 },
                ]).map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => {
                      handlePageChange(ch.page);
                      setShowToc(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                      currentPage === ch.page
                        ? 'bg-[#697D67] text-white font-bold'
                        : 'hover:bg-[#EBE3D3] text-[#4A3326]'
                    }`}
                  >
                    <span className="truncate">{ch.title}</span>
                    <span className="text-[10px] opacity-80 shrink-0 ml-2">Hal {ch.page}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bookmarks */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#9E8E81] mb-2">
                Bookmark Halaman ({bookmarks.length})
              </p>
              {bookmarks.length === 0 ? (
                <p className="text-xs text-[#9E8E81] italic">Belum ada penanda halaman tersimpan.</p>
              ) : (
                <div className="space-y-1.5">
                  {bookmarks.map((bm) => (
                    <div
                      key={bm.id}
                      onClick={() => {
                        handlePageChange(bm.page);
                        setShowToc(false);
                      }}
                      className="p-2 rounded-xl bg-white border border-[#E8DEC8] hover:border-[#697D67] text-xs cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <BookmarkIcon className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
                        <span className="font-semibold text-[#4A3326]">Halaman {bm.page}</span>
                      </div>
                      <span className="text-[10px] text-[#8C6D58]">Buka</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Reader Display Center */}
        <main className="flex-1 flex flex-col items-center justify-between p-4 sm:p-8 overflow-y-auto">
          
          {/* MODE 1: PDF DOCUMENT EMBED */}
          {readMode === 'pdf' ? (
            <div className="w-full h-full max-w-5xl flex flex-col items-center flex-1">
              
              {/* PDF Toolbar */}
              <div className="w-full flex items-center justify-between gap-2 p-2 mb-3 rounded-2xl bg-white border border-[#E8DEC8] shadow-xs text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#4A3326]">Dokumen PDF: {novel.title}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setZoomLevel(prev => Math.max(50, prev - 15))}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-[#4A3326]"
                    title="Perkecil Tampilan"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-[#4A3326] w-12 text-center">{zoomLevel}%</span>
                  <button
                    onClick={() => setZoomLevel(prev => Math.min(200, prev + 15))}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-[#4A3326]"
                    title="Perbesar Tampilan"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setZoomLevel(100)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-[#8C6D58]"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Iframe / Object viewer with Zoom */}
              <div className="w-full flex-1 min-h-[650px] rounded-2xl overflow-hidden border border-[#D5C6B1] bg-[#525659] shadow-inner flex items-center justify-center">
                {isLoadingPdf ? (
                  <div className="text-white text-center p-8 space-y-2">
                    <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                    <p className="text-sm">Memuat Dokumen PDF...</p>
                  </div>
                ) : pdfUrl ? (
                  <div 
                    className="w-full h-full transition-transform duration-200 origin-top"
                    style={{ transform: `scale(${zoomLevel / 100})`, height: `${(100 / (zoomLevel / 100))}%` }}
                  >
                    <iframe
                      src={`${pdfUrl}#page=${currentPage}&toolbar=1&navpanes=0`}
                      className="w-full h-full border-0 rounded-xl"
                      title={novel.title}
                    />
                  </div>
                ) : (
                  <div className="text-white text-center p-8">
                    <p>Format PDF tidak dapat dimuat langsung.</p>
                    <button
                      onClick={() => setReadMode('book')}
                      className="mt-3 px-4 py-2 rounded-xl bg-white text-[#4A3326] text-xs font-bold"
                    >
                      Beralih ke Mode Buku
                    </button>
                  </div>
                )}
              </div>

            </div>
          ) : (
            /* MODE 2: DIGITAL INTERACTIVE BOOK READER */
            <div 
              className={`w-full max-w-3xl min-h-[600px] p-8 sm:p-14 rounded-3xl border shadow-xl paper-shadow transition-all duration-300 flex flex-col justify-between ${getThemeClasses()}`}
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              {/* Paper Header */}
              <div className="border-b pb-3 mb-6 flex items-center justify-between text-xs opacity-70">
                <span className="font-serif italic">{novel.title}</span>
                <span>{currentChapterTitle || `Halaman ${currentPage}`}</span>
              </div>

              {/* Main Reading Text */}
              <div className={`flex-1 font-serif-novel whitespace-pre-line tracking-wide ${getFontSizeClasses()}`}>
                {pageText}
              </div>

              {/* Paper Footer with page number */}
              <div className="border-t pt-4 mt-8 flex items-center justify-between text-xs opacity-75">
                <span>NOVEA Digital Library</span>
                <span className="font-bold">— {currentPage} —</span>
                <span>{Math.round((currentPage / totalPages) * 100)}% selesai</span>
              </div>

            </div>
          )}

          {/* Quick Page Jump Controls Bottom Overlay */}
          <div className="w-full max-w-xl mt-6 p-3 rounded-2xl bg-white/95 border border-[#E8DEC8] shadow-lg flex items-center justify-between gap-3 backdrop-blur-md">
            
            {/* Prev Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#FAF6F0] hover:bg-[#EBE3D3] disabled:opacity-40 disabled:hover:bg-[#FAF6F0] text-[#4A3326] text-xs font-semibold transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Sebelumnya</span>
            </button>

            {/* Center Slider & Page Number */}
            <div className="flex-1 flex items-center gap-3 px-2">
              <input
                type="range"
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={(e) => handlePageChange(Number(e.target.value))}
                className="flex-1 accent-[#697D67] cursor-pointer"
              />
              <div className="flex items-center gap-1 text-xs font-bold text-[#4A3326] shrink-0">
                <span>Hal.</span>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => handlePageChange(Number(e.target.value))}
                  className="w-12 text-center p-1 rounded-lg border border-[#E0D5C3] text-xs font-bold"
                />
                <span className="text-[#8C6D58] font-normal">/ {totalPages}</span>
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gradient-to-r from-[#697D67] to-[#4E5D4C] hover:from-[#5A6D58] hover:to-[#3F4D3D] disabled:opacity-40 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <span className="hidden sm:inline">Berikutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>

          </div>

          <p className="text-[11px] text-[#8C6D58] mt-2 text-center">
            Progres tersimpan otomatis pada Halaman {currentPage} &bull; Gunakan tombol panah keyboard ← / → untuk membalik halaman.
          </p>

        </main>
      </div>

    </div>
  );
};
