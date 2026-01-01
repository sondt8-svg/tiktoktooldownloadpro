
import React, { useState } from 'react';
import { VideoData } from '../types';

interface FallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  type: 'video' | 'audio';
  videoData?: VideoData | null;
}

const FallbackModal: React.FC<FallbackModalProps> = ({ isOpen, onClose, url, type, videoData }) => {
  const [isAttempting, setIsAttempting] = useState(false);

  if (!isOpen) return null;

  const handleForceDownload = () => {
    setIsAttempting(true);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `TechFlow_${Date.now()}.${type === 'video' ? 'mp4' : 'mp3'}`);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noreferrer');
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
      setIsAttempting(false);
      document.body.removeChild(link);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={onClose}></div>
      
      <div className="relative w-full max-w-lg glass rounded-[2.5rem] border-rose-500/30 overflow-hidden shadow-[0_0_120px_rgba(244,63,94,0.1)] animate-in zoom-in-95 duration-300">
        <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-rose-500 to-transparent animate-pulse"></div>
        
        <div className="p-8 md:p-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter text-glow-rose">Neural Bypass</h3>
              <p className="text-[10px] text-rose-500 mono uppercase tracking-[0.3em] mt-1 font-bold">Manual Protocol Active</p>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-1.5 h-5 bg-rose-500/20 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-rose-500 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></div>
                </div>
              ))}
            </div>
          </div>

          {/* Video Identity Preview */}
          <div className="flex gap-6 p-5 bg-white/5 border border-white/5 rounded-3xl mb-8 group transition-all hover:border-rose-500/30">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 relative flex-shrink-0">
              {videoData?.cover ? (
                <img src={videoData.cover} className="w-full h-full object-cover" alt="" />
              ) : (
                <div className="w-full h-full bg-black/40 flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
              )}
              <div className="absolute inset-0 bg-rose-500/10 scan-line"></div>
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <p className="text-[11px] text-purple-400 font-black uppercase tracking-widest mb-1">Target Identity</p>
              <h4 className="text-base font-bold text-white truncate pr-4">{videoData?.title || 'TikTok Asset'}</h4>
              <p className="text-[10px] text-slate-500 mono mt-1.5 uppercase font-bold tracking-tighter">Gateway: CDN_DIRECT_01</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6 relative overflow-hidden">
              <p className="text-slate-300 text-[12px] leading-relaxed relative z-10 font-medium">
                Giao thức tự động bị chặn bởi CORS policy. Để tiếp tục, hãy nhấn <span className="text-rose-400 font-black italic">TẢI VIDEO TỪ TAB</span>, sau đó tại tab mới mở, nhấn chuột phải hoặc biểu tượng <span className="text-white font-bold">...</span> để lưu tập tin.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button 
              onClick={handleForceDownload}
              className={`group relative w-full py-6 rounded-2xl font-black transition-all flex items-center justify-center gap-4 text-sm tracking-[0.3em] uppercase italic overflow-hidden shadow-2xl ${isAttempting ? 'bg-slate-800 text-slate-500' : 'bg-rose-600 text-white hover:bg-rose-500 shadow-rose-900/40'}`}
              disabled={isAttempting}
            >
              <span className="relative z-10 flex items-center gap-3">
                {isAttempting ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    REDIRECTING...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    TẢI VIDEO TỪ TAB
                  </>
                )}
              </span>
            </button>
            
            <button 
              onClick={onClose}
              className="w-full py-4 rounded-2xl border-2 border-emerald-500/50 bg-emerald-500/5 text-emerald-400 font-black text-[11px] mono uppercase tracking-[0.4em] transition-all hover:bg-emerald-500 hover:text-white"
            >
              Trở lại trang tải
            </button>
          </div>
        </div>

        <div className="scan-line opacity-10"></div>
      </div>
    </div>
  );
};

export default FallbackModal;
