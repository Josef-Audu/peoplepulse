import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSafeRedirectTarget } from "@/lib/auth/redirect";

/**
 * Supabase email-verification + password-recovery callback (PKCE code
 * exchange), handled server-side with SSR cookies — no tokens in URLs,
 * no localStorage, no service role.
 *
 * - ?code=… valid, no ?next=… → /auth/verified?status=ok (legacy verify flow)
 * - ?code=… valid, ?next=/reset-password → the validated next destination
 *   (recovery flow; `next` must be a safe internal path — open redirects
 *   are impossible by construction via getSafeRedirectTarget)
 * - missing / invalid / expired / already-used code, or Supabase error →
 *   /auth/verified?status=invalid
 *
 * Controlled status enum only: raw Supabase errors never leave the server.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const invalidUrl = new URL("/auth/verified?status=invalid", requestUrl.origin);
  const successUrl = new URL("/auth/verified?status=ok", requestUrl.origin);

  if (!code) {
    return NextResponse.redirect(invalidUrl);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) {
    return NextResponse.redirect(invalidUrl);
  }

  // Optional recovery destination (e.g. /reset-password). Falls back to the
  // legacy verified page when absent; an unsafe value can never redirect
  // off-site because getSafeRedirectTarget only returns internal paths.
  const nextParam = requestUrl.searchParams.get("next");
  const hasNext = nextParam !== null;
  const nextTarget = hasNext ? getSafeRedirectTarget(nextParam) : null;
  const nextUrl = nextTarget ? new URL(nextTarget, requestUrl.origin) : null;
  let response = NextResponse.redirect(nextUrl ?? successUrl);
  const supabase = createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.redirect(nextUrl ?? successUrl);
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(invalidUrl);
  }
  return response;
}
