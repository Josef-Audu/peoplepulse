export type ChartDatum = {
  label: string;
  /** Raw respondent count; shares are derived, never hand-written. */
  value: number;
};

export type ChartCardProps = {
  title: string;
  description?: string;
  data: ChartDatum[];
};

const BAR_PALETTE = ["#2563EB", "#0F766E", "#94A3B8", "#60A5FA", "#2DD4BF"] as const;

/**
 * Comprehension-first distribution chart (plan AD-9): horizontal bars plus a
 * <details> data-table alternative. Bars are aria-hidden; the table is the
 * accessible source of truth, so meaning never depends on color alone —
 * every row carries a text label and a numeric share.
 */
export function ChartCard({ title, description, data }: ChartCardProps) {
  const total = data.reduce((sum, datum) => sum + datum.value, 0);
  const rows = data.map((datum) => ({
    ...datum,
    share: total > 0 ? Math.round((datum.value / total) * 100) : 0,
  }));
  const summary = rows.map((row) => `${row.label}: ${row.share}%`).join(", ");

  return (
    <section aria-label={title} className="rounded-2xl border border-border bg-white p-6">
      <h2 className="text-lg font-bold">{title}</h2>
      {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}

      <div aria-hidden="true" className="mt-5">
        {rows.map((row, index) => (
          <div key={row.label} className="my-2.5 grid grid-cols-[110px_1fr_48px] items-center gap-2.5 text-[13px] sm:grid-cols-[140px_1fr_52px]">
            <span className="truncate">{row.label}</span>
            <span className="h-3 overflow-hidden rounded-full bg-[#EEF2FF]">
              <span
                className="block h-full rounded-full"
                style={{
                  width: `${row.share}%`,
                  backgroundColor: BAR_PALETTE[index % BAR_PALETTE.length],
                }}
              />
            </span>
            <span className="text-right font-bold tabular-nums">{row.share}%</span>
          </div>
        ))}
      </div>

      <details className="mt-4 rounded-lg border border-border bg-paper px-4 py-3">
        <summary className="cursor-pointer text-sm font-semibold text-ink">
          View data as a table
        </summary>
        <p className="sr-only">{summary}</p>
        <table className="mt-3 w-full text-left text-sm">
          <caption className="pb-2 text-left text-muted">{title} — respondent counts and shares.</caption>
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="py-2 pr-4 font-semibold">
                Option
              </th>
              <th scope="col" className="py-2 pr-4 text-right font-semibold">
                Respondents
              </th>
              <th scope="col" className="py-2 text-right font-semibold">
                Share
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-border last:border-0">
                <th scope="row" className="py-2 pr-4 font-normal">
                  {row.label}
                </th>
                <td className="py-2 pr-4 text-right tabular-nums">
                  {row.value.toLocaleString("en-US")}
                </td>
                <td className="py-2 text-right font-bold tabular-nums">{row.share}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </section>
  );
}
