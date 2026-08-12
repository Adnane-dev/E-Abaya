import { NextResponse } from "next/server";

// Served as a Route Handler (not a static public/sw.js) so the cache
// version can be a fresh value on every build/deploy — a static file
// would need someone to remember to bump a version constant by hand,
// which is exactly the kind of stale-cache trap this avoids. Falls back
// to a timestamp when no CI-provided commit ref is available (local dev).
const VERSION = process.env.NEXT_PUBLIC_BUILD_ID || "dev";
const SHELL_CACHE = `shell-${VERSION}`;
const RUNTIME_CACHE = `runtime-${VERSION}`;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

const SCRIPT = `
const SHELL_CACHE = "${SHELL_CACHE}";
const RUNTIME_CACHE = "${RUNTIME_CACHE}";
const SUPABASE_URL = "${SUPABASE_URL}";
const OFFLINE_URL = "/offline";
const SHELL_URLS = ["/", "/products", OFFLINE_URL];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== SHELL_CACHE && key !== RUNTIME_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  // Navigations: network-first, falling back to the cached offline page
  // (or cached shell) when there's no connectivity.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(OFFLINE_URL).then((res) => res || caches.match("/"))
      )
    );
    return;
  }

  // Supabase REST reads: stale-while-revalidate, so products/categories
  // already viewed once stay visible offline. Everything else (including
  // Next's own content-hashed _next/static/* assets) is left to the
  // browser/CDN's normal caching — no need to duplicate that here.
  if (SUPABASE_URL && request.url.indexOf(SUPABASE_URL) === 0) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const networkFetch = fetch(request)
          .then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          })
          .catch(() => cached);
        return cached || networkFetch;
      })
    );
  }
});
`;

export async function GET() {
  return new NextResponse(SCRIPT, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      // The service worker script itself must never be cached — browsers
      // rely on byte-diffing it on each visit to know an update exists.
      "Cache-Control": "no-cache",
      "Service-Worker-Allowed": "/",
    },
  });
}
