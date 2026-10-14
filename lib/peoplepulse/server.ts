import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * SERVER ONLY — never import from a "use client" module.
 * Service-role client for the TEMPORARY AUTHORIZATION FALLBACK: creator
 * reads/writes go through Server Actions that verify the Clerk session and
 * resource ownership in code (see actions.ts). The service-role key bypasses
 * RLS, so it must never carry a NEXT_PUBLIC_ prefix or reach the browser.
 */
export function getServiceClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Supabase is not configured for creator operations. " +
        "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (server-only) in .env.local."
    );
  }
  return createSupabaseClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Public (anon-key) client for logged-out participant reads/writes. */
export function getPublicClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }
  return createSupabaseClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
