
import React, { useState, useCallback, useEffect, useRef } from 'react';
import Header from './components/Header';
import VideoPreview from './components/VideoPreview';
import Assistant from './components/Assistant';
import DownloadHistory from './components/DownloadHistory';
import FallbackModal from './components/FallbackModal';
import BulkResults from './components/BulkResults';
import UserGuide from './components/UserGuide';
import SystemStatus from './components/SystemStatus';
import { fetchTikTokVideo } from './services/tiktokService';
import { getVideoIntelligence } from './services/geminiService';
import { VideoData, DownloadHistoryItem, AppMode, QueueItem } from './types';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [mode, setMode] = useState<AppMode>('single');
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [bulkItems, setBulkItems] = useState<QueueItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<number | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [history, setHistory] = useState<DownloadHistoryItem[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fallbackUrl, setFallbackUrl] = useState('');
  const [activeVideoForFallback, setActiveVideoForFallback] = useState<VideoData | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasResults = videoData !== null || bulkItems.length > 0 || isLoading;

  useEffect(() => {
    const saved = localStorage.getItem('techflow_history');
    if (saved) try { setHistory(JSON.parse(saved)); } catch (e) {}
  }, []);

  const saveToHistory = useCallback((item: DownloadHistoryItem) => {
    setHistory(prev => {
      const n = [item, ...prev.slice(0, 14)];
      localStorage.setItem('techflow_history', JSON.stringify(n));
      return n;
    });
  }, []);

  const downloadWithProgress = async (url: string, onProgress: (p: number) => void): Promise<Blob> => {
    const proxies = [
      (u: string) => u,
      (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
      (u: string) => `https://corsproxy.io/?${encodeURIComponent(u)}`
    ];

    for (const proxy of proxies) {
      try {
        const finalUrl = proxy(url);
        const response = await fetch(finalUrl);
        if (!response.ok) continue;

        const contentLength = response.headers.get('content-length');
        const total = contentLength ? parseInt(contentLength, 10) : 0;
        
        if (!response.body) {
          const blob = await response.blob();
          return blob;
        }

        const reader = response.body.getReader();
        let loaded = 0;
        const chunks = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          loaded += value.length;
          if (total > 0) {
            onProgress(Math.round((loaded / total) * 100));
          }
        }

        return new Blob(chunks);
      } catch (e) {
        continue;
      }
    }
    throw new Error('Tất cả cổng bypass đều bị chặn');
  };

  const triggerDownload = (blob: Blob, name: string) => {
    const u = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = u; a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(u); }, 1000);
  };

  const performSingleFetch = async (cleanUrl: string) => {
    if (!cleanUrl.includes('tiktok.com')) {
      setError("LIÊN KẾT KHÔNG HỢP LỆ");
      return;
    }
    setIsLoading(true);
    setVideoData(null);
    setDuplicateWarning(null);
    try {
      const d = await fetchTikTokVideo(cleanUrl);
      if (d) {
        const aiIntelPromise = getVideoIntelligence(d.title, d.author);
        
        const basicData: VideoData = { 
          id: Date.now().toString(), 
          title: d.title, 
          author: d.author, 
          cover: d.cover, 
          duration: 0, 
          stats: d.stats, 
          downloadUrl: d.videoUrl, 
          hd720DownloadUrl: d.hdVideoUrl,
          hdDownloadUrl: d.hdVideoUrl, 
          musicUrl: d.musicUrl 
        };

        setVideoData(basicData);
        aiIntelPromise.then(intel => {
          if (intel) {
            setVideoData(prev => prev ? { ...prev, aiIntelligence: intel } : null);
          }
        });
      } else {
        setError("TẤT CẢ CÁC NGUỒN PHÂN TÍCH ĐỀU THẤT BẠI");
      }
    } catch (e) {
      setError("LỖI KẾT NỐI MÁY CHỦ HỆ THỐNG");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetch = async (targetUrl?: string) => {
    const cleanUrl = (targetUrl || url).trim();
    if (!cleanUrl) {
      setError("DỮ LIỆU NHẬP TRỐNG");
      setInfo(null);
      setDuplicateWarning(null);
      return;
    }

    setError(null);
    setInfo(null);
    setDuplicateWarning(null);
    
    const foundUrls = cleanUrl.split(/[\s,]+/).filter(u => u.trim() && u.includes('tiktok.com'));

    if (mode === 'single') {
      if (foundUrls.length > 1) {
        setError("PHÁT HIỆN NHIỀU LINK. VUI LÒNG CHỌN SANG TIẾN TRÌNH TRÍCH XUẤT HÀNG LOẠT.");
        return;
      }
      performSingleFetch(cleanUrl);
    } else {
      const uniqueUrls = Array.from(new Set(foundUrls));
      
      // Kiểm tra trùng lặp
      if (uniqueUrls.length < foundUrls.length) {
        setDuplicateWarning(foundUrls.length - uniqueUrls.length);
      }

      if (uniqueUrls.length === 1) {
        setMode('single');
        setUrl(uniqueUrls[0]);
        performSingleFetch(uniqueUrls[0]);
        return;
      }
      if (uniqueUrls.length === 0) {
        setError("KHÔNG TÌM THẤY LIÊN KẾT TIKTOK HỢP LỆ");
        return;
      }
      const newItems: QueueItem[] = uniqueUrls.map((u, i) => ({
        id: `bulk-${Date.now()}-${i}`,
        url: u,
        status: 'pending',
        progress: 0
      }));
      setBulkItems(newItems);
      processBulk(newItems);
    }
  };

  const processBulk = async (items: QueueItem[]) => {
    const batchSize = 3;
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      await Promise.all(batch.map(item => processSingleBulkItem(item)));
    }
  };

  const processSingleBulkItem = async (item: QueueItem) => {
    setBulkItems(prev => prev.map(it => it.id === item.id ? { ...it, status: 'analyzing', error: undefined, showBypass: false } : it));
    try {
      const d = await fetchTikTokVideo(item.url);
      if (d && (d.videoUrl || d.hdVideoUrl)) {
        setBulkItems(prev => prev.map(it => it.id === item.id ? { 
          ...it, 
          status: 'ready', 
          title: d.title, 
          cover: d.cover, 
          hd720Url: d.hdVideoUrl,
          hdUrl: d.hdVideoUrl, 
          sdUrl: d.videoUrl,
          musicUrl: d.musicUrl,
          author: d.author
        } : it));
      } else {
        setBulkItems(prev => prev.map(it => it.id === item.id ? { ...it, status: 'failed', error: 'Không thể xác thực' } : it));
      }
    } catch (e) {
      setBulkItems(prev => prev.map(it => it.id === item.id ? { ...it, status: 'failed', error: 'Lỗi Neural' } : it));
    }
  };

  const handleDownload = async (type: 'video' | 'audio', quality: 'sd' | '720p' | 'hd' = 'hd', dataOverride?: VideoData) => {
    const activeData = dataOverride || videoData;
    if (!activeData) return;
    
    const isBulk = !!dataOverride;

    const updateItemStatus = (status: QueueItem['status'], p: number) => {
      if (mode === 'list' && dataOverride) {
        setBulkItems(prev => prev.map(it => it.id === dataOverride.id ? { ...it, status, progress: p } : it));
      }
    };

    setIsDownloading(true);
    setDownloadProgress(0);
    updateItemStatus('downloading', 0);
    
    let watchdogTimer: any = null;
    if (isBulk) {
      watchdogTimer = setTimeout(() => {
        setBulkItems(prev => prev.map(it => {
          if (it.id === dataOverride.id && it.status === 'downloading' && it.progress === 0) {
            return { ...it, showBypass: true };
          }
          return it;
        }));
      }, 6000);
    }
    
    try {
      let urlsToTry: string[] = [];
      if (type === 'audio') {
        urlsToTry = [activeData.musicUrl].filter(Boolean) as string[];
      } else {
        const qOrder: ('hd' | '720p' | 'sd')[] = quality === 'hd' ? ['hd', '720p', 'sd'] : quality === '720p' ? ['720p', 'sd'] : ['sd'];
        qOrder.forEach(q => {
          if (q === 'hd' && activeData.hdDownloadUrl) urlsToTry.push(activeData.hdDownloadUrl);
          else if (q === '720p' && activeData.hd720DownloadUrl) urlsToTry.push(activeData.hd720DownloadUrl);
          else if (q === 'sd' && activeData.downloadUrl) urlsToTry.push(activeData.downloadUrl);
        });
      }
      
      if (urlsToTry.length === 0) throw new Error('Không tìm thấy link tải khả dụng');

      let success = false;
      let lastError = null;

      for (const targetUrl of urlsToTry) {
        try {
          const blob = await downloadWithProgress(targetUrl, (p) => {
            setDownloadProgress(p);
            if (isBulk) {
              setBulkItems(prev => prev.map(it => it.id === dataOverride.id ? { ...it, progress: p } : it));
            }
          });

          triggerDownload(blob, `TiktokDownloadPro_${Date.now()}.${type === 'video' ? 'mp4' : 'mp3'}`);
          success = true;
          break;
        } catch (e) {
          lastError = e;
          continue;
        }
      }

      if (!success) throw lastError || new Error('Tải xuống thất bại');
      
      updateItemStatus('completed', 100);

      saveToHistory({ 
        id: activeData.id, 
        title: activeData.title, 
        author: activeData.author, 
        cover: activeData.cover, 
        timestamp: Date.now(), 
        type: type, 
        quality: quality
      });
    } catch (e) {
      if (isBulk) {
        setBulkItems(prev => prev.map(it => it.id === dataOverride.id ? { ...it, status: 'ready', showBypass: true, progress: 0 } : it));
      } else {
        setFallbackUrl(type === 'audio' ? activeData.musicUrl! : activeData.downloadUrl);
        setActiveVideoForFallback(activeData);
        setIsModalOpen(true);
      }
    } finally {
      if (watchdogTimer) clearTimeout(watchdogTimer);
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const handleReload = () => {
    if (mode === 'single') {
        if (url) handleFetch(url);
    } else {
        const itemsToReload = bulkItems.filter(i => i.status === 'failed' || i.status === 'pending');
        processBulk(itemsToReload.length > 0 ? itemsToReload : bulkItems);
    }
  };

  const handleRemoveBulkItem = (id: string) => {
    setBulkItems(prev => prev.filter(it => it.id !== id));
  };

  return (
    <div className="min-h-screen relative cyber-grid overflow-x-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] bg-cyan-600/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <Header />
      
      <main className="container mx-auto px-6 pt-20 pb-12 max-w-3xl relative z-10">
        <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
          
          <section className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white uppercase italic leading-tight animate-in fade-in zoom-in duration-700">
              TIKTOK<span className="text-cyan-400 text-glow-cyan"> DOWNLOAD</span><span className="text-rose-500 text-glow-tiktok ml-2">PRO</span>
            </h1>
            <p className="text-slate-400 text-xs font-medium max-w-lg mx-auto opacity-60">
              Trích xuất video TikTok không logo tốc độ Neural Core.
            </p>
          </section>

          <SystemStatus />

          <div className="w-full space-y-3">
            <div className="relative group">
              <div className="relative glass rounded-[2rem] p-1.5 border-white/10 flex flex-col gap-1 shadow-2xl transition-all duration-300">
                {mode === 'single' ? (
                  <div className="flex flex-col md:flex-row gap-2 w-full">
                    <input 
                      ref={inputRef}
                      value={url} 
                      onChange={e => setUrl(e.target.value)} 
                      onKeyDown={e => e.key === 'Enter' && handleFetch()}
                      placeholder="Dán liên kết TikTok tại đây..." 
                      className="flex-1 bg-transparent px-6 py-3.5 text-white focus:outline-none font-medium text-base placeholder:text-slate-600" 
                    />
                    <button 
                      onClick={() => handleFetch()}
                      disabled={isLoading}
                      className="bg-cyan-500 text-black px-10 py-3.5 rounded-3xl font-black uppercase tracking-widest hover:bg-white transition-all italic disabled:opacity-50 shadow-[0_0_15px_rgba(0,242,234,0.3)] text-sm"
                    >
                      {isLoading ? 'ANALYZING...' : 'TRÍCH XUẤT'}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 w-full p-1.5">
                    <textarea 
                      ref={textareaRef}
                      value={url} 
                      onChange={e => setUrl(e.target.value)}
                      placeholder="Dán danh sách liên kết TikTok (mỗi link một dòng)..."
                      className="w-full h-28 bg-transparent px-6 py-4 text-white focus:outline-none font-medium text-sm placeholder:text-slate-600 resize-none custom-scrollbar"
                    />
                    <button 
                      onClick={() => handleFetch()}
                      disabled={isLoading}
                      className="w-full bg-rose-600 text-white py-3.5 rounded-3xl font-black uppercase tracking-widest hover:bg-rose-500 transition-all italic disabled:opacity-50 text-sm"
                    >
                      {isLoading ? 'XỬ LÝ QUEUE...' : 'TRÍCH XUẤT HÀNG LOẠT'}
                    </button>
                  </div>
                )}
              </div>
              
              <div className="w-full mt-3 space-y-2 min-h-0">
                {error && (
                  <div className="glass bg-rose-500/10 border border-rose-500/40 rounded-2xl p-3 animate-in slide-in-from-top-1 shadow-[0_0_15px_rgba(244,63,94,0.15)]">
                    <p className="text-rose-500 text-[9px] md:text-[10px] font-black mono uppercase tracking-widest flex items-center justify-center gap-2 italic text-left">
                      <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                      SYSTEM ALERT: {error}
                    </p>
                  </div>
                )}
                
                {duplicateWarning && (
                  <div className="glass bg-amber-500/10 border border-amber-500/40 rounded-2xl p-3 animate-in slide-in-from-top-1 shadow-[0_0_15px_rgba(245,158,11,0.2)] border-dashed">
                    <p className="text-amber-500 text-[10px] font-black mono uppercase tracking-widest flex items-center justify-center gap-3 italic text-left">
                      <div className="bg-amber-500/20 p-1.5 rounded-lg border border-amber-500/30 animate-pulse">
                         <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      </div>
                      THÔNG BÁO: ĐÃ LOẠI BỎ {duplicateWarning} LIÊN KẾT TRÙNG LẶP KHỎI QUEUE XỬ LÝ
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button 
                onClick={() => { setMode('single'); setVideoData(null); setBulkItems([]); setUrl(''); setError(null); setDuplicateWarning(null); setInfo(null); }}
                className={`flex-1 md:flex-none md:w-40 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-2 ${mode === 'single' ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(0,242,234,0.15)]' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white hover:bg-white/10'}`}
              >
                Tải video đơn
              </button>
              <button 
                onClick={() => { setMode('list'); setVideoData(null); setBulkItems([]); setUrl(''); setError(null); setDuplicateWarning(null); setInfo(null); }}
                className={`flex-1 md:flex-none md:w-40 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-2 ${mode === 'list' ? 'bg-rose-500/10 border-rose-500 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.15)]' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white hover:bg-white/10'}`}
              >
                Trích xuất hàng loạt
              </button>
            </div>
          </div>

          <div className={`w-full transition-all duration-500 ${hasResults ? 'mt-8 py-4 opacity-100' : 'h-0 py-0 opacity-0 overflow-hidden'}`}>
            {mode === 'single' ? (
              <VideoPreview 
                data={videoData} 
                sourceUrl={url}
                isLoading={isLoading} 
                isDownloading={isDownloading} 
                downloadProgress={downloadProgress}
                downloadType={null} 
                onDownload={handleDownload} 
              />
            ) : (
              <BulkResults 
                items={bulkItems} 
                onDownload={(it, t, q) => handleDownload(t, q, {
                  id: it.id,
                  title: it.title || '',
                  author: it.author || '',
                  cover: it.cover || '',
                  duration: 0,
                  stats: { likes: '0', comments: '0', shares: '0' },
                  downloadUrl: it.sdUrl || '',
                  hd720DownloadUrl: it.hd720Url || '',
                  hdDownloadUrl: it.hdUrl || '',
                  musicUrl: it.musicUrl || ''
                })} 
                onReloadAll={handleReload}
                onReloadItem={processSingleBulkItem}
                onRemoveItem={handleRemoveBulkItem}
              />
            )}
          </div>

          <div className={`w-full transition-all duration-500 ${hasResults ? 'pt-6' : 'pt-0'}`}>
            <DownloadHistory 
              history={history} 
              onClear={() => { setHistory([]); localStorage.removeItem('techflow_history'); }} 
            />
          </div>

          <div className="w-full pt-4">
            <UserGuide />
          </div>
        </div>
      </main>

      <Assistant />
      <FallbackModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setActiveVideoForFallback(null); }} 
        url={fallbackUrl} 
        type="video"
        videoData={activeVideoForFallback}
      />
    </div>
  );
};

export default App;
