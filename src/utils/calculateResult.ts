import { AxisScores, Character } from '../types';
import { CHARACTERS } from '../constants/data';

/**
 * 1. 전생 사원증(캐릭터) 결정 알고리즘
 * @param userScores 사용자의 최종 합산 축별 점수
 * @returns 가장 잘 매핑된 캐릭터(Character) 객체
 */
export function getResultCharacter(userScores: AxisScores): Character {
    // 우선순위 정의 (동점일 경우 strategy > leadership > social > emotion)
    const priority: Record<keyof AxisScores, number> = {
        strategy: 4,
        leadership: 3,
        social: 2,
        emotion: 1
    };

    // 점수가 높은 순으로 4개 축을 정렬. 동일한 점수일 경우 우선순위 가중치 비교.
    const axes = Object.keys(userScores) as Array<keyof AxisScores>;
    const sortedAxes = axes.sort((a, b) => {
        if (userScores[b] === userScores[a]) {
            return priority[b] - priority[a];
        }
        return userScores[b] - userScores[a];
    });

    const top1 = sortedAxes[0];
    const top2 = sortedAxes[1];

    let targetCharId = "";

    // 점수가 가장 높은 두 개 축의 조합에 따라 조선시대 오피스 캐릭터 매핑
    if (userScores[top1] <= 0) {
        // 모든 점수가 극도로 낮으면 무념무상
        targetCharId = "zen_monk";
    } else if (top1 === 'strategy' && top2 === 'leadership') {
        // 둘 다 높지만, 전략 점수의 압도성에 따라 두 캐릭터로 분기
        targetCharId = userScores.strategy > 5 ? "royal_strategist" : "clear_eyed_historian";
    } else if (top1 === 'leadership' && top2 === 'emotion') {
        targetCharId = "mad_king";
    } else if (top1 === 'social' && top2 === 'emotion') {
        targetCharId = "social_butterfly_eunuch";
    } else if (top1 === 'emotion' && (top2 === 'social' || top2 === 'leadership')) {
        targetCharId = "crying_intern";
    } else if (top1 === 'leadership' && top2 === 'social') {
        targetCharId = "silent_general";
    } else if (top1 === 'social' && top2 === 'strategy') {
        targetCharId = "gossip_merchant";
    } else {
        // 지정되지 않은 엣지 케이스의 조합일 경우, 유클리드 거리가 가장 가까운 캐릭터로 Fallback
        let bestMatch = CHARACTERS[0];
        let minDistance = Infinity;
        for (const char of CHARACTERS) {
            if (char.id === 'zen_monk') continue; // fallback에서 제외
            const dist = calculateEuclideanDistance(userScores, char.baseScores);
            if (dist < minDistance) {
                minDistance = dist;
                bestMatch = char;
            }
        }
        return bestMatch;
    }

    // 매핑된 ID를 기반으로 Character 배열에서 검색 후 반환. 예외 발생 시 기본 캐릭터 반환.
    return CHARACTERS.find(c => c.id === targetCharId) || CHARACTERS[0];
}

/**
 * 2. 유클리드 거리 (Euclidean Distance) 계산 유틸 
 */
function calculateEuclideanDistance(scores1: AxisScores, scores2: AxisScores): number {
    return Math.sqrt(
        Math.pow(scores1.strategy - scores2.strategy, 2) +
        Math.pow(scores1.leadership - scores2.leadership, 2) +
        Math.pow(scores1.social - scores2.social, 2) +
        Math.pow(scores1.emotion - scores2.emotion, 2)
    );
}

/**
 * 3. 궁합 계산 알고리즘 
 * @param char1 첫번째 유저/캐릭터
 * @param char2 두번째 캐릭터
 * @returns 0~100% 게이지 환산 값
 */
export function calculateCompatibility(char1: Character, char2: Character): number {
    const maxPossibleDistance = Math.sqrt(Math.pow(20, 2) * 4); // 대략적인 최대 거리 값 산정
    const distance = calculateEuclideanDistance(char1.baseScores, char2.baseScores);

    // 거리가 0에 가까울수록 100%, 멀수록 0%
    let percentage = 100 - ((distance / maxPossibleDistance) * 100);

    // 게이지가 너무 낮게 나와 상처받지 않게 하한선(20%) 스케일 조정 (UI 경험 향상)
    percentage = Math.max(20, Math.min(100, Math.floor(percentage * 1.5)));

    return percentage;
}
