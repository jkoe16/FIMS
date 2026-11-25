import StatusBadge from '../common/StatusBadge';

export default function InspectionHistory({ items, loading, equipment, filterId, onFilterChange }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3 sm:px-5">
        <h2 className="font-semibold text-navy-900">점검 이력 <span className="text-sm font-normal text-slate-500">({items.length})</span></h2>
        <select
          value={filterId}
          onChange={(e) => onFilterChange(e.target.value)}
          aria-label="설비별 조회"
          className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm sm:w-auto"
        >
          <option value="">전체 설비</option>
          {equipment.map((eq) => (
            <option key={eq.id} value={eq.id}>{eq.equipment_code} · {eq.equipment_name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="px-5 py-12 text-center text-sm text-slate-500">불러오는 중...</p>
      ) : !items.length ? (
        <p className="px-5 py-12 text-center text-sm text-slate-500">점검 이력이 없습니다.</p>
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
                  <p className="mt-0.5 text-xs text-slate-500">{row.inspected_at} · {row.inspector}</p>
                </div>
                <StatusBadge status={row.overall_result} />
              </div>
              {row.items?.some((i) => i.result !== 'normal') && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {row.items.filter((i) => i.result !== 'normal').map((i) => (
                    <span key={i.item} className="inline-flex items-center gap-1 text-xs text-slate-600">
                      {i.item} <StatusBadge status={i.result} />
                    </span>
                  ))}
                </div>
              )}
              {row.opinion && <p className="mt-2 text-sm text-slate-600">{row.opinion}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
