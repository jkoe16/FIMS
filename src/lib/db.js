// 신규 서비스 공통 헬퍼 (Supabase 클라이언트 확인, 오류 처리, 실시간 구독)
import { supabase, isSupabaseConfigured } from './supabase';

export function db() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase 연결 정보가 없습니다. .env 파일의 VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY를 확인하세요.');
  }
  return supabase;
}

export function unwrap({ data, error }) {
  if (error) throw new Error(error.message);
  return data;
}

// 여러 테이블 변경을 하나의 채널로 구독. 구독 해제 함수 반환.
export function subscribeTables(name, tables, onChange) {
  if (!isSupabaseConfigured) return () => {};
  const channel = supabase.channel(`${name}-${Math.random().toString(36).slice(2)}`);
  tables.forEach((table) => channel.on('postgres_changes', { event: '*', schema: 'public', table }, onChange));
  channel.subscribe();
  return () => supabase.removeChannel(channel);
}
