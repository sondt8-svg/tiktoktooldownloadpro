
import React from 'react';
import { QueueItem } from '../types';

interface BulkResultsProps {
  items: QueueItem[];
  onDownload: (item: QueueItem, type: 'video' | 'audio', quality: 'sd' | '720p' | 'hd') => void;
  onReloadAll?: () => void;
  onEditList?: () => void;
  onReloadItem?: (item: QueueItem) => void;
  onRemoveItem?: (id: string) => void;
}

const BulkResults: React.FC<BulkResultsProps> = ({ 
  items, 
  onDownload, 
  onReloadAll, 
  onReloadItem,
  onRemoveItem 
}) => {
  if (items.length === 0) return null;

  const completedCount = items.filter(i => i.status === 'ready' || i.status === 'completed').length;
  const totalCount = items.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const handleBypass = (item: QueueItem) => {
    const bypassUrl = item.hdUrl || item.sdUrl || item.url;
    window.open(bypassUrl, '_blank', 'noreferrer');
  };

  const handleResetAndReload = (item: QueueItem) => {
    if (onReloadItem) onReloadItem(item);
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 text-left">
      {/* Header & Global Progress */}
      <div className="glass rounded-[2rem] p-6 border-white/10 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col">
            <h3 className="text-[11px] font-black text-purple-400 uppercase tracking-[0.2em] italic">Neural Queue Analysis [ {items.length} ]</h3>
            <div className="flex gap-2 mt-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${progressPercent === 100 ? 'bg-emerald-400' : 'bg-cyan-400 animate-pulse'}`}></div>
                {progressPercent === 100 ? 'HOÀN TẤT TOÀN BỘ' : `ĐANG XỬ LÝ DỮ LIỆU: ${progressPercent}%`}
              </span>
            </div>
          </div>
          
          <button 
            onClick={onReloadAll}
            className="px-6 py-2.5 bg-cyan-600/10 border border-cyan-500/30 rounded-full text-[10px] font-black text-cyan-400 hover:bg-cyan-600 hover:text-white transition-all uppercase tracking-widest italic"
          >
            Quét lại tất cả
          </button>
        </div>
        
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>
      
      {/* Items List */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-3 custom-scrollbar">
        {items.map((item) => (
          <div key={item.id} className="glass rounded-2xl p-4 flex items-center border-white/5 group transition-all hover:bg-white/[0.04]">
            {/* Thumbnail */}
            <div className="w-14 h-14 rounded-xl bg-slate-900 border border-white/10 overflow-hidden flex-shrink-0 relative">
              {item.cover ? (
                <img src={item.cover} className="w-full h-full object-cover" alt="" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-black/40">
                  <div className="w-5 h-5 border-t-2 border-purple-500 rounded-full animate-spin"></div>
                </div>
              )}
              {(item.status === 'ready' || item.status === 'completed') && (
                <div className="absolute top-1 right-1 px-1 rounded bg-cyan-600 text-cyan-100 text-[6px] font-black uppercase">
                  HD
                </div>
              )}
            </div>

            <div className="ml-4 flex-1 min-w-0">
              <div className="flex justify-between items-center gap-4">
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-slate-200 line-clamp-1 truncate">
                    {item.status === 'analyzing' ? 'ĐANG GIẢI MÃ...' : (item.title || item.url)}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded italic ${
                      item.status === 'ready' || item.status === 'completed' ? 'text-emerald-400 bg-emerald-400/10' : 
                      item.status === 'failed' ? 'text-rose-400 bg-rose-400/10' : 
                      item.status === 'downloading' ? 'text-amber-400 bg-amber-400/10' : 
                      'text-purple-400 bg-purple-400/10'
                    }`}>
                      {item.status === 'downloading' ? `TẢI ${item.progress}%` : item.status === 'ready' ? 'SẴN SÀNG' : item.status === 'failed' ? 'LỖI NEURAL' : item.status.toUpperCase()}
                    </span>
                    {item.author && <span className="text-[9px] text-slate-500 font-bold truncate">@{item.author}</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {/* Trạng thái lỗi: Ưu tiên RELOAD và BYPASS */}
                  {item.status === 'failed' ? (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleResetAndReload(item)}
                        className="px-4 py-2 bg-amber-500 text-black rounded-xl text-[10px] font-black uppercase italic hover:bg-white transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                      >
                        RELOAD
                      </button>
                      <button 
                        onClick={() => handleBypass(item)}
                        className="px-4 py-2 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase italic hover:bg-rose-500 transition-all"
                      >
                        BYPASS
                      </button>
                    </div>
                  ) : (item.status === 'ready' || item.status === 'completed' || item.status === 'downloading') ? (
                    <div className="flex items-center gap-1.5">
                      {/* RELOAD icon khi gặp sự cố 0% (stuck) */}
                      {item.showBypass && (
                        <button 
                          onClick={() => handleResetAndReload(item)}
                          className="p-2 bg-amber-500/10 border border-amber-500/40 text-amber-500 rounded-xl hover:bg-amber-500 hover:text-black transition-all"
                          title="Thử lại"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        </button>
                      )}

                      <button 
                        onClick={() => onDownload(item, 'video', 'hd')}
                        className={`px-3 py-2 bg-cyan-600/20 hover:bg-cyan-600 border border-cyan-500/40 text-cyan-400 hover:text-white rounded-xl text-[9px] font-black uppercase italic transition-all ${item.status === 'downloading' && item.progress > 0 ? 'opacity-50' : ''}`}
                        disabled={item.status === 'downloading' && item.progress > 0}
                      >
                        MP4
                      </button>
                      <button 
                        onClick={() => onDownload(item, 'audio', 'sd')}
                        className={`px-3 py-2 bg-purple-600/20 hover:bg-purple-600 border border-purple-500/40 text-purple-400 hover:text-white rounded-xl text-[9px] font-black uppercase italic transition-all ${item.status === 'downloading' && item.progress > 0 ? 'opacity-50' : ''}`}
                        disabled={item.status === 'downloading' && item.progress > 0}
                      >
                        MP3
                      </button>
                      
                      {item.showBypass && (
                        <button 
                          onClick={() => handleBypass(item)}
                          className="px-4 py-2 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase italic shadow-[0_0_15px_rgba(225,29,72,0.4)] animate-in zoom-in duration-300"
                        >
                          BYPASS
                        </button>
                      )}
                    </div>
                  ) : null}
                  
                  <button 
                    onClick={() => onRemoveItem?.(item.id)}
                    className="p-2 text-slate-700 hover:text-rose-500 transition-colors ml-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BulkResults;
