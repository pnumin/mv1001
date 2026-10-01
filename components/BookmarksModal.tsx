'use client';

import React from 'react';
import { X, Bookmark, Trash2, Film, Eye } from 'lucide-react';
import { BoxOfficeItem } from '@/lib/kobis';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: { movieCd: string; movieNm: string; openDt?: string }[];
  onRemoveBookmark: (movieCd: string) => void;
  onClearAll: () => void;
  onSelectMovie: (movieCd: string) => void;
}

export default function BookmarksModal({
  isOpen,
  onClose,
  bookmarks,
  onRemoveBookmark,
  onClearAll,
  onSelectMovie,
}: BookmarksModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-lg max-h-[80vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h2 className="text-base font-bold text-white">내 관심 영화 보관함</h2>
            <span className="text-xs text-slate-400 font-mono">({bookmarks.length})</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {bookmarks.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Film className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">저장된 관심 영화가 없습니다.</p>
              <p className="text-xs text-slate-500">
                박스오피스 리스트에서 북마크 아이콘을 눌러 원하는 영화를 보관해 보세요.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {bookmarks.map((bm, idx) => (
                <div
                  key={`${bm.movieCd}-${idx}`}
                  className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors group"
                >
                  <div
                    onClick={() => {
                      onSelectMovie(bm.movieCd);
                      onClose();
                    }}
                    className="cursor-pointer flex-1 min-w-0 pr-3"
                  >
                    <h3 className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors truncate">
                      {bm.movieNm}
                    </h3>
                    {bm.openDt && (
                      <p className="text-xs text-slate-400">개봉일: {bm.openDt}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        onSelectMovie(bm.movieCd);
                        onClose();
                      }}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1 transition-colors"
                      title="영화 상세정보 보기"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onRemoveBookmark(bm.movieCd)}
                      className="p-2 rounded-lg bg-slate-800/80 hover:bg-rose-950 hover:text-rose-400 text-slate-400 transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {bookmarks.length > 0 && (
          <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs">
            <button
              onClick={onClearAll}
              className="text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              전체 삭제
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium transition-colors"
            >
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
