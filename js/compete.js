/* ---------- competition ----------
   An МБГ paper as its rules have set it since 2018: 20 tasks in an hour, easiest first, every answer typed,
   2 points for a right answer, 1 for at least half of a task's several answers (mbgPts). Nothing is marked
   until the end, or until the clock runs out; a skipped task comes back after the others. A paper keeps to
   the picker's focus (compFocus in app.js): a grade, a competition, its round, one year. A start sheet says
   where its tasks come from and how it goes before the clock starts.
   The tasks come from the levels' own generators, never from the competitions' papers, which
   are copyrighted. It is saved as one round with level 'comp' and the ids of its levels.
   A reload keeps the paper (paperSnap, resumeComp). */
import { $, esc, rnd, seeded } from './core.js';
import { accepts, answers, drawQ, eqText, mbgPts, openAns, raw, seededRaw, slipOf, why } from './questions.js';
import { LEVELS } from './levels.js';
import { PLAYER } from './players.js';
import { LANG, t } from './i18n.js';
import { COMP, GLYPH, LOCAL, S, back, clearTimers, clock, compFocus, compTick, finish, fromName, go, groupOf, newRound, saveRound, setComp, sfx, show } from './app.js';
import { choiceHtml, letterOf } from './choice.js';
export const COMP_N = 20, COMP_MIN = 60;
// МБГ Есен 2026, 2 клас, as forecast: a task from each level, in the order the forecast page puts them
// (check/forecast.js holds the forecast's levels). ponytail: goes with the forecast once the real paper is in.
const FORECAST = [8, 9, 10, 11, 12, 13, 270, 15, 16, 269, 17, 18, 21, 22, 271, 32, 24, 25, 27, 31];
const task = id => Object.assign(seededRaw(id), { lvl: id, pts: 2 });   // a kind whose answer is a word keeps its own А/Б/В/Г
// The basics (the plain sums, the times table, the units of length) are drill, not olympiad tasks: a paper leaves them out.
// Nor a level only Аз и числата asks, a school contest far easier than an olympiad paper, unless that contest is the focus.
// A paper is for one grade and keeps to the focus; a focus with nothing to draw from is the whole grade.
const olympiad = f => LEVELS.filter(l => l.src !== 'basics' && (f.comp === 'ach' || l.papers.some(p => !p.startsWith('ach-'))) && f.has(l));
const poolOf = f => { const ls = olympiad(f); return ls.length ? ls : olympiad({ comp: '', has: l => l.grade === f.grade }); };
const BANDS = [[2, 3], [3, 4], [4, 4], [4, 5]];              // difficulty of tasks 1–5, 6–10, 11–15, 16–20
// drawn by how often real papers ask it: an every-year task turns up more than a one-off
const pick = pool => { let w = rnd(pool.reduce((t, l) => t + 1 + l.freq, 0)); return pool.find(l => (w -= 1 + l.freq) < 0); };
export function compTasks(paper, f = compFocus()){
  if(paper === 'forecast') return FORECAST.map(task);
  const OLYMPIAD = poolOf(f);
  // one year's paper has fewer levels than tasks: each of them once, then some again with other numbers, easiest first
  if(OLYMPIAD.length <= COMP_N){
    const ls = OLYMPIAD.slice();
    while(ls.length < COMP_N) ls.push(pick(OLYMPIAD));
    return ls.sort((a, b) => a.d - b.d).map(l => task(l.id));
  }
  const out = [], used = new Set();
  let lastGrp = null;
  for(let i = 0; i < COMP_N; i++){
    const [lo, hi] = BANDS[Math.floor(i / 5)];
    let pool = OLYMPIAD.filter(l => l.d >= lo && l.d <= hi && !used.has(l.id));
    const other = pool.filter(l => l.grp !== lastGrp);        // no two in a row from one group
    if(other.length) pool = other;
    if(!pool.length) pool = OLYMPIAD.filter(l => l.d >= lo);
    if(!pool.length) pool = OLYMPIAD.filter(l => !used.has(l.id));   // a contest with no task this hard (Аз и числата): what is left
    const l = pick(pool);
    used.add(l.id); lastGrp = l.grp;
    out.push(task(l.id));
  }
  // easiest first, as on a paper: the bands overlap, so within a band too (stable: one difficulty keeps the order drawn)
  const d = x => LEVELS.find(l => l.id === x.lvl).d;
  return out.sort((a, b) => d(a) - d(b));
}
// her best paper from the same place (compFocus's key, or 'forecast'); a paper marked the old way
// (3–5 points a task, some А/Б/В/Г) doesn't compare: only those at 2 points a task
export const bestComp = from => LOCAL.rounds.filter(r => r.level === 'comp' && r.max === 2 * r.n && r.from === from).sort((a, b) => b.pts / b.max - a.pts / a.max)[0];
export const compTime = ms => { const s = Math.max(0, Math.round(ms / 1000)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
export const compLeft = () => compTime(COMP.end - Date.now());

// The paper under way, kept at every task (app.js saveRound) so a reload, or an iPad dropping the app, does not end it:
// its tasks by level and seed, her answers, the clock's start and end. The clock is real time: it ran while the app was away.
export const paperSnap = () => ({ at: Date.now(), tasks: S.qs.map(q => [q.lvl, q.seed]), paper: COMP.paper || '', from: COMP.from, t0: COMP.t0, end: COMP.end,
  ans: COMP.ans, picked: COMP.picked, queue: COMP.queue, skipped: [...(COMP.skipped || [])], looked: [...(COMP.looked || [])], first: COMP.first,
  done: !!COMP.done, check: !!COMP.check, i: S.i, ms: S.ms });
// The paper again from its snapshot, on the task and the screen she left it on; over if its hour has gone by
export function resumeComp(s){
  const qs = s.tasks.map(([lvl, seed]) => Object.assign(seeded(seed, () => raw(lvl)), { seed, lvl, pts: 2 }));
  run({ paper: s.paper, from: s.from, t0: s.t0, end: s.end, ans: s.ans, picked: s.picked, queue: s.queue, go: null, skipped: new Set(s.skipped), looked: new Set(s.looked), first: s.first, done: s.done }, qs);
  qs.forEach((q, k) => { const a = s.ans[k]; if(a){ S.results[k] = accepts(q, a); if(!S.results[k]){ S.typed[k] = a.join(' · '); S.slip[k] = slipOf(q, a); } } });
  S.ms = s.ms || []; S.i = s.i;
  if(Date.now() >= s.end) compEnd(); else if(s.check) compCheck(); else show();
}
// paper: 'forecast' for the forecast's paper, nothing for one drawn afresh
export function startComp(paper){
  const f = compFocus(), qs = compTasks(paper, f), now = Date.now();
  // queue: the tasks not answered yet, the one on screen first
  run({ paper, from: paper || f.key, t0: now, end: now + COMP_MIN * 60000, ans: {}, picked: {}, queue: qs.map((_, k) => k), go: null }, qs);
}
function run(c, qs){
  clearInterval(compTick);
  setComp(c, setInterval(() => {
    if(!COMP){ clearInterval(compTick); return; }
    const c = $('compClock');
    if(c) c.textContent = compLeft();
    if(Date.now() >= COMP.end) compEnd();
  }, 1000));
  newRound(qs, true);
  $('levelName').textContent = c.paper ? t('papers')['mbg-autumn-forecast2026'] : t('compName');
  $('sub').textContent = c.paper ? t('gradeN', PLAYER.grade || 2) + ' · ' + t('compSubtitle') : fromName(c.from);
}
// Before the clock: where the tasks come from, how the paper goes, her best from the same place; Start starts it.
let NEXT = '';   // the paper the sheet is for: 'forecast', or one drawn from the focus
export function openComp(paper){ NEXT = paper || ''; go('paper'); }
export function paintCompSheet(){
  const f = compFocus(), best = bestComp(NEXT || f.key);
  $('compFrom').innerHTML = '<span class="lab">' + t('compFrom') + '</span><b>' + (NEXT ? t('papers')['mbg-autumn-forecast2026'] : f.name) + '</b>' +
    '<span class="meta">' + t(NEXT ? 'compForecastHow' : 'compHow') + '</span>' + (best ? '<span class="meta">' + t('compBest', best.pts, best.max) + '</span>' : '');
  $('compRules').innerHTML = [t('compRuleTime', COMP_N, COMP_MIN), t('compRuleQuiet'), t('compRuleSkip'), t('compRuleCheck'), t('compRulePts', 2 * COMP_N)].map(s => '<li>' + s + '</li>').join('');
}
// The same paper on paper: 20 tasks drawn as the sheet would start them, each with a blank where its answer goes
// (one blank where she counts the answers herself, as on a real paper), and a page of answers for a grown-up after
// them. Shown only in print (app.css): her screen never shows the answers. Nothing is recorded; the grown-up marks it.
export function printComp(){
  const f = compFocus(), qs = compTasks(NEXT, f), box = document.createElement('div');
  const blank = q => {
    box.innerHTML = drawQ(q);
    const s = box.querySelectorAll('.slot');
    if(openAns(q) && s.length > 1){ const r = document.createRange(); r.setStartAfter(s[0]); r.setEndAfter(s[s.length - 1]); r.deleteContents(); }
    box.querySelectorAll('.slot').forEach(e => { e.removeAttribute('id'); e.className = 'slot pblank'; });   // no second #slot0 beside the task's own
    return box.innerHTML + (q.options ? '<div class="pchoices">' + choiceHtml(q) + '</div>' : '');
  };
  // every answer of a task with several; one of them for a one-box task that takes any
  const key = q => q.options ? letterOf(q.pick) : answers(q).join((q.slots || 1) > 1 ? ', ' : ' / ');
  const name = NEXT ? t('papers')['mbg-autumn-forecast2026'] : f.name;
  $('print').innerHTML = '<header class="phead"><b>' + t('compName') + ' · ' + name + '</b><span>' + t('compWhat', COMP_N, COMP_MIN).replace(/ · [^·]*$/, '') +
    ' · ' + t('compRulePts', 2 * COMP_N) + '</span><span>' + t('printName') + ' ______________________ &nbsp; ' + new Date().toLocaleDateString(LANG) + '</span></header>' +
    qs.map((q, k) => '<section class="ptask"><span class="pn">' + (k + 1) + '.</span><div class="stage">' + blank(q) + '</div></section>').join('') +
    '<section class="pkey"><b>' + t('printKey') + ' · ' + name + '</b><ol>' + qs.map(q => '<li>' + key(q) + '</li>').join('') + '</ol></section>';
  window.print();
}
// Her answer is kept, not marked: a tap on another option before it moves on changes it.
export function compAnswer(){
  const q = S.qs[S.i], ok = accepts(q, S.parts);
  COMP.ans[S.i] = S.parts.slice();
  S.results[S.i] = ok;
  S.typed[S.i] = ok ? undefined : S.parts.join(' · ');
  S.slip[S.i] = ok ? undefined : slipOf(q, S.parts);
  sfx.tap();
  saveRound();   // her answer is kept before she moves on (a reload on a choice she has not yet gone on from)
  clearTimeout(COMP.go);
  if(q.options){ $('nextBtn').disabled = false; return; }   // a choice waits for Next: she may still change it
  COMP.go = setTimeout(compNext, 150);
}
function compNext(){
  if(!COMP) return;
  clearTimers();
  COMP.queue = COMP.queue.filter(k => !COMP.ans[k]);
  if(!COMP.queue.length){ compCheck(); return; }
  S.i = COMP.queue[0];
  show();
}
// Every task has an answer: before it is handed in, her answers to look over, as on paper, where she can turn back
// to any task. A tap opens it with her answer in it, to keep (back to the list) or change (✓). The quick ones are
// marked: her halfway numbers on 2026-10-18 each took under a minute. «Предай» hands it in; so does the clock.
function compCheck(){
  clearTimers(); S.settled = true; clock();   // the last task's time stops here
  COMP.check = COMP.done = true;
  COMP.first = COMP.first || Object.assign({}, COMP.ans);   // her answers as the check found them
  const said = k => S.qs[k].options ? letterOf(COMP.picked[k]) : COMP.ans[k].join(', ');
  $('stage').innerHTML = '<div class="check"><p class="meta">' + t('checkHow') + '</p><div class="gcard list">' + S.qs.map((q, k) => {
    const ms = S.ms[k] || 0;
    return '<button class="crow chk' + (ms < 60000 ? ' quick' : '') + '" data-k="' + k + '"><span class="cn">' + (k + 1) + '</span><span class="cg">' +
      groupOf(LEVELS.find(l => l.id === q.lvl)) + '</span><span class="co">' + said(k) + '</span><span class="cp">' + compTime(ms) + '</span></button>';
  }).join('') + '</div><button class="btn" id="handIn">' + t('handIn') + '</button></div>';
  $('qnum').textContent = t('checkTitle'); $('run').innerHTML = '';   // no task's points: the whole paper
  $('compCount').textContent = String(S.qs.length); $('dots').querySelectorAll('.step').forEach(s => { s.className = 'step done'; });   // every task has its answer
  $('pad').hidden = $('choices').hidden = $('typeHint').hidden = $('compRow').hidden = $('compNote').hidden = true;
  $('verdict').textContent = ''; $('hint').innerHTML = '';
  $('stage').querySelectorAll('.chk').forEach(b => b.onclick = () => { COMP.check = false; S.i = +b.dataset.k; (COMP.looked = COMP.looked || new Set()).add(S.i); show(); });
  $('handIn').onclick = e => { e.stopPropagation(); compEnd(); };
  saveRound();   // the check is part of the paper in progress (a reload on it opens it again)
}
export function compEnd(){
  if(!COMP) return;
  clearInterval(compTick); clearTimeout(COMP.go);
  // what the check did to each task she opened in it, for the round's record: 4 looked at (or right before and after),
  // 5 put right, 6 changed and still wrong, 7 a right answer changed to a wrong one
  (COMP.looked || []).forEach(k => { const was = COMP.first[k], before = accepts(S.qs[k], was), now = !!S.results[k];
    S.after[k] = was.join() === COMP.ans[k].join() || before && now ? 4 : now ? 5 : before ? 7 : 6; });
  S.skipped = S.qs.map((_, k) => S.results[k] === undefined);                         // kept apart in the round's record
  S.qs.forEach((_, k) => { if(S.results[k] === undefined) S.results[k] = false; });   // unanswered is not right
  finish();
}

// The result sheet of a paper: her tasks one by one (a row opens its task and how it is solved), and against her best paper before this one
export function paintPaperResult(pts, max){
  const n = k => S.qs.filter((_, j) => k(j)).length, right = n(j => S.results[j]), none = n(j => S.skipped[j]);
  $('compTable').innerHTML = '<div class="clegend">' + t('compLegend', right, S.qs.length - right - none, none) + '</div>' + S.qs.map((q, k) => {
    const st = S.skipped[k] ? 'skip' : S.results[k] ? 'ok' : 'no';
    const said = st === 'ok' ? '✓' : st === 'skip' ? t('notReached') : q.options && COMP.picked[k] !== undefined ?
      t('chose', letterOf(COMP.picked[k])) + ' → ' + letterOf(q.pick) : esc(S.typed[k] || '') + ' → ' + answers(q).join(' · ');
    return '<button class="crow ' + st + '" aria-expanded="false"><span class="cn">' + (k + 1) + '</span><span class="cg">' + groupOf(LEVELS.find(l => l.id === q.lvl)) +
      '</span><span class="co">' + said + '</span><span class="cp">' + mbgPts(q, COMP.ans[k]) + '</span></button><div class="why" hidden><div class="eq">' + eqText(q) + '</div>' + why(q, true) + '</div>';
  }).join('');
  // a row opens its task and how it is solved
  $('compTable').querySelectorAll('.crow').forEach(b => b.onclick = () => {
    const open = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', String(open)); b.nextElementSibling.hidden = !open;
  });
  const prev = bestComp(COMP.from);
  if(prev){
    $('compBest').hidden = false;
    $('compBest').textContent = pts / max > prev.pts / prev.max ? t('compRecord', pts, max, prev.pts + ' / ' + prev.max) : t('compBest', prev.pts, prev.max);
  }
}
// The picker's card: what a paper is, and her best one so far.
const ICON = d => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>';
export function paintCompCard(){
  const f = compFocus(), best = bestComp(f.key), pool = poolOf(f);
  // how much of what a paper draws from she has met in one
  const seen = new Set(LOCAL.rounds.filter(r => r.level === 'comp').flatMap(r => (r.t || []).map(e => e[0]))), met = pool.filter(l => seen.has(l.id)).length;
  $('compStart').innerHTML = '<span class="compicon">' + ICON(GLYPH.stopwatch[1]) + '</span><span class="nm"><span class="lab">' +
    t('compName') + '</span><b>' + t('compWhat', COMP_N, COMP_MIN) + '</b><span class="meta">' + f.name + '</span>' +
    (best ? '<span class="meta">' + t('compBest', best.pts, best.max) + '</span>' : '') +
    (met ? '<span class="meta">' + t('compMet', met, pool.length) + '</span>' : '') + '</span>' + ICON('M9 5l7 7-7 7');
}
// The buttons, wired once app.js has set the page up (as a module this file runs first).
export function startCompete(){
  $('skipBtn').onclick = () => {
    if(!COMP) return;
    if(COMP.done){ compCheck(); return; }   // after the check has opened, this button goes back to it
    (COMP.skipped = COMP.skipped || new Set()).add(S.i);   // drawn outlined until she answers it
    COMP.queue.push(COMP.queue.shift());
    S.i = COMP.queue[0];
    show();
  };
  $('nextBtn').onclick = () => { if(COMP && COMP.ans[S.i]) compNext(); };
  $('quitBtn').onclick = () => { if(COMP && confirm(t('quitAsk'))) compEnd(); };   // what she has answered counts, the rest is unanswered
  $('compStart').onclick = () => openComp();
  $('compGo').onclick = () => startComp(NEXT);
  $('compPrint').onclick = printComp;
  $('compBack').onclick = back;
}
