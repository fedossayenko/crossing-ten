// Question kind 'mulbr': level 130 (11 − 10) · (11 − 9) — Brackets first, then multiply and divide.
// Level 231 (3rd grade): three brackets multiplied, then a number added (genMulBrPlus, shape 2).

// МБГ Пролет 2025, задача 3: (11 − 10) · (11 − 9) · (11 − 8) − 1 · 2 · 3 — the brackets are 1, 2 and 3,
// so it is 1 · 2 · 3 − 1 · 2 · 3 = 0. Задача 4: (2 · 0 + 2 · 5) : (20 : 2 − 5) − 1 — anything times 0
// is 0, so 10 : 5 − 1 = 1.
import { KIND, SLOT, rnd, tr } from '../js/core.js';
export function genMulBr(){
  if(Math.random() < 0.5){
    for(;;){
      const n = 10 + rnd(11), v = [1 + rnd(3), 2 + rnd(2), 3 + rnd(2)], w = v.slice();
      if(Math.random() < 0.5) w[rnd(3)] -= 1;
      const P = v[0]*v[1]*v[2], p = w[0]*w[1]*w[2];
      if(p < 1 || P - p < 0) continue;
      return {kind:'mulbr', shape:0, n, v, w, P, p, traps:[P], ans: P - p};
    }
  }
  for(;;){
    const a = 2 + rnd(4), b = 2 + rnd(8), X = a*b, ds = [2, 3, 4, 5].filter(d => X % d === 0), D = ds[rnd(ds.length)];
    if(!D) continue;
    const d = 1 + rnd(5), c = a*(D + d), e = rnd(X / D);
    if(c > 60) continue;
    return {kind:'mulbr', shape:1, a, b, X, D, c, d, e, traps:[X / D + a - e], ans: X / D - e};
  }
}
// МБГ Есен 2024 and 2023, 3 клас, задача 2 (level 231, shape 2): (12 − 9) · (12 − 10) · (12 − 11) + 12 = 3 · 2 · 1 + 12 = 18,
// and (3 − 1) · (3 − 2) · (3 − 3) + 1 = 2 · 1 · 0 + 1 = 1: the brackets count down by one, and when the last is 0, so is the product.
export function genMulBrPlus(){
  for(;;){
    const n = 3 + rnd(18), top = 2 + rnd(4), m = 1 + rnd(n);
    if(top > n) continue;
    const v = [top, top - 1, top - 2], P = v[0]*v[1]*v[2], ans = P + m;
    // with a 0 bracket, leaving it out; and adding before multiplying
    const traps = [v[2] ? -1 : v[0]*v[1] + m, v[0]*v[1]*(v[2] + m)].filter((x, i, all) => x >= 0 && x < 1000 && x !== ans && all.indexOf(x) === i);
    return {kind:'mulbr', shape:2, n, v, m, P, traps, ans};
  }
}
const mulBrExpr = q => q.shape === 0 ? q.v.map(x => '(' + q.n + ' − ' + (q.n - x) + ')').join(' · ') + ' − ' + q.w.join(' · ')
  : q.shape === 2 ? q.v.map(x => '(' + q.n + ' − ' + (q.n - x) + ')').join(' · ') + ' + ' + q.m
  : '(' + q.a + ' · 0 + ' + q.a + ' · ' + q.b + ') : (' + q.c + ' : ' + q.a + ' − ' + q.d + ') − ' + q.e;
// two pieces that each stay on one line: the last + or − starts the second
const mulBrParts = q => { const e = mulBrExpr(q), k = e.lastIndexOf(q.shape === 2 ? ' + ' : ' − '); return [e.slice(0, k), e.slice(k + 1)]; };
function drawMulBr(q){
  return '<div class="ask">' + tr('Пресметнете', 'Обчисліть') + '</div>' +
    '<div class="line" style="font-size:clamp(17px,4.8vw,30px)">' + mulBrParts(q).map((t, i) => '<span class="num" style="white-space:nowrap">' + t + (i ? ' = ' + SLOT : '') + '</span>').join(' ') + '</div>';
}
function eqMulBr(q){
  return mulBrExpr(q) + ' = ' + q.ans;
}
function whyMulBr(q, full){
  if(q.shape === 2){
    if(!full) return tr('Първо скобите, после умножението и накрая събирането.', 'Спершу дужки, потім множення і наприкінці додавання.');
    return tr('скобите са ', 'дужки: ') + q.v.join(', ') + ' &nbsp;→&nbsp; ' + q.v.join(' · ') + ' = <b>' + q.P + '</b> &nbsp;→&nbsp; ' + q.P + ' + ' + q.m + ' = ' + q.ans;
  }
  if(!full) return q.shape === 0 ? tr('Първо скобите. После виж кое произведение се вади.', 'Спершу дужки. Потім подивись, який добуток віднімають.')
    : tr('Скобите първо, а в тях — умножението и делението преди събирането и изваждането. По 0 е 0.', 'Спершу дужки, а в них — множення й ділення раніше за додавання й віднімання. На 0 — це 0.');
  if(q.shape === 0) return tr('скобите са ', 'дужки: ') + q.v.join(', ') + ' &nbsp;→&nbsp; ' + q.v.join(' · ') + ' = <b>' + q.P + '</b>, ' + q.w.join(' · ') + ' = <b>' + q.p + '</b> &nbsp;→&nbsp; ' + q.P + ' − ' + q.p + ' = ' + q.ans;
  return q.a + ' · 0 + ' + q.a + ' · ' + q.b + ' = 0 + ' + q.X + ' = <b>' + q.X + '</b>, ' + q.c + ' : ' + q.a + ' − ' + q.d + ' = ' + q.c / q.a + ' − ' + q.d + ' = <b>' + q.D + '</b> &nbsp;→&nbsp; ' + q.X + ' : ' + q.D + ' − ' + q.e + ' = ' + q.ans;
}
KIND.mulbr = { draw:drawMulBr, eq:eqMulBr, why:whyMulBr };
