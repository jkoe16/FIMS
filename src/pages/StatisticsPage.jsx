import { useCallback, useEffect, useState } from 'react';
import Notice from '../components/common/Notice';
import Panel from '../components/common/Panel';
import { STATUS_MAP, EQUIPMENT_STATUSES } from '../components/common/StatusBadge';
import StatBars, { BAR_COLORS } from '../components/statistics/StatBars';
import { INSPECTION_RESULTS } from '../config/inspection';
import { FAILURE_STATUSES } from '../services/failureService';
import { MAINTENANCE_STATUSES } from '../services/maintenanceService';
import { getStatistics, subscribeStatistics } from '../services/statisticsService';

const toRows = (counts, keys) => keys.map((k) => ({ label: STATUS_MAP[k].label, value: counts?.[k] ?? 0, color: BAR_COLORS[k] }));
const Unavailable = () => <p className="py-6 text-center text-sm text-slate-500">데이터를 불러올 수 없습니다.</p>;

function Kpi({ label, value, unit = '건' }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value ?? '-'}<span className="ml-1 text-sm font-medium text-slate-400">{unit}</span></p>
    </div>
  );
}

export default function StatisticsPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setStats(await getStatistics());
      setError('');
    } catch (e) {
      setError(`통계를 불러오지 못했습니다: ${e.message}`);
    }
  }, []);

  useEffect(() => {
    load();
    return subscribeStatistics(load);
  }, [load]);

  if (!stats) return error ? <Notice>{error}</Notice> : <p className="py-12 text-center text-sm text-slate-500">불러오는 중...</p>;

  const openFailures = (stats.failureStatus?.received ?? 0) + (stats.failureStatus?.repairing ?? 0);
  const overdue = stats.schedule?.filter((s) => s.daysLeft == null || s.daysLeft < 0).length;

  return (
    <div className="space-y-4 sm:space-y-6">
      <Notice>{error}</Notice>
      {stats.errors.length > 0 && <Notice>일부 통계를 불러오지 못했습니다. {stats.errors.join(' / ')}</Notice>}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Kpi label="전체 설비" value={stats.equipmentTotal} unit="대" />
        <Kpi label="최근 30일 점검" value={stats.inspectionTotal != null ? stats.inspections30 : null} />
        <Kpi label="미완료 고장" value={stats.failureStatus ? openFailures : null} />
        <Kpi label="점검 필요 설비" value={overdue} unit="대" />
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        <Panel title="설비 상태 분포" count={stats.equipmentTotal}>
          <div className="p-4 sm:p-5">
            {stats.equipmentStatus ? <StatBars rows={toRows(stats.equipmentStatus, EQUIPMENT_STATUSES)} total={stats.equipmentTotal} unit="대" /> : <Unavailable />}
          </div>
        </Panel>
        <Panel title="점검 결과 분포" count={stats.inspectionTotal}>
          <div className="p-4 sm:p-5">
            {stats.inspectionResult ? <StatBars rows={toRows(stats.inspectionResult, INSPECTION_RESULTS)} total={stats.inspectionTotal} empty="점검 기록이 없습니다." /> : <Unavailable />}
          </div>
        </Panel>
        <Panel title="고장 처리 상태" count={stats.failureTotal}>
          <div className="p-4 sm:p-5">
            {stats.failureStatus ? <StatBars rows={toRows(stats.failureStatus, FAILURE_STATUSES)} total={stats.failureTotal} empty="고장 기록이 없습니다." /> : <Unavailable />}
          </div>
        </Panel>
        <Panel title="설비별 고장 건수 (상위 5)">
          <div className="p-4 sm:p-5">
            {stats.failureByEquipment ? <StatBars rows={stats.failureByEquipment.map((r) => ({ ...r, color: 'bg-red-500' }))} empty="고장 기록이 없습니다." /> : <Unavailable />}
          </div>
        </Panel>
        <Panel title="정비 진행 상태" count={stats.maintenanceTotal}>
          <div className="p-4 sm:p-5">
            {stats.maintenanceStatus ? <StatBars rows={toRows(stats.maintenanceStatus, MAINTENANCE_STATUSES)} total={stats.maintenanceTotal} empty="정비 기록이 없습니다." /> : <Unavailable />}
          </div>
        </Panel>
        <Panel title="점검 예정 현황" count={stats.schedule?.length}>
          {stats.schedule ? (
            <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
              {stats.schedule.map((s) => {
                const late = s.daysLeft == null || s.daysLeft < 0;
                const soon = !late && s.daysLeft <= 7;
                return (
                  <li key={s.id} className="flex items-center justify-between gap-2 px-4 py-2.5 sm:px-5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">{s.equipment_name}</p>
                      <p className="text-xs text-slate-500">
                        주기 {s.cycle}일 · {s.lastDate ? `최근 ${s.lastDate} · 예정 ${s.dueDate}` : '점검 기록 없음'}
                      </p>
                    </div>
                    <span className={`shrink-0 whitespace-nowrap rounded px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                      late ? 'bg-red-50 text-red-700 ring-red-600/20' : soon ? 'bg-amber-50 text-amber-700 ring-amber-600/20' : 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                    }`}>
                      {s.daysLeft == null ? '미점검' : s.daysLeft < 0 ? `${-s.daysLeft}일 초과` : s.daysLeft === 0 ? '오늘' : `D-${s.daysLeft}`}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : <div className="p-4 sm:p-5"><Unavailable /></div>}
        </Panel>
      </div>
    </div>
  );
}
