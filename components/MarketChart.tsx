'use client';

import React from 'react';
import { BarChart3, TrendingUp, Tv, Users } from 'lucide-react';
import { BoxOfficeItem, formatNumber } from '@/lib/kobis';

interface MarketChartProps {
  items: BoxOfficeItem[];
  onSelectMovie: (movieCd: string) => void;
}

export default function MarketChart({ items, onSelectMovie }: MarketChartProps) {
  if (!items || items.length === 0) return null;

  // Find max sales share for scaling bars
  const maxShare = Math.max(...items.map((i) => parseFloat(i.salesShare || '0')), 1);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-rose-500" />
            <span>일일 매출 점유율 & 관객 비중 분석</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            상영작별 시장 점유율 및 당일 관객수 상대 분포
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item, idx) => {
          const shareVal = parseFloat(item.salesShare || '0');
          const sharePercent = (shareVal / maxShare) * 100;
          const uniqueKey = `${item.movieCd}-${item.rank || idx}-${idx}`;

          return (
            <div
              key={uniqueKey}
              onClick={() => onSelectMovie(item.movieCd)}
              className="group cursor-pointer bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-semibold text-white group-hover:text-rose-400 transition-colors">
                  <span className="w-5 h-5 rounded bg-slate-800 text-slate-300 flex items-center justify-center font-mono text-[11px]">
                    {item.rank}
                  </span>
                  <span className="line-clamp-1">{item.movieNm}</span>
                </div>

                <div className="flex items-center gap-4 text-slate-300 font-mono text-xs">
                  <span>
                    관객수: <strong className="text-white">{formatNumber(item.audiCnt)}</strong>명
                  </span>
                  <span className="text-rose-400 font-bold font-mono">
                    점유율: {item.salesShare}%
                  </span>
                </div>
              </div>

              {/* Bar graphic */}
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800/80 p-0.5 relative">
                <div
                  className="h-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(sharePercent, 2)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>상영스크린: {formatNumber(item.scrnCnt)}관 / 상영횟수: {formatNumber(item.showCnt)}회</span>
                <span>누적관객: {formatNumber(item.audiAcc)}명</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
