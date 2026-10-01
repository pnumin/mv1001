'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Header from '@/components/Header';
import DateFilterBar from '@/components/DateFilterBar';
import BoxOfficeSummary from '@/components/BoxOfficeSummary';
import PodiumTopThree from '@/components/PodiumTopThree';
import MovieCardGrid from '@/components/MovieCardGrid';
import MovieTableList from '@/components/MovieTableList';
import MarketChart from '@/components/MarketChart';
import MovieDetailModal from '@/components/MovieDetailModal';
import BookmarksModal from '@/components/BookmarksModal';
import {
  BoxOfficeItem,
  BoxOfficeResult,
  formatDateToYYYY_MM_DD,
  getYesterdayDate,
  formatPrettyDate,
} from '@/lib/kobis';
import { Loader2, AlertCircle, RefreshCw, Film, Sparkles } from 'lucide-react';

export default function HomePage() {
  // Default date = Yesterday
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    formatDateToYYYY_MM_DD(getYesterdayDate())
  );
  const [repNationCd, setRepNationCd] = useState<string>(''); // '' | 'K' | 'F'
  const [multiType, setMultiType] = useState<string>(''); // '' | 'N' | 'Y'
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'chart'>('grid');

  const [boxOfficeItems, setBoxOfficeItems] = useState<BoxOfficeItem[]>([]);
  const [showRange, setShowRange] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [selectedMovieCd, setSelectedMovieCd] = useState<string | null>(null);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState<boolean>(false);

  // Bookmarks state (localStorage synced)
  const [bookmarks, setBookmarks] = useState<{ movieCd: string; movieNm: string; openDt?: string }[]>([]);

  // Load bookmarks on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kobis_movie_bookmarks');
      if (saved) {
        setBookmarks(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load bookmarks', e);
    }
  }, []);

  // Save bookmarks
  const saveBookmarks = (newList: { movieCd: string; movieNm: string; openDt?: string }[]) => {
    setBookmarks(newList);
    try {
      localStorage.setItem('kobis_movie_bookmarks', JSON.stringify(newList));
    } catch (e) {
      console.error('Failed to save bookmarks', e);
    }
  };

  const handleToggleBookmark = (item: BoxOfficeItem | { movieCd: string; movieNm: string; openDt?: string }) => {
    const exists = bookmarks.some((b) => b.movieCd === item.movieCd);
    if (exists) {
      saveBookmarks(bookmarks.filter((b) => b.movieCd !== item.movieCd));
    } else {
      saveBookmarks([
        ...bookmarks,
        {
          movieCd: item.movieCd,
          movieNm: item.movieNm,
          openDt: 'openDt' in item ? item.openDt : undefined,
        },
      ]);
    }
  };

  const handleRemoveBookmark = (movieCd: string) => {
    saveBookmarks(bookmarks.filter((b) => b.movieCd !== movieCd));
  };

  const handleClearAllBookmarks = () => {
    saveBookmarks([]);
  };

  // Fetch Box Office Data
  const fetchBoxOffice = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const targetDt = selectedDate.replace(/-/g, '');
      let url = `/api/boxoffice?date=${targetDt}`;
      if (repNationCd) url += `&repNationCd=${encodeURIComponent(repNationCd)}`;
      if (multiType) url += `&multiType=${encodeURIComponent(multiType)}`;

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || '박스오피스 데이터를 불러올 수 없습니다.');
      }

      const result: BoxOfficeResult = data.boxOfficeResult;
      if (!result || !result.dailyBoxOfficeList) {
        setBoxOfficeItems([]);
        setShowRange('');
      } else {
        setBoxOfficeItems(result.dailyBoxOfficeList);
        setShowRange(result.showRange || '');
      }
    } catch (err: any) {
      console.error('Box office fetch error:', err);
      setError(err.message || '데이터를 불러오는 중 오류가 발생했습니다.');
      setBoxOfficeItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, repNationCd, multiType]);

  useEffect(() => {
    fetchBoxOffice();
  }, [fetchBoxOffice]);

  // Selected item for modal if available
  const activeBoxOfficeItem = boxOfficeItems.find((i) => i.movieCd === selectedMovieCd);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-600 selection:text-white">
      
      {/* Top Header */}
      <Header
        selectedDateStr={formatPrettyDate(selectedDate)}
        bookmarkCount={bookmarks.length}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Date Selector & Filter Controls */}
        <DateFilterBar
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          repNationCd={repNationCd}
          onRepNationChange={setRepNationCd}
          multiType={multiType}
          onMultiTypeChange={setMultiType}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          isLoading={isLoading}
        />

        {/* Loading Spinner */}
        {isLoading && (
          <div className="py-24 flex flex-col items-center justify-center space-y-3 bg-slate-900/40 rounded-2xl border border-slate-800">
            <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
            <p className="text-sm font-semibold text-slate-300">
              {formatPrettyDate(selectedDate)} 박스오피스 집계 데이터를 불러오는 중...
            </p>
          </div>
        )}

        {/* Error View */}
        {!isLoading && error && (
          <div className="p-8 text-center bg-rose-950/40 border border-rose-900/60 rounded-2xl space-y-3">
            <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
            <h3 className="text-base font-bold text-white">데이터 조회 실패</h3>
            <p className="text-xs text-rose-300 max-w-md mx-auto">{error}</p>
            <button
              onClick={fetchBoxOffice}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> 다시 시도
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && boxOfficeItems.length === 0 && (
          <div className="py-20 text-center bg-slate-900/50 border border-slate-800 rounded-2xl space-y-3">
            <Film className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-200">
              해당 날짜에 박스오피스 결과가 없거나 집계 전입니다.
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              다른 날짜를 선택하거나 검색 필터(국가/구분) 조건을 변경해 보세요.
            </p>
          </div>
        )}

        {/* Main Content Dashboard */}
        {!isLoading && !error && boxOfficeItems.length > 0 && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Box Office Summary Metrics */}
            <BoxOfficeSummary items={boxOfficeItems} showRange={showRange} />

            {/* View Mode Switching */}
            {viewMode === 'grid' && (
              <div className="space-y-8">
                {/* Podium Top 3 */}
                <PodiumTopThree
                  items={boxOfficeItems}
                  onSelectMovie={(movieCd) => setSelectedMovieCd(movieCd)}
                  bookmarkedCds={bookmarks.map((b) => b.movieCd)}
                  onToggleBookmark={handleToggleBookmark}
                />

                {/* Grid Ranks 4 ~ 10 */}
                <MovieCardGrid
                  items={boxOfficeItems}
                  onSelectMovie={(movieCd) => setSelectedMovieCd(movieCd)}
                  bookmarkedCds={bookmarks.map((b) => b.movieCd)}
                  onToggleBookmark={handleToggleBookmark}
                />
              </div>
            )}

            {viewMode === 'table' && (
              <MovieTableList
                items={boxOfficeItems}
                onSelectMovie={(movieCd) => setSelectedMovieCd(movieCd)}
                bookmarkedCds={bookmarks.map((b) => b.movieCd)}
                onToggleBookmark={handleToggleBookmark}
              />
            )}

            {viewMode === 'chart' && (
              <MarketChart
                items={boxOfficeItems}
                onSelectMovie={(movieCd) => setSelectedMovieCd(movieCd)}
              />
            )}

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <p className="font-semibold text-slate-400">KOBIS 영화관입장권통합전산망 OpenAPI 기반 연동</p>
            <p className="text-[11px]">
              본 서비스는 KOBIS 오픈 API를 통해 집계된 한국 일일 박스오피스 정보 및 영화 상세 정보를 제공합니다.
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>자료출처: 영화진흥위원회</span>
            <span>·</span>
            <span>REST API</span>
          </div>
        </div>
      </footer>

      {/* Movie Detail Modal */}
      <MovieDetailModal
        movieCd={selectedMovieCd}
        boxOfficeItem={activeBoxOfficeItem}
        onClose={() => setSelectedMovieCd(null)}
        isBookmarked={bookmarks.some((b) => b.movieCd === selectedMovieCd)}
        onToggleBookmark={handleToggleBookmark}
      />

      {/* Bookmarks Drawer Modal */}
      <BookmarksModal
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        onRemoveBookmark={handleRemoveBookmark}
        onClearAll={handleClearAllBookmarks}
        onSelectMovie={(movieCd) => {
          setSelectedMovieCd(movieCd);
          setIsBookmarksOpen(false);
        }}
      />

    </div>
  );
}
