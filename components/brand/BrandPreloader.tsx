"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Short branded preloader for the initial app experience: individual dots
 * appear, the signal completes, the interface fades in.
 *
 * Readiness-gated, never artificial:
 * - ready within ~150ms → the preloader never visibly appears.
 * - slower loads → the preloader reveals, then fades out immediately once ready.
 * - hard maximum ~1000ms regardless of load state.
 * - reduced-motion resolves almost immediately.
 * Content renders beneath throughout; the overlay never blocks.
 */
export function BrandPreloader() {
  const [phase, setPhase] = useState<"waiting" | "show" | "hide" | "done">("waiting");
  const shownRef = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const t = window.setTimeout(() => setPhase("done"), 60);
      return () => window.clearTimeout(t);
    }
    let finished = false;
    let fadeTimer = 0;
    const revealTimer = window.setTimeout(() => {
      shownRef.current = true;
      setPhase((prev) => (prev === "waiting" ? "show" : prev));
    }, 150);
    const finish = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(revealTimer);
      window.clearTimeout(capTimer);
      if (shownRef.current) {
        setPhase("hide");
        fadeTimer = window.setTimeout(() => setPhase("done"), 320);
      } else {
        setPhase("done");
      }
    };
    const capTimer = window.setTimeout(finish, 1000);
    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }
    return () => {
      finished = true;
      window.clearTimeout(revealTimer);
      window.clearTimeout(capTimer);
      window.clearTimeout(fadeTimer);
      window.removeEventListener("load", finish);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden="true"
      className={`pp-preloader fixed inset-0 z-50 flex items-center justify-center bg-paper${phase === "hide" ? " pp-preloader-hide" : ""}${phase === "waiting" ? " pointer-events-none opacity-0" : ""}`}
    >
      <div className="flex flex-col items-center gap-3">
        <svg width="64" height="64" viewBox="0 0 1000 1000" className="block">
          <circle cx="319" cy="397" r="70" fill="#2563EB" className="pp-pre-dot" style={{ animationDelay: "0ms" }} />
          <circle cx="768" cy="480" r="70" fill="#0EA17F" className="pp-pre-dot" style={{ animationDelay: "120ms" }} />
          <circle cx="496" cy="242" r="70" fill="#2563EB" className="pp-pre-dot" style={{ animationDelay: "200ms" }} />
          <circle cx="507" cy="821" r="70" fill="#2563EB" className="pp-pre-dot" style={{ animationDelay: "280ms" }} />
        </svg>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted">PeoplePulse</p>
      </div>
    </div>
  );
}
