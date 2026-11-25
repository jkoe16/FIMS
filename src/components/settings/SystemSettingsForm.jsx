import { useEffect, useState } from 'react';
import Panel, { inputClass, primaryButton } from '../common/Panel';

export default function SystemSettingsForm({ settings, onSubmit, saving }) {
  const [form, setForm] = useState({ factory_name: '', default_inspection_cycle: 30 });
  useEffect(() => {
    if (settings) setForm({ factory_name: settings.factory_name ?? '', default_inspection_cycle: settings.default_inspection_cycle ?? 30 });
  }, [settings]);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    onSubmit({ factory_name: form.factory_name.trim(), default_inspection_cycle: Number(form.default_inspection_cycle) });
  };

  return (
    <form onSubmit={submit}>
      <Panel title="시스템 설정">
        <div className="space-y-4 p-4 sm:p-5">
          <label className="block text-sm font-medium text-slate-700">
            공장명
            <input name="factory_name" value={form.factory_name} onChange={change} disabled={!settings} placeholder="예) 제1공장" className={inputClass} />
            <span className="mt-1 block text-xs font-normal text-slate-500">사이드바 상단에 표시됩니다.</span>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            기본 점검 주기(일)
            <input name="default_inspection_cycle" type="number" min={1} required value={form.default_inspection_cycle} onChange={change} disabled={!settings} className={inputClass} />
            <span className="mt-1 block text-xs font-normal text-slate-500">설비에 점검 주기가 없을 때 통계 분석의 점검 예정일 계산에 사용합니다.</span>
          </label>
        </div>
        <div className="flex justify-end border-t border-slate-200 px-4 py-3 sm:px-5">
          <button type="submit" disabled={saving || !settings} className={primaryButton}>{saving ? '저장 중...' : '설정 저장'}</button>
        </div>
      </Panel>
    </form>
  );
}
