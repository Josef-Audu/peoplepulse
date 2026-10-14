"use client";

import { useAuth } from "@clerk/nextjs";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client authenticated with the Clerk session token
 * (Third-Party Auth). No Supabase Auth cookies, no JWT templates, no shared
 * secrets — the Clerk session is the single identity. Tokens are never
 * logged or stored; the callback supplies them per request.
 */
export function createClerkSupabaseClient(getToken: () => Promise<string | null>) {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      async accessToken() {
        return getToken();
      },
    }
  );
}

/**
 * React hook: Supabase client bound to the active Clerk session.
 * Returns null when signed out (callers must handle the signed-out state;
 * never fall back to an unauthenticated data client for private data).
 */
export function useClerkSupabaseClient() {
  const { getToken, isSignedIn } = useAuth();
  if (!isSignedIn) return null;
  return createClerkSupabaseClient(() => getToken());
}
