import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const movieCd = searchParams.get('movieCd');

    if (!movieCd) {
      return NextResponse.json(
        { error: '영화 코드(movieCd) 파라미터가 필요합니다.' },
        { status: 400 }
      );
    }

    // KOBIS API Key from environment variable
    const apiKey = process.env.KOBIS_API_KEY || '2a350cfbca6c428eb04c71e21cc681e7';

    const url = `http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=${apiKey}&movieCd=${movieCd}`;

    const response = await fetch(url, {
      next: { revalidate: 86400 }, // Cache movie detail for 24 hours
    });

    if (!response.ok) {
      throw new Error(`KOBIS API HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.faultInfo) {
      return NextResponse.json(
        { error: data.faultInfo.message || 'KOBIS Movie Detail API 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error('KOBIS Movie Info API Error:', err);
    return NextResponse.json(
      { error: err.message || '영화 상세 정보를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
