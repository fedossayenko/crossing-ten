/* ---------- competition ----------
   An МБГ-style paper: 20 tasks in an hour, easiest first, each worth its difficulty in points.
   The first 15 are А/Б/В/Г and the last 5 are typed, as on the real paper. Nothing is marked
   until the end, or until the clock runs out; a skipped task comes back after the others.
   The tasks come from the levels' own generators, never from the competitions' papers, which
   are copyrighted. It is saved as one round with level 'comp' and the ids of its levels.
   ponytail: a reload ends the paper; keep COMP in sessionStorage if she ever loses one that way. */
const COMP_N = 20, COMP_CHOICE = 15, COMP_MIN = 60;
function compTasks(){
  const out = [], used = new Set();
  let lastGrp = null;
  for(let i = 0; i < COMP_N; i++){
    const lo = 1 + Math.floor(i / 5);                      // four bands of five: difficulty 1–2, 2–3, 3–4, 4–5
    let pool = LEVELS.filter(l => l.d >= lo && l.d <= lo + 1 && !used.has(l.id));
    const other = pool.filter(l => (l.grp || l.op) !== lastGrp);   // no two in a row from one group
    if(other.length) pool = other;
    if(!pool.length) pool = LEVELS.filter(l => l.d >= lo);
    const l = pool[rnd(pool.length)];
    used.add(l.id); lastGrp = l.grp || l.op;
    const q = Object.assign(raw(l.id), { lvl: l.id, pts: Math.min(5, Math.max(1, l.d)) });
    out.push(i < COMP_CHOICE ? withChoices(q) : q);
  }
  return out;
}
const compTime = ms => { const s = Math.max(0, Math.round(ms / 1000)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
const compLeft = () => compTime(COMP.end - Date.now());

function startComp(){
  const qs = compTasks(), now = Date.now();
  // queue: the tasks not answered yet, the one on screen first
  COMP = { t0: now, end: now + COMP_MIN * 60000, ans: {}, picked: {}, queue: qs.map((_, k) => k), go: null };
  clearInterval(compTick);
  compTick = setInterval(() => {
    if(!COMP){ clearInterval(compTick); return; }
    const c = $('compClock');
    if(c) c.textContent = compLeft();
    if(Date.now() >= COMP.end) compEnd();
  }, 1000);
  newRound(qs, true);
  $('levelName').textContent = t('compName');
  $('sub').textContent = t('compSubtitle');
}
// Her answer is kept, not marked: a tap on another option before it moves on changes it.
function compAnswer(){
  const q = S.qs[S.i], ok = accepts(q, S.parts);
  COMP.ans[S.i] = S.parts.slice();
  S.results[S.i] = ok;
  S.typed[S.i] = ok ? undefined : S.parts.join(' · ');
  S.slip[S.i] = ok ? undefined : slipOf(q, S.parts);
  sfx.tap();
  clearTimeout(COMP.go);
  COMP.go = setTimeout(compNext, q.options ? 450 : 150);
}
function compNext(){
  if(!COMP) return;
  clearTimers();
  COMP.queue = COMP.queue.filter(k => !COMP.ans[k]);
  if(!COMP.queue.length){ compEnd(); return; }
  S.i = COMP.queue[0];
  show();
}
function compEnd(){
  if(!COMP) return;
  clearInterval(compTick); clearTimeout(COMP.go);
  S.qs.forEach((_, k) => { if(S.results[k] === undefined) S.results[k] = false; });   // unanswered is not right
  finish();
}
$('skipBtn').onclick = () => {
  if(!COMP) return;
  COMP.queue.push(COMP.queue.shift());
  S.i = COMP.queue[0];
  show();
};

// The picker's card: what a paper is, and her best one so far.
const ICON = d => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>';
function paintCompCard(){
  const best = LOCAL.rounds.filter(r => r.level === 'comp' && r.max).sort((a, b) => b.pts / b.max - a.pts / a.max)[0];
  $('compStart').innerHTML = '<span class="compicon">' + ICON(GLYPH.stopwatch[1]) + '</span><span class="nm"><span class="lab">' +
    t('compName') + '</span><b>' + t('compWhat', COMP_N, COMP_MIN) + '</b>' +
    (best ? '<span class="meta">' + t('compBest', best.pts, best.max) + '</span>' : '') + '</span>' + ICON('M9 5l7 7-7 7');
}
$('levelPill').addEventListener('click', paintCompCard);
$('compStart').onclick = () => startComp();
