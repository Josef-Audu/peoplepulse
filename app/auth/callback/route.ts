import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Supabase email-verification callback (PKCE code exchange), handled server-side
 * with SSR cookies — no tokens in URLs, no localStorage, no service role.
 *
 * - ?code=… valid → session cookies set → /auth/verified?status=ok
 * - missing / invalid / expired / already-used code, or Supabase error →
 *   /auth/verified?status=invalid
 *
 * Controlled status enum only: raw Supabase errors never leave the server.
 * No destination parameter exists here, so no open-redirect surface is added
 * (post-verification navigation reuses the existing safe redirect utility).
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

  let response = NextResponse.redirect(successUrl);
  const supabase = createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.redirect(successUrl);
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
