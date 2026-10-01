import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { movieNm, movieNmEn, director, genres, openDt, watchGradeNm } = await req.json();

    if (!movieNm) {
      return NextResponse.json({ error: '영화 이름이 필요합니다.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      // Fallback response if GEMINI_API_KEY is not configured
      return NextResponse.json({
        synopsis: `${movieNm}은(는) ${openDt ? `${openDt} 개봉한 ` : ''}${genres?.join(', ') || '영화'} 장르의 작품으로, ${director ? `${director} 감독이 연출한 ` : ''}스릴 넘치는 스토리와 뛰어난 몰입감을 선보이는 인기 영화입니다.`,
        keyHighlights: [
          '몰입감 넘치는 명품 연기와 연출',
          '실시간 박스오피스 상위권 화제작',
          `${genres?.join('/') || '영화'} 팬들을 매료시키는 흥미진진한 전개`
        ],
        moodTags: [genres?.[0] || '인기작', '화제작', '극장추천', '관객추천'],
        targetAudience: '영화 팬 및 연인, 친구와 함께 극장을 찾는 모든 관람객',
        trivia: '개봉 이후 영화 팬들 사이에서 뜨거운 입소문과 높은 관객 반응을 기록하고 있습니다.'
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
당신은 한국 최고 영화 평론가이자 영화 인텔리전스 AI 분석가입니다.
다음 한국 박스오피스 영화 정보를 바탕으로 유용한 한국어 브리핑과 시놉시스 정보를 JSON 형식으로 생성해 주세요.

[영화 정보]
- 영화 제목: ${movieNm} (${movieNmEn || ''})
- 감독: ${director || '미상'}
- 장르: ${genres?.join(', ') || '정보없음'}
- 개봉일: ${openDt || '정보없음'}
- 관람등급: ${watchGradeNm || '전체관람가/미정'}

반드시 다음 JSON 구조로만 답변해주세요:
{
  "synopsis": "영화에 대한 흥미로운 2~3문장의 시놉시스 및 개요 요약",
  "keyHighlights": ["관전포인트1", "관전포인트2", "관전포인트3"],
  "moodTags": ["태그1", "태그2", "태그3", "태그4"],
  "targetAudience": "추천 관람층 (예: 2030 스릴러 마니아, 가족 관람객 등)",
  "trivia": "비하인드 스토리나 흥행 관전 요소 1문장"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const resultText = response.text || '';
    const parsedData = JSON.parse(resultText);

    return NextResponse.json(parsedData);
  } catch (err: any) {
    console.error('Gemini Movie AI Route Error:', err);
    // Fallback on error
    return NextResponse.json({
      synopsis: '영화를 감상하고 흥행 및 평가를 확인해보세요.',
      keyHighlights: ['실시간 박스오피스 선전중', '극장 스크린 상영작'],
      moodTags: ['영화추천', '박스오피스'],
      targetAudience: '모든 영화 관람객',
      trivia: '영화관입장권 통합전산망 KOBIS 실시간 집계 기준.'
    });
  }
}
