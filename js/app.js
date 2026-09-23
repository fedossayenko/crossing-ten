const $ = s => document.getElementById(s);
const S = { level:2, qs:[], i:0, parts:[''], at:0, tries:0, revealed:false, settled:false, results:[], t0:0, timers:[], touched:false };
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- local log ---------- */
const LS = 'crossingten.v3';
let LOCAL = { rounds:[], muted:false, speak:true, n:10 };
try { const raw0 = localStorage.getItem(LS); if(raw0) LOCAL = Object.assign(LOCAL, JSON.parse(raw0)); } catch(e){}
// The rounds she played while this lived as a Claude artifact, carried across once per
// device. Each round has an id, so a device that already has them keeps its own copy.
const SEED = [{"id":"r1790015038315_7cn3d","ts":1790015038315,"day":"2026-09-21","level":4,"n":10,"firstTry":8,"seen":["+:7-6","+:8-9","+:8-8","+:4-7","+:8-5","+:9-2","+:7-7","+:8-7","+:4-8","+:6-9"],"missed":["+:8-9","+:8-8"]},{"id":"r1790015105375_3mi4t","ts":1790015105375,"day":"2026-09-21","level":4,"n":10,"firstTry":10,"seen":["+:8-3","+:6-7","+:6-6","+:6-7","+:8-7","+:6-8","+:8-9","+:9-4","+:9-8","+:8-9"],"missed":[]},{"id":"r1790015141891_7ovx6","ts":1790015141891,"day":"2026-09-21","level":2,"n":10,"firstTry":0,"seen":["-:2-9","-:4-6","-:3-8","-:0-5","-:4-9","-:0-8","-:0-5","-:0-8","-:5-9","-:5-9"],"missed":["-:2-9","-:4-6","-:3-8","-:0-5","-:4-9","-:0-8","-:0-5","-:0-8","-:5-9","-:5-9"]},{"id":"r1790015260526_087bm","ts":1790015260526,"day":"2026-09-21","level":4,"n":10,"firstTry":10,"seen":["+:5-7","+:7-7","+:9-3","+:7-4","+:7-9","+:8-4","+:8-4","+:9-2","+:5-8","+:8-4"],"missed":[]},{"id":"r1790058153930_948f0","ts":1790058153930,"day":"2026-09-22","level":2,"n":10,"firstTry":10,"seen":["-:5-8","-:3-9","-:2-7","-:5-8","-:0-2","-:5-9","-:2-4","-:2-7","-:0-5","-:4-5"],"missed":[]},{"id":"r1790058354010_o4c4h","ts":1790058354010,"day":"2026-09-22","level":1,"n":10,"firstTry":9,"seen":["-:7-9","-:8-9","-:6-7","-:3-4","-:2-4","-:2-9","-:5-8","-:3-5","-:0-9","-:6-7"],"missed":["-:0-9"]},{"id":"r1790058861955_pzjc9","ts":1790058861955,"day":"2026-09-22","level":8,"n":10,"firstTry":10,"seen":["w:chain","w:chain","w:chain","w:chain","w:chain","w:chain","w:chain","w:chain","w:chain","w:chain"],"missed":[]},{"id":"r1790059304036_61pv5","ts":1790059304036,"day":"2026-09-22","level":9,"n":10,"firstTry":8,"seen":["w:pairs","w:pairs","w:pairs","w:pairs","w:pairs","w:pairs","w:pairs","w:pairs","w:pairs","w:pairs"],"missed":["w:pairs","w:pairs"]},{"id":"r1790064620994_56lld","ts":1790064620994,"day":"2026-09-22","level":11,"n":10,"firstTry":9,"seen":["w:box","w:box","w:box","w:box","w:box","w:box","w:box","w:box","w:box","w:box"],"missed":["w:box"]},{"id":"r1790065438571_k9bpe","ts":1790065438571,"day":"2026-09-22","level":18,"n":10,"firstTry":9,"seen":["w:digits","w:digits","w:digits","w:digits","w:digits","w:digits","w:digits","w:digits","w:digits","w:digits"],"missed":["w:digits"]},{"id":"r1790065992600_z3jg4","ts":1790065992600,"day":"2026-09-22","level":15,"n":10,"firstTry":6,"seen":["w:erase","w:erase","w:erase","w:erase","w:erase","w:erase","w:erase","w:erase","w:erase","w:erase"],"missed":["w:erase","w:erase","w:erase","w:erase"]},{"id":"r1790066770456_if76o","ts":1790066770456,"day":"2026-09-22","level":15,"n":10,"firstTry":7,"seen":["w:erase","w:erase","w:erase","w:erase","w:erase","w:erase","w:erase","w:erase","w:erase","w:erase"],"missed":["w:erase","w:erase","w:erase"]},{"id":"r1790067548274_mgn9c","ts":1790067548274,"day":"2026-09-22","level":15,"n":10,"firstTry":10,"seen":["w:erase","w:erase","w:erase","w:erase","w:erase","w:erase","w:erase","w:erase","w:erase","w:erase"],"missed":[]},{"id":"r1790068253029_ag759","ts":1790068253029,"day":"2026-09-22","level":10,"n":10,"firstTry":9,"seen":["w:cmp","w:cmp","w:cmp","w:cmp","w:cmp","w:cmp","w:cmp","w:cmp","w:cmp","w:cmp"],"missed":["w:cmp"]},{"id":"r1790076611158_kof1b","ts":1790076611158,"day":"2026-09-22","level":16,"n":10,"firstTry":7,"seen":["w:ineq","w:ineq","w:ineq","w:ineq","w:ineq","w:ineq","w:ineq","w:ineq","w:ineq","w:ineq"],"missed":["w:ineq","w:ineq","w:ineq"]},{"id":"r1790077520842_ze4z7","ts":1790077520842,"day":"2026-09-22","level":16,"n":10,"firstTry":5,"seen":["w:ineq","w:ineq","w:ineq","w:ineq","w:ineq","w:ineq","w:ineq","w:ineq","w:ineq","w:ineq"],"missed":["w:ineq","w:ineq","w:ineq","w:ineq","w:ineq"]},{"id":"r1790078936561_9bl1n","ts":1790078936561,"day":"2026-09-22","level":34,"n":10,"firstTry":5,"seen":["w:paint","w:paint","w:paint","w:paint","w:paint","w:paint","w:paint","w:paint","w:paint","w:paint"],"missed":["w:paint","w:paint","w:paint","w:paint","w:paint"]},{"id":"r1790079610004_5y87l","ts":1790079610004,"day":"2026-09-22","level":34,"n":10,"firstTry":10,"seen":["w:paint","w:paint","w:paint","w:paint","w:paint","w:paint","w:paint","w:paint","w:paint","w:paint"],"missed":[]},{"id":"r1790080408348_nybp6","ts":1790080408348,"day":"2026-09-22","level":12,"n":10,"firstTry":4,"seen":["w:count","w:count","w:count","w:count","w:count","w:count","w:count","w:count","w:count","w:count"],"missed":["w:count","w:count","w:count","w:count","w:count","w:count"]},{"id":"r1790080992408_znvck","ts":1790080992408,"day":"2026-09-22","level":12,"n":10,"firstTry":5,"seen":["w:count","w:count","w:count","w:count","w:count","w:count","w:count","w:count","w:count","w:count"],"missed":["w:count","w:count","w:count","w:count","w:count"]}];
(function(){
  const have = {};
  LOCAL.rounds.forEach(r => have[r.id] = true);
  const add = SEED.filter(r => !have[r.id]);
  if(!add.length) return;
  LOCAL.rounds = LOCAL.rounds.concat(add).sort((a, b) => a.ts - b.ts).slice(-400);
  try { localStorage.setItem(LS, JSON.stringify({ rounds: LOCAL.rounds, muted: LOCAL.muted,
    speak: LOCAL.speak, n: LOCAL.n })); } catch(e){}
})();
function saveLocal(){
  try { localStorage.setItem(LS, JSON.stringify({ rounds: LOCAL.rounds.slice(-400), muted: LOCAL.muted,
    speak: LOCAL.speak, n: LOCAL.n })); } catch(e){}
}

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
if(!CAN_SPEAK) $('speakBtn').hidden = true;
function sayWords(q){ return q.a + (q.op === '-' ? ' minus ' : ' plus ') + q.b; }
function speak(q, force){
  if(!CAN_SPEAK || !LOCAL.speak || !q || q.kind) return;   // nothing to read out for the worksheet tasks
  if(!force && !S.touched) return;          // no audio before she has touched anything
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(sayWords(q));
    u.rate = .8; u.pitch = 1.05;
    speechSynthesis.speak(u);
  } catch(e){}
}
$('speakBtn').onclick = () => {
  LOCAL.speak = !LOCAL.speak; saveLocal();
  $('speakBtn').setAttribute('aria-pressed', String(LOCAL.speak));
  if(LOCAL.speak) speak(S.qs[S.i], true); else try { speechSynthesis.cancel(); } catch(e){}
};
$('speakBtn').setAttribute('aria-pressed', String(LOCAL.speak));
$('stage').addEventListener('click', e => {
  if(S.settled || S.qs[S.i].kind) return;    // settled: the card handler advances instead
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
  const lvl = {}, seen = {}, miss = {}, byOp = { '-':{seen:0,miss:0}, '+':{seen:0,miss:0} }, days = {};
  rounds.forEach(r => {
    sums += r.n; first += r.firstTry;
    if(r.n > 0 && r.firstTry === r.n) perfect++;
    const L = lvl[r.level] || (lvl[r.level] = {n:0,f:0});
    L.n += r.n; L.f += r.firstTry;
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
  return { rounds:rounds.length, sums, first, perfect, lvl, byOp, streak, streakBest, trouble };
}

/* ---------- badges ---------- */
const GLYPH = {
  paw:'<circle cx="7" cy="9" r="2.4"/><circle cx="12" cy="6.6" r="2.4"/><circle cx="17" cy="9" r="2.4"/><path d="M12 12.4c-3.2 0-5.4 2.2-5.4 4.3 0 1.9 2.2 3 5.4 3s5.4-1.1 5.4-3c0-2.1-2.2-4.3-5.4-4.3z"/>',
  fish:'<path d="M2.6 12c3.2-4.4 8.6-5.4 12.8-3.2 2.2 1.1 3.2 2.2 3.2 3.2s-1 2.1-3.2 3.2C11.2 17.4 5.8 16.4 2.6 12z"/><path d="M19.4 12l3.4-3.4v6.8z"/>',
  star:'<path d="M12 2.6l2.8 6 6.5.8-4.8 4.5 1.2 6.5L12 17.2 6.3 20.4l1.2-6.5L2.7 9.4l6.5-.8z"/>',
  sun:'<circle cx="12" cy="12" r="4.4"/><path d="M12 1.8v3M12 19.2v3M1.8 12h3M19.2 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M19.4 4.6l-2.1 2.1M6.7 17.3l-2.1 2.1" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"/>',
  moon:'<path d="M21 14.2A8.6 8.6 0 1 1 10.4 3a7.3 7.3 0 0 0 10.6 11.2z"/>',
  box:'<path d="M12 2.4l9 4v11l-9 4-9-4v-11z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M3 6.4l9 4 9-4M12 10.4v11" fill="none" stroke="currentColor" stroke-width="1.7"/>',
  crown:'<path d="M3.4 18.4h17.2l1.2-10.6-5.6 3.4L12 4.2 7.8 11.2 2.2 7.8z"/>',
  yarn:'<circle cx="12" cy="12" r="8.6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5.6 7.2c4.4 1.8 7.2 5.8 8 12.8M18.4 7.2c-4.4 1.8-7.2 5.8-8 12.8M3.6 13.8c4-.8 7.6-3.4 9.8-7.8" fill="none" stroke="currentColor" stroke-width="1.6"/>'
};
const icon = k => '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + GLYPH[k] + '</svg>';
const BADGES = [
  { id:'first',   g:'paw',   nm:'First round',   need:'Finish a round',      has:s => s.rounds >= 1 },
  { id:'ten',     g:'fish',  nm:'Ten rounds',    need:'10 rounds',           has:s => s.rounds >= 10 },
  { id:'perfect', g:'star',  nm:'Perfect round', need:'All right first try', has:s => s.perfect >= 1 },
  { id:'streak3', g:'sun',   nm:'Three days',    need:'3 days running',      has:s => s.streakBest >= 3 },
  { id:'streak7', g:'moon',  nm:'A whole week',  need:'7 days running',      has:s => s.streakBest >= 7 },
  { id:'s100',    g:'box',   nm:'100 sums',      need:'100 sums',            has:s => s.sums >= 100 },
  { id:'s500',    g:'yarn',  nm:'500 sums',      need:'500 sums',            has:s => s.sums >= 500 },
  { id:'levels',  g:'crown', nm:'Every level',   need:'Try 7 different levels',    has:s => Object.keys(s.lvl).length >= 7 }
];
const earnedSet = rounds => { const s = statsFrom(rounds); return BADGES.filter(b => b.has(s)).map(b => b.id); };

/* ---------- cat ---------- */
function mood(m){ const c = $('cat'); if(c.dataset.mood !== m) c.dataset.mood = m; }
function clearTimers(){ S.timers.forEach(clearTimeout); S.timers = []; }
function catFor(score, total){ return score >= total - 2 ? 'happy' : score >= total/2 ? 'idle' : 'sad'; }

// How a round ends. The bottom tier is encouraging, not sad: the child who scores
// low is the one who most needs to come back tomorrow.
const TIERS = [
  { min:1,   mood:'party',  say:'Every one. ',     tune:[523,659,784,1047,1319,1047,1319,1568], gap:.11 },
  { min:.8,  mood:'dance',  say:'Nearly all. ',    tune:[523,659,784,1047,880,988,1175],        gap:.13 },
  { min:.6,  mood:'wiggle', say:'Good going. ',    tune:[523,659,784,880],                      gap:.15 },
  { min:.4,  mood:'nod',    say:'Halfway there. ', tune:[523,659,784],                          gap:.17 },
  { min:0,   mood:'tilt',   say:'Keep going — ',   tune:[440,554],                              gap:.22 }
];
function tierFor(score, total){ const f = total ? score/total : 0; return TIERS.find(t => f >= t.min); }
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
function newRound(qs){
  S.qs = qs || Array.from({length:LOCAL.n}, () => gen(S.level));
  S.i = 0; S.results = []; S.t0 = Date.now();
  $('sheet').hidden = true; $('stats').hidden = true; $('picker').hidden = true;
  $('confetti').innerHTML = '';
  show();
}
function show(){
  const q = S.qs[S.i];
  S.parts = Array(q.slots || 1).fill(''); S.at = 0;
  S.tries = 0; S.revealed = false; S.settled = false;
  clearTimers();
  $('stage').innerHTML = drawQ(q);
  $('card').className = 'card';
  $('verdict').className = 'verdict'; $('verdict').textContent = '';
  $('hint').innerHTML = '';
  $('go').textContent = '✓';
  mood('idle');
  paintSlot(); paintDots();
  speak(q);
}
function paintSlot(){
  S.parts.forEach((p, i) => {
    const el = $('slot' + i);
    if(el) el.innerHTML = p + (!S.revealed && i === S.at ? '<span class="caret"></span>' : '');
  });
}
function paintDots(){
  $('dots').innerHTML = S.qs.map((_, k) => {
    const r = S.results[k];
    return '<span class="dot ' + (r === true ? 'ok' : r === false ? 'no' : '') + ' ' + (k === S.i ? 'now' : '') + '"></span>';
  }).join('');
}
function press(k){
  S.touched = true;
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
function check(){
  if(S.parts.some(p => p === '')) return;
  const q = S.qs[S.i];
  if(accepts(q, S.parts)){
    if(S.results[S.i] === undefined) S.results[S.i] = S.tries === 0;
    $('card').className = 'card ok';
    $('verdict').className = 'verdict ok';
    const quick = S.tries === 0;
    $('verdict').textContent = quick ? 'Yes!' : 'Got it.';
    $('hint').innerHTML = why(q, true);
    mood('happy');
    quick ? sfx.good() : sfx.ok();
    S.settled = true;
    $('go').textContent = '→';
    paintDots();
    S.timers.push(setTimeout(next, quick ? 1900 : 2700));
    return;
  }
  S.results[S.i] = false;
  S.tries++;
  mood('sad'); sfx.bad();
  $('card').classList.add('shake');
  setTimeout(() => $('card').classList.remove('shake'), 340);
  if(S.tries === 1){
    $('verdict').className = 'verdict no';
    $('verdict').textContent = 'Not yet — try once more.';
    $('hint').innerHTML = why(q);
    S.parts = S.parts.map(() => ''); S.at = 0; paintSlot();
  } else {
    S.revealed = true; S.settled = true;
    S.parts = answers(q).slice(0, S.parts.length).map(String);
    $('card').className = 'card no';
    $('verdict').className = 'verdict no';
    $('verdict').textContent = eqText(q);
    $('hint').innerHTML = why(q, true);
    $('go').textContent = '→';
    paintSlot(); paintDots();
  }
}
function next(){
  clearTimers();
  if(S.i + 1 >= S.qs.length){ finish(); return; }
  S.i++; show();
}

function finish(){
  clearTimers();
  const got = S.results.filter(Boolean).length;
  const secs = Math.round((Date.now() - S.t0)/1000);
  const mins = Math.floor(secs/60);
  const time = mins ? mins + ' min ' + (secs%60) + ' s' : secs + ' s';
  const tier = tierFor(got, S.qs.length);
  let best = 0, run = 0;
  S.results.forEach(r => { run = r ? run+1 : 0; if(run > best) best = run; });
  const streakLine = best >= 3 ? ' · best run ' + best + ' in a row' : '';
  $('score').innerHTML = tier.say + got + ' out of ' + S.qs.length + ' first try.<small>' + time + streakLine + '</small>';
  putCat('sheetcat', tier.mood);
  sfx.tune(tier.tune, tier.gap);
  const clean = got === S.qs.length;
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

  const missed = S.qs.filter((_, k) => !S.results[k]);
  $('missWrap').hidden = missed.length === 0;
  $('redo').hidden = missed.length === 0;
  $('misslist').innerHTML = missed.map(q =>
    '<div class="miss"><span class="eq">' + eqText(q) + '</span><span class="why">' + why(q, true) + '</span></div>'
  ).join('');
  $('redo').onclick = () => {
    const set = missed.slice();
    const want = Math.min(12, Math.max(6, missed.length*2));
    while(set.length < want) set.push(gen(S.level));
    newRound(shuffle(set));
  };

  const before = earnedSet(LOCAL.rounds);
  const now = Date.now();
  LOCAL.rounds.push({
    id: 'r' + now + '_' + Math.random().toString(36).slice(2,7),
    ts: now, day: dayKey(now),
    level: S.level, n: S.qs.length, firstTry: got,
    seen: S.qs.map(factKey),
    missed: S.qs.filter((_, k) => !S.results[k]).map(factKey)
  });
  saveLocal();
  W = weightsFrom(LOCAL.rounds);
  if(DB) DB.collection('rounds').doc(LOCAL.rounds[LOCAL.rounds.length-1].id).set(LOCAL.rounds[LOCAL.rounds.length-1]).catch(() => {});

  const fresh = earnedSet(LOCAL.rounds).filter(id => before.indexOf(id) < 0);
  $('earnedWrap').hidden = fresh.length === 0;
  $('earnedWrap').innerHTML = fresh.map(id => {
    const b = BADGES.find(x => x.id === id);
    return '<div class="newbadge">' + icon(b.g) + '<div><b>' + b.nm + '</b><span>New badge</span></div></div>';
  }).join('');

  $('sheet').hidden = false;
}

/* ---------- progress ---------- */
function advice(st){
  if(st.rounds < 3) return 'A few more rounds and this will have something useful to say.';
  const sub = st.byOp['-'], add = st.byOp['+'];
  const pct = o => o.seen ? Math.round(100*(o.seen - o.miss)/o.seen) : null;
  const ps = pct(sub), pa = pct(add);
  const bits = [];
  if(ps !== null && sub.seen >= 15) bits.push('Take away is at ' + ps + '%');
  if(pa !== null && add.seen >= 15) bits.push('adding is at ' + pa + '%');
  let out = bits.length ? bits.join(', ') + '. ' : '';
  if(ps !== null && pa !== null && sub.seen >= 15 && add.seen >= 15){
    out += Math.abs(ps - pa) < 8 ? 'The two are level. ' : (ps > pa ? 'Adding is the weaker one. ' : 'Take away is the weaker one. ');
  }
  if(st.trouble.length) out += 'The step costing most is ' + factLabel(st.trouble[0].key) + ' (missed ' + st.trouble[0].miss + ' of ' + st.trouble[0].seen + ').';
  return out || 'Nothing stands out yet — the misses are spread evenly.';
}
function renderStats(){
  const st = statsFrom(LOCAL.rounds);
  const any = st.rounds > 0;
  $('statsEmpty').hidden = any;
  $('trendWrap').hidden = !any; $('byLevelWrap').hidden = !any;
  $('troubleWrap').hidden = st.trouble.length === 0;
  putCat('statscat', any ? catFor(st.first, st.sums) : 'idle');
  const pc = st.sums ? Math.round(100*st.first/st.sums) : 0;
  $('tiles').innerHTML =
    '<div class="tile"><span class="n">' + st.sums + '</span><span class="t">sums practised</span></div>' +
    '<div class="tile"><span class="n">' + pc + '%</span><span class="t">right first try</span></div>' +
    '<div class="tile"><span class="n">' + st.streak + '</span><span class="t">day' + (st.streak === 1 ? '' : 's') + ' in a row</span></div>';

  $('badges').innerHTML = BADGES.map(b => {
    const got = b.has(st);
    return '<div class="badge' + (got ? ' got' : '') + '">' + icon(b.g) +
           '<span class="nm">' + b.nm + '</span>' +
           (got ? '' : '<span class="need">' + b.need + '</span>') + '</div>';
  }).join('');

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

  $('byLevel').innerHTML = Object.keys(st.lvl).sort((x,y) => x-y).map(L => {
    const d = st.lvl[L], p = Math.round(100*d.f/d.n);
    return '<div class="lvlrow"><span class="nm">' + (LEVEL_NAME[L] || L) + '</span>' +
           '<span class="track"><i style="width:' + p + '%"></i></span>' +
           '<span class="pc">' + p + '% · ' + d.n + '</span></div>';
  }).join('');

  $('trouble').innerHTML = st.trouble.map(t =>
    '<div class="chip"><span class="eq">' + factLabel(t.key) + '</span><span class="r">missed ' + t.miss + '/' + t.seen + '</span></div>'
  ).join('');

  $('advice').textContent = advice(st);
  document.querySelectorAll('#lenSeg button').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.n === LOCAL.n)));
}
function openStats(){ renderStats(); makeXfer(); $('stats').hidden = false; }
$('statsBtn').onclick = openStats;
$('toStats').onclick = openStats;
$('closeStats').onclick = () => { $('stats').hidden = true; };

$('practise').onclick = () => {
  const keys = statsFrom(LOCAL.rounds).trouble.map(t => t.key);
  if(!keys.length) return;
  const set = [];
  for(let i = 0; set.length < LOCAL.n && i < LOCAL.n*4; i++){
    const q = genForFact(keys[i % keys.length]);
    if(q) set.push(q);
  }
  if(set.length) newRound(shuffle(set));
};

document.querySelectorAll('#lenSeg button').forEach(b => b.onclick = () => {
  LOCAL.n = +b.dataset.n; saveLocal();
  document.querySelectorAll('#lenSeg button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
});

let resetArmed = null;
$('reset').onclick = async () => {
  if(!resetArmed){
    resetArmed = setTimeout(() => { resetArmed = null; $('reset').classList.remove('armed'); $('reset').textContent = 'Reset progress'; }, 3500);
    $('reset').classList.add('armed'); $('reset').textContent = 'Tap again to erase';
    return;
  }
  clearTimeout(resetArmed); resetArmed = null;
  $('reset').classList.remove('armed'); $('reset').textContent = 'Reset progress';
  const ids = LOCAL.rounds.map(r => r.id);
  LOCAL.rounds = []; saveLocal();
  W = weightsFrom(LOCAL.rounds);
  renderStats();
  if(DB) for(const id of ids){ try { await DB.collection('rounds').doc(id).delete(); } catch(e){ break; } }
};

/* ---------- level picker ---------- */
function paintPill(){ $('levelPill').textContent = LEVEL_NAME[S.level]; }
// "3 days ago", then a date once it stops being recent — precise enough to decide
// what to practise without turning the picker into a log.
function ago(ts){
  const today = dayKey(Date.now()), then = dayKey(ts);
  if(today === then) return 'today';
  const days = Math.round((Date.parse(today + 'T12:00:00') - Date.parse(then + 'T12:00:00')) / 86400000);
  if(days === 1) return 'yesterday';
  if(days < 7) return days + ' days ago';
  return new Date(ts).toLocaleDateString(undefined, { day:'numeric', month:'short' });
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
  const open = LEVELS.filter(l => !done(l.id) && (l.needs || []).every(done));
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
  const M = mastery(LOCAL.rounds);
  const stat = l => {
    const h = hist[l.id];
    if(!h) return '<span class="last none"><i>not tried yet</i></span>';
    const f = h.last.n ? h.last.firstTry / h.last.n : 0;
    const col = f >= .8 ? 'var(--good)' : f >= .5 ? 'var(--warm)' : 'var(--bad)';
    const life = h.rounds > 1 ? ' · ' + Math.round(100 * h.f / h.n) + '%' : '';
    return '<span class="last"><b style="color:' + col + '">' + h.last.firstTry + '/' + h.last.n +
           '</b><i>' + ago(h.last.ts) + life + '</i></span>';
  };
  // how hard it is, on the rubric in the README: operations, reading, search,
  // number size and how easy the trap is to miss — five dots
  const hard = l => '<span class="dots5" title="Difficulty ' + l.d + ' of 5" aria-label="Difficulty ' +
    l.d + ' of 5">' + [1,2,3,4,5].map(k => '<i class="' + (k <= l.d ? 'on' : '') + '"></i>').join('') + '</span>';
  const row = l => '<button class="pick" data-lvl="' + l.id + '" aria-pressed="' + (l.id === S.level) + '">' +
    '<span class="eq">' + l.eq + hard(l) + '</span>' +
    '<span class="desc">' + l.desc + '</span>' +
    (M[l.id] && M[l.id].done ? '<span class="tick">✓</span>' : '') + stat(l) + '</button>';
  const m = mastery(LOCAL.rounds);
  const lastRound = LOCAL.rounds[LOCAL.rounds.length - 1];
  const lastLvl = lastRound && LEVELS.filter(l => l.id === lastRound.level)[0];
  const nx = nextUp(m, lastLvl && (lastLvl.grp || lastLvl.op));
  const learned = LEVELS.filter(l => m[l.id] && m[l.id].done).length;
  const met = LEVELS.filter(l => m[l.id]).length;
  $('nextUp').innerHTML = '<div class="nextwrap"><div class="lab">' +
    (!met ? 'Start here' : met < LEVELS.length ? 'Try this next' : 'Needs work') + '</div>' +
    (nx ? '<button class="pick now" data-lvl="' + nx.id + '"><span class="eq">' + nx.eq +
          hard(nx) + '</span><span class="desc">' + nx.desc + '</span>' +
          stat(nx) + '</button>'
        : '<div class="advice">Every level learned. Keep the ones she enjoys in rotation.</div>') +
    '<div class="progress"><span class="track"><i style="width:' +
    Math.round(100*learned/LEVELS.length) + '%"></i></span><span>' + learned + ' of ' +
    LEVELS.length + ' learned</span></div></div>';
  $('pickAll').innerHTML = PICK_GROUPS.map(g => {
    const rows = LEVELS.filter(g.has).map(row).join('');
    return rows ? '<div class="lab">' + g.nm + '</div><div class="pickgroup">' + rows + '</div>' : '';
  }).join('');
  document.querySelectorAll('.pick').forEach(b => b.onclick = () => {
    S.level = +b.dataset.lvl;
    paintPill();
    newRound();
  });
}
const midRound = () => S.i > 0 || S.parts.some(p => p !== '') || S.results.length > 0;
$('levelPill').onclick = () => { buildPicker(); $('pickWarn').hidden = !midRound(); $('picker').hidden = false; };
$('closePick').onclick = () => { $('picker').hidden = true; };
paintPill();

/* ---------- controls ---------- */
$('pad').addEventListener('click', e => { const b = e.target.closest('.key'); if(b) press(b.dataset.k); });
$('again').onclick = () => newRound();
$('card').addEventListener('click', () => { if(S.settled) next(); });
document.addEventListener('keydown', e => {
  if(!$('sheet').hidden || !$('stats').hidden || !$('picker').hidden) return;
  if(e.key >= '0' && e.key <= '9') press(e.key);
  else if(e.key === 'Backspace') press('del');
  else if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); press('go'); }
});

/* ---------- shared mirror ---------- */
const builtOn = () => {
  try { return ' · build ' + new Date(document.lastModified)
    .toLocaleString(undefined, { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' }); }
  catch(e){ return ''; }
};
const heldHere = () => 'On this device only · ' + LOCAL.rounds.length + ' rounds held here';
let DB = null;
(async () => {
  const db = window.claude && await claude.use('db');
  if(!db) { $('synced').textContent = heldHere() + builtOn(); return; }
  DB = db;
  try {
    const snap = await db.collection('rounds').orderBy('ts','desc').limit(300).get();
    const remote = snap.docs.map(d => d.data()).filter(r => r && r.id);
    const byId = {};
    LOCAL.rounds.forEach(r => byId[r.id] = r);
    remote.forEach(r => { if(!byId[r.id]) byId[r.id] = r; });
    const remoteIds = {}; remote.forEach(r => remoteIds[r.id] = true);
    LOCAL.rounds = Object.keys(byId).map(k => byId[k]).sort((x,y) => x.ts - y.ts).slice(-400);
    saveLocal();
    W = weightsFrom(LOCAL.rounds);
    $('synced').textContent = 'Synced across your devices · ' + LOCAL.rounds.length + ' rounds kept' + builtOn();
    if(!$('stats').hidden) renderStats();
    const pending = LOCAL.rounds.filter(r => !remoteIds[r.id]).slice(-20);
    for(const r of pending){ try { await db.collection('rounds').doc(r.id).set(r); } catch(e){ break; } }
  } catch(e){
    $('synced').textContent = heldHere() + builtOn();
  }
})();

/* ---------- move progress between devices ----------
   Two devices, two separate copies of localStorage, and no server behind the Pages
   build. Every round already carries an id, so merging is only "keep the ones this
   device has not seen" - the same trick the artifact's db sync uses. The whole log
   travels in the link's hash. */
const b64enc = bytes => {
  let s = '';
  for(let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const b64dec = str => {
  const raw = atob(str.replace(/-/g, '+').replace(/_/g, '/'));
  const b = new Uint8Array(raw.length);
  for(let i = 0; i < raw.length; i++) b[i] = raw.charCodeAt(i);
  return b;
};
async function pack(obj){
  const raw = new TextEncoder().encode(JSON.stringify(obj));
  if(typeof CompressionStream !== 'function') return 'j' + b64enc(raw);
  const gz = await new Response(new Blob([raw]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer();
  return 'z' + b64enc(new Uint8Array(gz));
}
async function unpack(code){
  const bytes = b64dec(code.slice(1));
  if(code[0] !== 'z') return JSON.parse(new TextDecoder().decode(bytes));
  const raw = await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
  return JSON.parse(new TextDecoder().decode(raw));
}
function mergeRounds(rounds){
  const have = {};
  LOCAL.rounds.forEach(r => have[r.id] = true);
  const add = (rounds || []).filter(r => r && r.id && !have[r.id]);
  if(!add.length) return 0;
  LOCAL.rounds = LOCAL.rounds.concat(add).sort((a, b) => a.ts - b.ts).slice(-400);
  saveLocal();
  W = weightsFrom(LOCAL.rounds);
  if(!$('stats').hidden) renderStats();
  return add.length;
}
const say = t => { $('synced').textContent = t + builtOn(); };
// Safari hands out the clipboard only inside the tap itself, and zipping is async - so
// the code is built when the panel opens, not when the button is pressed.
let XFER = '';
function makeXfer(){ pack(LOCAL.rounds).then(c => { XFER = location.origin + location.pathname + '#t=' + c; }, () => {}); }
// The clipboard, not a link: a page added to the home screen keeps its own storage,
// separate from Safari's, so a tapped link lands in the wrong jar. Copy on one device,
// paste in the other - and between an iPad and an iPhone on one account the clipboard
// crosses by itself.
$('xfer').onclick = () => {
  if(!XFER) { makeXfer(); return; }
  navigator.clipboard.writeText(XFER).then(
    () => say('Copied ' + LOCAL.rounds.length + ' rounds · tap Paste on the other device'),
    () => prompt('Copy this and paste it on the other device', XFER));
};
$('xferIn').onclick = () => {
  const take = async code => {
    const m = String(code || '').trim().match(/(?:#t=)?([A-Za-z0-9_-]{16,})\s*$/);
    if(!m) { say('Nothing to paste - copy on the other device first'); return; }
    try { const n = mergeRounds(await unpack(m[1])); say(n ? 'Brought over ' + n + ' rounds · ' + LOCAL.rounds.length + ' held here' : 'Nothing new to bring over'); }
    catch(e){ say('That code would not open'); }
  };
  if(navigator.clipboard && navigator.clipboard.readText)
    navigator.clipboard.readText().then(take, () => take(prompt('Paste the code from the other device')));
  else take(prompt('Paste the code from the other device'));
};
(async () => {
  const hash = location.hash.match(/^#t=(.+)$/);
  if(!hash) return;
  history.replaceState(null, '', location.pathname + location.search);
  try {
    const n = mergeRounds(await unpack(decodeURIComponent(hash[1])));
    $('synced').textContent = (n ? 'Brought over ' + n + ' rounds' : 'Nothing new to bring over') + builtOn();
  } catch(e){ $('synced').textContent = 'That transfer link would not open' + builtOn(); }
})();

// Safari keeps pinch-zoom even with user-scalable=no; for a full-screen practice app
// an accidental pinch just breaks the layout, so the gesture is turned off here. It is
// a deliberate trade against the usual advice — nothing on the page needs magnifying.
['gesturestart', 'gesturechange', 'gestureend'].forEach(g =>
  document.addEventListener(g, e => e.preventDefault(), { passive: false }));

newRound();

// Offline play and same-build-everywhere for the Pages copy; the artifact frame has no use for it.
if('serviceWorker' in navigator && window.isSecureContext && !window.claude)
  navigator.serviceWorker.register('sw.js').catch(() => {});
