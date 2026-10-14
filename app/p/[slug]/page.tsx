import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicPulse } from "@/lib/peoplepulse/actions";
import { ParticipantFlow } from "@/components/pulse/ParticipantFlow";
import { PeoplePulseLogo } from "@/components/brand/PeoplePulseLogo";

export const metadata: Metadata = { title: "Pulse — PeoplePulse" };
export const dynamic = "force-dynamic";

export default async function PublicPulsePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const target = await getPublicPulse(slug).catch(() => null);
  if (!target || target.pulse.questions.length === 0) notFound();
  const { pulse, projectTitle, audience } = target;

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3 sm:px-6">
          <PeoplePulseLogo variant="compact" />
          <span className="rounded-full border border-signal-teal/30 bg-signal-teal/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-signal-teal">
            Anonymous Pulse
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10">
        <ParticipantFlow
          slug={pulse.public_slug}
          pulseTitle={pulse.title}
          description={pulse.description ?? ""}
          projectTitle={projectTitle}
          audience={audience}
          questions={pulse.questions}
        />
        <p className="mt-6 text-center text-xs leading-relaxed text-muted">
          Your answers are anonymous and reported only as grouped evidence with context.{" "}
          <Link href="/" className="font-semibold text-pulse hover:text-pulse-dark">
            What is PeoplePulse?
          </Link>
        </p>
      </main>
    </div>
  );
}
