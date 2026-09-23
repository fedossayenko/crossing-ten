// Question kind 'zeros': level 61 … · 0 … — A long expression where every product with a 0 is 0.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Есен, 3 клас, задача 3: (2 · 0 + 2 · 5) · (2 + 0 · 2 · 6) − 2 · 0 · 2 · 5. It looks long,
// but every product with a 0 in it is 0, and what is left is (p · q) · p.
function genZeros(){
  for(;;){
    const p = 2 + rnd(4), q = 2 + rnd(8), r = 2 + rnd(8);
    const ans = p*q*p;
    if(ans > 200) continue;
    // treating the 0 as if it were not there: the slip this task is built to catch
    const noZero = (p + p*q)*(p + p*r) - p*p*q;
    return {kind:'zeros', p, q, r, f1: Math.random() < 0.3, f2: Math.random() < 0.3, f3: Math.random() < 0.4, ans,
            traps: [noZero, p*q].filter(v => v >= 0 && v < 1000 && v !== ans)};
  }
}
function zerosExpr(q){
  const b1 = q.f1 ? q.p + ' · ' + q.q + ' + ' + q.p + ' · 0' : q.p + ' · 0 + ' + q.p + ' · ' + q.q;
  const b2 = q.f2 ? '0 · ' + q.p + ' · ' + q.r + ' + ' + q.p : q.p + ' + 0 · ' + q.p + ' · ' + q.r;
  const last = q.f3 ? q.p + ' · ' + q.q + ' · 0 · ' + q.p : q.p + ' · 0 · ' + q.p + ' · ' + q.q;
  return '(' + b1 + ') · (' + b2 + ') − ' + last;
}
function drawZeros(q){
  if(q.kind === 'zeros'){
    return '<div class="ask">' + tr('Пресметнете', 'Обчисліть') + '</div>' +
      '<div class="given">' + zerosExpr(q) + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqZeros(q){
  if(q.kind === 'zeros') return '(' + q.p*q.q + ') · (' + q.p + ') − 0 = ' + q.ans;
}
function whyZeros(q, full){
  if(q.kind === 'zeros'){
    if(!full) return tr('Всяко произведение, в което има 0, е равно на 0.', 'Кожен добуток, у якому є 0, дорівнює 0.');
    return tr('произведенията с 0 са 0', 'добутки з 0 дорівнюють 0') + ' &nbsp;→&nbsp; (0 + ' + q.p*q.q + ') · (' + q.p + ' + 0) − 0 = ' +
      q.p*q.q + ' · ' + q.p + ' = ' + q.ans;
  }
}
KIND.zeros = { draw:drawZeros, eq:eqZeros, why:whyZeros };
