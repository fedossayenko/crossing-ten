// Today's practice: six tasks a day, each from another level she has met, mixed as on a paper. A round of one level
// shows her the way after its first task; a paper does not, and there she has to see which way a task needs. Em's
// rounds up to 2026-11-01: 79% right first time in rounds of one level, 55% where levels were mixed, 53% in papers,
// and a level learned at 4 in 5 came out at 46% on a paper three to ten days later — of 78 levels she had played,
// 6 came back on another day. So the levels come back here, mixed: a level missed in a mixed set (a paper, a round of
// mistakes, this practice) the next day, as a task like it with other numbers (app.js draws it); any other level a day
// after a round of it, then 3, 7, 14 and 30 days after each right answer here. Interleaved practice: Rohrer et al.
// 2020, 61% against 38% a month later.
// Pure: her rounds and the levels in, the plan out; app.js draws the tasks and plays them.
export const DAILY_N = 6, DAILY_MISS = 2;
const GAPS = [1, 3, 7, 14, 30];
const day0 = ts => { const d = new Date(ts); d.setHours(0, 0, 0, 0); return +d; };
const daysFrom = (a, b) => Math.round((day0(b) - day0(a)) / 864e5);
export function dailyPlan(rounds, levels, now = Date.now()){
  const L = new Map(levels.map(l => [l.id, l])), at = new Map();
  const of = id => at.get(id) || at.set(id, { id, study: 0, mixed: [] }).get(id);
  let done = null;
  for(const r of rounds.slice().sort((a, b) => a.ts - b.ts)){
    if(r.daily && daysFrom(r.ts, now) === 0) done = { got: r.firstTry, n: r.n };
    if(typeof r.level === 'number'){ if(L.has(r.level)) of(r.level).study = Math.max(of(r.level).study, r.ts); }   // a round of one level: studied, not checked
    else if(Array.isArray(r.t)) r.t.forEach(([lv, shape, seed, , ok, ans]) => { if(L.has(lv) && ok !== -1) of(lv).mixed.push({ ts: r.ts, ok: ok === 1, shape, seed, ans }); });
  }
  const run = (xs, ok) => { let k = 0; for(let i = xs.length - 1; i >= 0 && xs[i].ok === ok; i--) k++; return k; };
  const all = [...at.values()].map(x => {
    const last = x.mixed[x.mixed.length - 1], miss = !!last && !last.ok;
    const ref = Math.max(x.study, last ? last.ts : 0), days = daysFrom(ref, now);
    // missed again and again: a day, then two, then three — a study round of it (the suggestion) helps more than asking daily
    const gap = miss ? Math.min(run(x.mixed, false), 3) : GAPS[Math.min(run(x.mixed, true), GAPS.length - 1)];
    return { id: x.id, d: L.get(x.id).d, miss, due: days >= gap, over: days / gap, ref,
      ...(miss ? { shape: last.shape, seed: last.seed, ans: last.ans } : {}) };
  });
  const misses = all.filter(x => x.miss && x.due).sort((a, b) => a.d - b.d || b.ref - a.ref);   // easiest first, so most of the six go right
  const reviews = all.filter(x => !x.miss && x.due).sort((a, b) => b.over - a.over || a.d - b.d);
  const early = all.filter(x => !x.due && !x.miss).sort((a, b) => b.over - a.over);   // too few due: the nearest to due (a miss waits its gap)
  const take = [...misses.slice(0, DAILY_MISS), ...reviews, ...misses.slice(DAILY_MISS), ...early].slice(0, DAILY_N);
  // a level to go over first, then a missed one, and so on: she starts on one she knows
  const rv = take.filter(x => !x.miss), ms = take.filter(x => x.miss), ms0 = ms.length, items = [];
  while(rv.length || ms.length){ if(rv.length) items.push(rv.shift()); if(ms.length) items.push(ms.shift()); }
  const enough = items.length >= 3;   // fewer levels met: nothing to mix yet
  return { items: enough ? items : [], miss: enough ? ms0 : 0, done };
}
