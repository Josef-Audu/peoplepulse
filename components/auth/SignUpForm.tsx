"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  signUpSchema,
  normalizePhoneNumber,
  type SignUpValues,
} from "@/lib/auth/validation";
import { AuthServiceNotConfiguredError, toHumanAuthError } from "@/lib/auth/errors";
import { getSafeRedirectTarget } from "@/lib/auth/redirect";
import { AuthField } from "@/components/auth/Field";
import { ResendVerificationForm } from "@/components/auth/ResendVerificationForm";

/**
 * Registration form: full name + phone + email + password + confirm,
 * Zod-validated before submit.
 * - Passwords go only to the Supabase Auth API — never to app tables or logs.
 * - Full name / phone travel as signup user metadata and are persisted to
 *   profiles by the database trigger — never trusted as authorization, never
 *   written with elevated privileges from the browser.
 * - If the project requires email confirmation, the success-without-session
 *   branch says so honestly instead of claiming a signed-in state.
 * - If Supabase is not configured, no request is attempted: the honest
 *   service-unavailable state is shown instead of a generic auth failure.
 */
export function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const configured = isSupabaseConfigured();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { fullName: "", phoneNumber: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: SignUpValues) {
    setFormError(null);
    if (!isSupabaseConfigured()) {
      setFormError(toHumanAuthError(new AuthServiceNotConfiguredError()));
      return;
    }
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName.trim(),
            phone_number: normalizePhoneNumber(values.phoneNumber),
          },
          // Direct verification emails at our callback (not the Site URL home
          // page). Origin-derived — no hardcoded domain. The Supabase project's
          // Redirect URLs allowlist must include <origin>/auth/callback.
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setFormError(toHumanAuthError(error));
        return;
      }
      if (data.session) {
        router.push(getSafeRedirectTarget(searchParams.get("redirectedFrom")));
        router.refresh();
      } else {
        setConfirmationEmail(values.email.trim());
        setConfirmationSent(true);
      }
    } catch (err) {
      setFormError(toHumanAuthError(err));
    }
  }

  if (confirmationSent) {
    return (
      <div>
        <p
          role="status"
          className="rounded-lg border border-signal-teal/30 bg-signal-teal/10 px-4 py-3 text-sm leading-relaxed text-ink"
        >
          <strong className="font-semibold">Check your email to verify your PeoplePulse account.</strong>{" "}
          Open the confirmation link, then sign in. Your account is not fully authenticated until
          verification is completed.
        </p>
        <div className="mt-2">
          <ResendVerificationForm
            initialEmail={confirmationEmail}
            title="Didn't get the email?"
            idPrefix="signup-resend"
          />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {!configured ? (
        <p
          role="status"
          className="mb-4 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm leading-relaxed text-ink"
        >
          <strong className="font-semibold">Account creation is unavailable right now.</strong> The
          sign-in service has not been configured yet — submitting this form cannot create an account.
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
          id="signup-fullname"
          label="Full name"
          type="text"
          autoComplete="name"
          placeholder="Adaeze Okafor"
          error={errors.fullName?.message}
          {...register("fullName")}
        />
        <AuthField
          id="signup-phone"
          label="Phone number"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="+234 801 234 5678"
          error={errors.phoneNumber?.message}
          {...register("phoneNumber")}
        />
        <AuthField
          id="signup-email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <AuthField
          id="signup-password"
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          error={errors.password?.message}
          {...register("password")}
        />
        <AuthField
          id="signup-confirm"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 flex min-h-[44px] w-full items-center justify-center rounded-lg border border-pulse-dark bg-pulse px-4 text-[15px] font-bold text-white shadow-md shadow-pulse/30 hover:bg-pulse-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creating account…" : "Create account"}
      </button>
      <p className="mt-4 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-semibold text-pulse hover:text-pulse-dark">
          Sign in
        </Link>
      </p>
    </form>
  );
}
