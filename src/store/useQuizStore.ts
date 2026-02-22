import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { AxisScores } from '../types';

interface QuizState {
    userId: string;          // 익명 유저 고유 ID
    refId: string | null;    // 진입 시점의 추천인 UUID (Viral Tracking)
    currentStep: number;     // 현재 퀴즈 진행 단계 (0 ~ 11)
    scores: AxisScores;      // 현재 누적된 축별 점수
    _hasHydrated: boolean;   // Hydration 에러 방지용 플래그

    setRefId: (id: string) => void;
    answerQuestion: (scoresToAdd: Partial<AxisScores>) => void;
    resetQuiz: () => void;
    setHasHydrated: (state: boolean) => void;
}

const initialScores: AxisScores = {
    strategy: 0,
    leadership: 0,
    social: 0,
    emotion: 0,
};

export const useQuizStore = create<QuizState>()(
    persist(
        (set) => ({
            userId: uuidv4(), // 최초 스토어 생성 시 1회 발급
            refId: null,
            currentStep: 0,
            scores: { ...initialScores },
            _hasHydrated: false,

            // 공유 링크로 유입된 경우 추천인의 UUID를 셋팅
            setRefId: (id: string) => set({ refId: id }),

            // 사용자가 답변을 선택했을 때 점수 합산 및 다음 스텝 이동
            answerQuestion: (scoresToAdd) => set((state) => {
                const newScores = { ...state.scores };
                (Object.keys(scoresToAdd) as Array<keyof AxisScores>).forEach(key => {
                    newScores[key] += (scoresToAdd[key] ?? 0);
                });

                return {
                    scores: newScores,
                    currentStep: state.currentStep + 1,
                };
            }),

            // 첫 화면으로 돌아가거나 다시하기 시작할 때 상태 초기화 (userId와 refId는 유지)
            resetQuiz: () => set({
                currentStep: 0,
                scores: { ...initialScores },
            }),

            setHasHydrated: (state) => set({ _hasHydrated: state }),
        }),
        {
            name: 'k-office-storage', // 로컬 스토리지 키 이름
            onRehydrateStorage: () => (state) => {
                // Hydration 완료 시점을 클라이언트에서 알 수 있도록 설정
                state?.setHasHydrated(true);
            },
        }
    )
);
