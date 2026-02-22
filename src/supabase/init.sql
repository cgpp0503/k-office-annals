-- Supabase SQL DDL for K-Office Annals MVP

-- 1. events 테이블 생성
-- 확장성을 위해 모든 퍼널 이벤트는 단일 테이블에 적재됩니다.
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- 각 이벤트의 고유 식별자
  user_id UUID NOT NULL,                         -- 로컬에서 발급한 유저의 익명 UUID
  event_type TEXT NOT NULL,                      -- 'app_visit', 'test_start', 'answer_select', 'test_complete', 'share_click'
  metadata JSONB DEFAULT '{}'::jsonb,            -- 추가 정보 (ref_id, step, selected_axis, variant, result_type 등)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 인덱스 생성 (조회 및 그룹핑 성능 향상을 위함)
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_event_type ON events(event_type);
CREATE INDEX idx_events_created_at ON events(created_at);

-- 2. RLS(Row Level Security) 설정
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- 3. 익명(anon) 키 사용자 정책 설정
-- 마찰 없는 무로그인 경험을 제공하므로, 클라이언트에서는 오직 'Insert'만 가능하게 하여 로깅만 허용하고 테이블 데이터의 무단 조회/위변조를 방지합니다.
CREATE POLICY "Allow anonymous inserts" 
  ON events
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- (선택) 서비스 롤과 인증된(admin) 역할에는 모든 권한 허용
CREATE POLICY "Allow full access to service role"
  ON events
  USING (auth.role() = 'service_role');
