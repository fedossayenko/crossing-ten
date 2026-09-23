// Question kind 'digineq': level 68 Числото A — The one three-digit number from given digits that makes an inequality true.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Есен, 3 клас, задача 10: A is made of two digits 1 and one digit 2, and 300 − A < A − 100.
// Only three numbers can be A — 112, 121, 211 — and trying each shows that only 211 works
// (the inequality says A is past the middle of 100 and 300).
function digIneqCands(a, b){
  return [...new Set([100*a + 10*a + b, 100*a + 10*b + a, 100*b + 10*a + a])].sort((x, y) => x - y);
}
// holds: c − A < A − d (more) or c − A > A − d (not more)
const digIneqHolds = (q, A) => q.more ? q.c - A < A - q.d : q.c - A > A - q.d;
function genDigIneq(){
  for(;;){
    const a = 1 + rnd(9), b = 1 + rnd(9);
    if(a === b) continue;
    const cand = digIneqCands(a, b), more = Math.random() < 0.6;
    // a middle m (a whole ten) with exactly one number past it, or exactly one short of it
    const lo = more ? cand[1] : cand[0], hi = more ? cand[2] : cand[1];
    const ms = [];
    for(let m = Math.ceil((lo + 1) / 10) * 10; m < hi; m += 10) ms.push(m);
    if(!ms.length) continue;
    const m = ms[rnd(ms.length)], t0 = Math.max(cand[2] - m, m - cand[0]);
    const t = Math.ceil(t0 / 50) * 50 + 50*rnd(2);             // round numbers, and no difference below 0
    const c = m + t, d = m - t;
    if(d < 1) continue;
    const q = {kind:'digineq', a, b, cand, more, c, d};
    const ok = cand.filter(A => digIneqHolds(q, A));
    if(ok.length !== 1) continue;
    q.ans = ok[0];
    q.traps = cand.filter(A => A !== q.ans);
    return q;
  }
}
const digIneqText = q => q.c + ' − A ' + (q.more ? '&lt;' : '&gt;') + ' A − ' + q.d;
function drawDigIneq(q){
  if(q.kind === 'digineq'){
    return '<div class="ask">' + tr('Кое е трицифреното число <b>A</b>, съставено от две цифри <span class="num">' + q.a +
      '</span> и една цифра <span class="num">' + q.b + '</span>, такова, че <span class="num">' + digIneqText(q) + '</span>?',
      'Яке тризначне число <b>A</b>, складене з двох цифр <span class="num">' + q.a + '</span> та однієї цифри <span class="num">' + q.b +
      '</span>, таке, що <span class="num">' + digIneqText(q) + '</span>?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">A = ' + SLOT + '</div>';
  }
}
function eqDigIneq(q){
  if(q.kind === 'digineq') return 'A = ' + q.ans + ': ' + (q.c - q.ans) + (q.more ? ' &lt; ' : ' &gt; ') + (q.ans - q.d);
}
function whyDigIneq(q, full){
  if(q.kind === 'digineq'){
    if(!full) return tr('A може да е само едно от ' + q.cand.length + ' числа — пробвай всяко.', 'A може бути лише одним із ' + q.cand.length + ' чисел — спробуй кожне.');
    return q.cand.map(A => A + ': ' + (q.c - A) + (q.more ? ' &lt; ' : ' &gt; ') + (A - q.d) + ' ' + (digIneqHolds(q, A) ? '✓' : '✗')).join(', &nbsp;') +
      ' &nbsp;→&nbsp; A = ' + q.ans;
  }
}
KIND.digineq = { draw:drawDigIneq, eq:eqDigIneq, why:whyDigIneq };
