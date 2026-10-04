import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server Supabase client (plan AD-3): SSR cookie-based sessions.
 * For Server Components / Server Actions / Route Handlers only.
 * Uses the anon key; the service-role key must never appear here or in any
 * client-reachable module (see .env.example server-only rule).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component: cookies are read-only there.
            // Middleware refreshes the session; this path only reads it.
          }
        },
      },
    }
  );
}
