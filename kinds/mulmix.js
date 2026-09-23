// Question kind 'mulmix': level 59 20 − 2 · 5 — Multiplication first, then + and − left to right.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Есен, 3 клас, задача 1: 20 − 2 · 5 + 20 − 2 · 6. Worked straight through from the left
// it comes out wrong: the two products go first. traps: what the left-to-right slip gives.
function genMulMix(){
  for(;;){
    const a = 10 + rnd(31), b = 2 + rnd(4), c = 2 + rnd(8), d = 2 + rnd(8);
    const e = Math.random() < 0.6 ? a : 10 + rnd(31);      // the paper's shape repeats the first number
    if(c === d || a - b*c < 0 || e - b*d < 0) continue;
    const ans = a - b*c + e - b*d, ltr = ((a - b)*c + e - b)*d;
    return {kind:'mulmix', a, b, c, d, e, ans, traps: ltr >= 0 && ltr < 1000 && ltr !== ans ? [ltr] : []};
  }
}
const mulMixExpr = q => q.a + ' − ' + q.b + ' · ' + q.c + ' + ' + q.e + ' − ' + q.b + ' · ' + q.d;
function drawMulMix(q){
  if(q.kind === 'mulmix'){
    return '<div class="ask">' + tr('Пресметнете', 'Обчисліть') + '</div>' +
      '<div class="given">' + mulMixExpr(q) + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqMulMix(q){
  if(q.kind === 'mulmix') return mulMixExpr(q) + ' = ' + q.ans;
}
function whyMulMix(q, full){
  if(q.kind === 'mulmix'){
    if(!full) return tr('Първо умножението, после събирането и изваждането отляво надясно.',
                        'Спершу множення, потім додавання й віднімання зліва направо.');
    return q.b + ' · ' + q.c + ' = <b>' + q.b*q.c + '</b>, &nbsp;' + q.b + ' · ' + q.d + ' = <b>' + q.b*q.d + '</b> &nbsp;→&nbsp; ' +
      q.a + ' − ' + q.b*q.c + ' + ' + q.e + ' − ' + q.b*q.d + ' = ' + q.ans;
  }
}
KIND.mulmix = { draw:drawMulMix, eq:eqMulMix, why:whyMulMix };
