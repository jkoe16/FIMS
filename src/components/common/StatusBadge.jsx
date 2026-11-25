export const STATUS_MAP = {
  normal: { label: '정상', className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
  warning: { label: '주의', className: 'bg-amber-50 text-amber-700 ring-amber-600/20' },
  breakdown: { label: '고장', className: 'bg-red-50 text-red-700 ring-red-600/20' },
  inspecting: { label: '점검 중', className: 'bg-sky-50 text-sky-700 ring-sky-600/20' },
  defect: { label: '불량', className: 'bg-red-50 text-red-700 ring-red-600/20' }, // 점검 결과
  received: { label: '접수', className: 'bg-red-50 text-red-700 ring-red-600/20' }, // 고장 처리 상태
  repairing: { label: '수리 중', className: 'bg-amber-50 text-amber-700 ring-amber-600/20' },
  completed: { label: '완료', className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
  planned: { label: '예정', className: 'bg-slate-50 text-slate-700 ring-slate-500/20' }, // 정비 상태
  in_progress: { label: '진행 중', className: 'bg-sky-50 text-sky-700 ring-sky-600/20' },
  fault: { label: '고장', className: 'bg-red-50 text-red-700 ring-red-600/20' }, // 대시보드 샘플 데이터 호환
};

export const EQUIPMENT_STATUSES = ['normal', 'warning', 'breakdown', 'inspecting'];

export default function StatusBadge({ status }) {
  const s = STATUS_MAP[status] ?? { label: status, className: 'bg-slate-50 text-slate-600 ring-slate-500/20' };
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${s.className}`}>
      {s.label}
    </span>
  );
}
