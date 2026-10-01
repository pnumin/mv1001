'use client';

import React from 'react';
import { Users, Coins, Trophy, Tv, TrendingUp } from 'lucide-react';
import { BoxOfficeItem, formatNumber, formatKoreanMoney } from '@/lib/kobis';

interface BoxOfficeSummaryProps {
  items: BoxOfficeItem[];
  showRange?: string;
}

export default function BoxOfficeSummary({ items, showRange }: BoxOfficeSummaryProps) {
  if (!items || items.length === 0) return null;

  // Calculate totals for top 10
  const totalAudience = items.reduce((acc, item) => acc + parseInt(item.audiCnt || '0', 10), 0);
  const totalSales = items.reduce((acc, item) => acc + parseInt(item.salesAmt || '0', 10), 0);
  const top1Share = items[0]?.salesShare || '0';
  const totalScreens = items.reduce((acc, item) => acc + parseInt(item.scrnCnt || '0', 10), 0);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      
      {/* Total Audience Card */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 flex items-center gap-3.5 shadow-md hover:border-slate-700 transition-colors">
        <div className="w-10 h-10 rounded-lg bg-rose-950/80 border border-rose-800/50 flex items-center justify-center shrink-0 text-rose-400">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
            일일 총 관객수 (TOP 10)
          </span>
          <div className="text-lg sm:text-xl font-extrabold text-white font-mono tabular-nums tracking-tight">
            {formatNumber(totalAudience)} <span className="text-xs font-normal text-slate-400 font-sans">명</span>
          </div>
        </div>
      </div>

      {/* Total Sales Card */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 flex items-center gap-3.5 shadow-md hover:border-slate-700 transition-colors">
        <div className="w-10 h-10 rounded-lg bg-amber-950/80 border border-amber-800/50 flex items-center justify-center shrink-0 text-amber-400">
          <Coins className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
            일일 총 매출액
          </span>
          <div className="text-lg sm:text-xl font-extrabold text-white font-mono tabular-nums tracking-tight">
            {formatKoreanMoney(totalSales)}
          </div>
        </div>
      </div>

      {/* Top 1 Share Card */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 flex items-center gap-3.5 shadow-md hover:border-slate-700 transition-colors">
        <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-800/50 flex items-center justify-center shrink-0 text-emerald-400">
          <Trophy className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
            1위 매출 점유율
          </span>
          <div className="text-lg sm:text-xl font-extrabold text-emerald-400 font-mono tabular-nums tracking-tight flex items-baseline gap-1">
            {top1Share}%
            <span className="text-xs text-slate-400 font-normal font-sans truncate max-w-[100px]" title={items[0]?.movieNm}>
              ({items[0]?.movieNm})
            </span>
          </div>
        </div>
      </div>

      {/* Total Screens Card */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 flex items-center gap-3.5 shadow-md hover:border-slate-700 transition-colors">
        <div className="w-10 h-10 rounded-lg bg-indigo-950/80 border border-indigo-800/50 flex items-center justify-center shrink-0 text-indigo-400">
          <Tv className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
            합산 상영 스크린 수
          </span>
          <div className="text-lg sm:text-xl font-extrabold text-white font-mono tabular-nums tracking-tight">
            {formatNumber(totalScreens)} <span className="text-xs font-normal text-slate-400 font-sans">개 관</span>
          </div>
        </div>
      </div>

    </div>
  );
}
