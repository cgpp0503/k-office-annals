import { useCallback } from 'react';
import { supabase } from '../utils/supabase';
import { useQuizStore } from '../store/useQuizStore';

export type EventType = 'app_visit' | 'test_start' | 'answer_select' | 'test_complete' | 'share_click';

export function useTracking() {
    const userId = useQuizStore(state => state.userId);
    const refId = useQuizStore(state => state.refId);

    // Supabase 'events' 테이블에 데이터 적재하는 함수
    const logEvent = useCallback(async (eventType: EventType, metadata: Record<string, unknown> = {}) => {
        try {
            // payload에는 항상 초기 유입 시점의 ref_id(추천인)가 포함되도록 하여 바이럴 루프를 완벽히 추적합니다.
            const payload = {
                ...metadata,
                ref_id: refId,
            };

            const { error } = await supabase
                .from('events')
                .insert([
                    {
                        user_id: userId,
                        event_type: eventType,
                        metadata: payload,
                    },
                ]);

            if (error) {
                console.error(`[Tracking Error] ${eventType}:`, error.message);
            } else {
                console.log(`[Tracked] ${eventType}`, payload);
            }
        } catch (err) {
            console.error(`[Tracking Exception] ${eventType}:`, err);
        }
    }, [userId, refId]);

    return { logEvent };
}
