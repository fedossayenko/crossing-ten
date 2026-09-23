// Accounts and two devices syncing through the Worker. Run against `wrangler dev` (default) or a
// deployed Worker:  node worker/test.js [https://crossing-ten-sync.<you>.workers.dev]
// Against a deployed Worker every account it makes is deleted again at the end.
const crypto = require('crypto'), { execFileSync } = require('child_process');
const BASE = process.argv[2] || 'http://127.0.0.1:8787', LOCAL = /127\.0\.0\.1|localhost/.test(BASE);
const ALPHA = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const code = () => Array.from({ length: 16 }, () => ALPHA[crypto.randomInt(32)]).join('');
const call = async (path, body, token, raw) => {
  const headers = { 'content-type': 'application/json' };
  if(token) headers.authorization = 'Bearer ' + token;
  const r = await fetch(BASE + path, { method: 'POST', headers, body: raw !== undefined ? raw : JSON.stringify(body || {}) });
  return { status: r.status, body: await r.json().catch(() => null) };
};
const round = (id, ts, player = 'p1') => ({ player, round: { id, ts, day: '2026-09-23', level: 2, n: 10, firstTry: 8, seen: [], missed: [] } });
const ok = (cond, what) => { if(!cond) throw new Error(what); };
// Everything a device would learn by syncing from the start.
async function pull(token){
  let since = 0, rounds = [], last;
  for(let i = 0; i < 20; i++){
    last = (await call('/sync', { since }, token)).body;
    rounds = rounds.concat(last.rounds);
    since = last.cursor;
    if(!last.more) break;
  }
  return { rounds, players: last.players, gone: last.gone, cursor: since };
}
// A stand-in for Google: worker/.dev.vars gives `wrangler dev` this key's public half.
const GOOGLE_KEY = crypto.createPrivateKey({ format: 'der', type: 'pkcs8', key: Buffer.from('MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCMxRsGCjE00Tljquk8EncYGUqnWPVRRBOsykcCCd6zLgSmcwHyxrjFq+XHI5sZWWH1WLzQw4zMecfjze7YRU2nOlp/4Re4Xpw3sugZ6Ser/niixbaKOCN1SfDeuaf75IMeT1nPQEjvZ9CrFHbBFJcCiBchjlp/P2q3eSChbFxopr1PqnW2ucGKnm0SbJx4EV6mBC3wQgCFEAG70hiVGchpdvvK/T29pczaDVEfsbhGG0se6hUI09omAhmvPSTGfVHvNoylnXWBKpA/uhXRWXDxs1eUXZNve21S00vjqbZmgoaDvOo2oNRJBXqDkENWf0Ls5IzjJxZRcZW9Xs10s+bNAgMBAAECggEAFXjRROwUEl7hlprQxbl5UgM1mG4gyTsNlzspdp2jywf3bJ45S1tVfs1YGLaNJ2IzZ3WYI23Yka33t/9G8dUsYZgsirn+YMCJqpNPBPjD9N+1bfqje9TRT8guBgMipPD3sQ1ggRToqx/WO+o8rPnjiN7STGuG0UcOk5rVx9mcBNhEMIpy+bpYYsOnPMkcUNeh9D+B/RPZCVlKD7zsCP+3sMsc/wey3esTIfNX9hRS1DHMmlD9rG1+HJ0V2tuRv0i3MQLT4X/A1OQOYATkX/pRVVfGCaTS6vdp+C82rj82xI3Hz2Ja4ZcfgLf8v2wUPd/zMPqaHRPaiSXOXb6zyqV+oQKBgQDEi9lXmFIFW/6zzbaKkv7+uhfDgLwro9zlVpGl70hpQTH3BXJ6ARHe3rIQ6g5THJjw3OJgZO6q79DxkexnvAopgsg/2kzkO5Kq0wWQg2cis4AhX+9sQsvpOzd3nL8Zg+XA6zT4EmswDQlQ6rXcGVWGRmPnMWgX6YA0gKagrs5U3QKBgQC3WgxdEulQQ129/qyxxdSFfjPvf2RH6P0+qNweI+JiTpKlETlu5CHkP/NezSjBlZ04uFQL0/jJfXt5huCh7LgCG1OoGDcKJ7+8pzpEKJqMbiMlKgYW5ILUeeq1URlFoOyV7u5zpboM4GhZMZOdrATyrKDcZzzVVEd9V3qiuA+CsQKBgCtbUkmRb16BSbFuSrtM6/VTJdTZvCjAUAVDUIPTQhz95cDBMdyaCdApPgyfJSPOZiqT/1gWS9PnbScs8oJ7p546nGQBiv656YPHYy3a3tB32mcCW7V9ErBTgMvhBwLg5rjk6d1jasPBzHFOJWn1KLmjI3ynmHfV6ZMrYhaGGTv9AoGAbkD+6EUD+ZjY2PQ5ApmUp0Vxk5YGRlurVS+TVah8bGMVOZ926uDSJH/0J9C0rlv6c+4b1BT+KKOFSVm64IQJTnMCRjVxe3DVkmr41Z2Y+dMM3T889C0rIvvBEJEY4k7XlX1c9Dv2+eFDvkbanlifjRITlRWbdii86HlfLFQEN7ECgYAVox5DdzpwyLTO0jiPYkxQ1LXXEQAUytImJZ5XqYYTclqvakYpebU4ZAvFy8/jRrKzefp+Tu/Jlb4bhWA4blr9+b7vKnNPRmJ2s1gNB1xus2qzTAgiWi+s1VEoJl4sTZPH/qPFw5PXUykYppIwx1opGTRQXynRaOY0SAMASvjYMg==', 'base64') });
const googleToken = (sub, over = {}) => {
  const b = o => Buffer.from(JSON.stringify(o)).toString('base64url');
  const head = b({ alg: 'RS256', kid: 'test', typ: 'JWT' });
  const body = b(Object.assign({ iss: 'https://accounts.google.com', aud: 'test-client', sub, exp: Math.floor(Date.now() / 1000) + 600 }, over));
  return head + '.' + body + '.' + crypto.sign('sha256', Buffer.from(head + '.' + body), GOOGLE_KEY).toString('base64url');
};
const made = [];      // family names to clear from a deployed database afterwards
const tag = 'test-' + crypto.randomBytes(4).toString('hex');
const signup = async (name, extra, token) => { made.push(name); return call('/signup', Object.assign({ name, password: 'correct horse' }, extra), token); };

(async () => {
  // a browser asks first (the JSON body and the Bearer header make it a preflighted request)
  const pre = await fetch(BASE + '/sync', { method: 'OPTIONS', headers: { origin: 'https://fedossayenko.github.io',
    'access-control-request-method': 'POST', 'access-control-request-headers': 'content-type, authorization' } });
  ok(pre.status === 204 && pre.headers.get('access-control-allow-origin') === '*' &&
     /authorization/.test(pre.headers.get('access-control-allow-headers')), 'the browser preflight should be allowed: ' + pre.status);
  // the door: only the five routes, only POST, only a well-formed body, only with a session
  ok((await fetch(BASE + '/sync')).status === 404, 'GET should be refused');
  ok((await call('/sync/' + code(), {})).status === 404, 'the old code-only route should be gone');
  ok((await call('/sync', {})).status === 401, 'sync without a session should be refused');
  ok((await call('/sync', {}, 'x'.repeat(43))).status === 401, 'a made-up token should be refused');
  ok((await call('/signup', null, null, '{not json')).status === 400, 'a malformed body should be refused');
  ok((await call('/signup', null, null, 'x'.repeat(600 * 1024))).status === 413, 'an oversized body should be refused');

  // an account: a short password or name is refused, a name is taken once, whatever its case
  const fam = 'Сайенко ' + tag;
  ok((await call('/signup', { name: fam, password: 'short' })).body.error === 'password', 'a short password should be refused');
  ok((await call('/signup', { name: 'x', password: 'long enough' })).body.error === 'name', 'a one-letter name should be refused');
  const A = (await signup(fam)).body.token;
  ok(A, 'signup should hand back a session');
  ok((await signup('  САЙЕНКО   ' + tag.toUpperCase() + ' ')).status === 409, 'the same name in other case should be taken');
  // a second device logs in; a wrong password is refused and five in a row lock the account
  const B = (await call('/login', { name: 'сайенко ' + tag, password: 'correct horse' })).body.token;
  ok(B && B !== A, 'login should hand back a second session');
  ok((await call('/login', { name: fam, password: 'wrong horse' })).status === 401, 'a wrong password should be refused');
  ok((await call('/login', { name: 'nobody ' + tag, password: 'correct horse' })).status === 401, 'an unknown name should be refused');

  // device A syncs two rounds; device B gets them
  const a1 = (await call('/sync', { since: 0, players: [{ id: 'p1', name: 'Ани', mascot: 'cat', lang: 'bg', updated: 5 }],
    rounds: [round('r1', 1000), round('r2', 2000)] }, A)).body;
  ok(a1.rounds.length === 2 && a1.players[0].name === 'Ани', 'A should read back what it sent');
  const b1 = await pull(B);
  ok(b1.rounds.map(r => r.round.id).join() === 'r1,r2' && b1.players.length === 1, 'B should get both rounds and the player');
  // B plays a round; A, syncing from where it stopped, gets only that one
  await call('/sync', { since: b1.cursor, rounds: [round('r3', 3000)] }, B);
  const a2 = (await call('/sync', { since: a1.cursor }, A)).body;
  ok(a2.rounds.map(r => r.round.id).join() === 'r3', 'A should get only the new round');
  // a round sent twice is kept once; junk is ignored, not stored
  await call('/sync', { since: 0, rounds: [round('r1', 1000), { player: 'p1', round: { id: 'bad id!', ts: 1 } },
    { player: 'p1', round: { id: 'big', ts: 4000, pad: 'x'.repeat(5000) } }, { player: '../x', round: { id: 'r9', ts: 1 } }] }, A);
  ok((await pull(A)).rounds.length === 3, 'duplicates and junk must not be stored');

  // players: the later edit wins, whichever device sends it last
  await call('/sync', { since: 0, players: [{ id: 'p1', name: 'Old', mascot: 'cat', lang: 'bg', updated: 3 }] }, B);
  ok((await pull(A)).players[0].name === 'Ани', 'an older edit must not overwrite a newer one');
  await call('/sync', { since: 0, players: [{ id: 'p1', name: 'Ани', mascot: 'fox', lang: 'uk', updated: 9 }] }, B);
  ok((await pull(A)).players[0].mascot === 'fox', 'a newer edit must win');
  // reset: her rounds from before the reset go, on the server and so on every device
  await call('/sync', { since: 0, players: [{ id: 'p1', name: 'Ани', mascot: 'fox', lang: 'uk', updated: 10, resetAt: 2500 }] }, A);
  ok((await pull(B)).rounds.map(r => r.round.id).join() === 'r3', 'a reset should drop the rounds before it');
  // a deleted player: tombstone kept, rounds gone, and a stale edit does not bring her back
  await call('/sync', { since: 0, players: [{ id: 'p2', name: 'Иво', mascot: 'owl', lang: 'en', updated: 11 }], rounds: [round('q1', 5000, 'p2')] }, A);
  await call('/sync', { since: 0, gone: [{ id: 'p2', updated: 12 }] }, B);
  const g = await pull(A);
  ok(g.gone.some(x => x.id === 'p2') && !g.players.some(p => p.id === 'p2') && !g.rounds.some(r => r.player === 'p2'),
    'a deleted player should be gone everywhere, with her rounds');
  await call('/sync', { since: 0, players: [{ id: 'p2', name: 'Иво', mascot: 'owl', lang: 'en', updated: 11 }] }, A);
  ok(!(await pull(B)).players.some(p => p.id === 'p2'), 'a stale edit must not resurrect a deleted player');
  // a long history comes down in pages
  const many = [];
  for(let i = 0; i < 1200; i++) many.push(round('m' + i, 10000 + i));
  await call('/sync', { since: 0, rounds: many.slice(0, 600) }, A);
  await call('/sync', { since: 0, rounds: many.slice(600) }, A);
  const all = await pull(B);
  ok(all.rounds.length === 1201 && new Set(all.rounds.map(r => r.round.id)).size === 1201, 'paging should deliver every round once: ' + all.rounds.length);

  // families never see each other; logging out ends only that session
  const C = (await signup('other ' + tag)).body.token;
  ok((await pull(C)).rounds.length === 0, 'another family must see nothing');
  ok((await call('/logout', {}, B)).status === 200 && (await call('/sync', {}, B)).status === 401, 'a logged-out session should stop working');
  ok((await call('/sync', {}, A)).status === 200, 'logging out one device must leave the other logged in');

  // an old family code becomes an account and keeps its data; a code is claimed once
  const old = code();
  if(LOCAL){      // plant a family from before accounts, the way the old code-only sync stored it
    execFileSync('/opt/homebrew/bin/npx', ['wrangler@4', 'd1', 'execute', 'crossing-ten', '--local', '--command',
      `INSERT INTO rounds (family, player, id, ts, body) VALUES ('${old}', 'p1', 'old1', 1, '{"id":"old1","ts":1}')`], { cwd: __dirname, stdio: 'ignore' });
  }
  const M = (await signup('migrated ' + tag, { code: old })).body.token;
  ok(M && (!LOCAL || (await pull(M)).rounds.some(r => r.round.id === 'old1')), 'a migrated family should keep its rounds');
  ok((await signup('thief ' + tag, { code: old })).status === 409, 'a family code should be claimed only once');
  ok((await signup('bad ' + tag, { code: 'nope' })).status === 400, 'a malformed code should be refused');

  // lockout: five wrong passwords in a row, then even the right one waits
  for(let i = 0; i < 4; i++) await call('/login', { name: fam, password: 'wrong horse' });
  const locked = await call('/login', { name: fam, password: 'correct horse' });
  ok(locked.status === 429 && locked.body.retry > 0, 'five wrong passwords should lock the account: ' + locked.status);

  // Google: a forged or foreign token is refused everywhere
  ok((await call('/google', { credential: 'a.b.c' })).status === 401, 'a junk Google token should be refused');
  if(LOCAL){
    const sub = 'g-' + tag;
    ok((await call('/google', { credential: googleToken(sub, { aud: 'someone-else' }) })).status === 401, 'another app’s Google token should be refused');
    ok((await call('/google', { credential: googleToken(sub, { exp: 1 }) })).status === 401, 'an expired Google token should be refused');
    ok((await call('/google', { credential: googleToken(sub).slice(0, -4) + 'AAAA' })).status === 401, 'a tampered Google token should be refused');
    // linked from a logged-in device, the Google account then opens that same family
    ok((await call('/google', { credential: googleToken(sub) }, A)).body.linked, 'a logged-in device should link Google');
    const G = await call('/google', { credential: googleToken(sub) });
    ok(G.status === 200 && G.body.name === fam && (await pull(G.body.token)).rounds.length === 1201, 'Google should open the linked family');
    // a Google account never seen before starts a new family, which can take a password later
    const N = await call('/google', { credential: googleToken('new-' + tag) });
    ok(N.status === 201 && (await pull(N.body.token)).rounds.length === 0, 'a new Google account should start an empty family');
    await call('/sync', { rounds: [round('n1', 1)] }, N.body.token);
    const NP = (await signup('google family ' + tag, {}, N.body.token)).body.token;
    ok(NP && (await pull(NP)).rounds.some(r => r.round.id === 'n1'), 'a password added to a Google family should open the same family');
  }
  console.log('sync: accounts, lockout, ' + (LOCAL ? 'Google, ' : '') + 'migration, merging, paging, last-edit-wins, reset, deletion and family isolation all hold against ' + BASE);
})().catch(e => { console.error('sync: FAILED - ' + e.message); process.exitCode = 1; }).finally(() => {
  if(LOCAL) return;
  // a deployed database keeps nothing of the test: its accounts, their families' rows and sessions
  const names = made.map(n => "'" + n.normalize('NFC').trim().replace(/\s+/g, ' ').toLowerCase().replace(/'/g, "''") + "'").join(',');
  const fams = `(SELECT family FROM accounts WHERE name IN (${names}))`;
  execFileSync('/opt/homebrew/bin/npx', ['wrangler@4', 'd1', 'execute', 'crossing-ten', '--remote', '--command',
    ['rounds', 'players', 'sessions', 'google'].map(t => `DELETE FROM ${t} WHERE family IN ${fams};`).join(' ') +
    ` DELETE FROM accounts WHERE name IN (${names});`], { cwd: __dirname, stdio: 'inherit' });
});
