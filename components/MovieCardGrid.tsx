'use client';

import React from 'react';
import { Eye, Bookmark, ArrowUpRight, ArrowDownRight, Minus, Sparkles, Tv } from 'lucide-react';
import { BoxOfficeItem, formatNumber, formatKoreanMoney } from '@/lib/kobis';

interface MovieCardGridProps {
  items: BoxOfficeItem[];
  onSelectMovie: (movieCd: string) => void;
  bookmarkedCds: string[];
  onToggleBookmark: (item: BoxOfficeItem) => void;
  startIndex?: number;
}

export default function MovieCardGrid({
  items,
  onSelectMovie,
  bookmarkedCds,
  onToggleBookmark,
  startIndex = 3,
}: MovieCardGridProps) {
  const displayItems = items.slice(startIndex);

  if (!displayItems || displayItems.length === 0) return null;

  const renderRankChange = (item: BoxOfficeItem) => {
    if (item.rankOldAndNew === 'NEW') {
      return (
        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
          <Sparkles className="w-2.5 h-2.5" /> NEW
        </span>
      );
    }
    const val = parseInt(item.rankInten || '0', 10);
    if (val > 0) {
      return (
        <span className="inline-flex items-center text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
          <ArrowUpRight className="w-3 h-3" /> {val}
        </span>
      );
    } else if (val < 0) {
      return (
        <span className="inline-flex items-center text-[11px] font-semibold text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-800/40">
          <ArrowDownRight className="w-3 h-3" /> {Math.abs(val)}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center text-[11px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">
        <Minus className="w-3 h-3 mr-0.5" /> -
      </span>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white">
          순위 4위 ~ {items.length}위 박스오피스
        </h2>
        <span className="text-xs text-slate-400">총 {displayItems.length}개 작품</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 gap-3">
        {displayItems.map((item, idx) => {
          const isBookmarked = bookmarkedCds.includes(item.movieCd);
          const uniqueKey = `${item.movieCd}-${item.rank || idx}-${idx}`;

          return (
            <div
              key={uniqueKey}
              onClick={() => onSelectMovie(item.movieCd)}
              className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 hover:bg-slate-900 transition-all cursor-pointer group shadow-sm"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-slate-800 text-slate-200 font-extrabold text-xs flex items-center justify-center font-mono border border-slate-700">
                      {item.rank}
                    </span>
                    {renderRankChange(item)}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(item);
                    }}
                    title="관심영화 저장"
                    className="p-1 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                </div>

                {/* Movie Title */}
                <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-1">
                  {item.movieNm}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  개봉일: {item.openDt || '정보없음'}
                </p>

                {/* Stat Grid */}
                <div className="grid grid-cols-2 gap-2 my-3 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-400 block">당일 관객수</span>
                    <span className="text-xs font-bold text-white font-mono tabular-nums">
                      {formatNumber(item.audiCnt)} 명
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">누적 관객수</span>
                    <span className="text-xs font-bold text-slate-300 font-mono tabular-nums">
                      {formatNumber(item.audiAcc)} 명
                    </span>
                  </div>
                </div>

                {/* Progress & Screen Count */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">매출 점유율</span>
                    <span className="text-rose-400 font-mono font-bold">{item.salesShare}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(parseFloat(item.salesShare || '0'), 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Tv className="w-3 h-3 text-slate-400" />
                      상영 스크린수
                    </span>
                    <span className="font-mono text-slate-300">{formatNumber(item.scrnCnt)}개 관</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 group-hover:text-slate-200">
                <span className="text-[11px]">누적 매출 {formatKoreanMoney(item.salesAcc)}</span>
                <span className="text-rose-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-[11px]">
                  상세보기 <Eye className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
