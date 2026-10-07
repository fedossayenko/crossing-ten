// Question kind 'mulmix': level 59 20 − 2 · 5 — Multiplication first, then + and − left to right.

// МБГ Есен, 3 клас, задача 1: 20 − 2 · 5 + 20 − 2 · 6. Worked straight through from the left
// it comes out wrong: the two products go first. traps: what the left-to-right slip gives.
// МБГ Есен 2024 and 2023, 3 клас, задача 1 (shape 'zero'): 7 − 3 · 2 − 2 · 0 + 2 · 4 and 20 − 2 · 3 − 2 · 0 + 2 · 3:
// three products, one of them by 0, so 7 − 6 − 0 + 8 = 9 and 20 − 6 − 0 + 6 = 20. It is drawn after the old
// question, so a seed that asked the old one still does, unless this draw turns it into the new shape.
import { KIND, SLOT, rnd, tr } from '../js/core.js';
export function genMulMix(){
  for(;;){
    const a = 10 + rnd(31), b = 2 + rnd(4), c = 2 + rnd(8), d = 2 + rnd(8);
    const e = Math.random() < 0.6 ? a : 10 + rnd(31);      // the paper's shape repeats the first number
    if(c === d || a - b*c < 0 || e - b*d < 0) continue;
    const ans = a - b*c + e - b*d, ltr = ((a - b)*c + e - b)*d;
    const q = {kind:'mulmix', a, b, c, d, e, ans, traps: ltr >= 0 && ltr < 1000 && ltr !== ans ? [ltr] : []};
    return Math.random() < 0.3 ? genMulZero() : q;
  }
}
// a − b · c − z · 0 + e · f: the product by 0 is 0, and every product goes before the − and +
function genMulZero(){
  for(;;){
    const a = 5 + rnd(21), b = 2 + rnd(4), c = 2 + rnd(4), z = 2 + rnd(4), e = 2 + rnd(4), f = 2 + rnd(4);
    if(a - b*c < 0) continue;
    const ans = a - b*c + e*f;
    // z · 0 read as z; and the line worked left to right, where the · 0 wipes out everything before it
    const traps = [a - b*c - z + e*f, e*f].filter((v, i, all) => v >= 0 && v !== ans && all.indexOf(v) === i);
    return {kind:'mulmix', shape:'zero', a, b, c, z, e, f, ans, traps};
  }
}
export const mulMixExpr = q => q.shape === 'zero' ? q.a + ' − ' + q.b + ' · ' + q.c + ' − ' + q.z + ' · 0 + ' + q.e + ' · ' + q.f
  : q.a + ' − ' + q.b + ' · ' + q.c + ' + ' + q.e + ' − ' + q.b + ' · ' + q.d;
function drawMulMix(q){
  return '<div class="ask">' + tr('Пресметнете', 'Обчисліть') + '</div>' +
    '<div class="given">' + mulMixExpr(q) + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqMulMix(q){
  return mulMixExpr(q) + ' = ' + q.ans;
}
function whyMulMix(q, full){
  if(q.shape === 'zero'){
    if(!full) return tr('Първо умноженията — произведение с нула е нула. После събирането и изваждането отляво надясно.',
                        'Спершу множення — добуток із нулем дорівнює нулю. Потім додавання й віднімання зліва направо.');
    return q.b + ' · ' + q.c + ' = <b>' + q.b*q.c + '</b>, &nbsp;' + q.z + ' · 0 = <b>0</b>, &nbsp;' + q.e + ' · ' + q.f + ' = <b>' + q.e*q.f + '</b> &nbsp;→&nbsp; ' +
      q.a + ' − ' + q.b*q.c + ' − 0 + ' + q.e*q.f + ' = ' + q.ans;
  }
  if(!full) return tr('Първо умножението, после събирането и изваждането отляво надясно.',
                      'Спершу множення, потім додавання й віднімання зліва направо.');
  return q.b + ' · ' + q.c + ' = <b>' + q.b*q.c + '</b>, &nbsp;' + q.b + ' · ' + q.d + ' = <b>' + q.b*q.d + '</b> &nbsp;→&nbsp; ' +
    q.a + ' − ' + q.b*q.c + ' + ' + q.e + ' − ' + q.b*q.d + ' = ' + q.ans;
}
KIND.mulmix = { draw:drawMulMix, eq:eqMulMix, why:whyMulMix };
