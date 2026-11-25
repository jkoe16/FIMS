// 샘플 데이터 — 향후 Supabase 테이블 구조와 동일한 필드명(snake_case)으로 유지
export const sampleUser = { name: '김관리', role: '설비 관리자' };

export const sampleEquipment = [
  { id: 'EQ-001', name: 'CNC 선반 #1', line: 'A라인', status: 'normal' },
  { id: 'EQ-002', name: '프레스 #3', line: 'A라인', status: 'warning' },
  { id: 'EQ-003', name: '컨베이어 #2', line: 'B라인', status: 'normal' },
  { id: 'EQ-004', name: '용접 로봇 #1', line: 'B라인', status: 'fault' },
  { id: 'EQ-005', name: '공기 압축기 #1', line: '유틸리티', status: 'normal' },
  { id: 'EQ-006', name: '사출기 #4', line: 'C라인', status: 'warning' },
  { id: 'EQ-007', name: '냉각탑 #1', line: '유틸리티', status: 'normal' },
  { id: 'EQ-008', name: '포장기 #2', line: 'C라인', status: 'normal' },
];

export const sampleInspections = [
  { id: 1, equipment_name: 'CNC 선반 #1', inspector: '이점검', inspected_at: '2026-11-25 09:20', result: 'normal', note: '이상 없음' },
  { id: 2, equipment_name: '프레스 #3', inspector: '박정비', inspected_at: '2026-11-25 08:45', result: 'warning', note: '유압 압력 저하' },
  { id: 3, equipment_name: '용접 로봇 #1', inspector: '최기사', inspected_at: '2026-11-24 17:10', result: 'fault', note: '서보 모터 과열' },
  { id: 4, equipment_name: '컨베이어 #2', inspector: '이점검', inspected_at: '2026-11-24 15:30', result: 'normal', note: '벨트 장력 양호' },
  { id: 5, equipment_name: '사출기 #4', inspector: '박정비', inspected_at: '2026-11-24 11:05', result: 'warning', note: '금형 온도 편차' },
  { id: 6, equipment_name: '공기 압축기 #1', inspector: '최기사', inspected_at: '2026-11-24 09:00', result: 'normal', note: '필터 교체 완료' },
];

export const sampleAlerts = [
  { id: 1, equipment_name: '용접 로봇 #1', message: '서보 모터 온도 85°C 초과', level: 'fault', occurred_at: '2026-11-25 09:42' },
  { id: 2, equipment_name: '프레스 #3', message: '유압 압력 기준치 이하', level: 'warning', occurred_at: '2026-11-25 08:50' },
  { id: 3, equipment_name: '사출기 #4', message: '금형 온도 편차 ±5°C', level: 'warning', occurred_at: '2026-11-24 11:10' },
  { id: 4, equipment_name: '컨베이어 #2', message: '정기 점검 예정일 도래', level: 'warning', occurred_at: '2026-11-24 08:00' },
];
