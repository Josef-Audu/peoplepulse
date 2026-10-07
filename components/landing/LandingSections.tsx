import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import {
  AssumptionIcon,
  DecisionIcon,
  ExploreIcon,
  InsightIcon,
  ParticipantsIcon,
  PatternIcon,
  PulseIcon,
  ResearchIcon,
  TrustIcon,
  type BrandIconProps,
} from "@/components/brand/icons";

function SectionHeading({
  id,
  eyebrow,
  title,
  description,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-[70ch]">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-signal-teal">{eyebrow}</p>
      <h2 id={id} className="mt-2 text-3xl font-extrabold tracking-tight">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-[15px]">{description}</p>
    </div>
  );
}

type Step = { title: string; detail: string; icon: ComponentType<BrandIconProps> };

function StepList({ steps }: { steps: Step[] }) {
  return (
    <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, index) => (
        <li
          key={step.title}
          className="rounded-2xl border border-border bg-white p-5"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-paper text-pulse">
            <step.icon size={20} />
          </span>
          <p
            aria-hidden="true"
            className="mt-4 text-xs font-extrabold tabular-nums tracking-[0.12em] text-pulse"
          >
            {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-2 text-base font-bold">{step.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{step.detail}</p>
        </li>
      ))}
    </ol>
  );
}

/** Section 01 — the assumption chain most decisions start from. */
export function ProblemSection() {
  return (
    <section aria-labelledby="problem-heading" className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <SectionHeading
        id="problem-heading"
        eyebrow="The problem"
        title="Most decisions begin as guesses about people."
        description="An entrepreneur assumes customers will buy. A product team assumes users understand a feature. A school assumes students need something. Informal opinion and scattered feedback feel informative, but they rarely survive contact with the people actually affected."
      />
      <ol className="mt-8 flex flex-col gap-2 rounded-2xl border border-border bg-white p-5 sm:p-6">
        {["Assumption", "Question", "People", "Evidence", "Decision"].map((node, index, all) => (
          <li key={node} className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                index === 0
                  ? "bg-border/60 text-muted"
                  : index === all.length - 1
                    ? "bg-pulse text-white"
                    : "bg-signal-teal/10 text-signal-teal"
              }`}
            >
              {index + 1}
            </span>
            <span className="text-[15px] font-semibold">{node}</span>
            {index < all.length - 1 ? (
              <span aria-hidden="true" className="ml-1 text-muted">
                ↓
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      <p className="mt-4 max-w-[70ch] text-sm leading-relaxed text-slate-600">
        PeoplePulse inserts a testable step between assumption and decision: ask the people
        involved, structure what they tell you, and decide with their perspectives in view.
      </p>
    </section>
  );
}

/** Section 02 — the 8-step product loop (PRD §7.2). */
export function HowItWorksSection() {
  return (
    <section
      aria-labelledby="how-it-works-heading"
      className="border-y border-border bg-white"
    >
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <SectionHeading
          id="how-it-works-heading"
          eyebrow="How PeoplePulse works"
          title="From uncertainty to evidence, in eight steps."
          description="One continuous loop. Each step feeds the next, and every finding stays attached to the people and context it came from."
        />
        <StepList
          steps={[
            { title: "Decision", detail: "State what you are trying to decide.", icon: DecisionIcon },
            { title: "Assumptions", detail: "Record what you currently believe.", icon: AssumptionIcon },
            { title: "Audience", detail: "Define who needs to provide evidence.", icon: ParticipantsIcon },
            { title: "Pulse", detail: "Create a short 5–10 question instrument.", icon: PulseIcon },
            { title: "Responses", detail: "Participants answer in about 1–3 minutes.", icon: PatternIcon },
            { title: "Why", detail: "Collect the explanations behind the answers.", icon: ExploreIcon },
            { title: "Evidence", detail: "Review findings with context attached.", icon: InsightIcon },
            { title: "Decision Brief", detail: "Package it into something usable.", icon: ResearchIcon },
          ]}
        />
      </div>
    </section>
  );
}

/** Section 03 — the Ask Why distinction. */
export function AskWhySection() {
  return (
    <section aria-labelledby="ask-why-heading" className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <SectionHeading
        id="ask-why-heading"
        eyebrow="Ask Why"
        title="“64% said yes.” Is only half the answer."
        description="A percentage tells you what happened. PeoplePulse keeps asking until you understand why — pairing every quantitative response with the qualitative explanation behind it."
      />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-6">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Response</p>
          <p className="mt-2 text-4xl font-extrabold tracking-tight">64%</p>
          <p className="mt-1 text-sm text-slate-600">of respondents selected “Yes”.</p>
        </div>
        <div className="rounded-2xl border border-ink bg-ink p-6 text-slate-200">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-teal-300">
            Explanation
          </p>
          <p className="mt-2 text-xl font-bold text-white">Why did they say yes?</p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-300">
            <li>“It fits the routine I already have.”</li>
            <li>“The price finally makes sense for students.”</li>
          </ul>
          <p className="mt-3 text-xs text-slate-400">Illustrative example responses.</p>
        </div>
      </div>
      <ol className="mt-4 grid gap-4 sm:grid-cols-4">
        {(
          [
            { icon: PulseIcon, title: "Response", detail: "What people selected." },
            { icon: ExploreIcon, title: "Explanation", detail: "Why they selected it, in their words." },
            { icon: PatternIcon, title: "Pattern", detail: "What repeats across explanations." },
            { icon: InsightIcon, title: "Evidence", detail: "Pattern plus context and limitations." },
          ] satisfies { icon: ComponentType<BrandIconProps>; title: string; detail: string }[]
        ).map(({ icon: Icon, title, detail }) => (
          <li key={title} className="rounded-2xl border border-border bg-white p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-paper text-signal-teal">
              <Icon size={18} />
            </span>
            <h3 className="mt-2.5 text-sm font-bold">{title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">{detail}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Section 05 — Decision Brief example (PRD §8.15 structure, illustrative). */
export function DecisionBriefSection({ children }: { children?: ReactNode }) {
  return (
    <section
      aria-labelledby="brief-heading"
      className="border-y border-border bg-white"
    >
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <SectionHeading
          id="brief-heading"
          eyebrow="Decision Brief"
          title="Responses become something you can decide with."
          description="The flagship output: a modern editorial research document that keeps findings, explanations, surprises, and uncertainties in one place."
        />
        {children}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            ["What we found", "The major quantitative findings, stated plainly."],
            ["Why people said it", "The qualitative explanations behind the numbers."],
            ["What surprised us", "Findings nobody on the team predicted."],
            ["What remains uncertain", "Questions the research did not answer."],
            ["What to investigate next", "Recommended next research questions."],
          ].map(([title, detail]) => (
            <article key={title} className="rounded-2xl border border-border bg-paper p-5">
              <h3 className="text-[15px] font-bold">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{detail}</p>
            </article>
          ))}
        </div>
        <p className="mt-4 flex gap-2 border-l-[3px] border-warning pl-3 text-xs leading-relaxed text-muted">
          <TrustIcon size={16} className="mt-0.5 text-muted" />
          <span>
            Illustrative structure. A real brief always carries its evidence limitations alongside
            its findings.
          </span>
        </p>
      </div>
    </section>
  );
}

/** Section 06 — audiences, editorial and logo-wall free. */
export function AudiencesSection() {
  const audiences = [
    "Founders",
    "Researchers",
    "Creators",
    "Product teams",
    "Students",
    "Educators",
    "Organizations",
  ];
  return (
    <section aria-labelledby="audiences-heading" className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <SectionHeading
        id="audiences-heading"
        eyebrow="Who it is for"
        title="People who need evidence before making a decision."
        description="A behavioral persona, not a job title — anyone deciding something that involves other people."
      />
      <ul className="mt-8 flex flex-wrap gap-2.5">
        {audiences.map((audience) => (
          <li
            key={audience}
            className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold"
          >
            {audience}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Section 07 — final CTA. */
export function FinalCtaSection() {
  return (
    <section aria-labelledby="final-cta-heading" className="bg-ink text-white">
      <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <h2
          id="final-cta-heading"
          className="mx-auto max-w-[22ch] text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl"
        >
          Don’t guess what people think. Ask. Understand. Decide.
        </h2>
        <p className="mx-auto mt-4 max-w-[55ch] text-sm leading-relaxed text-slate-300 sm:text-base">
          Create an account, run a short Pulse, and see what the people affected by your
          decision actually tell you.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/sign-up"
            className="flex min-h-[44px] w-full items-center justify-center rounded-lg border border-pulse-dark bg-pulse px-6 text-[15px] font-bold text-white shadow-md shadow-pulse/30 hover:bg-pulse-dark sm:w-auto"
          >
            Start a Pulse
          </Link>
          <Link
            href="/sign-in"
            className="flex min-h-[44px] w-full items-center justify-center rounded-lg border border-slate-600 bg-transparent px-6 text-[15px] font-semibold text-white hover:border-slate-400 sm:w-auto"
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}
