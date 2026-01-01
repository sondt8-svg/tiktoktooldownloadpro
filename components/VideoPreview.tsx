
import React, { useState } from 'react';
import { VideoData } from '../types';

interface VideoPreviewProps {
  data: VideoData | null;
  sourceUrl: string;
  isLoading: boolean;
  isDownloading: boolean;
  downloadProgress: number;
  downloadType: 'video' | 'audio' | null;
  onDownload: (type: 'video' | 'audio', quality?: 'sd' | '720p' | 'hd') => void;
  onReload?: () => void;
  onEdit?: () => void;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ 
  data, 
  sourceUrl,
  isLoading, 
  isDownloading, 
  downloadProgress, 
  onDownload, 
}) => {
  const [quality, setQuality] = useState<'sd' | '720p' | 'hd'>('hd');
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(sourceUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Không thể sao chép liên kết', err);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full glass rounded-[2.5rem] p-16 flex flex-col items-center justify-center min-h-[450px] relative overflow-hidden">
        <div className="absolute inset-0 scan-line"></div>
        <div className="relative">
          <div className="w-24 h-24 border-2 border-cyan-500/10 rounded-full animate-[spin_3s_linear_infinite]"></div>
          <div className="absolute inset-0 w-24 h-24 border-t-2 border-cyan-500 rounded-full animate-spin"></div>
          <div className="absolute inset-4 border border-purple-500/30 rounded-full animate-pulse"></div>
        </div>
        <div className="mt-10 flex flex-col items-center">
            <p className="text-cyan-400 font-black tracking-[0.4em] uppercase text-[11px] animate-pulse">Phân tích Neural Matrix...</p>
            <p className="text-slate-500 text-[9px] font-bold mono mt-2 uppercase">Status: Mapping Origin Data</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="w-full glass rounded-[2.5rem] overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-700">
      <div className="flex flex-col lg:flex-row">
        {/* Visual Terminal */}
        <div className="lg:w-1/2 relative bg-black group overflow-hidden h-[550px]">
          <img 
            src={data.cover} 
            alt="Preview" 
            className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-[1.5s]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          
          <div className="absolute top-8 left-8 right-8 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="px-4 py-1.5 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-full text-[10px] font-black text-cyan-400 uppercase tracking-widest">
                VERIFIED SOURCE
              </div>
            </div>
            
            <button 
              onClick={handleShare}
              className="p-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl text-white hover:bg-cyan-500 hover:text-black transition-all group/share"
            >
              {copied ? (
                <span className="text-[9px] font-black mono uppercase tracking-widest px-2">Link Copied!</span>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-2.684 3 3 0 000 2.684zm0 12.684a3 3 0 100-2.684 3 3 0 000 2.684z" /></svg>
              )}
            </button>
          </div>

          <div className="absolute bottom-10 left-10 right-10">
            {data.aiIntelligence && (
              <div className="mb-4 animate-in fade-in slide-in-from-left-4 duration-1000">
                <div className="flex flex-wrap gap-2 mb-3">
                  {data.aiIntelligence.tags.map((tag, i) => (
                    <span key={i} className="text-[8px] font-black bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded uppercase tracking-tighter">
                      #{tag}
                    </span>
                  ))}
                  <span className="text-[8px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded uppercase tracking-tighter">
                    Viral Score: {data.aiIntelligence.viralScore}%
                  </span>
                </div>
                <div className="bg-white/5 backdrop-blur-md border-l-2 border-cyan-500 p-3 rounded-r-xl">
                  <p className="text-[9px] text-slate-300 italic leading-relaxed">
                    <span className="text-cyan-400 font-bold uppercase mr-2">Neural Insight:</span>
                    {data.aiIntelligence.summary}
                  </p>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <span className="text-[11px] text-purple-400 font-black uppercase tracking-widest">Video Identity</span>
              <h3 className="text-3xl font-black text-white italic tracking-tight uppercase line-clamp-2 leading-none">
                {data.title}
              </h3>
              <p className="text-base text-cyan-500 font-black">@{data.author}</p>
            </div>
          </div>
          <div className="scan-line opacity-20"></div>
        </div>
        
        {/* Data Terminal */}
        <div className="lg:w-1/2 p-12 flex flex-col justify-between text-left">
          <div className="space-y-10">
            <div className="grid grid-cols-2 gap-5">
              <div className="p-5 bg-white/5 border border-white/5 rounded-3xl">
                <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Likes</p>
                <p className="text-xl font-black text-white italic">{data.stats.likes}</p>
              </div>
              <div className="p-5 bg-white/5 border border-white/5 rounded-3xl">
                <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Shares</p>
                <p className="text-xl font-black text-white italic">{data.stats.shares}</p>
              </div>
            </div>

            <div className="space-y-5">
              <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] flex items-center gap-3">
                  <span className="w-3 h-[2px] bg-cyan-500"></span>
                  Cấu hình xuất tập tin
              </p>
              
              <div className="grid grid-cols-3 gap-3">
                {(['sd', '720p', 'hd'] as const).map((q) => (
                  <button 
                    key={q}
                    onClick={() => setQuality(q)}
                    disabled={isDownloading}
                    className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-tight border transition-all ${quality === q ? 'bg-cyan-600 border-cyan-400 text-white' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}
                  >
                    {q === 'sd' ? '480p' : q === '720p' ? '720p' : '1080p+'}
                  </button>
                ))}
              </div>
              
              {/* Added Notice */}
              <p className="text-[9px] mono italic text-slate-500 uppercase tracking-tighter flex items-center gap-2">
                <span className="w-1 h-1 bg-amber-500 rounded-full animate-pulse"></span>
                nếu chất lượng 1080p không tải được sẽ tự động lấy video 720p
              </p>
            </div>
          </div>
          
          <div className="mt-12 space-y-4">
            <button 
              onClick={() => onDownload('video', quality)}
              disabled={isDownloading}
              className={`w-full py-6 rounded-[1.5rem] font-black transition-all flex items-center justify-center gap-4 text-sm tracking-[0.2em] uppercase italic disabled:opacity-80 relative overflow-hidden ${isDownloading ? 'bg-slate-800 text-cyan-400' : 'bg-white text-black hover:bg-cyan-500 hover:text-white'}`}
            >
              {isDownloading && (
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-cyan-500/20 transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                ></div>
              )}
              
              <span className="relative z-10 flex items-center gap-3">
                {isDownloading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    {downloadProgress > 0 ? `Đang tải ${downloadProgress}%` : 'Đang kết nối...'}
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Tải video ngay
                  </>
                )}
              </span>
            </button>
            
            <button 
              onClick={() => onDownload('audio')}
              disabled={isDownloading}
              className="w-full py-4 rounded-2xl border border-white/10 bg-white/5 text-slate-400 font-bold hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-3 text-[11px] tracking-widest uppercase disabled:opacity-50"
            >
              Chỉ lấy âm thanh (.mp3)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
