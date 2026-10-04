import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Insights — PeoplePulse" };

export default function InsightsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Insights"
        description="Findings with context, qualitative explanations from Ask Why, and Decision Briefs — structured evidence, not raw polls."
      />
      <EmptyState
        title="No insights yet"
        description="Live results, findings, Ask Why, and the Decision Brief arrive in Phase 5."
      />
    </>
  );
}
