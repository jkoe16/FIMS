-- FIMS: 설비 점검 테이블 (schema.sql 실행 후, Supabase SQL Editor 에서 실행)

create table if not exists public.inspections (
  id             uuid primary key default gen_random_uuid(),
  equipment_id   uuid not null references public.equipment(id) on delete cascade,
  inspector      text not null,
  inspected_at   date not null default current_date,
  items          jsonb not null default '[]'::jsonb,  -- [{ "item": "외관 상태", "result": "normal" }, ...]
  overall_result text not null check (overall_result in ('normal', 'warning', 'defect')),
  opinion        text,
  created_at     timestamptz not null default now()
);

create index if not exists inspections_equipment_id_idx on public.inspections (equipment_id);
create index if not exists inspections_inspected_at_idx on public.inspections (inspected_at desc);

-- ── RLS ──────────────────────────────────────────────
alter table public.inspections enable row level security;

grant select, insert, update, delete on public.inspections to anon, authenticated;

-- 로그인 기능 구현 전 단계: anon 키로 접근 허용 (equipment 테이블과 동일 정책).
-- 로그인 구현 후에는 대상(to)을 authenticated 로만 변경하세요.
drop policy if exists "inspections_select" on public.inspections;
drop policy if exists "inspections_insert" on public.inspections;

create policy "inspections_select" on public.inspections for select to anon, authenticated using (true);
create policy "inspections_insert" on public.inspections for insert to anon, authenticated with check (true);

-- ── Realtime (저장 후 목록 자동 갱신) ─────────────────
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'inspections'
  ) then
    alter publication supabase_realtime add table public.inspections;
  end if;
end $$;
