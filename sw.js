// ═══════════════════════════════════════════════════════════
//  Community Health Survey — Service Worker
//  Great Lakes University · Nyamache Sub County Hospital
//  Strategy: Cache-first (instant offline), update in background
// ═══════════════════════════════════════════════════════════

const CACHE_VERSION = 'chsa-v2.4';
const CACHE_NAME    = CACHE_VERSION;

const STATIC_FILES = [
  './',
  './index.html',
  './survey-styles.css',
  './survey-core.js',
  './survey-auth.js',
  './survey-admin.js',
  './survey-sync.js',
  './survey-reports.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

// ── INSTALL: cache everything, activate immediately ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_FILES))
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: delete old caches ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── FETCH: Stale-While-Revalidate ──
// 1. Serve from cache IMMEDIATELY (app works offline, no delay)
// 2. Fetch fresh copy from network in background
// 3. Update cache silently — next load gets the new version
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Only handle our own app files — not Supabase, Google Fonts, CDNs
  if (url.origin !== location.origin) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(event.request).then(cached => {

        // Fetch fresh in background — update cache silently
        const networkFetch = fetch(event.request)
          .then(networkRes => {
            if (networkRes && networkRes.status === 200) {
              cache.put(event.request, networkRes.clone());
            }
            return networkRes;
          })
          .catch(() => null); // offline — silent fail

        // Return cache immediately if available, else wait for network
        return cached || networkFetch;
      })
    )
  );
});
