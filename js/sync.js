/* ---------- sync between devices ----------
   One family code, made on the first device and pasted on the others, names the family's
   data on the Worker in worker/. Each sync sends what the server has not had from this
   device and merges back what it has not had from the server: rounds are a set union by
   id, players are last-edit-wins on `updated`, a player's resetAt drops her older rounds,
   and a deleted player travels as a tombstone in PLAYERS.gone. The artifact copy has its
   own database and does not use this. */
const SYNC_URL = (() => { try { return localStorage.getItem('crossingten.syncurl'); } catch(e){ return null; } })()
  || '';                                         // the deployed Worker; empty keeps sync out of sight
const FKEY = 'crossingten.family';
let FAMILY = null;                              // { code, cursor, sent:{player:[ids]}, at }
try { FAMILY = JSON.parse(localStorage.getItem(FKEY)); } catch(e){}
const saveFamily = () => { try { FAMILY ? localStorage.setItem(FKEY, JSON.stringify(FAMILY)) : localStorage.removeItem(FKEY); } catch(e){} };
const SYNC_ON = !!SYNC_URL && !window.claude && typeof fetch === 'function';

// 16 characters of Crockford base32: 80 random bits, shown as four groups of four.
const B32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const newCode = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), b => B32[b & 31]).join('');
const showCode = c => c.match(/.{4}/g).join('-');
function readCode(text){
  const c = String(text || '').toUpperCase().replace(/[^0-9A-Z]/g, '').replace(/[IL]/g, '1').replace(/O/g, '0');
  const m = c.match(/[0-9A-HJKMNP-TV-Z]{16}/);
  return m ? m[0] : null;
}

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

let syncing = null;
function syncNow(){
  if(!SYNC_ON || !FAMILY) return Promise.resolve(false);
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
        const res = await fetch(SYNC_URL + '/sync/' + FAMILY.code, { method:'POST', headers:{ 'content-type':'application/json' },
          body: JSON.stringify({ since: FAMILY.cursor || 0, players: PLAYERS.list.map(p => Object.assign({ updated:0 }, p)),
                                 gone: PLAYERS.gone || [], rounds: batch }) });
        if(!res.ok) throw new Error('sync ' + res.status);
        const r = await res.json();
        batch.forEach(x => (FAMILY.sent[x.player] = FAMILY.sent[x.player] || []).push(x.round.id));
        reload = mergeFromServer(r) || reload;
        FAMILY.cursor = r.cursor;
        if(!r.more && out.length <= batch.length) break;
      }
      // only ids still held here need remembering
      PLAYERS.list.forEach(p => { const here = new Set(roundsOf(p).map(x => x.id)); FAMILY.sent[p.id] = FAMILY.sent[p.id].filter(id => here.has(id)); });
      Object.keys(FAMILY.sent).forEach(id => { if(!PLAYERS.list.some(p => p.id === id)) delete FAMILY.sent[id]; });
      FAMILY.at = Date.now(); FAMILY.failed = false;
    } catch(e){ FAMILY.failed = true; }
    saveFamily();
    paintSync();
    if(!$('stats').hidden) renderStats();
    syncing = null;
    if(reload){ chose(); location.reload(); }
    return !FAMILY.failed;
  })();
  return syncing;
}

function paintSync(){
  if(!SYNC_ON){ $('syncRow').hidden = true; return; }
  $('syncOff').hidden = !!FAMILY; $('syncOnRow').hidden = !FAMILY;
  if(!FAMILY) return;
  $('syncCode').textContent = showCode(FAMILY.code);
  $('synced').textContent = (FAMILY.failed ? t('syncFailed') : FAMILY.at ?
    t('syncedAt', new Date(FAMILY.at).toLocaleTimeString(LANG_TAG[LANG], { hour:'2-digit', minute:'2-digit' })) : t('syncing')) + builtOn();
}
function startSync(code){
  FAMILY = { code, cursor:0, sent:{}, at:0 };
  saveFamily(); paintSync();
  return syncNow();
}
$('syncStart').onclick = () => { startSync(newCode()); };
$('syncJoin').onclick = () => {
  const take = code => {
    const c = readCode(code);
    if(!c){ say(t('syncBadCode')); return; }
    startSync(c).then(ok => { if(ok) say(t('syncJoined')); });
  };
  if(navigator.clipboard && navigator.clipboard.readText) navigator.clipboard.readText().then(take, () => take(prompt(t('syncPrompt'))));
  else take(prompt(t('syncPrompt')));
};
$('syncCopy').onclick = () => {
  const c = showCode(FAMILY.code);
  navigator.clipboard.writeText(c).then(() => say(t('syncCopiedCode')), () => prompt(t('syncPrompt'), c));
};
$('syncLeave').onclick = () => { FAMILY = null; saveFamily(); paintSync(); say(heldHere()); };

// Sync on launch, whenever the app comes back to the screen, and soon after a round.
let syncTimer = null;
const syncSoon = () => { clearTimeout(syncTimer); syncTimer = setTimeout(syncNow, 800); };
document.addEventListener('visibilitychange', () => { if(document.visibilityState === 'visible') syncSoon(); });
paintSync();
syncNow();
