// 공통 카드 패널 (헤더 + 본문)
export default function Panel({ title, count, actions, children, className = '' }) {
  return (
    <section className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3 sm:px-5">
        <h2 className="font-semibold text-navy-900">
          {title}
          {count != null && <span className="ml-1 text-sm font-normal text-slate-500">({count})</span>}
        </h2>
        {actions}
      </div>
      {children}
    </section>
  );
}

export const inputClass = 'mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600';
export const filterClass = 'w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm sm:w-auto';
export const primaryButton = 'rounded-md bg-navy-700 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-60';
