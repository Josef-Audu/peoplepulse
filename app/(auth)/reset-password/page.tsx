import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Reset password — PeoplePulse" };

// Never cache: the gate below must reflect the live recovery session.
export const dynamic = "force-dynamic";

/**
 * New-password screen for the recovery flow. Server-gated: without a live
 * session (established by /auth/callback from a valid recovery link),
 * arbitrary visitors get a calm invalid/expired state with a path to request
 * another reset email — updateUser is never reachable without a session.
 */
export default async function ResetPasswordPage() {
  let hasSession = false;
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      hasSession = Boolean(data.user);
    } catch {
      hasSession = false;
    }
  }

  if (!hasSession) {
    return (
      <AuthCard
        headingId="reset-invalid-heading"
        title="Reset link invalid"
        description="This password-reset link is invalid, has expired, or has already been used. Reset links can only be used once."
      >
        <p
          role="alert"
          className="rounded-lg border border-error/40 bg-error/5 px-4 py-3 text-sm font-medium text-error"
        >
          <span aria-hidden="true" className="mr-1 font-bold">
            !
          </span>
          This link can&apos;t change a password. Request another reset email below.
        </p>
        <div className="mt-4">
          <Link
            href="/forgot-password"
            className="flex min-h-[44px] items-center justify-center rounded-lg border border-pulse-dark bg-pulse px-4 text-sm font-bold text-white hover:bg-pulse-dark"
          >
            Request another reset email
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      headingId="reset-password-heading"
      title="Choose a new password"
      description="Your reset link is verified. Enter a new password below."
    >
      <Suspense fallback={<p className="text-sm text-muted">Loading password reset…</p>}>
        <UpdatePasswordForm />
      </Suspense>
    </AuthCard>
  );
}
