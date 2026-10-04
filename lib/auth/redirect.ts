const FALLBACK_TARGET = "/dashboard";

/**
 * Validate a post-auth redirect target as a safe internal application path.
 * Rejects external URLs, protocol-relative URLs, schemes (javascript:, …),
 * backslashes, and control characters — an open redirect is never possible.
 */
export function getSafeRedirectTarget(raw: string | null | undefined): string {
  if (!raw) return FALLBACK_TARGET;

  let target = raw;
  try {
    target = decodeURIComponent(raw);
  } catch {
    return FALLBACK_TARGET;
  }

  if (!target.startsWith("/")) return FALLBACK_TARGET;
  if (target.startsWith("//")) return FALLBACK_TARGET;
  if (target.includes("\\")) return FALLBACK_TARGET;
  if (/[\r\n]/.test(target)) return FALLBACK_TARGET;
  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(target)) return FALLBACK_TARGET;

  return target;
}
