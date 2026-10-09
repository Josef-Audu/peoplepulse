import { z } from "zod";

// Phase 1B form validation (plan AD-4: Zod at the trusted boundary; client UX here,
// server re-validation arrives with mutations in later phases).

const emailField = z
  .string()
  .trim()
  .min(1, "Enter your email address.")
  .email("Enter a valid email address.");

const passwordField = z.string().min(8, "Use at least 8 characters.");

// Required. Trimmed, length-bounded, must contain at least one Unicode letter —
// Unicode names are welcome; ASCII-only restriction is deliberately avoided.
const fullNameField = z
  .string()
  .trim()
  .min(1, "Enter your full name.")
  .max(120, "Keep your name under 120 characters.")
  .refine((value) => /\p{L}/u.test(value), {
    message: "Enter a name containing at least one letter.",
  });

// Required. Validated in normalized form: optional leading +, then 7–15 digits
// (E.164 range). Never a password, never logged, stored as profile contact data.
const phoneNumberField = z
  .string()
  .trim()
  .min(1, "Enter your phone number.")
  .max(32, "That phone number looks too long.")
  .refine((value) => /^\+?[0-9]{7,15}$/.test(normalizePhoneNumber(value)), {
    message: "Enter a valid phone number, e.g. +234 801 234 5678.",
  });

/**
 * Normalize a phone number for storage: strip spaces, dashes, dots, and
 * parentheses; keep one optional leading +, digits only otherwise.
 */
export function normalizePhoneNumber(input: string): string {
  const compact = input.trim().replace(/[\s\-.()]/g, "");
  if (compact.startsWith("+")) {
    return `+${compact.slice(1).replace(/\D/g, "")}`;
  }
  return compact.replace(/\D/g, "");
}

/**
 * Normalize an email for Auth API calls: trim surrounding whitespace and
 * lowercase. Supabase treats email case-insensitively; normalizing here keeps
 * resend / sign-in lookups consistent with signup without changing validation.
 */
export function normalizeEmail(input: string): string {
  return input.trim().toLowerCase();
}

export const signUpSchema = z
  .object({
    fullName: fullNameField,
    phoneNumber: phoneNumberField,
    email: emailField,
    password: passwordField,
    confirmPassword: z.string().min(1, "Repeat your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Enter your password."),
});

export const resendSchema = z.object({
  email: emailField,
});

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export const updatePasswordSchema = z
  .object({
    password: passwordField,
    confirmPassword: z.string().min(1, "Repeat your new password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type SignUpValues = z.infer<typeof signUpSchema>;
export type SignInValues = z.infer<typeof signInSchema>;
export type ResendValues = z.infer<typeof resendSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;
