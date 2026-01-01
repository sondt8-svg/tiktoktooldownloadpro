
import React, { useState, useEffect } from 'react';

const SystemStatus: React.FC = () => {
  const [metrics, setMetrics] = useState({
    cpu: 12,
    nodes: 8,
    uptime: '00:00:00',
    visitors: 124,
    wavePoints: Array.from({ length: 20 }, () => Math.random() * 20 + 5)
  });

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = now - start;
      const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
      const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
      const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
      
      setMetrics(prev => ({
        cpu: Math.floor(Math.random() * 15) + 5,
        nodes: 8 + (Math.random() > 0.8 ? 1 : 0),
        uptime: `${h}:${m}:${s}`,
        visitors: prev.visitors + (Math.random() > 0.5 ? 1 : -1),
        wavePoints: [...prev.wavePoints.slice(1), Math.random() * 25 + 5]
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full glass rounded-3xl p-5 border-white/5 mb-6 relative group overflow-hidden">
      {/* Background Neural Wave - Biểu đồ sóng */}
      <div className="absolute inset-0 opacity-20 pointer-events-none flex items-end">
        <svg className="w-full h-16" viewBox="0 0 200 40" preserveAspectRatio="none">
          <path
            d={`M 0 40 ${metrics.wavePoints.map((p, i) => `L ${i * 10} ${40 - p}`).join(' ')} L 200 40 Z`}
            fill="url(#waveGradient)"
            className="transition-all duration-1000 ease-in-out"
          />
          <defs>
            <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00f2ea" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 relative z-10">
        <div className="flex flex-col text-left">
          <span className="text-[8px] mono text-slate-500 uppercase tracking-widest mb-1">Neural Load</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-cyan-400 mono">{metrics.cpu}%</span>
            <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden max-w-[30px]">
              <div className="h-full bg-cyan-500 transition-all duration-1000" style={{ width: `${metrics.cpu * 3}%` }}></div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col text-left">
          <span className="text-[8px] mono text-slate-500 uppercase tracking-widest mb-1">Active Nodes</span>
          <span className="text-sm font-black text-white mono">0x{metrics.nodes.toString(16).toUpperCase()}</span>
        </div>

        <div className="flex flex-col text-left">
          <span className="text-[8px] mono text-slate-500 uppercase tracking-widest mb-1">Session Uptime</span>
          <span className="text-sm font-black text-rose-500 mono">{metrics.uptime}</span>
        </div>

        <div className="flex flex-col text-left">
          <span className="text-[8px] mono text-slate-500 uppercase tracking-widest mb-1">Bypass Rate</span>
          <span className="text-sm font-black text-emerald-400 mono">99.8%</span>
        </div>

        {/* Tính năng mới: Hiển thị người dùng trực tuyến */}
        <div className="flex flex-col text-left border-l border-white/10 pl-4 md:col-span-1 col-span-2 md:border-l">
          <span className="text-[8px] mono text-cyan-500 uppercase tracking-widest mb-1">Live Visitors</span>
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_#00f2ea]"></div>
             <span className="text-sm font-black text-white mono">{metrics.visitors.toLocaleString()} <span className="text-[9px] text-slate-500 uppercase font-bold">Peers</span></span>
          </div>
        </div>
      </div>
      
      {/* Decorative scanning element */}
      <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/50 shadow-[0_0_10px_#00f2ea] animate-[slide-right_8s_linear_infinite] opacity-30"></div>
    </div>
  );
};

export default SystemStatus;
