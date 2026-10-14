import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { PeoplePulseLogo } from "@/components/brand/PeoplePulseLogo";

export const metadata: Metadata = { title: "Privacy Policy — PeoplePulse" };

/*
 * FOUNDER/LEGAL REVIEW: this policy describes the CURRENT implementation
 * (Clerk identity, Supabase Postgres evidence store, no respondent accounts,
 * grouped reporting). Re-review before any change to data collection,
 * retention, analytics, or third-party processors.
 */
export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-signal-teal">Privacy Policy</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight">Your data, with boundaries.</h1>
        <p className="mt-3 text-sm text-muted">Last updated: October 2026</p>

        <div className="mt-8 grid gap-6 text-[15px] leading-relaxed text-slate-700">
          <section>
            <h2 className="text-lg font-extrabold text-ink">1. What PeoplePulse is</h2>
            <p className="mt-2">
              PeoplePulse helps creators turn assumptions into structured human evidence. Creators
              define a decision, an assumption, and an audience; participants answer short Pulses;
              creators see grouped findings with context — never raw polls presented as population truth.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-extrabold text-ink">2. Creator accounts</h2>
            <p className="mt-2">
              Signing in is handled by our identity provider (Clerk), which stores your email and
              authentication data under its own policy. In PeoplePulse itself we store your profile
              (display name, role, country, age range, interests, contact preference) and the research
              you create: projects, Pulses, and collected responses.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-extrabold text-ink">3. Public Pulse participation</h2>
            <p className="mt-2">
              Participation is voluntary and needs no account. We collect only your answers to the
              Pulse questions. We do not ask for your name, email, or contact details, and answers are
              reported only as grouped evidence (counts, shares, quoted explanations) with audience
              and sample-size context.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-extrabold text-ink">4. How evidence is used</h2>
            <p className="mt-2">
              Responses inform the creator&apos;s Decision Brief: what was found, why people said it,
              and what remains uncertain. Findings always travel with their limitations — audience,
              participant count, and self-selected recruitment — and are never presented as claims
              about a whole population.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-extrabold text-ink">5. Retention and deletion</h2>
            <p className="mt-2">
              Research data is kept while the creator&apos;s project exists. Closing a Pulse stops new
              responses; existing evidence is preserved. Creators can download their data at any time
              from Settings. Account-deletion requests are handled manually while deletion semantics
              for published evidence are finalized — contact us from your account email.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-extrabold text-ink">6. Contact</h2>
            <p className="mt-2">
              For privacy questions or requests, reply to any PeoplePulse email from your account
              address and we will respond.
            </p>
          </section>
        </div>
      </main>
      <footer className="border-t border-border bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-8 sm:px-6">
          <PeoplePulseLogo variant="compact" />
          <p className="text-xs leading-relaxed text-muted">People are the signal. Evidence is the product.</p>
        </div>
      </footer>
    </div>
  );
}
