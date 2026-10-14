import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Clerk session middleware (post-migration). Single session system —
 * the Supabase cookie-refresh middleware is retired, not run in parallel.
 *
 * Explicit public allowlist; everything else requires a session.
 * Legacy Supabase Auth routes (/forgot-password, /reset-password,
 * /auth/callback, /auth/verified) stay public ONLY until Clerk
 * verification/recovery flows are confirmed, then they are retired.
 */
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/p/(.*)",
  "/forgot-password(.*)",
  "/reset-password(.*)",
  "/auth/callback(.*)",
  "/auth/verified(.*)",
  // Dev-only Clerk→Supabase acceptance probe (deleted before any commit).
  "/api/clerk-token-check(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (isPublicRoute(request)) return;
  // Demo-day hardening: explicit redirect instead of auth.protect().
  // protect() answers cookie-less dev-key requests with an internal
  // Clerk rewrite that resolves to a 404; a plain redirect sends every
  // fresh browser (and the installed PWA) to sign-in, where Clerk's
  // client completes its handshake and session creation.
  const { userId } = await auth();
  if (!userId) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect_url", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
