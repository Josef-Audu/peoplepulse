import type { Metadata } from "next";
import Link from "next/link";
import { listProjects } from "@/lib/peoplepulse/actions";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProjectCard } from "@/components/pulse/ProjectCard";

export const metadata: Metadata = { title: "Research — PeoplePulse" };
export const dynamic = "force-dynamic";

export default async function ResearchPage() {
  let projects: Awaited<ReturnType<typeof listProjects>> = [];
  try {
    projects = await listProjects();
  } catch {
    projects = [];
  }

  return (
    <>
      <PageHeader
        eyebrow="Research"
        title="Research projects"
        description="Each project starts from a decision, records its assumptions, and defines the audience who can provide evidence."
        actions={
          <Link
            href="/research/new"
            className="flex min-h-[44px] items-center justify-center rounded-lg border border-pulse-dark bg-pulse px-6 text-[15px] font-bold text-white hover:bg-pulse-dark"
          >
            + New Research Project
          </Link>
        }
      />
      {projects.length === 0 ? (
        <EmptyState
          title="Nothing here yet"
          description="Create a research project to define your decision, assumption, and audience."
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
