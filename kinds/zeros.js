// Question kind 'zeros': level 61 … · 0 … — A long expression where every product with a 0 is 0.

// МБГ Есен, 3 клас, задача 3: (2 · 0 + 2 · 5) · (2 + 0 · 2 · 6) − 2 · 0 · 2 · 5. It looks long,
// but every product with a 0 in it is 0, and what is left is (p · q) · p.
// МБГ Есен 2024, 3 клас, задача 3 (shape 'div'): (2 + 0 + 2 + 4) : (2 · 0 + 2 · 4) · 2 − 2 = 8 : 8 · 2 − 2 = 0 —
// the products with a 0 go, then : and · left to right. Есен 2023, задача 4 (shape 'sub'):
// 16 − (20 − 2 · 3) : (2 + 0 · 2 · 3) = 16 − 14 : 2 = 9. Both are drawn after the old question, so a seed
// that asked the old one still does, unless the draw after it turns it into a new shape.
import { KIND, SLOT, rnd, tr } from '../js/core.js';
export function genZeros(){
  for(;;){
    const p = 2 + rnd(4), q = 2 + rnd(8), r = 2 + rnd(8);
    const ans = p*q*p;
    if(ans > 200) continue;
    // treating the 0 as if it were not there: the slip this task is built to catch
    const noZero = (p + p*q)*(p + p*r) - p*p*q;
    const old = {kind:'zeros', p, q, r, f1: Math.random() < 0.3, f2: Math.random() < 0.3, f3: Math.random() < 0.4, ans,
            traps: [noZero, p*q].filter(v => v >= 0 && v < 1000 && v !== ans)};
    const w = Math.random();
    return w < 0.25 ? genZerosDiv() : w < 0.5 ? genZerosSub() : old;
  }
}
const wholeTraps = (ans, vs) => vs.filter((v, i) => Number.isInteger(v) && v >= 0 && v !== ans && vs.indexOf(v) === i);
// (a + 0 + b + c) : (e · 0 + e · f) · g − h: the first bracket is k times the second
function genZerosDiv(){
  for(;;){
    const e = 2 + rnd(4), f = 2 + rnd(4), P = e*f, k = 1 + rnd(2), S = k*P;
    const a = 1 + rnd(9), b = 1 + rnd(9), c = S - a - b;
    if(c < 1 || c > 9) continue;
    const g = 2 + rnd(4), h = rnd(k*g + 1), ans = k*g - h;
    // multiplying before dividing, and e · 0 read as e
    return {kind:'zeros', shape:'div', a, b, c, e, f, g, h, S, P, k, ans, traps: wholeTraps(ans, [S / (P*g) - h, S / (e + P)*g - h])};
  }
}
// N − (A − b · c) : (b + 0 · b · c): the first bracket is t times b
function genZerosSub(){
  const b = 2 + rnd(4), c = 2 + rnd(8), t = 1 + rnd(9), A = b*(c + t), N = t + rnd(20), ans = N - t;
  // subtracting before dividing, and forgetting to divide
  return {kind:'zeros', shape:'sub', b, c, t, A, N, ans, traps: wholeTraps(ans, [(N - b*t) / b, N - b*t])};
}
export function zerosExpr(q){
  if(q.shape === 'div') return '(' + q.a + ' + 0 + ' + q.b + ' + ' + q.c + ') : (' + q.e + ' · 0 + ' + q.e + ' · ' + q.f + ') · ' + q.g + ' − ' + q.h;
  if(q.shape === 'sub') return q.N + ' − (' + q.A + ' − ' + q.b + ' · ' + q.c + ') : (' + q.b + ' + 0 · ' + q.b + ' · ' + q.c + ')';
  const b1 = q.f1 ? q.p + ' · ' + q.q + ' + ' + q.p + ' · 0' : q.p + ' · 0 + ' + q.p + ' · ' + q.q;
  const b2 = q.f2 ? '0 · ' + q.p + ' · ' + q.r + ' + ' + q.p : q.p + ' + 0 · ' + q.p + ' · ' + q.r;
  const last = q.f3 ? q.p + ' · ' + q.q + ' · 0 · ' + q.p : q.p + ' · 0 · ' + q.p + ' · ' + q.q;
  return '(' + b1 + ') · (' + b2 + ') − ' + last;
}
// a new shape breaks only after its division sign, if it must break at all
const zerosLine = q => !q.shape ? zerosExpr(q) : zerosExpr(q).split(' : (').map((s, i) => '<span style="white-space:nowrap">' + (i ? '(' + s : s + ' :') + '</span>').join(' ');
function drawZeros(q){
  return '<div class="ask">' + tr('Пресметнете', 'Обчисліть') + '</div>' +
    '<div class="given">' + zerosLine(q) + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqZeros(q){
  if(q.shape) return zerosExpr(q) + ' = ' + q.ans;
  return '(' + q.p*q.q + ') · (' + q.p + ') − 0 = ' + q.ans;
}
function whyZeros(q, full){
  // no digit in these first hints: their answer may be 0, and the hint must not look like it gives it away
  if(q.shape === 'div'){
    if(!full) return tr('Първо скобите — произведение с нула е нула. После делението и умножението, отляво надясно, и накрая изваждането.',
                        'Спершу дужки — добуток із нулем дорівнює нулю. Потім ділення й множення, зліва направо, і наприкінці віднімання.');
    return q.e + ' · 0 = <b>0</b> &nbsp;→&nbsp; (' + q.a + ' + 0 + ' + q.b + ' + ' + q.c + ') : (0 + ' + q.P + ') · ' + q.g + ' − ' + q.h + ' = ' +
      q.S + ' : ' + q.P + ' · ' + q.g + ' − ' + q.h + ' = ' + q.k + ' · ' + q.g + ' − ' + q.h + ' = ' + q.k*q.g + ' − ' + q.h + ' = ' + q.ans;
  }
  if(q.shape === 'sub'){
    if(!full) return tr('Първо скобите: в тях умножението е първо, а с нула то е нула. После делението и накрая изваждането.',
                        'Спершу дужки: у них насамперед множення, а з нулем воно дорівнює нулю. Потім ділення і наприкінці віднімання.');
    return '0 · ' + q.b + ' · ' + q.c + ' = <b>0</b> &nbsp;→&nbsp; ' + q.N + ' − (' + q.A + ' − ' + q.b*q.c + ') : (' + q.b + ' + 0) = ' +
      q.N + ' − ' + (q.A - q.b*q.c) + ' : ' + q.b + ' = ' + q.N + ' − ' + q.t + ' = ' + q.ans;
  }
  if(!full) return tr('Всяко произведение, в което има 0, е равно на 0.', 'Кожен добуток, у якому є 0, дорівнює 0.');
  return tr('произведенията с 0 са 0', 'добутки з 0 дорівнюють 0') + ' &nbsp;→&nbsp; (0 + ' + q.p*q.q + ') · (' + q.p + ' + 0) − 0 = ' +
    q.p*q.q + ' · ' + q.p + ' = ' + q.ans;
}
KIND.zeros = { draw:drawZeros, eq:eqZeros, why:whyZeros };
