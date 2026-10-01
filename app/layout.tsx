import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KOBIS 한국 일일 박스오피스 | 시네마 랭킹',
  description: '영화관입장권통합전산망 KOBIS API 기반 일일 박스오피스 순위, 실시간 관객수, 매출액, 영화 상세 정보 조회',
  openGraph: {
    title: 'KOBIS 한국 일일 박스오피스 | 시네마 랭킹',
    description: '영화관입장권통합전산망 KOBIS API 기반 일일 박스오피스 순위, 실시간 관객수, 매출액, 영화 상세 정보 조회',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KOBIS 한국 일일 박스오피스 | 시네마 랭킹',
    description: '영화관입장권통합전산망 KOBIS API 기반 일일 박스오피스 순위, 실시간 관객수, 매출액, 영화 상세 정보 조회',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+KR:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-slate-950 text-slate-100 font-sans antialiased selection:bg-rose-500 selection:text-white min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
