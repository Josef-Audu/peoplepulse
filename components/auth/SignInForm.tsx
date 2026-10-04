"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { signInSchema, normalizeEmail, type SignInValues } from "@/lib/auth/validation";
import { AuthServiceNotConfiguredError, toHumanAuthError } from "@/lib/auth/errors";
import { getSafeRedirectTarget } from "@/lib/auth/redirect";
import { AuthField } from "@/components/auth/Field";
import { ResendVerificationForm } from "@/components/auth/ResendVerificationForm";

/**
 * Sign-in form: Zod-validated, human-readable errors, safe post-login redirect.
 * Consumes middleware's ?redirectedFrom=… and falls back to /dashboard.
 * If Supabase is not configured, no request is attempted — the honest
 * service-unavailable state is shown instead of a generic auth failure.
 */
export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formError, setFormError] = useState<string | null>(null);
  const [needsVerificationEmail, setNeedsVerificationEmail] = useState<string | null>(null);
  const configured = isSupabaseConfigured();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: SignInValues) {
    setFormError(null);
    setNeedsVerificationEmail(null);
    if (!isSupabaseConfigured()) {
      setFormError(toHumanAuthError(new AuthServiceNotConfiguredError()));
      return;
    }
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) {
        setFormError(toHumanAuthError(error));
        // Unverified accounts are blocked server-side by Supabase when email
        // confirmation is enabled — offer a resend from this exact state.
        // No session is created here; protected routes stay protected.
        if (/email not confirmed/i.test(error.message)) {
          setNeedsVerificationEmail(normalizeEmail(values.email));
        }
        return;
      }
      router.push(getSafeRedirectTarget(searchParams.get("redirectedFrom")));
      router.refresh();
    } catch (err) {
      setFormError(toHumanAuthError(err));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {!configured ? (
        <p
          role="status"
          className="mb-4 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm leading-relaxed text-ink"
        >
          <strong className="font-semibold">Sign-in is unavailable right now.</strong> The sign-in
          service has not been configured yet — submitting this form cannot sign you in.
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
      {needsVerificationEmail ? (
        <div className="mb-4">
          <ResendVerificationForm
            initialEmail={needsVerificationEmail}
            title="Need another verification email?"
            idPrefix="signin-resend"
          />
        </div>
      ) : null}
      <div className="space-y-4">
        <AuthField
          id="signin-email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <AuthField
          id="signin-password"
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="Your password"
          error={errors.password?.message}
          {...register("password")}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 flex min-h-[44px] w-full items-center justify-center rounded-lg border border-pulse-dark bg-pulse px-4 text-[15px] font-bold text-white shadow-md shadow-pulse/30 hover:bg-pulse-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>
      <p className="mt-4 text-center text-sm text-slate-600">
        New to PeoplePulse?{" "}
        <Link href="/sign-up" className="font-semibold text-pulse hover:text-pulse-dark">
          Create an account
        </Link>
      </p>
    </form>
  );
}
