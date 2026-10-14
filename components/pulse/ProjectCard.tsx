import Link from "next/link";
import type { ProjectCardData } from "@/lib/peoplepulse/types";

const STATUS_STYLE: Record<string, string> = {
  draft: "border-slate-300 bg-slate-100 text-slate-600",
  open: "border-signal-teal/30 bg-signal-teal/10 text-signal-teal",
  closed: "border-border bg-white text-muted",
};

/** Creator project card: title, decision, status, response count, Open. */
export function ProjectCard({ project }: { project: ProjectCardData }) {
  return (
    <article className="flex flex-col rounded-2xl border border-border bg-white p-6 shadow-[0_10px_30px_rgba(23,33,43,0.06)]">
      <div className="flex flex-wrap items-center gap-2">
        {project.pulseStatus ? (
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.08em] ${STATUS_STYLE[project.pulseStatus]}`}
          >
            Pulse {project.pulseStatus}
          </span>
        ) : (
          <span className="rounded-full border border-dashed border-slate-300 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
            No pulse yet
          </span>
        )}
        <span className="text-xs font-semibold text-muted">
          {project.responseCount} {project.responseCount === 1 ? "response" : "responses"}
        </span>
      </div>
      <h2 className="mt-3 text-xl font-extrabold tracking-tight">{project.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        <strong className="font-semibold text-ink">Decision: </strong>
        {project.decision}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={`/research/${project.id}`}
          className="flex min-h-[44px] items-center justify-center rounded-lg border border-pulse-dark bg-pulse px-5 text-sm font-bold text-white hover:bg-pulse-dark"
        >
          Open
        </Link>
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
    </article>
  );
}
