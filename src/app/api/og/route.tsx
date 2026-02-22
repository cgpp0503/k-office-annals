import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { CHARACTERS } from '@/constants/data';

// next/og는 Edge 런타임에서 작동합니다.
export const runtime = 'edge';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // ?type 파라미터가 있으면 해당 캐릭터를, 없으면 기본 캐릭터(0번째) 로드
        const type = searchParams.get('type');
        const character = CHARACTERS.find((c) => c.id === type) || CHARACTERS[0];

        // SVG 렌더링에 필요한 기본적인 레이아웃을 HTML/CSS(Tailwind 클래스 포함)로 작성합니다.
        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#18181b', // zinc-900 
                        color: '#fff',
                        fontFamily: 'sans-serif',
                        padding: '40px',
                        border: '24px solid #eab308', // yellow-500 테두리
                    }}
                >
                    {/* 타이틀 영역 */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginBottom: '30px',
                        }}
                    >
                        <span style={{ fontSize: '32px', color: '#a1a1aa', fontWeight: 600, letterSpacing: '4px' }}>
                            전생 사원증 발급소
                        </span>
                        <h1 style={{ fontSize: '64px', fontWeight: 900, marginTop: '10px' }}>
                            K-오피스 실록
                        </h1>
                    </div>

                    {/* 캐릭터 썸네일 박스 코스프레 */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            backgroundColor: '#27272a', // zinc-800
                            padding: '40px',
                            borderRadius: '32px',
                            border: '4px solid #eab308',
                            boxShadow: '0 20px 25px -5px rgba(234, 179, 8, 0.2)',
                        }}
                    >
                        <div style={{ fontSize: '48px', color: '#eab308', fontWeight: 800, marginBottom: '20px' }}>
                            {character.name}
                        </div>

                        <div style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
                            {character.features.map((feature, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        backgroundColor: '#3f3f46',
                                        padding: '12px 24px',
                                        borderRadius: '16px',
                                        fontSize: '24px'
                                    }}
                                >
                                    {feature}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginTop: 'auto', fontSize: '32px', color: '#a1a1aa' }}>
                        나의 조선시대 직급이 궁금하다면? 링크를 클릭하세요!
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e) {
        console.error(`[OG Route Error]: ${e instanceof Error ? e.message : 'Unknown error'}`);
        return new Response('Failed to generate image', { status: 500 });
    }
}
