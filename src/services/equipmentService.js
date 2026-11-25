import { supabase, isSupabaseConfigured } from '../lib/supabase';

const TABLE = 'equipment';

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

export async function listEquipment() {
  return unwrap(await client().from(TABLE).select('*').order('created_at', { ascending: false }));
}

export async function createEquipment(values) {
  return unwrap(await client().from(TABLE).insert(values).select().single());
}

export async function updateEquipment(id, values) {
  return unwrap(await client().from(TABLE).update(values).eq('id', id).select().single());
}

export async function deleteEquipment(id) {
  unwrap(await client().from(TABLE).delete().eq('id', id));
}

// 다른 사용자/탭의 변경 사항을 실시간 수신. 구독 해제 함수 반환.
export function subscribeEquipment(onChange) {
  if (!isSupabaseConfigured) return () => {};
  const channel = supabase
    .channel('equipment-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: TABLE }, onChange)
    .subscribe();
  return () => supabase.removeChannel(channel);
}
