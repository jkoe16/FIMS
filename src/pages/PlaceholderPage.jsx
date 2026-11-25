import { Construction } from 'lucide-react';

export default function PlaceholderPage({ title }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white py-20 text-center">
      <Construction className="h-10 w-10 text-navy-600" />
      <p className="mt-3 text-lg font-semibold text-navy-900">{title}</p>
      <p className="mt-1 text-sm text-slate-500">준비 중인 화면입니다.</p>
    </div>
  );
}
