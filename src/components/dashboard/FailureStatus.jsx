import { useCallback, useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { STATUS_MAP } from '../common/StatusBadge';
import { FAILURE_STATUSES, getFailureStatusCounts, subscribeFailures } from '../../services/failureService';

const COLORS = { received: 'text-red-600', repairing: 'text-amber-600', completed: 'text-emerald-600' };

// 대시보드 고장 처리 현황 (Supabase failures 테이블 연동)
export default function FailureStatus() {
  const [counts, setCounts] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setCounts(await getFailureStatusCounts());
      setError('');
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    load();
    return subscribeFailures(load, 'dashboard');
  }, [load]);

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-4 py-3 sm:px-5">
        <h2 className="font-semibold text-navy-900">고장 처리 현황</h2>
      </div>
      {error ? (
        <p className="flex items-start gap-2 p-4 text-sm text-red-700 sm:p-5">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> 고장 현황을 불러오지 못했습니다: {error}
        </p>
      ) : (
        <div className="grid grid-cols-3 divide-x divide-slate-100 py-4">
          {FAILURE_STATUSES.map((s) => (
            <div key={s} className="text-center">
              <p className="text-xs font-medium text-slate-500">{STATUS_MAP[s].label}</p>
              <p className={`mt-1 text-2xl font-bold ${COLORS[s]}`}>
                {counts?.[s] ?? '-'}<span className="ml-0.5 text-xs font-medium text-slate-400">건</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
