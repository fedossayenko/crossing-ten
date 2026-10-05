// Network first, so both devices always run the build that was just pushed (and never a
// new index.html with yesterday's scripts); the cache is for playing offline — on a plane.
// ponytail: every launch revalidates each file (cheap 304s); switch to stale-while-revalidate if start-up feels slow.
// The cache's name carries a version: a new one is filled on install and the old ones are deleted on activate,
// so a file the app no longer has does not linger. Bump it when the cached set itself changes shape.
const CACHE = 'crossing-ten-v2';

// On install, fetch the page and everything it names, so one visit is enough to play offline
// (the first visit's own requests happen before the worker runs, and would not be kept).
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(async c => {
    const html = await (await fetch('./', { cache: 'no-cache' })).text();
    const files = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m => m[1]).filter(u => !/^(https?:|data:|#|mailto:)/.test(u));
    await c.put('./', new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } }));
    await Promise.all(files.map(u => fetch(u, { cache: 'no-cache' }).then(r => r.ok && c.put(u, r)).catch(() => {})));
  }));
});
self.addEventListener('activate', e => e.waitUntil(caches.keys()
  .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  .then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if(req.method !== 'GET') return;
  if(url.origin !== location.origin) return;
  const fromCache = () => caches.match(req.url, { ignoreSearch: true }).then(hit => hit || (req.mode === 'navigate' ? caches.match('./') : undefined));
  e.respondWith(fetch(req.url, { cache: 'no-cache' }).then(res => {
    // a plane's or hotel's wifi answers with its own login page, through a redirect: not our file
    if(!res.ok || res.redirected) return fromCache().then(hit => hit || res);
    const copy = res.clone(); caches.open(CACHE).then(c => c.put(req.url.split('?')[0], copy));
    return res;
  }).catch(fromCache));
});
