import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { ResendVerificationForm } from "@/components/auth/ResendVerificationForm";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Email verification — PeoplePulse" };

// Never cache a verification outcome: success must reflect the live server
// session, not a stale prerender.
export const dynamic = "force-dynamic";

export type VerifiedPageProps = {
  searchParams: Promise<{ status?: string }>;
};

/**
 * Verification landing page.
 *
 * Server-validated only: `?status=ok` alone never renders success. Success
 * requires BOTH the callback's `status=ok` AND a live server session whose
 * email is confirmed (set by the PKCE `exchangeCodeForSession` in
 * `app/auth/callback/route.ts`). Visiting `/auth/verified?status=ok` without
 * that session renders the invalid branch — query parameters cannot fabricate
 * verification, and this page never links to or grants dashboard access.
 *
 * Success shows confirmation text only (no sign-in button, no auto-redirect):
 * the user signs in later from the normal sign-in page.
 */
export default async function VerifiedPage({ searchParams }: VerifiedPageProps) {
  const { status } = await searchParams;

  let verifiedUser = false;
  if (status === "ok" && isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      verifiedUser = Boolean(
        data.user?.email_confirmed_at ?? (data.user as { confirmed_at?: string } | null)?.confirmed_at
      );
    } catch {
      verifiedUser = false;
    }
  }

  const ok = status === "ok" && verifiedUser;

  return (
    <AuthCard
      headingId="verified-heading"
      title={ok ? "Email verified" : "Verification link invalid"}
      description={
        ok
          ? "Your PeoplePulse email has been successfully verified. Your account is ready."
          : "This verification link is invalid or has expired. Verification links can only be used once."
      }
    >
      {ok ? (
        <div>
          <p
            role="status"
            className="rounded-lg border border-signal-teal/30 bg-signal-teal/10 px-4 py-3 text-sm leading-relaxed text-ink"
          >
            <strong className="font-semibold">You are verified.</strong> Your email is
            confirmed. When you&apos;re ready, go to the normal sign-in page and sign in
            with your email and password.
          </p>
        </div>
      ) : (
        <div>
          <p
            role="alert"
            className="rounded-lg border border-error/40 bg-error/5 px-4 py-3 text-sm font-medium text-error"
          >
            <span aria-hidden="true" className="mr-1 font-bold">
              !
            </span>
            This link didn&apos;t verify an account. Request a new verification email below.
            If your email is already verified, use the normal sign-in page.
          </p>
          <div className="mt-4">
            <ResendVerificationForm idPrefix="verified-resend" />
          </div>
        </div>
      )}
    </AuthCard>
  );
}
