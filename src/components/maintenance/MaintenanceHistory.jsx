import Panel, { filterClass } from '../common/Panel';
import StatusBadge, { STATUS_MAP } from '../common/StatusBadge';
import { MAINTENANCE_STATUSES, MAINTENANCE_TYPES } from '../../services/maintenanceService';

export default function MaintenanceHistory({ items, loading, filterStatus, onFilterChange, onStatusChange, updatingId }) {
  return (
    <Panel
      title="정비 이력"
      count={items.length}
      actions={
        <select value={filterStatus} onChange={(e) => onFilterChange(e.target.value)} aria-label="정비 상태별 조회" className={filterClass}>
          <option value="">전체 상태</option>
          {MAINTENANCE_STATUSES.map((s) => <option key={s} value={s}>{STATUS_MAP[s].label}</option>)}
        </select>
      }
    >
      {loading ? (
        <p className="px-5 py-12 text-center text-sm text-slate-500">불러오는 중...</p>
      ) : !items.length ? (
        <p className="px-5 py-12 text-center text-sm text-slate-500">정비 이력이 없습니다.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {items.map((row) => (
            <li key={row.id} className="px-4 py-3 sm:px-5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-slate-800">
                    {row.equipment?.equipment_name ?? '(삭제된 설비)'}
                    <span className="ml-2 font-mono text-xs font-normal text-slate-500">{row.equipment?.equipment_code}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {MAINTENANCE_TYPES[row.maintenance_type]} · 담당 {row.manager} · 예정 {row.planned_date}
                    {row.completed_date && ` · 완료 ${row.completed_date}`}
                  </p>
                </div>
                <StatusBadge status={row.status} />
              </div>
              <p className="mt-2 whitespace-pre-line text-sm text-slate-600">{row.description}</p>
              {row.failures && <p className="mt-1 text-xs text-slate-500">관련 고장: {row.failures.description}</p>}
              <div className="mt-2 flex items-center justify-end gap-2">
                <span className="text-xs text-slate-500">정비 상태</span>
                <select value={row.status} disabled={updatingId === row.id} onChange={(e) => onStatusChange(row, e.target.value)}
                  aria-label="정비 상태 변경" className="rounded-md border border-slate-300 px-2 py-1 text-sm disabled:opacity-60">
                  {MAINTENANCE_STATUSES.map((s) => <option key={s} value={s}>{STATUS_MAP[s].label}</option>)}
                </select>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
