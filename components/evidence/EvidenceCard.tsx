export type EvidenceCardProps = {
  /** Share of respondents (0–100). Always reported as "of respondents" — never a population claim (PRD §2.4, §8.12, §15). */
  percentage: number;
  /** Observed pattern, e.g. "would consider using the service". */
  finding: string;
  participantCount: number;
  /** Who provided the evidence, e.g. "University students · 18–25". */
  audience: string;
  collectionPeriod: string;
  /** e.g. "Early signal". */
  statusLabel?: string;
  /** Sampling/methodology boundary, e.g. "Self-selected sample". */
  limitation?: string;
  /** Marks illustrative content so examples are never mistaken for findings. */
  example?: boolean;
};

/**
 * The signature PeoplePulse component: a bounded finding with its context attached.
 * Research-integrity rule is structural — this component has no prop for population
 * claims, so "64% of respondents" can never render as "64% of Nigerians".
 */
export function EvidenceCard({
  percentage,
  finding,
  participantCount,
  audience,
  collectionPeriod,
  statusLabel,
  limitation,
  example = false,
}: EvidenceCardProps) {
  return (
    <article
      aria-label={`Evidence: ${percentage}% of respondents ${finding}`}
      className="overflow-hidden rounded-2xl border border-border border-t-4 border-t-pulse bg-white shadow-[0_10px_30px_rgba(23,33,43,0.10)]"
    >
      <div className="p-6 sm:p-7">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-signal-teal">Evidence</p>
          {example ? (
            <span className="rounded-full border border-warning/40 bg-warning/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-warning">
              Example
            </span>
          ) : null}
        </div>
        <p className="text-5xl font-extrabold tracking-tight sm:text-6xl">{percentage}%</p>
        <p className="mt-2 text-base text-slate-700">{finding}</p>
        <p className="mt-4 text-sm text-muted">
          <strong className="font-semibold text-ink">
            {participantCount.toLocaleString("en-US")} participants
          </strong>
          <br />
          {audience}
        </p>
      </div>
      <footer className="flex flex-wrap items-center gap-2 border-t border-border bg-paper px-6 py-4 sm:px-7">
        {statusLabel ? (
          <span className="rounded-full border border-signal-teal/30 bg-signal-teal/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-signal-teal">
            {statusLabel}
          </span>
        ) : null}
        <p className="text-xs leading-relaxed text-muted">
          {percentage}% of respondents{limitation ? ` · ${limitation}` : ""} · {collectionPeriod}
        </p>
      </footer>
    </article>
  );
}
