import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { SignUpForm } from "@/components/auth/SignUpForm";

export const metadata: Metadata = { title: "Sign up — PeoplePulse" };

/**
 * Real registration (Phase 1B). New accounts receive a private profile row
 * automatically via the Phase 1A signup trigger — one profile per user.
 */
export default function SignUpPage() {
  return (
    <AuthCard
      headingId="sign-up-heading"
      title="Sign up"
      description="Create your account. Your responses and research stay yours."
    >
      <Suspense fallback={<p className="text-sm text-muted">Loading sign-up…</p>}>
        <SignUpForm />
      </Suspense>
    </AuthCard>
  );
}
