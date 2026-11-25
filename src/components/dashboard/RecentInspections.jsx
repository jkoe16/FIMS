import StatusBadge from '../common/StatusBadge';

export default function RecentInspections({ items = [] }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-4 py-3 sm:px-5">
        <h2 className="font-semibold text-navy-900">최근 점검 내역</h2>
      </div>
      {!items.length && <p className="px-5 py-10 text-center text-sm text-slate-500">점검 내역이 없습니다.</p>}

      {/* 태블릿/PC: 테이블 */}
      <div className={`hidden overflow-x-auto ${items.length ? 'md:block' : ''}`}>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3 font-semibold">설비명</th>
              <th className="px-5 py-3 font-semibold">점검자</th>
              <th className="px-5 py-3 font-semibold">점검 일시</th>
              <th className="px-5 py-3 font-semibold">결과</th>
              <th className="px-5 py-3 font-semibold">비고</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50">
                <td className="px-5 py-3 font-medium text-slate-800">{row.equipment_name}</td>
                <td className="px-5 py-3 text-slate-600">{row.inspector}</td>
                <td className="whitespace-nowrap px-5 py-3 text-slate-600">{row.inspected_at}</td>
                <td className="px-5 py-3"><StatusBadge status={row.result} /></td>
                <td className="px-5 py-3 text-slate-600">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 모바일: 카드 리스트 */}
      <ul className="divide-y divide-slate-100 md:hidden">
        {items.map((row) => (
          <li key={row.id} className="px-4 py-3">
            <div className="flex items-center justify-between">
              <p className="font-medium text-slate-800">{row.equipment_name}</p>
              <StatusBadge status={row.result} />
            </div>
            <p className="mt-1 text-xs text-slate-500">{row.inspector} · {row.inspected_at}</p>
            <p className="mt-1 text-sm text-slate-600">{row.note}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
