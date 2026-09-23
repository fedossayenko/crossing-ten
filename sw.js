// Network first, so both devices always run the build that was just pushed (and never a
// new index.html with yesterday's scripts); the cache is only for playing offline.
// ponytail: every launch revalidates each file (cheap 304s); switch to stale-while-revalidate if start-up feels slow.
const CACHE = 'crossing-ten';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const req = e.request;
  if(req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(fetch(req.url, { cache: 'no-cache' }).then(res => {
    if(res.ok){ const copy = res.clone(); caches.open(CACHE).then(c => c.put(req.url, copy)); }
    return res;
  }).catch(() => caches.match(req.url)));
});
