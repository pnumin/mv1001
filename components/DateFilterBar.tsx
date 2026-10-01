'use client';

import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Filter, LayoutGrid, List, BarChart3, RotateCcw } from 'lucide-react';
import { formatDateToYYYY_MM_DD, getYesterdayDate } from '@/lib/kobis';

interface DateFilterBarProps {
  selectedDate: string; // YYYY-MM-DD
  onDateChange: (newDate: string) => void;
  repNationCd: string; // '' | 'K' | 'F'
  onRepNationChange: (code: string) => void;
  multiType: string; // '' | 'N' | 'Y'
  onMultiTypeChange: (type: string) => void;
  viewMode: 'grid' | 'table' | 'chart';
  onViewModeChange: (mode: 'grid' | 'table' | 'chart') => void;
  isLoading: boolean;
}

export default function DateFilterBar({
  selectedDate,
  onDateChange,
  repNationCd,
  onRepNationChange,
  multiType,
  onMultiTypeChange,
  viewMode,
  onViewModeChange,
  isLoading,
}: DateFilterBarProps) {
  // Yesterday date string for max constraint
  const maxDate = formatDateToYYYY_MM_DD(getYesterdayDate());

  // Handle previous day click
  const handlePrevDay = () => {
    const cur = new Date(selectedDate);
    cur.setDate(cur.getDate() - 1);
    onDateChange(formatDateToYYYY_MM_DD(cur));
  };

  // Handle next day click (up to maxDate)
  const handleNextDay = () => {
    if (selectedDate >= maxDate) return;
    const cur = new Date(selectedDate);
    cur.setDate(cur.getDate() + 1);
    const nextStr = formatDateToYYYY_MM_DD(cur);
    if (nextStr <= maxDate) {
      onDateChange(nextStr);
    }
  };

  // Quick Date Presets
  const handlePreset = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    onDateChange(formatDateToYYYY_MM_DD(d));
  };

  const isNextDisabled = selectedDate >= maxDate;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
      
      {/* Top Row: Date Selector & Quick Presets */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        
        {/* Date Controls */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <label htmlFor="kobis-date-picker" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 shrink-0">
            <Calendar className="w-4 h-4 text-rose-400" />
            <span>박스오피스 날짜:</span>
          </label>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={handlePrevDay}
              title="이전 날짜"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <input
              id="kobis-date-picker"
              type="date"
              value={selectedDate}
              max={maxDate}
              onChange={(e) => {
                if (e.target.value) {
                  onDateChange(e.target.value);
                }
              }}
              className="bg-transparent text-white font-mono text-sm px-2 py-1 font-semibold focus:outline-none cursor-pointer"
            />

            <button
              type="button"
              onClick={handleNextDay}
              disabled={isNextDisabled}
              title={isNextDisabled ? '최신 박스오피스 날짜입니다' : '다음 날짜'}
              className={`p-1.5 rounded-lg transition-colors ${
                isNextDisabled
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <span className="text-[11px] text-slate-400 hidden sm:inline-block">
            (오늘 이전 날짜 선택 가능)
          </span>
        </div>

        {/* Quick Date Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400 mr-1 hidden sm:inline">빠른 선택:</span>
          <button
            type="button"
            onClick={() => handlePreset(1)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedDate === formatDateToYYYY_MM_DD(getYesterdayDate())
                ? 'bg-rose-600 text-white shadow-md shadow-rose-950'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            어제
          </button>
          <button
            type="button"
            onClick={() => handlePreset(3)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
          >
            3일 전
          </button>
          <button
            type="button"
            onClick={() => handlePreset(7)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
          >
            지난 주
          </button>
          <button
            type="button"
            onClick={() => handlePreset(30)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
          >
            지난 달
          </button>
        </div>

      </div>

      {/* Bottom Row: Category Filters & View Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          
          {/* Nation Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 px-2 font-medium">국가:</span>
            <button
              type="button"
              onClick={() => onRepNationChange('')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                repNationCd === '' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              전체
            </button>
            <button
              type="button"
              onClick={() => onRepNationChange('K')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                repNationCd === 'K' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              한국영화
            </button>
            <button
              type="button"
              onClick={() => onRepNationChange('F')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                repNationCd === 'F' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              외국영화
            </button>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 px-2 font-medium">구분:</span>
            <button
              type="button"
              onClick={() => onMultiTypeChange('')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                multiType === '' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              전체
            </button>
            <button
              type="button"
              onClick={() => onMultiTypeChange('N')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                multiType === 'N' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              상업영화
            </button>
            <button
              type="button"
              onClick={() => onMultiTypeChange('Y')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                multiType === 'Y' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              다양성/독립
            </button>
          </div>

        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-end gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewMode === 'grid' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>포디움/카드</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewMode === 'table' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>표(리스트)</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('chart')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewMode === 'chart' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>점유율 분석</span>
          </button>
        </div>

      </div>

    </div>
  );
}
