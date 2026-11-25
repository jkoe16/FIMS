-- FIMS: 고장 관리 테이블 (schema.sql 실행 후, Supabase SQL Editor 에서 실행)

create table if not exists public.failures (
  id           uuid primary key default gen_random_uuid(),
  equipment_id uuid not null references public.equipment(id) on delete cascade,
  description  text not null,
  occurred_at  date not null default current_date,
  reporter     text not null,
  status       text not null default 'received'
               check (status in ('received', 'repairing', 'completed')), -- 접수 / 수리 중 / 완료
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists failures_equipment_id_idx on public.failures (equipment_id);
create index if not exists failures_status_idx on public.failures (status);

-- 처리 상태 변경 시 updated_at 자동 갱신
create or replace function public.set_failures_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists failures_set_updated_at on public.failures;
create trigger failures_set_updated_at before update on public.failures
for each row execute function public.set_failures_updated_at();

-- ── RLS ──────────────────────────────────────────────
alter table public.failures enable row level security;

grant select, insert, update on public.failures to anon, authenticated;

-- 로그인 기능 구현 전 단계: anon 키로 접근 허용 (조회 / 신고 / 상태 변경만, 삭제 불가).
-- 로그인 구현 후에는 대상(to)을 authenticated 로만 변경하세요.
drop policy if exists "failures_select" on public.failures;
drop policy if exists "failures_insert" on public.failures;
drop policy if exists "failures_update" on public.failures;

create policy "failures_select" on public.failures for select to anon, authenticated using (true);
create policy "failures_insert" on public.failures for insert to anon, authenticated with check (true);
create policy "failures_update" on public.failures for update to anon, authenticated using (true) with check (true);

-- ── Realtime (목록·대시보드 자동 갱신) ─────────────────
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'failures'
  ) then
    alter publication supabase_realtime add table public.failures;
  end if;
end $$;
