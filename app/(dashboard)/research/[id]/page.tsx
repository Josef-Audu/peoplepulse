import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, setPulseStatus } from "@/lib/peoplepulse/actions";
import { PageHeader } from "@/components/ui/PageHeader";
import { CopyLinkButton } from "@/components/pulse/CopyLinkButton";

export const metadata: Metadata = { title: "Research project — PeoplePulse" };
export const dynamic = "force-dynamic";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let data: Awaited<ReturnType<typeof getProject>> | null = null;
  try {
    data = await getProject(id);
  } catch {
    notFound();
  }
  if (!data) notFound();
  const { project, pulse, responseCount } = data;

  return (
    <>
      <PageHeader
        eyebrow="Research project"
        title={project.title}
        description={`Created ${new Date(project.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · ${responseCount} ${responseCount === 1 ? "response" : "responses"}`}
        actions={
          <Link
            href="/dashboard"
            className="flex min-h-[44px] items-center justify-center rounded-lg border border-border bg-white px-5 text-sm font-semibold text-ink hover:border-slate-400"
          >
            ← All projects
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-2xl border border-border bg-white p-6">
          <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-signal-teal">The question</h2>
          <p className="mt-2 text-[15px] leading-relaxed">{project.decision}</p>
        </section>
        <section className="rounded-2xl border border-border bg-white p-6">
          <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-signal-teal">The assumption</h2>
          <p className="mt-2 text-[15px] leading-relaxed">{project.assumption}</p>
        </section>
        <section className="rounded-2xl border border-border bg-white p-6">
          <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-signal-teal">The audience</h2>
          <p className="mt-2 text-[15px] leading-relaxed">{project.audience}</p>
        </section>
      </div>

      <section aria-label="Pulse" className="mt-4 rounded-2xl border border-border bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold">Pulse</h2>
          {pulse ? (
            <span className="rounded-full border border-signal-teal/30 bg-signal-teal/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-signal-teal">
              {pulse.status}
            </span>
          ) : null}
        </div>

        {pulse ? (
          <>
            <p className="mt-2 text-[15px] font-semibold">{pulse.title}</p>
            {pulse.description ? <p className="mt-1 text-sm text-slate-600">{pulse.description}</p> : null}
            <p className="mt-1 text-sm text-muted">{pulse.questions.length} questions · single choice + short text</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={`/research/${project.id}/pulse`}
                className="flex min-h-[44px] items-center justify-center rounded-lg border border-border bg-white px-5 text-sm font-semibold text-ink hover:border-slate-400"
              >
                Edit Pulse
              </Link>
              {pulse.status === "draft" || pulse.status === "closed" ? (
                <form action={setPulseStatus.bind(null, project.id, pulse.id, "open")}>
                  <button type="submit" className="min-h-[44px] rounded-lg border border-pulse-dark bg-pulse px-5 text-sm font-bold text-white hover:bg-pulse-dark">
                    Publish Pulse
                  </button>
                </form>
              ) : null}
              {pulse.status === "open" ? (
                <form action={setPulseStatus.bind(null, project.id, pulse.id, "closed")}>
                  <button type="submit" className="min-h-[44px] rounded-lg border border-border bg-white px-5 text-sm font-semibold text-ink hover:border-slate-400">
                    Close Pulse
                  </button>
                </form>
              ) : null}
              <Link
                href={`/research/${project.id}/results`}
                className="flex min-h-[44px] items-center justify-center rounded-lg border border-border bg-white px-5 text-sm font-semibold text-ink hover:border-slate-400"
              >
                Results
              </Link>
              <Link
                href={`/research/${project.id}/brief`}
                className="flex min-h-[44px] items-center justify-center rounded-lg border border-border bg-white px-5 text-sm font-semibold text-ink hover:border-slate-400"
              >
                Decision Brief
              </Link>
            </div>
            {pulse.status === "open" ? (
              <div className="mt-4 rounded-xl border border-signal-teal/30 bg-signal-teal/5 p-4">
                <p className="text-sm font-bold">Share this link with participants (no login needed):</p>
                <div className="mt-2">
                  <CopyLinkButton slug={pulse.public_slug} />
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted">Publish the Pulse to generate a public share link. Only OPEN Pulses accept responses.</p>
            )}
          </>
        ) : (
          <>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              No Pulse yet. Create one short instrument (3–5 questions) to start gathering evidence.
            </p>
            <div className="mt-4">
              <Link
                href={`/research/${project.id}/pulse`}
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-pulse-dark bg-pulse px-5 text-sm font-bold text-white hover:bg-pulse-dark"
              >
                Create Pulse
              </Link>
            </div>
          </>
        )}
      </section>
    </>
  );
}
