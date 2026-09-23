const $ = s => document.getElementById(s);
const S = { level:2, qs:[], i:0, parts:[''], at:0, tries:0, revealed:false, settled:false, results:[], t0:0, timers:[], touched:false };

/* ---------- local log ---------- */
const LS = roundsKey(PLAYER);
let LOCAL = { rounds:[], muted:false, speak:true, n:10, calm:false, whys:0, choice:false };
// a competition under way (js/compete.js), and its clock
let COMP = null, compTick = null;
try { const raw0 = localStorage.getItem(LS); if(raw0) LOCAL = Object.assign(LOCAL, JSON.parse(raw0)); } catch(e){}
// calm: the player's own "less motion", on top of the system setting
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches || !!LOCAL.calm;
document.documentElement.classList.toggle('calm', !!LOCAL.calm);
function saveLocal(){
  try { localStorage.setItem(LS, JSON.stringify(Object.assign({}, LOCAL, { rounds: LOCAL.rounds.slice(-400) }))); } catch(e){}
}

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
const sfx = {
  good(){ if(LOCAL.muted) return; tone(660,0,.13,.18); tone(990,.1,.22,.15); },
  ok(){ if(LOCAL.muted) return; tone(560,0,.2,.14); },
  bad(){ if(LOCAL.muted) return; tone(233,0,.17,.13,'sine'); tone(196,.1,.24,.11,'sine'); },
  tap(){ if(LOCAL.muted) return; tone(880,0,.045,.05,'sine'); },
  tune(notes, gap){ if(LOCAL.muted) return; notes.forEach((f,k) => tone(f, k*gap, .3, .13)); }
};
function paintMute(){
  const on = !LOCAL.muted;
  $('muteBtn').setAttribute('aria-pressed', String(on));
  $('wave1').style.display = on ? '' : 'none';
  $('wave2').style.display = on ? '' : 'none';
  $('waveX').style.display = on ? 'none' : '';
}
$('muteBtn').onclick = () => { LOCAL.muted = !LOCAL.muted; paintMute(); saveLocal(); if(!LOCAL.muted) sfx.tap(); };
paintMute();

/* ---------- speech ---------- */
const CAN_SPEAK = 'speechSynthesis' in window;
if(!CAN_SPEAK) $('readBtn').hidden = true;
function sayWords(q){ return q.a + t(q.op === '-' ? 'minus' : 'plus') + q.b; }
// A plain sum is read on its own when it appears (if her profile says so); any task is read
// on "read it to me". Task text is Bulgarian for an English player, so it is read in Bulgarian.
function speak(q, force){
  if(!CAN_SPEAK || !q || (!force && (!LOCAL.speak || q.kind || !S.touched))) return;
  const text = q.kind ? $('stage').innerText.replace(/[□■◯○●△▲★☆?]/g, ' ').replace(/\s+/g, ' ').trim() : sayWords(q);
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = q.kind && LANG === 'en' ? 'bg-BG' : LANG_TAG[LANG]; u.rate = .8; u.pitch = 1.05;
    speechSynthesis.speak(u);
  } catch(e){}
}
$('readBtn').onclick = e => { e.stopPropagation(); speak(S.qs[S.i], true); };
$('stage').addEventListener('click', e => {
  if(S.settled || S.qs[S.i].kind || e.target.closest('button')) return;    // settled: the card handler advances instead
  e.stopPropagation();
  speak(S.qs[S.i], true);
});

/* ---------- facts, weights, stats ---------- */
function factKey(q){ return q.kind ? 'w:' + q.kind : q.op + ':' + (q.a%10) + '-' + (q.b%10); }
function factLabel(key){
  const parts = key.split(':'), pair = parts[1].split('-').map(Number);
  const o = pair[0], bo = pair[1];
  return parts[0] === '-' ? (o < bo ? (o+10) : o) + ' − ' + bo : o + ' + ' + bo;
}
let W = { max:1, m:{} };
function weightsFrom(rounds){
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
function statsFrom(rounds){
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
    (r.levels || [r.level]).forEach(id => { const l = LEVELS.find(x => x.id === id); if(l) grps[PICK_GROUPS.findIndex(g => g.has(l))] = true; });
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
           comps, groups: Object.keys(grps).filter(k => k >= 0).length, langs: Object.keys(langs).length, curious: LOCAL.whys || 0, throughTen: THROUGH_TEN.filter(id => m[id] && m[id].done).length };
}

/* ---------- badges ----------
   Medals, as on the design's badge sheet: a colour per family, a ribbon when earned and a
   padlock when not yet. Every condition is positive (nothing is ever lost) and shows the
   child how far she is: prog gives [where she is, what it takes]. Names and conditions
   live in js/i18n.js under badge.<id>. */
const FAM = {
  teal:['#2F6F8F', '#DDE9EF', '#255B76', '#255B76'], warm:['#E8A33D', '#FBEBCF', '#7A4A2B', '#C7862A'],
  green:['#23795A', '#DCEFE5', '#1E5C45', '#1B5F47'], grape:['#9769C2', '#EEE4F7', '#5E3B87', '#7B52A6'],
  rose:['#C4878A', '#F8E4E5', '#7E4A4D', '#A66A6D'], lock:['#B8BEC9', '#E9ECF1', '#8D93A0', '#9DA4B1']
};                                               // ring, disc, ink, ribbon
const GLYPH = {
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
const BADGES = [
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
const badgeName = b => t('badge')[b.id][0], badgeNeed = b => t('badge')[b.id][1];
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
function clearTimers(){ S.timers.forEach(clearTimeout); S.timers = []; }
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
  clearTimeout(confetti.clear);
  confetti.clear = setTimeout(() => { box.innerHTML = ''; }, 5200);
}
function putCat(slot, m){
  const big = $('cat').cloneNode(true);
  big.removeAttribute('id'); big.dataset.mood = m;
  $(slot).replaceChildren(big);
}

/* ---------- round flow ---------- */
const plainQ = q => q.own ? q : (({ options, pick, pts, lvl, ...rest }) => rest)(q);   // own: a kind that is always А/Б/В/Г
// comp: a competition's own tasks, which come with their options and points already
function newRound(qs, comp){
  if(!comp){ COMP = null; clearInterval(compTick); if(typeof newerBuild === 'function') setTimeout(newerBuild, 0); }   // a fresh round is the moment to update
  S.qs = qs || Array.from({length:LOCAL.n}, () => gen(S.level));
  if(!comp) S.qs = S.qs.map(q => LOCAL.choice ? withChoices(plainQ(q)) : plainQ(q));
  S.i = 0; S.results = []; S.typed = []; S.slip = []; S.second = []; S.crossed = []; S.redo = false; S.t0 = Date.now();
  ['sheet', 'stats', 'picker', 'parent'].forEach(id => { $(id).hidden = true; });
  $('confetti').innerHTML = '';
  show();
}
// Nobody has pressed anything for a while: the mascot nods off, and wakes at the next key.
let napTimer = null;
function wake(){
  clearTimeout(napTimer);
  if($('cat').dataset.mood === 'sleepy') mood('idle');
  napTimer = setTimeout(() => { if(!S.settled) mood('sleepy'); }, 45000);
}
function show(){
  const q = S.qs[S.i];
  S.parts = Array(q.slots || 1).fill(''); S.at = 0;
  S.tries = 0; S.revealed = false; S.settled = false;
  clearTimers();
  $('stage').innerHTML = drawQ(q);
  $('qnum').textContent = COMP ? t('compTask', S.i + 1, q.pts) : t('taskOf', S.i + 1, S.qs.length);
  $('choices').hidden = !q.options; $('pad').hidden = !!q.options;
  $('skipBtn').hidden = !COMP;
  if(q.options) paintChoices();
  $('card').className = 'card';
  $('verdict').className = 'verdict'; $('verdict').textContent = '';
  $('hint').innerHTML = '';
  $('go').textContent = '✓';
  mood(S.i === 0 ? 'tilt' : 'idle');                // a wave hello at the start of a round
  if(S.i === 0) S.timers.push(setTimeout(() => { if(!S.settled && $('cat').dataset.mood === 'tilt') mood('idle'); }, 1400));
  paintSlot(); paintDots(); wake();
  speak(q);
}
function paintSlot(){
  S.parts.forEach((p, i) => {
    const el = $('slot' + i);
    if(el) el.innerHTML = p + (!S.revealed && i === S.at && !S.qs[S.i].options ? '<span class="caret"></span>' : '');   // nothing to type with А/Б/В/Г
  });
}
function paintDots(){
  if(COMP){      // a paper has no marks until the end: how far she is, and the clock
    const done = Object.keys(COMP.ans).length;
    $('dots').innerHTML = '<span class="ctrack"><i style="width:' + Math.round(100 * done / S.qs.length) + '%"></i></span>' +
      '<span class="cnum">' + done + ' / ' + S.qs.length + '</span><span class="clock" id="compClock">' + compLeft() + '</span>';
    $('dots').setAttribute('aria-label', t('taskOf', S.i + 1, S.qs.length));
    return;
  }
  $('dots').innerHTML = S.qs.map((_, k) => {
    const r = S.results[k];
    return '<span class="dot ' + (r === true ? 'ok' : r === false ? 'no' : '') + ' ' + (k === S.i ? 'now' : '') + '"></span>';
  }).join('');
  $('dots').setAttribute('aria-label', t('taskOf', S.i + 1, S.qs.length));
}
function press(k){
  S.touched = true;
  wake();
  // Settled: any key moves on, but a digit must not be eaten by the advance —
  // it is the first digit of the next answer.
  if(S.settled){
    next();
    if(k >= '0' && k <= '9'){ S.parts[0] = k; sfx.tap(); paintSlot(); }
    return;
  }
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
  if(S.parts[S.at].length < 3){ S.parts[S.at] += k; mood('idle'); sfx.tap(); paintSlot(); }
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
  S.touched = true; wake();
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
    $('hint').innerHTML = box('ok', t(quick ? 'yes' : 'gotIt'), why(q, true));
    mood(quick && S.results.filter(Boolean).length >= 5 && S.results.slice(-5).every(Boolean) ? 'wiggle' : 'happy');
    quick ? sfx.good() : sfx.ok();
    S.settled = true;
    $('go').textContent = '→';
    paintDots();
    S.timers.push(setTimeout(next, quick ? 1900 : 2700));
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
    $('hint').innerHTML = box('no', '<span class="typed">' + esc(S.typed[S.i]) + '</span>', nudge, t('notThis')) +
      '<div class="fb tip"><div class="tiplab">' + t('hintLabel') + '</div><div>' + why(q) + '</div></div>' +
      '<button class="btn ghost reveal" id="reveal">' + t('showSolution') + '</button>';
    $('reveal').onclick = e => { e.stopPropagation(); reveal(); };
    S.timers.push(setTimeout(() => { if(!S.settled) mood('thinking'); }, 1100));
    S.parts = S.parts.map(() => ''); S.at = 0; paintSlot();
  } else reveal();
}
// Show the answer and how it is worked: after a second miss, or when she asks for it.
function reveal(){
  const q = S.qs[S.i];
  S.results[S.i] = false;
  S.revealed = true; S.settled = true;
  S.parts = answers(q).slice(0, S.parts.length).map(String);
  $('verdict').className = 'verdict no';
  $('verdict').textContent = eqText(q);
  $('hint').innerHTML = box('no', eqText(q), why(q, true));
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
function finish(){
  clearTimers();
  const n = S.qs.length, got = S.results.filter(Boolean).length;
  const tier = tierFor(got, n);
  const lv = LEVELS.find(l => l.id === S.level) || { eq:'' };
  let best = 0, run = 0;
  S.results.forEach(r => { run = r ? run+1 : 0; if(run > best) best = run; });
  // a competition counts points, each task worth its difficulty
  const pts = COMP ? S.qs.reduce((a, q, k) => a + (S.results[k] ? q.pts : 0), 0) : got;
  const max = COMP ? S.qs.reduce((a, q) => a + q.pts, 0) : n;
  $('score').textContent = COMP ? t('pointsBig', pts, max) : t('scoreBig', got, n);
  $('scoreSub').textContent = COMP ? t('compSub', got, n, compTime(Date.now() - COMP.t0)) : t('firstTryAt', levelName(lv));
  const stars = pts === max ? 3 : pts >= .8*max ? 2 : pts >= .5*max ? 1 : 0;
  $('stars').innerHTML = [1, 2, 3].map(k => STAR(k <= stars)).join('');
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
  const missed = S.qs.map((q, k) => ({ q, k })).filter(x => !S.results[x.k]);
  $('missWrap').hidden = missed.length === 0;
  $('redo').hidden = missed.length === 0;
  $('misslist').innerHTML = missed.map(({ q, k }) => {
    const wrote = S.typed[k] === undefined ? '' : '<span class="wrote">' + t('youWrote', esc(S.typed[k])) +
      (S.slip[k] ? ' · ' + t('slip')[S.slip[k]][0] : S.second[k] ? ' · ' + t('secondTry') : '') + '</span>';
    return '<div class="miss"><div class="mrow"><span class="mdot"></span><div class="mtext"><span class="eq">' + eqText(q) + '</span>' + wrote +
      '</div><button class="whyb" aria-expanded="false">' + t('why') + '</button></div><div class="why" hidden>' + why(q, true) + '</div></div>';
  }).join('');
  $('misslist').querySelectorAll('.whyb').forEach(b => b.onclick = () => {
    const open = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', String(open));
    b.closest('.miss').querySelector('.why').hidden = !open;
    if(open){ LOCAL.whys = (LOCAL.whys || 0) + 1; saveLocal(); }
  });
  $('redo').onclick = () => {
    const set = missed.map(x => x.q);
    const want = Math.min(12, Math.max(6, missed.length*2));
    while(set.length < want) set.push(gen(S.level));
    newRound(shuffle(set));
    S.redo = true;                                     // a round of her own mistakes, for the "fixed" badge
  };

  const before = earnedSet(LOCAL.rounds), was = mastery(LOCAL.rounds)[S.level];
  const now = Date.now();
  LOCAL.rounds.push({
    id: 'r' + now + '_' + Math.random().toString(36).slice(2,7),
    ts: now, day: dayKey(now),
    level: COMP ? 'comp' : S.level, n, firstTry: got, best, lang: LANG,
    pts: COMP ? pts : undefined, max: COMP ? max : undefined, secs: COMP ? Math.round((Date.now() - COMP.t0) / 1000) : undefined,
    levels: COMP ? S.qs.map(q => q.lvl) : undefined,
    seen: S.qs.map(factKey),
    missed: S.qs.filter((_, k) => !S.results[k]).map(factKey),
    slips: S.slip.filter(Boolean),
    redo: S.redo || undefined
  });
  saveLocal();
  W = weightsFrom(LOCAL.rounds);
  syncSoon();
  if(DB) DB.collection(DBC).doc(LOCAL.rounds[LOCAL.rounds.length-1].id).set(LOCAL.rounds[LOCAL.rounds.length-1]).catch(() => {});

  // a level learned this very round
  const nowM = mastery(LOCAL.rounds)[S.level];
  const learned = !COMP && nowM && nowM.done && !(was && was.done);
  $('learnedCard').hidden = !learned;
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
  if(COMP){ COMP = null; clearInterval(compTick); paintPill(); }

  $('sheet').hidden = false;
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
function renderStats(){
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
  $('badges').innerHTML = BADGES.map(b => {
    const on = b.has(st);
    return '<button class="badge" data-b="' + b.id + '" aria-pressed="false" aria-label="' + badgeName(b) + ' – ' + badgeNeed(b) +
      ' (' + t(on ? 'earned' : 'notYetEarned') + ')">' + medal(b, on) + '<span class="nm">' + badgeName(b) + '</span></button>';
  }).join('');
  $('badgeNeed').textContent = '';
  $('badges').querySelectorAll('.badge').forEach(el => el.onclick = () => {
    const b = BADGES.find(x => x.id === el.dataset.b), [a, n] = b.prog(st);
    $('badges').querySelectorAll('.badge').forEach(x => x.setAttribute('aria-pressed', String(x === el)));
    $('badgeNeed').textContent = badgeName(b) + ' · ' + badgeNeed(b) + (b.has(st) ? ' ✓' : ' · ' + Math.min(a, n) + ' / ' + n);
  });
  const pc = st.sums ? Math.round(100*st.first/st.sums) : 0;
  $('tiles').innerHTML = tile(st.sums, t('sumsDone')) + tile(pc + '%', t('firstTry')) + tile(st.streak, t('daysRow', st.streak));

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
function renderParent(){
  const st = statsFrom(LOCAL.rounds), m = mastery(LOCAL.rounds);
  const pc = st.sums ? Math.round(100*st.first/st.sums) : 0;
  const hints = st.sums ? (LOCAL.rounds.reduce((x, r) => x + (r.missed || []).length, 0) / st.sums) : 0;
  $('parentWho').innerHTML = mascotSvg(PLAYER.mascot) + esc(playerName(PLAYER));
  $('ptiles').innerHTML = tile(st.rounds, t('roundsTotal')) + tile(pc + '%', t('firstTry')) +
    tile(hints.toLocaleString(LANG_TAG[LANG], { maximumFractionDigits:1 }), t('hintsPerTask')) +
    tile(LEVELS.filter(l => m[l.id] && m[l.id].done).length + ' / ' + LEVELS.length, t('levelsLearned'));

  const month = LOCAL.rounds.filter(r => r.ts > Date.now() - 30*86400000);
  const byGrp = PICK_GROUPS.map((g, k) => {
    const ids = new Set(LEVELS.filter(g.has).map(l => l.id));
    const rs = month.filter(r => ids.has(r.level));
    const n = rs.reduce((x, r) => x + r.n, 0), f = rs.reduce((x, r) => x + r.firstTry, 0);
    return { nm: t('groups')[k], n, p: n ? Math.round(100*f/n) : 0 };
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
  $('byLevel').innerHTML = Object.keys(st.lvl).sort((x,y) => x-y).map(L => {
    const d = st.lvl[L], lv = LEVELS.find(l => l.id === +L);
    return bar(lv ? levelName(lv) : L, Math.round(100*d.f/d.n), d.n);
  }).join('');
  $('advice').textContent = advice(st);
  document.querySelectorAll('#lenSeg button').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.n === LOCAL.n)));
  document.querySelectorAll('#ansSeg button').forEach(b => b.setAttribute('aria-pressed', String((b.dataset.c === '1') === !!LOCAL.choice)));
  $('csv').hidden = !LOCAL.rounds.length || !!window.claude;   // the artifact frame blocks plain downloads
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
function openStats(){ renderStats(); $('stats').hidden = false; }
// The grown-ups' page opens over whatever was showing and goes back to it.
let parentFrom = null;
function openParent(){
  parentFrom = !$('players').hidden ? 'players' : null;
  $('players').hidden = true;
  renderParent(); $('parent').hidden = false;
}
$('statsBtn').onclick = openStats;
$('toStats').onclick = openStats;
$('closeStats').onclick = () => { $('stats').hidden = true; };
$('toParent').onclick = () => { $('stats').hidden = true; openParent(); };
$('closeParent').onclick = () => { $('parent').hidden = true; if(parentFrom === 'players') openPlayers(); };

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
$('reset').onclick = async () => {
  if(!resetArmed){
    resetArmed = setTimeout(() => { resetArmed = null; $('reset').classList.remove('armed'); $('reset').textContent = t('reset'); }, 3500);
    $('reset').classList.add('armed'); $('reset').textContent = t('resetArm');
    return;
  }
  clearTimeout(resetArmed); resetArmed = null;
  $('reset').classList.remove('armed'); $('reset').textContent = t('reset');
  const ids = LOCAL.rounds.map(r => r.id);
  LOCAL.rounds = []; saveLocal();
  PLAYER.resetAt = PLAYER.updated = Date.now(); savePlayers(); syncSoon();   // other devices drop her older rounds too
  W = weightsFrom(LOCAL.rounds);
  renderParent();
  if(DB) for(const id of ids){ try { await DB.collection(DBC).doc(id).delete(); } catch(e){ break; } }
};

/* ---------- level picker ---------- */
const paperName = l => l.src === 'basics' ? t('basics') : t('src', l.grade);
function paintPill(){
  const l = LEVELS.find(x => x.id === S.level) || { eq:'' }, k = PICK_GROUPS.findIndex(g => g.has(l));
  $('levelName').textContent = levelName(l);
  $('sub').textContent = (l.grade ? paperName(l) : t('practice')) + (k >= 0 ? ' · ' + t('groups')[k] : '');
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
    out[k] = { n, f, rate: n ? f/n : 0, done: n >= 15 && f/n >= 0.8, rounds: by[k].length,
               lastRate: last.n ? last.firstTry / last.n : 0 };
  });
  return out;
}
// The next thing to practise: the easiest level she has not learned yet whose
// groundwork is done. It recommends — nothing is ever locked away.
function nextUp(m, lastGrp){
  const done = id => m[id] && m[id].done;
  const all = LEVELS.filter(l => !done(l.id) && (l.needs || []).every(done));
  // her own grade first: the 3rd-grade tasks come once the 2nd-grade ones are learned
  const open = all.some(l => l.grade === 2) ? all.filter(l => l.grade === 2) : all;
  if(!open.length) return null;
  const grp = l => l.grp || l.op;
  const fresh = open.filter(l => !m[l.id]);
  if(fresh.length){
    // Still meeting the levels: the easiest one she has not seen. Same difficulty,
    // different corner of the app — six geometry levels running is duller and sticks
    // less well than mixing them up.
    const ranked = fresh.slice().sort((a, b) => a.d - b.d);
    const best = ranked[0];
    if(grp(best) !== lastGrp) return best;
    // Nothing else at this difficulty from another corner? One step harder is still a
    // step forward, and beats a sixth helping of the same kind.
    return ranked.filter(l => l.d === best.d && grp(l) !== lastGrp)[0]
        || ranked.filter(l => l.d === best.d + 1 && grp(l) !== lastGrp)[0]
        || best;
  }
  // She has met them all: go back to whichever is going worst, by its record and then
  // by how the last round went.
  return open.slice().sort((a, b) =>
    m[a.id].rate - m[b.id].rate || m[a.id].lastRate - m[b.id].lastRate)[0];
}

function buildPicker(){
  const hist = levelHistory(LOCAL.rounds);
  const m = mastery(LOCAL.rounds);
  const done = l => m[l.id] && m[l.id].done;
  const groupOf = l => PICK_GROUPS.findIndex(g => g.has(l));
  // how hard it is, on the rubric in the README: operations, reading, search,
  // number size and how easy the trap is to miss — five dots
  const hard = l => '<span class="dots5" title="' + t('difficulty', l.d) + '" aria-label="' + t('difficulty', l.d) + '">' +
    [1,2,3,4,5].map(k => '<i class="' + (k <= l.d ? 'on' : '') + '"></i>').join('') + '</span>';
  const status = l => {
    if(done(l)) return '<span class="tick" aria-label="' + t('learned') + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg></span>';
    const h = hist[l.id];
    if(!h) return '<span class="isnew">' + t('isNew') + '</span>';
    const f = h.last.n ? h.last.firstTry / h.last.n : 0;
    const col = f >= .8 ? 'var(--good)' : f >= .5 ? 'var(--warm)' : 'var(--bad)';
    return '<span class="stat"><b style="color:' + col + '">' + h.last.firstTry + ' / ' + h.last.n + '</b><i>' + ago(h.last.ts) + '</i></span>';
  };
  const sym = l => /[А-Яа-яЁёЇїІіЄєA-Za-z]{2}/.test(levelName(l)) ? '' : ' sym';   // "42 − 17" is set like a sum
  const row = l => '<button class="pick" data-lvl="' + l.id + '" aria-pressed="' + (l.id === S.level) + '">' +
    '<span class="nm"><span class="eq' + sym(l) + '">' + levelName(l) + (l.src === 'basics' ? ' <span class="gtag gb">' + t('basics') + '</span>' : ' <span class="gtag g' + l.grade + '">' + t('gradeN', l.grade) + '</span>') + '</span><span class="desc">' + levelDesc(l) + '</span></span>' +
    hard(l) + status(l) + '</button>';

  $('pickWho').innerHTML = mascotSvg(PLAYER.mascot) + esc(playerName(PLAYER));
  // topics: every group, as filter chips that wrap rather than scroll
  const groups = PICK_GROUPS.map((g, k) => ({ k, levels: LEVELS.filter(l => g.has(l) && (!PICK_PAPER || paperOf(l) === PICK_PAPER)) })).filter(g => g.levels.length);
  if(!groups.some(g => g.k === PICK_TOPIC)) PICK_TOPIC = -1;
  $('pickTopics').innerHTML = '<button data-k="-1" aria-pressed="' + (PICK_TOPIC === -1) + '">' + t('all') + '</button>' +
    groups.map(g => '<button data-k="' + g.k + '" aria-pressed="' + (PICK_TOPIC === g.k) + '">' + t('groups')[g.k] + '</button>').join('');
  $('pickTopics').querySelectorAll('button').forEach(b => b.onclick = () => { PICK_TOPIC = +b.dataset.k; buildPicker(); });
  // which paper: the basics, МБГ autumn 2nd grade, 3rd grade — or all of them
  const papers = [...new Set(LEVELS.map(paperOf))].map(p => LEVELS.find(l => paperOf(l) === p));
  $('pickGrades').innerHTML = '<button data-p="" aria-pressed="' + (PICK_PAPER === '') + '">' + t('allGrades') + '</button>' +
    papers.map(l => '<button data-p="' + paperOf(l) + '" aria-pressed="' + (PICK_PAPER === paperOf(l)) + '">' + paperName(l) + '</button>').join('');
  $('pickGrades').querySelectorAll('button').forEach(b => b.onclick = () => { PICK_PAPER = b.dataset.p; buildPicker(); });

  // start here / try this next: the recommendation, and what it opens up after
  const lastRound = LOCAL.rounds[LOCAL.rounds.length - 1];
  const lastLvl = lastRound && LEVELS.filter(l => l.id === lastRound.level)[0];
  const grp = l => l && (l.grp || l.op);
  const nx = nextUp(m, grp(lastLvl));
  const after = nx && nextUp(Object.assign({}, m, { [nx.id]: { done:true, rate:1, lastRate:1, n:15, f:15, rounds:1 } }), grp(nx));
  const learned = LEVELS.filter(done).length, met = LEVELS.filter(l => m[l.id]).length;
  $('nextUp').innerHTML = (nx ? '<button class="gcard nextcard" data-lvl="' + nx.id + '"><span class="nm">' +
      '<span class="lab">' + t(!met ? 'startHere' : met < LEVELS.length ? 'tryNext' : 'needsWork') + '</span>' +
      '<span class="eq">' + levelName(nx) + '</span>' +
      '<span class="meta"><span>' + t('groups')[groupOf(nx)] + '</span>' + hard(nx) + '</span>' +
      (after ? '<span class="meta">' + t('nextAfter', levelName(after)) + '</span>' : '') +
      '</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>'
    : '<div class="gcard advice">' + t('allLearned') + '</div>') +
    '<div class="progress"><span class="track"><i style="width:' + Math.round(100*learned/LEVELS.length) + '%"></i></span><span>' +
    t('learnedOf', learned, LEVELS.length) + '</span></div>';

  $('pickAll').innerHTML = groups.filter(g => PICK_TOPIC === -1 || g.k === PICK_TOPIC).map(g =>
    '<div class="grouphead"><b>' + t('groups')[g.k] + '</b><span>' + t('learnedGroup', g.levels.filter(done).length, g.levels.length) + '</span></div>' +
    '<div class="gcard list">' + g.levels.map(row).join('') + '</div>').join('');
  document.querySelectorAll('#picker [data-lvl]').forEach(b => b.onclick = () => {
    S.level = +b.dataset.lvl;
    paintPill();
    newRound();
  });
}
let PICK_TOPIC = -1, PICK_PAPER = '';
const midRound = () => S.i > 0 || S.parts.some(p => p !== '') || S.results.length > 0;
$('levelPill').onclick = () => { buildPicker(); $('pickWarn').hidden = !midRound(); $('picker').hidden = false; };
$('closePick').onclick = () => { $('picker').hidden = true; };
paintPill();

/* ---------- players ----------
   Tap the mascot to change player. Switching reloads the page: every setting, the log,
   the language and the mascot then come up exactly as a fresh launch would. */
const esc = v => String(v).replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
const playerName = p => p.name || t('playerN', PLAYERS.list.indexOf(p) + 1);
const EDIT_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/></svg>';
const FLAME = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 .5-3-1-5 1-9.5z"/></svg>';
function chose(){ try { sessionStorage.setItem('crossingten.chosen', '1'); } catch(e){} }
function switchTo(id){ PLAYERS.cur = id; savePlayers(); chose(); location.reload(); }
// A player's saved log and settings (the current player's are LOCAL).
function storeOf(p){
  if(p.id === PLAYER.id) return LOCAL;
  try { return Object.assign({ rounds:[], muted:false, speak:true, n:10 }, JSON.parse(localStorage.getItem(roundsKey(p))) || {}); }
  catch(e){ return { rounds:[], muted:false, speak:true, n:10 }; }
}
function openPlayers(){
  $('playerList').innerHTML = PLAYERS.list.map(p => {
    const rounds = storeOf(p).rounds, m = mastery(rounds), st = statsFrom(rounds);
    const pill = !rounds.length ? '<span class="pill cool">' + t('newPl') + '</span>'
               : st.streak >= 2 ? '<span class="pill warm">' + FLAME + t('streakDays', st.streak) + '</span>' : '';
    return '<div class="ptile">' +
      '<button class="pchoose" data-id="' + p.id + '" aria-pressed="' + (p === PLAYER) + '">' + mascotSvg(p.mascot) +
        '<b>' + esc(playerName(p)) + '</b><span class="pmeta">' + t('learnedN', LEVELS.filter(l => m[l.id] && m[l.id].done).length) +
        '</span>' + pill + '</button>' +
      '<button class="icon pedit" data-edit="' + p.id + '" aria-label="' + t('edit') + ': ' + esc(playerName(p)) + '">' + EDIT_ICON + '</button>' +
    '</div>';
  }).join('') +
    '<button class="padd" id="pAdd"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>' +
    t('addPlayer') + '</button>';
  document.querySelectorAll('.pchoose').forEach(b => b.onclick = () => {
    if(b.dataset.id === PLAYER.id){ chose(); $('players').hidden = true; } else switchTo(b.dataset.id);
  });
  document.querySelectorAll('.pedit').forEach(b => b.onclick = () => openEdit(PLAYERS.list.find(p => p.id === b.dataset.edit)));
  $('pAdd').onclick = () => openEdit(null);
  if(typeof paintSync === 'function') paintSync();
  $('playerEdit').hidden = true; $('players').hidden = false;
}
let EDIT = null, delArmed = null;
// welcome: the very first launch on a device - the same form, asking her name, mascot and
// language before anything else, with a way to join a family that already plays elsewhere.
let WELCOME = false;
function openEdit(p, welcome){
  WELCOME = !!welcome;
  const taken = PLAYERS.list.map(x => x.mascot);
  EDIT = p ? Object.assign({}, p)
           : { id:'p' + Date.now().toString(36), name:'', lang:LANG,
               mascot: Object.keys(MASCOTS).find(k => taken.indexOf(k) < 0) || 'cat' };
  const kept = p ? storeOf(p) : { muted:false, speak:true, calm:false };
  $('editTitle').textContent = p ? t('profile') : t('newPlayer');
  $('pName').value = EDIT.name;
  $('pName').placeholder = p ? playerName(p) : t('playerN', PLAYERS.list.length + 1);
  $('pSound').checked = !kept.muted; $('pSpeak').checked = kept.speak !== false; $('pCalm').checked = !!kept.calm;
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
  document.querySelectorAll('.mchoice').forEach(b => b.onclick = () => { EDIT.mascot = b.dataset.m; paintEdit(); });
  document.querySelectorAll('#pLang input').forEach(r => r.onchange = () => {
    EDIT.lang = r.value;
    if(WELCOME){ LANG = r.value; applyText(); paintWelcome(); paintEdit(); }   // the whole screen switches at once
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
  // her settings travel with her log: sound, reading aloud, and calmer animation
  const kept = storeOf(EDIT);
  kept.muted = !$('pSound').checked; kept.speak = $('pSpeak').checked; kept.calm = $('pCalm').checked;
  if(EDIT.id === PLAYER.id) saveLocal();
  else try { localStorage.setItem(roundsKey(EDIT), JSON.stringify(kept)); } catch(e){}
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
  if(EDIT.id === PLAYER.id) switchTo(PLAYERS.list[0].id); else { savePlayers(); openPlayers(); }
};
$('who').onclick = openPlayers;
$('parentBtn').onclick = openParent;
$('closePlayers').onclick = () => { chose(); $('players').hidden = true; };

/* ---------- controls ---------- */
$('pad').addEventListener('click', e => { const b = e.target.closest('.key'); if(b) press(b.dataset.k); });
$('again').onclick = () => newRound();
$('card').addEventListener('click', () => { if(S.settled) next(); });
document.addEventListener('keydown', e => {
  if(document.querySelector('.sheet:not([hidden])') || e.target.closest('input')) return;
  if(e.key >= '0' && e.key <= '9') press(e.key);
  else if(e.key === 'Backspace') press('del');
  else if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); press('go'); }
});

/* ---------- shared mirror ---------- */
const builtOn = () => {
  try { return t('build') + new Date(document.lastModified)
    .toLocaleString(LANG_TAG[LANG], { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' }); }
  catch(e){ return ''; }
};
const heldHere = () => t('heldHere', LOCAL.rounds.length);
// The artifact database keeps each player's rounds apart; the first keeps the original name.
const DBC = PLAYER.id === 'p1' ? 'rounds' : 'rounds_' + PLAYER.id;
let DB = null;
(async () => {
  const db = window.claude && await claude.use('db');
  if(!db) { $('synced').textContent = heldHere() + builtOn(); return; }   // sync.js takes this line over when sync is on
  DB = db;
  try {
    const snap = await db.collection(DBC).orderBy('ts','desc').limit(300).get();
    const remote = snap.docs.map(d => d.data()).filter(r => r && r.id);
    const byId = {};
    LOCAL.rounds.forEach(r => byId[r.id] = r);
    remote.forEach(r => { if(!byId[r.id]) byId[r.id] = r; });
    const remoteIds = {}; remote.forEach(r => remoteIds[r.id] = true);
    LOCAL.rounds = Object.keys(byId).map(k => byId[k]).sort((x,y) => x.ts - y.ts).slice(-400);
    saveLocal();
    W = weightsFrom(LOCAL.rounds);
    $('synced').textContent = t('synced', LOCAL.rounds.length) + builtOn();
    if(!$('stats').hidden) renderStats();
    const pending = LOCAL.rounds.filter(r => !remoteIds[r.id]).slice(-20);
    for(const r of pending){ try { await db.collection(DBC).doc(r.id).set(r); } catch(e){ break; } }
  } catch(e){
    $('synced').textContent = heldHere() + builtOn();
  }
})();

const say = t => { $('synced').textContent = t + builtOn(); };

// Safari keeps pinch-zoom even with user-scalable=no; for a full-screen practice app
// an accidental pinch just breaks the layout, so the gesture is turned off here. It is
// a deliberate trade against the usual advice — nothing on the page needs magnifying.
['gesturestart', 'gesturechange', 'gestureend'].forEach(g =>
  document.addEventListener(g, e => e.preventDefault(), { passive: false }));

// A launch starts on the level the picker would recommend, not on a fixed one.
{
  const last = LOCAL.rounds[LOCAL.rounds.length - 1], lastLvl = last && LEVELS.find(l => l.id === last.level);
  const nx = nextUp(mastery(LOCAL.rounds), lastLvl && (lastLvl.grp || lastLvl.op));
  if(nx){ S.level = nx.id; paintPill(); }
}
newRound();
// Only the very first launch on a device asks who she is; every launch after that goes
// straight to the exercise (the mascot switches player).
if(FIRST) openEdit(PLAYER, true);

// A home-screen app, or a tab, stays open for days. At the start of a round, and coming back
// to the screen between rounds, it picks up a newer build, told by the page's Last-Modified
// (no header: nothing happens). Nothing is lost: it only reloads before a key is pressed.
function newerBuild(){
  if(document.visibilityState !== 'visible' || window.claude || midRound() || COMP) return;
  fetch(location.pathname, { method:'HEAD', cache:'no-cache' }).then(r => {
    if(Date.parse(r.headers.get('last-modified')) > Date.parse(document.lastModified) + 60000){ chose(); location.reload(); }
  }).catch(() => {});
}
document.addEventListener('visibilitychange', newerBuild);
// Offline play and same-build-everywhere for the Pages copy; the artifact frame has no use for it.
if('serviceWorker' in navigator && window.isSecureContext && !window.claude)
  navigator.serviceWorker.register('sw.js').catch(() => {});
