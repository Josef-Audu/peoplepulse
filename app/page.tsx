import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { BrandMark } from "@/components/brand/BrandMark";
import { SignalGraphic } from "@/components/landing/SignalGraphic";
import {
  ProblemSection,
  HowItWorksSection,
  AskWhySection,
  DecisionBriefSection,
  AudiencesSection,
  FinalCtaSection,
} from "@/components/landing/LandingSections";
import { EvidenceCard } from "@/components/evidence/EvidenceCard";
import { EvidenceContext } from "@/components/evidence/EvidenceContext";
import { ChartCard } from "@/components/evidence/ChartCard";

/**
 * Marketing home: the PeoplePulse proposition rendered with the production
 * brand system (Inter, PRD §17 tokens, convergence mark) and foundation
 * components. All figures are illustrative examples — never live findings.
 */
export default function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        {/* HERO */}
        <section className="border-b border-border bg-paper">
          <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-signal-teal">
                Evidence before confidence
              </p>
              <h1 className="mt-3 max-w-[20ch] text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">
                Turn assumptions into evidence.
              </h1>
              <p className="mt-5 max-w-[55ch] text-base leading-relaxed text-slate-600">
                PeoplePulse helps you understand what real people think, want, experience, and
                why, before making decisions.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/sign-up"
                  className="flex min-h-[44px] items-center justify-center rounded-lg border border-pulse-dark bg-pulse px-6 text-[15px] font-bold text-white shadow-md shadow-pulse/30 hover:bg-pulse-dark"
                >
                  Start a Pulse
                </Link>
                <Link
                  href="#how-it-works"
                  className="flex min-h-[44px] items-center justify-center rounded-lg border border-border bg-white px-6 text-[15px] font-semibold text-ink hover:border-slate-300"
                >
                  See how it works
                </Link>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted">
                5–10 questions · about 1–3 minutes per Pulse · bounded, contextualized evidence
              </p>
            </div>
            <SignalGraphic />
          </div>
        </section>

        <ProblemSection />

        <div id="how-it-works">
          <HowItWorksSection />
        </div>

        <AskWhySection />

        {/* EVIDENCE */}
        <section
          aria-labelledby="evidence-heading"
          className="border-y border-border bg-white"
        >
          <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-signal-teal">
              Evidence, with context
            </p>
            <h2
              id="evidence-heading"
              className="mt-2 max-w-[30ch] text-3xl font-extrabold tracking-tight"
            >
              A number is only evidence when its boundaries travel with it.
            </h2>
            <p className="mt-3 max-w-[70ch] text-sm leading-relaxed text-slate-600 sm:text-[15px]">
              Never “64% of Nigerians want this.” Always who was asked, how many answered, and
              what the sample cannot claim. Illustrative example below.
            </p>
            <div className="mt-8 grid items-start gap-4 lg:grid-cols-2">
              <EvidenceCard
                percentage={64}
                finding="would consider using it"
                participantCount={1284}
                audience="University students · 18–25"
                collectionPeriod="12–19 March · illustrative example"
                statusLabel="Early signal"
                limitation="Self-selected sample"
                example
              />
              <div className="grid gap-4">
                <ChartCard
                  title="Example distribution"
                  description="Illustrative respondent counts. Shares are derived from counts."
                  data={[
                    { label: "Would consider it", value: 822 },
                    { label: "Undecided", value: 283 },
                    { label: "Would not consider", value: 179 },
                  ]}
                />
                <EvidenceContext
                  participantCount={1284}
                  audience="University students · 18–25"
                  collectionPeriod="12–19 March · illustrative example"
                  recruitmentMethod="Self-selected sample"
                  limitations={[
                    "Respondents chose to participate, so the sample is not representative.",
                    "Findings describe these 1,284 respondents only.",
                  ]}
                />
              </div>
            </div>
          </div>
        </section>

        <DecisionBriefSection />

        <AudiencesSection />

        <FinalCtaSection />
      </main>

      <footer className="border-t border-border bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <BrandMark size={28} />
            <p className="text-xs leading-relaxed text-muted">
              People are the signal. Evidence is the product.
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <Link href="/sign-in" className="font-semibold text-pulse hover:text-pulse-dark">
              Sign in
            </Link>
            <Link href="/sign-up" className="font-semibold text-pulse hover:text-pulse-dark">
              Create an account
            </Link>
            <Link href="/dashboard" className="font-semibold text-pulse hover:text-pulse-dark">
              App shell
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
