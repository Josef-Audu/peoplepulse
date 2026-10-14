"use client";

import { useState } from "react";

/** Copies the public participant link. Client-only (uses clipboard + origin). */
export function CopyLinkButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const url = `${window.location.origin}/p/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <code className="min-h-[44px] flex-1 truncate rounded-lg border border-border bg-paper px-3 py-2.5 text-sm text-ink">
        /p/{slug}
      </code>
      <button
        type="button"
        onClick={copy}
        className="min-h-[44px] rounded-lg border border-pulse-dark bg-pulse px-5 text-sm font-bold text-white hover:bg-pulse-dark"
      >
        {copied ? "Copied ✓" : "Copy link"}
      </button>
    </div>
  );
}
