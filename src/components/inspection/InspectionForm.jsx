import { useState } from 'react';
import { STATUS_MAP } from '../common/StatusBadge';
import { INSPECTION_ITEMS, INSPECTION_RESULTS, getOverallResult } from '../../config/inspection';

const inputClass = 'mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600';

const SELECTED = {
  normal: 'bg-emerald-600 text-white border-emerald-600',
  warning: 'bg-amber-500 text-white border-amber-500',
  defect: 'bg-red-600 text-white border-red-600',
};

const today = () => new Date().toLocaleDateString('sv-SE'); // YYYY-MM-DD (로컬 날짜)

const initialState = () => ({
  inspector: '',
  inspected_at: today(),
  opinion: '',
  results: Object.fromEntries(INSPECTION_ITEMS.map((i) => [i, 'normal'])),
});

export default function InspectionForm({ equipment, selectedId, onSelectEquipment, onSubmit, saving }) {
  const [form, setForm] = useState(initialState);
  const equipmentId = selectedId;

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const setResult = (item, result) => setForm((f) => ({ ...f, results: { ...f.results, [item]: result } }));

  const submit = async (e) => {
    e.preventDefault();
    const items = INSPECTION_ITEMS.map((item) => ({ item, result: form.results[item] }));
    const ok = await onSubmit({
      equipment_id: equipmentId,
      inspector: form.inspector.trim(),
      inspected_at: form.inspected_at,
      items,
      overall_result: getOverallResult(items.map((i) => i.result)),
      opinion: form.opinion.trim() || null,
    });
    if (ok) setForm((f) => ({ ...initialState(), inspector: f.inspector })); // 점검자는 연속 입력 편의상 유지
  };

  return (
    <form onSubmit={submit} className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-4 py-3 sm:px-5">
        <h2 className="font-semibold text-navy-900">점검 등록</h2>
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <label className="block text-sm font-medium text-slate-700">
          점검 설비<span className="text-red-500"> *</span>
          <select required value={equipmentId} onChange={(e) => onSelectEquipment(e.target.value)} className={inputClass}>
            <option value="">설비를 선택하세요</option>
            {equipment.map((eq) => (
              <option key={eq.id} value={eq.id}>{eq.equipment_code} · {eq.equipment_name}</option>
            ))}
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            점검자<span className="text-red-500"> *</span>
            <input name="inspector" required value={form.inspector} onChange={change} className={inputClass} />
          </label>
          <label className="text-sm font-medium text-slate-700">
            점검일<span className="text-red-500"> *</span>
            <input name="inspected_at" type="date" required value={form.inspected_at} onChange={change} className={inputClass} />
          </label>
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-slate-700">점검 항목</legend>
          <ul className="mt-2 divide-y divide-slate-100 rounded-md border border-slate-200">
            {INSPECTION_ITEMS.map((item) => (
              <li key={item} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
                <span className="text-sm text-slate-700">{item}</span>
                <div className="flex gap-1" role="radiogroup" aria-label={item}>
                  {INSPECTION_RESULTS.map((r) => {
                    const active = form.results[item] === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setResult(item, r)}
                        className={`rounded border px-3 py-1 text-xs font-semibold transition-colors ${
                          active ? SELECTED[r] : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {STATUS_MAP[r].label}
                      </button>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
        </fieldset>

        <label className="block text-sm font-medium text-slate-700">
          점검 의견
          <textarea name="opinion" rows={3} value={form.opinion} onChange={change} className={inputClass} />
        </label>
      </div>
      <div className="flex justify-end border-t border-slate-200 px-4 py-3 sm:px-5">
        <button type="submit" disabled={saving} className="rounded-md bg-navy-700 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-60">
          {saving ? '저장 중...' : '점검 결과 저장'}
        </button>
      </div>
    </form>
  );
}
