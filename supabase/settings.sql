-- FIMS: 시스템 설정 / 사용자 관리 테이블 (Supabase SQL Editor 에서 실행)

-- ── 시스템 설정 (단일 행) ─────────────────────────────
create table if not exists public.system_settings (
  id                       integer primary key default 1 check (id = 1),
  factory_name             text not null default '',
  default_inspection_cycle integer not null default 30 check (default_inspection_cycle > 0), -- 일 단위, 설비별 주기 미입력 시 사용
  updated_at               timestamptz not null default now()
);

-- 설정 행 1개 생성 (기본값)
insert into public.system_settings (id) values (1) on conflict (id) do nothing;

-- ── 사용자 (로그인 계정이 아닌 담당자 명부) ───────────
-- 개인정보 노출 방지를 위해 이메일·연락처는 저장하지 않음
create table if not exists public.app_users (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  department text,
  role       text not null default 'inspector'
             check (role in ('admin', 'maintainer', 'inspector')), -- 관리자 / 정비 담당 / 점검자
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

-- 수정 시 updated_at 자동 갱신 (system_settings)
create or replace function public.set_system_settings_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists system_settings_set_updated_at on public.system_settings;
create trigger system_settings_set_updated_at before update on public.system_settings
for each row execute function public.set_system_settings_updated_at();

-- ── RLS ──────────────────────────────────────────────
alter table public.system_settings enable row level security;
alter table public.app_users enable row level security;

grant select, update on public.system_settings to anon, authenticated;
grant select, insert, update on public.app_users to anon, authenticated;

-- 로그인 기능 구현 전 단계: anon 키로 접근 허용.
-- 설정 행 추가·삭제 불가, 사용자는 삭제 대신 비활성화.
-- 로그인 구현 후에는 대상(to)을 authenticated(또는 관리자 역할)로만 변경하세요.
drop policy if exists "system_settings_select" on public.system_settings;
drop policy if exists "system_settings_update" on public.system_settings;
drop policy if exists "app_users_select" on public.app_users;
drop policy if exists "app_users_insert" on public.app_users;
drop policy if exists "app_users_update" on public.app_users;

create policy "system_settings_select" on public.system_settings for select to anon, authenticated using (true);
create policy "system_settings_update" on public.system_settings for update to anon, authenticated using (true) with check (true);
create policy "app_users_select" on public.app_users for select to anon, authenticated using (true);
create policy "app_users_insert" on public.app_users for insert to anon, authenticated with check (true);
create policy "app_users_update" on public.app_users for update to anon, authenticated using (true) with check (true);
