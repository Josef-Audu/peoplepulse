/**
 * Categorized authentication failures → concise human-readable messages.
 *
 * - Raw Supabase internals, stack traces, tokens, environment values, database
 *   details, and service-role information are never shown to users.
 * - Nothing sensitive is logged: no passwords, tokens, payloads, or secrets.
 */
export class AuthServiceNotConfiguredError extends Error {
  constructor() {
    super("auth-service-not-configured");
    this.name = "AuthServiceNotConfiguredError";
  }
}

export function toHumanAuthError(error: unknown): string {
  if (error instanceof AuthServiceNotConfiguredError) {
    return (
      "Authentication is temporarily unavailable because the sign-in service " +
      "has not been configured. Try again later."
    );
  }

  const message = error instanceof Error ? error.message : "";

  if (/user already registered/i.test(message)) {
    return "An account with this email already exists. Try signing in instead.";
  }
  if (/invalid login credentials/i.test(message)) {
    return "That email and password did not match. Check both and try again.";
  }
  if (/email not confirmed/i.test(message)) {
    return "This email has not been verified yet. Verify your email before signing in — check your inbox for the confirmation link, or request a new verification email below.";
  }
  if (/already confirmed|already verified|already been verified/i.test(message)) {
    return "This email is already verified. Try signing in instead.";
  }
  if (/invalid.*email|email.*invalid|must be a valid email/i.test(message)) {
    return "Enter a valid email address.";
  }
  if (/password should be|weak password|password.*short|at least \d+ characters/i.test(message)) {
    return "That password does not meet the requirements. Use at least 8 characters.";
  }
  if (/rate limit|too many requests|over (email|request|rate).*quota|request rate/i.test(message)) {
    return "Too many attempts. Wait a moment and try again.";
  }
  if (/failed to fetch|networkerror|network request failed|load failed|timeout|aborterror/i.test(message)) {
    return "Could not reach the sign-in service. Check your connection and try again.";
  }
  return "Something went wrong. Try again in a moment.";
}
