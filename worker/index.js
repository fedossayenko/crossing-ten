// Sync for Crossing Ten: a Cloudflare Worker in front of one D1 database.
//
// A family logs in with a family name and password (or a linked Google account) and gets a
// session token; the token, sent as a Bearer header, names the family's data.
//   POST /signup {name, password, code?}  new account; `code` (or a Bearer session) brings in
//                                          a family that already syncs, instead of a new one
//   POST /login  {name, password}         → {token, name}; 5 wrong passwords lock it 15 min
//   POST /google {credential}             a Google ID token → {token}; with a Bearer session it
//                                          links that Google account to the family instead
//   POST /logout                          ends this session
//   POST /sync   {since, players, gone, rounds} → {cursor, players, gone, rounds, more, account}
// Sync sends what the server has not seen from this device and replies with what this device
// has not seen. Rounds carry ids and never change, so merging is a set union (INSERT OR
// IGNORE). Players are last-write-wins on `updated`; a player's resetAt drops her older
// rounds, and a deleted player is kept as a tombstone in `gone` so the other devices delete her.
// ponytail: no rate limit on signup or per IP; add Cloudflare's rate-limit binding if it is ever abused.

const CODE = /^[0-9A-HJKMNP-TV-Z]{16}$/;       // a family's id: Crockford base32, no I L O U
const ID = /^[A-Za-z0-9_-]{1,40}$/;
const MAX_BODY = 512 * 1024, MAX_ROUND = 4096, MAX_PLAYER = 1024, PAGE = 500;
// PBKDF2 costs ~0.3 ms per 1000 rounds and the free plan allows ~10 ms of CPU a request.
// ponytail: modest on purpose; `iter` is stored per account, so raise it (rehash on login) on a paid plan.
const ITER = 30000, FAILS = 5, LOCK_MS = 15 * 60 * 1000;

const CORS = { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'POST, OPTIONS',
  'access-control-allow-headers': 'content-type, authorization', 'access-control-max-age': '86400' };
const reply = (status, body) => new Response(JSON.stringify(body), { status, headers: Object.assign({ 'content-type': 'application/json' }, CORS) });

const enc = new TextEncoder();
const hex = buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
const b64url = bytes => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64 = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
const sha256 = async s => hex(await crypto.subtle.digest('SHA-256', enc.encode(s)));
const B32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const newFamily = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), b => B32[b & 31]).join('');
async function pbkdf2(password, salt, iter){
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: enc.encode(salt), iterations: iter }, key, 256));
}
const same = (a, b) => a.length === b.length && crypto.subtle.timingSafeEqual(enc.encode(a), enc.encode(b));
// "Сайенко", " сайенко " and "САЙЕНКО" are one family name.
const keyOf = name => String(name || '').normalize('NFC').trim().replace(/\s+/g, ' ').toLowerCase();

async function session(db, family){
  const token = b64url(crypto.getRandomValues(new Uint8Array(32)));
  await db.prepare('INSERT INTO sessions (hash, family, created) VALUES (?1, ?2, ?3)').bind(await sha256(token), family, Date.now()).run();
  return token;
}
async function familyOf(db, req){
  const m = (req.headers.get('authorization') || '').match(/^Bearer ([A-Za-z0-9_-]{20,100})$/);
  if(!m) return null;
  const row = await db.prepare('SELECT family FROM sessions WHERE hash = ?1').bind(await sha256(m[1])).first();
  return row && row.family;
}
const nameOf = async (db, family) => ((await db.prepare('SELECT display FROM accounts WHERE family = ?1').bind(family).first()) || {}).display || null;

// A Google ID token, checked against Google's published keys: signature, audience, issuer, expiry.
let KEYS = null, KEYS_AT = 0;
async function googleSub(cred, env){
  try {
    if(!env.GOOGLE_CLIENT_ID) return null;
    const [h, p, s] = String(cred).split('.');
    const head = JSON.parse(new TextDecoder().decode(unb64(h))), body = JSON.parse(new TextDecoder().decode(unb64(p)));
    if(env.TEST_GOOGLE_JWKS) KEYS = JSON.parse(env.TEST_GOOGLE_JWKS).keys;     // worker/test.js only, via wrangler dev --var
    else if(!KEYS || Date.now() - KEYS_AT > 3600e3){ KEYS = (await (await fetch('https://www.googleapis.com/oauth2/v3/certs')).json()).keys; KEYS_AT = Date.now(); }
    const jwk = KEYS.find(k => k.kid === head.kid);
    if(!jwk || head.alg !== 'RS256') return null;
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    if(!await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, unb64(s), enc.encode(h + '.' + p))) return null;
    if(body.aud !== env.GOOGLE_CLIENT_ID || !['accounts.google.com', 'https://accounts.google.com'].includes(body.iss) ||
       !(body.exp * 1000 > Date.now()) || !body.sub) return null;
    return String(body.sub);
  } catch(e){ return null; }
}

export default {
  async fetch(req, env){
    if(req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });   // a browser's preflight
    const route = new URL(req.url).pathname;
    if(req.method !== 'POST' || !['/signup', '/login', '/logout', '/google', '/sync'].includes(route)) return reply(404, { error: 'not found' });
    const text = await req.text();
    if(text.length > MAX_BODY) return reply(413, { error: 'too much at once' });
    let body;
    try { body = text ? JSON.parse(text) : {}; } catch(e){ return reply(400, { error: 'not json' }); }
    if(!body || typeof body !== 'object') return reply(400, { error: 'not an object' });
    const db = env.DB, now = Date.now();

    if(route === '/signup'){
      const name = keyOf(body.name), display = String(body.name || '').trim().replace(/\s+/g, ' ');
      const password = String(body.password || '');
      if(name.length < 2 || name.length > 40) return reply(400, { error: 'name' });
      if(password.length < 8 || password.length > 200) return reply(400, { error: 'password' });
      // a family already syncing (by its old code, or this device's Google session) keeps its data
      let family = await familyOf(db, req);
      if(!family && body.code) family = CODE.test(body.code) ? body.code : null;
      if(body.code && !family) return reply(400, { error: 'code' });
      family = family || newFamily();
      if(await db.prepare('SELECT 1 FROM accounts WHERE name = ?1 OR family = ?2').bind(name, family).first()) return reply(409, { error: 'taken' });
      const salt = b64url(crypto.getRandomValues(new Uint8Array(16)));
      await db.prepare('INSERT INTO accounts (name, display, family, salt, hash, iter, fails, locked, created) VALUES (?1, ?2, ?3, ?4, ?5, ?6, 0, 0, ?7)')
        .bind(name, display, family, salt, await pbkdf2(password, salt, ITER), ITER, now).run();
      return reply(201, { token: await session(db, family), name: display });
    }
    if(route === '/login'){
      // ponytail: a wrong name answers faster than a wrong password; names are not secret (signup says "taken").
      const a = await db.prepare('SELECT * FROM accounts WHERE name = ?1').bind(keyOf(body.name)).first();
      if(!a) return reply(401, { error: 'wrong' });
      if(a.locked > now) return reply(429, { error: 'locked', retry: Math.ceil((a.locked - now) / 1000) });
      if(!same(await pbkdf2(String(body.password || ''), a.salt, a.iter), a.hash)){
        const fails = a.fails + 1, lock = fails >= FAILS;
        await db.prepare('UPDATE accounts SET fails = ?2, locked = ?3 WHERE name = ?1').bind(a.name, lock ? 0 : fails, lock ? now + LOCK_MS : 0).run();
        return lock ? reply(429, { error: 'locked', retry: LOCK_MS / 1000 }) : reply(401, { error: 'wrong' });
      }
      if(a.fails) await db.prepare('UPDATE accounts SET fails = 0 WHERE name = ?1').bind(a.name).run();
      return reply(200, { token: await session(db, a.family), name: a.display });
    }
    if(route === '/google'){
      const sub = await googleSub(body.credential, env);
      if(!sub) return reply(401, { error: 'google' });
      const mine = await familyOf(db, req);
      if(mine){       // logged in already: this Google account now opens this family
        await db.prepare('INSERT OR REPLACE INTO google (sub, family) VALUES (?1, ?2)').bind(sub, mine).run();
        return reply(200, { linked: true, name: await nameOf(db, mine) });
      }
      const row = await db.prepare('SELECT family FROM google WHERE sub = ?1').bind(sub).first();
      const family = row ? row.family : newFamily();
      if(!row) await db.prepare('INSERT INTO google (sub, family) VALUES (?1, ?2)').bind(sub, family).run();
      return reply(row ? 200 : 201, { token: await session(db, family), name: await nameOf(db, family) });
    }

    const family = await familyOf(db, req);
    if(!family) return reply(401, { error: 'login' });
    if(route === '/logout'){
      await db.prepare('DELETE FROM sessions WHERE hash = ?1').bind(await sha256(req.headers.get('authorization').slice(7))).run();
      return reply(200, {});
    }

    const since = Number.isInteger(body.since) && body.since >= 0 ? body.since : 0;
    const writes = [];
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
      account: await nameOf(db, family),     // the family name, or null for a family made with Google alone
      now
    });
  }
};
