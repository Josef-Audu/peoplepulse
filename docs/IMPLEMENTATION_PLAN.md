# PeoplePulse MVP — Implementation Plan (from PRD v1.0)

> Source: `docs/PEOPLEPULSE PRD.md` v1.0 (authoritative, do not overwrite).
> Repo state at planning time: docs-only, no app code.
> North star: **How many meaningful decisions were improved by evidence from real people?**

Core loop: `Decision → Assumptions → Audience → Pulse → Responses → Why → Evidence → Decision Brief`

---

## 1. Architectural Decisions (lock these first)

### AD-1: Monolithic Next.js App Router + Supabase
- Single Next.js (TypeScript, App Router) app on Vercel. No separate backend service.
- Supabase provides Auth + Postgres + Realtime (+ Storage later for brief PDF). All data access via Supabase clients.
- Rationale: PRD §10 mandates this; smallest ops surface for MVP; RLS gives DB-level authz.

### AD-2: Server-first with islands of interactivity
- Route groups: `app/(marketing)`, `app/(auth)`, `app/(dashboard)`, `app/p/[slug]`.
- Default to React Server Components for dashboard / project / results / brief reads. Client components only for: Pulse Builder, participant stepper, live charts, preview simulator.
- Server Actions + Route Handlers for mutations, always Zod-validated at trusted boundary.

### AD-3: Supabase SSR auth pattern
- Use `@supabase/ssr` (`createBrowserClient` / `createServerClient`), cookie-based sessions, middleware refresh.
- `profiles` row auto-created on signup via trigger (`auth.users` → `public.profiles`). `user_id` = `auth.uid()`.

### AD-4: Validation with Zod everywhere
- One `lib/validation/*.ts` per domain: project, assumption, audience, pulse/question/option, response/answer, finding, brief.
- Client uses same schemas for UX; server re-validates. Never trust client payload.

### AD-5: RLS is the authorization layer
- RLS ON for all tables. Creator can CRUD own projects + children. Public can only `SELECT` published pulses/questions/options and `INSERT` responses/answers. No `UPDATE/DELETE` for anon.
- Service-role key never shipped to client, only in server actions if needed for aggregation.

### AD-6: Public Pulse addressing
- `pulses.public_slug`: `nanoid(10)`, unique, immutable after publish, URL `/p/{slug}`.
- Pulse `status`: `draft | open | closed`. Project `status`: `draft | active | completed | archived` (PRD §8.3). Closing pulse ≠ archiving project.

### AD-7: Anonymous responses, identity separated
- `responses.respondent_id` NULLABLE (PRD §8.10, §12). Logged-in respondent links to `auth.uid()`; anon gets NULL + fingerprint hash in `quality_metadata` (IP hash + UA + rate-limit key, no raw PII in logs).
- Answers table is narrow: one row per question with `option_ids[]` (multi-choice) OR `text_value` OR `numeric_value`. Enforce exactly-one-value-populated via check constraint.

### AD-8: Ask Why = no realtime messaging (PRD §8.13)
- MVP: (a) per-question optional `why_prompt` open-text field inline, (b) follow-up question (`followups` table), (c) follow-up Pulse linked to same project. Ship (a)+(b) for MVP; (c) is just "create second pulse".

### AD-9: Live results = polling + Supabase Realtime (optional)
- Default: server-fetch + router refresh every ~10s. Enable Realtime on `responses` only in Results page. Recharts lazy-loaded, comprehension-first charts only.

### AD-10: Evidence context component
- Every finding/result view renders `<EvidenceContext participantCount audience collectionPeriod recruitmentMethod limitations />`. Copy must use PRD §2.4 language: "X% of PeoplePulse respondents…", never population claims.

### AD-11: Design tokens from PRD §17–18
- Tailwind theme: `pulse #2563EB`, `ink #17212B`, `paper #F8FAF9`, `signal-teal #0F766E`, `success #15803D / warning #D97706 / error #DC2626 / border #E5E7EB / muted #64748B`. Inter font. shadcn/ui primitives only; PeoplePulse components (`EvidenceCard`, `BriefSection`, `PulseStepper`) built on top.

---

## 2. Proposed repo structure

```text
app/
  (marketing)/page.tsx                  # Landing
  (auth)/sign-in|sign-up/page.tsx
  (dashboard)/dashboard|projects|...    # Creator app, sidebar layout
  p/[slug]/page.tsx                     # Public Pulse
  p/[slug]/done/page.tsx                # Completion
  api/ (only where Server Actions insufficient, e.g. public submit rate-limit)
components/
  ui/            # shadcn
  pulse/         # builder, stepper, preview
  evidence/      # EvidenceCard, EvidenceContext, charts
  brief/         # DecisionBrief renderer
lib/
  supabase/{client,server,admin}.ts
  validation/*.ts
  slugs.ts  rate-limit.ts  audit.ts
supabase/
  migrations/xxxx_init.sql
  seed.sql
docs/
  PEOPLEPULSE PRD.md  (untouchable)
  IMPLEMENTATION_PLAN.md (this file)
```

Route map → PRD §9 / §26: Public (Landing, Sign in/up, Public Pulse, Completion); Creator (Dashboard, Create Project, Project Overview, Audience, Assumptions, Pulse Builder, Preview, Publish, Results, Ask Why, Findings, Decision Brief, Profile, Settings).

---

## 3. Phased plan — actionable bits

### Phase 0 — Foundation (unblocks everything)
Goal: runnable scaffold + CI + env hygiene.
- [ ] `create-next-app --typescript --tailwind --app`, set Inter, theme tokens above, `cn()` util.
- [ ] Install: shadcn/ui (button, dialog, input, select, tabs, card, form, sonner/toast, dropdown, label, textarea, radio, checkbox, slider), `zod + react-hook-form + @hookform/resolvers`, `@supabase/ssr @supabase/supabase-js`, `recharts`, `nanoid`.
- [ ] Env: `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `..._ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` server-only), `.env.example`, `.gitignore` covers `.env*`. Vercel project linked, preview deploys on.
- [ ] ESLint + Prettier + `tsc --noEmit` in CI (GitHub Actions). Branch protection on `main`.
- [ ] App shell: root layout, marketing nav, dashboard sidebar (`Overview / Research / Pulses / Insights / Profile / Settings` per §9), responsive breakpoints (§24), empty states with PRD §22 voice.
- Exit: `pnpm dev` runs, `/` renders, CI green.

### Phase 1 — Auth + Profiles + Shell + Design system (PRD §8.1, §9, §17–25)
- [ ] Supabase Auth: sign-up, sign-in, sign-out, reset-password, session refresh in `middleware.ts`. OAuth deferred.
- [ ] `profiles` table + trigger + RLS (owner read/write own). Profile page: display_name, role, country, age_range, interests, consent fields.
- [ ] Settings page: sign-out, delete account (deletes `auth.user` via server + cascades/anonymizes responses), data export stub.
- [ ] Design primitives: `EvidenceCard`, `EvidenceContext`, `EmptyState`, `PageHeader`, question-type icons, chart wrapper with table alternative (a11y §23: labels, focus, contrast, no color-only, touch targets ≥44px).
- [ ] Audit helper: `audit_events` insert on project/pulse/publish/brief actions.
- Exit: new user can register → edit profile → see empty dashboard ("What are you trying to understand?" + New Research Project).

### Phase 2 — Projects + Assumptions + Audience (PRD §8.3–8.5; acceptance steps 2–6)
- [ ] Tables `projects`, `assumptions` (+RLS owner-only). `audience_definition` as JSONB on projects with Zod schema `{country, ageRange, participantType, interest?}`.
- [ ] Screens: Dashboard (active/completed/drafts + recent findings, no vanity analytics), Create Project (title, decision, objective, audience, status=draft), Project Overview (status transitions draft→active→completed→archived), Assumptions CRUD (statement, category, priority, status Untested/Supported/Challenged/Inconclusive + helper "your interpretation, not statistical truth"), Audience form.
- [ ] Validation: title ≤120, decision/objective required, deadline optional future date.
- Exit: user can create project → add assumptions → define audience.

### Phase 3 — Pulse Builder + Preview + Publishing (PRD §8.6–8.8; acceptance steps 7–10)
- [ ] Tables `pulses`, `questions`, `options` (+RLS: owner full; public read only when `pulses.status='open'`).
- [ ] Builder: add/edit/delete/reorder (position int), per-type editors (yes_no, single_choice, multiple_choice, rating/scale with min/max/labels, short_text with maxLength), required toggle, `why_prompt` optional toggle per question, 5–10 recommendation nudge (not hard block), autosave draft.
- [ ] Preview: exact participant component in mobile frame, progress "X of N", validation, completion screen. Route: `/projects/[id]/pulses/[pulseId]/preview`.
- [ ] Publish: generates `public_slug` once, `opens_at=now()`, status open; share dialog with copy link `/p/{slug}`; close/reopen. Never deletes collected responses on unpublish.
- Exit: 5–10Q pulse previewable → published → shareable link.

### Phase 4 — Public participant flow + Response collection (PRD §8.9–8.10; acceptance steps 11–12)
- [ ] Public routes: `/p/[slug]` (title, purpose, "N questions · ~1 min", privacy note, Begin) → stepper (one question at a time, progress, back, required validation, optional why textbox) → submit → `/p/[slug]/done` (thank-you, no results leak).
- [ ] Tables `responses` (pulse_id, respondent_id nullable, submitted_at, quality_metadata JSONB) + `answers` (response_id, question_id, option_ids uuid[] nullable, text_value, numeric_value). Atomic insert via Server Action + transaction. Duplicate protection: per-pulse cookie + IP-hash rate limit (e.g. 5/IP/hour) + honeypot. No login required.
- [ ] Abuse: rate limit (Upstash / Vercel KV or Supabase function); input sanitize + length caps; privacy-aware logging (no raw IP/UA).
- [ ] Perf: static-ish public page, no heavy JS, preload next question client-side.
- Exit: anon user completes pulse on mobile in ~1–3 min; response persisted.

### Phase 5 — Live Results + Findings + Ask Why + Decision Brief (PRD §8.11–8.15; acceptance steps 13–19)
- [ ] Results page per pulse: total responses, completion rate, collection period, per-question distributions (horizontal bars for choice, avg + histogram for rating, list for short text), audience breakdown stub ("self-selected sample" default), Realtime refresh.
- [ ] `EvidenceContext` on every chart + Research Integrity labels (§15): Measurement vs Pattern vs Interpretation vs Prediction — finding editor forces selecting one.
- [ ] Ask Why: (a) inline why answers under parent question, (b) `followups` table + UI (target_segment e.g. "answered Yes to Q3", status open/closed). No messaging.
- [ ] Findings CRUD: statement + linked question_ids + supporting stats snapshot + selected why-quotes + audience/evidence context + limitations (all required before publish).
- [ ] `research_briefs` (project_id unique, 8 sections per §8.15, findings snapshot JSONB + limitations + next_questions). Brief editor + read/print view (`/projects/[id]/brief`) with print CSS, owner-only share for MVP. Editorial typography (Inter now; serif later).
- Exit: creator sees live charts with limitations → curates findings with why-quotes → generates printable Decision Brief.

### Phase 6 — Hardening + Legal + Launch readiness (PRD §13, §14, §23, §28)
- [ ] Security pass: RLS tests (anon cannot read drafts / list responses; owner cannot read others), Zod fuzz, rate-limit test, secrets scan, `audit_events` coverage.
- [ ] Privacy: data minimization review, deletion flows, Privacy Policy + Terms pages (BLOCKING for public launch per §14), consent copy on public pulse.
- [ ] A11y + responsive + motion audit (§23–25): keyboard, focus, screen reader, chart data tables, subtle transitions only.
- [ ] Metrics (§28): project completion, pulse completion, "evidence usefulness" post-brief survey (changed/strengthened/challenged/surprised/new question), repeat-research count, why-response rate.
- [ ] E2E: Playwright covering all 20 acceptance steps (§29). Seed demo project ("Student Meal Service").
- Exit: acceptance 1–20 passes on preview; legal pages live; close/archive works.

---

## 4. Minimal SQL sketch (refine in migration)

- `projects(owner_id uuid refs auth.users, title, decision, objective, audience_definition jsonb, status text check, ...)`
- `assumptions(project_id fk cascade, statement, category, priority, status)`
- `pulses(project_id fk cascade, title, description, status, public_slug unique, opens_at, closes_at)`
- `questions(pulse_id cascade, type check (yes_no,single,multiple,rating,short_text), prompt, required bool, position int, why_prompt text nullable, rating_min/max nullable)`
- `options(question_id cascade, label, position)`
- `responses(pulse_id cascade, respondent_id nullable, submitted_at default now(), quality_metadata jsonb)`
- `answers(response_id cascade, question_id, option_ids uuid[], text_value, numeric_value, check exactly-one-kind)`
- `followups(pulse_id, question_id nullable, prompt, target_segment, status)` — answers reuse `answers` or separate table (decide Phase 5)
- `research_briefs(project_id unique, sections jsonb, limitations, next_questions)`
- `audit_events(actor_id, action, entity_type, entity_id, timestamp)`

RLS pattern: owner policies via `projects.owner_id = auth.uid()` (join through pulses for nested tables); public read only where `pulses.status='open'`; public insert on responses/answers with pulse-open check.

---

## 5. Risks / guards

- Scope creep into §27 out-of-scope (marketplace, rewards, AI evidence, native apps) — reject unless PRD amended. AI summarization is Phase 4 roadmap, not MVP.
- Biased-sample overclaim — mitigated by mandatory `EvidenceContext` + copy lint.
- Spam/ballot-stuffing on public link — rate limit + cookie + close control; CAPTCHA only if abused.
- Realtime cost — off by default except Results page.

---

## 6. Build order / parallel lanes

Sequential: 0 → 1 → 2 → 3 → 4 → 5 → 6 (each exits with demo-able increment). Parallelizable after Phase 1: (a) builder/preview, (b) public stepper, (c) results/charts/brief renderer — behind shared Zod schemas + `EvidenceContext` contract.

## 7. MVP acceptance trace (§29)

1–2. Account + project → Ph1+Ph2 · 3–6. Decision/objective/assumptions/audience → Ph2 · 7–10. Pulse/preview/publish/share → Ph3 · 11–12. Participate/submit → Ph4 · 13–16. Live results/quant/qual/context → Ph5 · 17–18. Findings/Brief → Ph5 · 19–20. Limitations/close-archive → Ph5+Ph6.
