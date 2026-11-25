import { useEffect, useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import EquipmentPage from './pages/EquipmentPage';
import InspectionPage from './pages/InspectionPage';
import FailurePage from './pages/FailurePage';
import MaintenancePage from './pages/MaintenancePage';
import HistoryPage from './pages/HistoryPage';
import StatisticsPage from './pages/StatisticsPage';
import SettingsPage, { SETTINGS_UPDATED_EVENT } from './pages/SettingsPage';
import PlaceholderPage from './pages/PlaceholderPage';
import { MENU_ITEMS } from './config/menu';
import { getCurrentUser } from './services/dashboardService';
import { getSettings } from './services/settingsService';

// 페이지 매핑: 각 메뉴 화면 구현 시 여기에 컴포넌트 등록
const PAGES = {
  dashboard: Dashboard,
  equipment: EquipmentPage,
  inspection: InspectionPage,
  failure: FailurePage,
  maintenance: MaintenancePage,
  history: HistoryPage,
  statistics: StatisticsPage,
  settings: SettingsPage,
};

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [factoryName, setFactoryName] = useState('');

  useEffect(() => {
    getCurrentUser().then(setUser);
    // 사이드바 공장명 (설정 테이블이 없으면 기본 문구 유지)
    const loadFactory = () => getSettings().then((s) => setFactoryName(s?.factory_name ?? '')).catch(() => {});
    loadFactory();
    window.addEventListener(SETTINGS_UPDATED_EVENT, loadFactory);
    return () => window.removeEventListener(SETTINGS_UPDATED_EVENT, loadFactory);
  }, []);

  const current = MENU_ITEMS.find((m) => m.id === activePage);
  const Page = PAGES[activePage];

  const handleNavigate = (id) => {
    setActivePage(id);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar factoryName={factoryName} activePage={activePage} onNavigate={handleNavigate} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title={current?.label} user={user} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {Page ? <Page /> : <PlaceholderPage title={current?.label} />}
        </main>
      </div>
    </div>
  );
}
