import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Profile — PeoplePulse" };

export default function ProfilePage() {
  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="Who you are as a decision maker — and, separately, how you participate in other people's research."
      />
      <EmptyState
        title="Sign-in required"
        description="Authentication and profiles arrive in Phase 1. No accounts exist in this shell."
      />
    </>
  );
}
