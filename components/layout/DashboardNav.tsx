"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/research", label: "Research" },
  { href: "/pulses", label: "Pulses" },
  { href: "/insights", label: "Insights" },
  { href: "/profile", label: "Profile" },
  { href: "/settings", label: "Settings" },
] as const;

/**
 * Dashboard navigation (plan §Phase 0 shell).
 * Vertical sidebar on desktop, horizontal scroll row on mobile.
 * Active state uses background + weight + aria-current, never color alone.
 */
export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard">
      <ul className="flex gap-1 overflow-x-auto md:flex-col">
        {ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-[44px] items-center whitespace-nowrap rounded-lg px-4 text-sm",
                  active
                    ? "bg-white font-semibold text-ink shadow-sm"
                    : "font-normal text-slate-600 hover:bg-white/70 hover:text-ink"
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
