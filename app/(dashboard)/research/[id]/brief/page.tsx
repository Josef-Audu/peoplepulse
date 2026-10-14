import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getResults } from "@/lib/peoplepulse/actions";
import { computeStats } from "@/lib/peoplepulse/stats";
import { PageHeader } from "@/components/ui/PageHeader";
import { EvidenceContext } from "@/components/evidence/EvidenceContext";

export const metadata: Metadata = { title: "Decision Brief — PeoplePulse" };
export const dynamic = "force-dynamic";

function BriefSection({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-white p-6 sm:p-7">
      <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-signal-teal">{heading}</h2>
      <div className="mt-3 text-[15px] leading-relaxed">{children}</div>
    </section>
  );
}

/** Rendered Decision Brief (no PDF today): real evidence, bounded language. */
export default async function BriefPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let data: Awaited<ReturnType<typeof getResults>> | null = null;
  try {
    data = await getResults(id);
  } catch {
    notFound();
  }
  if (!data || !data.pulse) notFound();
  const { project, pulse, responses, responseCount } = data;
  const stats = computeStats(pulse.questions, responses);

  const findings =
    stats.choices.length > 0
      ? stats.choices.map((c) => {
          const top = [...c.options].sort((a, b) => b.count - a.count)[0];
          return top
            ? `${top.share}% of respondents selected “${top.label}” for “${c.prompt}”.`
            : null;
        }).filter(Boolean)
      : [];

  return (
    <>
      <PageHeader
        eyebrow="Decision Brief"
        title={project.title}
        description="Structured evidence for the decision — with its boundaries attached."
        actions={
          <Link
            href={`/research/${id}/results`}
            className="flex min-h-[44px] items-center justify-center rounded-lg border border-border bg-white px-5 text-sm font-semibold text-ink hover:border-slate-400"
          >
            ← Results
          </Link>
        }
      />

      <article className="grid max-w-3xl gap-4">
        <BriefSection heading="The question">
          <p>{project.decision}</p>
        </BriefSection>

        <BriefSection heading="The assumption">
          <p>{project.assumption}</p>
        </BriefSection>

        <BriefSection heading="The audience">
          <p>{project.audience}</p>
        </BriefSection>

        <BriefSection heading="What we found">
          {responseCount === 0 ? (
            <p className="text-slate-600">No responses yet — this brief will fill in as evidence arrives.</p>
          ) : findings.length > 0 ? (
            <ul className="list-disc space-y-2 pl-5">
              {findings.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-600">
              {responseCount} {responseCount === 1 ? "response" : "responses"} collected — qualitative evidence below.
            </p>
          )}
        </BriefSection>

        <BriefSection heading="Why people said it">
          {stats.whys.some((w) => w.texts.length > 0) ? (
            <div className="grid gap-3">
              {stats.whys.map((w) =>
                w.texts.length > 0 ? (
                  <div key={w.questionId}>
                    <p className="font-semibold">{w.prompt}</p>
                    <ul className="mt-2 space-y-2">
                      {w.texts.slice(0, 8).map((t, i) => (
                        <li key={i} className="rounded-lg bg-paper px-4 py-3 text-sm">“{t}”</li>
                      ))}
                    </ul>
                  </div>
                ) : null
              )}
            </div>
          ) : (
            <p className="text-slate-600">No written explanations yet.</p>
          )}
        </BriefSection>

        <BriefSection heading="What remains uncertain">
          <p>This research is an early signal and does not answer every question.</p>
        </BriefSection>

        <BriefSection heading="Evidence limitations">
          <EvidenceContext
            participantCount={responseCount}
            audience={project.audience}
            collectionPeriod="This Pulse · live collection"
            recruitmentMethod="Self-selected sample"
            limitations={[
              `Results describe these ${responseCount} ${responseCount === 1 ? "respondent" : "respondents"} only and should not be treated as population-level truth.`,
            ]}
          />
        </BriefSection>

        <BriefSection heading="What to investigate next">
          <p>
            {responseCount < 30
              ? "Grow the respondent group and re-check whether the pattern holds before committing resources."
              : "Pressure-test the leading finding with a follow-up Pulse on price sensitivity and deal-breakers."}
          </p>
        </BriefSection>

        <p className="rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-xs leading-relaxed text-ink">
          Status: EARLY SIGNAL · Recruitment: self-selected sample · Limitation: results describe this
          respondent group and should not be treated as population-level truth.
        </p>
      </article>
    </>
  );
}
