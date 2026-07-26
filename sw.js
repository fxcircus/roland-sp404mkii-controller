/* Service worker for roland-sp404mkii-controller.
   ==========================================================================
   The whole design follows from one requirement: a push to main must reach
   people. The usual PWA recipe — cache-first, bump a version constant to
   invalidate — fails that requirement by default, because forgetting the bump
   pins every existing install to a stale build with no way back.

   So this is NETWORK-FIRST for everything we ship. Online, you always get what
   is on main; the cache is written on the way past and only ever read when the
   network is unavailable. There is no version to remember to bump for content
   to update: CACHE's version exists solely so activate() can bin older stores.

   Two supporting details:

   * Same-origin requests are refetched with cache:'no-cache', which forces a
     revalidation against GitHub Pages instead of accepting its 10-minute
     max-age. Costs one conditional request, usually answered 304, and makes a
     deploy visible on the next load rather than up to ten minutes later.
   * skipWaiting + clients.claim so a new worker replaces the old one straight
     away instead of waiting for every tab to close. The page is deliberately
     NOT auto-reloaded when that happens — network-first means the document
     already came off the network, so a reload would gain nothing and could
     interrupt someone mid-take.
   ========================================================================== */

const VERSION = 'v1';
const CACHE = 'sp404mk2-' + VERSION;

/* Enough to boot offline. The two JSONs are not optional — index.html renders
   every MIDI panel from them and shows an error without them. */
const PRECACHE = [
  './',
  './index.html',
  './sp404mk2-midi-map.json',
  './sp404mk2-shortcuts.json',
  './manifest.webmanifest',
  './icon.svg',
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    /* Added one at a time and never fatally: cache.addAll() rejects the whole
       install if any single entry 404s, which would leave the app with no
       worker at all rather than a partial one. */
    await Promise.all(PRECACHE.map(url =>
      cache.add(new Request(url, { cache: 'reload' })).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names
      .filter(n => n.startsWith('sp404mk2-') && n !== CACHE)
      .map(n => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data === 'skip-waiting') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (e) { return; }

  /* Google Fonts are immutable at their URL — the only thing here that earns
     cache-first. Everything else is ours and can change on any push. */
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(staleWhileRevalidate(req));
    return;
  }
  if (url.origin !== self.location.origin) return;   // leave anything else alone

  event.respondWith(networkFirst(req));
});

async function networkFirst(req) {
  const cache = await caches.open(CACHE);
  const isNav = req.mode === 'navigate';
  /* A fresh Request rather than fetch(req, {cache:…}): constructing a Request
     from one whose mode is 'navigate' throws, and overriding the cache mode is
     the entire point here. */
  const netReq = new Request(req.url, { cache: 'no-cache', credentials: 'same-origin' });

  try {
    const fresh = await fetch(netReq);
    if (fresh && fresh.ok) {
      /* Navigations all store under one key. Otherwise every ?s=… share link
         someone opens would earn its own copy of the whole app. */
      cache.put(isNav ? './index.html' : req, fresh.clone());
    }
    return fresh;
  } catch (err) {
    /* ignoreSearch matters: offline on a ?s=… share link still has to find the
       cached document. */
    const hit = await cache.match(isNav ? './index.html' : req, { ignoreSearch: true });
    if (hit) return hit;
    if (isNav) {
      const index = await cache.match('./index.html');
      if (index) return index;
    }
    throw err;
  }
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req);
  /* Opaque responses have status 0, so .ok is false — a cross-origin font
     would never be stored if we only checked .ok. */
  const net = fetch(req)
    .then(res => { if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone()); return res; })
    .catch(() => null);
  if (hit) return hit;
  const res = await net;
  /* Failing here is harmless — the stylesheet declares local fallbacks, so the
     app loses the hand-drawn lettering and nothing else. */
  return res || Response.error();
}
