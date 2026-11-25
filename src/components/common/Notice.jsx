import { AlertCircle, CheckCircle2 } from 'lucide-react';

// 페이지 상단 오류/완료 메시지
export default function Notice({ type = 'error', children }) {
  if (!children) return null;
  const error = type === 'error';
  const Icon = error ? AlertCircle : CheckCircle2;
  return (
    <div className={`flex items-start gap-2 rounded-md border p-3 text-sm ${
      error ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'
    }`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" /> <div>{children}</div>
    </div>
  );
}
