import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject } from "@/lib/peoplepulse/actions";
import { PageHeader } from "@/components/ui/PageHeader";
import { PulseForm } from "@/components/pulse/PulseForm";

export const metadata: Metadata = { title: "Pulse builder — PeoplePulse" };
export const dynamic = "force-dynamic";

export default async function PulseBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let data: Awaited<ReturnType<typeof getProject>> | null = null;
  try {
    data = await getProject(id);
  } catch {
    notFound();
  }
  if (!data) notFound();

  return (
    <>
      <PageHeader
        eyebrow={data.project.title}
        title={data.pulse ? "Edit Pulse" : "Create Pulse"}
        description="Single choice + short text only. End with a “Why” question — explanations are the signature PeoplePulse moment."
        actions={
          <Link
            href={`/research/${id}`}
            className="flex min-h-[44px] items-center justify-center rounded-lg border border-border bg-white px-5 text-sm font-semibold text-ink hover:border-slate-400"
          >
            ← Back to project
          </Link>
        }
      />
      <div className="max-w-3xl">
        <PulseForm
          projectId={id}
          initial={
            data.pulse
              ? { title: data.pulse.title, description: data.pulse.description ?? "", questions: data.pulse.questions }
              : undefined
          }
        />
      </div>
    </>
  );
}
