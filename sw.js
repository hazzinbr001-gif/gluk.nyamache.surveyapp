// ═══════════════════════════════════════════════════════════
//  Community Health Survey — Service Worker
//  Great Lakes University · Nyamache Sub County Hospital
//
//  ONLINE:  Fetch fresh files, update cache, reload once
//  OFFLINE: Serve from cache instantly — no reload, no noise
//
//  Bump CACHE_VERSION to push an update to all installed PWAs
// ═══════════════════════════════════════════════════════════

const CACHE_VERSION = 'chsa-v2.8';
const CACHE_NAME    = CACHE_VERSION;

const APP_FILES = [
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
];

// ── INSTALL: cache everything, skip waiting immediately ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: delete old caches, take control ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
      .then(() => {
        // Notify all windows that a new version is active
        // The page will decide whether to reload based on connectivity
        return self.clients.matchAll({type: 'window'}).then(clients => {
          clients.forEach(client => client.postMessage({type: 'SW_UPDATED'}));
        });
      })
  );
});

// ── FETCH: Cache-first (instant load), update cache in background ──
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return; // only handle our own files

  event.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(event.request).then(cached => {
        // Background update — only if online
        if (navigator.onLine) {
          const fresh = fetch(event.request).then(res => {
            if (res && res.status === 200) {
              cache.put(event.request, res.clone());
            }
            return res;
          }).catch(() => cached); // network failed — fall back to cache
          // Serve cache instantly, background update happens silently
          return cached || fresh;
        }
        // Offline — serve from cache only, no network attempt
        return cached || caches.match('./index.html');
      })
    )
  );
});

// ── Handle SKIP_WAITING message from page ──
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
