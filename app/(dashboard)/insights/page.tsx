import type { Metadata } from "next";
import Link from "next/link";
import { listProjects } from "@/lib/peoplepulse/actions";
import { getResults } from "@/lib/peoplepulse/actions";
import { computeStats } from "@/lib/peoplepulse/stats";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { EvidenceCard } from "@/components/evidence/EvidenceCard";

export const metadata: Metadata = { title: "Insights — PeoplePulse" };
export const dynamic = "force-dynamic";

/** Live evidence overview: one bounded card per project with real responses. */
export default async function InsightsPage() {
  let projects: Awaited<ReturnType<typeof listProjects>> = [];
  try {
    projects = await listProjects();
  } catch {
    projects = [];
  }
  const withEvidence = projects.filter((p) => p.responseCount > 0);

  const cards: { title: string; audience: string; count: number; share: number; finding: string; id: string }[] = [];
  for (const p of withEvidence.slice(0, 6)) {
    try {
      const r = await getResults(p.id);
      if (!r.pulse) continue;
      const stats = computeStats(r.pulse.questions, r.responses);
      if (stats.topChoice && stats.topOption) {
        cards.push({
          id: p.id,
          title: p.title,
          audience: p.audience,
          count: stats.total,
          share: stats.topOption.share,
          finding: `selected “${stats.topOption.label}” — ${stats.topChoice.prompt}`,
        });
      } else {
        cards.push({
          id: p.id,
          title: p.title,
          audience: p.audience,
          count: stats.total,
          share: 100,
          finding: `shared written evidence — ${r.pulse.questions.length} questions answered`,
        });
      }
    } catch {
      /* skip projects whose results fail to load */
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Insights"
        description="Findings with context, qualitative explanations from Ask Why, and Decision Briefs — structured evidence, not raw polls."
      />
      {cards.length === 0 ? (
        <EmptyState
          title="No insights yet"
          description="Publish a Pulse and gather responses — bounded findings with evidence context will appear here."
          action={
            <Link
              href="/dashboard"
              className="flex min-h-[44px] items-center justify-center rounded-lg border border-pulse-dark bg-pulse px-6 text-sm font-bold text-white hover:bg-pulse-dark"
            >
              Go to dashboard
            </Link>
          }
        />
      ) : (
        <div className="grid items-start gap-4 lg:grid-cols-2">
          {cards.map((c) => (
            <div key={c.id} className="grid gap-3">
              <EvidenceCard
                percentage={c.share}
                finding={`of respondents ${c.finding}`}
                participantCount={c.count}
                audience={c.audience}
                collectionPeriod="This Pulse · live collection"
                statusLabel="Early signal"
                limitation="Self-selected sample"
              />
              <Link
                href={`/research/${c.id}/brief`}
                className="flex min-h-[44px] items-center justify-center rounded-lg border border-border bg-white px-5 text-sm font-semibold text-ink hover:border-slate-400"
              >
                Open Decision Brief — {c.title}
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
