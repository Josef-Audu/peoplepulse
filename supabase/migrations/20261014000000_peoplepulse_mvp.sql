-- PeoplePulse Demo-Day MVP: durable product schema (projects → pulses → responses).
--
-- TEMPORARY AUTHORIZATION FALLBACK (demo-day, documented honestly):
-- Row Level Security is ON, but creator reads/writes do NOT rely on RLS JWT
-- integration. All creator access goes through server-side Server Actions /
-- Route Handlers that (1) verify the Clerk session server-side and (2) verify
-- resource ownership (projects.owner_id = Clerk userId) on every operation,
-- using the SUPABASE_SERVICE_ROLE_KEY which is SERVER ONLY (never
-- NEXT_PUBLIC_, never imported in client modules). Direct anon access is
-- limited to: SELECT on OPEN pulses (public participant flow) and INSERT of
-- anonymous responses. There is deliberately NO anon SELECT on projects,
-- draft/closed pulses, or responses. RLS hardening (Clerk Third-Party Auth
-- JWT policies) is post-demo work.
--
-- Apply with: Supabase Dashboard → SQL Editor → paste → Run.
-- (Also checked in here so `supabase db push` works when the CLI is linked.)

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null,
  title text not null,
  decision text not null,
  assumption text not null,
  audience text not null,
  created_at timestamptz not null default now()
);

create index if not exists projects_owner_id_idx on public.projects (owner_id);

-- ------------------------------------------------------------------ pulses
create table if not exists public.pulses (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  title text not null,
  description text,
  public_slug text unique not null,
  status text not null default 'draft' check (status in ('draft', 'open', 'closed')),
  questions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists pulses_project_id_idx on public.pulses (project_id);
create index if not exists pulses_public_slug_idx on public.pulses (public_slug);

-- ---------------------------------------------------------------- responses
create table if not exists public.responses (
  id uuid primary key default gen_random_uuid(),
  pulse_id uuid not null references public.pulses (id) on delete cascade,
  answers jsonb not null,
  submitted_at timestamptz not null default now()
);

create index if not exists responses_pulse_id_idx on public.responses (pulse_id);

-- ---------------------------------------------------------------------- RLS
alter table public.projects enable row level security;
alter table public.pulses enable row level security;
alter table public.responses enable row level security;

-- Public participant flow only: anyone can read OPEN pulses (no auth).
drop policy if exists "pulses_public_read_open" on public.pulses;
create policy "pulses_public_read_open"
  on public.pulses
  for select
  to anon, authenticated
  using (status = 'open');

-- Public participant flow only: anyone can submit a response.
-- Creator result reads go through the service-role server layer, not anon.
drop policy if exists "responses_public_insert" on public.responses;
create policy "responses_public_insert"
  on public.responses
  for insert
  to anon, authenticated
  with check (true);

-- NOTE: no anon/authenticated SELECT/UPDATE/DELETE policies on projects,
-- draft/closed pulses, or responses. Creator operations use the service-role
-- key server-side with explicit ownership checks (see lib/peoplepulse/).
