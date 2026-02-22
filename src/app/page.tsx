'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore } from '@/store/useQuizStore';
import { useTracking } from '@/hooks/useTracking';
import { QUESTIONS } from '@/constants/data';
import { getResultCharacter } from '@/utils/calculateResult';

function HomeContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { currentStep, answerQuestion, scores, setRefId, _hasHydrated, resetQuiz } = useQuizStore();
    const { logEvent } = useTracking();

    const [isStarted, setIsStarted] = useState(false);

    // 무한 렌더링(초기화) 방지를 위한 useRef 플래그
    const initialized = useRef(false);

    // 1. 초기 로드 시 퍼널 진입 추적 및 추천인 파라미터 처리 (단 1회만 실행)
    useEffect(() => {
        if (_hasHydrated && !initialized.current) {
            initialized.current = true; // 최초 실행됨을 마킹

            // URL에서 ref 파라미터(추천인 UUID) 추출
            const ref = searchParams.get('ref');
            if (ref) {
                setRefId(ref);
            }

            // 첫 방문 로깅
            logEvent('app_visit', { url_ref: ref });

            // 방치된 이전 상태가 남아있다면 강제 초기화하여 랜딩에서 시작하도록 함
            if (currentStep > 0) {
                resetQuiz();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_hasHydrated, searchParams, setRefId, logEvent, resetQuiz]); // currentStep을 의존성 배열에서 제거!

    // 화면 마운트 전 Hydration 에러 방지 처리
    if (!_hasHydrated) return null;

    // 2. 테스트 시작 핸들러
    const handleStart = () => {
        logEvent('test_start');
        setIsStarted(true);
    };

    // 3. ✨ [UI/UX 최적화] 답변 선택 핸들러 (Optimistic UI Update & Non-blocking)
    const handleAnswerSelect = (optionScores: Record<string, number>) => {
        const isLastQuestion = currentStep === QUESTIONS.length - 1;

        if (isLastQuestion) {
            // [마지막 질문 로직]
            // 상태 업데이트(answerQuestion)를 하면 13번을 렌더링하려다 에러가 발생하므로 바로 결과를 합산하고 라우팅합니다.
            const finalScores = { ...scores };
            for (const [key, value] of Object.entries(optionScores)) {
                finalScores[key as keyof typeof finalScores] += (value as number);
            }

            const resultChar = getResultCharacter(finalScores);

            // 로깅 및 라우팅을 배경에서 처리
            Promise.resolve().then(() => {
                logEvent('answer_select', { step: 12, selected_scores: optionScores });
                logEvent('test_complete', { result_type: resultChar.id });
                router.push(`/result?type=${resultChar.id}`);
            });
        } else {
            // [1. 상태 즉각 업데이트] 
            // 1~11번 질문: 0.1초의 딜레이도 없이 즉각적인 애니메이션을 볼 수 있습니다.
            answerQuestion(optionScores);

            // [2. 화면 전환 처리 후 로깅은 백그라운드 스레드로 던집니다]
            Promise.resolve().then(() => {
                logEvent('answer_select', {
                    step: currentStep + 1,
                    selected_scores: optionScores
                });
            });
        }
    };

    // 랜딩 화면 렌더링
    if (!isStarted) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-900 text-white p-6">
                <div className="max-w-md w-full text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <h2 className="text-zinc-400 font-medium tracking-widest text-sm">전생 사원증 발급소</h2>
                        <h1 className="text-4xl font-extrabold leading-tight shadow-zinc-800 drop-shadow-md">
                            K-오피스 실록 <br /> <span className="text-yellow-500">조선시대 당신의 직급은?</span>
                        </h1>
                        <p className="text-zinc-300 text-lg mt-4 break-keep">
                            현생에 지친 직장인들 환영합니다. <br />
                            단 12개의 질문으로 당신의 전생 오피스 캐릭터를 발급해 드립니다.
                        </p>
                    </motion.div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleStart}
                        className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-bold rounded-2xl text-xl transition-colors shadow-lg shadow-yellow-500/20"
                    >
                        사원증 발급 받기
                    </motion.button>
                </div>
            </main>
        );
    }

    // 퀴즈 진행 중일 때 보여줄 현재 질문 세팅
    const question = QUESTIONS[currentStep];
    const progressPercentage = ((currentStep) / QUESTIONS.length) * 100;

    return (
        <main className="flex min-h-screen flex-col items-center justify-start bg-zinc-900 text-white p-6 pt-12 overflow-hidden">
            <div className="max-w-md w-full">
                {/* 상단 프로그레스 바 */}
                <div className="w-full bg-zinc-800 h-2 rounded-full mb-8 overflow-hidden">
                    <div
                        className="bg-yellow-500 h-full transition-all duration-300 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>

                <div className="text-zinc-400 mb-8 font-medium">
                    Question {currentStep + 1} / {QUESTIONS.length}
                </div>

                {/* 좌우 슬라이드 애니메이션 처리된 퀴즈 컨테이너 */}
                {/* ✨ [애니메이션 최적화] key에 currentStep을 바인딩하고 transition 속도를 0.2초로 가속시켰습니다. */}
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentStep} // key가 바뀌면 Framer motion이 새로운 컴포넌트로 인식하여 애니메이션 실행
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }} // 속도와 보간 최적화
                        className="flex flex-col space-y-8"
                    >
                        {/* 질문 텍스트 */}
                        <h2 className="text-2xl font-bold leading-relaxed break-keep min-h-[100px]">
                            {question?.text}
                        </h2>

                        {/* 선택지 목록 */}
                        <div className="space-y-4">
                            {question?.options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswerSelect(option.scores as Record<string, number>)}
                                    /* ✨ [버튼 시각적 피드백 최적화] 터치 시 반응 즉각 구현을 위한 active:scale 클래스 보강 */
                                    className="w-full p-5 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-700 active:scale-[0.98] outline outline-1 outline-transparent hover:outline-zinc-500 text-left rounded-xl text-lg transition-all duration-150"
                                >
                                    <span className="break-keep">{option.text}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </main>
    );
}

export default function Home() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-zinc-900 flex items-center justify-center text-yellow-500 font-bold">로딩 중...</div>}>
            <HomeContent />
        </Suspense>
    );
}
