// 점검 항목 (향후 설비 분류별 항목이 필요하면 DB 테이블로 이전)
export const INSPECTION_ITEMS = ['외관 상태', '소음·진동', '온도', '누유·누설', '안전장치', '청결 상태'];

export const INSPECTION_RESULTS = ['normal', 'warning', 'defect']; // 정상 / 주의 / 불량

// 항목 결과 중 가장 나쁜 결과를 종합 결과로 사용
export function getOverallResult(results) {
  if (results.includes('defect')) return 'defect';
  if (results.includes('warning')) return 'warning';
  return 'normal';
}
