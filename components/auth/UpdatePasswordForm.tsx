"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  updatePasswordSchema,
  type UpdatePasswordValues,
} from "@/lib/auth/validation";
import { AuthServiceNotConfiguredError, toHumanAuthError } from "@/lib/auth/errors";
import { AuthField } from "@/components/auth/Field";

/**
 * New-password form for the recovery flow. Reachable only with a live
 * server session (the page server-gates on getUser before rendering this).
 * On success the recovery session is signed out so the user deliberately
 * signs in again with the new password — no confusing auto-signed-in state.
 * Passwords travel only to the Supabase Auth API; nothing is logged.
 */
export function UpdatePasswordForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [updated, setUpdated] = useState(false);
  const configured = isSupabaseConfigured();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(values: UpdatePasswordValues) {
    setFormError(null);
    if (!isSupabaseConfigured()) {
      setFormError(toHumanAuthError(new AuthServiceNotConfiguredError()));
      return;
    }
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: values.password });
      if (error) {
        setFormError(toHumanAuthError(error));
        return;
      }
      // End the recovery session: the confirmation below routes the user to
      // the normal sign-in page for a deliberate fresh sign-in.
      await supabase.auth.signOut();
      setUpdated(true);
    } catch (err) {
      setFormError(toHumanAuthError(err));
    }
  }

  if (updated) {
    return (
      <div>
        <p
          role="status"
          className="rounded-lg border border-signal-teal/30 bg-signal-teal/10 px-4 py-3 text-sm leading-relaxed text-ink"
        >
          <strong className="font-semibold">Password updated.</strong> Your PeoplePulse password
          has been changed successfully.
        </p>
        <Link
          href="/sign-in"
          className="mt-4 flex min-h-[44px] items-center justify-center rounded-lg border border-pulse-dark bg-pulse px-4 text-sm font-bold text-white hover:bg-pulse-dark"
        >
          Sign in
        </Link>
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
          <strong className="font-semibold">Password update is unavailable right now.</strong> The
          sign-in service has not been configured yet.
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
          id="reset-password"
          label="New password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          error={errors.password?.message}
          {...register("password")}
        />
        <AuthField
          id="reset-confirm"
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat your new password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 flex min-h-[44px] w-full items-center justify-center rounded-lg border border-pulse-dark bg-pulse px-4 text-[15px] font-bold text-white shadow-md shadow-pulse/30 hover:bg-pulse-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Updating password…" : "Update password"}
      </button>
    </form>
  );
}
