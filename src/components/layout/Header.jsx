import { Menu, Bell, UserCircle } from 'lucide-react';

export default function Header({ title, user, onMenuClick }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button className="rounded p-2 text-navy-800 hover:bg-slate-100 lg:hidden" onClick={onMenuClick} aria-label="메뉴 열기">
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-navy-900 sm:text-xl">{title}</h1>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <button className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100" aria-label="알림">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <div className="flex items-center gap-2">
          <UserCircle className="h-8 w-8 text-navy-700" />
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
