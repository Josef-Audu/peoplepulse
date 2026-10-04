-- PeoplePulse Phase 1A: profiles foundation (plan AD-3, AD-5; PRD §8.1, §11–12).
--
-- One profile row per Supabase Auth user. The profiles table stores NO
-- credentials: passwords and sessions stay in auth.users (owned by Supabase Auth).
-- Identity is the auth user's UUID, referenced directly as the primary key.
--
-- Security reasoning:
-- - RLS is ON: anon gets nothing; authenticated users can SELECT/UPDATE only
--   the row whose id equals auth.uid(). No INSERT/DELETE for app roles —
--   rows are created solely by the signup trigger below.
-- - The trigger function is SECURITY DEFINER (it must write as the new user
--   does not yet have a session) with a fixed `search_path = public`, which
--   closes the search_path-hijack vector for definer functions.
-- - `on conflict (id) do nothing` makes re-runs safe.
-- - No service-role usage, no PII beyond an optional display name.
--
-- Apply with: supabase db push (Supabase CLI) or the Supabase SQL editor.
-- Phase 1A code runs credential-free without this applied; Phase 1B auth UX
-- requires a linked Supabase project with this migration applied.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
