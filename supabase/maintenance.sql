-- FIMS: 정비 관리 테이블 (schema.sql, failures.sql 실행 후, Supabase SQL Editor 에서 실행)

create table if not exists public.maintenances (
  id             uuid primary key default gen_random_uuid(),
  equipment_id   uuid not null references public.equipment(id) on delete cascade,
  failure_id     uuid references public.failures(id) on delete set null,  -- 관련 고장 (선택)
  maintenance_type text not null default 'corrective'
                 check (maintenance_type in ('preventive', 'corrective')),   -- 예방 정비 / 사후 정비
  description    text not null,
  manager        text not null,                                            -- 정비 담당자
  planned_date   date not null default current_date,
  completed_date date,
  status         text not null default 'planned'
                 check (status in ('planned', 'in_progress', 'completed')),  -- 예정 / 진행 중 / 완료
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists maintenances_equipment_id_idx on public.maintenances (equipment_id);
create index if not exists maintenances_status_idx on public.maintenances (status);

-- 수정 시 updated_at 자동 갱신
create or replace function public.set_maintenances_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists maintenances_set_updated_at on public.maintenances;
create trigger maintenances_set_updated_at before update on public.maintenances
for each row execute function public.set_maintenances_updated_at();

-- ── RLS ──────────────────────────────────────────────
alter table public.maintenances enable row level security;

grant select, insert, update on public.maintenances to anon, authenticated;

-- 로그인 기능 구현 전 단계: anon 키로 조회 / 등록 / 상태 변경 허용 (삭제 불가).
-- 로그인 구현 후에는 대상(to)을 authenticated 로만 변경하세요.
drop policy if exists "maintenances_select" on public.maintenances;
drop policy if exists "maintenances_insert" on public.maintenances;
drop policy if exists "maintenances_update" on public.maintenances;

create policy "maintenances_select" on public.maintenances for select to anon, authenticated using (true);
create policy "maintenances_insert" on public.maintenances for insert to anon, authenticated with check (true);
create policy "maintenances_update" on public.maintenances for update to anon, authenticated using (true) with check (true);

-- ── Realtime ─────────────────────────────────────────
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'maintenances'
  ) then
    alter publication supabase_realtime add table public.maintenances;
  end if;
end $$;
