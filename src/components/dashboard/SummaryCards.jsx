import { Factory, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

const CARDS = [
  { key: 'total', label: '전체 설비', icon: Factory, color: 'text-navy-700 bg-navy-50', bar: 'bg-navy-700' },
  { key: 'normal', label: '정상', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50', bar: 'bg-emerald-500' },
  { key: 'warning', label: '주의', icon: AlertTriangle, color: 'text-amber-600 bg-amber-50', bar: 'bg-amber-500' },
  { key: 'fault', label: '고장', icon: XCircle, color: 'text-red-600 bg-red-50', bar: 'bg-red-500' },
];

export default function SummaryCards({ summary }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {CARDS.map(({ key, label, icon: Icon, color, bar }) => (
        <div key={key} className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <span className={`absolute inset-x-0 top-0 h-1 ${bar}`} />
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <span className={`rounded-md p-2 ${color}`}>
              <Icon className="h-5 w-5" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            {summary?.[key] ?? '-'}
            <span className="ml-1 text-sm font-medium text-slate-400">대</span>
          </p>
        </div>
      ))}
    </div>
  );
}
