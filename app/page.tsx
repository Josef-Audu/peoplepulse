import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { EvidenceCard } from "@/components/evidence/EvidenceCard";
import { EvidenceContext } from "@/components/evidence/EvidenceContext";
import { ChartCard } from "@/components/evidence/ChartCard";

/**
 * Marketing home (Phase 0B shell): hero, core loop, and an illustrative
 * evidence example rendered with the production foundation components.
 * Example data is static and labeled — no live functionality is implied.
 */
export default function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-signal-teal">
            Evidence before confidence
          </p>
          <h1 className="max-w-[20ch] text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Turn assumptions into evidence.
          </h1>
          <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-slate-600">
            <strong className="font-semibold text-ink">What are you trying to understand?</strong>{" "}
            PeoplePulse turns uncertainty about people into structured human evidence — short Pulses collect
            what people think, and the product is the bounded evidence, never a population claim.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard"
              className="flex min-h-[44px] items-center rounded-lg border border-pulse-dark bg-pulse px-6 text-[15px] font-bold text-white shadow-lg shadow-pulse/30 hover:bg-pulse-dark"
            >
              Open the app shell
            </Link>
            <Link
              href="/#evidence-example"
              className="flex min-h-[44px] items-center rounded-lg border border-border bg-white px-6 text-sm font-semibold text-ink hover:border-slate-400"
            >
              See example evidence
            </Link>
          </div>
        </section>

        <section aria-label="How PeoplePulse works" className="border-y border-border bg-white">
          <div className="mx-auto grid max-w-5xl gap-6 px-4 py-12 sm:grid-cols-3 sm:px-6">
            {[
              {
                step: "1 · Decision",
                text: "State what is being decided, and which assumptions need testing.",
              },
              {
                step: "2 · Pulse",
                text: "Ask a short instrument of the right audience — minutes, not weeks.",
              },
              {
                step: "3 · Evidence",
                text: "Receive bounded findings with context, limitations, and the why behind them.",
              },
            ].map((item) => (
              <div key={item.step}>
                <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-signal-teal">
                  {item.step}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="evidence-example"
          aria-labelledby="evidence-example-heading"
          className="mx-auto max-w-5xl scroll-mt-20 px-4 py-16 sm:px-6"
        >
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-signal-teal">
            Illustrative example — not real responses
          </p>
          <h2 id="evidence-example-heading" className="max-w-[30ch] text-3xl font-extrabold tracking-tight">
            Evidence, with its boundaries attached.
          </h2>
          <p className="mt-3 max-w-[65ch] text-base leading-relaxed text-slate-600">
            Every finding carries who responded, how they were reached, and what remains uncertain. Below is
            a static illustration rendered with the production components — the live loop arrives in later
            phases.
          </p>
          <div className="mt-8 grid items-start gap-6 lg:grid-cols-2">
            <EvidenceCard
              example
              percentage={58}
              finding="prefer weekend morning hours"
              participantCount={842}
              audience="Illustrative audience · library visitors"
              collectionPeriod="Example period · two weeks"
              statusLabel="Illustrative signal"
              limitation="Self-selected sample"
            />
            <ChartCard
              title="What respondents chose"
              description="Shares are derived from respondent counts."
              data={[
                { label: "Weekend mornings", value: 489 },
                { label: "Weekday evenings", value: 210 },
                { label: "No preference", value: 143 },
              ]}
            />
          </div>
          <div className="mt-6">
            <EvidenceContext
              participantCount={842}
              audience="Illustrative audience · library visitors"
              collectionPeriod="Example period · two weeks"
              recruitmentMethod="Illustrative · link shared at the front desk"
              limitations={[
                "Self-selected sample — visitors who noticed the link, not all visitors.",
                "One branch only — says nothing about other branches or non-visitors.",
                "Preferences stated in example; real follow-up would ask why.",
              ]}
            />
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-5xl px-4 py-6 text-xs text-muted sm:px-6">
          PeoplePulse · People are the signal. Evidence is the product.
        </div>
      </footer>
    </div>
  );
}
