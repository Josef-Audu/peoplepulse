import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Overview — PeoplePulse" };

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title="Overview"
        description="What are you trying to understand? Active, completed, and draft research will appear here — no vanity analytics, only evidence that matters."
      />
      <EmptyState
        title="No research projects yet"
        description="Research projects arrive in Phase 2: decision, objective, assumptions, and audience first — then Pulses, responses, and findings."
      />
    </>
  );
}
