"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  resendSchema,
  normalizeEmail,
  type ResendValues,
} from "@/lib/auth/validation";
import { AuthServiceNotConfiguredError, toHumanAuthError } from "@/lib/auth/errors";
import { AuthField } from "@/components/auth/Field";

export type ResendVerificationFormProps = {
  /** Prefill when the account email is already known (signup confirmation, failed sign-in). */
  initialEmail?: string;
  /** Optional heading override for contextual placement. */
  title?: string;
  /** Used to keep element ids unique when several instances share a page. */
  idPrefix?: string;
};

/**
 * Resend signup-verification email via Supabase Auth (`auth.resend` type signup).
 * - Validates + normalizes email with the shared Zod conventions.
 * - Disables submit while a request is in flight to prevent double-submits.
 * - Success means Supabase accepted the request, not confirmed delivery —
 *   the copy says so explicitly.
 * - Raw Supabase internals never reach the UI (see lib/auth/errors).
 */
export function ResendVerificationForm({
  initialEmail = "",
  title = "Request a new verification email",
  idPrefix = "resend",
}: ResendVerificationFormProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResendValues>({
    resolver: zodResolver(resendSchema),
    defaultValues: { email: initialEmail },
  });

  // Keep the prefilled email in sync when the parent learns it after mount
  // (e.g. failed sign-in reveals an unverified address). Reset only when the
  // prop actually changes to avoid wiping user typing.
  useEffect(() => {
    reset({ email: initialEmail });
  }, [initialEmail, reset]);

  async function onSubmit(values: ResendValues) {
    setFormError(null);
    setAccepted(false);
    if (!isSupabaseConfigured()) {
      setFormError(toHumanAuthError(new AuthServiceNotConfiguredError()));
      return;
    }
    try {
      const supabase = createClient();
      const email = normalizeEmail(values.email);
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          // Keep verification links on our PKCE callback. Origin-derived —
          // no hardcoded domain. Must be allowlisted as <origin>/auth/callback
          // in Supabase Dashboard → Authentication → URL Configuration.
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setFormError(toHumanAuthError(error));
        return;
      }
      setAccepted(true);
    } catch (err) {
      setFormError(toHumanAuthError(err));
    }
  }

  if (accepted) {
    return (
      <div>
        <p
          role="status"
          className="rounded-lg border border-signal-teal/30 bg-signal-teal/10 px-4 py-3 text-sm leading-relaxed text-ink"
        >
          <strong className="font-semibold">Request received.</strong> If an
          unverified account exists for that email, a new verification link is
          on its way. Check your inbox and spam folder. Delivery is handled by
          the email provider, so a new message can take a few minutes to arrive.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 border-t border-border pt-6">
      <h2 className="text-sm font-bold text-ink">{title}</h2>
      <p className="mt-1 text-sm leading-relaxed text-slate-600">
        Enter the email you signed up with. Verification links expire and can
        only be used once.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4">
        {formError ? (
          <p
            role="alert"
            className="mb-4 rounded-lg border border-error/40 bg-error/5 px-4 py-3 text-sm font-medium text-error"
          >
            <span aria-hidden="true" className="mr-1 font-bold">
              !
            </span>
            {formError}
          </p>
        ) : null}
        <AuthField
          id={`${idPrefix}-email`}
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 flex min-h-[44px] w-full items-center justify-center rounded-lg border border-pulse-dark bg-pulse px-4 text-[15px] font-bold text-white shadow-md shadow-pulse/30 hover:bg-pulse-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Sending…" : "Resend verification email"}
        </button>
      </form>
    </div>
  );
}
