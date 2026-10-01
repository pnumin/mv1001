'use client';

import React from 'react';
import { Crown, Sparkles, Flame, Eye, ArrowUpRight, ArrowDownRight, Minus, Bookmark } from 'lucide-react';
import { BoxOfficeItem, formatNumber, formatKoreanMoney } from '@/lib/kobis';

interface PodiumTopThreeProps {
  items: BoxOfficeItem[];
  onSelectMovie: (movieCd: string) => void;
  bookmarkedCds: string[];
  onToggleBookmark: (item: BoxOfficeItem) => void;
}

export default function PodiumTopThree({
  items,
  onSelectMovie,
  bookmarkedCds,
  onToggleBookmark,
}: PodiumTopThreeProps) {
  if (!items || items.length < 3) return null;

  const first = items[0];
  const second = items[1];
  const third = items[2];

  // Helper for rank change indicator
  const renderRankChange = (item: BoxOfficeItem) => {
    if (item.rankOldAndNew === 'NEW') {
      return (
        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
          <Sparkles className="w-3 h-3" /> NEW
        </span>
      );
    }
    const val = parseInt(item.rankInten || '0', 10);
    if (val > 0) {
      return (
        <span className="inline-flex items-center text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800/60">
          <ArrowUpRight className="w-3.5 h-3.5" /> {val}
        </span>
      );
    } else if (val < 0) {
      return (
        <span className="inline-flex items-center text-xs font-semibold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded-md border border-rose-800/60">
          <ArrowDownRight className="w-3.5 h-3.5" /> {Math.abs(val)}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center text-xs text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md">
        <Minus className="w-3 h-3 mr-0.5" /> 변동없음
      </span>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Crown className="w-5 h-5 text-amber-400" />
          <span>TOP 3 박스오피스 포디움</span>
        </h2>
        <span className="text-xs text-slate-400">카드를 클릭하면 영화 상세정보를 확인할 수 있습니다</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        
        {/* 2nd Place (Silver) */}
        {second && (
          <div className="order-2 md:order-1 bg-slate-900/90 border border-slate-700/60 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between hover:border-slate-500 transition-all group shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-400/5 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-slate-700 text-slate-200 font-extrabold text-sm flex items-center justify-center shadow-md border border-slate-500/50 font-mono">
                    2
                  </span>
                  <span className="text-xs font-bold uppercase text-slate-300 tracking-wider">SILVER</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {renderRankChange(second)}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(second);
                    }}
                    title="관심영화 저장"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                  >
                    <Bookmark
                      className={`w-4 h-4 ${bookmarkedCds.includes(second.movieCd) ? 'fill-amber-400 text-amber-400' : ''}`}
                    />
                  </button>
                </div>
              </div>

              {/* Title & Open Date */}
              <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                {second.movieNm}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                개봉일: {second.openDt || '정보없음'}
              </p>

              {/* Stat Grid */}
              <div className="grid grid-cols-2 gap-2 my-4 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">당일 관객수</span>
                  <p className="text-sm font-extrabold text-white font-mono tabular-nums">
                    {formatNumber(second.audiCnt)} <span className="text-[10px] font-normal text-slate-400">명</span>
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">누적 관객수</span>
                  <p className="text-sm font-extrabold text-slate-300 font-mono tabular-nums">
                    {formatNumber(second.audiAcc)} <span className="text-[10px] font-normal text-slate-400">명</span>
                  </p>
                </div>
              </div>

              {/* Revenue Share Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-400">매출 점유율</span>
                  <span className="text-slate-200 font-mono font-bold">{second.salesShare}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className="h-full bg-slate-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(parseFloat(second.salesShare || '0'), 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Action */}
            <button
              onClick={() => onSelectMovie(second.movieCd)}
              className="mt-4 w-full py-2 px-3 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-slate-300" />
              <span>영화 상세정보</span>
            </button>
          </div>
        )}

        {/* 1st Place (Gold Champion) */}
        {first && (
          <div className="order-1 md:order-2 bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 border-2 border-amber-500/70 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between hover:border-amber-400 transition-all group shadow-2xl shadow-amber-950/40 ring-1 ring-amber-500/30">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div>
              {/* Champion Crown Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 font-black text-base flex items-center justify-center shadow-lg shadow-amber-500/30 font-mono">
                    1
                  </span>
                  <span className="text-xs font-extrabold uppercase text-amber-400 tracking-wider flex items-center gap-1">
                    <Crown className="w-4 h-4 fill-amber-400" /> GOLD CHAMPION
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {renderRankChange(first)}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(first);
                    }}
                    title="관심영화 저장"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                  >
                    <Bookmark
                      className={`w-4 h-4 ${bookmarkedCds.includes(first.movieCd) ? 'fill-amber-400 text-amber-400' : ''}`}
                    />
                  </button>
                </div>
              </div>

              {/* Title & Open Date */}
              <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                {first.movieNm}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                개봉일: {first.openDt || '정보없음'} · 누적 매출액: {formatKoreanMoney(first.salesAcc)}
              </p>

              {/* Stat Grid */}
              <div className="grid grid-cols-2 gap-2.5 my-4 bg-slate-950/90 p-3.5 rounded-xl border border-amber-900/40">
                <div>
                  <span className="text-[10px] text-amber-400/80 font-semibold uppercase tracking-wider">당일 관객수</span>
                  <p className="text-base sm:text-lg font-extrabold text-amber-300 font-mono tabular-nums">
                    {formatNumber(first.audiCnt)} <span className="text-xs font-normal text-slate-400">명</span>
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-amber-400/80 font-semibold uppercase tracking-wider">누적 관객수</span>
                  <p className="text-base sm:text-lg font-extrabold text-white font-mono tabular-nums">
                    {formatNumber(first.audiAcc)} <span className="text-xs font-normal text-slate-400">명</span>
                  </p>
                </div>
              </div>

              {/* Revenue Share Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-amber-300/90 font-semibold">당일 매출 점유율</span>
                  <span className="text-amber-400 font-mono font-bold text-sm">{first.salesShare}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-amber-900/60">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${Math.min(parseFloat(first.salesShare || '0'), 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => onSelectMovie(first.movieCd)}
              className="mt-5 w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-950"
            >
              <Flame className="w-4 h-4" />
              <span>챔피언 영화 상세정보 보기</span>
            </button>
          </div>
        )}

        {/* 3rd Place (Bronze) */}
        {third && (
          <div className="order-3 md:order-3 bg-slate-900/90 border border-amber-900/40 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between hover:border-amber-700 transition-all group shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-900/10 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-amber-950 text-amber-400 font-extrabold text-sm flex items-center justify-center shadow-md border border-amber-800/60 font-mono">
                    3
                  </span>
                  <span className="text-xs font-bold uppercase text-amber-500 tracking-wider">BRONZE</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {renderRankChange(third)}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(third);
                    }}
                    title="관심영화 저장"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                  >
                    <Bookmark
                      className={`w-4 h-4 ${bookmarkedCds.includes(third.movieCd) ? 'fill-amber-400 text-amber-400' : ''}`}
                    />
                  </button>
                </div>
              </div>

              {/* Title & Open Date */}
              <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                {third.movieNm}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                개봉일: {third.openDt || '정보없음'}
              </p>

              {/* Stat Grid */}
              <div className="grid grid-cols-2 gap-2 my-4 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">당일 관객수</span>
                  <p className="text-sm font-extrabold text-white font-mono tabular-nums">
                    {formatNumber(third.audiCnt)} <span className="text-[10px] font-normal text-slate-400">명</span>
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">누적 관객수</span>
                  <p className="text-sm font-extrabold text-slate-300 font-mono tabular-nums">
                    {formatNumber(third.audiAcc)} <span className="text-[10px] font-normal text-slate-400">명</span>
                  </p>
                </div>
              </div>

              {/* Revenue Share Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-400">매출 점유율</span>
                  <span className="text-amber-500 font-mono font-bold">{third.salesShare}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className="h-full bg-amber-700 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(parseFloat(third.salesShare || '0'), 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Action */}
            <button
              onClick={() => onSelectMovie(third.movieCd)}
              className="mt-4 w-full py-2 px-3 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-slate-300" />
              <span>영화 상세정보</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
