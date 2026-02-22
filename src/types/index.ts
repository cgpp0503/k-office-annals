export interface AxisScores {
    strategy: number;
    leadership: number;
    social: number;
    emotion: number;
}

export interface AnswerOption {
    text: string;
    scores: Partial<AxisScores>;
}

export interface Question {
    id: number;
    text: string;
    options: AnswerOption[];
}

export interface Character {
    id: string; // 영문 ID (예: royal_strategist)
    name: string; // 캐릭터 한글명
    description: string; // 캐릭터 설명
    features: string[]; // 주요 특징 3가지
    imageUrl: string; // 썸네일/사원증 이미지 경로
    baseScores: AxisScores; // 유클리드 거리 기반 궁합 계산을 위한 기준 점수 벡터
}
