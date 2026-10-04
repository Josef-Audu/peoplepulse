/**
 * Whether Supabase is configured in this environment (names checked, values never logged).
 * Guards server code so the scaffold stays buildable and runnable credential-free:
 * unconfigured environments simply have no session.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
