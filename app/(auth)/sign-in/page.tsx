import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { SignInForm } from "@/components/auth/SignInForm";

export const metadata: Metadata = { title: "Sign in — PeoplePulse" };

/**
 * Real sign-in (Phase 1B). The form reads ?redirectedFrom=… via search params,
 * so it renders inside a Suspense boundary for static prerendering.
 */
export default function SignInPage() {
  return (
    <AuthCard
      headingId="sign-in-heading"
      title="Sign in"
      description="Welcome back. Sign in to continue to your research."
    >
      <Suspense fallback={<p className="text-sm text-muted">Loading sign-in…</p>}>
        <SignInForm />
      </Suspense>
    </AuthCard>
  );
}
