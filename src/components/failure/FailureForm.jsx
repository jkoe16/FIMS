import { useState } from 'react';

const inputClass = 'mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600';

const today = () => new Date().toLocaleDateString('sv-SE'); // YYYY-MM-DD (로컬 날짜)

const initialState = () => ({ equipment_id: '', description: '', occurred_at: today(), reporter: '' });

export default function FailureForm({ equipment, onSubmit, saving }) {
  const [form, setForm] = useState(initialState);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const ok = await onSubmit({
      equipment_id: form.equipment_id,
      description: form.description.trim(),
      occurred_at: form.occurred_at,
      reporter: form.reporter.trim(),
    });
    if (ok) setForm((f) => ({ ...initialState(), reporter: f.reporter })); // 신고자는 연속 입력 편의상 유지
  };

  return (
    <form onSubmit={submit} className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-4 py-3 sm:px-5">
        <h2 className="font-semibold text-navy-900">고장 신고</h2>
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <label className="block text-sm font-medium text-slate-700">
          고장 설비<span className="text-red-500"> *</span>
          <select name="equipment_id" required value={form.equipment_id} onChange={change} className={inputClass}>
            <option value="">설비를 선택하세요</option>
            {equipment.map((eq) => (
              <option key={eq.id} value={eq.id}>{eq.equipment_code} · {eq.equipment_name}</option>
            ))}
          </select>
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            신고자<span className="text-red-500"> *</span>
            <input name="reporter" required value={form.reporter} onChange={change} className={inputClass} />
          </label>
          <label className="text-sm font-medium text-slate-700">
            발생일<span className="text-red-500"> *</span>
            <input name="occurred_at" type="date" required value={form.occurred_at} onChange={change} className={inputClass} />
          </label>
        </div>
        <label className="block text-sm font-medium text-slate-700">
          고장 내용<span className="text-red-500"> *</span>
          <textarea name="description" rows={4} required value={form.description} onChange={change} className={inputClass} />
        </label>
      </div>
      <div className="flex justify-end border-t border-slate-200 px-4 py-3 sm:px-5">
        <button type="submit" disabled={saving} className="rounded-md bg-navy-700 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-60">
          {saving ? '저장 중...' : '고장 신고'}
        </button>
      </div>
    </form>
  );
}
