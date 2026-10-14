/* PeoplePulse service worker — minimal and safe (installable PWA demo).
 *
 * Cache strategy:
 * - Versioned cache (peoplepulse-v1); old caches deleted on activate.
 * - Cache-first ONLY for static brand assets (icons, brand art).
 * - Network-first for navigations, with a simple offline fallback message.
 * - NEVER cached: /api/*, auth/Clerk endpoints, Supabase traffic, POST/PUT/
 *   DELETE, dashboard/private research data, form submissions. The PWA
 *   requires internet for current research evidence — that is acceptable.
 */

const CACHE_VERSION = "peoplepulse-v1";
const STATIC_ASSETS = [
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/maskable-512.png",
  "/icons/apple-touch-icon.png",
  "/brand/peoplepulse-symbol.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function isSensitive(url) {
  return (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/__clerk/") ||
    url.pathname.startsWith("/sign-in") ||
    url.pathname.startsWith("/sign-up") ||
    url.pathname.includes("supabase.co")
  );
}

function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/brand/") ||
    url.pathname === "/sw.js" ||
    url.pathname === "/manifest.webmanifest"
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return; // never cache writes
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // third parties pass through
  if (isSensitive(url)) return; // auth + data APIs: network-only

  if (isStaticAsset(url)) {
    // Safe cache-first for versioned-static brand assets.
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((res) => {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
            return res;
          })
      )
    );
    return;
  }

  if (request.mode === "navigate") {
    // Network-first for all navigation (auth, dashboard, pulses stay fresh).
    event.respondWith(
      fetch(request).catch(
        () =>
          new Response(
            "<!doctype html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>PeoplePulse — offline</title></head><body style='font-family:system-ui,sans-serif;padding:2rem'><h1>PeoplePulse needs an internet connection</h1><p>Current research evidence cannot load offline. Please reconnect and try again.</p></body></html>",
            { headers: { "Content-Type": "text/html" } }
          )
      )
    );
  }
  // All other same-origin GETs (RSC, build assets): default browser handling.
});
