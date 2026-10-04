-- PeoplePulse Phase 1B hardening: profile contact fields (PRD §8.1).
-- Sequential follow-up to 20260930120000_profiles.sql — that file is not rewritten.
--
-- Adds account contact data collected at signup:
-- - full_name   : required at the form level, nullable here (pre-existing rows)
-- - phone_number: required at the form level, stored normalized (+digits)
--
-- Security reasoning (unchanged ownership model):
-- - NO passwords, NO tokens, NO auth secrets in profiles — Supabase Auth only.
-- - RLS is untouched and stays enabled: the owner-only SELECT/UPDATE policies
--   (auth.uid() = profiles.id) automatically cover the new columns.
-- - No new policies, no broader permissions, no INSERT/DELETE for app roles.
-- - The trigger below remains the ONLY writer. Profile id still comes from
--   new.id (the auth relationship) — never from client-supplied metadata.
--   Metadata supplies DATA fields only (full_name, phone_number); it is never
--   trusted for authorization. Values are defensively re-validated in SQL
--   (length cap, phone regex) so malformed metadata degrades to NULL rather
--   than violating constraints or storing junk.
-- - No destructive changes: additive columns + trigger replacement only.

alter table public.profiles
  add column if not exists full_name text,
  add column if not exists phone_number text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_full_name_length'
  ) then
    alter table public.profiles
      add constraint profiles_full_name_length
      check (full_name is null or char_length(full_name) between 1 and 120);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'profiles_phone_number_format'
  ) then
    alter table public.profiles
      add constraint profiles_phone_number_format
      check (phone_number is null or phone_number ~ '^\+?[0-9]{7,15}$');
  end if;
end
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta_full_name text := nullif(left(coalesce(new.raw_user_meta_data ->> 'full_name', ''), 120), '');
  meta_phone_raw text := coalesce(new.raw_user_meta_data ->> 'phone_number', '');
begin
  insert into public.profiles (id, full_name, phone_number)
  values (
    new.id,
    -- [[:alpha:]] matches Unicode letters in UTF-8 databases (Postgres ARE
    -- syntax has no \p{L}); mirrors the form-level "at least one letter" rule.
    case when meta_full_name ~ '[[:alpha:]]' then meta_full_name else null end,
    case when meta_phone_raw ~ '^\+?[0-9]{7,15}$' then meta_phone_raw else null end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
