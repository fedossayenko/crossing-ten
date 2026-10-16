// Question kind 'brackets': level 99 86 − (51 − 5) — Brackets first — or see what they take away; level 275 Една скоба.

// МБГ Зима 2023, задачи 1 и 3. 86 − (51 − 5): the bracket first, 86 − 46 = 40 — taking away
// 51 − 5 is taking away 51 and giving 5 back. (100 − 71) − (100 − 81) − (100 − 91): each bracket
// is how far a number is short of 100, so 29 − 19 − 9 = 1.
import { KIND, SLOT, rnd, shuffle, tr } from '../js/core.js';
export function genBrackets(){
  if(Math.random() < 0.12){
    // Коледно 2023, задача 2: (100 − 57) + 0 − (96 − 78). Each bracket first, and the + 0 changes
    // nothing: 43 + 0 − 18 = 25.
    for(;;){
      const a = Math.random() < 0.5 ? 100 : 60 + rnd(40), b = 21 + rnd(a - 30), c = 40 + rnd(60), d = 11 + rnd(c - 20);
      if((a - b) - (c - d) < 1) continue;          // the hint names the 0, so the answer is never 0
      return {kind:'brackets', shape:6, a, b, c, d, ans: (a - b) - (c - d)};
    }
  }
  if(Math.random() < 0.15){
    // МБГ Пролет 2025, задача 1: 111 − (111 − 89) + 22 − 100. The bracket takes away 111 and gives back
    // 89, so what is left of 111 is 89: 89 + 22 − 100 = 11.
    for(;;){
      const a = 101 + rnd(49), b = 51 + rnd(45), c = 100 - b + 2 + rnd(30), d = 100;
      if(b + c - d < 1 || c > 60) continue;
      return {kind:'brackets', shape:5, a, b, c, d, ans: b + c - d};
    }
  }
  if(Math.random() < 0.2){
    // Коледно 2024, задача 6: (31 + 19) + (78 − 40) − (28 + 22 − 19) — two of the brackets make
    // a round ten on sight, so 50 + 38 − 31 = 57
    for(;;){
      const a = 11 + rnd(40), b = 10*(3 + rnd(4)) - a, c = 40 + rnd(55), d = 10*(1 + rnd(Math.floor(c / 10) - 1));
      const e = 11 + rnd(30), f = 10*(3 + rnd(3)) - e, g = 5 + rnd(25);
      const ans = (a + b) + (c - d) - (e + f - g);
      if(b < 5 || f < 5 || ans < 0 || ans > 99) continue;
      return {kind:'brackets', shape:4, a, b, c, d, e, f, g, ans};
    }
  }
  if(Math.random() < 0.25){
    // Зима 2021: (100 − 94) − (99 − 98) − (98 − 96) − (96 − 94) — each bracket a small gap
    for(;;){
      const k = 3 + rnd(2), gs = [], hi = 60 + rnd(41);
      const first = [hi, hi - 4 - rnd(5)];
      let x = hi - 1 - rnd(2);
      for(let i = 0; i < k - 1; i++){ const d = 1 + rnd(3); gs.push([x, x - d]); x -= d; }
      const ans = (first[0] - first[1]) - gs.reduce((t, [a, b]) => t + a - b, 0);
      if(ans < 0) continue;
      return {kind:'brackets', shape:3, first, gs, ans};
    }
  }
  if(Math.random() < 0.3){
    // Зима 2022: (15 − 5 − 4 − 3 − 2 − 1) + (1 + 2 + 3 + 4 + 5) — what the first bracket takes
    // away, the second gives back, so the answer is the first number
    const k = 3 + rnd(3), xs = [];
    for(let i = 1; i <= k; i++) xs.push(i);
    const N = xs.reduce((a, b) => a + b, 0) + rnd(10), down = xs.slice().reverse(), up = Math.random() < 0.7 ? xs : shuffle(xs.slice());
    return {kind:'brackets', shape:2, N, down, up, ans: N};
  }
  for(;;){
    if(Math.random() < 0.5){
      const b = 21 + rnd(60), c = 2 + rnd(Math.min(20, b - 12)), a = b - c + 5 + rnd(99 - b + c - 5);
      if(a > 99) continue;
      return {kind:'brackets', shape:0, a, b, c, inner: b - c, ans: a - (b - c)};
    }
    // three numbers under 100, each bracket what is left to 100; the first the biggest
    const xs = [51, 61, 71, 81, 91, 55, 65, 75, 85, 95, 62, 72, 82, 92];
    const pick = shuffle(xs.slice()).slice(0, 3).sort((x, y) => x - y), gaps = pick.map(x => 100 - x);
    const ans = gaps[0] - gaps[1] - gaps[2];
    if(ans < 0) continue;
    return {kind:'brackets', shape:1, xs: pick, gaps, ans};
  }
}
// Level 275 Една скоба: short expressions of two-digit numbers, worked the way a 2nd-grader's school paper asks them.
// Аз и числата 2026, задача 4: 36 + (92 − 74), 100 − (53 − 18), (27 + 14) + (71 − 38). Аз и числата 2022, задача 3:
// 94 − 34 + (8 + 12), 71 + (23 − 9), 51 + 19 − 28, (12 + 15) − 11, 66 + 15 − 14. q.t is the expression: its terms in
// order, each a number {s, n} or a bracket {s, br:[a, op, b]}, s the sign before it ('' for the first); the shape names
// the pattern, n a number and b a bracket. Every bracket and every step from the left stays within 0…100.
// Аз и числата 2024, задача 1 (shape 'three'): 27 + 59 + 13 «по лесен начин» — 27 and 13 make 40, then 40 + 59 = 99.
// Аз и числата 2025, задача 8 (shape 'gt'): the sum 27 + 18 + 36 = 81 is bigger than which of 91, 80 and 81? — 80; 81 is
// the sum itself, not smaller than it, and 91 is bigger.
const SB_SHAPES = ['nb', 'bn', 'bb', 'nnb', 'nnn'], SB_ALL = { nb:1, bn:1, bb:1, nnb:1, nnn:1, three:1, gt:1 };
const sbNum = () => Math.random() < 0.15 ? 2 + rnd(8) : 10 + rnd(90);
const sbOp = () => Math.random() < 0.5 ? '+' : '−';
const sbVal = t => t.br ? (t.br[1] === '+' ? t.br[0] + t.br[2] : t.br[0] - t.br[2]) : t.n;
export function genBracketsShort(){
  const w = Math.random();
  if(w < 0.15){
    for(;;){
      // a pair whose ones make ten, and a third number that makes a round ten with neither
      const k = 3 + rnd(4), p = 11 + rnd(10*k - 21), q2 = 10*k - p, r = 11 + rnd(89 - 10*k);
      if(p % 10 === 0 || r % 10 === 0 || (p + r) % 10 === 0 || (q2 + r) % 10 === 0 || q2 < 11) continue;
      const at = rnd(3), xs = at === 0 ? [r, p, q2] : at === 1 ? [p, r, q2] : [p, q2, r], pair = at === 0 ? [1, 2] : at === 1 ? [0, 2] : [0, 1];
      if(at === 2 && Math.random() < 0.7) continue;               // the pair side by side is no trick: mostly apart, as on the paper
      return {kind:'brackets', shape:'three', xs, pair, ans: p + q2 + r};
    }
  }
  if(w < 0.3){
    for(;;){
      const xs = [11 + rnd(40), 11 + rnd(40), 11 + rnd(40)], S = xs[0] + xs[1] + xs[2];
      if(S > 99 || xs[0] % 10 + xs[1] % 10 + xs[2] % 10 < 10) continue;   // the ones carry, as in 27 + 18 + 36
      const below = S - (Math.random() < 0.6 ? 1 : 10), above = S + (Math.random() < 0.5 ? 10 : 1);
      if(above > 99) continue;
      const list = shuffle([below, S, above]);
      return {kind:'brackets', shape:'gt', xs, S, list, traps:[S, above], ans: below};
    }
  }
  const shape = SB_SHAPES[rnd(SB_SHAPES.length)];
  for(;;){
    const t = shape.split('').map((c, i) => c === 'b' ? {s: i ? sbOp() : '', br:[sbNum(), sbOp(), sbNum()]} : {s: i ? sbOp() : '', n: sbNum()});
    if(shape === 'nb' && t[1].s === '−' && Math.random() < 0.3) t[0].n = 100;    // 100 − (53 − 18)
    let v = 0, ok = true;
    t.forEach(x => {
      const b = sbVal(x);
      if(b < 1 || b > 100) ok = false;
      v = x.s === '−' ? v - b : v + b;
      if(v < 0 || v > 100) ok = false;
    });
    if(!ok || v < 1 || !t.some(x => x.br && x.br[1] === '−') && shape !== 'nnn' && Math.random() < 0.5) continue;
    return {kind:'brackets', shape, t, ans: v};
  }
}
const sbTerm = x => (x.s ? x.s + ' ' : '') + (x.br ? '(' + x.br.join(' ') + ')' : x.n);
const sbExpr = q => q.shape === 'three' || q.shape === 'gt' ? q.xs.join(' + ') : q.t.map(sbTerm).join(' ');
function drawBracketsShort(q){
  if(q.shape === 'gt'){
    const n = v => '<span class="num">' + v + '</span>', L = q.list.map(n);
    return '<div class="ask">' + tr('Сборът на числата ' + n(sbExpr(q)) + ' е по-голям от едно от числата ' + L[0] + ', ' + L[1] + ' и ' + L[2] + '. От кое?',
      'Сума чисел ' + n(sbExpr(q)) + ' більша за одне з чисел ' + L[0] + ', ' + L[1] + ' і ' + L[2] + '. За яке?') + '</div>' +
      '<div class="line xl">' + SLOT + '</div>';
  }
  return '<div class="ask">' + (q.shape === 'three' ? tr('Пресметни по лесен начин.', 'Обчисли зручним способом.') : tr('Пресметни.', 'Обчисли.')) + '</div>' +
    '<div class="line" style="font-size:clamp(24px,7vw,42px)"><span class="num">' + sbExpr(q) + '</span> = ' + SLOT + '</div>';
}
function whyBracketsShort(q, full){
  if(q.shape === 'three'){
    const [i, j] = q.pair, k = 3 - i - j, x = q.xs;
    if(!full) return tr('Кои две събираеми правят кръгло число? Събери първо тях.', 'Які два доданки дають кругле число? Додай спершу їх.');
    return '(' + x[i] + ' + ' + x[j] + ') + ' + x[k] + ' = <b>' + (x[i] + x[j]) + '</b> + ' + x[k] + ' = ' + q.ans;
  }
  if(q.shape === 'gt'){
    if(!full) return tr('Първо пресметни сбора. После: по-голям значи, че числото е по-малко от сбора — а не равно на него.', 'Спершу обчисли суму. Потім: більша — отже, число менше від суми, а не дорівнює їй.');
    return q.xs.join(' + ') + ' = <b>' + q.S + '</b> &nbsp;→&nbsp; ' + q.list.map(v => v + (v < q.S ? ' &lt; ' : v === q.S ? ' = ' : ' &gt; ') + q.S).join(', ') +
      ' &nbsp;→&nbsp; ' + q.S + ' &gt; ' + q.ans;
  }
  if(!full) return q.t.some(x => x.br) ? tr('Първо сметките в скобите, после отляво надясно.', 'Спершу обчисли в дужках, потім зліва направо.')
                                        : tr('Отляво надясно, една сметка след друга.', 'Зліва направо, дію за дією.');
  const steps = q.t.filter(x => x.br).map(x => x.br.join(' ') + ' = <b>' + sbVal(x) + '</b>');
  const flat = q.t.map((x, i) => (i ? x.s + ' ' : '') + sbVal(x)).join(' ');
  return (steps.length ? steps.join(', ') + ' &nbsp;→&nbsp; ' : '') + flat + ' = ' + q.ans;
}
export const bracketsExpr = q => SB_ALL[q.shape] ? sbExpr(q) : q.shape === 6 ? '(' + q.a + ' − ' + q.b + ') + 0 − (' + q.c + ' − ' + q.d + ')' : q.shape === 5 ? q.a + ' − (' + q.a + ' − ' + q.b + ') + ' + q.c + ' − ' + q.d : q.shape === 4 ? '(' + q.a + ' + ' + q.b + ') + (' + q.c + ' − ' + q.d + ') − (' + q.e + ' + ' + q.f + ' − ' + q.g + ')' : q.shape === 3 ? [q.first].concat(q.gs).map(([a, b]) => '(' + a + ' − ' + b + ')').join(' − ') : q.shape === 2 ? '(' + [q.N].concat(q.down).join(' − ') + ') + (' + q.up.join(' + ') + ')' : q.shape === 0 ? q.a + ' − (' + q.b + ' − ' + q.c + ')' : q.xs.map(x => '(100 − ' + x + ')').join(' − ');
function drawBrackets(q){
  if(SB_ALL[q.shape]) return drawBracketsShort(q);
  return '<div class="ask">' + tr('Пресметнете', 'Обчисліть') + '</div>' +
    '<div class="line" style="font-size:clamp(24px,7vw,42px)"><span class="num">' + bracketsExpr(q) + '</span> = ' + SLOT + '</div>';
}
function eqBrackets(q){
  if(q.shape === 'gt') return bracketsExpr(q) + ' = ' + q.S + ' > ' + q.ans;
  return bracketsExpr(q) + ' = ' + q.ans;
}
function whyBrackets(q, full){
  if(SB_ALL[q.shape]) return whyBracketsShort(q, full);
  if(q.shape === 6){
    if(!full) return tr('Първо сметките в скобите. Какво прави + 0?', 'Спершу обчисли в дужках. Що змінює + 0?');
    return q.a + ' − ' + q.b + ' = <b>' + (q.a - q.b) + '</b>, ' + q.c + ' − ' + q.d + ' = <b>' + (q.c - q.d) + '</b> &nbsp;→&nbsp; ' + (q.a - q.b) + ' + 0 − ' + (q.c - q.d) + ' = ' + q.ans;
  }
  if(q.shape === 5){
    if(!full) return tr('От числото се вади скоба, в която стои същото число. Какво остава от него?', 'Від числа віднімають дужку, у якій стоїть те саме число. Що від нього залишається?');
    return q.a + ' − (' + q.a + ' − ' + q.b + ') = <b>' + q.b + '</b> &nbsp;→&nbsp; ' + q.b + ' + ' + q.c + ' − ' + q.d + ' = ' + q.ans;
  }
  if(q.shape === 4){
    if(!full) return tr('Всяка скоба поотделно — в две от тях числата се допълват до кръгли десетици.', 'Кожну дужку окремо — у двох із них числа доповнюють одне одного до круглих десятків.');
    const x = q.a + q.b, y = q.c - q.d, z = q.e + q.f - q.g;
    return q.a + ' + ' + q.b + ' = <b>' + x + '</b>, ' + q.c + ' − ' + q.d + ' = <b>' + y + '</b>, ' + q.e + ' + ' + q.f + ' − ' + q.g + ' = <b>' + z + '</b> &nbsp;→&nbsp; ' + x + ' + ' + y + ' − ' + z + ' = ' + q.ans;
  }
  if(q.shape === 3){
    if(!full) return tr('Всяка скоба е малко число — пресметни ги поотделно.', 'Кожна дужка — маленьке число, обчисли їх окремо.');
    const v = [q.first].concat(q.gs).map(([a, b]) => a - b);
    return [q.first].concat(q.gs).map(([a, b], i) => a + ' − ' + b + ' = <b>' + v[i] + '</b>').join(', ') + ' &nbsp;→&nbsp; ' + v.join(' − ') + ' = ' + q.ans;
  }
  if(q.shape === 2){
    if(!full) return tr('Сравни какво вади първата скоба с това, което събира втората.', 'Порівняй, що віднімає перша дужка, з тим, що додає друга.');
    return tr('първата скоба вади ', 'перша дужка віднімає ') + q.down.join(' + ') + tr(', втората ги връща обратно', ', друга їх повертає') + ' &nbsp;→&nbsp; ' + q.N + ' − ' + q.down.reduce((a, b) => a + b) + ' + ' + q.down.reduce((a, b) => a + b) + ' = ' + q.ans;
  }
  if(!full) return q.shape === 0 ? tr('Първо сметката в скобите.', 'Спершу обчисли в дужках.')
                                 : tr('Всяка скоба е колко не достига до 100.', 'Кожна дужка — скільки бракує до 100.');
  if(q.shape === 0) return q.b + ' − ' + q.c + ' = <b>' + q.inner + '</b> &nbsp;→&nbsp; ' + q.a + ' − ' + q.inner + ' = ' + q.ans;
  return q.xs.map((x, i) => '100 − ' + x + ' = <b>' + q.gaps[i] + '</b>').join(', ') + ' &nbsp;→&nbsp; ' + q.gaps.join(' − ') + ' = ' + q.ans;
}
KIND.brackets = { draw:drawBrackets, eq:eqBrackets, why:whyBrackets };
