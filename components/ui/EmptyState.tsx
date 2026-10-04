import type { ReactNode } from "react";

export type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

/**
 * Honest placeholder for areas with no content or no functionality yet.
 * Never fakes data — states what will appear here and in which phase.
 */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <section
      aria-label={title}
      className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center"
    >
      <svg
        aria-hidden="true"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        className="mx-auto mb-4 text-slate-300"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="14" r="3" fill="currentColor" stroke="none" />
        <circle cx="12" cy="34" r="3" fill="currentColor" stroke="none" />
        <circle cx="24" cy="24" r="3" fill="currentColor" stroke="none" />
        <path d="M16 15 30 22M16 33 30 26" />
        <rect x="32" y="14" width="5" height="20" rx="2.5" fill="currentColor" stroke="none" />
      </svg>
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mx-auto mt-2 max-w-[55ch] text-sm leading-relaxed text-slate-600">{description}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </section>
  );
}
