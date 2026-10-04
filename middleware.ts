import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Phase 1A session architecture (plan AD-3).
 * - Refreshes Supabase auth cookies on every matched request so server
 *   components always see a current session.
 * - Protects dashboard routes server-side: unauthenticated requests redirect
 *   to /sign-in. Public routes (/, /sign-in, /sign-up) always pass through.
 * - Credential-free safe: without Supabase env configured (local scaffold),
 *   there is no session to refresh — everyone reads as signed out, protected
 *   routes redirect, public routes render. No secrets required to build or run.
 */

const PUBLIC_ROUTES = new Set(["/", "/sign-in", "/sign-up"]);

// Existing dashboard shell destinations (Phase 0B). Authenticated only.
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/research",
  "/pulses",
  "/insights",
  "/profile",
  "/settings",
];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let user: { id: string } | null = null;

  if (url && anonKey) {
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });
    const { data } = await supabase.auth.getUser();
    user = data.user;
  }

  const pathname = request.nextUrl.pathname;

  if (!user && isProtectedRoute(pathname) && !PUBLIC_ROUTES.has(pathname)) {
    const signInUrl = request.nextUrl.clone();
    signInUrl.pathname = "/sign-in";
    signInUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
