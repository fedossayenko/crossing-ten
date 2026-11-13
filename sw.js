// Network first, so both devices always run the build that was just pushed (and never a
// new index.html with yesterday's scripts); the cache is for playing offline — on a plane.
// ponytail: every launch revalidates each file (cheap 304s); switch to stale-while-revalidate if start-up feels slow.
// The cache's name carries a version: a new one is filled on install and the old ones are deleted on activate,
// so a file the app no longer has does not linger. Bump it when the cached set itself changes shape.
const CACHE = 'crossing-ten-v3';
const NET_WAIT = 3500;   // a slow network (hotel wifi that connects and then stalls) gives way to the cache after this

// On install, fetch the page and every file it needs, so one visit is enough to play offline (the first visit's
// own requests happen before the worker runs, and would not be kept). Needs = what index.html names by src/href,
// then every module those import, and theirs (js/weekly.js, js/ui/today.js … are named by no tag). One file
// missing fails the install, so a half-filled cache never takes over from a whole one.
const IMPORT = /\b(?:(?:import|export)\b[^'";\n]*?\bfrom|import)\s*['"](\.\.?\/[^'"]+)['"]|\bimport\(\s*['"](\.\.?\/[^'"]+)['"]/g;
const fetchOk = async url => {
  const r = await fetch(url, { cache: 'no-cache' });
  if(!r.ok || r.redirected) throw new Error(url + ' ' + r.status);   // a wifi login page comes through a redirect: not our file
  return r;
};
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(async c => {
    const root = new URL('./', location.href).href, page = await fetchOk(root), html = await page.text();
    await c.put(root, new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } }));
    const todo = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m => m[1]).filter(u => !/^(https?:|data:|#|mailto:)/.test(u)).map(u => new URL(u, root).href);
    const seen = new Set(todo);
    while(todo.length) await Promise.all(todo.splice(0).map(async u => {
      const r = await fetchOk(u), copy = r.clone();
      await c.put(u, copy);
      if(!/\.js$/.test(u)) return;
      for(const m of (await r.text()).matchAll(IMPORT)){ const n = new URL(m[1] || m[2], u).href; if(!seen.has(n)){ seen.add(n); todo.push(n); } }
    }));
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
  const net = fetch(req.url, { cache: 'no-cache' }).then(res => {
    // a plane's or hotel's wifi answers with its own login page, through a redirect: not our file
    if(!res.ok || res.redirected) return fromCache().then(hit => hit || res);
    const copy = res.clone(); caches.open(CACHE).then(c => c.put(req.url.split('?')[0], copy));
    return res;
  }).catch(fromCache);
  // the cache answers when the network is slow and there is a copy; with none, the page waits for the network
  const slow = new Promise(r => setTimeout(r, NET_WAIT)).then(fromCache).then(hit => hit || net);
  e.waitUntil(net);
  e.respondWith(Promise.race([net, slow]));
});
