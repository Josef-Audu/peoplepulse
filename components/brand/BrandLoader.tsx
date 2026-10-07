/**
 * Reusable loading primitives for product use. Brand-native (converging dots
 * into the PeoplePulse signal; restrained neutral skeletons) — never generic
 * spinning circles. Use sparingly.
 */

/** Small dots converging into the signal. Decorative; accompany with text. */
export function BrandLoader({ label = "Loading" }: { label?: string }) {
  return (
    <span role="status" aria-label={label} className="inline-flex items-center gap-1.5">
      <svg width="44" height="20" viewBox="0 0 44 20" aria-hidden="true" className="block">
        <circle cx="7" cy="10" r="4" fill="#2563EB" className="pp-pre-dot" style={{ animationDelay: "0ms" }} />
        <circle cx="22" cy="10" r="4" fill="#0F766E" className="pp-pre-dot" style={{ animationDelay: "150ms" }} />
        <circle cx="37" cy="10" r="4" fill="#17212B" className="pp-pre-dot" style={{ animationDelay: "300ms" }} />
      </svg>
    </span>
  );
}

/** Placeholder for an evidence-percentage card while data loads. */
export function EvidenceSkeleton() {
  return (
    <div aria-hidden="true" className="rounded-2xl border border-border bg-white p-6">
      <div className="pp-skeleton h-3 w-24 rounded-full" />
      <div className="pp-skeleton mt-4 h-12 w-32 rounded-lg" />
      <div className="pp-skeleton mt-3 h-4 w-full rounded-full" />
      <div className="pp-skeleton mt-2 h-4 w-3/4 rounded-full" />
    </div>
  );
}

/** Placeholder for a Pulse row while data loads. */
export function PulseSkeleton() {
  return (
    <div aria-hidden="true" className="rounded-2xl border border-border bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="pp-skeleton h-9 w-9 rounded-xl" />
        <div className="flex-1">
          <div className="pp-skeleton h-4 w-1/2 rounded-full" />
          <div className="pp-skeleton mt-2 h-3 w-1/3 rounded-full" />
        </div>
      </div>
    </div>
  );
}
