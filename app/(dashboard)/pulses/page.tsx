import type { Metadata } from "next";
import Link from "next/link";
import { listPulses } from "@/lib/peoplepulse/actions";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { CopyLinkButton } from "@/components/pulse/CopyLinkButton";

export const metadata: Metadata = { title: "Pulses — PeoplePulse" };
export const dynamic = "force-dynamic";

export default async function PulsesPage() {
  let pulses: Awaited<ReturnType<typeof listPulses>> = [];
  try {
    pulses = await listPulses();
  } catch {
    pulses = [];
  }

  return (
    <>
      <PageHeader
        eyebrow="Pulses"
        title="Pulses"
        description="A Pulse is a short research instrument — a few questions, about 1–3 minutes to complete."
      />
      {pulses.length === 0 ? (
        <EmptyState
          title="No Pulses yet"
          description="Create a research project first, then build its Pulse — it will appear here with its publish status."
          action={
            <Link
              href="/research/new"
              className="flex min-h-[44px] items-center justify-center rounded-lg border border-pulse-dark bg-pulse px-6 text-sm font-bold text-white hover:bg-pulse-dark"
            >
              + New Research Project
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4">
          {pulses.map(({ pulse, projectTitle, responseCount }) => (
            <article key={pulse.id} className="rounded-2xl border border-border bg-white p-6">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full border border-signal-teal/30 bg-signal-teal/10 px-2.5 py-0.5 font-bold uppercase tracking-[0.08em] text-signal-teal">
                  {pulse.status}
                </span>
                <span className="font-semibold text-muted">{projectTitle}</span>
                <span className="font-semibold text-muted">· {responseCount} responses</span>
              </div>
              <h2 className="mt-2 text-lg font-extrabold">{pulse.title}</h2>
              {pulse.status === "open" ? (
                <div className="mt-3 max-w-xl">
                  <CopyLinkButton slug={pulse.public_slug} />
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </>
  );
}
