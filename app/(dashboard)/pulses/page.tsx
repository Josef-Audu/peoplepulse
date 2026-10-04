import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Pulses — PeoplePulse" };

export default function PulsesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pulses"
        title="Pulses"
        description="A Pulse is a short research instrument — 5–10 questions, about 1–3 minutes to complete. Builder, preview, and publishing live here."
      />
      <EmptyState
        title="No Pulses yet"
        description="The Pulse Builder, participant preview, and publishing arrive in Phase 3."
      />
    </>
  );
}
