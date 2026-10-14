import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getResults } from "@/lib/peoplepulse/actions";
import { computeStats } from "@/lib/peoplepulse/stats";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { EvidenceContext } from "@/components/evidence/EvidenceContext";
import { ChartCard } from "@/components/evidence/ChartCard";

export const metadata: Metadata = { title: "Results — PeoplePulse" };
export const dynamic = "force-dynamic";

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let data: Awaited<ReturnType<typeof getResults>> | null = null;
  try {
    data = await getResults(id);
  } catch {
    notFound();
  }
  if (!data || !data.pulse) {
    return (
      <>
        <PageHeader eyebrow="Results" title="No results yet" />
        <EmptyState
          title="No Pulse, no evidence"
          description="Create and publish a Pulse first — results appear here once participants respond."
          action={
            <Link
              href={`/research/${id}`}
              className="flex min-h-[44px] items-center justify-center rounded-lg border border-pulse-dark bg-pulse px-6 text-sm font-bold text-white hover:bg-pulse-dark"
            >
              Back to project
            </Link>
          }
        />
      </>
    );
  }

  const { project, pulse, responses, responseCount } = data;
  const stats = computeStats(pulse.questions, responses);

  return (
    <>
      <PageHeader
        eyebrow={project.title}
        title={`${responseCount} ${responseCount === 1 ? "participant" : "participants"}`}
        description={pulse.title}
        actions={
          <>
            <Link
              href={`/research/${id}`}
              className="flex min-h-[44px] items-center justify-center rounded-lg border border-border bg-white px-5 text-sm font-semibold text-ink hover:border-slate-400"
            >
              ← Project
            </Link>
            <Link
              href={`/research/${id}/brief`}
              className="flex min-h-[44px] items-center justify-center rounded-lg border border-pulse-dark bg-pulse px-5 text-sm font-bold text-white hover:bg-pulse-dark"
            >
              Decision Brief
            </Link>
          </>
        }
      />

      {responseCount === 0 ? (
        <EmptyState
          title="Waiting for evidence"
          description="The Pulse is live. Share the public link with participants — responses will appear here."
        />
      ) : (
        <div className="grid items-start gap-4 lg:grid-cols-2">
          <div className="grid gap-4">
            {stats.choices.map((c) => (
              <ChartCard
                key={c.questionId}
                title={c.prompt}
                description={`${c.answered} of ${stats.total} respondents answered.`}
                data={c.options.map((o) => ({ label: o.label, value: o.count }))}
              />
            ))}
            {stats.choices.length === 0 ? (
              <p className="rounded-2xl border border-border bg-white p-6 text-sm text-slate-600">
                No choice questions in this Pulse — evidence below is qualitative.
              </p>
            ) : null}
          </div>

          <div className="grid gap-4">
            {/* Signature Ask Why moment */}
            {stats.topChoice && stats.topOption && stats.signatureWhy ? (
              <section aria-label="Ask Why" className="overflow-hidden rounded-2xl border border-border border-t-4 border-t-signal-teal bg-white">
                <div className="p-6">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-signal-teal">Ask Why</p>
                  <p className="mt-2 text-5xl font-extrabold tracking-tight">{stats.topOption.share}%</p>
                  <p className="mt-2 text-[15px] text-slate-700">
                    of respondents selected “{stats.topOption.label}” for “{stats.topChoice.prompt}”.
                  </p>
                  <h3 className="mt-5 text-sm font-bold uppercase tracking-[0.1em]">Why people said it</h3>
                  {stats.signatureWhy.texts.length > 0 ? (
                    <ul className="mt-2 space-y-2">
                      {stats.signatureWhy.texts.slice(0, 10).map((t, i) => (
                        <li key={i} className="rounded-lg bg-paper px-4 py-3 text-sm leading-relaxed">“{t}”</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-muted">No written explanations yet.</p>
                  )}
                </div>
              </section>
            ) : null}

            {stats.whys
              .filter((w) => w.questionId !== stats.signatureWhy?.questionId)
              .map((w) => (
                <section key={w.questionId} aria-label={w.prompt} className="rounded-2xl border border-border bg-white p-6">
                  <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-signal-teal">{w.prompt}</h2>
                  {w.texts.length > 0 ? (
                    <ul className="mt-3 space-y-2">
                      {w.texts.map((t, i) => (
                        <li key={i} className="rounded-lg bg-paper px-4 py-3 text-sm leading-relaxed">“{t}”</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-muted">No answers yet.</p>
                  )}
                </section>
              ))}

            <EvidenceContext
              participantCount={responseCount}
              audience={project.audience}
              collectionPeriod="This Pulse · live collection"
              recruitmentMethod="Self-selected sample"
              limitations={[
                `Results describe these ${responseCount} ${responseCount === 1 ? "respondent" : "respondents"} only and should not be treated as population-level truth.`,
                "Respondents chose to participate, so the sample is not representative.",
              ]}
            />
          </div>
        </div>
      )}
    </>
  );
}
