import type { ReactNode } from "react";
import { Wordmark } from "@/components/layout/SiteHeader";

export type AuthCardProps = {
  headingId: string;
  title: string;
  description: string;
  children: ReactNode;
};

/** Restrained auth page shell: wordmark, semantic heading, description, form area. */
export function AuthCard({ headingId, title, description, children }: AuthCardProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-4 py-12">
      <section
        aria-labelledby={headingId}
        className="w-full max-w-md rounded-2xl border border-border bg-white p-6 sm:p-8"
      >
        <Wordmark />
        <h1 id={headingId} className="mt-6 text-2xl font-extrabold tracking-tight">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
        <div className="mt-6">{children}</div>
      </section>
    </main>
  );
}
