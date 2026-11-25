import { db, unwrap, subscribeTables } from '../lib/db';

const TABLE = 'maintenances';

export const MAINTENANCE_STATUSES = ['planned', 'in_progress', 'completed']; // 예정 / 진행 중 / 완료
export const MAINTENANCE_TYPES = { preventive: '예방 정비', corrective: '사후 정비' };

export async function listMaintenances({ status, limit = 100 } = {}) {
  let query = db()
    .from(TABLE)
    .select('*, equipment(equipment_name, equipment_code), failures(description)')
    .order('planned_date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);
  if (status) query = query.eq('status', status);
  return unwrap(await query);
}

export async function createMaintenance(values) {
  return unwrap(await db().from(TABLE).insert(values).select().single());
}

// 완료 처리 시 완료일을 자동 기록 (이미 있으면 유지)
export async function updateMaintenanceStatus(row, status) {
  const values = { status };
  if (status === 'completed' && !row.completed_date) values.completed_date = new Date().toLocaleDateString('sv-SE');
  if (status !== 'completed') values.completed_date = null;
  return unwrap(await db().from(TABLE).update(values).eq('id', row.id).select().single());
}

export function subscribeMaintenances(onChange) {
  return subscribeTables('maintenances', [TABLE], onChange);
}
