# PeoplePulse

> **People are the signal. Evidence is the product. Better decisions are the outcome.**

PeoplePulse is a **human evidence platform** that helps people understand what other people think, need, want, experience, and why — before making decisions that involve them.

**Primary principle:** Evidence before confidence.

- **Status:** MVP Definition (PRD v1.0)
- **Product spec:** [`docs/PEOPLEPULSE PRD.md`](docs/PEOPLEPULSE%20PRD.md)
- **Project status:** Initial repository — documentation only, no implementation yet.

---

## What is PeoplePulse?

PeoplePulse turns uncertainty about people into structured human evidence.

The core workflow is:

```text
Decision → Assumptions → Audience → Pulse → Responses → Why → Evidence → Decision
```

- The **Pulse** is the mechanism: a short research instrument (recommended 5–10 questions, ~1–3 minutes to complete).
- The **evidence** is the product: structured findings with context, not raw polls or vanity analytics.

PeoplePulse is intentionally **not** positioned as a polling app, survey builder, form builder, social network, analytics dashboard, or AI survey generator. The intended category is **human evidence / human research platform**.

Brand promise: **Turn assumptions into evidence.**

---

## The problem it solves

People constantly make decisions based on assumptions about other people:

- An entrepreneur assumes customers will buy.
- A creator assumes an audience wants certain content.
- A product designer assumes users understand a feature.
- A school assumes students need something.
- A researcher wants to understand a behavior.
- An organization wants to know what its community thinks.

The underlying problem:

> **We often make decisions about people without enough evidence from the people themselves.**

Existing tools help create forms, polls, surveys, or recruit participants. PeoplePulse is designed around the larger question:

> **What are you trying to understand or decide, and what evidence do you need before acting?**

Guiding product beliefs (per PRD):

1. The question is not the product — the decision is.
2. More responses do not automatically mean better evidence. Response data is always shown with context.
3. Quantitative data tells us **what**; qualitative evidence helps explain **why** (via Ask Why).
4. Evidence has boundaries — a sample is never presented as population truth (e.g. "64% of PeoplePulse respondents selected this option", not "64% of Nigerians want this").
5. AI should amplify evidence, never manufacture it.

---

## Who it is for

### Primary persona: The Decision Maker

Anyone who needs to make a decision involving other people but lacks sufficient evidence. This is a behavioral persona, not a job title — including entrepreneurs, creators, product teams, researchers, students, educators, organizations, community leaders, marketers, and institutions.

Core job:

> "Help me understand the people affected by this decision before I act."

Needs: clarity, relevant participants, fast research, understandable results, evidence context, qualitative explanation, actionable findings.

### Secondary persona: The Participant

The person who provides the human evidence.

Core job:

> "Let me share my perspective quickly and understand why my response matters."

Needs: short experiences, clarity, privacy, low friction, mobile usability, transparency.

---

## Core product journey

### Decision Maker journey

```text
Recognize uncertainty
  → Create Research Project
  → Define decision
  → Identify assumptions
  → Define audience
  → Create Pulse
  → Publish
  → Recruit participants
  → Collect responses
  → Review evidence
  → Ask Why
  → Create Decision Brief
  → Make / refine decision
```

### Participant journey

```text
Open Pulse → Understand purpose → Review privacy/context → Begin
  → Answer questions → Optional explanation → Submit → Completion
```

Target completion time for a normal MVP Pulse: **approximately 1–3 minutes**. Participant experience is mobile-first, fast, and distraction-free, with visible progress (e.g. "2 of 6").

### MVP core loop (8 steps)

1. **Decision** — state what is being decided.
2. **Assumptions** — record what is currently believed (status: Untested / Supported / Challenged / Inconclusive — user interpretation, not statistical truth).
3. **Audience** — define who needs to provide evidence (MVP: country, age range, broad participant type, optional interest/category).
4. **Pulse** — create a short research instrument.
5. **Responses** — collect participant answers.
6. **Ask Why** — collect qualitative explanations (MVP: optional open-text follow-up within the Pulse, targeted follow-up question, or separate short follow-up Pulse; no real-time messaging).
7. **Evidence** — present structured findings with context and limitations.
8. **Decision Brief** — package the research into a concise, decision-oriented artifact.

### Evidence language

| Instead of | PeoplePulse says |
| ---------- | ---------------- |
| Survey | Pulse |
| Data | Evidence |
| Analytics | Findings |
| Report | Decision Brief |
| Users | Participants |
| Targeting | Audience |
| Questions | Research Questions |

### Decision Brief structure

The flagship output — a modern editorial research document:

1. The Question — what were we trying to understand?
2. The Audience — who participated?
3. What We Found — major quantitative findings.
4. Why People Said It — qualitative explanations.
5. What Surprised Us — unexpected findings.
6. What Remains Uncertain — unanswered questions.
7. Evidence Limitations — sampling and methodology limitations.
8. What To Investigate Next — recommended next research questions.

Every meaningful finding carries evidence context: participant count, audience definition, collection period, recruitment method, sampling limitations. Findings distinguish **observed pattern** from **interpretation** from **prediction**.

---

## MVP scope

### In scope

- **Authentication** — sign up, sign in, sign out, reset password, profile (Supabase Auth).
- **Dashboard** — oriented around "What are you trying to understand?" with + New Research Project; shows active / completed / draft projects and recent findings. No vanity analytics.
- **Research Projects** — title, decision, research objective, audience, status (Draft / Active / Completed / Archived); optional description, notes, category, deadline.
- **Assumptions** — statement, category, priority, status.
- **Audience definition** — deliberately simple (see above); no unnecessary sensitive data.
- **Pulse Builder** — question types: Yes/No, single choice, multiple choice, rating/scale, short text. Supports add / edit / delete / reorder / preview / publish. Each question: prompt, type, required/optional, position, options where applicable.
- **Pulse Preview** — participant-view simulation: mobile experience, question flow, progress, validation, completion.
- **Publishing** — unique public Pulse URL (conceptual: `peoplepulse.com/p/{slug}`); Pulses can be opened, shared, closed.
- **Response collection** — Pulse, response, answers, submission timestamp, participant account where applicable, quality-control metadata. Anonymous participation permitted (`respondent_id` nullable). Identity separated from answers where possible.
- **Live results** — total responses, completion rate, collection period, answer distributions, text responses, audience breakdowns. Simple comprehension-first charts (horizontal bars, columns, simple distributions, time lines; no 3D or decorative effects).
- **Evidence context** — every finding paired with its limitations (see example in PRD §8.12).
- **Ask Why** — signature What → Why path to qualitative explanation.
- **Findings** — statement + supporting response data + qualitative explanations + audience/evidence context + limitations.
- **Decision Brief** — as structured above; readable, printable, shareable, methodology-aware.

### MVP screens (per PRD §26)

Public: Landing, Sign in, Sign up, Public Pulse, Pulse completion.
Creator: Dashboard, Create Project, Project Overview, Define Audience, Define Assumptions, Pulse Builder, Preview, Publish, Results, Ask Why, Findings, Decision Brief, Profile, Settings.

### Out of scope for MVP (per PRD §27)

- Marketplaces (respondent / recruitment / researcher), rewards, credits, payouts, payments, crypto.
- Social features (followers, likes, comments, feeds, public social profiles).
- AI-generated research, automated success scores, AI pretending to be participants, AI-generated evidence.
- Complex demographic targeting, longitudinal panels, advanced statistical inference / experimental design, large-scale opinion infrastructure.
- Native mobile apps, complex messaging, data marketplaces.

### MVP acceptance

Per PRD §29, the MVP is functionally complete when a new user can: create an account → create a project → define decision, objective, assumptions, audience → create a 5–10 question Pulse → preview → publish → share the link → participate and submit via the public experience → view live results → review quantitative + qualitative findings with evidence context → produce a Decision Brief → understand limitations → close/archive the project.

North Star: **how many meaningful decisions were improved by evidence from real people** — not how many surveys were created.

---

## Planned technology stack

Per PRD §10 (planned — not yet implemented):

| Layer | Choice |
| ----- | ------ |
| Frontend | Next.js + TypeScript + App Router |
| Styling | Tailwind CSS |
| UI primitives | shadcn/ui (PeoplePulse-specific components built on top) |
| Backend | Supabase (Auth, PostgreSQL, Realtime, database policies) |
| Database | PostgreSQL |
| Validation | Zod (forms, API/server, research structure, trusted boundaries) |
| Charts | Recharts |
| Deployment | Vercel |
| Source control | GitHub |

### Planned data model (per PRD §11–12)

```text
User → Projects → Assumptions
                → Pulse → Questions → Options
                        → Responses → Answers
     → Decision Brief (research_briefs)
```

Core tables: `profiles`, `projects`, `assumptions`, `pulses`, `questions`, `options`, `responses`, `answers`, `followups`, `research_briefs`, `audit_events`.

Security/privacy requirements (planned): Supabase Auth + Row Level Security + database-level authorization, server-side + Zod validation, secure sessions, rate limiting / abuse protection, duplicate-response protection, input sanitization, privacy-aware logging, account/data deletion, audit events. Secrets server-side only via environment variables; `.env` files never committed. Privacy Policy and Terms required before public launch.

---

## Repository structure

```text
peoplepulse/
├── README.md                  # This file
├── docs/
│   └── PEOPLEPULSE PRD.md     # Product Bible + MVP PRD (v1.0, authoritative spec)
└── (implementation to follow: Next.js app, Supabase config, etc.)
```

The PRD is the authoritative product definition. Do not overwrite it. Do not add secrets or environment files.

---

## Current project status

- [x] Product Bible + MVP PRD v1.0 written (`docs/PEOPLEPULSE PRD.md`)
- [x] Repository initialized
- [ ] Next.js + TypeScript + Tailwind + shadcn/ui scaffold
- [ ] Supabase project, schema, and RLS policies
- [ ] Auth, Dashboard, Projects, Assumptions, Audience
- [ ] Pulse Builder, Preview, Publishing, public participant flow
- [ ] Responses, live results, Ask Why, Findings, Decision Brief
- [ ] Privacy Policy + Terms of Service (required before public launch)

Roadmap after MVP (not in scope now): Phase 2 Participant Network → Phase 3 Research Marketplace → Phase 4 Research Intelligence → Phase 5 Living Human Intelligence. See PRD §31.

---

## Getting started

No runnable application exists yet. Implementation follows the PRD and the MVP acceptance criteria in §29.

Suggested first build order (mirrors PRD Phase 1):

1. Scaffold Next.js App Router + Tailwind + shadcn/ui.
2. Connect Supabase Auth + PostgreSQL schema + RLS.
3. Build Projects → Assumptions → Audience → Pulse Builder → Preview → Publish.
4. Build public Pulse + response collection.
5. Build results + evidence context + Ask Why + findings + Decision Brief.

Voice and tone for all UI copy: **precise, curious, calm, and human.** Avoid hype, exaggerated certainty, startup clichés, manipulative language, and fake urgency. See PRD §22 for examples.
