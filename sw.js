// ═══════════════════════════════════════════════════════════
//  Community Health Survey — Service Worker
//  Great Lakes University · Nyamache Sub County Hospital
//
//  ONLINE:  Auto-update, reload once with fresh files
//  OFFLINE: Serve from cache instantly — no disruption
//
//  Bump CACHE_VERSION to push update to ALL installed PWAs
// ═══════════════════════════════════════════════════════════

const CACHE_VERSION = 'chsa-v3.96';
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

// ── INSTALL ──
// skipWaiting() here means this SW activates immediately
// even on devices that had an old SW — no waiting for tabs to close
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())  // ← activate immediately, no waiting
  );
});

// ── ACTIVATE: wipe old caches, claim all clients ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
      .then(() => {
        // Tell all open windows: new version active
        // Pages will reload only if they are online
        return self.clients.matchAll({type: 'window'}).then(clients => {
          clients.forEach(c => c.postMessage({type: 'SW_UPDATED'}));
        });
      })
  );
});

// ── FETCH: Cache-first ──
// Online:  serve cache instantly + update cache in background
// Offline: serve cache only — no network attempt, no errors
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;
  // Never cache version.json — must always be fetched fresh
  if (url.pathname.endsWith('/version.json')) {
    event.respondWith(fetch(event.request, {cache: 'no-store'}).catch(() => new Response('{}', {headers:{'Content-Type':'application/json'}})));
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(event.request).then(cached => {
        if (navigator.onLine) {
          // Background refresh
          const fresh = fetch(event.request)
            .then(res => {
              if (res && res.status === 200) cache.put(event.request, res.clone());
              return res;
            })
            .catch(() => cached);
          return cached || fresh;
        }
        // Offline — cache only
        return cached || caches.match('./index.html');
      })
    )
  );
});

// ── Handle SKIP_WAITING from page (for old SWs) ──
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
