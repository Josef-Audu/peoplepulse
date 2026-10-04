import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Research — PeoplePulse" };

export default function ResearchPage() {
  return (
    <>
      <PageHeader
        eyebrow="Research"
        title="Research projects"
        description="Each project starts from a decision, records its assumptions, and defines the audience who can provide evidence."
      />
      <EmptyState
        title="Nothing here yet"
        description="Project creation, assumption tracking, and audience definition arrive in Phase 2."
      />
    </>
  );
}
