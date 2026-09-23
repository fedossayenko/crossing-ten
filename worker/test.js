// Two devices syncing through the Worker. Run against `wrangler dev` (default) or a deployed
// Worker:  node worker/test.js [https://crossing-ten-sync.<you>.workers.dev]
const BASE = process.argv[2] || 'http://127.0.0.1:8787';
const ALPHA = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const code = () => Array.from({ length: 16 }, () => ALPHA[Math.floor(Math.random() * 32)]).join('');
const post = async (fam, body, raw) => {
  const r = await fetch(BASE + '/sync/' + fam, { method: 'POST', headers: { 'content-type': 'application/json' },
    body: raw !== undefined ? raw : JSON.stringify(body) });
  return { status: r.status, body: await r.json().catch(() => null) };
};
const round = (id, ts, player = 'p1') => ({ player, round: { id, ts, day: '2026-09-23', level: 2, n: 10, firstTry: 8, seen: [], missed: [] } });
const ok = (cond, what) => { if(!cond) throw new Error(what); };
// Everything a device would learn by syncing from the start.
async function pull(fam){
  let since = 0, rounds = [], last;
  for(let i = 0; i < 20; i++){
    last = (await post(fam, { since })).body;
    rounds = rounds.concat(last.rounds);
    since = last.cursor;
    if(!last.more) break;
  }
  return { rounds, players: last.players, gone: last.gone, cursor: since };
}

(async () => {
  const fam = code();
  // a browser asks first (the JSON body makes it a preflighted request)
  const pre = await fetch(BASE + '/sync/' + fam, { method: 'OPTIONS', headers: { origin: 'https://fedossayenko.github.io',
    'access-control-request-method': 'POST', 'access-control-request-headers': 'content-type' } });
  ok(pre.status === 204 && pre.headers.get('access-control-allow-origin') === '*' &&
     /content-type/.test(pre.headers.get('access-control-allow-headers')), 'the browser preflight should be allowed: ' + pre.status);
  // the door: only POST /sync/<code>, only a well-formed code and body
  ok((await fetch(BASE + '/sync/' + fam)).status === 404, 'GET should be refused');
  ok((await post('short', {})).status === 400, 'a malformed code should be refused');
  ok((await post(fam, null, '{not json')).status === 400, 'a malformed body should be refused');
  ok((await post(fam, null, 'x'.repeat(600 * 1024))).status === 413, 'an oversized body should be refused');

  // device A turns sync on with two rounds; device B joins and gets them
  const a1 = (await post(fam, { since: 0, players: [{ id: 'p1', name: 'Ани', mascot: 'cat', lang: 'bg', updated: 5 }],
    rounds: [round('r1', 1000), round('r2', 2000)] })).body;
  ok(a1.rounds.length === 2 && a1.players[0].name === 'Ани', 'A should read back what it sent');
  const b1 = await pull(fam);
  ok(b1.rounds.map(r => r.round.id).join() === 'r1,r2' && b1.players.length === 1, 'B should get both rounds and the player');
  // B plays a round; A, syncing from where it stopped, gets only that one
  await post(fam, { since: b1.cursor, rounds: [round('r3', 3000)] });
  const a2 = (await post(fam, { since: a1.cursor })).body;
  ok(a2.rounds.map(r => r.round.id).join() === 'r3', 'A should get only the new round');
  // a round sent twice is kept once; junk is ignored, not stored
  await post(fam, { since: 0, rounds: [round('r1', 1000), { player: 'p1', round: { id: 'bad id!', ts: 1 } },
    { player: 'p1', round: { id: 'big', ts: 4000, pad: 'x'.repeat(5000) } }, { player: '../x', round: { id: 'r9', ts: 1 } }] });
  ok((await pull(fam)).rounds.length === 3, 'duplicates and junk must not be stored');

  // players: the later edit wins, whichever device sends it last
  await post(fam, { since: 0, players: [{ id: 'p1', name: 'Old', mascot: 'cat', lang: 'bg', updated: 3 }] });
  ok((await pull(fam)).players[0].name === 'Ани', 'an older edit must not overwrite a newer one');
  await post(fam, { since: 0, players: [{ id: 'p1', name: 'Ани', mascot: 'fox', lang: 'uk', updated: 9 }] });
  ok((await pull(fam)).players[0].mascot === 'fox', 'a newer edit must win');

  // reset: her rounds from before the reset go, on the server and so on every device
  await post(fam, { since: 0, players: [{ id: 'p1', name: 'Ани', mascot: 'fox', lang: 'uk', updated: 10, resetAt: 2500 }] });
  ok((await pull(fam)).rounds.map(r => r.round.id).join() === 'r3', 'a reset should drop the rounds before it');

  // a deleted player: tombstone kept, rounds gone
  await post(fam, { since: 0, players: [{ id: 'p2', name: 'Иво', mascot: 'owl', lang: 'en', updated: 11 }], rounds: [round('q1', 5000, 'p2')] });
  await post(fam, { since: 0, gone: [{ id: 'p2', updated: 12 }] });
  const g = await pull(fam);
  ok(g.gone.some(x => x.id === 'p2') && !g.players.some(p => p.id === 'p2') && !g.rounds.some(r => r.player === 'p2'),
    'a deleted player should be gone everywhere, with her rounds');
  // a stale edit from a device that has not heard of the deletion does not bring her back
  await post(fam, { since: 0, players: [{ id: 'p2', name: 'Иво', mascot: 'owl', lang: 'en', updated: 11 }] });
  ok(!(await pull(fam)).players.some(p => p.id === 'p2'), 'a stale edit must not resurrect a deleted player');

  // a long history comes down in pages
  const many = [];
  for(let i = 0; i < 1200; i++) many.push(round('m' + i, 10000 + i));
  await post(fam, { since: 0, rounds: many.slice(0, 600) });
  await post(fam, { since: 0, rounds: many.slice(600) });
  const all = await pull(fam);
  ok(all.rounds.length === 1201 && new Set(all.rounds.map(r => r.round.id)).size === 1201, 'paging should deliver every round once: ' + all.rounds.length);

  // families never see each other
  ok((await pull(code())).rounds.length === 0, 'another family must see nothing');
  console.log('sync: merging, paging, last-edit-wins, reset, deletion and family isolation all hold against ' + BASE);
})().catch(e => { console.error('sync: FAILED - ' + e.message); process.exit(1); });
