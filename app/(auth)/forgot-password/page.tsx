import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = { title: "Forgot password — PeoplePulse" };

/**
 * Password-reset request (Phase 1). Email only; the form renders inside a
 * Suspense boundary matching the other auth pages.
 */
export default function ForgotPasswordPage() {
  return (
    <AuthCard
      headingId="forgot-password-heading"
      title="Forgot password"
      description="Enter the email you signed up with. If an account exists for it, we'll send reset instructions."
    >
      <Suspense fallback={<p className="text-sm text-muted">Loading password reset…</p>}>
        <ForgotPasswordForm />
      </Suspense>
    </AuthCard>
  );
}
