-- FIMS: equipment 테이블 (Supabase 대시보드 > SQL Editor 에서 실행)

create table if not exists public.equipment (
  id                uuid primary key default gen_random_uuid(),
  equipment_name    text not null,
  equipment_code    text not null unique,
  category          text,
  location          text,
  manufacturer      text,
  model             text,
  installation_date date,
  inspection_cycle  integer check (inspection_cycle is null or inspection_cycle > 0), -- 일 단위
  manager           text,
  status            text not null default 'normal'
                    check (status in ('normal', 'warning', 'breakdown', 'inspecting')),
  created_at        timestamptz not null default now()
);

-- ── RLS ──────────────────────────────────────────────
alter table public.equipment enable row level security;

-- 테이블 접근 권한 (RLS 정책보다 먼저 필요)
grant select, insert, update, delete on public.equipment to anon, authenticated;

-- 로그인 기능 구현 전 단계: anon 키로 접근 허용.
-- 로그인 구현 후에는 아래 정책의 대상(to)을 authenticated 로만 변경하세요.
drop policy if exists "equipment_select" on public.equipment;
drop policy if exists "equipment_insert" on public.equipment;
drop policy if exists "equipment_update" on public.equipment;
drop policy if exists "equipment_delete" on public.equipment;

create policy "equipment_select" on public.equipment for select to anon, authenticated using (true);
create policy "equipment_insert" on public.equipment for insert to anon, authenticated with check (true);
create policy "equipment_update" on public.equipment for update to anon, authenticated using (true) with check (true);
create policy "equipment_delete" on public.equipment for delete to anon, authenticated using (true);

-- ── Realtime (화면 즉시 반영) ─────────────────────────
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'equipment'
  ) then
    alter publication supabase_realtime add table public.equipment;
  end if;
end $$;

-- ── 샘플 데이터 (src/data/sampleData.js 기반, 선택 실행) ──
insert into public.equipment (equipment_code, equipment_name, category, location, status, inspection_cycle) values
  ('EQ-001', 'CNC 선반 #1',    '가공',     'A라인',    'normal',     30),
  ('EQ-002', '프레스 #3',      '성형',     'A라인',    'warning',    30),
  ('EQ-003', '컨베이어 #2',    '이송',     'B라인',    'normal',     60),
  ('EQ-004', '용접 로봇 #1',   '용접',     'B라인',    'breakdown',  30),
  ('EQ-005', '공기 압축기 #1', '유틸리티', '유틸리티', 'normal',     90),
  ('EQ-006', '사출기 #4',      '성형',     'C라인',    'warning',    30),
  ('EQ-007', '냉각탑 #1',      '유틸리티', '유틸리티', 'inspecting', 90),
  ('EQ-008', '포장기 #2',      '포장',     'C라인',    'normal',     60)
on conflict (equipment_code) do nothing;
