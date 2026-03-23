// ═══════════════════════════════════════════════════════════
//  Community Health Survey — Service Worker  v3.3
//  Great Lakes University · Nyamache Sub County Hospital
//
//  ONLINE:  Auto-update, force-reload ALL open PWA windows
//  OFFLINE: Serve from cache instantly — no disruption
//
//  ► Bump CACHE_VERSION to force update on ALL installed PWAs
//  ► On update: old cache wiped, all windows reloaded automatically
// ═══════════════════════════════════════════════════════════

const CACHE_VERSION = 'chsa-v3.3';
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
  './version.json',
  './icon-192.png',
];

// ── INSTALL: cache all app files immediately ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())   // activate immediately, no waiting
  );
});

// ── ACTIVATE: wipe ALL old caches, claim clients, notify all windows ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => {
          console.log('[SW v3.3] Deleting old cache:', k);
          return caches.delete(k);
        })
      ))
      .then(() => self.clients.claim())
      .then(() => {
        // Tell every open window: new version is live.
        // survey-core.js listens for SW_UPDATED and reloads the page
        // after a short delay so any in-progress work can be saved.
        return self.clients
          .matchAll({ type: 'window', includeUncontrolled: true })
          .then(clients => {
            clients.forEach(client => {
              client.postMessage({ type: 'SW_UPDATED', version: CACHE_VERSION });
            });
          });
      })
  );
});

// ── FETCH strategy ──
//   version.json  → always network (never stale)
//   .js / .css    → network-first  (fresh code on every load when online)
//   everything else → cache-first + background refresh
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;

  // ── version.json: NEVER cache ──
  if (url.pathname.endsWith('/version.json')) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .catch(() => new Response('{}', {
          headers: { 'Content-Type': 'application/json' }
        }))
    );
    return;
  }

  // ── JS / CSS: network-first so code updates are never blocked by stale cache ──
  const isCode = url.pathname.endsWith('.js') || url.pathname.endsWith('.css');
  if (isCode) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return res;
        })
        .catch(() =>
          caches.open(CACHE_NAME).then(cache => cache.match(event.request))
        )
    );
    return;
  }

  // ── Everything else: cache-first + background refresh ──
  event.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(event.request).then(cached => {
        if (navigator.onLine) {
          const fresh = fetch(event.request)
            .then(res => {
              if (res && res.status === 200) cache.put(event.request, res.clone());
              return res;
            })
            .catch(() => cached);
          return cached || fresh;
        }
        return cached || caches.match('./index.html');
      })
    )
  );
});

// ── Messages from the page ──
self.addEventListener('message', event => {
  if (!event.data) return;

  // Legacy: page triggers skip-waiting manually
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  // Page asks what SW version is running (used by version-check in survey-core.js)
  if (event.data.type === 'GET_VERSION') {
    event.source?.postMessage({ type: 'SW_VERSION', version: CACHE_VERSION });
  }

  // After a corrected record is re-submitted, broadcast to all other open tabs
  // so their admin dashboard or record list refreshes automatically
  if (event.data.type === 'SYNC_COMPLETE') {
    self.clients.matchAll({ type: 'window' }).then(clients => {
      clients.forEach(c => {
        if (c !== event.source) {
          c.postMessage({ type: 'SYNC_COMPLETE', from: 'peer' });
        }
      });
    });
  }
});
