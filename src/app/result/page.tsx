'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CHARACTERS } from '@/constants/data';
import { useQuizStore } from '@/store/useQuizStore';
import { useTracking } from '@/hooks/useTracking';
import { getBaseUrl } from '@/lib/utils';

function ResultContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { logEvent } = useTracking();
    const { userId, _hasHydrated, resetQuiz } = useQuizStore();

    const [isFlipped, setIsFlipped] = useState(false);
    const [shareVariant, setShareVariant] = useState<'A' | 'B'>('A');

    // URL 파라미터에서 결과 타입 추출 (?type=royal_strategist)
    const typeValue = searchParams.get('type');

    // 파라미터가 비정상적인 경우 fallback 처리
    const character = CHARACTERS.find(c => c.id === typeValue) || CHARACTERS[0];

    useEffect(() => {
        // A/B 테스트: Hydration 에러 방지를 위해 컴포넌트 마운트 이후에 랜덤 값 할당
        if (_hasHydrated) {
            setShareVariant(Math.random() > 0.5 ? 'A' : 'B');
        }
    }, [_hasHydrated]);

    if (!_hasHydrated) return null;

    const handleShare = async () => {
        // 1. 공유 버튼 클릭 이벤트 퍼널 로깅 (A/B 테스트 결과 추적)
        logEvent('share_click', { variant: shareVariant, result_type: character.id });

        // 2. 추천인(현재 유저) UUID를 ref 파라미터로 삽입하여 바이럴 루프 엔진 생성
        // 환경에 관계없이 확실한 절대 경로(Absolute URL) 보장
        const shareUrl = `${getBaseUrl()}/result?type=${character.id}&ref=${userId}`;

        // 3. Web Share API 지원 여부 확인 후 네이티브 공유 또는 클립보드 복사
        if (navigator.share) {
            try {
                await navigator.share({
                    title: '전생 사원증 발급소',
                    text: `내 전생 사원증은 [${character.name}]! 너도 테스트해봐.`,
                    url: shareUrl,
                });
            } catch (err) {
                console.log('User cancelled share or share failed', err);
            }
        } else {
            await navigator.clipboard.writeText(shareUrl);
            alert('링크가 복사되었습니다! 친구들에게 공유해보세요.');
        }
    };

    // A/B Variant에 따른 버튼 텍스트 분기
    const shareButtonText = shareVariant === 'A' ? "내 사원증 자랑하기" : "동료 사원증 폭로하기";

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-900 text-white p-6 pb-20 overflow-x-hidden">
            <div className="max-w-md w-full flex flex-col items-center space-y-8 mt-12">
                <h2 className="text-xl font-bold text-yellow-500">당신의 전생 오피스 직급은...</h2>

                {/* 3D Flip Card 형태의 사원증 */}
                {/* 인라인 속성을 활용하여 3D perspective 및 backface 보존 */}
                <div
                    className="relative w-72 h-96 cursor-pointer"
                    style={{ perspective: 1000 }}
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    <motion.div
                        className="w-full h-full relative"
                        style={{ transformStyle: 'preserve-3d' }}
                        initial={false}
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
                    >
                        {/* 카드 앞면 */}
                        <div
                            className="absolute w-full h-full bg-zinc-800 border-2 border-yellow-500/50 rounded-2xl flex flex-col items-center justify-center p-6 shadow-2xl shadow-yellow-500/20"
                            style={{ backfaceVisibility: 'hidden' }}
                        >
                            <div className="w-32 h-32 bg-zinc-700 rounded-full mb-6 overflow-hidden flex items-center justify-center shadow-lg border-4 border-zinc-800">
                                {/* 실제 이미지가 로드됩니다. 만약 이미지가 없으면 on-error 콜백으로 텍스트를 보여줍니다. */}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={character.imageUrl}
                                    alt={character.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.parentElement!.innerHTML = `<span class="text-zinc-500 text-xs text-center p-2">이미지<br/>없음</span>`;
                                    }}
                                />
                            </div>
                            <p className="text-zinc-400 text-sm mb-2">{character.id.toUpperCase()}</p>
                            <h1 className="text-3xl font-extrabold text-white text-center break-keep">{character.name}</h1>
                            <p className="mt-8 text-yellow-500 text-xs animate-pulse opacity-80">카드를 터치하여 뒷면 보기 ↻</p>
                        </div>

                        {/* 카드 뒷면 (상세 설명) */}
                        <div
                            className="absolute w-full h-full bg-zinc-800 border-2 border-zinc-600 rounded-2xl p-6 flex flex-col"
                            style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
                        >
                            <h3 className="text-lg font-bold text-yellow-500 mb-4 border-b border-zinc-600 pb-2">사원증 세부 정보</h3>
                            <p className="text-sm text-zinc-300 leading-relaxed mb-6 break-keep">
                                {character.description}
                            </p>

                            <div className="space-y-3">
                                <p className="text-xs text-yellow-500 font-semibold mb-1">핵심 특징</p>
                                {character.features.map((feature, idx) => (
                                    <div key={idx} className="bg-zinc-700 px-3 py-2 rounded-lg text-sm text-zinc-200">
                                        ✔️ {feature}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* 하단 액션 버튼 영역 */}
                <div className="w-full space-y-4 pt-8">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleShare}
                        className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-bold rounded-xl text-lg transition-colors shadow-lg shadow-yellow-500/20 flex items-center justify-center"
                    >
                        {shareButtonText}
                    </motion.button>

                    <button
                        onClick={() => {
                            resetQuiz();
                            router.push('/');
                        }}
                        className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl text-lg transition-colors border border-zinc-700"
                    >
                        처음부터 다시하기
                    </button>
                </div>
            </div>

            {/* ✨ 신규 피쳐: 조선 오피스 인물록 (다른 유형 구경하기 도감) */}
            <div className="w-full max-w-md mt-20 border-t border-zinc-800 pt-10 pb-8">
                <div className="text-center mb-8">
                    <p className="text-yellow-500 text-sm font-semibold mb-1 tracking-widest">K-OFFICE ANNALS</p>
                    <h2 className="text-2xl font-bold text-white">조선 오피스 인물록</h2>
                    <p className="text-zinc-500 text-sm mt-2">나와 함께 일했던 다른 동료들의 전생은?</p>
                </div>

                {/* Framer Motion stagger 활용: 화면 스크롤 시 순차적으로 나타나는 도감 카드들 */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }} // 화면에 약간 들어왔을 때 애니메이션 시작
                    variants={{
                        visible: { transition: { staggerChildren: 0.1 } } // 0.1초 간격으로 타다닥 나타남
                    }}
                    className="grid grid-cols-2 gap-4"
                >
                    {CHARACTERS.map((charData) => {
                        const isMyResult = charData.id === character.id; // 현재 사용자의 결과와 일치하는지 확인

                        return (
                            <motion.div
                                key={charData.id}
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
                                }}
                            >
                                <button
                                    onClick={() => router.push(`/result?type=${charData.id}`)}
                                    // 현재 유저 결과면 밝은 노란 테두리, 아니면 은은한 느낌의 전통적 테두리 바이브
                                    className={`relative w-full text-left p-4 rounded-xl border flex flex-col items-center justify-center bg-zinc-800/80 transition-all hover:bg-zinc-800 hover:-translate-y-1 ${isMyResult ? 'border-yellow-500 shadow-lg shadow-yellow-500/10' : 'border-zinc-700/50 hover:border-zinc-600'
                                        }`}
                                >
                                    {/* 현재 유저의 유형일 때 달아주는 예쁜 뱃지 */}
                                    {isMyResult && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-zinc-900 text-[10px] font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                                            나의 전생
                                        </div>
                                    )}

                                    {/* 썸네일 영역 (플레이스홀더) */}
                                    <div className={`w-14 h-14 rounded-full mb-3 flex items-center justify-center overflow-hidden border-2 ${isMyResult ? 'border-yellow-500/50' : 'border-zinc-700'}`}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={charData.imageUrl}
                                            alt={charData.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.parentElement!.innerHTML = `<span class="text-zinc-500 text-[10px] leading-tight text-center">이미지<br/>없음</span>`;
                                            }}
                                        />
                                    </div>

                                    <h3 className={`text-sm font-bold mb-1 text-center ${isMyResult ? 'text-white' : 'text-zinc-300'}`}>
                                        {charData.name}
                                    </h3>

                                    {/* 한줄 요약에서 가장 첫 번째 줄만 잘라서 보여주기 */}
                                    <p className="text-[11px] text-zinc-500 text-center line-clamp-2 break-keep leading-snug">
                                        {charData.description.split('.')[0]}.
                                    </p>
                                </button>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </main>
    );
}

// useSearchParams는 Client Component 내부에서 비동기 렌더링에 영향을 줄 수 있으므로 Suspense 바운더리로 감싸줍니다.
export default function ResultPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-zinc-900 flex items-center justify-center text-yellow-500 font-bold">결과를 불러오는 중...</div>}>
            <ResultContent />
        </Suspense>
    );
}
