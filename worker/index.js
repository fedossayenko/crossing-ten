// Sync for Crossing Ten: a Cloudflare Worker in front of one D1 database.
//
// A family is a random code (the only credential; it names the family's data and nothing
// else). One request does everything: POST /sync/<code> with what this device has that the
// server has not seen, and the reply carries what the server has that this device has not.
//   request  { since, players:[{id,…,updated}], gone:[{id,updated}], rounds:[{player, round}] }
//   reply    { cursor, players, gone, rounds:[{player, round}], more }
// Rounds carry ids and never change, so merging is a set union (INSERT OR IGNORE). Players
// are last-write-wins on `updated`; a player's resetAt drops her older rounds, and a
// deleted player is kept as a tombstone in `gone` so the other devices delete her too.
// ponytail: no rate limiting; a family's code is 80 random bits, add Cloudflare's rate-limit binding if it is ever abused.

const CODE = /^[0-9A-HJKMNP-TV-Z]{16}$/;       // Crockford base32, no I L O U
const ID = /^[A-Za-z0-9_-]{1,40}$/;
const MAX_BODY = 512 * 1024, MAX_ROUND = 4096, MAX_PLAYER = 1024, PAGE = 500;

const CORS = { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'POST, OPTIONS',
  'access-control-allow-headers': 'content-type', 'access-control-max-age': '86400' };
const reply = (status, body) => new Response(JSON.stringify(body), { status, headers: Object.assign({ 'content-type': 'application/json' }, CORS) });

export default {
  async fetch(req, env){
    if(req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });   // a browser's preflight
    const m = new URL(req.url).pathname.match(/^\/sync\/([^/]+)$/);
    if(!m || req.method !== 'POST') return reply(404, { error: 'not found' });
    const family = m[1];
    if(!CODE.test(family)) return reply(400, { error: 'bad family code' });
    const text = await req.text();
    if(text.length > MAX_BODY) return reply(413, { error: 'too much at once' });
    let body;
    try { body = JSON.parse(text); } catch(e){ return reply(400, { error: 'not json' }); }
    if(!body || typeof body !== 'object') return reply(400, { error: 'not an object' });
    const since = Number.isInteger(body.since) && body.since >= 0 ? body.since : 0;
    const db = env.DB, now = Date.now(), writes = [];

    // players and tombstones: keep whichever copy changed last
    const players = Array.isArray(body.players) ? body.players.slice(0, 20) : [];
    const gone = Array.isArray(body.gone) ? body.gone.slice(0, 50) : [];
    for(const p of players){
      const json = JSON.stringify(p);
      if(!p || !ID.test(p.id) || json.length > MAX_PLAYER || !Number.isFinite(p.updated)) continue;
      writes.push(db.prepare(`INSERT INTO players (family, id, body, updated, gone) VALUES (?1, ?2, ?3, ?4, 0)
        ON CONFLICT(family, id) DO UPDATE SET body = ?3, updated = ?4, gone = 0 WHERE ?4 > players.updated`)
        .bind(family, p.id, json, p.updated));
    }
    for(const g of gone){
      if(!g || !ID.test(g.id) || !Number.isFinite(g.updated)) continue;
      writes.push(db.prepare(`INSERT INTO players (family, id, body, updated, gone) VALUES (?1, ?2, '{}', ?3, 1)
        ON CONFLICT(family, id) DO UPDATE SET body = '{}', updated = ?3, gone = 1 WHERE ?3 >= players.updated`)
        .bind(family, g.id, g.updated));
      writes.push(db.prepare('DELETE FROM rounds WHERE family = ?1 AND player = ?2').bind(family, g.id));
    }
    // rounds: a set union, so a round sent twice is stored once
    const rounds = Array.isArray(body.rounds) ? body.rounds.slice(0, 2000) : [];
    for(const x of rounds){
      const r = x && x.round, json = JSON.stringify(r);
      if(!x || !ID.test(x.player) || !r || !ID.test(r.id) || !Number.isFinite(r.ts) || json.length > MAX_ROUND) continue;
      writes.push(db.prepare('INSERT OR IGNORE INTO rounds (family, player, id, ts, body) VALUES (?1, ?2, ?3, ?4, ?5)')
        .bind(family, x.player, r.id, r.ts, json));
    }
    if(writes.length) await db.batch(writes);
    // a reset player keeps no rounds from before her reset
    await db.prepare(`DELETE FROM rounds WHERE family = ?1 AND ts < (SELECT json_extract(body, '$.resetAt') FROM players
      WHERE players.family = rounds.family AND players.id = rounds.player AND gone = 0)`).bind(family).run();

    const got = await db.prepare('SELECT seq, player, body FROM rounds WHERE family = ?1 AND seq > ?2 ORDER BY seq LIMIT ?3')
      .bind(family, since, PAGE + 1).all();
    const rows = got.results.slice(0, PAGE);
    const people = await db.prepare('SELECT id, body, updated, gone FROM players WHERE family = ?1').bind(family).all();
    return reply(200, {
      cursor: rows.length ? rows[rows.length - 1].seq : since,
      more: got.results.length > PAGE,
      rounds: rows.map(r => ({ player: r.player, round: JSON.parse(r.body) })),
      players: people.results.filter(p => !p.gone).map(p => JSON.parse(p.body)),
      gone: people.results.filter(p => p.gone).map(p => ({ id: p.id, updated: p.updated })),
      now
    });
  }
};
