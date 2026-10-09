"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  forgotPasswordSchema,
  normalizeEmail,
  type ForgotPasswordValues,
} from "@/lib/auth/validation";
import { AuthServiceNotConfiguredError, toHumanAuthError } from "@/lib/auth/errors";
import { AuthField } from "@/components/auth/Field";

/**
 * Password-reset request: email only. Uses Supabase's reset-email mechanism
 * with an origin-derived return to our PKCE callback (`?next=/reset-password`).
 *
 * Enumeration-safe by design: success always renders the same neutral state
 * regardless of whether the address has an account, and error copy never
 * reveals account existence.
 */
export function ForgotPasswordForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [requested, setRequested] = useState(false);
  const configured = isSupabaseConfigured();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordValues) {
    setFormError(null);
    if (!isSupabaseConfigured()) {
      setFormError(toHumanAuthError(new AuthServiceNotConfiguredError()));
      return;
    }
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(
        normalizeEmail(values.email),
        {
          // Recovery links return to our callback, which establishes the
          // recovery session and forwards to /reset-password. Origin-derived —
          // no hardcoded domain. Must be allowlisted as <origin>/auth/callback
          // in Supabase Dashboard → Authentication → URL Configuration
          // (same entry already required by the verification flow).
          redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
        }
      );
      if (error) {
        setFormError(toHumanAuthError(error));
        return;
      }
      setRequested(true);
    } catch (err) {
      setFormError(toHumanAuthError(err));
    }
  }

  if (requested) {
    return (
      <p
        role="status"
        className="rounded-lg border border-signal-teal/30 bg-signal-teal/10 px-4 py-3 text-sm leading-relaxed text-ink"
      >
        <strong className="font-semibold">Check your email for reset instructions.</strong>{" "}
        If an account exists for this email, we&apos;ve sent password reset instructions. Open
        the link to choose a new password.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {!configured ? (
        <p
          role="status"
          className="mb-4 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm leading-relaxed text-ink"
        >
          <strong className="font-semibold">Password reset is unavailable right now.</strong> The
          sign-in service has not been configured yet — submitting this form cannot send a reset
          email.
        </p>
      ) : null}
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
      <div className="space-y-4">
        <AuthField
          id="forgot-email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 flex min-h-[44px] w-full items-center justify-center rounded-lg border border-pulse-dark bg-pulse px-4 text-[15px] font-bold text-white shadow-md shadow-pulse/30 hover:bg-pulse-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Sending…" : "Send reset instructions"}
      </button>
    </form>
  );
}
