import type { Metadata } from "next";
import Link from "next/link";
import { listProjects } from "@/lib/peoplepulse/actions";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProjectCard } from "@/components/pulse/ProjectCard";

export const metadata: Metadata = { title: "Overview — PeoplePulse" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let projects: Awaited<ReturnType<typeof listProjects>> = [];
  let loadError: string | null = null;
  try {
    projects = await listProjects();
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Could not load research.";
  }

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title="What are you trying to understand?"
        description="Each research project turns an assumption into structured human evidence."
        actions={
          <Link
            href="/research/new"
            className="flex min-h-[44px] items-center justify-center rounded-lg border border-pulse-dark bg-pulse px-6 text-[15px] font-bold text-white shadow-md shadow-pulse/30 hover:bg-pulse-dark"
          >
            + New Research Project
          </Link>
        }
      />
      {loadError ? (
        <p role="alert" className="rounded-lg border border-error/30 bg-error/5 px-4 py-3 text-sm font-semibold text-error">
          {loadError}
        </p>
      ) : projects.length === 0 ? (
        <EmptyState
          title="No research projects yet"
          description="Create your first research project: record the decision, the assumption, and the audience — then launch a Pulse to gather evidence."
          action={
            <Link
              href="/research/new"
              className="flex min-h-[44px] items-center justify-center rounded-lg border border-pulse-dark bg-pulse px-6 text-[15px] font-bold text-white hover:bg-pulse-dark"
            >
              + New Research Project
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </>
  );
}
