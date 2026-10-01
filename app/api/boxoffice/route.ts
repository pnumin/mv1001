import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get('date');
    const repNationCd = searchParams.get('repNationCd') || ''; // K: 한국, F: 외국
    const multiType = searchParams.get('multiType') || ''; // Y: 다양성, N: 상업

    if (!dateParam) {
      return NextResponse.json(
        { error: '날짜(date) 파라미터가 필요합니다. (YYYYMMDD)' },
        { status: 400 }
      );
    }

    // Clean date string to YYYYMMDD
    const targetDt = dateParam.replace(/-/g, '');

    // KOBIS API Key from environment variable
    const apiKey = process.env.KOBIS_API_KEY || '2a350cfbca6c428eb04c71e21cc681e7';

    let url = `http://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=${apiKey}&targetDt=${targetDt}&itemPerPage=10`;

    if (repNationCd) {
      url += `&repNationCd=${encodeURIComponent(repNationCd)}`;
    }
    if (multiType) {
      url += `&multiType=${encodeURIComponent(multiType)}`;
    }

    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache boxoffice data for 1 hour
    });

    if (!response.ok) {
      throw new Error(`KOBIS API HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Handle KOBIS API error response format
    if (data.faultInfo) {
      return NextResponse.json(
        { error: data.faultInfo.message || 'KOBIS API 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error('KOBIS Daily Box Office API Error:', err);
    return NextResponse.json(
      { error: err.message || '박스오피스 정보를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
