/* ---------- the archive: every round ever played ----------
   localStorage keeps a player's settings and only her last 400 rounds: it is small and synchronous, so
   the app has them the moment it starts. IndexedDB keeps all of them, so what she has learned, her
   reviews and her badges never fall off the end of the log. The app merges the archive in before the
   first question (app.js), and every round written to localStorage is written here too. Where IndexedDB
   is missing (some private windows, Node in check.js) every call settles at once and the app runs on the
   last 400, as it always did. */
export const ARCHIVE = (() => {
  const open = new Promise(res => {
    try {
      const r = indexedDB.open('crossingten', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('rounds', { keyPath: ['player', 'id'] }).createIndex('player', 'player');
      r.onsuccess = () => res(r.result);
      r.onerror = r.onblocked = () => res(null);
    } catch(e){ res(null); }
  });
  // one transaction on the rounds store; settles when it commits (or fails: nothing here may stop a round)
  const tx = (mode, fn) => open.then(db => db && new Promise(res => {
    try {
      const t = db.transaction('rounds', mode), req = fn(t.objectStore('rounds'));
      t.oncomplete = () => res(req && req.result);
      t.onerror = t.onabort = () => res(undefined);
    } catch(e){ res(undefined); }
  }));
  return {
    all: player => tx('readonly', s => s.index('player').getAll(player)).then(rs => (rs || []).map(x => x.r)),
    put: (player, rounds) => rounds.length ? tx('readwrite', s => { rounds.forEach(r => s.put({ player, id: r.id, r })); }) : Promise.resolve(),
    // her rounds before `before` (a reset), or all of them (a deleted player)
    drop: (player, before = Infinity) => tx('readwrite', s => {
      const c = s.index('player').openCursor(player);
      c.onsuccess = () => { const cur = c.result; if(!cur) return; if(cur.value.r.ts < before) cur.delete(); cur.continue(); };
    }),
  };
})();
// Two logs of one player as one, each round once, oldest first.
export function unionRounds(a, b){
  const seen = new Set(), out = [];
  a.concat(b).forEach(r => { if(r && !seen.has(r.id)){ seen.add(r.id); out.push(r); } });
  return out.sort((x, y) => x.ts - y.ts);
}
