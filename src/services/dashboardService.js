// 대시보드 데이터 접근 계층 (Supabase 연동)
import { db, unwrap, subscribeTables } from '../lib/db';
import { sampleUser } from '../data/sampleData';

export async function getEquipmentSummary() {
  const rows = unwrap(await db().from('equipment').select('status'));
  const count = (s) => rows.filter((e) => e.status === s).length;
  return {
    total: rows.length,
    normal: count('normal'),
    warning: count('warning'),
    fault: count('breakdown'), // 요약 카드 '고장' = 설비 상태 breakdown
  };
}

export async function getRecentInspections(limit = 5) {
  const rows = unwrap(
    await db()
      .from('inspections')
      .select('id, inspector, inspected_at, overall_result, opinion, equipment(equipment_name)')
      .order('inspected_at', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit)
  );
  return rows.map((r) => ({
    id: r.id,
    equipment_name: r.equipment?.equipment_name ?? '(삭제된 설비)',
    inspector: r.inspector,
    inspected_at: r.inspected_at,
    result: r.overall_result,
    note: r.opinion ?? '',
  }));
}

// 최근 이상 알림 = 미완료 고장 + 주의/불량 점검 결과
export async function getRecentAlerts(limit = 5) {
  const [failures, inspections] = await Promise.all([
    db().from('failures')
      .select('id, description, status, occurred_at, created_at, equipment(equipment_name)')
      .neq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(limit),
    db().from('inspections')
      .select('id, overall_result, opinion, inspected_at, created_at, equipment(equipment_name)')
      .neq('overall_result', 'normal')
      .order('created_at', { ascending: false })
      .limit(limit),
  ]);
  const alerts = [
    ...unwrap(failures).map((f) => ({
      id: `f-${f.id}`,
      equipment_name: f.equipment?.equipment_name ?? '(삭제된 설비)',
      message: `[고장 ${f.status === 'repairing' ? '수리 중' : '접수'}] ${f.description}`,
      level: 'fault',
      occurred_at: f.occurred_at,
      sort: f.created_at,
    })),
    ...unwrap(inspections).map((i) => ({
      id: `i-${i.id}`,
      equipment_name: i.equipment?.equipment_name ?? '(삭제된 설비)',
      message: `[점검 ${i.overall_result === 'defect' ? '불량' : '주의'}] ${i.opinion ?? '이상 항목 확인 필요'}`,
      level: i.overall_result === 'defect' ? 'fault' : 'warning',
      occurred_at: i.inspected_at,
      sort: i.created_at,
    })),
  ];
  return alerts.sort((a, b) => b.sort.localeCompare(a.sort)).slice(0, limit);
}

// 로그인 미구현: 헤더 사용자 표시는 샘플 사용자 유지
export async function getCurrentUser() {
  return sampleUser;
}

export function subscribeDashboard(onChange) {
  return subscribeTables('dashboard', ['equipment', 'inspections', 'failures'], onChange);
}
