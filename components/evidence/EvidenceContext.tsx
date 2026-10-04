export type EvidenceContextProps = {
  participantCount: number;
  audience: string;
  collectionPeriod: string;
  recruitmentMethod: string;
  limitations: string[];
};

/**
 * Mandatory companion to every finding (plan AD-10, PRD §8.12):
 * participant count, audience, collection period, recruitment, limitations.
 * Interpretation stays direction-only — this block carries the boundaries.
 */
export function EvidenceContext({
  participantCount,
  audience,
  collectionPeriod,
  recruitmentMethod,
  limitations,
}: EvidenceContextProps) {
  return (
    <section
      aria-label="Evidence context"
      className="rounded-2xl border border-border bg-white p-6"
    >
      <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-ink">Evidence context</h2>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-semibold">Participants</dt>
          <dd className="text-slate-600">{participantCount.toLocaleString("en-US")} respondents</dd>
        </div>
        <div>
          <dt className="font-semibold">Audience</dt>
          <dd className="text-slate-600">{audience}</dd>
        </div>
        <div>
          <dt className="font-semibold">Collection period</dt>
          <dd className="text-slate-600">{collectionPeriod}</dd>
        </div>
        <div>
          <dt className="font-semibold">Recruitment</dt>
          <dd className="text-slate-600">{recruitmentMethod}</dd>
        </div>
      </dl>
      {limitations.length > 0 ? (
        <div className="mt-4 border-l-[3px] border-warning pl-3">
          <h3 className="text-sm font-semibold">Limitations</h3>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-600">
            {limitations.map((limitation) => (
              <li key={limitation}>{limitation}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
