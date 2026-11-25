import { useCallback, useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import SummaryCards from '../components/dashboard/SummaryCards';
import RecentInspections from '../components/dashboard/RecentInspections';
import RecentAlerts from '../components/dashboard/RecentAlerts';
import FailureStatus from '../components/dashboard/FailureStatus';
import {
  getEquipmentSummary, getRecentInspections, getRecentAlerts, subscribeDashboard,
} from '../services/dashboardService';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [inspections, setInspections] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [errors, setErrors] = useState([]);

  const load = useCallback(async () => {
    const [s, i, a] = await Promise.allSettled([getEquipmentSummary(), getRecentInspections(), getRecentAlerts()]);
    const errs = [];
    if (s.status === 'fulfilled') setSummary(s.value); else errs.push(`설비 현황: ${s.reason.message}`);
    if (i.status === 'fulfilled') setInspections(i.value); else errs.push(`최근 점검: ${i.reason.message}`);
    if (a.status === 'fulfilled') setAlerts(a.value); else errs.push(`이상 알림: ${a.reason.message}`);
    setErrors(errs);
  }, []);

  useEffect(() => {
    load();
    return subscribeDashboard(load); // 설비·점검·고장 변경 시 즉시 갱신
  }, [load]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {errors.length > 0 && (
        <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-semibold">일부 데이터를 불러오지 못했습니다.</p>
            {errors.map((e) => <p key={e}>{e}</p>)}
          </div>
        </div>
      )}
      <SummaryCards summary={summary} />
      <div className="grid gap-4 sm:gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentInspections items={inspections} />
        </div>
        <div className="space-y-4 sm:space-y-6">
          <FailureStatus />
          <RecentAlerts items={alerts} />
        </div>
      </div>
    </div>
  );
}
