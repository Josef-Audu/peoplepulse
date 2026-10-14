import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { PeoplePulseLogo } from "@/components/brand/PeoplePulseLogo";

export const metadata: Metadata = { title: "Terms of Service — PeoplePulse" };

/*
 * FOUNDER/LEGAL REVIEW: these terms describe the CURRENT product (creator
 * research, voluntary anonymous participation, grouped evidence). Re-review
 * before payments, incentives, representative-sampling claims, or API access.
 */
export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-signal-teal">Terms of Service</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight">Honest research, honestly run.</h1>
        <p className="mt-3 text-sm text-muted">Last updated: October 2026</p>

        <div className="mt-8 grid gap-6 text-[15px] leading-relaxed text-slate-700">
          <section>
            <h2 className="text-lg font-extrabold text-ink">1. The service</h2>
            <p className="mt-2">
              PeoplePulse lets creators run short research Pulses and read the results as bounded
              evidence with context. Accounts are for creators; participation in a Pulse never
              requires an account.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-extrabold text-ink">2. Your responsibilities as a creator</h2>
            <p className="mt-2">
              Ask only for the answers you need, describe your Pulse honestly, and never present
              grouped findings as claims about people who were not asked. Do not use Pulses to
              collect passwords, financial details, or other sensitive personal data.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-extrabold text-ink">3. Participation</h2>
            <p className="mt-2">
              By submitting a Pulse you confirm your answers are your own and you respond only once
              per person. Automated or bulk submissions may be discarded to protect evidence quality.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-extrabold text-ink">4. Evidence and decisions</h2>
            <p className="mt-2">
              PeoplePulse reports early signals, not certainties. Results describe respondents only.
              Decisions you make from evidence are your own responsibility.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-extrabold text-ink">5. Availability and changes</h2>
            <p className="mt-2">
              We may modify, suspend, or discontinue parts of the service as it evolves from MVP to
              beta. We will keep evidence you collected downloadable where technically feasible.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-extrabold text-ink">6. Contact</h2>
            <p className="mt-2">
              Questions about these terms: reply to any PeoplePulse email from your account address.
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
