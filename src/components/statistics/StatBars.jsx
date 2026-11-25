// 가로 막대 통계 (라이브러리 없이 CSS로 표시)
export const BAR_COLORS = {
  normal: 'bg-emerald-500', warning: 'bg-amber-500', breakdown: 'bg-red-500', defect: 'bg-red-500', inspecting: 'bg-sky-500',
  received: 'bg-red-500', repairing: 'bg-amber-500', completed: 'bg-emerald-500', planned: 'bg-slate-400', in_progress: 'bg-sky-500',
};

export default function StatBars({ rows, total, unit = '건', empty = '데이터가 없습니다.' }) {
  const max = total ?? Math.max(...rows.map((r) => r.value), 0);
  if (!max) return <p className="py-6 text-center text-sm text-slate-500">{empty}</p>;
  return (
    <ul className="space-y-3">
      {rows.map((r) => {
        const pct = max ? Math.round((r.value / max) * 100) : 0;
        return (
          <li key={r.label}>
            <div className="flex items-baseline justify-between text-sm">
              <span className="truncate text-slate-700">{r.label}</span>
              <span className="ml-2 shrink-0 font-semibold text-slate-900">
                {r.value}<span className="text-xs font-normal text-slate-400">{unit}{total ? ` · ${pct}%` : ''}</span>
              </span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-slate-100">
              <div className={`h-2 rounded-full ${r.color ?? 'bg-navy-600'}`} style={{ width: `${pct}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
