import { supabase, isSupabaseConfigured } from '../lib/supabase';

const TABLE = 'failures';

export const FAILURE_STATUSES = ['received', 'repairing', 'completed']; // 접수 / 수리 중 / 완료

function client() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase 연결 정보가 없습니다. .env 파일의 VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY를 확인하세요.');
  }
  return supabase;
}

function unwrap({ data, error }) {
  if (error) throw new Error(error.message);
  return data;
}

// 고장 이력 (설비명/코드 포함). status 지정 시 해당 상태만 조회
export async function listFailures({ status, limit = 100 } = {}) {
  let query = client()
    .from(TABLE)
    .select('*, equipment(equipment_name, equipment_code)')
    .order('occurred_at', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);
  if (status) query = query.eq('status', status);
  return unwrap(await query);
}

export async function createFailure(values) {
  return unwrap(await client().from(TABLE).insert(values).select().single());
}

export async function updateFailureStatus(id, status) {
  return unwrap(await client().from(TABLE).update({ status }).eq('id', id).select().single());
}

// 대시보드용 처리 상태별 건수
export async function getFailureStatusCounts() {
  const rows = unwrap(await client().from(TABLE).select('status'));
  return Object.fromEntries(FAILURE_STATUSES.map((s) => [s, rows.filter((r) => r.status === s).length]));
}

// 다른 사용자/탭의 변경 사항을 실시간 수신. 구독 해제 함수 반환.
// 같은 화면에 여러 구독이 있을 수 있어 채널 이름을 구분
export function subscribeFailures(onChange, name = 'default') {
  if (!isSupabaseConfigured) return () => {};
  const channel = supabase
    .channel(`failures-changes-${name}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: TABLE }, onChange)
    .subscribe();
  return () => supabase.removeChannel(channel);
}
