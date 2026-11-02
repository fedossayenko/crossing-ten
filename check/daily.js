// Runs beside the app (in check.js's own scope, through eval).
// Today's practice (js/daily.js): which levels come back on a day, and in what order. A level missed in a mixed set
// comes the next day, any other a day after a round of it, then 3, 7, 14 and 30 days after each right answer in a
// mixed set; two missed at most, the rest to go over, a level to go over first; a round of one level is study, not a check.
{
  const D = 864e5, now = new Date(2026, 10, 2, 12).getTime(), ans = lv => APP.answer(APP.seeded(7, () => APP.raw(lv)));
  const own = (lv, ago) => ({ id: 'o' + lv + ago, ts: now - ago*D, level: lv, n: 10, firstTry: 9 });
  const e = (lv, ok) => [lv, null, 7, ok === 0 ? '1' : null, ok, ans(lv)];
  const mixed = (ago, t, more) => Object.assign({ id: 'm' + ago + t.length, ts: now - ago*D, level: 'comp', n: t.length, firstTry: t.filter(x => x[4] === 1).length, t }, more);
  const rounds = [own(8, 10), mixed(4, [e(16, 1)]), own(2, 2), own(5, 2),
    mixed(1, [e(9, 0), e(10, 0), e(11, 1), e(12, 1), e(15, -1)]), own(13, 0)];
  const p = APP.dailyPlan(rounds, APP.LEVELS, now), ids = p.items.map(x => x.id);
  const want = [9, 10, 8, 2, 5, 16];
  if(ids.length !== 6 || want.some(id => !ids.includes(id))) throw new Error('daily: picked ' + ids + ', expected ' + want);
  // 11 and 12, right yesterday, wait 3 days; 13, played today, waits for tomorrow; 15 was never reached
  if(p.miss !== 2 || p.items[0].miss || !p.items[1].miss || !p.items[3].miss) throw new Error('daily: misses not two, or not between the levels to go over: ' + JSON.stringify(p.items));
  if(p.items.filter(x => x.miss).some(x => x.seed !== 7 || x.ans === undefined)) throw new Error('daily: a missed level lost the task she missed');
  if(p.done) throw new Error('daily: done before it was played');
  // played today: done, how it went
  const p2 = APP.dailyPlan(rounds.concat(mixed(0, [e(2, 1), e(9, 0)], { level: 'mix', daily: true })), APP.LEVELS, now);
  if(!p2.done || p2.done.got !== 1 || p2.done.n !== 2) throw new Error('daily: today\'s practice not seen as done');
  // a round of a missed level today (study) moves its check to tomorrow; missed twice running, it waits two days
  const p3 = APP.dailyPlan(rounds.concat(own(9, 0), mixed(2, [e(10, 0)])), APP.LEVELS, now);
  if(p3.items.some(x => x.id === 9 || x.id === 10)) throw new Error('daily: 9 (studied today) or 10 (missed twice running) came back today: ' + JSON.stringify(p3.items));
  // under three levels met: nothing to mix yet
  if(APP.dailyPlan([own(2, 2), own(5, 2)], APP.LEVELS, now).items.length) throw new Error('daily: a practice of two levels');
  console.log('daily practice: picks, order, done today, study vs check, too few levels');
}
