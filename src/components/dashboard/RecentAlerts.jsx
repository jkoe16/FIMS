import { AlertTriangle, XCircle } from 'lucide-react';

const LEVEL_STYLE = {
  fault: { icon: XCircle, className: 'text-red-600 bg-red-50 border-red-200' },
  warning: { icon: AlertTriangle, className: 'text-amber-600 bg-amber-50 border-amber-200' },
};

export default function RecentAlerts({ items = [] }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-5">
        <h2 className="font-semibold text-navy-900">최근 이상 알림</h2>
        <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">{items.length}</span>
      </div>
      {!items.length && <p className="px-5 py-10 text-center text-sm text-slate-500">이상 알림이 없습니다.</p>}
      <ul className="space-y-3 p-4 sm:p-5 empty:hidden">
        {items.map((a) => {
          const { icon: Icon, className } = LEVEL_STYLE[a.level] ?? LEVEL_STYLE.warning;
          return (
            <li key={a.id} className={`flex gap-3 rounded-md border p-3 ${className}`}>
              <Icon className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800">{a.equipment_name}</p>
                <p className="text-sm text-slate-600">{a.message}</p>
                <p className="mt-1 text-xs text-slate-400">{a.occurred_at}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
