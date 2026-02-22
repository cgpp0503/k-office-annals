import { createClient } from '@supabase/supabase-js';

// 환경 변수 검증 (클라이언트 환경에서 접근 가능한 NEXT_PUBLIC_ 변수 사용)
// 실제 환경에서는 Vercel이나 환경 변수 파일(.env.local)에 셋팅되어야 합니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Supabase 클라이언트 싱글톤 인스턴스 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
