import { db, unwrap, subscribeTables } from '../lib/db';

const DAY = 86400000;
const toDate = (s) => new Date(`${s}T00:00:00`);
const fmt = (d) => d.toLocaleDateString('sv-SE');

// 테이블별로 따로 조회해 일부 테이블이 없어도 나머지 통계는 표시
async function safe(promise) {
  try { return { data: unwrap(await promise) }; } catch (e) { return { error: e.message }; }
}

export async function getStatistics() {
  const [equipment, inspections, failures, maintenances, settings] = await Promise.all([
    safe(db().from('equipment').select('id, equipment_name, equipment_code, status, inspection_cycle')),
    safe(db().from('inspections').select('equipment_id, inspected_at, overall_result')),
    safe(db().from('failures').select('equipment_id, status, occurred_at')),
    safe(db().from('maintenances').select('status')),
    safe(db().from('system_settings').select('default_inspection_cycle').eq('id', 1).maybeSingle()),
  ]);

  const eq = equipment.data ?? [];
  const countBy = (rows, key) => rows.reduce((acc, r) => ({ ...acc, [r[key]]: (acc[r[key]] ?? 0) + 1 }), {});
  const today = toDate(fmt(new Date()));
  const since30 = fmt(new Date(today - 29 * DAY));

  // 점검 예정·초과: 마지막 점검일 + 점검 주기(설비별, 없으면 기본 설정값)
  let schedule = null;
  if (inspections.data) {
    const defaultCycle = settings.data?.default_inspection_cycle ?? 30;
    const last = {};
    inspections.data.forEach((i) => { if (!last[i.equipment_id] || i.inspected_at > last[i.equipment_id]) last[i.equipment_id] = i.inspected_at; });
    schedule = eq.map((e) => {
      const cycle = e.inspection_cycle ?? defaultCycle;
      const lastDate = last[e.id];
      const due = lastDate ? new Date(toDate(lastDate).getTime() + cycle * DAY) : null;
      const daysLeft = due ? Math.round((due - today) / DAY) : null;
      return { ...e, cycle, lastDate, dueDate: due ? fmt(due) : null, daysLeft };
    }).sort((a, b) => (a.daysLeft ?? -Infinity) - (b.daysLeft ?? -Infinity));
  }

  const byEquipment = failures.data
    ? Object.entries(countBy(failures.data, 'equipment_id'))
      .map(([id, value]) => ({ label: eq.find((e) => e.id === id)?.equipment_name ?? '(삭제된 설비)', value }))
      .sort((a, b) => b.value - a.value).slice(0, 5)
    : null;

  return {
    errors: Object.entries({ 설비: equipment, 점검: inspections, 고장: failures, 정비: maintenances })
      .filter(([, r]) => r.error).map(([k, r]) => `${k}: ${r.error}`),
    equipmentStatus: equipment.data ? countBy(eq, 'status') : null,
    equipmentTotal: eq.length,
    failureStatus: failures.data ? countBy(failures.data, 'status') : null,
    failureTotal: failures.data?.length ?? 0,
    failureByEquipment: byEquipment,
    inspectionResult: inspections.data ? countBy(inspections.data, 'overall_result') : null,
    inspectionTotal: inspections.data?.length ?? 0,
    inspections30: inspections.data?.filter((i) => i.inspected_at >= since30).length ?? 0,
    schedule,
    defaultCycle: settings.data?.default_inspection_cycle ?? null,
    maintenanceStatus: maintenances.data ? countBy(maintenances.data, 'status') : null,
    maintenanceTotal: maintenances.data?.length ?? 0,
  };
}

export function subscribeStatistics(onChange) {
  return subscribeTables('statistics', ['equipment', 'inspections', 'failures', 'maintenances'], onChange);
}
