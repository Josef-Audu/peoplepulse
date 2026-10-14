-- PeoplePulse Phase 1 debt: Clerk-mapped creator profiles + minimal audit trail.
--
-- Profiles are keyed by Clerk identity (profiles.clerk_user_id = auth.jwt()->>'sub'
-- via Supabase Third-Party Auth). The old Supabase-Auth profiles migrations
-- (20260930*) were never applied to this project; there is no data to migrate.
-- audit_events records owner actions server-side (service role writes; owners
-- may read their own rows). Never stores secrets, tokens, or participant PII.
--
-- Apply in Supabase Dashboard → SQL Editor → Run (idempotent).

-- ------------------------------------------------------------- profiles
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text unique not null,
  display_name text,
  role text,
  country text,
  age_range text,
  interests text[] not null default '{}',
  contact_consent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_clerk_user_id_idx on public.profiles (clerk_user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select to authenticated
  using ((auth.jwt() ->> 'sub') = clerk_user_id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert to authenticated
  with check ((auth.jwt() ->> 'sub') = clerk_user_id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update to authenticated
  using ((auth.jwt() ->> 'sub') = clerk_user_id)
  with check ((auth.jwt() ->> 'sub') = clerk_user_id);

-- --------------------------------------------------------- audit_events
create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_user_id text not null,
  action text not null,
  resource_type text not null,
  resource_id text,
  created_at timestamptz not null default now()
);

create index if not exists audit_events_actor_idx on public.audit_events (actor_user_id);

alter table public.audit_events enable row level security;

drop policy if exists "audit_events_select_own" on public.audit_events;
create policy "audit_events_select_own"
  on public.audit_events for select to authenticated
  using ((auth.jwt() ->> 'sub') = actor_user_id);
