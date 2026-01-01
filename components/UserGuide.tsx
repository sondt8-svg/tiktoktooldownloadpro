
import React, { useState } from 'react';

const UserGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-10 duration-1000">
      <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-3">
        <div className="p-1.5 bg-purple-500/10 rounded border border-purple-500/20">
          <svg className="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-[10px] font-black text-white tracking-[0.3em] uppercase italic">Cẩm nang Giao thức Neural</h3>
      </div>

      <div className="glass rounded-[1.5rem] overflow-hidden border-white/5">
        {/* Tab Switcher */}
        <div className="flex border-b border-white/5">
          <button 
            onClick={() => setActiveTab('single')}
            className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'single' ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            HƯỚNG DẪN TẢI ĐƠN
          </button>
          <button 
            onClick={() => setActiveTab('bulk')}
            className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'bulk' ? 'bg-purple-500/10 text-purple-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            HƯỚNG DẪN TẢI NHIỀU
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'single' ? (
            <div className="space-y-6 animate-in fade-in duration-500">
              {/* Scenario 1: Standard */}
              <div className="relative pl-6 border-l border-cyan-500/30 text-left">
                <div className="absolute -left-1 w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_10px_#06b6d4]"></div>
                <h4 className="text-[10px] font-black text-white uppercase italic tracking-wider mb-2">Kịch bản 01: Trích xuất tự động (Standard)</h4>
                <div className="space-y-1.5 text-[10px] text-slate-400 mono leading-relaxed">
                  <p>1. Sao chép liên kết TikTok và dán vào thanh truy cập Neural.</p>
                  <p>2. Nhấn <span className="text-white font-bold">[ BẮT ĐẦU ]</span> để hệ thống ánh xạ dữ liệu.</p>
                  <p>3. Chọn các tùy chọn <span className="text-white font-bold">480P, 720P, 1080P</span> và nhấn <span className="text-cyan-400 font-bold">"Tải video ngay"</span>.</p>
                </div>
              </div>

              {/* Scenario 2: Bypass */}
              <div className="relative pl-6 border-l border-rose-500/30 text-left">
                <div className="absolute -left-1 w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_10px_#f43f5e]"></div>
                <h4 className="text-[10px] font-black text-white uppercase italic tracking-wider mb-2">Kịch bản 02: Kích hoạt Manual Bypass</h4>
                <div className="space-y-1.5 text-[10px] text-slate-400 mono leading-relaxed">
                  <p>1. Nếu hệ thống lỗi tải, nhấn nút <span className="text-white bg-rose-600 px-2 py-0.5 rounded">BYPASS</span> để mở link trực tiếp.</p>
                  <p>2. Tại tab mới: Nhấn vào dấu <span className="text-white font-bold">3 chấm (⋮)</span> &rarr; Chọn <span className="text-cyan-400 font-bold">Tải xuống</span>.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-500 text-left">
              {/* Step 1: Filtering */}
              <div className="relative pl-6 border-l border-amber-500/30">
                <div className="absolute -left-1 w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_10px_#f59e0b]"></div>
                <h4 className="text-[10px] font-black text-white uppercase italic tracking-wider mb-2">Bước 01: Neural Duplicate Filtering</h4>
                <p className="text-[10px] text-slate-400 mono leading-relaxed">
                  Dán danh sách link (mỗi dòng 1 link). Hệ thống sẽ <span className="text-amber-400">tự động lọc bỏ</span> các liên kết trùng lặp và hiển thị cảnh báo khung vàng nếu phát hiện.
                </p>
              </div>

              {/* Step 2: Parallel Processing */}
              <div className="relative pl-6 border-l border-purple-500/30">
                <div className="absolute -left-1 w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_10px_#a855f7]"></div>
                <h4 className="text-[10px] font-black text-white uppercase italic tracking-wider mb-2">Bước 02: Batch Execution</h4>
                <p className="text-[10px] text-slate-400 mono leading-relaxed">
                  Hệ thống xử lý song song theo từng đợt 3 video. Trạng thái <span className="text-purple-400 font-bold">"ANALYZING"</span> sẽ chuyển sang <span className="text-emerald-400 font-bold">"READY"</span> khi hoàn tất trích xuất.
                </p>
              </div>

              {/* Step 3: Recovery Priority */}
              <div className="relative pl-6 border-l border-cyan-500/30">
                <div className="absolute -left-1 w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_10px_#06b6d4]"></div>
                <h4 className="text-[10px] font-black text-white uppercase italic tracking-wider mb-2">Bước 03: Recovery & Bypass Protocol</h4>
                <div className="space-y-2 text-[10px] text-slate-400 mono leading-relaxed">
                  <p>• Ưu tiên nhấn <span className="text-amber-400 font-bold">RELOAD</span> để thử lại nếu link bị lỗi Neural.</p>
                  <p>• Nếu tiến trình tải kẹt ở <span className="text-white font-bold">0% quá 6 giây</span>, nút <span className="text-rose-500 font-bold">BYPASS</span> sẽ xuất hiện như một phương án cứu cánh cuối cùng.</p>
                </div>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/5 mt-4">
                 <div className="flex items-center gap-2 mb-1">
                    <div className="w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
                    <span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest">System Note</span>
                 </div>
                 <p className="text-[9px] text-slate-500 italic">Luôn kiểm tra lịch sử tải xuống ở phía dưới để quản lý các tệp tin đã trích xuất thành công.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserGuide;
