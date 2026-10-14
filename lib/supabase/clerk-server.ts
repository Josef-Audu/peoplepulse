import { auth } from "@clerk/nextjs/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Server Supabase client authenticated with the Clerk session token
 * (Third-Party Auth). Per-request instance: the token is resolved from the
 * active Clerk session and supplied via accessToken(). No Supabase Auth
 * cookies are read or written. Never log the token.
 */
export async function createClerkSupabaseClient() {
  const { getToken } = await auth();
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
