import {
  LayoutDashboard, Factory, ClipboardCheck, AlertTriangle,
  Wrench, History, BarChart3, Settings,
} from 'lucide-react';

export const MENU_ITEMS = [
  { id: 'dashboard', label: '대시보드', icon: LayoutDashboard },
  { id: 'equipment', label: '설비 관리', icon: Factory },
  { id: 'inspection', label: '설비 점검', icon: ClipboardCheck },
  { id: 'failure', label: '고장 관리', icon: AlertTriangle },
  { id: 'maintenance', label: '정비 관리', icon: Wrench },
  { id: 'history', label: '점검 이력', icon: History },
  { id: 'statistics', label: '통계 분석', icon: BarChart3 },
  { id: 'settings', label: '설정', icon: Settings },
];
