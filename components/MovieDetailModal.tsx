'use client';

import React, { useEffect, useState } from 'react';
import {
  X,
  Clock,
  Calendar,
  Film,
  Users,
  Building2,
  Sparkles,
  Bookmark,
  Award,
  Clapperboard,
  Tv,
  Loader2,
  AlertCircle,
  Share2,
  Check
} from 'lucide-react';
import {
  MovieInfoResult,
  MovieAIInfo,
  BoxOfficeItem,
  getWatchGradeBadgeColor,
  formatNumber,
  formatKoreanMoney
} from '@/lib/kobis';

interface MovieDetailModalProps {
  movieCd: string | null;
  boxOfficeItem?: BoxOfficeItem;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (item: BoxOfficeItem | { movieCd: string; movieNm: string }) => void;
}

export default function MovieDetailModal({
  movieCd,
  boxOfficeItem,
  onClose,
  isBookmarked,
  onToggleBookmark,
}: MovieDetailModalProps) {
  const [movieData, setMovieData] = useState<MovieInfoResult | null>(null);
  const [aiData, setAiData] = useState<MovieAIInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'ai' | 'companies'>('info');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!movieCd) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);
    setMovieData(null);
    setAiData(null);

    // Fetch movie detail from /api/movie-detail
    fetch(`/api/movie-detail?movieCd=${movieCd}`)
      .then((res) => {
        if (!res.ok) throw new Error('영화 상세 정보를 불러올 수 없습니다.');
        return res.json();
      })
      .then((data: MovieInfoResult) => {
        if (!isMounted) return;
        if (!data?.movieInfoResult?.movieInfo) {
          throw new Error('영화 상세 데이터가 존재하지 않습니다.');
        }
        setMovieData(data);
        setIsLoading(false);

        // Fetch AI analysis in parallel
        const info = data.movieInfoResult.movieInfo;
        setIsAiLoading(true);
        fetch('/api/movie-ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            movieNm: info.movieNm,
            movieNmEn: info.movieNmEn,
            director: info.directors?.[0]?.peopleNm || '',
            genres: info.genres?.map((g) => g.genreNm) || [],
            openDt: info.openDt || boxOfficeItem?.openDt || '',
            watchGradeNm: info.audits?.[0]?.watchGradeNm || '',
          }),
        })
          .then((res) => res.json())
          .then((aiRes) => {
            if (isMounted) {
              setAiData(aiRes);
              setIsAiLoading(false);
            }
          })
          .catch(() => {
            if (isMounted) setIsAiLoading(false);
          });
      })
      .catch((err: any) => {
        if (isMounted) {
          setError(err.message || '영화 정보를 불러오는 실패했습니다.');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [movieCd, boxOfficeItem]);

  if (!movieCd) return null;

  const info = movieData?.movieInfoResult?.movieInfo;
  const gradeBadge = getWatchGradeBadgeColor(info?.audits?.[0]?.watchGradeNm);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-rose-500" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              KOBIS 영화 상세정보
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="링크 복사"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                if (boxOfficeItem) {
                  onToggleBookmark(boxOfficeItem);
                } else if (info) {
                  onToggleBookmark({ movieCd: info.movieCd, movieNm: info.movieNm });
                }
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
              title="관심영화"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
              <p className="text-sm text-slate-400 font-medium">영화 상세정보를 불러오는 중입니다...</p>
            </div>
          ) : error ? (
            <div className="py-12 px-6 text-center space-y-3 bg-rose-950/30 border border-rose-900/50 rounded-xl">
              <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
              <p className="text-sm font-semibold text-rose-300">{error}</p>
              <p className="text-xs text-slate-400">네트워크 연결 또는 KOBIS 서버 상태를 확인해 주세요.</p>
            </div>
          ) : info ? (
            <>
              {/* Top Banner & Titles */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {info.movieNm}
                    </h2>
                    {info.movieNmEn && (
                      <p className="text-xs sm:text-sm font-mono text-slate-400 mt-0.5">
                        {info.movieNmEn}
                      </p>
                    )}
                  </div>

                  {/* Watch Grade Badge */}
                  {info.audits?.[0]?.watchGradeNm && (
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-bold border ${gradeBadge.bg} ${gradeBadge.text} ${gradeBadge.border} shrink-0`}
                    >
                      {info.audits[0].watchGradeNm}
                    </span>
                  )}
                </div>

                {/* Genre Tags & Basic Quick Specs */}
                <div className="flex items-center gap-2 flex-wrap text-xs text-slate-300 pt-1">
                  {info.genres?.map((g, idx) => (
                    <span
                      key={`${g.genreNm}-${idx}`}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 font-medium text-slate-200"
                    >
                      {g.genreNm}
                    </span>
                  ))}

                  {info.showTm && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/80">
                      <Clock className="w-3.5 h-3.5 text-rose-400" />
                      {info.showTm}분
                    </span>
                  )}

                  {info.openDt && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/80">
                      <Calendar className="w-3.5 h-3.5 text-rose-400" />
                      개봉: {info.openDt.substring(0, 4)}.{info.openDt.substring(4, 6)}.{info.openDt.substring(6, 8)}
                    </span>
                  )}

                  {info.nations?.[0]?.nationNm && (
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/80">
                      국가: {info.nations[0].nationNm}
                    </span>
                  )}
                </div>
              </div>

              {/* BoxOffice Performance Banner (if clicked from boxoffice) */}
              {boxOfficeItem && (
                <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-amber-950/40 border border-rose-900/40 p-4 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">박스오피스 순위</span>
                    <span className="text-base font-extrabold text-amber-400 font-mono">
                      {boxOfficeItem.rank}위
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">당일 관객수</span>
                    <span className="text-base font-extrabold text-white font-mono">
                      {formatNumber(boxOfficeItem.audiCnt)}명
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">누적 관객수</span>
                    <span className="text-base font-extrabold text-slate-200 font-mono">
                      {formatNumber(boxOfficeItem.audiAcc)}명
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">매출 점유율</span>
                    <span className="text-base font-extrabold text-rose-400 font-mono">
                      {boxOfficeItem.salesShare}%
                    </span>
                  </div>
                </div>
              )}

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    activeTab === 'info'
                      ? 'bg-rose-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Clapperboard className="w-3.5 h-3.5" />
                  기본 및 출연진
                </button>
                <button
                  onClick={() => setActiveTab('ai')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    activeTab === 'ai'
                      ? 'bg-rose-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  AI 줄거리 및 분석
                </button>
                <button
                  onClick={() => setActiveTab('companies')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    activeTab === 'companies'
                      ? 'bg-rose-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  제작/배급/상영형태
                </button>
              </div>

              {/* Tab 1: Info & Cast */}
              {activeTab === 'info' && (
                <div className="space-y-5 animate-fadeIn">
                  {/* Director Section */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-rose-400" /> 감독
                    </h3>
                    <div className="flex items-center gap-3 flex-wrap">
                      {info.directors && info.directors.length > 0 ? (
                        info.directors.map((dir, idx) => (
                          <div
                            key={`${dir.peopleNm}-${idx}`}
                            className="bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs text-white font-medium"
                          >
                            {dir.peopleNm} {dir.peopleNmEn ? `(${dir.peopleNmEn})` : ''}
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500">감독 정보 없음</span>
                      )}
                    </div>
                  </div>

                  {/* Actor / Cast Section */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-rose-400" /> 주요 출연진
                    </h3>
                    {info.actors && info.actors.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {info.actors.slice(0, 9).map((act, idx) => (
                          <div
                            key={`${act.peopleNm}-${idx}`}
                            className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 text-xs space-y-0.5"
                          >
                            <p className="font-bold text-slate-100">{act.peopleNm}</p>
                            {act.cast && (
                              <p className="text-[11px] text-rose-400 truncate">역할: {act.cast}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500">주요 출연진 정보가 없습니다.</span>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Gemini AI Insights & Synopsis */}
              {activeTab === 'ai' && (
                <div className="space-y-4 animate-fadeIn">
                  {isAiLoading ? (
                    <div className="py-8 text-center space-y-2">
                      <Loader2 className="w-6 h-6 text-amber-400 animate-spin mx-auto" />
                      <p className="text-xs text-slate-400">Gemini AI가 영화 줄거리와 흥행 포인트를 분석 중입니다...</p>
                    </div>
                  ) : aiData ? (
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                      {/* AI Synopsis */}
                      <div>
                        <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-1">
                          <Sparkles className="w-4 h-4" /> AI 요약 시놉시스
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                          {aiData.synopsis}
                        </p>
                      </div>

                      {/* Key Highlights */}
                      {aiData.keyHighlights && aiData.keyHighlights.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-slate-300 mb-1.5">관전 핵심 포인트</h4>
                          <ul className="space-y-1">
                            {aiData.keyHighlights.map((hl, i) => (
                              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                                <span className="text-rose-400 font-bold">•</span>
                                <span>{hl}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Mood Tags & Target Audience */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                        <div>
                          <span className="text-[11px] text-slate-400 block mb-1">분위기 & 키워드</span>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {aiData.moodTags?.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 rounded-md bg-amber-950/60 text-amber-300 text-[11px] border border-amber-800/40"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="text-[11px] text-slate-400 block mb-1">추천 관람층</span>
                          <span className="text-xs text-slate-200 font-medium">
                            {aiData.targetAudience}
                          </span>
                        </div>
                      </div>

                      {aiData.trivia && (
                        <p className="text-xs text-slate-400 italic pt-2 border-t border-slate-800">
                          💡 관전 비하인드: {aiData.trivia}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">AI 줄거리 정보를 불러올 수 없습니다.</p>
                  )}
                </div>
              )}

              {/* Tab 3: Formats & Companies */}
              {activeTab === 'companies' && (
                <div className="space-y-4 animate-fadeIn text-xs">
                  {/* Show Types */}
                  <div>
                    <h4 className="font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                      <Tv className="w-4 h-4 text-indigo-400" /> 상영 타입 (포맷)
                    </h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      {info.showTypes && info.showTypes.length > 0 ? (
                        info.showTypes.map((st, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-800/50 text-indigo-300 font-medium"
                          >
                            {st.showTypeGroupNm} ({st.showTypeNm})
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500">2D 디지털 기본 상영</span>
                      )}
                    </div>
                  </div>

                  {/* Companies */}
                  <div>
                    <h4 className="font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-indigo-400" /> 제작 및 배급사
                    </h4>
                    {info.companys && info.companys.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {info.companys.map((comp) => (
                          <div
                            key={comp.companyCd}
                            className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center"
                          >
                            <span className="font-bold text-white">{comp.companyNm}</span>
                            <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                              {comp.companyPartNm}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-500">영화사 정보가 없습니다.</span>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Footer Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>제공: 영화진흥위원회 (KOBIS)</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
