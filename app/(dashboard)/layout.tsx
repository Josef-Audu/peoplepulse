import type { ReactNode } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { DashboardNav } from "@/components/layout/DashboardNav";
import { Wordmark } from "@/components/layout/SiteHeader";
import { AccountBlock } from "@/components/auth/AccountBlock";

/**
 * Dashboard foundation shell: responsive sidebar navigation, account
 * indicator with real Clerk sign-out, content area. Clerk is the single
 * session system — no Supabase Auth cookies are read here.
 */
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress ?? null;

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
            Research
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
            <div className="mt-6">
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
