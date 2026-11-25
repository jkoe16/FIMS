import { useState } from 'react';
import { X } from 'lucide-react';
import { STATUS_MAP, EQUIPMENT_STATUSES } from '../common/StatusBadge';

export const EMPTY_EQUIPMENT = {
  equipment_name: '', equipment_code: '', category: '', location: '', manufacturer: '',
  model: '', installation_date: '', inspection_cycle: 30, manager: '', status: 'normal',
};

const FIELDS = [
  { name: 'equipment_name', label: '설비명', required: true },
  { name: 'equipment_code', label: '설비 코드', required: true },
  { name: 'category', label: '분류' },
  { name: 'location', label: '위치' },
  { name: 'manufacturer', label: '제조사' },
  { name: 'model', label: '모델' },
  { name: 'installation_date', label: '설치일', type: 'date' },
  { name: 'inspection_cycle', label: '점검 주기(일)', type: 'number' },
  { name: 'manager', label: '담당자' },
];

const inputClass = 'mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600';

export default function EquipmentForm({ initial, onSubmit, onClose, saving }) {
  const [form, setForm] = useState(() => ({ ...EMPTY_EQUIPMENT, ...initial }));
  const isEdit = Boolean(initial?.id);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    // id/created_at은 DB가 관리하므로 전송 제외, 빈 값은 null로 변환
    const { id, created_at, ...rest } = form;
    const payload = Object.fromEntries(Object.entries(rest).map(([k, v]) => [k, v === '' ? null : v]));
    payload.inspection_cycle = payload.inspection_cycle == null ? null : Number(payload.inspection_cycle);
    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form onSubmit={submit} className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h3 className="font-semibold text-navy-900">{isEdit ? '설비 수정' : '설비 등록'}</h3>
          <button type="button" onClick={onClose} className="rounded p-1 hover:bg-slate-100" aria-label="닫기"><X className="h-5 w-5" /></button>
        </div>
        <div className="grid gap-4 overflow-y-auto p-5 sm:grid-cols-2">
          {FIELDS.map(({ name, label, type = 'text', required }) => (
            <label key={name} className="text-sm font-medium text-slate-700">
              {label}{required && <span className="text-red-500"> *</span>}
              <input name={name} type={type} min={type === 'number' ? 1 : undefined} required={required}
                value={form[name] ?? ''} onChange={change} className={inputClass} />
            </label>
          ))}
          <label className="text-sm font-medium text-slate-700">
            상태
            <select name="status" value={form.status} onChange={change} className={inputClass}>
              {EQUIPMENT_STATUSES.map((s) => <option key={s} value={s}>{STATUS_MAP[s].label}</option>)}
            </select>
          </label>
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-3">
          <button type="button" onClick={onClose} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">취소</button>
          <button type="submit" disabled={saving} className="rounded-md bg-navy-700 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-60">
            {saving ? '저장 중...' : '저장'}
          </button>
        </div>
      </form>
    </div>
  );
}
