import { $, rnd, seeded, shuffle } from './core.js';
import { accepts, answer, answers, drawQ, eqText, factKey, gen, genForFact, raw, setW, slipOf, why } from './questions.js';
import { LEVELS, PICK_GROUPS, groupKey } from './levels.js';
import { FIRST, PLAYER, PLAYERS, roundsKey, savePlayers } from './players.js';
import { ARCHIVE, keeps, unionRounds } from './archive.js';
import { LANG, LANGS, LANG_TAG, levelDesc, levelName, setLang, t } from './i18n.js';
import { MASCOTS, mascotSvg, wearMascot } from './mascots.js';
import { choiceHtml, letterOf, withChoices } from './choice.js';
import { COMP_MIN, COMP_N, compAnswer, compEnd, paintCompCard, compLeft, compTasks, compTime, startComp, startCompete } from './compete.js';
import { showToday } from './ui/today.js';
import { showNotebook } from './ui/notebook.js';
import { shareWeekly, weeklyPng } from './weekly.js';
import { IN, SYNC_ON, paintSync, startSync, syncNow, syncSoon, syncing } from './sync.js';
/* ---------- screens and the address ----------
   Each screen has an address (#/levels, #/badges …), so a reload and the back gesture of an installed app land
   where they should. A screen's sheet shows when its address does; nothing else opens or closes them. go()
   pushes a step (back returns from it) or, with replace, swaps the current one (a tab, a round starting). */
const ROUTES = {
  play: null,
  today: { sheet: 'today', show: () => showToday($('todayIn')) },
  levels: { sheet: 'picker', show: () => { buildPicker(); paintCompCard(); $('pickWarn').hidden = !midRound(); } },   // the paper's card too, however the page is reached
  badges: { sheet: 'stats', show: () => showStats() },
  parents: { sheet: 'parent', show: () => renderParent() },
  players: { sheet: 'players', show: () => paintPlayers() },
  notebook: { sheet: 'notebook', show: () => showNotebook($('notebookIn')) },
};
const routeOfAddress = () => { const r = (location.hash.match(/^#\/([\w-]+)/) || [])[1]; return r && r in ROUTES ? r : 'play'; };
// The screen showing is kept here, not read back from the address: a browser may drop a history change
// (Chrome does past a few hundred in seconds), and the screen must not follow it there.
let ROUTE = routeOfAddress();
export const routeNow = () => ROUTE;
const TABBED = ['today', 'levels', 'badges', 'parents'];   // the sections the tab bar (sidebar on iPad) moves between
export function applyRoute(){
  const r = ROUTES[ROUTE];
  Object.values(ROUTES).forEach(x => { if(x && x !== r) $(x.sheet).hidden = true; });
  if(r){ r.show(); $(r.sheet).hidden = false; }
  const tabbed = TABBED.includes(ROUTE);
  $('tabs').hidden = !tabbed; document.body.classList.toggle('tabbed', tabbed);
  document.body.classList.toggle('pushed', !!(history.state && history.state.pushed));   // a tab's screen has ‹ only when opened from outside the tabs
  if(tabbed) paintTabWeek();
  document.querySelectorAll('#tabs button').forEach(b => b.setAttribute('aria-current', b.dataset.r === ROUTE ? 'page' : 'false'));
  keepAwake();   // the screen stays on only for a task
}
// history.state.depth counts the steps the app pushed, so back() never leaves the app
// From one tab's screen to another is a switch, not a step: nothing to go back to, the tab bar is there.
export function go(route, replace){
  replace = replace || (TABBED.includes(route) && TABBED.includes(ROUTE));
  ROUTE = route;
  const depth = (history.state && history.state.depth) || 0;
  try { history[replace ? 'replaceState' : 'pushState']({ depth: replace ? depth : depth + 1, pushed: !replace }, '', '#/' + route); } catch(e){}
  applyRoute();
}
// back: to the screen this one was opened from, or to the round when the app was opened straight on it
export function back(){ if(history.state && history.state.depth > 0) history.back(); else go('play', true); }
addEventListener('popstate', () => { ROUTE = routeOfAddress(); applyRoute(); });
// A sheet scrolled down: its title bar becomes glass, with the page passing under it (app.css .sheet.scrolled)
document.addEventListener('scroll', e => { const el = /** @type {HTMLElement} */ (e.target); if(el.classList && el.classList.contains('sheet')) el.classList.toggle('scrolled', el.scrollTop > 6); }, true);
const START_ROUTE = routeNow();   // the address it was opened (or reloaded) on

export const S = { level:2, qs:[], i:0, parts:[''], at:0, tries:0, revealed:false, settled:false, wrong:false, results:[], skipped:[], t0:0, timers:[] };

/* ---------- local log ---------- */
const LS = roundsKey(PLAYER);
export let LOCAL = { rounds:[], muted:false, n:10, calm:false, whys:0, choice:false, next:/** @type {{ at:string, date:string } | undefined} */ (undefined) };
// a competition under way (js/compete.js), and its clock
export let COMP = null, compTick = null;
export function setComp(c, tick){ COMP = c; compTick = tick; }   // compete.js starts one
try { const raw0 = localStorage.getItem(LS); if(raw0) LOCAL = Object.assign(LOCAL, JSON.parse(raw0)); } catch(e){}
// calm: the player's own "less motion", on top of the system setting
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches || !!LOCAL.calm;
document.documentElement.classList.toggle('calm', !!LOCAL.calm);
// localStorage holds the settings and the last 400 rounds; the archive (js/archive.js) holds them all.
// Full storage keeps fewer recent rounds here rather than losing the settings.
export function saveStore(key, store){
  for(const keep of [400, 100, 0]) try { localStorage.setItem(key, JSON.stringify(Object.assign({}, store, { rounds: keep ? store.rounds.slice(-keep) : [] }))); return; } catch(e){}
}
export function saveLocal(){ saveStore(LS, LOCAL); }
export const lsRounds = p => { try { return (JSON.parse(localStorage.getItem(roundsKey(p))) || {}).rounds || []; } catch(e){ return []; } };
// Every player's whole log: the archive and the last 400 in localStorage, merged before the first question
// (the current player's lands in LOCAL.rounds, the others' in ARCH). A database that does not answer in
// 2 s does not hold up the first question; its rounds still merge in when it does.
export const ARCH = {};
export const ARCHIVE_READY = Promise.race([
  Promise.all(PLAYERS.list.map(p => ARCHIVE.all(p.id).then(rs => {
    const here = p.id === PLAYER.id ? LOCAL.rounds : lsRounds(p), known = new Set(rs.map(r => r.id));
    ARCHIVE.put(p.id, here.filter(r => !known.has(r.id)));          // rounds from before the archive
    const all = unionRounds(rs, here).filter(keeps(p));
    ARCHIVE.dropIds(p.id, p.dropped || []);
    if(p.id === PLAYER.id){ LOCAL.rounds = unionRounds(all, LOCAL.rounds).filter(keeps(p)); setW(weightsFrom(LOCAL.rounds)); }
    else ARCH[p.id] = unionRounds(all, ARCH[p.id] || []);
  }))),
  new Promise(res => setTimeout(res, 2000))
]);

/* ---------- language and mascot ---------- */
document.documentElement.lang = LANG;
function applyText(){
  document.documentElement.lang = LANG;
  document.querySelectorAll('[data-t]').forEach(el => { el.textContent = t(el.dataset.t); });
  document.querySelectorAll('[data-t-aria]').forEach(el => {
    el.setAttribute('aria-label', t(el.dataset.tAria));
    if(el.classList.contains('icon')) el.title = t(el.dataset.tAria);
  });
}
applyText();
wearMascot($('cat'), PLAYER.mascot);

/* ---------- sound ---------- */
let AC = null;
function actx(){
  if(!AC){ try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){ return null; } }
  if(AC.state === 'suspended') AC.resume();
  return AC;
}
function tone(freq, at, dur, peak, type){
  const c = actx(); if(!c) return;
  const o = c.createOscillator(), g = c.createGain();
  o.type = type || 'triangle'; o.frequency.value = freq;
  const t = c.currentTime + at;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + 0.02);
}
export const sfx = {
  good(){ if(LOCAL.muted) return; tone(660,0,.13,.18); tone(990,.1,.22,.15); },
  ok(){ if(LOCAL.muted) return; tone(560,0,.2,.14); },
  bad(){ if(LOCAL.muted) return; tone(233,0,.17,.13,'sine'); tone(196,.1,.24,.11,'sine'); },
  tap(){ if(LOCAL.muted) return; tone(880,0,.045,.05,'sine'); },
  tune(notes, gap){ if(LOCAL.muted) return; notes.forEach((f,k) => tone(f, k*gap, .3, .13)); }
};
// Sound on or off: a grown-up's setting (and in her profile), not a button beside the task
function paintMute(){ document.querySelectorAll('#soundSeg button').forEach(b => b.setAttribute('aria-pressed', String((b.dataset.m === '1') === !!LOCAL.muted))); }
document.querySelectorAll('#soundSeg button').forEach(b => b.onclick = () => { LOCAL.muted = b.dataset.m === '1'; paintMute(); saveLocal(); if(!LOCAL.muted) sfx.tap(); });
paintMute();

/* ---------- facts, weights, stats ---------- */
function factLabel(key){
  const parts = key.split(':'), pair = parts[1].split('-').map(Number);
  const o = pair[0], bo = pair[1];
  return parts[0] === '-' ? (o < bo ? (o+10) : o) + ' − ' + bo : o + ' + ' + bo;
}
export function weightsFrom(rounds){
  const seen = {}, miss = {};
  rounds.slice(-140).forEach(r => {
    (r.seen||[]).forEach(k => seen[k] = (seen[k]||0)+1);
    (r.missed||[]).forEach(k => miss[k] = (miss[k]||0)+1);
  });
  const m = {}; let max = 1;
  Object.keys(seen).forEach(k => { const w = 1 + 3*((miss[k]||0)/seen[k]); m[k] = w; if(w > max) max = w; });
  return { max, m };
}
const dayKey = ms => new Date(ms - new Date(ms).getTimezoneOffset()*60000).toISOString().slice(0,10);
export function statsFrom(rounds){
  let sums = 0, first = 0, perfect = 0;
  const lvl = {}, seen = {}, miss = {}, byOp = { '-':{seen:0,miss:0}, '+':{seen:0,miss:0} }, days = {}, langs = {};
  let bestRun = 0, clean10 = 0, fixed = 0, comps = 0;
  const grps = {};
  rounds.forEach(r => {
    sums += r.n; first += r.firstTry;
    if(r.n > 0 && r.firstTry === r.n) perfect++;
    if(r.n >= 10 && r.firstTry === r.n) clean10++;         // a whole round without a single hint
    bestRun = Math.max(bestRun, r.best || 0);
    if(r.lang) langs[r.lang] = true;
    if(r.redo) fixed += r.firstTry;                        // mistakes put right in "practise the misses"
    if(r.level === 'comp') comps++;                        // a competition spans many levels: it is no level's record
    else { const L = lvl[r.level] || (lvl[r.level] = {n:0,f:0}); L.n += r.n; L.f += r.firstTry; }
    (r.levels || [r.level]).forEach(id => { const l = LEVELS.find(x => x.id === id); if(l) grps[groupKey(l)] = true; });
    (r.seen||[]).forEach(k => { seen[k] = (seen[k]||0)+1; if(byOp[k[0]]) byOp[k[0]].seen++; });
    (r.missed||[]).forEach(k => { miss[k] = (miss[k]||0)+1; if(byOp[k[0]]) byOp[k[0]].miss++; });
    days[r.day] = true;
  });
  const sorted = Object.keys(days).sort();
  let streakBest = 0, run = 0, prev = null;
  sorted.forEach(d => {
    const t = Date.parse(d + 'T12:00:00');
    run = (prev !== null && t - prev === 86400000) ? run+1 : 1;
    if(run > streakBest) streakBest = run;
    prev = t;
  });
  let streak = 0;
  if(sorted.length){
    let cur = Date.parse(dayKey(Date.now()) + 'T12:00:00');
    if(!days[dayKey(cur)]) cur -= 86400000;
    while(days[dayKey(cur)]){ streak++; cur -= 86400000; }
  }
  const trouble = Object.keys(seen)
    .filter(k => k[0] !== 'w' && seen[k] >= 3 && (miss[k]||0) > 0)  // worksheet tasks have no single crossing step
    .map(k => ({ key:k, seen:seen[k], miss:miss[k]||0, rate:(miss[k]||0)/seen[k] }))
    .sort((x,y) => y.rate - x.rate || y.seen - x.seen).slice(0,6);
  const m = mastery(rounds);
  return { rounds:rounds.length, sums, first, perfect, lvl, byOp, streak, streakBest, trouble, bestRun, clean10, fixed,
           comps, groups: Object.keys(grps).filter(k => PICK_GROUPS.some(g => g.key === k)).length, langs: Object.keys(langs).length, curious: LOCAL.whys || 0, throughTen: THROUGH_TEN.filter(id => m[id] && m[id].done).length };
}

/* ---------- badges ----------
   Medals, as on the design's badge sheet: a colour per family, a ribbon when earned and a
   padlock when not yet. Every condition is positive (nothing is ever lost) and shows the
   child how far she is: prog gives [where she is, what it takes]. Names and conditions
   live in js/i18n.js under badge.<id>. */
export const FAM = {
  teal:['#2F6F8F', '#DDE9EF', '#255B76', '#255B76'], warm:['#E8A33D', '#FBEBCF', '#7A4A2B', '#C7862A'],
  green:['#23795A', '#DCEFE5', '#1E5C45', '#1B5F47'], grape:['#9769C2', '#EEE4F7', '#5E3B87', '#7B52A6'],
  rose:['#C4878A', '#F8E4E5', '#7E4A4D', '#A66A6D'], lock:['#B8BEC9', '#E9ECF1', '#8D93A0', '#9DA4B1']
};                                               // ring, disc, ink, ribbon
export const GLYPH = {
  paw:['fill', 'M7 9m-2.4 0a2.4 2.4 0 1 0 4.8 0a2.4 2.4 0 1 0-4.8 0M12 6.6m-2.4 0a2.4 2.4 0 1 0 4.8 0a2.4 2.4 0 1 0-4.8 0M17 9m-2.4 0a2.4 2.4 0 1 0 4.8 0a2.4 2.4 0 1 0-4.8 0M12 12.4c-3.2 0-5.4 2.2-5.4 4.3 0 1.9 2.2 3 5.4 3s5.4-1.1 5.4-3c0-2.1-2.2-4.3-5.4-4.3z'],
  fish:['fill', 'M2.6 12c3.2-4.4 8.6-5.4 12.8-3.2 2.2 1.1 3.2 2.2 3.2 3.2s-1 2.1-3.2 3.2C11.2 17.4 5.8 16.4 2.6 12zM19.4 12l3.4-3.4v6.8z'],
  star:['fill', 'M12 2.6l2.8 6 6.5.8-4.8 4.5 1.2 6.5L12 17.2 6.3 20.4l1.2-6.5L2.7 9.4l6.5-.8z'],
  sun:['stroke', 'M12 12m-4.4 0a4.4 4.4 0 1 0 8.8 0a4.4 4.4 0 1 0-8.8 0M12 1.8v3M12 19.2v3M1.8 12h3M19.2 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M19.4 4.6l-2.1 2.1M6.7 17.3l-2.1 2.1'],
  moon:['fill', 'M21 14.2A8.6 8.6 0 1 1 10.4 3a7.3 7.3 0 0 0 10.6 11.2z'],
  box:['stroke', 'M12 2.4l9 4v11l-9 4-9-4v-11zM3 6.4l9 4 9-4M12 10.4v11'],
  yarn:['stroke', 'M12 12m-8.6 0a8.6 8.6 0 1 0 17.2 0a8.6 8.6 0 1 0-17.2 0M5.6 7.2c4.4 1.8 7.2 5.8 8 12.8M18.4 7.2c-4.4 1.8-7.2 5.8-8 12.8M3.6 13.8c4-.8 7.6-3.4 9.8-7.8'],
  crown:['fill', 'M3.4 18.4h17.2l1.2-10.6-5.6 3.4L12 4.2 7.8 11.2 2.2 7.8z'],
  target:['stroke', 'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0M12 12m-5.5 0a5.5 5.5 0 1 0 11 0a5.5 5.5 0 1 0-11 0M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0'],
  bulboff:['stroke', 'M9 18h6M10 21h4M12 3a6 6 0 0 1 3.5 10.9c-.6.5-1 1.3-1 2.1H9.5c0-.8-.4-1.6-1-2.1A6 6 0 0 1 12 3zM4 4l16 16'],
  globe:['stroke', 'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18'],
  redo:['stroke', 'M3 12a9 9 0 1 0 3-6.7M3 4v5h5M8.5 12.5l2.5 2.5L16 10'],
  curious:['stroke', 'M10.5 10.5m-7 0a7 7 0 1 0 14 0a7 7 0 1 0-14 0M15.5 15.5L21 21M8.8 8.6a1.9 1.9 0 0 1 3.6.6c0 1.2-1.9 1.4-1.9 2.6M10.5 14.2v.1'],
  bridge:['stroke', 'M2 17h20M4 17V9M20 17V9M4 9c4-4 12-4 16 0M8 17v-5M12 17v-6M16 17v-5'],
  stopwatch:['stroke', 'M12 13m-7 0a7 7 0 1 0 14 0a7 7 0 1 0-14 0M12 9.5v3.5l2.5 1.5M10 2h4M12 2v4M18 6l1.5-1.5'],
  compass:['stroke', 'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0M15.5 8.5l-2 5-5 2 2-5z']
};
const THROUGH_TEN = [1, 2, 7, 4, 5, 6];            // the ladders that cross a ten
export const BADGES = [
  { id:'first',   g:'paw',     fam:'teal',  prog:s => [s.rounds, 1] },
  { id:'ten',     g:'fish',    fam:'teal',  prog:s => [s.rounds, 10] },
  { id:'perfect', g:'star',    fam:'grape', prog:s => [s.perfect, 1] },
  { id:'streak3', g:'sun',     fam:'warm',  prog:s => [s.streakBest, 3] },
  { id:'streak7', g:'moon',    fam:'warm',  prog:s => [s.streakBest, 7] },
  { id:'s100',    g:'box',     fam:'green', prog:s => [s.sums, 100] },
  { id:'s500',    g:'yarn',    fam:'green', prog:s => [s.sums, 500] },
  { id:'levels',  g:'crown',   fam:'grape', prog:s => [Object.keys(s.lvl).length, 7] },
  { id:'desetka', g:'target',  fam:'rose',  prog:s => [s.bestRun, 10] },
  { id:'nohint',  g:'bulboff', fam:'grape', prog:s => [s.clean10, 1] },
  { id:'polyglot',g:'globe',   fam:'rose',  prog:s => [s.langs, 2] },
  { id:'fixed',   g:'redo',    fam:'green', prog:s => [s.fixed, 10] },
  { id:'curious', g:'curious', fam:'grape', prog:s => [s.curious, 10] },
  { id:'master',  g:'bridge',  fam:'green', prog:s => [s.throughTen, THROUGH_TEN.length] },
  { id:'racer',   g:'stopwatch', fam:'teal', prog:s => [s.comps, 1] },
  { id:'explorer',g:'compass', fam:'warm',  prog:s => [s.groups, PICK_GROUPS.length] }
];
BADGES.forEach(b => { b.has = s => { const [a, n] = b.prog(s); return a >= n; }; });
export const badgeName = b => t('badge')[b.id][0], badgeNeed = b => t('badge')[b.id][1];
const earnedSet = rounds => { const s = statsFrom(rounds); return BADGES.filter(b => b.has(s)).map(b => b.id); };
function medal(b, got){
  const [ring, disc, ink, ribbon] = FAM[got ? b.fam : 'lock'], [how, d] = GLYPH[b.g];
  return '<svg viewBox="0 0 96 118" aria-hidden="true">' +
    (got ? '<path d="M28 64L20 114 48 100 76 114 68 64Z" fill="' + ribbon + '"/><path d="M34 66L30 106 48 98 66 106 62 66Z" fill="' + ring + '"/>' +
           '<path d="M48 98L38 103 40 72Z M48 98L58 103 56 72Z" fill="rgba(0,0,0,0.16)"/>' : '') +
    '<circle cx="48" cy="50" r="45" fill="' + ribbon + '"/><circle cx="48" cy="48" r="44" fill="' + ring + '"/>' +
    '<circle cx="48" cy="48" r="35" fill="' + disc + '"/><circle cx="48" cy="48" r="35" fill="none" stroke="rgba(0,0,0,0.10)" stroke-width="3"/>' +
    '<circle cx="48" cy="48" r="44" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="1.5"/>' +
    '<path d="M19 36a32 32 0 0 1 21-21" stroke="rgba(255,255,255,0.85)" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
    '<g transform="translate(27 27) scale(1.75)"><path d="' + d + '" fill="' + (how === 'fill' ? ink : 'none') + '" stroke="' +
      (how === 'stroke' ? ink : 'none') + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g>' +
    (got ? '' : '<g><circle cx="78" cy="80" r="13" fill="#5F6675" stroke="#fff" stroke-width="2"/><rect x="72" y="79" width="12" height="9" rx="2" fill="#fff"/>' +
                '<path d="M74.5 79v-2.5a3.5 3.5 0 0 1 7 0V79" stroke="#fff" stroke-width="2" fill="none"/></g>') + '</svg>';
}

/* ---------- cat ---------- */
function mood(m){ const c = $('cat'); if(c.dataset.mood !== m) c.dataset.mood = m; }
// A small move — a glance, an ear, the tail — played once; the same one again restarts it.
let fidgetTimer = 0;
function fidget(kind){
  const c = $('cat');
  if(REDUCED) return;
  delete c.dataset.fidget; void c.getBoundingClientRect();
  c.dataset.fidget = kind;
  clearTimeout(fidgetTimer); fidgetTimer = setTimeout(() => { delete c.dataset.fidget; }, 1700);
}
// While she thinks over a task the mascot is not a statue: every 7–14 seconds, one small move.
(function life(){
  setTimeout(() => {
    if(document.visibilityState === 'visible' && $('cat').dataset.mood === 'idle' && !S.settled) fidget(['look', 'ear', 'flick'][rnd(3)]);
    life();
  }, 7000 + rnd(7000));
})();
export function clearTimers(){ S.timers.forEach(clearTimeout); S.timers = []; }
function catFor(score, total){ return score >= total - 2 ? 'happy' : score >= total/2 ? 'idle' : 'sad'; }

// How a round ends. The bottom tier is encouraging, not sad: the child who scores
// low is the one who most needs to come back tomorrow. What each says is tiers[i] in js/i18n.js.
const TIERS = [
  { min:1,   mood:'party',      tune:[523,659,784,1047,1319,1047,1319,1568], gap:.11 },
  { min:.8,  mood:'dance',     tune:[523,659,784,1047,880,988,1175],        gap:.13 },
  { min:.6,  mood:'wiggle',    tune:[523,659,784,880],                      gap:.15 },
  { min:.4,  mood:'nod',    tune:[523,659,784],                          gap:.17 },
  { min:0,   mood:'tilt',     tune:[440,554],                              gap:.22 }
];
function tierFor(score, total){ const f = total ? score/total : 0; return TIERS.find(x => f >= x.min); }
let confettiTimer = 0;
function confetti(n, spread){
  const box = $('confetti');
  const cols = ['var(--good)','var(--warm)','var(--accent)','var(--rose)','var(--eye)'];
  let h = '';
  for(let i = 0; i < n; i++){
    const w = 6 + Math.random()*7;
    const round = i % 3 === 0;
    h += '<i class="' + (round ? 'round' : '') + '" style="left:' + (Math.random()*100).toFixed(1) +
         '%;width:' + w.toFixed(0) + 'px;height:' + (round ? w : w*.6).toFixed(0) + 'px;background:' +
         cols[i%cols.length] + ';animation-duration:' + (1.5 + Math.random()*spread).toFixed(2) +
         's;animation-delay:' + (Math.random()*.6).toFixed(2) + 's;--r:' +
         Math.round(Math.random()*720 - 360) + 'deg"></i>';
  }
  box.insertAdjacentHTML('beforeend', h);
  clearTimeout(confettiTimer);
  confettiTimer = setTimeout(() => { box.innerHTML = ''; }, 5200);
}
function putCat(slot, m){
  const big = $('cat').cloneNode(true);
  big.removeAttribute('id'); big.dataset.mood = m; delete big.dataset.fidget;
  $(slot).replaceChildren(big);
}

/* ---------- round flow ---------- */
const plainQ = q => q.own ? q : (({ options, pick, pts, ...rest }) => rest)(q);   // own: a kind that is always А/Б/В/Г; lvl stays, so a task from
// another level (a paper's redo, the notebook) is logged under its own level and seed
// comp: a competition's own tasks, which come with their options and points already
export function newRound(qs, comp){
  if(!comp){ COMP = null; clearInterval(compTick); if(typeof newerBuild === 'function') setTimeout(newerBuild, 0); }   // a fresh round is the moment to update
  S.qs = qs || Array.from({length:LOCAL.n}, () => gen(S.level));
  if(!comp) S.qs = S.qs.map(q => LOCAL.choice ? withChoices(plainQ(q)) : plainQ(q));
  S.i = 0; S.results = []; S.skipped = []; S.typed = []; S.slip = []; S.second = []; S.crossed = []; S.redo = false; S.t0 = Date.now();
  $('sheet').hidden = true;
  if(routeNow() !== 'play') go('play', true);
  $('confetti').innerHTML = '';
  show();
}
// Nobody has pressed anything for a while: the mascot nods off, and wakes at the next key.
let napTimer = null, yawnTimer = null;
function wake(){
  keepAwake();
  clearTimeout(napTimer);
  if($('cat').dataset.mood === 'sleepy') mood('idle');
  napTimer = setTimeout(() => { if(!S.settled) mood('sleepy'); }, 45000);
  clearTimeout(yawnTimer);
  yawnTimer = setTimeout(() => {          // a yawn first, then back to waiting
    if(S.settled || $('cat').dataset.mood !== 'idle') return;
    mood('yawn');
    setTimeout(() => { if($('cat').dataset.mood === 'yawn') mood('idle'); }, 2400);
  }, 30000);
}
// The screen stays on while a task is up: a paper runs 90 minutes, and she may think a long while without a tap.
// Everywhere else, on the round's end, and after 15 minutes with no key, the iPad sleeps as it always did.
// iPadOS drops the lock whenever the app is hidden, so it is asked for again on the way back; it may also refuse
// (Low Power Mode; a home-screen app before iPadOS 18.4), and then nothing changes.
let awake = null, awakeIdle = 0;   // the wake lock (a promise of it, or of null), and the timer that lets the screen sleep
function keepAwake(){
  clearTimeout(awakeIdle);
  if(ROUTE !== 'play' || !$('sheet').hidden || document.visibilityState !== 'visible') return letSleep();
  awakeIdle = setTimeout(letSleep, 15 * 60000);
  if(awake || !navigator.wakeLock) return;
  const p = awake = navigator.wakeLock.request('screen')
    .then(l => { l.addEventListener('release', () => { if(awake === p) awake = null; }); return l; }, () => { if(awake === p) awake = null; return null; });
}
function letSleep(){ const p = awake; awake = null; if(p) p.then(l => l && l.release()); }
document.addEventListener('visibilitychange', keepAwake);
export function show(){
  const q = S.qs[S.i];
  S.parts = Array(q.slots || 1).fill(''); S.at = 0;
  S.tries = 0; S.revealed = false; S.settled = false; S.wrong = false;
  clearTimers();
  $('stage').innerHTML = drawQ(q);
  $('qnum').textContent = COMP ? t('compTask', S.i + 1, groupOf(LEVELS.find(l => l.id === q.lvl))) : t('taskOf', S.i + 1, S.qs.length);
  // a paper: Skip, and Next once an option is chosen (a typed answer goes on with ✓); ✕ ends it instead of Home
  $('compRow').hidden = $('compNote').hidden = !COMP; $('compTop').hidden = !COMP; $('levelPill').hidden = !!COMP; $('nextBtn').hidden = !(COMP && q.options); $('nextBtn').disabled = !COMP || !COMP.ans[S.i];
  $('quitBtn').hidden = !COMP; $('homeBtn').hidden = !!COMP; $('side').hidden = $('sideBtn').hidden = !!COMP;
  $('choices').hidden = !q.options; $('pad').hidden = !!q.options; $('typeHint').hidden = !!q.options || !!COMP;
  if(q.options) paintChoices();
  $('card').className = 'card';
  $('verdict').className = 'verdict'; $('verdict').textContent = '';
  $('hint').innerHTML = '';
  $('go').textContent = '✓';
  mood(S.i === 0 ? 'tilt' : 'idle');                // a wave hello at the start of a round
  if(S.i === 0) S.timers.push(setTimeout(() => { if(!S.settled && $('cat').dataset.mood === 'tilt') mood('idle'); }, 1400));
  paintSlot(); paintDots(); wake();
  saveRound();
}
// The round so far, kept at the start of every task: an iPad drops a home-screen app it is not
// showing and loads it afresh, and a new build reloads it too — she comes back to the same task.
// ponytail: a competition is not kept (its clock would need restoring); it ends with a reload.
const RS = LS + '.round';
function saveRound(){
  try {
    if(COMP) localStorage.removeItem(RS);
    else localStorage.setItem(RS, JSON.stringify({ at:Date.now(), s:{ level:S.level, qs:S.qs, i:S.i, results:S.results, typed:S.typed,
      slip:S.slip, second:S.second, crossed:S.crossed, redo:S.redo, t0:S.t0 } }));
  } catch(e){}
}
function paintSlot(){
  S.parts.forEach((p, i) => {
    const el = $('slot' + i);
    if(!el) return;
    el.classList.toggle('no', S.wrong);   // a miss stays in its box, struck through, until she types again
    el.innerHTML = p + (!S.revealed && !S.wrong && i === S.at && !S.qs[S.i].options ? '<span class="caret"></span>' : '');   // nothing to type with А/Б/В/Г
  });
}
function paintDots(){
  if(COMP){      // a paper has no marks until the end: how far she is, and the clock
    const done = Object.keys(COMP.ans).length;
    // one segment a task: answered, the one on screen, or skipped for now (outlined)
    $('dots').innerHTML = S.qs.map((_, k) => '<span class="step ' + (k === S.i ? 'now' : COMP.ans[k] ? 'done' : COMP.skipped && COMP.skipped.has(k) ? 'skip' : '') + '"></span>').join('');
    $('compCount').textContent = String(done); $('compOf').textContent = String(S.qs.length); $('compClock').textContent = compLeft();
    const skipped = COMP.skipped ? [...COMP.skipped].filter(k => !COMP.ans[k]).length : 0;
    if(skipped) $('qnum').textContent += ' · ' + t('skippedN', skipped);
    $('dots').setAttribute('aria-label', t('taskOf', S.i + 1, S.qs.length));
    $('run').innerHTML = '<span class="ptschip">' + t('ptsN', S.qs[S.i].pts) + '</span>';
    return;
  }
  $('dots').innerHTML = S.qs.map((_, k) => {
    const r = S.results[k];
    return '<span class="step ' + (r === true ? 'ok' : r === false ? 'no' : '') + ' ' + (k === S.i ? 'now' : '') + '"></span>';
  }).join('');
  $('dots').setAttribute('aria-label', t('taskOf', S.i + 1, S.qs.length));
  let run = 0;   // right first time, in a row, up to now
  for(let k = S.results.length - 1; k >= 0 && S.results[k] === true; k--) run++;
  $('run').textContent = run >= 2 ? t('inARow', run) : '';
}
function press(k){
  wake();
  // Settled: any key moves on, but a digit must not be eaten by the advance —
  // it is the first digit of the next answer.
  if(S.settled){
    next();
    if(k >= '0' && k <= '9'){ S.parts[0] = k; sfx.tap(); paintSlot(); }
    return;
  }
  if(S.wrong){ retry(); if(k === 'del' || k === 'go') return; }   // the first digit after a miss starts a new answer
  if(k === 'del'){
    if(S.parts[S.at] === '' && S.at > 0) S.at--;
    else S.parts[S.at] = S.parts[S.at].slice(0,-1);
    paintSlot(); return;
  }
  if(k === 'go'){
    // With more than one box, ✓ fills the next one before it submits.
    if(S.at < S.parts.length - 1 && S.parts[S.at] !== ''){ S.at++; paintSlot(); return; }
    check(); return;
  }
  if(S.parts[S.at].length < 3){ S.parts[S.at] += k; mood('idle'); fidget('ear'); sfx.tap(); paintSlot(); }
}
// The feedback under the question: a coloured box with a mark and a word, never colour alone.
const MARK = { ok:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>',
               no:'<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>' };
const box = (kind, head, body, side) => '<div class="fb ' + kind + '"><div class="fbhead"><span class="mark">' + MARK[kind] + '</span>' +
  head + (side ? '<span class="v">' + side + '</span>' : '') + '</div>' + (body ? '<div>' + body + '</div>' : '') + '</div>';
// A tap on А/Б/В/Г is the same as typing that number and pressing ✓.
function paintChoices(){
  const q = S.qs[S.i];
  $('choices').innerHTML = choiceHtml(q, S.crossed[S.i], S.settled && !COMP, COMP ? COMP.picked[S.i] : undefined);
  $('choices').querySelectorAll('.ch').forEach(b => b.onclick = e => { e.stopPropagation(); choose(+b.dataset.o); });   // not also the card's "tap to go on"
}
function choose(id){
  wake();
  if(S.settled){ next(); return; }
  const q = S.qs[S.i];
  S.parts = [String(q.options[id].v)];
  if(COMP) COMP.picked[S.i] = id;
  else if(id !== q.pick) (S.crossed[S.i] = S.crossed[S.i] || []).push(id);
  check();
  paintChoices();
}
function check(){
  if(S.parts.some(p => p === '')) return;
  if(COMP){ compAnswer(); return; }
  const q = S.qs[S.i];
  if(accepts(q, S.parts)){
    if(S.results[S.i] === undefined) S.results[S.i] = S.tries === 0;
    if(S.tries > 0) S.second[S.i] = true;
    const quick = S.tries === 0;
    $('verdict').className = 'verdict ok';
    $('verdict').textContent = t(quick ? 'yes' : 'gotIt');
    const shown = why(q, true);
    $('hint').innerHTML = box('ok', t(quick ? 'yes' : 'gotIt'), shown);
    $('hint').scrollIntoView({ block:'nearest' });      // a long question on a short phone: the praise lands below the fold too
    // a run of right answers: five in a row dances, three get star eyes
    const run = n => quick && S.results.length >= n && S.results.slice(-n).every(Boolean);
    mood(run(5) ? 'wiggle' : run(3) ? 'star' : 'happy');
    quick ? sfx.good() : sfx.ok();
    S.settled = true;
    $('go').textContent = '→';
    paintDots();
    // a solution picture plays step by step and is there to be looked at: it waits for her tap on → or the card
    if(!shown.includes('<svg')) S.timers.push(setTimeout(next, quick ? 1900 : 2700));
    return;
  }
  S.results[S.i] = false;
  S.tries++;
  // What she typed the first time, and what it most likely was: named on the end-of-round
  // sheet, counted for the grown-ups, and - when it is a real misconception - hinted at now.
  if(S.tries === 1){ S.typed[S.i] = S.parts.join(' · '); S.slip[S.i] = slipOf(q, S.parts); }
  mood('sad'); sfx.bad();
  $('card').classList.add('shake');
  setTimeout(() => $('card').classList.remove('shake'), 340);
  if(S.tries === 1){
    $('verdict').className = 'verdict no';
    $('verdict').textContent = t('notYet');
    const nudge = S.slip[S.i] && t('slip')[S.slip[S.i]][1];
    // her mascot and the mistake named (what she wrote stays struck in its box), then how to do it, with "show the solution"
    $('hint').innerHTML = '<div class="fb no status">' + mascotSvg(PLAYER.mascot, 'sad') + '<div><b>' + t('notQuite') + '</b> ' + (nudge || t('lookAgain')) + '</div></div>' +
      '<div class="fb tip"><div class="tiplab">' + t('hintLabel') + '</div><div><span class="tiptext">' + why(q) + '</span>' +
      '<button class="btn ghost reveal" id="reveal">' + t('showSolution') + '</button></div></div>' +
      (q.options ? '' : '<button class="btn again" id="retryBtn">' + t('tryAgain') + ' →</button>');   // a phone hides the keys behind the hint (app.css)
    $('reveal').onclick = e => { e.stopPropagation(); reveal(); };
    if(!q.options) $('retryBtn').onclick = e => { e.stopPropagation(); retry(); };
    $('run').textContent = t('tryTwo');
    $('hint').scrollIntoView({ block:'nearest' });      // a phone in portrait: the hint lands under the question, maybe out of sight
    S.timers.push(setTimeout(() => { if(!S.settled) mood('thinking'); }, 1100));
    if(q.options){ S.parts = S.parts.map(() => ''); S.at = 0; }
    else { S.wrong = true; $('card').classList.add('missed'); }
    paintSlot();
  } else reveal();
}
// After a miss: the struck answer goes, the keys come back, the hint stays.
function retry(){
  S.wrong = false; S.parts = S.parts.map(() => ''); S.at = 0;
  $('card').classList.remove('missed');
  paintSlot();
}
// Show the answer and how it is worked: after a second miss, or when she asks for it.
function reveal(){
  const q = S.qs[S.i];
  S.results[S.i] = false;
  S.revealed = true; S.settled = true; S.wrong = false;
  $('card').classList.remove('missed');
  S.parts = answers(q).slice(0, S.parts.length).map(String);
  $('verdict').className = 'verdict no';
  $('verdict').textContent = eqText(q);
  $('hint').innerHTML = box('no', eqText(q), why(q, true));
  $('hint').scrollIntoView({ block:'nearest' });
  $('go').textContent = '→';
  mood('nod');
  paintSlot(); paintDots();
  if(q.options) paintChoices();
}
function next(){
  clearTimers();
  if(S.i + 1 >= S.qs.length){ finish(); return; }
  S.i++; show();
}

const STAR = on => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.8 6 6.5.8-4.8 4.5 1.2 6.5L12 17.2 6.3 20.4l1.2-6.5L2.7 9.4l6.5-.8z" fill="' +
  (on ? 'var(--warm)' : 'none') + '" stroke="' + (on ? 'var(--warm)' : 'var(--line)') + '" stroke-width="1.6" stroke-linejoin="round"/></svg>';
export function finish(){
  clearTimers();
  try { localStorage.removeItem(RS); } catch(e){}
  const n = S.qs.length, got = S.results.filter(Boolean).length;
  const tier = tierFor(got, n);
  const lv = LEVELS.find(l => l.id === S.level) || { eq:'' };
  let best = 0, run = 0;
  S.results.forEach(r => { run = r ? run+1 : 0; if(run > best) best = run; });
  // a competition counts points, each task worth its difficulty
  const pts = COMP ? S.qs.reduce((a, q, k) => a + (S.results[k] ? q.pts : 0), 0) : got;
  const max = COMP ? S.qs.reduce((a, q) => a + q.pts, 0) : n;
  $('score').textContent = COMP ? t('pointsBig', pts, max) : t('scoreBig', got, n);
  const secs = Math.round((Date.now() - S.t0) / 1000);
  $('scoreSub').textContent = COMP ? t('compSub', got, n, compTime(Date.now() - COMP.t0)) : t('firstTryAt', levelName(lv)) + ' · ' + t('took', Math.floor(secs / 60), secs % 60);
  const stars = pts === max ? 3 : pts >= .8*max ? 2 : pts >= .5*max ? 1 : 0;
  $('stars').innerHTML = [1, 2, 3].map(k => STAR(k <= stars)).join('');
  if(COMP) /** @type {HTMLElement} */ ($('scoreBar').firstElementChild).style.width = Math.round(100 * pts / max) + '%';
  $('stars').setAttribute('aria-label', t('starsOf', stars));
  putCat('sheetcat', tier.mood);
  sfx.tune(tier.tune, tier.gap);
  const clean = got === n;
  $('sheetcat').classList.toggle('burst', clean && !REDUCED);
  ['sheetcat','score','earnedWrap'].forEach((el, k) => {
    $(el).classList.remove('pop','d1','d2');
    if(clean && !REDUCED){ void $(el).offsetWidth; $(el).classList.add('pop'); if(k) $(el).classList.add('d' + k); }
  });
  if(!REDUCED){
    if(clean){
      confetti(46, 1.6);
      S.timers.push(setTimeout(() => confetti(38, 2.0), 850));
      S.timers.push(setTimeout(() => { sfx.tune([1047,1319,1568,2093], .1); confetti(30, 2.4); }, 1750));
    } else if(tier.mood === 'dance'){
      confetti(18, 1.8);
    }
  }

  // Worth another look: what she wrote, what it most likely was, and - on a tap - the way through.
  const missed = S.qs.map((q, k) => ({ q, k })).filter(x => !S.results[x.k] && !S.skipped[x.k]);   // a paper's unanswered tasks are in its table, not mistakes
  $('missWrap').hidden = missed.length === 0;
  $('toNotebook').onclick = () => go('notebook');
  $('redo').hidden = missed.length === 0;
  $('redo').textContent = COMP ? t('fixWrongN', missed.length) : t('fixMiss', missed.length);
  $('again').textContent = t(COMP ? 'newComp' : 'newRound');
  $('toStats').textContent = t(COMP ? 'backToday' : 'progress');
  $('toStats').onclick = COMP ? () => { newRound(); go('today', true); } : () => { newRound(); go('badges'); };   // newRound closes the results; they would cover the tab screens
  $('scoreBar').hidden = !COMP;
  // as drawn: the task, what she wrote struck → the answer, and what the mistake most likely was
  $('misslist').innerHTML = missed.map(({ q, k }) => {
    const wrote = S.typed[k] === undefined ? '' : '<span class="wrote"><s>' + esc(S.typed[k]) + '</s> → <b>' + answers(q).join(' · ') + '</b>' +
      (S.slip[k] ? ' · ' + t('slip')[S.slip[k]][0] : S.second[k] ? ' · ' + t('secondTry') : '') + '</span>';
    const task = q.kind ? eqText(q) : q.a + (q.op === '-' ? ' − ' : ' + ') + q.b;   // a plain sum without its answer: the answer is in the line under it
    return '<div class="miss"><div class="mrow"><span class="mdot"></span><div class="mtext"><span class="eq">' + task + '</span>' + wrote +
      '</div><button class="whyb" aria-expanded="false">' + t('why') + '</button></div><div class="why" hidden>' + why(q, true) + '</div></div>';
  }).join('');
  $('misslist').querySelectorAll('.whyb').forEach(b => b.onclick = () => {
    const open = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', String(open));
    b.closest('.miss').querySelector('.why').hidden = !open;
    if(open){ LOCAL.whys = (LOCAL.whys || 0) + 1; saveLocal(); }
  });
  const padFrom = COMP ? missed.map(x => x.q.lvl) : [S.level];   // a paper's redo is padded from its own levels, not the one picked before it
  $('redo').onclick = () => {
    const set = missed.map(x => x.q);
    const want = Math.min(12, Math.max(6, missed.length*2));
    while(set.length < want){ const lv = padFrom[rnd(padFrom.length)]; set.push(Object.assign(gen(lv), { lvl: lv })); }
    newRound(shuffle(set));
    S.redo = true;                                     // a round of her own mistakes, for the "fixed" badge
  };

  // a paper: task by task, and against her best paper before this one
  $('compWrap').hidden = !COMP; $('compBest').hidden = true;
  if(COMP){
    const n = k => S.qs.filter((_, j) => k(j)).length, right = n(j => S.results[j]), none = n(j => S.skipped[j]);
    $('compTable').innerHTML = '<div class="clegend">' + t('compLegend', right, S.qs.length - right - none, none) + '</div>' + S.qs.map((q, k) => {
      const st = S.skipped[k] ? 'skip' : S.results[k] ? 'ok' : 'no';
      const said = st === 'ok' ? '✓' : st === 'skip' ? t('notReached') : q.options && COMP.picked[k] !== undefined ?
        t('chose', letterOf(COMP.picked[k])) + ' → ' + letterOf(q.pick) : esc(S.typed[k] || '') + ' → ' + answers(q).join(' · ');
      return '<button class="crow ' + st + '" aria-expanded="false"><span class="cn">' + (k + 1) + '</span><span class="cg">' + groupOf(LEVELS.find(l => l.id === q.lvl)) +
        '</span><span class="co">' + said + '</span><span class="cp">' + q.pts + '</span></button><div class="why" hidden><div class="eq">' + eqText(q) + '</div>' + why(q, true) + '</div>';
    }).join('');
    // a row opens its task and how it is solved
    $('compTable').querySelectorAll('.crow').forEach(b => b.onclick = () => {
      const open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', String(open)); b.nextElementSibling.hidden = !open;
    });
    const prev = LOCAL.rounds.filter(r => r.level === 'comp' && r.max).sort((a, b) => b.pts / b.max - a.pts / a.max)[0];
    if(prev){
      $('compBest').hidden = false;
      $('compBest').textContent = pts / max > prev.pts / prev.max ? t('compRecord', pts, max, prev.pts + ' / ' + prev.max) : t('compBest', prev.pts, prev.max);
    }
  }

  const before = earnedSet(LOCAL.rounds), was = mastery(LOCAL.rounds)[S.level];
  const now = Date.now();
  const round = {
    id: 'r' + now + '_' + Math.random().toString(36).slice(2,7),
    ts: now, day: dayKey(now),
    level: COMP ? 'comp' : S.level, n, firstTry: got, best, lang: LANG,
    pts: COMP ? pts : undefined, max: COMP ? max : undefined, secs: Math.round((now - (COMP ? COMP.t0 : S.t0)) / 1000),
    levels: COMP ? S.qs.map(q => q.lvl) : undefined,
    seen: S.qs.map(factKey),
    missed: S.qs.filter((_, k) => !S.results[k]).map(factKey),
    slips: S.slip.filter(Boolean),
    redo: S.redo || undefined,
    // each task: its level, shape and seed (seeded(seed, () => raw(level)) draws it again), what she wrote
    // when she missed it, 1 right / 0 wrong / -1 left unanswered, and the right answer — so a task whose
    // generator has changed since is told apart, never shown as something it was not
    t: S.qs.map((q, k) => [q.lvl || S.level, q.shape ?? null, q.seed ?? null, S.typed[k] ?? null, S.skipped[k] ? -1 : S.results[k] ? 1 : 0, answer(q)])
  };
  LOCAL.rounds.push(round);
  ARCHIVE.put(PLAYER.id, [round]);
  saveLocal();
  setW(weightsFrom(LOCAL.rounds));
  syncSoon();
  if(!IN()) $('synced').textContent = heldHere() + builtOn();   // signed out, this line counts her rounds: keep it current
  paintSide();

  // a level learned this very round
  const nowM = mastery(LOCAL.rounds)[S.level];
  const learned = !COMP && nowM && nowM.done && !(was && was.done);
  $('learnedCard').hidden = !learned;
  if(learned) putCat('sheetcat', 'proud');         // a level learned: the mascot wears a medal
  if(learned) $('learnedCard').innerHTML = '<span class="bicon">' + MARK.ok.replace('width="16" height="16"', 'width="22" height="22"') +
    '</span><div><b>' + t('learnedNew') + '</b><span>' + levelName(lv) + ' · ' + t('learnedRule') + '</span></div>';

  const fresh = earnedSet(LOCAL.rounds).filter(id => before.indexOf(id) < 0);
  $('earnedWrap').hidden = fresh.length === 0;
  $('earnedWrap').innerHTML = fresh.map(id => {
    const b = BADGES.find(x => x.id === id);
    return '<div class="newbadge">' + medal(b, true) + '<div><b>' + badgeName(b) + '</b><span>' + t('newBadge') + '</span></div></div>';
  }).join('');
  if(fresh.length && !REDUCED) putCat('sheetcat', 'party');
  $('again').onclick = COMP ? () => startComp() : () => newRound();
  if(COMP){ COMP = null; clearInterval(compTick); paintPill(); $('quitBtn').hidden = true; $('homeBtn').hidden = false; $('side').hidden = $('sideBtn').hidden = false; $('levelPill').hidden = false; $('compTop').hidden = true; }

  $('sheet').hidden = false;
  keepAwake();   // the round is over: the iPad may sleep again
}

/* ---------- progress ---------- */
function advice(st){
  if(st.rounds < 3) return t('fewRounds');
  const sub = st.byOp['-'], add = st.byOp['+'];
  const pct = o => o.seen ? Math.round(100*(o.seen - o.miss)/o.seen) : null;
  const ps = pct(sub), pa = pct(add);
  const bits = [];
  if(ps !== null && sub.seen >= 15) bits.push(t('subAt', ps));
  if(pa !== null && add.seen >= 15) bits.push(t('addAt', pa));
  let out = bits.length ? bits.join(', ') + '. ' : '';
  if(ps !== null && pa !== null && sub.seen >= 15 && add.seen >= 15){
    out += t(Math.abs(ps - pa) < 8 ? 'level' : ps > pa ? 'addWeak' : 'subWeak');
  }
  if(st.trouble.length) out += t('costing', factLabel(st.trouble[0].key), st.trouble[0].miss, st.trouble[0].seen);
  return out || t('even');
}
const tile = (n, label) => '<div class="tile"><span class="n">' + n + '</span><span class="t">' + label + '</span></div>';
const bar = (name, p, tail) => '<div class="lvlrow"><span class="nm">' + name + '</span><span class="track"><i style="width:' + p +
  '%"></i></span><span class="pc">' + p + '%' + (tail ? ' · ' + tail : '') + '</span></div>';
// For her: the badges, what the next one needs, and how the last rounds went.
export function renderStats(){
  const st = statsFrom(LOCAL.rounds);
  const any = st.rounds > 0;
  $('statsEmpty').hidden = any;
  $('trendWrap').hidden = !any;
  const got = BADGES.filter(b => b.has(st));
  $('badgeCount').textContent = t('badgeOf', got.length, BADGES.length);
  // the next badge: the unearned one she is closest to
  const next = BADGES.filter(b => !b.has(st)).map(b => { const [a, n] = b.prog(st); return { b, a: Math.min(a, n), n, f: a / n }; })
    .sort((x, y) => y.f - x.f)[0];
  $('nextBadge').hidden = !next;
  if(next) $('nextBadge').innerHTML = medal(next.b, false) + '<div class="nb"><div class="lab">' + t('nextBadge') + '</div>' +
    '<div class="nbname">' + badgeName(next.b) + ' <span>· ' + badgeNeed(next.b) + '</span></div>' +
    '<div class="meter"><span class="track" role="progressbar" aria-valuemin="0" aria-valuemax="' + next.n + '" aria-valuenow="' + next.a +
    '"><i style="width:' + Math.round(100*next.f) + '%"></i></span><span>' + next.a + ' / ' + next.n + '</span></div></div>';
  // under each name on a wide screen: what it asks, and how far she is ("214 / 500")
  const prog = b => { const [a, n] = b.prog(st); return b.has(st) || n <= 1 ? '' : Math.min(a, n) + ' / ' + n; };
  $('badges').innerHTML = BADGES.map(b => {
    const on = b.has(st);
    return '<button class="badge" data-b="' + b.id + '" aria-pressed="false" aria-label="' + badgeName(b) + ' – ' + badgeNeed(b) +
      ' (' + t(on ? 'earned' : 'notYetEarned') + ')">' + medal(b, on) + '<span class="nm">' + badgeName(b) + '</span><span class="cond">' + badgeNeed(b) + '<b>' + prog(b) + '</b></span></button>';
  }).join('');
  $('badgeNeed').textContent = '';
  $('badges').querySelectorAll('.badge').forEach(el => el.onclick = () => {
    const b = BADGES.find(x => x.id === el.dataset.b), [a, n] = b.prog(st);
    $('badges').querySelectorAll('.badge').forEach(x => x.setAttribute('aria-pressed', String(x === el)));
    $('badgeNeed').textContent = badgeName(b) + ' · ' + badgeNeed(b) + (b.has(st) ? ' ✓' : ' · ' + Math.min(a, n) + ' / ' + n);
  });
  $('tiles').innerHTML = tile(st.rounds, t('roundsWord', st.rounds)) + tile(st.sums, t('tasksWord', st.sums)) + tile(st.streakBest, t('bestStreak'));

  const last = LOCAL.rounds.slice(-12);
  const BW = 18, BG = 7, H = 60;
  const w = Math.max(1, last.length*(BW+BG) - BG);
  $('trend').innerHTML = '<svg viewBox="0 0 ' + w + ' ' + (H+6) + '" preserveAspectRatio="xMidYMid meet">' +
    last.map((r, k) => {
      const f = r.n ? r.firstTry/r.n : 0;
      const h = Math.max(3, Math.round(f*H));
      const col = f >= .8 ? 'var(--good)' : f >= .5 ? 'var(--warm)' : 'var(--bad)';
      return '<rect x="' + (k*(BW+BG)) + '" y="' + (H-h) + '" width="' + BW + '" height="' + h + '" rx="3" fill="' + col + '"/>';
    }).join('') +
    '<line x1="0" y1="' + (H+2) + '" x2="' + w + '" y2="' + (H+2) + '" stroke="var(--line)" stroke-width="2"/></svg>';
}
// For the grown-ups: the numbers, how each group is going this month, the slips that keep
// coming back, the crossing steps that cost most, every level, and the settings.
export function renderParent(){
  const st = statsFrom(LOCAL.rounds), m = mastery(LOCAL.rounds);
  const pc = st.sums ? Math.round(100*st.first/st.sums) : 0;
  const hints = st.sums ? (LOCAL.rounds.reduce((x, r) => x + (r.missed || []).length, 0) / st.sums) : 0;
  $('parentWho').innerHTML = mascotSvg(PLAYER.mascot) + esc(playerName(PLAYER));
  $('ptiles').innerHTML = tile(st.rounds, t('roundsTotal')) + tile(pc + '%', t('firstTry')) +
    tile(hints.toLocaleString(LANG_TAG[LANG], { maximumFractionDigits:1 }), t('hintsPerTask')) +
    tile(LEVELS.filter(l => m[l.id] && m[l.id].done).length + ' / ' + LEVELS.length, t('levelsLearned'));

  const month = LOCAL.rounds.filter(r => r.ts > Date.now() - 30*86400000);
  const byGrp = PICK_GROUPS.map(g => {
    const ids = new Set(LEVELS.filter(g.has).map(l => l.id));
    const rs = month.filter(r => ids.has(r.level));
    const n = rs.reduce((x, r) => x + r.n, 0), f = rs.reduce((x, r) => x + r.firstTry, 0);
    return { nm: t('groups')[g.key], n, p: n ? Math.round(100*f/n) : 0 };
  }).filter(g => g.n).sort((a, b) => b.p - a.p);
  $('groupWrap').hidden = !byGrp.length;
  $('byGroup').innerHTML = byGrp.map(g => bar(g.nm, g.p)).join('');
  const count = {};
  month.forEach(r => (r.slips || []).forEach(s => { count[s] = (count[s] || 0) + 1; }));
  const top = Object.keys(count).filter(s => t('slip')[s]).sort((a, b) => count[b] - count[a]);
  $('slipWrap').hidden = !top.length;
  $('slips').innerHTML = top.map(s => '<div class="sliprow"><i></i><span>' + t('slip')[s][0] + '</span><b>' + count[s] + '×</b></div>').join('');

  $('troubleWrap').hidden = st.trouble.length === 0;
  $('trouble').innerHTML = st.trouble.map(x =>
    '<div class="chip"><span class="eq">' + factLabel(x.key) + '</span><span class="r">' + t('missed', x.miss, x.seen) + '</span></div>'
  ).join('');
  $('byLevelWrap').hidden = !st.rounds;
  $('byLevel').innerHTML = Object.keys(st.lvl).sort((x,y) => +x - +y).map(L => {
    const d = st.lvl[L], lv = LEVELS.find(l => l.id === +L);
    return bar(lv ? levelName(lv) : L, Math.round(100*d.f/d.n), d.n);
  }).join('');
  $('advice').textContent = advice(st);
  document.querySelectorAll('#lenSeg button').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.n === LOCAL.n)));
  document.querySelectorAll('#ansSeg button').forEach(b => b.setAttribute('aria-pressed', String((b.dataset.c === '1') === !!LOCAL.choice)));
  $('csv').hidden = !LOCAL.rounds.length;
  paintPaperSet();
  document.querySelectorAll('#gradeSeg button').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.g === myGrade())));

  // this week against the last, and the picture of it to share
  const w = weekData(), day = ms => new Date(ms).toLocaleDateString(LANG_TAG[LANG], { day:'numeric', month:'short' });
  $('weekCard').innerHTML = '<div class="gtitle"><b>' + t('thisWeek') + '</b><span>' + day(w.ws) + ' – ' + day(w.ws + 6*DAY) + '</span></div>' +
    '<div class="weekrow"><span>' + t('rounds', w.rounds) + '</span>' + (w.pct === null ? '' : '<span>' + t('firstPct', w.pct) +
    (w.delta === null ? '' : ' <i class="' + (w.delta >= 0 ? 'up' : 'down') + '">' + t('vsLast', w.delta) + '</i>') + '</span>') +
    (w.fresh ? '<span>' + t('newLevels', w.fresh) + '</span>' : '') + '</div>' +
    (w.rounds ? '<button class="btn ghost weekopen">' + t('shareWeek') + '</button>' : '');
  $('weekShare').hidden = true;
  const open = $('weekCard').querySelector('.weekopen');
  if(open) open.onclick = () => { $('weekShare').hidden = false; buildWeek(); };

  // the shapes of a level she misses most (each round logs a task's shape): a task of it, and how often it went wrong
  const by = {};
  LOCAL.rounds.filter(r => r.ts > Date.now() - 30*DAY && Array.isArray(r.t)).forEach(r => r.t.forEach(([lv, shape, seed, wrote, ok]) => {
    if(ok === -1) return;
    const k = lv + '|' + (shape ?? ''), x = by[k] = by[k] || { lv, n: 0, miss: 0, seed: null, seeds: [] };
    x.n++; if(ok === 0){ x.miss++; if(Number.isInteger(seed)){ x.seed = seed; x.seeds.push(seed); if(x.seeds.length > 3) x.seeds.shift(); } }   // her latest three misses of it
  }));
  const worst = Object.values(by).filter(x => x.n >= 4 && x.miss >= 2).sort((a, b) => b.miss / b.n - a.miss / a.n).slice(0, 4);
  // practise these: the very tasks she missed (drawn again from their seeds), and new ones from those levels up to ten
  $('shapeGo').onclick = () => {
    const set = worst.flatMap(x => x.seeds.map(seed => { try { return Object.assign(seeded(seed, () => raw(x.lv)), { seed, lvl: x.lv }); } catch(e){ return null; } })).filter(Boolean).slice(0, 10);
    while(set.length < 10){ const lv = worst[rnd(worst.length)].lv; set.push(Object.assign(gen(lv), { lvl: lv })); }
    newRound(shuffle(set));
  };
  $('shapeWrap').hidden = !worst.length;
  $('byShape').innerHTML = worst.map(x => {
    const l = LEVELS.find(y => y.id === x.lv);
    let ex = '';
    try { if(x.seed !== null) ex = eqText(seeded(x.seed, () => raw(x.lv))); } catch(e){}
    return '<div class="nbitem"><span class="eq">' + (ex || (l ? levelName(l) : x.lv)) + '</span><span class="smeta">' + (l ? levelName(l) + ' · ' : '') + t('shapeMiss', x.miss, x.n) + '</span></div>';
  }).join('');
}
// One row per round. Every field is quoted, so nothing in it can act as a spreadsheet formula.
function csvOf(rounds){
  const q = v => '"' + String(v).replace(/"/g, '""') + '"';
  const rows = [t('csvHead')].concat(rounds.map(r => {
    const d = new Date(r.ts), lv = LEVELS.find(l => l.id === r.level);
    return [dayKey(r.ts), d.toTimeString().slice(0, 5), r.level, lv ? levelName(lv) : r.level === 'comp' ? t('compName') + ' · ' + r.pts + ' / ' + r.max : '', r.n, r.firstTry,
            (r.slips || []).map(s => t('slip')[s] ? t('slip')[s][0] : s).join('; ')];
  }));
  return rows.map(row => row.map(v => q(/^[=+\-@]/.test(String(v)) ? "'" + v : v)).join(',')).join('\r\n');
}
$('csv').onclick = () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['﻿' + csvOf(LOCAL.rounds)], { type:'text/csv' }));
  a.download = 'crossing-ten-' + (PLAYER.name || PLAYER.id) + '-' + dayKey(Date.now()) + '.csv';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
};
// R0, the framework trial (PLAN.md): with ?ui=next the badges screen is the Preact component in js/ui/badges.js
const UI_NEXT = new URLSearchParams(location.search).get('ui') === 'next';
function showStats(){
  renderStats();
  if(UI_NEXT) import('./ui/badges.js').then(m => {
    const box = $('statsNext') || Object.assign(document.createElement('div'), { id: 'statsNext' });
    if(!box.parentNode) $('nextBadge').before(box);   // under the bar, with its back button and count
    ['#nextBadge', '.gcard:has(#badges)', '#tiles'].forEach(s => { const el = $('stats').querySelector('.sheet-in > ' + s); if(el) el.hidden = true; });
    m.showBadges(box, LOCAL.rounds);
  });
}
$('homeBtn').onclick = () => go('today', true);
// a tab swaps the section in place, so the back gesture does not walk through the tabs
document.querySelectorAll('#tabs button').forEach(b => b.onclick = () => go(b.dataset.r, true));

const groupOf = l => l && t('groups')[groupKey(l)] || '';
// What Today shows (js/ui/today.js draws it): the level to play now, the round under way, the levels due again.
/* ---------- the mistakes notebook (#/notebook, drawn by js/ui/notebook.js) ----------
   Her missed tasks of the last 30 days, drawn again from their level and seed, grouped by the mistake slipOf
   names (else by the level's group). "Put right" plays those very tasks, padded with new ones from their levels;
   all right first time puts the kind right: its older misses leave the notebook, and a week later it asks to be
   checked again with new tasks. A round says what it fixed: redo { fix: kind } or { check: kind }. */
const DAY = 864e5;
export function notebookData(now = Date.now()){
  const rounds = LOCAL.rounds.filter(r => r.ts > now - 30*DAY && Array.isArray(r.t));
  const pass = {};   // the last round that put each kind right, or checked it
  // a round fixes one kind, or several at once ("put them all right")
  rounds.forEach(r => { const ks = r.redo ? [].concat(r.redo.fix || r.redo.check || []) : []; if(r.firstTry === r.n) ks.forEach(k => { if(!pass[k] || pass[k].ts < r.ts) pass[k] = { ts: r.ts, check: !!r.redo.check }; }); });
  const seen = new Map();
  rounds.forEach(r => r.t.forEach(([lv, , seed, wrote, ok, ans]) => {
    if(ok !== 0 || wrote == null) return;
    const l = LEVELS.find(x => x.id === lv);
    if(!l) return;
    let q = null;
    try { if(Number.isInteger(seed)){ const d = seeded(seed, () => raw(lv)); if(JSON.stringify(answer(d)) === JSON.stringify(ans)) q = Object.assign(d, { seed, lvl: lv }); } } catch(e){}   // its generator changed since: shown by its numbers
    const kind = (q && slipOf(q, String(wrote).split(' · '))) || 'g:' + groupKey(l);
    if(pass[kind] && pass[kind].ts > r.ts) return;
    seen.set(lv + ':' + seed, { kind, ts: r.ts, lv, seed, wrote, ans, q, text: q ? eqText(q) : levelName(l) + ' → ' + ans });
  }));
  const byKind = {};
  [...seen.values()].sort((a, b) => b.ts - a.ts).forEach(x => (byKind[x.kind] = byKind[x.kind] || []).push(x));
  const name = k => k.startsWith('g:') ? t('groups')[k.slice(2)] : t('slip')[k][0];
  const open = Object.entries(byKind).map(([kind, items]) => ({ kind, name: name(kind), desc: kind.startsWith('g:') ? '' : t('slip')[kind][1], items }))
    .sort((a, b) => b.items.length - a.items.length);
  const done = Object.entries(pass).filter(([k, p]) => !byKind[k] && !p.check).map(([kind, p]) => ({ kind, name: name(kind), ts: p.ts, recheck: now - p.ts >= 7*DAY,
    when: new Date(p.ts).toLocaleDateString(LANG_TAG[LANG], { weekday:'long' }) }));
  return { open, done, total: open.reduce((s, g) => s + g.items.length, 0) };
}
// Put a kind right: its tasks again, and new ones from their levels up to five (at most twelve); or check it, five new
export function fixKind(kind, check){
  const g = notebookData().open.find(x => x.kind === kind), levels = g ? [...new Set(g.items.map(x => x.lv))] : notebookLevels(kind);
  if(!levels.length) return;
  const set = check ? [] : g.items.filter(x => x.q).map(x => x.q).slice(0, 12);
  const want = Math.min(12, Math.max(5, set.length));
  while(set.length < want){ const lv = levels[rnd(levels.length)]; set.push(Object.assign(gen(lv), { lvl: lv })); }
  newRound(shuffle(set));
  S.redo = check ? { check: kind } : { fix: kind };
}
// Put them all right: every kind's missed tasks in one round (at most twelve, the most repeated kinds first)
export function fixAll(){
  const open = notebookData().open, set = open.flatMap(g => g.items.filter(x => x.q).map(x => x.q)).slice(0, 12);
  const levels = [...new Set(open.flatMap(g => g.items.map(x => x.lv)))];
  if(!levels.length) return;
  while(set.length < 5){ const lv = levels[rnd(levels.length)]; set.push(Object.assign(gen(lv), { lvl: lv })); }
  newRound(shuffle(set));
  S.redo = { fix: open.map(g => g.kind) };
}
// the levels a kind was put right on: from the round that put it right
const notebookLevels = kind => { const r = [...LOCAL.rounds].reverse().find(r => r.redo && [].concat(r.redo.fix || []).includes(kind)); return r ? [...new Set(r.t.map(x => x[0]))] : []; };
// Her week: rounds, right first time (and the change from last week), levels newly learned, tasks, the days she
// played, and the groups that went best and worst (5 tasks or more)
function weekData(now = Date.now()){
  const ws = weekStart(now), inWeek = (a, b) => LOCAL.rounds.filter(r => r.ts >= a && r.ts < b);
  const pct = rs => { const n = rs.reduce((x, r) => x + r.n, 0); return n ? Math.round(100 * rs.reduce((x, r) => x + r.firstTry, 0) / n) : null; };
  const now7 = inWeek(ws, Infinity), p = pct(now7), q = pct(inWeek(ws - 7*DAY, ws)), m = mastery(LOCAL.rounds), before = mastery(LOCAL.rounds.filter(r => r.ts < ws));
  const by = {};
  now7.forEach(r => (r.t || []).forEach(([lv, , , , ok]) => { const l = LEVELS.find(x => x.id === lv); if(!l || ok === -1) return;
    const g = by[groupKey(l)] = by[groupKey(l)] || [0, 0]; g[0]++; if(ok === 1) g[1]++; }));
  const ranked = Object.entries(by).filter(([, [n]]) => n >= 5).sort((a, b) => b[1][1] / b[1][0] - a[1][1] / a[1][0]).map(([k]) => t('groups')[k].toLowerCase());
  // ponytail: days by 24 h steps from Monday; a clock change shifts a boundary by an hour
  const day0 = k => ws + k*DAY, long = ms => new Date(ms).toLocaleDateString(LANG_TAG[LANG], { day:'numeric', month:'long' });
  return { ws, range: long(ws) + ' – ' + long(ws + 6*DAY), rounds: now7.length, pct: p, delta: p === null || q === null ? null : p - q,
    fresh: LEVELS.filter(l => m[l.id] && m[l.id].done && !(before[l.id] && before[l.id].done)).length, tasks: now7.reduce((x, r) => x + r.n, 0),
    days: Array.from({ length: 7 }, (_, k) => ({ label: new Date(day0(k) + 12*3600e3).toLocaleDateString(LANG_TAG[LANG], { weekday:'short' }),
      played: now7.some(r => r.ts >= day0(k) && r.ts < day0(k + 1)) })),
    best: ranked[0] || '', weak: ranked.length > 1 ? ranked[ranked.length - 1] : '', name: playerName(PLAYER), mascot: PLAYER.mascot };
}
// the picture is made when the preview opens (and again when the name is switched), so the tap on Share shares at once
let WEEK_PNG = null;
async function buildWeek(){
  WEEK_PNG = null; $('weekGo').disabled = true;
  const b = await weeklyPng(weekData(), $('weekName').checked);
  const img = /** @type {HTMLImageElement} */ ($('weekImg'));
  if(img.src.startsWith('blob:')) URL.revokeObjectURL(img.src);
  img.src = URL.createObjectURL(b);
  WEEK_PNG = b; $('weekGo').disabled = false;
}
$('weekName').onchange = buildWeek;
$('weekGo').onclick = () => { if(WEEK_PNG) shareWeekly(WEEK_PNG, 'desetka-' + dayKey(weekStart(Date.now())) + '.png'); };
// The sidebar's foot on a wide screen (app.css hides it on a phone): her week, how far overall, the next paper
function paintTabWeek(){
  const d = todayData();
  $('tabWho').innerHTML = mascotSvg(PLAYER.mascot) + esc(playerName(PLAYER));
  $('tabWeek').innerHTML = '<b>' + t('thisWeek') + '</b>' + (d.streak > 0 ? '<span>' + t('streakDays', d.streak) + '</span>' : '') +
    '<span>' + t('rounds', d.week) + '</span><span>' + t('learnedOf', d.learned, d.levels) + '</span>' +
    (d.badge ? '<span>' + t('badgeLeft', d.badge.left, d.badge.name) + '</span>' : '') +
    (d.paper ? '<span class="tp"><b>' + esc(d.paper.name) + '</b>' + d.paper.when + ' · ' + t('inDays', d.paper.days) + ' · ' + t('readyPct', d.paper.ready) + '</span>' : '');
}
// The badge she is closest to, how much is left, and how many she has
function nextBadge(st){
  const earned = BADGES.filter(b => b.has(st)).length;
  const next = BADGES.filter(b => !b.has(st)).map(b => { const [a, n] = b.prog(st); return { b, a: Math.min(a, n), n }; }).sort((x, y) => y.a / y.n - x.a / x.n)[0];
  return next ? { name: badgeName(next.b), left: next.n - next.a, earned, total: BADGES.length } : null;
}
// Monday 00:00 of this week, local time
const weekStart = now => { const d = new Date(now); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (d.getDay() + 6) % 7); return +d; };
export function todayData(){
  const m = mastery(LOCAL.rounds), st = statsFrom(LOCAL.rounds), now = Date.now(), day = dayKey(now);
  const last = LOCAL.rounds[LOCAL.rounds.length - 1], lastLvl = last && LEVELS.find(l => l.id === last.level);
  const nx = suggest(m, lastLvl && (lastLvl.grp || lastLvl.op), !!(lastLvl && m[lastLvl.id] && m[lastLvl.id].done));
  const card = l => ({ id: l.id, name: levelName(l), group: groupOf(l), desc: levelDesc(l), d: l.d, review: !!(m[l.id] && m[l.id].done) });
  const lv = LEVELS.find(l => l.id === S.level);
  return { name: playerName(PLAYER), streak: st.streak, roundsToday: LOCAL.rounds.filter(r => r.day === day).length,
    mid: !COMP && midRound() && lv ? levelName(lv) + ' · ' + t('taskOf', S.i + 1, S.qs.length) : '',
    next: nx ? card(nx) : null, due: LEVELS.filter(l => dueReview(m, l.id, now) && (!nx || l.id !== nx.id)).map(card),
    week: LOCAL.rounds.filter(r => r.ts >= weekStart(now)).length, paper: nextPaper(), notebook: notebookData(now),
    days: weekData(now).days, learned: LEVELS.filter(l => m[l.id] && m[l.id].done).length, levels: LEVELS.length, badge: nextBadge(st),
    compN: COMP_N, compMin: COMP_MIN };
}
// Today's cards: play this level now
export function playLevel(id){ S.level = id; paintPill(); newRound(); }
$('closeStats').onclick = back;
$('closeParent').onclick = back;   // to where it was opened from: badges, players or the round

$('practise').onclick = () => {
  const keys = statsFrom(LOCAL.rounds).trouble.map(x => x.key);
  if(!keys.length) return;
  const set = [];
  for(let i = 0; set.length < LOCAL.n && i < LOCAL.n*4; i++){
    const q = genForFact(keys[i % keys.length]);
    if(q) set.push(q);
  }
  if(set.length) newRound(shuffle(set));
};

// The look on this device (not per player, not synced): the theme, and glass or solid chrome. index.html
// applies it before the first paint; here it is chosen and kept.
const LOOK_KEY = 'crossingten.look';
const lookNow = () => { try { return JSON.parse(localStorage.getItem(LOOK_KEY)) || {}; } catch(e){ return {}; } };
function paintLook(){
  const l = lookNow(), root = document.documentElement;
  if(l.theme) root.dataset.theme = l.theme; else delete root.dataset.theme;
  if(l.solid) root.dataset.solid = '1'; else delete root.dataset.solid;
  document.querySelectorAll('#themeSeg button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === (l.theme || ''))));
  document.querySelectorAll('#glassSeg button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === (l.solid ? '1' : ''))));
}
const setLook = change => { try { localStorage.setItem(LOOK_KEY, JSON.stringify(Object.assign(lookNow(), change))); } catch(e){} paintLook(); };
document.querySelectorAll('#themeSeg button').forEach(b => b.onclick = () => setLook({ theme: b.dataset.v || undefined }));
document.querySelectorAll('#glassSeg button').forEach(b => b.onclick = () => setLook({ solid: b.dataset.v === '1' || undefined }));
paintLook();
// the list beside the task opens on a tap and stays so on this device (off at first: she solves with the whole screen)
const SIDE_KEY = 'crossingten.side';
function paintSideOpen(open){ document.body.classList.toggle('sideopen', open); $('sideBtn').setAttribute('aria-pressed', String(open)); }
try { paintSideOpen(localStorage.getItem(SIDE_KEY) === '1'); } catch(e){ paintSideOpen(false); }
$('sideBtn').onclick = () => { const open = !document.body.classList.contains('sideopen'); paintSideOpen(open); try { localStorage.setItem(SIDE_KEY, open ? '1' : '0'); } catch(e){} };
// her next competition, set by a grown-up (the rounds run over a week or two, each school on its own day)
const paperAt = () => [...new Set(LEVELS.flatMap(l => l.papers).filter(p => p !== 'basics').map(p => compOf(p) === 'mbg' ? 'mbg-' + roundOf(p) : compOf(p)))];
const paperAtName = at => t('comps')[at.split('-')[0]] + (at.includes('-') ? ' ' + t('mbgRounds')[at.split('-')[1]] : '');
function paintPaperSet(){
  const nx = LOCAL.next || { at:'', date:'' };
  $('paperAt').innerHTML = '<option value="">' + t('noPaper') + '</option>' + paperAt().map(a => '<option value="' + a + '"' + (a === nx.at ? ' selected' : '') + '>' + paperAtName(a) + '</option>').join('');
  $('paperDate').value = nx.date || ''; $('paperDate').hidden = !nx.at;
}
$('paperAt').onchange = $('paperDate').onchange = () => {
  LOCAL.next = $('paperAt').value ? { at: $('paperAt').value, date: $('paperDate').value } : undefined; saveLocal(); paintPaperSet();
};
// The countdown on Today: how many days to it, and how ready she is — the levels its papers ask (her grade) learned,
// each counting 1 + how many dated papers ask it. Nothing once the day has passed or no date is set.
export function nextPaper(){
  const nx = LOCAL.next;
  if(!nx || !nx.at || !/^\d{4}-\d\d-\d\d$/.test(nx.date || '')) return null;
  const [y, mo, d] = nx.date.split('-').map(Number), when = new Date(y, mo - 1, d), today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.round((+when - +today) / 864e5);
  if(days < 0) return null;
  const g = myGrade(), m = mastery(LOCAL.rounds), ls = LEVELS.filter(l => l.papers.some(p => paperSrc(p).startsWith(nx.at) && paperGrade(p) === g));
  const w = l => 1 + (l.freq || 0), all = ls.reduce((s, l) => s + w(l), 0), got = ls.filter(l => m[l.id] && m[l.id].done).reduce((s, l) => s + w(l), 0);
  return { at: nx.at, name: paperAtName(nx.at) + ' · ' + t('gradeN', g), days, ready: all ? Math.round(100 * got / all) : 0,
    when: when.toLocaleDateString(LANG_TAG[LANG], { weekday:'long', day:'numeric', month:'long' }) };
}
// Train for it: the levels page, focused on that competition and round in her grade
export function trainFor(at){
  loadFocus();
  [PICK_GRADE, PICK_COMP, PICK_ROUND, PICK_PAPER] = [myGrade(), at.split('-')[0], at.split('-')[1] || '', ''];
  saveFocus(); go('levels');
}
// her grade: the levels page, the suggestion and a paper keep to it
document.querySelectorAll('#gradeSeg button').forEach(b => b.onclick = () => {
  PLAYER.grade = +b.dataset.g; PLAYER.updated = Date.now(); savePlayers(); PICK_FOR = null;   // updated: the newest edit wins across devices
  document.querySelectorAll('#gradeSeg button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  syncSoon();
});
document.querySelectorAll('#ansSeg button').forEach(b => b.onclick = () => {
  LOCAL.choice = b.dataset.c === '1'; saveLocal();
  document.querySelectorAll('#ansSeg button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  if(!midRound()) newRound();
});
document.querySelectorAll('#lenSeg button').forEach(b => b.onclick = () => {
  LOCAL.n = +b.dataset.n; saveLocal();
  document.querySelectorAll('#lenSeg button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
});

let resetArmed = null;
$('reset').onclick = () => {
  if(!resetArmed){
    resetArmed = setTimeout(() => { resetArmed = null; $('reset').classList.remove('armed'); $('reset').textContent = t('reset'); }, 3500);
    $('reset').classList.add('armed'); $('reset').textContent = t('resetArm');
    return;
  }
  clearTimeout(resetArmed); resetArmed = null;
  $('reset').classList.remove('armed'); $('reset').textContent = t('reset');
  LOCAL.rounds = []; saveLocal(); ARCHIVE.drop(PLAYER.id);
  PLAYER.resetAt = PLAYER.updated = Date.now(); savePlayers(); syncSoon();   // other devices drop her older rounds too
  setW(weightsFrom(LOCAL.rounds));
  renderParent();
};

/* ---------- level picker ---------- */
// 'mbg-winter-2024-2' → МБГ · Зима 2024 · 2 клас
// 'mbg-winter-2024-2' is the paper 'mbg-winter-2024' for the 2nd grade; its names are papers/paperTag in js/i18n.js
const paperSrc = p => p.replace(/-\d+$/, ''), paperGrade = p => +p.slice(p.lastIndexOf('-') + 1);
const paperName = p => p === 'basics' ? t('basics') : t('src', t('papers')[paperSrc(p)], paperGrade(p));
// the picker's filter chip: the short tag and the grade, "Зима 2024 · 2 клас"; the full name is its tooltip
const paperChip = p => p === 'basics' ? t('basics') : t('paperTag')[paperSrc(p)] + ' · ' + t('gradeN', paperGrade(p));
function paintPill(){
  const l = LEVELS.find(x => x.id === S.level) || /** @type {Level} */ ({ eq:'' }), g = groupOf(l);
  $('levelName').textContent = levelName(l);
  $('sub').textContent = (l.papers ? paperName(l.papers[0]) : t('practice')) + (g ? ' · ' + g : '');
  paintSide();
}
// "3 days ago", then a date once it stops being recent — precise enough to decide
// what to practise without turning the picker into a log.
function ago(ts){
  const today = dayKey(Date.now()), then = dayKey(ts);
  if(today === then) return t('today');
  const days = Math.round((Date.parse(today + 'T12:00:00') - Date.parse(then + 'T12:00:00')) / 86400000);
  if(days === 1) return t('yesterday');
  if(days < 7) return t('daysAgo', days);
  return new Date(ts).toLocaleDateString(LANG_TAG[LANG], { day:'numeric', month:'short' });
}
function levelHistory(rounds){
  const m = {};
  rounds.forEach(r => {
    const h = m[r.level] || (m[r.level] = { last:null, n:0, f:0, rounds:0 });
    h.n += r.n; h.f += r.firstTry; h.rounds++;
    if(!h.last || r.ts > h.last.ts) h.last = r;
  });
  return m;
}
// A level counts as learned at four in five first try, over at least fifteen
// questions — enough to mean something, reachable in two rounds.
function mastery(rounds){
  const by = {};
  rounds.forEach(r => (by[r.level] = by[r.level] || []).push(r));
  const out = {};
  Object.keys(by).forEach(k => {
    const recent = by[k].slice().sort((a, b) => a.ts - b.ts).slice(-3);
    const n = recent.reduce((t, r) => t + r.n, 0);
    const f = recent.reduce((t, r) => t + r.firstTry, 0);
    const last = recent[recent.length - 1];
    // streak: the good rounds (80% first try) in a row up to the last one — how far up the review ladder it is
    let streak = 0;
    for(const r of by[k].slice().sort((a, b) => b.ts - a.ts)){ if(r.n && r.firstTry / r.n >= 0.8) streak++; else break; }
    out[k] = { n, f, rate: n ? f/n : 0, done: n >= 15 && f/n >= 0.8, rounds: by[k].length,
               lastRate: last.n ? last.firstTry / last.n : 0, at: last.ts, streak };
  });
  return out;
}
// A learned level comes back for a review, or it fades: a day after it is learned, then 3, 7, 14
// and 30 days after each good review. A slip drops the streak, and the ladder starts again.
const REVIEW_DAYS = [1, 3, 7, 14, 30];
const dueReview = (m, id, now) => { const x = m[id];
  return !!(x && x.done && x.at && now - x.at >= REVIEW_DAYS[Math.min(Math.max(x.streak - 2, 0), REVIEW_DAYS.length - 1)] * 864e5); };
// The next thing to practise: the easiest level she has not learned yet whose
// groundwork is done. It recommends — nothing is ever locked away.
// lastDone: the round just played was on a learned level (a review), so this time a repair.
// Reviews wait until every level has been tried: breadth first.
// pool: the picker's focus (say МБГ · Есен · 2 клас) — only its levels are suggested, and groundwork
// outside it does not hold them back.
function nextUp(m, lastGrp, lastDone, now = Date.now(), pool){
  const done = id => m[id] && m[id].done;
  // groundwork from a lower grade than hers is taken as done: a 3rd-grader has had the 2nd grade;
  // inside a focus, only groundwork outside it is — a 2nd-grader going over the 1st grade takes it in order
  const met = id => { const l = LEVELS.find(x => x.id === id); return done(id) || (pool ? !pool(l) : l.grade < myGrade()); };
  // and a lower grade's own levels are not suggested to her at all, unless she picked them as her focus
  const all = LEVELS.filter(l => (pool ? pool(l) : l.grade >= myGrade()) && !done(l.id) && (l.needs || []).every(met));
  // her own grade first (the profile's, 2nd by default), then the next grade up once those are learned
  const gs = all.map(l => l.grade), up = gs.filter(g => g >= myGrade()), at = up.length ? Math.min(...up) : Math.min(...gs);
  const open = all.filter(l => l.grade === at);
  const grp = l => l.grp || l.op;
  const fresh = open.filter(l => !m[l.id]);
  if(fresh.length){
    // Still meeting the levels: the easiest one she has not seen. Same difficulty,
    // different corner of the app — six geometry levels running is duller and sticks
    // less well than mixing them up.
    // at one difficulty, the task the papers ask most often comes first
    const ranked = fresh.slice().sort((a, b) => a.d - b.d || b.freq - a.freq);
    const best = ranked[0];
    if(grp(best) !== lastGrp) return best;
    // Nothing else at this difficulty from another corner? One step harder is still a
    // step forward, and beats a sixth helping of the same kind.
    return ranked.filter(l => l.d === best.d && grp(l) !== lastGrp)[0]
        || ranked.filter(l => l.d === best.d + 1 && grp(l) !== lastGrp)[0]
        || best;
  }
  // Every level tried: now the learned ones come back when due — one at a time between repairs,
  // the longest overdue for its step first.
  if(!lastDone){
    const due = LEVELS.filter(l => (pool ? pool(l) : l.grade === myGrade()) && dueReview(m, l.id, now));
    const late = l => (now - m[l.id].at) / REVIEW_DAYS[Math.min(Math.max(m[l.id].streak - 2, 0), REVIEW_DAYS.length - 1)];
    if(due.length) return due.sort((a, b) => late(b) - late(a))[0];
  }
  if(!open.length) return null;
  // She has met them all: go back to whichever is going worst, by its record and then
  // by how the last round went — a task many papers ask counts a little worse, so it is repaired first.
  // ponytail: 0.02 a paper is a nudge (8 papers ≈ 16 points of first-try rate), tune if repair feels off
  const need = l => m[l.id].rate - 0.02*l.freq;
  return open.slice().sort((a, b) =>
    need(a) - need(b) || m[a.id].lastRate - m[b.id].lastRate)[0];
}

// The grades there are levels for, and the one on her profile (2nd until someone sets it).
const GRADES = [...new Set(LEVELS.map(l => l.grade))].sort();
const myGrade = () => PLAYER.grade || 2;
// One level as a row — the levels page and the list beside the task (a wide screen) draw the same one.
// How hard it is, on the rubric in the README: operations, reading, search, number size and how easy
// the trap is to miss — five dots. Its status: learned, new, or right first time on its last round.
const hard = l => '<span class="dots5" title="' + t('difficulty', l.d) + '" aria-label="' + t('difficulty', l.d) + '">' +
  [1,2,3,4,5].map(k => '<i class="' + (k <= l.d ? 'on' : '') + '"></i>').join('') + '</span>';
const sym = l => /[А-Яа-яЁёЇїІіЄєA-Za-z]{2}/.test(levelName(l)) ? '' : ' sym';   // "42 − 17" is set like a sum
function levelStatus(l, m, hist){
  if(m[l.id] && m[l.id].done) return '<span class="tick" aria-label="' + t('learned') + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg></span>';
  const h = hist[l.id];
  if(!h) return '<span class="isnew">' + t('isNew') + '</span>';
  const pc = h.last.n ? Math.round(100 * h.last.firstTry / h.last.n) : 0;
  return '<span class="stat" aria-label="' + t('pctFirst', pc) + '"><b>' + pc + '%</b><i>' + ago(h.last.ts) + '</i></span>';
}
const levelRow = (l, m, hist, tags = '') => '<button class="pick" data-lvl="' + l.id + '" aria-pressed="' + (l.id === S.level) + '">' +
  '<span class="nm"><span class="eq' + sym(l) + '">' + levelName(l) + tags + '</span><span class="desc">' + levelDesc(l) + '</span></span>' +
  hard(l) + levelStatus(l, m, hist) + '</button>';
// The list beside the task on a wide screen (app.css shows it): the levels of the one being played.
// ponytail: redrawn when the level changes or a round ends; 20-odd rows, cheap.
function paintSide(){
  const l = LEVELS.find(x => x.id === S.level);
  if(!l) return;
  const m = mastery(LOCAL.rounds), hist = levelHistory(LOCAL.rounds), key = groupKey(l), mine = LEVELS.filter(x => groupKey(x) === key && x.grade === l.grade);
  const learned = LEVELS.filter(x => m[x.id] && m[x.id].done).length;
  // as drawn: the app and who plays, the four sections (the tab bar's own buttons), how far overall, the level's group,
  // and the practice paper at the foot
  $('side').innerHTML = '<div class="tabhead"><span class="logo" aria-hidden="true">10</span><b>' + t('appName') + '</b><button class="sidewho">' + mascotSvg(PLAYER.mascot) + esc(playerName(PLAYER)) + '</button></div>' +
    '<nav class="sidenav">' + [...document.querySelectorAll('#tabs > button')].map(b => '<button data-r="' + b.dataset.r + '">' + b.innerHTML + '</button>').join('') + '</nav>' +
    '<div class="progress"><span class="track"><i style="width:' + Math.round(100 * learned / LEVELS.length) + '%"></i></span><span>' + t('learnedOf', learned, LEVELS.length) + '</span></div>' +
    '<div class="grouphead"><b>' + groupOf(l) + '</b><span>' + t('learnedGroup', mine.filter(x => m[x.id] && m[x.id].done).length, mine.length) + '</span></div>' +
    '<div class="gcard list">' + mine.map(x => levelRow(x, m, hist)).join('') + '</div>' +
    '<button class="gcard nextcard comp sidecomp"><span class="nm"><span class="lab">' + t('compName') + '</span><span class="eq">' + t('compWhat', COMP_N, COMP_MIN) + '</span></span>' + CHEV + '</button>';
  $('side').querySelectorAll('[data-lvl]').forEach(b => b.onclick = () => {
    if(+b.dataset.lvl === S.level || (midRound() && !confirm(t('pickWarn')))) return;
    S.level = +b.dataset.lvl; paintPill(); newRound();
  });
  $('side').querySelectorAll('.sidenav button').forEach(b => b.onclick = () => go(b.dataset.r));
  $('side').querySelector('.sidecomp').onclick = () => { if(!midRound() || confirm(t('pickWarn'))) startComp(); };
  $('side').querySelector('.sidewho').onclick = openPlayers;
  const now = $('side').querySelector('[aria-pressed="true"]');
  if(now) now.scrollIntoView({ block:'nearest' });
}
const CHEV = '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';
const OPENED = new Map();   // a group she opened or closed on the levels page stays so while the app is open
function buildPicker(){
  const hist = levelHistory(LOCAL.rounds);
  const m = mastery(LOCAL.rounds);
  const done = l => m[l.id] && m[l.id].done;
  // which papers ask this level: one tag per round, "Есен ×6" when several years share it (the years in its title)
  const paperTags = l => {
    const ps = l.papers.filter(p => !PICK_PAPER && p !== 'basics' && paperSrc(p) !== 'mbg-autumn' && (!PICK_COMP || compOf(p) === PICK_COMP) && (!PICK_ROUND || roundOf(p) === PICK_ROUND));
    const byRound = {};
    ps.forEach(p => { const r = paperSrc(p).replace(/-\d{4}$/, ''); (byRound[r] = byRound[r] || []).push(p); });
    return Object.values(byRound).map(g => ' <span class="gtag gw"' + (g.length > 1 ? ' title="' + g.map(p => t('paperTag')[paperSrc(p)]).join(', ') + '"' : '') + '>' +
      (g.length > 1 ? t('paperTag')[paperSrc(g[0])].replace(/\s*\d{4}$/, '') + ' ×' + g.length : t('paperTag')[paperSrc(g[0])]) + '</span>').join('');
  };
  const row = l => levelRow(l, m, hist, (l.src === 'basics' ? (PICK_COMP ? '' : ' <span class="gtag gb">' + t('basics') + '</span>') : PICK_GRADE ? '' : ' <span class="gtag g' + l.grade + '">' + t('gradeN', l.grade) + '</span>') + paperTags(l));

  // topics: every group, as filter chips that wrap rather than scroll
  // three filters: the grade, the competition (МБГ, Коледно, the basics), and within it one paper
  loadFocus();
  const gradeOk = l => !PICK_GRADE || l.grade === PICK_GRADE, shown = inFocus;
  const groups = PICK_GROUPS.map(g => ({ k: g.key, levels: LEVELS.filter(l => g.has(l) && shown(l)) })).filter(g => g.levels.length);
  if(!groups.some(g => g.k === PICK_TOPIC)) PICK_TOPIC = '';
  $('pickTopics').innerHTML = '<button data-k="" aria-pressed="' + (PICK_TOPIC === '') + '">' + t('all') + '</button>' +
    groups.map(g => '<button data-k="' + g.k + '" aria-pressed="' + (PICK_TOPIC === g.k) + '">' + t('groups')[g.k] + '</button>').join('');
  $('pickTopics').querySelectorAll('button').forEach(b => b.onclick = () => { PICK_TOPIC = b.dataset.k; buildPicker(); });
  // the rows of chips: grade, then competition, then — when it has more than one — its papers,
  // newest year first, autumn before winter, and the autumn levels with no year last
  const chips = (id, items, cur, pick) => {
    $(id).hidden = items.length < 2;
    $(id).innerHTML = items.map(([v, label, title]) => '<button data-v="' + v + '" aria-pressed="' + (cur === v) + '"' + (title ? ' title="' + title + '"' : '') + '>' + label + '</button>').join('');
    $(id).querySelectorAll('button').forEach(b => b.onclick = () => { pick(b.dataset.v); buildPicker(); saveFocus(); });
  };
  const grades = [...new Set(LEVELS.map(l => l.grade))].sort();
  const gradeItems = [['0', t('allGrades')]].concat(grades.map(g => [String(g), t('gradeN', g)])), pickGrade = v => { PICK_GRADE = +v; PICK_ROUND = PICK_PAPER = ''; };
  chips('pickGrades', gradeItems, String(PICK_GRADE), pickGrade);
  // the same choice as a menu in the bar (a phone shows this one)
  $('pickGradeSel').innerHTML = gradeItems.map(([v, label]) => '<option value="' + v + '"' + (v === String(PICK_GRADE) ? ' selected' : '') + '>' + label + '</option>').join('');
  $('pickGradeSel').onchange = () => { pickGrade($('pickGradeSel').value); buildPicker(); saveFocus(); };
  const inGrade = LEVELS.filter(gradeOk), comps = [...new Set(inGrade.flatMap(l => l.papers.map(compOf)))].sort((a, b) => +(a !== 'basics') - +(b !== 'basics') || +(a !== 'mbg') - +(b !== 'mbg'));
  if(PICK_COMP && !comps.includes(PICK_COMP)) PICK_COMP = PICK_PAPER = '';
  chips('pickComps', [['', t('all')]].concat(comps.map(c => [c, c === 'basics' ? t('basics') : t('comps')[c]])), PICK_COMP, v => { PICK_COMP = v; PICK_ROUND = PICK_PAPER = ''; });
  // МБГ has rounds — autumn, winter, … — each with its years; a competition with one round skips this row
  const ofComp = PICK_COMP ? [...new Set(inGrade.flatMap(l => l.papers.filter(p => compOf(p) === PICK_COMP && (!PICK_GRADE || paperGrade(p) === PICK_GRADE) && inGrade.some(m => inPaper(m, p)))))] : [];
  const ROUNDS = ['autumn', 'winter', 'spring', 'semifinal', 'final'], rounds = [...new Set(ofComp.map(roundOf).filter(Boolean))].sort((a, b) => ROUNDS.indexOf(a) - ROUNDS.indexOf(b));
  if(PICK_ROUND && !rounds.includes(PICK_ROUND)) PICK_ROUND = '';
  chips('pickRounds', rounds.length > 1 ? [['', t('all')]].concat(rounds.map(r => [r, t('mbgRounds')[r]])) : [], PICK_ROUND, v => { PICK_ROUND = v; PICK_PAPER = ''; });
  const yearOf = p => +(paperSrc(p).match(/\d{4}$/) || [0])[0];
  const papers = ofComp.filter(p => !PICK_ROUND || roundOf(p) === PICK_ROUND)
    .sort((a, b) => +!yearOf(a) - +!yearOf(b) || yearOf(b) - yearOf(a) || ROUNDS.findIndex(r => a.includes(r)) - ROUNDS.findIndex(r => b.includes(r)) || paperGrade(a) - paperGrade(b));
  if(PICK_PAPER && !papers.includes(PICK_PAPER)) PICK_PAPER = '';
  // with a round picked, its papers are just years
  const paperLabel = p => (PICK_ROUND ? String(yearOf(p) || t('otherYears')) : t('paperTag')[paperSrc(p)]) + (PICK_GRADE ? '' : ' · ' + t('gradeN', paperGrade(p)));
  chips('pickPapers', papers.length > 1 ? [['', t('all')]].concat(papers.map(p => [p, paperLabel(p), paperName(p)])) : [], PICK_PAPER, v => { PICK_PAPER = v; });

  // start here / try this next: the recommendation, and what it opens up after
  const lastRound = LOCAL.rounds[LOCAL.rounds.length - 1];
  const lastLvl = lastRound && LEVELS.filter(l => l.id === lastRound.level)[0];
  const grp = l => l && (l.grp || l.op);
  const nx = suggest(m, grp(lastLvl), !!(lastLvl && done(lastLvl)));
  const review = nx && dueReview(m, nx.id, Date.now());
  const after = nx && suggest(Object.assign({}, m, { [nx.id]: { done:true, rate:1, lastRate:1, n:15, f:15, rounds:1, at:Date.now(), streak:3 } }), grp(nx), true);
  const scope = focused() ? LEVELS.filter(shown) : LEVELS;   // with a focus, the bar counts what is in it
  const learned = scope.filter(done).length, met = LEVELS.filter(l => m[l.id]).length;
  $('nextUp').innerHTML = (nx ? '<button class="gcard nextcard" data-lvl="' + nx.id + '"><span class="nm">' +
      '<span class="lab">' + t(review ? 'reviewNext' : !met ? 'startHere' : met < LEVELS.length ? 'tryNext' : 'needsWork') + '</span>' +
      '<span class="eq">' + levelName(nx) + '</span>' +
      '<span class="meta"><span>' + groupOf(nx) + '</span>' + hard(nx) + '</span>' +
      (after ? '<span class="meta">' + t('nextAfter', levelName(after)) + '</span>' : '') +
      '</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>'
    : '<div class="gcard advice">' + t('allLearned') + '</div>') +
    '<div class="progress"><span class="track"><i style="width:' + Math.round(100*learned/scope.length) + '%"></i></span><span>' +
    t('learnedOf', learned, scope.length) + '</span></div>';

  // the list's head: what is chosen and how many levels it holds; and the reviews waiting
  const listed = LEVELS.filter(l => shown(l) && (!PICK_TOPIC || groupKey(l) === PICK_TOPIC));
  $('pickHead').textContent = [PICK_COMP ? t('comps')[PICK_COMP] + (PICK_ROUND ? ' ' + t('mbgRounds')[PICK_ROUND] : '') : '', PICK_GRADE ? t('gradeN', PICK_GRADE) : t('allGrades'),
    PICK_TOPIC ? t('groups')[PICK_TOPIC] : '', t('levelsN', listed.length)].filter(Boolean).join(' · ');
  const due = LEVELS.filter(l => dueReview(m, l.id, Date.now()));
  $('pickDue').hidden = !due.length;
  $('pickDue').innerHTML = '<span class="nm"><span class="lab">' + t('forToday') + '</span><span class="eq">' + t('dueLearned', due.length) + '</span></span>' + CHEV;
  $('pickDue').onclick = () => { if(due.length){ S.level = due[0].id; paintPill(); newRound(); } };
  // a competition picked is something to train for: one path through its levels, easiest first,
  // in the order the suggestion takes them
  const path = focused() && LEVELS.filter(l => shown(l) && (!PICK_TOPIC || groupKey(l) === PICK_TOPIC)).sort((a, b) => a.d - b.d || b.freq - a.freq);
  $('pickAll').innerHTML = path ? '<div class="grouphead"><b>' + t('byDifficulty') + '</b><span>' + t('learnedGroup', path.filter(done).length, path.length) + '</span></div>' +
    '<div class="gcard list">' + path.map(row).join('') + '</div>' :
    // a group folds: open when a topic is picked, or it holds the level played or the one suggested, unless she folded it
    groups.filter(g => !PICK_TOPIC || g.k === PICK_TOPIC).map(g => {
      const def = !!PICK_TOPIC || g.levels.some(l => l.id === S.level || (nx && l.id === nx.id)), open = OPENED.has(g.k) ? OPENED.get(g.k) : def;
      return '<details class="grp" data-k="' + g.k + '" data-def="' + def + '"' + (open ? ' open' : '') + '><summary class="grouphead"><b>' + CHEV + t('groups')[g.k] + '</b><span>' +
        t('learnedGroup', g.levels.filter(done).length, g.levels.length) + '</span></summary>' +
        '<div class="gcard list">' + g.levels.map(row).join('') + '</div></details>';
    }).join('');
  // a group drawn open fires a toggle of its own: only a change from how it was drawn is hers
  $('pickAll').querySelectorAll('details').forEach(d => d.ontoggle = () => { if(String(d.open) === d.dataset.def) OPENED.delete(d.dataset.k); else OPENED.set(d.dataset.k, d.open); });
  document.querySelectorAll('#picker [data-lvl]').forEach(b => b.onclick = () => {
    S.level = +b.dataset.lvl;
    paintPill();
    newRound();
  });
}
let PICK_TOPIC = '', PICK_FOR = null, PICK_GRADE = 0, PICK_COMP = '', PICK_ROUND = '', PICK_PAPER = '';
// The picker's filters are her focus, kept on this device: each child starts on her own grade, and a
// competition picked stays picked — the list and the suggestion keep to it until it is changed.
function loadFocus(){
  if(PICK_FOR === PLAYER.id) return;
  PICK_FOR = PLAYER.id;
  // a focus picked while she was in another grade is dropped: a new school year starts on the new grade
  const f = Array.isArray(LOCAL.focus) && LOCAL.focus[4] === myGrade() ? LOCAL.focus : [myGrade(), '', '', ''];
  [PICK_GRADE, PICK_COMP, PICK_ROUND, PICK_PAPER] = f;
}
const saveFocus = () => { LOCAL.focus = [PICK_GRADE, PICK_COMP, PICK_ROUND, PICK_PAPER, myGrade()]; saveLocal(); };
const inFocus = l => (!PICK_GRADE || l.grade === PICK_GRADE) && (!PICK_COMP || l.papers.some(p => compOf(p) === PICK_COMP)) &&
  (!PICK_ROUND || l.papers.some(p => compOf(p) === PICK_COMP && roundOf(p) === PICK_ROUND)) && (!PICK_PAPER || inPaper(l, PICK_PAPER));
// a focus is a competition picked, or a grade other than hers (a 2nd-grader going over the 1st grade first)
const focused = () => !!(PICK_COMP || (PICK_GRADE && PICK_GRADE !== myGrade()));
// the suggestion keeps to the focus; once that is all learned, the whole grade again
const suggest = (m, lastGrp, lastDone) => (focused() && nextUp(m, lastGrp, lastDone, Date.now(), inFocus)) || nextUp(m, lastGrp, lastDone);
const roundOf = p => compOf(p) === 'mbg' ? paperSrc(p).split('-')[1] : '';
const compOf = p => p === 'basics' ? 'basics' : p.split('-')[0];
// the autumn levels with no year are the ones not yet traced to a paper; the rest are under their year
const inPaper = (l, p) => paperSrc(p) === 'mbg-autumn' ? l.papers[0] === p && !l.papers.some(q => /^mbg-autumn-\d{4}-/.test(q)) : l.papers.includes(p);
const midRound = () => S.i > 0 || S.parts.some(p => p !== '') || S.results.length > 0;
$('levelPill').onclick = () => go('levels');
$('closePick').onclick = back;
paintPill();

/* ---------- players ----------
   Tap the mascot to change player. Switching reloads the page: every setting, the log,
   the language and the mascot then come up exactly as a fresh launch would. */
// function declarations, not consts: the side panel draws while the module is still loading (a saved round resumed)
function esc(v){ return String(v).replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c])); }
function playerName(p){ return p.name || t('playerN', PLAYERS.list.indexOf(p) + 1); }
const EDIT_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/></svg>';
const FLAME = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 .5-3-1-5 1-9.5z"/></svg>';
export function chose(){ try { sessionStorage.setItem('crossingten.chosen', '1'); } catch(e){} }
function switchTo(id){ PLAYERS.cur = id; savePlayers(); chose(); history.replaceState(null, '', location.pathname + location.search); location.reload(); }   // she starts on the round, not on the screen she switched from
// A player's saved log and settings (the current player's are LOCAL).
function storeOf(p){
  if(p.id === PLAYER.id) return LOCAL;
  let s = { rounds:[], muted:false, n:10 };
  try { s = Object.assign(s, JSON.parse(localStorage.getItem(roundsKey(p))) || {}); } catch(e){}
  s.rounds = unionRounds(ARCH[p.id] || [], s.rounds);
  return s;
}
function paintPlayers(){
  $('playerList').innerHTML = PLAYERS.list.map(p => {
    const rounds = storeOf(p).rounds, m = mastery(rounds), st = statsFrom(rounds);
    const pill = !rounds.length ? '<span class="pill cool">' + t('newPl') + '</span>'
               : st.streak >= 2 ? '<span class="pill warm">' + FLAME + t('streakDays', st.streak) + '</span>' : '';
    return '<div class="ptile">' +
      '<button class="pchoose" data-id="' + p.id + '" aria-pressed="' + (p === PLAYER) + '">' + mascotSvg(p.mascot) +
        '<b>' + esc(playerName(p)) + '</b><span class="pmeta">' + t('gradeN', p.grade || 2) + ' · ' + t('rounds', rounds.length) +
        '</span>' + pill + '</button>' +
      '<button class="icon pedit" data-edit="' + p.id + '" aria-label="' + t('edit') + ': ' + esc(playerName(p)) + '">' + EDIT_ICON + '</button>' +
    '</div>';
  }).join('') +
    '<button class="padd" id="pAdd"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>' +
    t('addPlayer') + '</button>';
  document.querySelectorAll('.pchoose').forEach(b => b.onclick = () => {
    if(b.dataset.id === PLAYER.id){ chose(); back(); } else switchTo(b.dataset.id);
  });
  document.querySelectorAll('.pedit').forEach(b => b.onclick = () => openEdit(PLAYERS.list.find(p => p.id === b.dataset.edit)));
  $('pAdd').onclick = () => openEdit(null);
  if(typeof paintSync === 'function') paintSync();
  $('playerEdit').hidden = true;
}
// the players' screen, or drawn again when it is already showing (after an edit)
function openPlayers(){ if(routeNow() === 'players') applyRoute(); else go('players'); }
let EDIT = null, delArmed = null;
// welcome: the very first launch on a device - the same form, asking her name, mascot and
// language before anything else, with a way to join a family that already plays elsewhere.
let WELCOME = false;
function openEdit(p, welcome){
  WELCOME = !!welcome;
  const taken = PLAYERS.list.map(x => x.mascot);
  EDIT = p ? Object.assign({}, p)
           : { id:'p' + Date.now().toString(36), name:'', lang:LANG, grade:2,
               mascot: Object.keys(MASCOTS).find(k => taken.indexOf(k) < 0) || 'cat' };
  const kept = p ? storeOf(p) : { muted:false, calm:false };
  document.body.classList.toggle('welcome', WELCOME);   // the first-run form stands alone: no tab bar under it (app.css)
  $('editTitle').textContent = p ? t('profile') : t('newPlayer');
  $('pName').value = EDIT.name;
  $('pName').placeholder = p ? playerName(p) : t('playerN', PLAYERS.list.length + 1);
  $('pSound').checked = !kept.muted; $('pCalm').checked = !!kept.calm;
  $('pDelete').parentNode.hidden = !p || PLAYERS.list.length < 2 || WELCOME;
  $('pCancel').hidden = WELCOME;
  paintWelcome();
  clearTimeout(delArmed); delArmed = null; $('pDelete').classList.remove('armed'); $('pDelete').textContent = t('delPlayer');
  paintEdit();
  $('players').hidden = true; $('playerEdit').hidden = false;
}
function paintEdit(){
  $('pAvatar').innerHTML = mascotSvg(EDIT.mascot);
  $('pMascot').innerHTML = Object.keys(MASCOTS).map(k => '<button class="mchoice" role="radio" data-m="' + k + '" aria-checked="' +
    (k === EDIT.mascot) + '" aria-label="' + t('mascots')[k] + '">' + mascotSvg(k) + '</button>').join('');
  $('pLang').innerHTML = Object.keys(LANGS).map(k => '<label lang="' + k + '"><input type="radio" name="plang" value="' + k + '"' +
    (k === EDIT.lang ? ' checked' : '') + '>' + LANGS[k] + '</label>').join('');
  $('pGrade').innerHTML = GRADES.map(g => '<label><input type="radio" name="pgrade" value="' + g + '"' +
    (g === (EDIT.grade || 2) ? ' checked' : '') + '>' + t('gradeN', g) + '</label>').join('');
  document.querySelectorAll('#pGrade input').forEach(r => r.onchange = () => { EDIT.grade = +r.value; });
  document.querySelectorAll('.mchoice').forEach(b => b.onclick = () => { EDIT.mascot = b.dataset.m; paintEdit(); });
  document.querySelectorAll('#pLang input').forEach(r => r.onchange = () => {
    EDIT.lang = r.value;
    if(WELCOME){ setLang(r.value); applyText(); paintWelcome(); paintEdit(); }   // the whole screen switches at once
  });
}
function paintWelcome(){
  $('editSub').hidden = !WELCOME;
  $('welcomeJoin').hidden = !WELCOME || typeof SYNC_ON === 'undefined' || !SYNC_ON;
  if(!WELCOME) { $('pSave').textContent = t('save'); return; }
  $('editTitle').textContent = t('welcome');
  $('editSub').textContent = t('welcomeSub');
  $('pSave').textContent = t('start');
}
$('pSave').onclick = () => {
  EDIT.name = $('pName').value.trim().slice(0, 20);
  EDIT.updated = Date.now();
  const old = PLAYERS.list.find(p => p.id === EDIT.id);
  if(old) Object.assign(old, EDIT); else PLAYERS.list.push(EDIT);
  savePlayers();
  // her settings travel with her log: sound and calmer animation
  const kept = storeOf(EDIT);
  kept.muted = !$('pSound').checked; kept.calm = $('pCalm').checked;
  if(EDIT.id === PLAYER.id) saveLocal();
  else saveStore(roundsKey(EDIT), kept);
  // A new player starts playing at once; the current one reloads to wear the change.
  if(!old || EDIT.id === PLAYER.id) switchTo(EDIT.id); else openPlayers();
};
$('pCancel').onclick = openPlayers;
$('pDelete').onclick = () => {
  if(!delArmed){
    delArmed = setTimeout(() => { delArmed = null; $('pDelete').classList.remove('armed'); $('pDelete').textContent = t('delPlayer'); }, 3500);
    $('pDelete').classList.add('armed'); $('pDelete').textContent = t('delArm');
    return;
  }
  clearTimeout(delArmed); delArmed = null;
  PLAYERS.list = PLAYERS.list.filter(p => p.id !== EDIT.id);
  PLAYERS.gone.push({ id: EDIT.id, updated: Date.now() });   // so the other devices delete her too
  try { localStorage.removeItem(roundsKey(EDIT)); } catch(e){}
  ARCHIVE.drop(EDIT.id); delete ARCH[EDIT.id];
  if(EDIT.id === PLAYER.id) switchTo(PLAYERS.list[0].id); else { savePlayers(); openPlayers(); }
};
$('who').onclick = openPlayers;
$('tabWho').onclick = openPlayers;
$('parentBtn').onclick = () => go('parents');
$('closePlayers').onclick = () => { chose(); back(); };

/* ---------- controls ---------- */
$('pad').addEventListener('click', e => { const b = e.target.closest('.key'); if(b) press(b.dataset.k); });
$('again').onclick = () => newRound();
$('card').addEventListener('click', () => { if(S.settled) next(); });
document.addEventListener('keydown', e => {
  if(document.querySelector('.sheet:not([hidden])') || e.target.closest('input')) return;
  if(!$('choices').hidden){   // А/Б/В/Г: a letter picks (Cyrillic or Latin), Enter moves on; a typed digit is no answer here
    const k = e.key.toUpperCase(), id = Math.max('АБВГДЕ'.indexOf(k), 'ABCDEF'.indexOf(k));
    const b = id >= 0 && /** @type {HTMLButtonElement | null} */ ($('choices').querySelector('.ch[data-o="' + id + '"]'));
    if(b) b.click();
    else if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); if(!$('nextBtn').hidden) $('nextBtn').click(); else if(S.settled) next(); }
    return;
  }
  if(e.key >= '0' && e.key <= '9') press(e.key);
  else if(e.key === 'Backspace') press('del');
  else if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); press('go'); }
});

/* ---------- shared mirror ---------- */
// When this build was made: the page's own stamp (deploy-cf.sh writes it; Cloudflare sends no Last-Modified),
// else the Last-Modified GitHub Pages sends, which the browser keeps as document.lastModified.
const BUILT_STAMP = document.querySelector('meta[name="build"]')?.getAttribute('content');
const builtAt = () => Date.parse(BUILT_STAMP || document.lastModified);
export const builtOn = () => {
  try { return t('build') + new Date(builtAt())
    .toLocaleString(LANG_TAG[LANG], { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' }); }
  catch(e){ return ''; }
};
export const heldHere = () => t('heldHere', LOCAL.rounds.length);
$('synced').textContent = heldHere() + builtOn();   // sync.js takes this line over when sync is on

export const say = t => { $('synced').textContent = t + builtOn(); };

// Safari keeps pinch-zoom even with user-scalable=no; for a full-screen practice app
// an accidental pinch just breaks the layout, so the gesture is turned off here. It is
// a deliberate trade against the usual advice — nothing on the page needs magnifying.
['gesturestart', 'gesturechange', 'gestureend'].forEach(g =>
  document.addEventListener(g, e => e.preventDefault(), { passive: false }));

// The whole history first (it decides what is learned), then the first question.
ARCHIVE_READY.then(() => {
  // A launch starts on the level the picker would recommend, not on a fixed one.
  {
    const last = LOCAL.rounds[LOCAL.rounds.length - 1], lastLvl = last && LEVELS.find(l => l.id === last.level);
    loadFocus();
    const m0 = mastery(LOCAL.rounds), nx = suggest(m0, lastLvl && (lastLvl.grp || lastLvl.op), !!(lastLvl && m0[lastLvl.id] && m0[lastLvl.id].done));
    if(nx){ S.level = nx.id; paintPill(); }
  }
  // a round left unfinished in the last 12 hours goes on where it was; anything odd starts a fresh one
  (() => {
    try {
      const kept = JSON.parse(localStorage.getItem(RS));
      if(kept && Date.now() - kept.at < 12*3600e3 && LEVELS.some(l => l.id === kept.s.level) && kept.s.i < kept.s.qs.length){
        Object.assign(S, kept.s); paintPill(); show(); return;
      }
    } catch(e){}
    newRound();
    if(START_ROUTE === 'play') go('today', true);   // nothing unfinished: the day starts on Today
  })();
  // reloaded on a screen (the round under it ready): back to that screen
  if(START_ROUTE !== 'play') go(START_ROUTE, true);
  // Only the very first launch on a device asks who she is; after that a launch opens on Today, or on the round
  // left unfinished (the mascot switches player).
  if(FIRST) openEdit(PLAYER, true);
});
// Installed on the home screen, ask the browser to keep this data (in a tab, Firefox would ask the child).
if((matchMedia('(display-mode: standalone)').matches || navigator.standalone) && navigator.storage && navigator.storage.persist)
  navigator.storage.persist().catch(() => {});

// A home-screen app, or a tab, stays open for days. At the start of a round, and coming back
// to the screen between rounds, it picks up a newer build, told by the page's Last-Modified
// (no header: nothing happens). Nothing is lost: it only reloads before a key is pressed.
function newerBuild(){
  if(document.visibilityState !== 'visible' || midRound() || COMP) return;
  if(BUILT_STAMP) fetch(location.pathname, { cache:'no-cache' }).then(r => r.text()).then(html => {
    const m = html.match(/<meta name="build" content="([^"]+)">/);
    if(m && Date.parse(m[1]) > builtAt()){ chose(); location.reload(); }
  }).catch(() => {});
  else fetch(location.pathname, { method:'HEAD', cache:'no-cache' }).then(r => {
    if(Date.parse(r.headers.get('last-modified')) > builtAt() + 60000){ chose(); location.reload(); }
  }).catch(() => {});
}
document.addEventListener('visibilitychange', newerBuild);
// Offline play, and the same build everywhere.
if('serviceWorker' in navigator && window.isSecureContext)
  navigator.serviceWorker.register('sw.js').catch(() => {});

startCompete();
startSync();

// The page's internals by name on window, as they were while every script shared one scope: for
// smoke.js, and for a look from the browser console. Getters, so a value reassigned later reads as it is now.
Object.defineProperties(window, Object.fromEntries(Object.entries({
  $: () => $, ARCHIVE: () => ARCHIVE, BADGES: () => BADGES, COMP: () => COMP, IN: () => IN, LEVELS: () => LEVELS, LOCAL: () => LOCAL, LS: () => LS,
  PICK_COMP: () => PICK_COMP, PICK_GRADE: () => PICK_GRADE, PICK_ROUND: () => PICK_ROUND, PLAYER: () => PLAYER, PLAYERS: () => PLAYERS, RS: () => RS, S: () => S,
  answer: () => answer, answers: () => answers, badgeName: () => badgeName, buildPicker: () => buildPicker, compTasks: () => compTasks, csvOf: () => csvOf,
  finish: () => finish, inFocus: () => inFocus, levelName: () => levelName, mastery: () => mastery, newRound: () => newRound, next: () => next, nextUp: () => nextUp,
  notebookData: () => notebookData, fixAll: () => fixAll, weekData: () => weekData, weeklyPng: () => weeklyPng, buildWeek: () => buildWeek, fixKind: () => fixKind, paintPill: () => paintPill, raw: () => raw, renderParent: () => renderParent, renderStats: () => renderStats, reveal: () => reveal, saveLocal: () => saveLocal, seeded: () => seeded, syncNow: () => syncNow, syncing: () => syncing, t: () => t, unionRounds: () => unionRounds,
}).map(([k, get]) => [k, { get, configurable: true }]).concat([['PICK_FOR', { get: () => PICK_FOR, set: v => { PICK_FOR = v; }, configurable: true }]])));
