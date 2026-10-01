'use client';

import React from 'react';
import { Film, Bookmark, Calendar, Sparkles } from 'lucide-react';

interface HeaderProps {
  selectedDateStr: string;
  bookmarkCount: number;
  onOpenBookmarks: () => void;
}

export default function Header({ selectedDateStr, bookmarkCount, onOpenBookmarks }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-900/30 ring-1 ring-rose-400/30">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white font-sans flex items-center gap-1.5">
                KOBIS <span className="text-rose-500 font-extrabold">박스오피스</span>
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider text-rose-300 bg-rose-950/80 border border-rose-800/50 px-2 py-0.5 rounded-full uppercase">
                Open API
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden md:block">
              영화관입장권통합전산망 실시간 일일 박스오피스 순위
            </p>
          </div>
        </div>

        {/* Center / Date Snapshot Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-medium text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-rose-400" />
          <span>조회 기준일: <strong className="text-white font-semibold">{selectedDateStr}</strong></span>
        </div>

        {/* Action Zone */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenBookmarks}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 hover:border-slate-700 transition-all shadow-sm active:scale-95"
          >
            <Bookmark className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">관심 영화</span>
            {bookmarkCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[11px] font-bold flex items-center justify-center shadow-sm">
                {bookmarkCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
