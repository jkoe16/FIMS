import { supabase, isSupabaseConfigured } from '../lib/supabase';

const TABLE = 'inspections';

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

// 점검 이력 (설비명/코드 포함). equipmentId / result / 기간(from~to) 지정 시 필터
export async function listInspections({ equipmentId, result, from, to, limit = 50 } = {}) {
  let query = client()
    .from(TABLE)
    .select('*, equipment(equipment_name, equipment_code)')
    .order('inspected_at', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);
  if (equipmentId) query = query.eq('equipment_id', equipmentId);
  if (result) query = query.eq('overall_result', result);
  if (from) query = query.gte('inspected_at', from);
  if (to) query = query.lte('inspected_at', to);
  return unwrap(await query);
}

export async function createInspection(values) {
  return unwrap(await client().from(TABLE).insert(values).select().single());
}

// 다른 사용자/탭의 점검 등록을 실시간 수신. 구독 해제 함수 반환.
export function subscribeInspections(onChange) {
  if (!isSupabaseConfigured) return () => {};
  const channel = supabase
    .channel('inspections-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: TABLE }, onChange)
    .subscribe();
  return () => supabase.removeChannel(channel);
}
