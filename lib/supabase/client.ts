import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client (plan AD-3).
 * Public URL + anon key only — never a service-role key. Safe for "use client" modules.
 * No credentials are hardcoded; values come from environment at runtime.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
