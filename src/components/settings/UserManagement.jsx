import { useState } from 'react';
import { Plus } from 'lucide-react';
import Panel, { inputClass } from '../common/Panel';
import { USER_ROLES } from '../../services/settingsService';

const EMPTY = { name: '', department: '', role: 'inspector' };
const cellSelect = 'rounded-md border border-slate-300 px-2 py-1 text-sm disabled:opacity-60';

// 담당자 명부 관리 (로그인 계정 아님). 삭제 대신 비활성화.
export default function UserManagement({ users, loading, onCreate, onUpdate, busyId }) {
  const [form, setForm] = useState(EMPTY);
  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const ok = await onCreate({ name: form.name.trim(), department: form.department.trim() || null, role: form.role });
    if (ok) setForm(EMPTY);
  };

  return (
    <Panel title="사용자 관리" count={users.length}>
      <form onSubmit={submit} className="grid gap-3 border-b border-slate-200 p-4 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end sm:p-5">
        <label className="text-sm font-medium text-slate-700">이름<span className="text-red-500"> *</span>
          <input name="name" required value={form.name} onChange={change} className={inputClass} />
        </label>
        <label className="text-sm font-medium text-slate-700">부서
          <input name="department" value={form.department} onChange={change} className={inputClass} />
        </label>
        <label className="text-sm font-medium text-slate-700">역할
          <select name="role" value={form.role} onChange={change} className={inputClass}>
            {Object.entries(USER_ROLES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <button type="submit" disabled={busyId === 'new'} className="flex items-center justify-center gap-1 rounded-md bg-navy-700 px-3 py-2 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-60">
          <Plus className="h-4 w-4" /> 추가
        </button>
      </form>

      {loading ? (
        <p className="px-5 py-10 text-center text-sm text-slate-500">불러오는 중...</p>
      ) : !users.length ? (
        <p className="px-5 py-10 text-center text-sm text-slate-500">등록된 사용자가 없습니다.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {users.map((u) => (
            <li key={u.id} className={`flex flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-5 ${u.is_active ? '' : 'bg-slate-50'}`}>
              <div className="min-w-0">
                <p className={`font-medium ${u.is_active ? 'text-slate-800' : 'text-slate-400 line-through'}`}>{u.name}</p>
                <p className="text-xs text-slate-500">{u.department || '부서 미지정'}</p>
              </div>
              <div className="flex items-center gap-2">
                <select value={u.role} disabled={busyId === u.id} onChange={(e) => onUpdate(u.id, { role: e.target.value })} aria-label="역할 변경" className={cellSelect}>
                  {Object.entries(USER_ROLES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <button type="button" disabled={busyId === u.id} onClick={() => onUpdate(u.id, { is_active: !u.is_active })}
                  className={`rounded-md border px-3 py-1 text-xs font-semibold disabled:opacity-60 ${
                    u.is_active ? 'border-slate-300 text-slate-600 hover:bg-slate-50' : 'border-emerald-600 text-emerald-700 hover:bg-emerald-50'
                  }`}>
                  {u.is_active ? '비활성화' : '활성화'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
