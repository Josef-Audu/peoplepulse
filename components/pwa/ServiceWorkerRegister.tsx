"use client";

import { useEffect } from "react";

/**
 * Registers the PeoplePulse service worker. Production only (dev keeps
 * network-only behavior so auth/session work is never served stale), runs
 * after mount so SSR/hydration are untouched, never blocks first render.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    const id = window.setTimeout(() => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* installability is progressive enhancement — app works without it */
      });
    }, 1500);
    return () => window.clearTimeout(id);
  }, []);
  return null;
}
