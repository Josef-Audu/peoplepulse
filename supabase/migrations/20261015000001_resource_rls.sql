-- PeoplePulse Phase 6: Clerk-backed RLS for product resources.
--
-- Identity: auth.jwt() ->> 'sub' (Clerk user ID via Supabase Third-Party Auth;
-- no deprecated JWT templates). projects.owner_id stores the Clerk user ID as
-- text, so owner checks compare directly against the JWT sub. Existing live
-- projects already use Clerk IDs — no data migration, no downtime.
--
-- Public participant flow uses the anon role: pulses need table GRANTs for the
-- RLS policies to be reachable (previously anon got 42501 permission-denied).
-- Grants are least-privilege: anon can SELECT pulses (RLS: open only) and
-- INSERT responses (RLS: open-pulse only). Projects are never anon-readable.
--
-- Creator CRUD moves off the service-role fallback onto the caller's Clerk
-- JWT. The service role remains ONLY for audit_events writes.
--
-- Apply in Supabase Dashboard → SQL Editor → Run (idempotent).

-- ------------------------------------------------- anon table grants
grant select on public.pulses to anon;
grant insert on public.responses to anon;
grant select on public.pulses to authenticated;
grant insert on public.responses to authenticated;

-- ------------------------------------------------- projects: owner-only
drop policy if exists "projects_select_own" on public.projects;
create policy "projects_select_own"
  on public.projects for select to authenticated
  using ((auth.jwt() ->> 'sub') = owner_id);

drop policy if exists "projects_insert_own" on public.projects;
create policy "projects_insert_own"
  on public.projects for insert to authenticated
  with check ((auth.jwt() ->> 'sub') = owner_id);

drop policy if exists "projects_update_own" on public.projects;
create policy "projects_update_own"
  on public.projects for update to authenticated
  using ((auth.jwt() ->> 'sub') = owner_id)
  with check ((auth.jwt() ->> 'sub') = owner_id);

drop policy if exists "projects_delete_own" on public.projects;
create policy "projects_delete_own"
  on public.projects for delete to authenticated
  using ((auth.jwt() ->> 'sub') = owner_id);

-- ------------------------------------------------- pulses: owned-project onlydrop policy if exists "pulses_owner_all" on public.pulses;
create policy "pulses_owner_all"
  on public.pulses for all to authenticated
  using (
    exists (
      select 1 from public.projects p
      where p.id = pulses.project_id and p.owner_id = (auth.jwt() ->> 'sub')
    )
  )
  with check (
    exists (
      select 1 from public.projects p
      where p.id = pulses.project_id and p.owner_id = (auth.jwt() ->> 'sub')
    )
  );

drop policy if exists "pulses_public_read_open" on public.pulses;
create policy "pulses_public_read_open"
  on public.pulses for select to anon, authenticated
  using (status = 'open');

-- ------------------------------------------------- responses: owner reads, public constrained insert
drop policy if exists "responses_select_own" on public.responses;
create policy "responses_select_own"
  on public.responses for select to authenticated
  using (
    exists (
      select 1 from public.pulses pu
      join public.projects p on p.id = pu.project_id
      where pu.id = responses.pulse_id and p.owner_id = (auth.jwt() ->> 'sub')
    )
  );

drop policy if exists "responses_public_insert" on public.responses;
create policy "responses_public_insert"
  on public.responses for insert to anon, authenticated
  with check (
    exists (
      select 1 from public.pulses p
      where p.id = pulse_id and p.status = 'open'
    )
  );

-- ----------------- pulses: public-safe audience snapshot (denormalized)
-- Participants need audience context but must never read creator-private
-- project rows. The audience text is snapshotted onto the pulse at publish
-- time; anon reads only this snapshot column via the open-pulse policy.
alter table public.pulses
  add column if not exists audience_snapshot text;

update public.pulses pu
  set audience_snapshot = p.audience
  from public.projects p
  where p.id = pu.project_id and pu.audience_snapshot is null;
