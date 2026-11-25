import { useCallback, useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import Notice from '../components/common/Notice';
import Panel from '../components/common/Panel';
import StatusBadge, { STATUS_MAP } from '../components/common/StatusBadge';
import { INSPECTION_RESULTS } from '../config/inspection';
import { listEquipment } from '../services/equipmentService';
import { listInspections, subscribeInspections } from '../services/inspectionService';

const LIMIT = 200;
const fieldClass = 'mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm';
const abnormal = (items = []) => items.filter((i) => i.result !== 'normal');

// 설비 점검 데이터 통합 조회 (설비 / 결과 / 기간 필터)
export default function HistoryPage() {
  const [equipment, setEquipment] = useState([]);
  const [filters, setFilters] = useState({ equipmentId: '', result: '', from: '', to: '' });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    listEquipment()
      .then((r) => setEquipment([...r].sort((a, b) => a.equipment_code.localeCompare(b.equipment_code))))
      .catch((e) => setError(`설비 목록을 불러오지 못했습니다: ${e.message}`));
  }, []);

  const load = useCallback(async () => {
    try {
      const { equipmentId, result, from, to } = filters;
      setRows(await listInspections({
        equipmentId: equipmentId || undefined, result: result || undefined, from: from || undefined, to: to || undefined, limit: LIMIT,
      }));
      setError('');
    } catch (e) {
      setError(`점검 이력을 불러오지 못했습니다: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
    return subscribeInspections(load);
  }, [load]);

  const change = (e) => setFilters((f) => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <div className="space-y-4 sm:space-y-6">
      <Notice>{error}</Notice>
      <Panel title="조회 조건" actions={<Search className="h-4 w-4 text-slate-400" />}>
        <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-4">
          <label className="text-sm font-medium text-slate-700">설비
            <select name="equipmentId" value={filters.equipmentId} onChange={change} className={fieldClass}>
              <option value="">전체 설비</option>
              {equipment.map((eq) => <option key={eq.id} value={eq.id}>{eq.equipment_code} · {eq.equipment_name}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">종합 결과
            <select name="result" value={filters.result} onChange={change} className={fieldClass}>
              <option value="">전체</option>
              {INSPECTION_RESULTS.map((r) => <option key={r} value={r}>{STATUS_MAP[r].label}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">시작일
            <input type="date" name="from" value={filters.from} onChange={change} className={fieldClass} />
          </label>
          <label className="text-sm font-medium text-slate-700">종료일
            <input type="date" name="to" value={filters.to} onChange={change} className={fieldClass} />
          </label>
        </div>
      </Panel>

      <Panel title="점검 이력" count={rows.length >= LIMIT ? `최근 ${LIMIT}건` : rows.length}>
        {loading ? (
          <p className="px-5 py-12 text-center text-sm text-slate-500">불러오는 중...</p>
        ) : !rows.length ? (
          <p className="px-5 py-12 text-center text-sm text-slate-500">조건에 맞는 점검 이력이 없습니다.</p>
        ) : (
          <>
            {/* 태블릿/PC: 테이블 */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs text-slate-500">
                  <tr>
                    {['점검일', '설비', '점검자', '종합 결과', '이상 항목', '점검 의견'].map((h) => (
                      <th key={h} className="whitespace-nowrap px-4 py-3 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((r) => (
                    <tr key={r.id} className="align-top hover:bg-slate-50">
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">{r.inspected_at}</td>
                      <td className="px-4 py-3">
                        <p className="whitespace-nowrap font-medium text-slate-800">{r.equipment?.equipment_name ?? '(삭제된 설비)'}</p>
                        <p className="font-mono text-xs text-slate-500">{r.equipment?.equipment_code}</p>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">{r.inspector}</td>
                      <td className="px-4 py-3"><StatusBadge status={r.overall_result} /></td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          {abnormal(r.items).length ? abnormal(r.items).map((i) => (
                            <span key={i.item} className="inline-flex items-center gap-1 whitespace-nowrap text-xs text-slate-600">{i.item} <StatusBadge status={i.result} /></span>
                          )) : <span className="text-xs text-slate-400">없음</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{r.opinion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* 모바일: 카드 리스트 */}
            <ul className="divide-y divide-slate-100 md:hidden">
              {rows.map((r) => (
                <li key={r.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800">{r.equipment?.equipment_name ?? '(삭제된 설비)'}</p>
                      <p className="text-xs text-slate-500">{r.inspected_at} · {r.inspector}</p>
                    </div>
                    <StatusBadge status={r.overall_result} />
                  </div>
                  {abnormal(r.items).length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {abnormal(r.items).map((i) => (
                        <span key={i.item} className="inline-flex items-center gap-1 text-xs text-slate-600">{i.item} <StatusBadge status={i.result} /></span>
                      ))}
                    </div>
                  )}
                  {r.opinion && <p className="mt-2 text-sm text-slate-600">{r.opinion}</p>}
                </li>
              ))}
            </ul>
          </>
        )}
      </Panel>
    </div>
  );
}
