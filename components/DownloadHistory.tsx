import React from 'react';
import { DownloadHistoryItem } from '../types';

interface DownloadHistoryProps {
  history: DownloadHistoryItem[];
  onClear: () => void;
}

const DownloadHistory: React.FC<DownloadHistoryProps> = ({ history, onClear }) => {
  if (history.length === 0) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-[10px] font-black text-white tracking-[0.2em] uppercase italic">LỊCH SỬ TẢI XUỐNG</h3>
        </div>
        <button 
          onClick={onClear}
          className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 hover:border-rose-500 rounded-lg text-[9px] font-black text-rose-500 hover:text-white transition-all uppercase tracking-widest group"
        >
          <svg className="w-3 h-3 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          XÓA LỊCH SỬ
        </button>
      </div>

      <div className="space-y-3">
        {history.map((item, idx) => (
          <div 
            key={`${item.id}-${item.timestamp}-${idx}`} 
            className="glass group relative rounded-xl p-3 flex items-center hover:bg-white/[0.04]"
          >
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-white/10 bg-slate-900">
              <img src={item.cover} alt="" className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
            </div>
            
            <div className="ml-4 flex-1 flex flex-col md:flex-row md:items-center justify-between gap-2 overflow-hidden">
              <div className="min-w-0 flex-1 text-left">
                <p className={`text-[9px] font-black mono mb-0 ${idx % 3 === 0 ? 'text-cyan-400' : idx % 3 === 1 ? 'text-amber-400' : 'text-rose-400'}`}>
                  @{item.author}
                </p>
                <h4 className="text-xs font-bold text-slate-200 line-clamp-1 pr-6" title={item.title}>
                  {item.title || 'Không có tiêu đề'}
                </h4>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className={`text-[8px] px-2 py-0.5 rounded-md border font-black mono uppercase tracking-tighter ${
                    item.type === 'video' 
                      ? (item.quality === 'hd' ? 'border-cyan-500/30 text-cyan-400 bg-cyan-500/5' : 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5') 
                      : 'border-purple-500/30 text-purple-400 bg-purple-500/5'
                  }`}>
                    {item.type === 'video' ? 'video' : 'âm thanh'} {item.quality && `| ${item.quality.toUpperCase()}`}
                  </span>
                  <span className="text-[9px] text-slate-600 font-bold mono whitespace-nowrap">
                    {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-4 h-4 text-slate-500 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DownloadHistory;