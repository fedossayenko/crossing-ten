// Network first, so both devices always run the build that was just pushed (and never a
// new index.html with yesterday's scripts); the cache is for playing offline — on a plane.
// ponytail: every launch revalidates each file (cheap 304s); switch to stale-while-revalidate if start-up feels slow.
const CACHE = 'crossing-ten';
const FONTS = /^https:\/\/fonts\.(googleapis|gstatic)\.com\//;

// On install, fetch the page and everything it names, so one visit is enough to play offline
// (the first visit's own requests happen before the worker runs, and would not be kept).
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(async c => {
    const html = await (await fetch('./', { cache: 'no-cache' })).text();
    const files = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m => m[1]).filter(u => !/^(https?:|data:|#|mailto:)/.test(u));
    await c.put('./', new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } }));
    await Promise.all(files.map(u => fetch(u, { cache: 'no-cache' }).then(r => r.ok && c.put(u, r)).catch(() => {})));
    // the fonts too, so the letters look the same offline
    const css = html.match(/href="(https:\/\/fonts\.googleapis\.com[^"]+)"/);
    if(css) await fetch(css[1]).then(async r => {
      const text = await r.clone().text(); await c.put(css[1], r);
      await Promise.all([...text.matchAll(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/g)].map(m => fetch(m[1]).then(f => c.put(m[1], f))));
    }).catch(() => {});
  }));
});
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if(req.method !== 'GET') return;
  // fonts never change at a given address: the copy first, the network only if there is none
  if(FONTS.test(req.url)){
    e.respondWith(caches.match(req.url).then(hit => hit || fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req.url, copy)); return res; })));
    return;
  }
  if(url.origin !== location.origin) return;
  const fromCache = () => caches.match(req.url, { ignoreSearch: true }).then(hit => hit || (req.mode === 'navigate' ? caches.match('./') : undefined));
  e.respondWith(fetch(req.url, { cache: 'no-cache' }).then(res => {
    // a plane's or hotel's wifi answers with its own login page, through a redirect: not our file
    if(!res.ok || res.redirected) return fromCache().then(hit => hit || res);
    const copy = res.clone(); caches.open(CACHE).then(c => c.put(req.url.split('?')[0], copy));
    return res;
  }).catch(fromCache));
});
