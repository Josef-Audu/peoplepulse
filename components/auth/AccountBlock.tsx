"use client";

import { SignOutButton } from "@/components/auth/SignOutButton";

export type AccountBlockProps = {
  /** Authenticated user's email, or null when no session is visible. */
  email: string | null;
};

/**
 * Minimal authenticated identity treatment for the dashboard shell:
 * who is signed in, plus the real sign-out action. Renders nothing when
 * no session is visible (credential-free local scaffold included).
 */
export function AccountBlock({ email }: AccountBlockProps) {
  if (!email) return null;

  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">Signed in as</p>
      <p className="mt-1 truncate text-sm font-semibold text-ink" title={email}>
        {email}
      </p>
      <div className="mt-3">
        <SignOutButton />
      </div>
    </div>
  );
}
