import { useState } from 'react';
import Panel, { inputClass, primaryButton } from '../common/Panel';
import { MAINTENANCE_TYPES } from '../../services/maintenanceService';

const today = () => new Date().toLocaleDateString('sv-SE');
const initialState = () => ({
  equipment_id: '', failure_id: '', maintenance_type: 'corrective', manager: '', planned_date: today(), description: '',
});

// openFailures: 미완료 고장 목록 (선택 설비 기준으로 필터해 관련 고장 연결)
export default function MaintenanceForm({ equipment, openFailures, managers, onSubmit, saving }) {
  const [form, setForm] = useState(initialState);
  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const failures = openFailures.filter((f) => f.equipment_id === form.equipment_id);

  const submit = async (e) => {
    e.preventDefault();
    const ok = await onSubmit({
      equipment_id: form.equipment_id,
      failure_id: form.failure_id || null,
      maintenance_type: form.maintenance_type,
      manager: form.manager.trim(),
      planned_date: form.planned_date,
      description: form.description.trim(),
    });
    if (ok) setForm(initialState());
  };

  return (
    <form onSubmit={submit}>
      <Panel title="정비 등록">
        <div className="space-y-4 p-4 sm:p-5">
          <label className="block text-sm font-medium text-slate-700">
            정비 설비<span className="text-red-500"> *</span>
            <select name="equipment_id" required value={form.equipment_id}
              onChange={(e) => setForm((f) => ({ ...f, equipment_id: e.target.value, failure_id: '' }))} className={inputClass}>
              <option value="">설비를 선택하세요</option>
              {equipment.map((eq) => <option key={eq.id} value={eq.id}>{eq.equipment_code} · {eq.equipment_name}</option>)}
            </select>
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              정비 유형
              <select name="maintenance_type" value={form.maintenance_type} onChange={change} className={inputClass}>
                {Object.entries(MAINTENANCE_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700">
              관련 고장
              <select name="failure_id" value={form.failure_id} onChange={change} disabled={!failures.length} className={`${inputClass} disabled:bg-slate-50`}>
                <option value="">{failures.length ? '선택 안 함' : '미완료 고장 없음'}</option>
                {failures.map((f) => <option key={f.id} value={f.id}>{f.occurred_at} · {f.description.slice(0, 30)}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700">
              담당자<span className="text-red-500"> *</span>
              <input name="manager" required list="maintenance-managers" value={form.manager} onChange={change} className={inputClass} />
              <datalist id="maintenance-managers">
                {managers.map((u) => <option key={u.id} value={u.name}>{u.department ?? ''}</option>)}
              </datalist>
            </label>
            <label className="text-sm font-medium text-slate-700">
              정비 예정일<span className="text-red-500"> *</span>
              <input name="planned_date" type="date" required value={form.planned_date} onChange={change} className={inputClass} />
            </label>
          </div>
          <label className="block text-sm font-medium text-slate-700">
            정비 내용<span className="text-red-500"> *</span>
            <textarea name="description" rows={4} required value={form.description} onChange={change} className={inputClass} />
          </label>
        </div>
        <div className="flex justify-end border-t border-slate-200 px-4 py-3 sm:px-5">
          <button type="submit" disabled={saving} className={primaryButton}>{saving ? '저장 중...' : '정비 등록'}</button>
        </div>
      </Panel>
    </form>
  );
}
