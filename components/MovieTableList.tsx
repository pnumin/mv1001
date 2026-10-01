'use client';

import React from 'react';
import { Eye, Bookmark, ArrowUpRight, ArrowDownRight, Minus, Sparkles, Tv } from 'lucide-react';
import { BoxOfficeItem, formatNumber, formatKoreanMoney } from '@/lib/kobis';

interface MovieTableListProps {
  items: BoxOfficeItem[];
  onSelectMovie: (movieCd: string) => void;
  bookmarkedCds: string[];
  onToggleBookmark: (item: BoxOfficeItem) => void;
}

export default function MovieTableList({
  items,
  onSelectMovie,
  bookmarkedCds,
  onToggleBookmark,
}: MovieTableListProps) {
  if (!items || items.length === 0) return null;

  const renderRankBadge = (rankStr: string) => {
    const rank = parseInt(rankStr, 10);
    if (rank === 1) {
      return (
        <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center font-mono shadow-md shadow-amber-950">
          1
        </span>
      );
    } else if (rank === 2) {
      return (
        <span className="w-7 h-7 rounded-lg bg-slate-300 text-slate-950 font-bold text-xs flex items-center justify-center font-mono shadow-sm">
          2
        </span>
      );
    } else if (rank === 3) {
      return (
        <span className="w-7 h-7 rounded-lg bg-amber-800 text-amber-100 font-bold text-xs flex items-center justify-center font-mono shadow-sm">
          3
        </span>
      );
    }
    return (
      <span className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center font-mono border border-slate-700">
        {rankStr}
      </span>
    );
  };

  const renderRankChange = (item: BoxOfficeItem) => {
    if (item.rankOldAndNew === 'NEW') {
      return (
        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
          <Sparkles className="w-2.5 h-2.5" /> NEW
        </span>
      );
    }
    const val = parseInt(item.rankInten || '0', 10);
    if (val > 0) {
      return (
        <span className="inline-flex items-center text-[11px] font-semibold text-emerald-400">
          <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />+{val}
        </span>
      );
    } else if (val < 0) {
      return (
        <span className="inline-flex items-center text-[11px] font-semibold text-rose-400">
          <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />{val}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center text-[11px] text-slate-500">
        <Minus className="w-3 h-3 mr-0.5" />-
      </span>
    );
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <h2 className="text-base font-bold text-white">일일 박스오피스 종합 순위표</h2>
        <span className="text-xs text-slate-400">총 {items.length}개 상영작</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
              <th className="py-3 px-4 w-12 text-center">순위</th>
              <th className="py-3 px-3 w-16 text-center">증감</th>
              <th className="py-3 px-4 min-w-[180px]">영화명</th>
              <th className="py-3 px-3 min-w-[100px]">개봉일</th>
              <th className="py-3 px-4 text-right min-w-[120px]">당일 관객수</th>
              <th className="py-3 px-4 text-right min-w-[110px]">매출 점유율</th>
              <th className="py-3 px-4 text-right min-w-[130px]">누적 관객수</th>
              <th className="py-3 px-4 text-right min-w-[120px]">상영 스크린</th>
              <th className="py-3 px-4 text-center w-24">상세정보</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {items.map((item, idx) => {
              const isBookmarked = bookmarkedCds.includes(item.movieCd);
              const uniqueKey = `${item.movieCd}-${item.rank || idx}-${idx}`;

              return (
                <tr
                  key={uniqueKey}
                  onClick={() => onSelectMovie(item.movieCd)}
                  className="hover:bg-slate-800/60 transition-colors cursor-pointer group"
                >
                  {/* Rank */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex justify-center">{renderRankBadge(item.rank)}</div>
                  </td>

                  {/* Rank Change */}
                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    {renderRankChange(item)}
                  </td>

                  {/* Movie Title */}
                  <td className="py-3.5 px-4 font-bold text-white group-hover:text-rose-400 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="line-clamp-1">{item.movieNm}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleBookmark(item);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-500 hover:text-amber-400"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-400 opacity-100' : ''}`} />
                      </button>
                    </div>
                  </td>

                  {/* Release Date */}
                  <td className="py-3.5 px-3 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                    {item.openDt || '-'}
                  </td>

                  {/* Daily Audience */}
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-100 tabular-nums whitespace-nowrap">
                    {formatNumber(item.audiCnt)} <span className="text-[10px] font-normal text-slate-400">명</span>
                  </td>

                  {/* Sales Share */}
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-rose-400 tabular-nums whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <span>{item.salesShare}%</span>
                      <div className="w-12 h-1.5 bg-slate-950 rounded-full overflow-hidden hidden md:block border border-slate-800">
                        <div
                          className="h-full bg-rose-500 rounded-full"
                          style={{ width: `${Math.min(parseFloat(item.salesShare || '0'), 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Accum Audience */}
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-300 tabular-nums whitespace-nowrap">
                    {formatNumber(item.audiAcc)} <span className="text-[10px] font-normal text-slate-400">명</span>
                  </td>

                  {/* Screens */}
                  <td className="py-3.5 px-4 text-right font-mono text-slate-400 tabular-nums whitespace-nowrap">
                    {formatNumber(item.scrnCnt)}관 / {formatNumber(item.showCnt)}회
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMovie(item.movieCd);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors text-[11px] font-medium inline-flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>보기</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
