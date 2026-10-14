"use client";

import { useState } from "react";
import { exportMyData } from "@/lib/peoplepulse/profile-actions";

/** Downloads the creator's own research data as JSON (RLS-scoped server-side). */
export function ExportDataButton() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onExport() {
    setError(null);
    setPending(true);
    try {
      const json = await exportMyData();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `peoplepulse-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={onExport}
        disabled={pending}
        className="min-h-[44px] rounded-lg border border-border bg-white px-5 text-sm font-semibold text-ink hover:border-slate-400 disabled:opacity-60"
      >
        {pending ? "Preparing…" : "Download my data (JSON)"}
      </button>
      {error ? (
        <p role="alert" className="mt-2 text-sm font-semibold text-error">{error}</p>
      ) : null}
    </div>
  );
}
