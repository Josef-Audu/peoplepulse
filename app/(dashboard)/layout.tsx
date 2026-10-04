import type { ReactNode } from "react";
import { DashboardNav } from "@/components/layout/DashboardNav";
import { Wordmark } from "@/components/layout/SiteHeader";
import { AccountBlock } from "@/components/auth/AccountBlock";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

/**
 * Dashboard foundation shell (Phase 0B) + minimal authenticated identity (Phase 1B):
 * responsive sidebar navigation, account indicator with real sign-out, content area.
 * Destination pages remain honest placeholders — research functionality is Phase 2+.
 */
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // Credential-free safe: without Supabase configured there is no session to read.
  let email: string | null = null;
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    email = data.user?.email ?? null;
  }
  return (
    <div className="min-h-screen bg-paper">
      <a
        href="#dashboard-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-20 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
      >
        Skip to content
      </a>

      <div className="border-b border-border bg-white md:hidden">
        <div className="flex items-center justify-between gap-4 px-4 py-2">
          <Wordmark />
          <span className="rounded-full border border-signal-teal/30 bg-signal-teal/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-signal-teal">
            Shell
          </span>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl gap-8 px-4 sm:px-6">
        <aside className="hidden w-60 shrink-0 py-8 md:block">
          <div className="sticky top-8">
            <Wordmark />
            <div className="mt-6">
              <DashboardNav />
            </div>
            <p className="mt-6 rounded-xl border border-border bg-white p-4 text-xs leading-relaxed text-muted">
              Phase 0B shell. Navigation destinations exist as placeholders — functionality arrives in later
              phases.
            </p>
            <div className="mt-4">
              <AccountBlock email={email} />
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1 py-6 md:py-8">
          <div className="mb-6 md:hidden">
            <DashboardNav />
            <div className="mt-4">
              <AccountBlock email={email} />
            </div>
          </div>
          <main id="dashboard-content">{children}</main>
          <footer className="mt-10 border-t border-border pt-4 text-xs text-muted">
            PeoplePulse app shell · People are the signal. Evidence is the product.
          </footer>
        </div>
      </div>
    </div>
  );
}
