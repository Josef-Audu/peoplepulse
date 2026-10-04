import Link from "next/link";

export function Wordmark() {
  return (
    <Link href="/" aria-label="PeoplePulse home" className="flex min-h-[44px] items-center gap-3">
      <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink">
        <span className="h-4 w-1.5 rounded-full bg-white" />
      </span>
      <span>
        <span className="block text-sm font-extrabold tracking-[0.12em]">PEOPLEPULSE</span>
        <span className="block text-[11px] uppercase tracking-[0.08em] text-muted">
          Human evidence platform
        </span>
      </span>
    </Link>
  );
}

/** Marketing top navigation: wordmark, minimal links, primary-action placeholder. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-2 sm:px-6">
        <Wordmark />
        <nav aria-label="Site" className="hidden items-center gap-1 sm:flex">
          <Link
            href="/#evidence-example"
            className="flex min-h-[44px] items-center rounded-lg px-4 text-sm text-slate-600 hover:text-ink"
          >
            Evidence example
          </Link>
          <Link
            href="/dashboard"
            className="flex min-h-[44px] items-center rounded-lg px-4 text-sm text-slate-600 hover:text-ink"
          >
            App shell
          </Link>
        </nav>
        <Link
          href="/dashboard"
          className="flex min-h-[44px] items-center rounded-lg border border-pulse-dark bg-pulse px-5 text-sm font-bold text-white shadow-md shadow-pulse/30 hover:bg-pulse-dark"
        >
          Open the app shell
        </Link>
      </div>
    </header>
  );
}
