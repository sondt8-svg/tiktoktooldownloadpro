import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative group">
            {/* TikTok Styled Logo */}
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(0,242,234,0.3)] group-hover:shadow-[0_0_25px_rgba(255,0,80,0.5)] transition-all duration-500">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.84-.6-4.13-1.34-.14.01-.28.02-.42.02v9.33c.01 4.13-2.92 7.82-7 8.35-3.83.6-7.7-1.92-8.58-5.69-.99-4.22 1.62-8.52 5.8-9.42.34-.07.7-.12 1.05-.14V11.1c-1.63.13-3.04.91-3.95 2.27-.9 1.35-1.01 3.09-.32 4.54.68 1.45 2.1 2.45 3.69 2.58 1.59.13 3.14-.64 3.9-2.04.28-.5.42-1.06.41-1.63V.02z"/>
              </svg>
              {/* RGB Split Effect */}
              <div className="absolute inset-0 bg-cyan-400/20 mix-blend-screen rounded-lg -translate-x-0.5 -translate-y-0.5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute inset-0 bg-rose-500/20 mix-blend-screen rounded-lg translate-x-0.5 translate-y-0.5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
          <div>
            <h1 className="text-sm font-black tracking-[0.15em] text-white uppercase italic">
              Tiktok<span className="text-cyan-400"> download</span><span className="text-rose-500"> pro</span>
            </h1>
            <div className="flex items-center gap-2 opacity-40">
              <div className="w-1 h-1 bg-rose-500 rounded-full animate-pulse"></div>
              <span className="text-[8px] mono uppercase tracking-tighter">Hệ thống xử lý Neural v5.0</span>
            </div>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[8px] mono text-slate-500 uppercase tracking-widest">Network</span>
            <span className="text-[10px] mono text-cyan-400">Secured Node</span>
          </div>
          <div className="w-[1px] h-6 bg-white/10 mx-2"></div>
          <button className="px-5 py-2 rounded-full border border-white/10 text-white text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all active:scale-95">
            Admin Portal
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;