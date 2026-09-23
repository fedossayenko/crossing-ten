/* ---------- sync between devices ----------
   A family account (a family name and password, or a linked Google account) on the Worker
   in worker/ holds the family's data; each device logs in once and keeps a session token.
   Each sync sends what the server has not had from this device and merges back what it has
   not had from the server: rounds are a set union by id, players are last-edit-wins on
   `updated`, a player's resetAt drops her older rounds, and a deleted player travels as a
   tombstone in PLAYERS.gone. The artifact copy has its own database and does not use this. */
const SYNC_URL = (() => { try { return localStorage.getItem('crossingten.syncurl'); } catch(e){ return null; } })()
  || 'https://crossing-ten-sync.sayenkofedor.workers.dev';   // worker/, deployed with wrangler
// Google sign-in's web client id (Google Cloud console → Credentials); empty hides the button.
const GOOGLE_ID = '760532949353-54t42jkfsrt9h7s5kne97u0r4p5qcvsf.apps.googleusercontent.com';
const FKEY = 'crossingten.family';
// { token, name, account, cursor, sent:{player:[ids]}, at, failed }; a device from before accounts holds
// only { code }, which its first signup turns into the account's family.
let FAMILY = null;
try { FAMILY = JSON.parse(localStorage.getItem(FKEY)); } catch(e){}
const saveFamily = () => { try { FAMILY ? localStorage.setItem(FKEY, JSON.stringify(FAMILY)) : localStorage.removeItem(FKEY); } catch(e){} };
const SYNC_ON = !!SYNC_URL && !window.claude && typeof fetch === 'function';
const IN = () => !!(FAMILY && FAMILY.token);

// Every player's rounds, from her own storage key (the current player's are in LOCAL).
function roundsOf(p){
  if(p.id === PLAYER.id) return LOCAL.rounds;
  try { return (JSON.parse(localStorage.getItem(roundsKey(p))) || {}).rounds || []; } catch(e){ return []; }
}
function keepRounds(p, rounds){
  rounds = rounds.sort((a, b) => a.ts - b.ts).slice(-400);
  if(p.id === PLAYER.id){ LOCAL.rounds = rounds; saveLocal(); W = weightsFrom(LOCAL.rounds); return; }
  try {
    const kept = JSON.parse(localStorage.getItem(roundsKey(p))) || { muted:false, speak:true, n:10 };
    kept.rounds = rounds;
    localStorage.setItem(roundsKey(p), JSON.stringify(kept));
  } catch(e){}
}

function mergeFromServer(r){
  let reload = false;
  PLAYERS.gone = PLAYERS.gone || [];
  (r.gone || []).forEach(g => {
    const mine = PLAYERS.list.find(p => p.id === g.id);
    if(mine && (mine.updated || 0) > g.updated) return;              // edited here after it was deleted there
    if(!PLAYERS.gone.some(x => x.id === g.id)) PLAYERS.gone.push(g);
    if(!mine) return;
    PLAYERS.list = PLAYERS.list.filter(p => p.id !== g.id);
    try { localStorage.removeItem(roundsKey(mine)); } catch(e){}
    if(mine.id === PLAYER.id) reload = true;
  });
  (r.players || []).forEach(p => {
    if(PLAYERS.gone.some(g => g.id === p.id && g.updated >= (p.updated || 0))) return;
    const mine = PLAYERS.list.find(x => x.id === p.id);
    if(!mine) PLAYERS.list.push(p);
    else if((p.updated || 0) > (mine.updated || 0)){
      if(p.id === PLAYER.id && (p.lang !== mine.lang || p.mascot !== mine.mascot)) reload = true;
      Object.assign(mine, p);
    }
  });
  if(!PLAYERS.list.length) PLAYERS.list = [{ id:'p1', name:'', mascot:'cat', lang:LANG }];
  if(!PLAYERS.list.some(p => p.id === PLAYERS.cur)) PLAYERS.cur = PLAYERS.list[0].id;
  savePlayers();
  // rounds: add what is new, drop what a reset has cleared
  const incoming = {};
  (r.rounds || []).forEach(x => (incoming[x.player] = incoming[x.player] || []).push(x.round));
  PLAYERS.list.forEach(p => {
    const have = roundsOf(p), cut = p.resetAt || 0;
    const ids = new Set(have.map(x => x.id));
    const add = (incoming[p.id] || []).filter(x => x && x.id && !ids.has(x.id));
    const kept = have.filter(x => x.ts >= cut);
    if(add.length || kept.length !== have.length) keepRounds(p, kept.concat(add.filter(x => x.ts >= cut)));
    FAMILY.sent[p.id] = [...new Set((FAMILY.sent[p.id] || []).concat((incoming[p.id] || []).map(x => x.id)))];
  });
  return reload;
}

async function account(path, body){
  const headers = { 'content-type':'application/json' };
  if(IN()) headers.authorization = 'Bearer ' + FAMILY.token;
  const res = await fetch(SYNC_URL + path, { method:'POST', headers, body: JSON.stringify(body || {}) });
  return { status: res.status, body: await res.json().catch(() => ({})) };
}

let syncing = null;
function syncNow(){
  if(!SYNC_ON || !IN()) return Promise.resolve(false);
  if(syncing) return syncing;
  syncing = (async () => {
    let reload = false;
    try {
      FAMILY.sent = FAMILY.sent || {};
      for(let page = 0; page < 20; page++){
        const out = [];
        PLAYERS.list.forEach(p => {
          const sent = new Set(FAMILY.sent[p.id] || []);
          roundsOf(p).forEach(r => { if(!sent.has(r.id)) out.push({ player:p.id, round:r }); });
        });
        const batch = out.slice(0, 1500);
        const res = await account('/sync', { since: FAMILY.cursor || 0, players: PLAYERS.list.map(p => Object.assign({ updated:0 }, p)),
                                            gone: PLAYERS.gone || [], rounds: batch });
        if(res.status === 401){ FAMILY = null; break; }          // this session was logged out
        if(res.status !== 200) throw new Error('sync ' + res.status);
        const r = res.body;
        batch.forEach(x => (FAMILY.sent[x.player] = FAMILY.sent[x.player] || []).push(x.round.id));
        reload = mergeFromServer(r) || reload;
        FAMILY.account = r.account;          // null: a family made with Google alone, still without a family name
        FAMILY.cursor = r.cursor;
        if(!r.more && out.length <= batch.length) break;
      }
      if(FAMILY){
        // only ids still held here need remembering
        PLAYERS.list.forEach(p => { const here = new Set(roundsOf(p).map(x => x.id)); FAMILY.sent[p.id] = (FAMILY.sent[p.id] || []).filter(id => here.has(id)); });
        Object.keys(FAMILY.sent).forEach(id => { if(!PLAYERS.list.some(p => p.id === id)) delete FAMILY.sent[id]; });
        FAMILY.at = Date.now(); FAMILY.failed = false;
      }
    } catch(e){ FAMILY.failed = true; }
    saveFamily();
    paintSync();
    if(!$('stats').hidden) renderStats();
    if(!$('parent').hidden) renderParent();
    syncing = null;
    if(reload){ chose(); location.reload(); }
    return IN() && !FAMILY.failed;
  })();
  return syncing;
}

function paintSync(){
  $('playersSync').hidden = !SYNC_ON || !IN();
  if(!SYNC_ON){ $('syncRow').hidden = true; return; }
  $('syncOff').hidden = $('syncOffTitle').hidden = IN();
  $('syncOnRow').hidden = $('syncOnTitle').hidden = !IN();
  $('syncSetPass').hidden = !IN() || FAMILY.account !== null;
  if(!IN()){ $('gLink').hidden = true; return; }
  $('syncCode').textContent = FAMILY.account || FAMILY.name || '';
  const line = FAMILY.failed ? t('syncFailed') : FAMILY.at ?
    t('syncedAt', new Date(FAMILY.at).toLocaleTimeString(LANG_TAG[LANG], { hour:'2-digit', minute:'2-digit' })) : t('syncing');
  $('synced').textContent = line + builtOn();
  $('playersSynced').textContent = line;
  googleButton($('gLink'));        // logged in, it links a Google account to this family
}

/* ---------- logging in ---------- */
let LOGIN_WELCOME = false, SETTING = false;
// welcome: from a new device's welcome screen; set: a Google family choosing a family name and password
function openLogin(welcome, set){
  LOGIN_WELCOME = !!welcome; SETTING = !!set;
  $('lLogin').hidden = SETTING;
  $('gSign').hidden = true;
  $('lSub').textContent = t(SETTING ? 'setPassSub' : 'accountSub');
  $('lSignup').textContent = t(SETTING ? 'setPass' : 'signUp');
  $('lSignup').className = SETTING ? 'btn' : 'btn ghost';
  $('lPass').autocomplete = SETTING ? 'new-password' : 'current-password';
  $('lMsg').textContent = '';
  $('lPass').value = '';
  $('login').hidden = false;
  if(!SETTING) googleButton($('gSign'));
}
function loggedIn(token, name){
  // everything this device holds goes up once; the server keeps each round once
  FAMILY = { token, name, cursor:0, sent:{}, at:0 };
  saveFamily();
  $('login').hidden = true;
  paintSync();
  return syncNow().then(ok => {
    if(ok) say(t('syncJoined'));
    if(LOGIN_WELCOME){ savePlayers(); chose(); location.reload(); }   // a new device comes up as the family's players
  });
}
async function logIn(signup){
  const name = $('lName').value.trim(), password = $('lPass').value;
  if(name.length < 2){ $('lMsg').textContent = t('nameShort'); return; }
  if(password.length < 8){ $('lMsg').textContent = t('passShort'); return; }
  $('lLogin').disabled = $('lSignup').disabled = true;
  $('lMsg').textContent = t('syncing');
  let r = null;
  try { r = await account(signup ? '/signup' : '/login', { name, password, code: signup && FAMILY && FAMILY.code || undefined }); } catch(e){}
  $('lLogin').disabled = $('lSignup').disabled = false;
  if(r && r.body.token && SETTING){     // same family, now with a name and password too
    Object.assign(FAMILY, { token: r.body.token, name: r.body.name, account: r.body.name });
    saveFamily(); $('login').hidden = true; paintSync(); say(t('passSet'));
    return;
  }
  if(r && r.body.token) return loggedIn(r.body.token, r.body.name);
  $('lMsg').textContent = !r ? t('syncFailed') : r.status === 409 ? t('nameTaken') : r.status === 429 ?
    t('locked', Math.ceil((r.body.retry || 900) / 60)) : r.status === 401 ? t('wrongPass') : t('syncFailed');
}
$('lForm').onsubmit = e => { e.preventDefault(); logIn(SETTING); };
$('lSignup').onclick = () => logIn(true);
$('loginBack').onclick = () => { $('login').hidden = true; };
$('syncLogin').onclick = () => openLogin(false);
$('syncSetPass').onclick = () => openLogin(false, true);
// On a new device's welcome screen: log in, and come up as the family's players.
$('welcomeJoin').onclick = () => openLogin(true);
$('syncLeave').onclick = () => {
  if(IN()) account('/logout').catch(() => {});
  FAMILY = null; saveFamily(); paintSync(); say(heldHere());
};

// Google: its button hands back a signed ID token, which the Worker checks with Google.
function googleButton(el){
  if(!GOOGLE_ID || !SYNC_ON) return;
  const draw = () => {
    google.accounts.id.initialize({ client_id: GOOGLE_ID, callback: r => googleIn(r.credential) });
    el.innerHTML = '';
    google.accounts.id.renderButton(el, { theme:'outline', size:'large', shape:'pill', locale:LANG, text: IN() ? 'continue_with' : 'signin_with' });
    el.hidden = false;
  };
  if(window.google && google.accounts) return draw();
  if(document.getElementById('gsi')) return;
  const s = document.createElement('script');
  s.id = 'gsi'; s.src = 'https://accounts.google.com/gsi/client'; s.onload = draw;
  document.head.appendChild(s);
}
async function googleIn(credential){
  let r = null;
  try { r = await account('/google', { credential }); } catch(e){}
  if(r && r.body.linked){ say(t('googleLinked')); return; }
  // a family made with Google alone has no family name; show whose Google it is instead
  let who = '';
  try { const p = JSON.parse(decodeURIComponent(escape(atob(credential.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))))); who = p.name || p.email || ''; } catch(e){}
  if(r && r.body.token) loggedIn(r.body.token, r.body.name || who);
  else $('lMsg').textContent = t('syncFailed');
}

// Sync on launch, whenever the app comes back to the screen, and soon after a round.
let syncTimer = null;
const syncSoon = () => { clearTimeout(syncTimer); syncTimer = setTimeout(syncNow, 800); };
document.addEventListener('visibilitychange', () => { if(document.visibilityState === 'visible') syncSoon(); });
paintSync();
syncNow();
