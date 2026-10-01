export interface BoxOfficeItem {
  rnum: string;
  rank: string;
  rankInten: string; // 순위 증감 (-1, 0, 2)
  rankOldAndNew: 'OLD' | 'NEW';
  movieCd: string;
  movieNm: string;
  openDt: string;
  salesAmt: string;
  salesShare: string;
  salesInten: string;
  salesChange: string;
  salesAcc: string;
  audiCnt: string;
  audiInten: string;
  audiChange: string;
  audiAcc: string;
  scrnCnt: string;
  showCnt: string;
}

export interface BoxOfficeResult {
  boxofficeType: string;
  showRange: string;
  dailyBoxOfficeList: BoxOfficeItem[];
}

export interface MovieInfo {
  movieCd: string;
  movieNm: string;
  movieNmEn: string;
  movieNmOg: string;
  showTm: string;
  openDt: string;
  prdtYear: string;
  typeNm: string;
  nations: { nationNm: string }[];
  genres: { genreNm: string }[];
  directors: { peopleNm: string; peopleNmEn: string }[];
  actors: { peopleNm: string; peopleNmEn: string; cast: string; castEn: string }[];
  showTypes: { showTypeGroupNm: string; showTypeNm: string }[];
  companys: { companyCd: string; companyNm: string; companyNmEn: string; companyPartNm: string }[];
  audits: { auditNo: string; watchGradeNm: string }[];
  staffs: { peopleNm: string; peopleNmEn: string; staffRoleNm: string }[];
}

export interface MovieInfoResult {
  movieInfoResult: {
    movieInfo: MovieInfo;
    source: string;
  };
}

export interface MovieAIInfo {
  synopsis: string;
  keyHighlights: string[];
  moodTags: string[];
  targetAudience: string;
  trivia: string;
}

// Helper: Format date to YYYYMMDD
export function formatDateToYYYYMMDD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

// Helper: Format Date to YYYY-MM-DD for <input type="date">
export function formatDateToYYYY_MM_DD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Get Yesterday's Date object
export function getYesterdayDate(): Date {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date;
}

// Format numbers to Korean localized string with comma (e.g. 1,234,567)
export function formatNumber(numStr: string | number): string {
  const val = typeof numStr === 'number' ? numStr : parseInt(numStr || '0', 10);
  if (isNaN(val)) return '0';
  return val.toLocaleString('ko-KR');
}

// Format large money amounts into Korean Won units (억, 만원)
export function formatKoreanMoney(amountStr: string | number): string {
  const val = typeof amountStr === 'number' ? amountStr : parseInt(amountStr || '0', 10);
  if (isNaN(val) || val === 0) return '0원';

  const eok = Math.floor(val / 100000000);
  const man = Math.floor((val % 100000000) / 10000);

  if (eok > 0) {
    return `${eok.toLocaleString('ko-KR')}억 ${man > 0 ? `${man.toLocaleString('ko-KR')}만` : ''}원`;
  }
  return `${man.toLocaleString('ko-KR')}만원`;
}

// Format Date YYYYMMDD or YYYY-MM-DD to Pretty Korean String (2026년 9월 30일)
export function formatPrettyDate(dateStr: string): string {
  if (!dateStr) return '';
  const clean = dateStr.replace(/-/g, '');
  if (clean.length < 8) return dateStr;

  const y = clean.substring(0, 4);
  const m = clean.substring(4, 6);
  const d = clean.substring(6, 8);

  const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const dayName = days[dateObj.getDay()];

  return `${y}년 ${parseInt(m)}월 ${parseInt(d)}일 (${dayName})`;
}

// Watch grade color mapping helper
export function getWatchGradeBadgeColor(gradeNm?: string): { bg: string; text: string; border: string } {
  if (!gradeNm) return { bg: 'bg-slate-800', text: 'text-slate-300', border: 'border-slate-700' };

  if (gradeNm.includes('전체')) {
    return { bg: 'bg-emerald-950/80', text: 'text-emerald-400', border: 'border-emerald-700/60' };
  } else if (gradeNm.includes('12')) {
    return { bg: 'bg-amber-950/80', text: 'text-amber-400', border: 'border-amber-700/60' };
  } else if (gradeNm.includes('15')) {
    return { bg: 'bg-orange-950/80', text: 'text-orange-400', border: 'border-orange-700/60' };
  } else if (gradeNm.includes('청소년') || gradeNm.includes('18') || gradeNm.includes('불가')) {
    return { bg: 'bg-rose-950/80', text: 'text-rose-400', border: 'border-rose-700/60' };
  }
  return { bg: 'bg-indigo-950/80', text: 'text-indigo-400', border: 'border-indigo-700/60' };
}
