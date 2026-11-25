import { Pencil, Trash2 } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

// 태블릿·소형 PC(xl 미만)에서는 숨기는 열 — 상세 내용은 수정 화면에서 확인
const LG_ONLY = ['제조사/모델', '설치일'];

function Actions({ row, onEdit, onDelete }) {
  return (
    <div className="flex gap-1">
      <button onClick={() => onEdit(row)} className="rounded p-1.5 text-navy-700 hover:bg-navy-50" aria-label="수정"><Pencil className="h-4 w-4" /></button>
      <button onClick={() => onDelete(row)} className="rounded p-1.5 text-red-600 hover:bg-red-50" aria-label="삭제"><Trash2 className="h-4 w-4" /></button>
    </div>
  );
}

export default function EquipmentTable({ items, onEdit, onDelete }) {
  if (!items.length) {
    return <p className="px-5 py-12 text-center text-sm text-slate-500">등록된 설비가 없습니다.</p>;
  }
  return (
    <>
      {/* 태블릿/PC: 테이블 */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full whitespace-nowrap text-sm">
          <thead className="bg-slate-50 text-left text-xs text-slate-500">
            <tr>
              {['설비 코드', '설비명', '분류', '위치', '제조사/모델', '설치일', '점검 주기', '담당자', '상태', ''].map((h) => (
                <th key={h} className={`px-4 py-3 font-semibold ${LG_ONLY.includes(h) ? 'hidden xl:table-cell' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-600">{row.equipment_code}</td>
                <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-800">{row.equipment_name}</td>
                <td className="px-4 py-3 text-slate-600">{row.category}</td>
                <td className="px-4 py-3 text-slate-600">{row.location}</td>
                <td className="hidden px-4 py-3 text-slate-600 xl:table-cell">{[row.manufacturer, row.model].filter(Boolean).join(' / ')}</td>
                <td className="hidden px-4 py-3 text-slate-600 xl:table-cell">{row.installation_date}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{row.inspection_cycle ? `${row.inspection_cycle}일` : ''}</td>
                <td className="px-4 py-3 text-slate-600">{row.manager}</td>
                <td className="px-4 py-3"><StatusBadge status={row.status} /></td>
                <td className="px-4 py-3"><Actions row={row} onEdit={onEdit} onDelete={onDelete} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 모바일: 카드 리스트 */}
      <ul className="divide-y divide-slate-100 md:hidden">
        {items.map((row) => (
          <li key={row.id} className="px-4 py-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium text-slate-800">{row.equipment_name}</p>
                <p className="font-mono text-xs text-slate-500">{row.equipment_code}</p>
              </div>
              <StatusBadge status={row.status} />
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {[row.category, row.location, row.manager].filter(Boolean).join(' · ')}
            </p>
            <div className="mt-2 flex justify-end"><Actions row={row} onEdit={onEdit} onDelete={onDelete} /></div>
          </li>
        ))}
      </ul>
    </>
  );
}
