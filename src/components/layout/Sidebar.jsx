import { X, ShieldCheck } from 'lucide-react';
import { MENU_ITEMS } from '../../config/menu';

export default function Sidebar({ factoryName, activePage, onNavigate, open, onClose }) {
  return (
    <>
      {/* 모바일/태블릿 오버레이 */}
      <div
        className={`fixed inset-0 z-30 bg-black/40 lg:hidden ${open ? 'block' : 'hidden'}`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-navy-900 text-white transition-transform lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-7 w-7 text-sky-400" />
            <div>
              <p className="text-lg font-bold leading-tight tracking-wide">FIMS</p>
              <p className="text-[11px] text-navy-100/70">{factoryName || '공장 통합 장비 점검'}</p>
            </div>
          </div>
          <button className="rounded p-1 hover:bg-white/10 lg:hidden" onClick={onClose} aria-label="메뉴 닫기">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {MENU_ITEMS.map(({ id, label, icon: Icon }) => {
            const active = activePage === id;
            return (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  active ? 'bg-navy-600 text-white shadow-inner' : 'text-navy-100/80 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {label}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-4 text-xs text-navy-100/50">v0.1.0</div>
      </aside>
    </>
  );
}
