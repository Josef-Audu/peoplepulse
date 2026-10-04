import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Settings — PeoplePulse" };

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Preferences, data controls, and account management — including deletion and export."
      />
      <EmptyState
        title="Nothing to configure yet"
        description="Settings arrive with authentication in Phase 1."
      />
    </>
  );
}
