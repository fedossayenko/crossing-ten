// Question kind 'fruiteq': level 29 Плодове — Three fruit, three totals — find one from the others.
// Level 233 (3rd grade): two flowers, two lines with counts (genFlowerEq, shapes 'sum' and 'diff').
import { KIND, SLOT, fruitBody, rnd, shuffle, tr } from '../js/core.js';

export const ic = t => '<svg class="ic" viewBox="-11 -14 22 26" aria-hidden="true">' + fruitBody(t) + '</svg>';

// Задача 9: three totals, three fruit. The third equation contains the first, which
// is the way in — no guessing, just substitution.
// Задача 20: four fruit in a square — two rows and two columns, each with its own total.
// Four facts for four unknowns, and only one set of values fits them all.
function genGrid(){
  for(;;){
    const f = shuffle(['a','p','l','g']);                // top-left, top-right, bottom-left, bottom-right
    const A = 3 + rnd(8), B = 3 + rnd(8), D = 1 + rnd(6), C = D + 1 + rnd(7);
    const v = [A, B, C, D];
    if(new Set(v).size !== 4) continue;                  // four different values, so no two fruit can be swapped
    const signs = [1].concat(shuffle([1, -1, -1]));      // the first term is never negative
    const ask = v.reduce((t, x, i) => t + signs[i]*x, 0);
    if(ask < 1) continue;
    return {kind:'fruiteq', grid:1, f, A, B, C, D, signs,
            R1: A + B, R2: C - D, C1: A + C, C2: B + D, ans: ask};
  }
}
// Зима 2020: ● + ○ = 9, ○ + ■ = 15, ■ + ● = 8 — each figure is counted twice across the three
// lines, so ● + ○ + ■ is half of 9 + 15 + 8 = 16
function genPairTotals(){
  for(;;){
    const x = 1 + rnd(9), y = 1 + rnd(9), z = 1 + rnd(9);
    if(x === y || y === z || x === z) continue;
    return {kind:'fruiteq', tri:1, x, y, z, s1: x + y, s2: y + z, s3: z + x, ans: x + y + z};
  }
}
export function genFruitEq(){
  if(Math.random() < 0.2) return genPairTotals();
  if(Math.random() < 0.35) return genGrid();
  for(;;){
    const f = shuffle(['a','p','l','g']).slice(0, 3);
    const a = 3 + rnd(8), b = 1 + rnd(8), c = 3 + rnd(9);
    if(a === b || a === c || b === c) continue;          // one value per fruit
    if(a + b > 18 || a + c > 18 || a + b + c > 26) continue;
    const pairs = [[0, 1, a - b], [2, 0, c - a], [2, 1, c - b]].filter(x => x[2] > 0);
    if(!pairs.length) continue;
    const askd = pairs[rnd(pairs.length)];
    return {kind:'fruiteq', f, a, b, c, s1: a + b, s2: a + c, s3: a + b + c,
            askd, ans: askd[2]};
  }
}

// МБГ Есен 2024, 3 клас, задача 6 (level 233, shape 'sum'): 4 · ❀ + 3 · ❁, if ❀ + ❁ = 8 and 3 · ❀ + 2 · ❁ = 17 — the two
// lines added together are 4 · ❀ + 3 · ❁ = 25. Есен 2023, задача 5 (shape 'diff'): ❀ − ❁, if ❀ + ❁ = 10 and ❀ + 3 · ❁ = 16 —
// the second line has 2 · ❁ = 6 more, so ❁ = 3, ❀ = 7 and 7 − 3 = 4. x is ❀, y is ❁; cx and cy their counts in the second line.
export function genFlowerEq(){
  for(;;){
    const x = 1 + rnd(9), y = 1 + rnd(9);
    if(x === y) continue;
    if(Math.random() < 0.5){
      const cx = 2 + rnd(3), cy = 2 + rnd(3);
      if(cx === cy) continue;
      const T = cx*x + cy*y, ans = T + x + y;
      return {kind:'fruiteq', shape:'sum', x, y, cx, cy, S: x + y, T, traps:[T], ans};
    }
    // one flower once and the other k times, so the lines differ by k − 1 of that one
    const k = 2 + rnd(3), onX = rnd(2) === 1, cx = onX ? k : 1, cy = onX ? 1 : k, T = cx*x + cy*y, ans = Math.abs(x - y);
    return {kind:'fruiteq', shape:'diff', x, y, cx, cy, S: x + y, T,
            traps: [T - x - y, Math.max(x, y)].filter((v, i, all) => v !== ans && all.indexOf(v) === i), ans};
  }
}
// ❀ and ❁ as the papers print them: five round petals, and eight narrow ones
const FLOWER = [
  [0, 1, 2, 3, 4].map(i => { const t = (i*72 - 90)*Math.PI/180; return '<circle cx="' + (5.4*Math.cos(t)).toFixed(1) + '" cy="' + (5.4*Math.sin(t)).toFixed(1) + '" r="4.5" fill="var(--rose)"/>'; }).join('') +
    '<circle r="3.2" fill="var(--warm)"/>',
  [0, 1, 2, 3, 4, 5, 6, 7].map(i => '<ellipse cy="-5.6" rx="2.4" ry="4.8" fill="var(--grape)" transform="rotate(' + i*45 + ')"/>').join('') +
    '<circle r="3" fill="var(--lemon)"/>'
];
const flo = i => '<svg class="ic" viewBox="-11 -11 22 22" aria-hidden="true">' + FLOWER[i] + '</svg>';
const floTerm = (n, i) => (n === 1 ? '' : n + ' · ') + flo(i);
// what is asked: the two lines added, or the larger flower less the smaller
const floAsk = q => q.shape === 'sum' ? floTerm(q.cx + 1, 0) + ' + ' + floTerm(q.cy + 1, 1) : q.x > q.y ? flo(0) + ' − ' + flo(1) : flo(1) + ' − ' + flo(0);
function drawFlowerEq(q){
  return '<div class="ask">' + tr('Пресметнете ', 'Обчисліть ') + floAsk(q) + tr(', ако', ', якщо') + '</div>' +
    '<div class="eqs"><span>' + flo(0) + ' + ' + flo(1) + ' = ' + q.S + '</span>' +
    '<span>' + floTerm(q.cx, 0) + ' + ' + floTerm(q.cy, 1) + ' = ' + q.T + '</span></div>' +
    '<div class="line md">' + SLOT + '</div>';
}
// the summary line is plain text (it is shown with textContent), so it names the numbers, not the flowers
function eqFlowerEq(q){
  if(q.shape === 'sum') return q.T + ' + ' + q.S + ' = ' + q.ans;
  const big = Math.max(q.x, q.y), small = Math.min(q.x, q.y), m = Math.max(q.cx, q.cy) - 1;
  return (m === 1 ? q.T + ' − ' + q.S : '(' + q.T + ' − ' + q.S + ') : ' + m) + ' = ' + (q.cx > 1 ? q.x : q.y) + ' → ' + big + ' − ' + small + ' = ' + q.ans;
}
function whyFlowerEq(q, full){
  if(q.shape === 'sum'){
    if(!full) return tr('Събери двете равенства.', 'Додай дві рівності.');
    return floTerm(q.cx, 0) + ' + ' + floTerm(q.cy, 1) + ' = ' + q.T + tr(' и ', ' і ') + flo(0) + ' + ' + flo(1) + ' = ' + q.S + ' &nbsp;→&nbsp; ' +
      tr('събрани: ', 'разом: ') + floAsk(q) + ' = ' + q.T + ' + ' + q.S + ' = ' + q.ans;
  }
  if(!full) return tr('Извади първото равенство от второто.', 'Відніми першу рівність від другої.');
  // i: the flower counted k times in the second line; 1 − i: the other
  const i = q.cx > 1 ? 0 : 1, k = i ? q.cy : q.cx, v = [q.x, q.y], D = q.T - q.S;
  return (k - 1 === 1 ? '' : (k - 1) + ' · ') + flo(i) + ' = ' + q.T + ' − ' + q.S + ' = ' + D + ' &nbsp;→&nbsp; ' +
    (k - 1 === 1 ? '' : flo(i) + ' = ' + D + ' : ' + (k - 1) + ' = <b>' + v[i] + '</b> &nbsp;→&nbsp; ') +
    flo(1 - i) + ' = ' + q.S + ' − ' + v[i] + ' = <b>' + v[1 - i] + '</b> &nbsp;→&nbsp; ' + Math.max(q.x, q.y) + ' − ' + Math.min(q.x, q.y) + ' = ' + q.ans;
}

function drawFruiteq(q){
  if(q.shape) return drawFlowerEq(q);
  if(q.tri){
    const row = (y, t) => '<text x="80" y="' + y + '" text-anchor="middle" font-size="22" font-weight="800" fill="var(--ink)" font-family="Nunito, sans-serif">' + t + '</text>';
    return '<div class="ask">' + tr('Ако', 'Якщо') + '</div><div class="fig"><svg viewBox="0 0 160 100" style="max-width:220px" role="img" aria-label="' + tr('три равенства с фигури', 'три рівності з фігурами') + '">' +
      row(26, '● + ○ = ' + q.s1) + row(58, '○ + ■ = ' + q.s2) + row(90, '■ + ● = ' + q.s3) + '</svg></div>' +
      '<div class="ask">' + tr('пресметнете ● + ○ + ■.', 'обчисліть ● + ○ + ■.') + '</div><div class="line xl">' + SLOT + '</div>';
  }
  if(q.grid){
    const F = q.f.map(ic);
    const head = F.map((g, i) => (i ? (q.signs[i] > 0 ? ' + ' : ' − ') : (q.signs[i] > 0 ? '' : '− ')) + g).join('');
    const cell = t => '<span>' + t + '</span>';
    const blank = cell('');
    return '<div class="ask">' + tr('Пресметнете', 'Обчисліть') + '</div>' +
      '<div class="given">' + head + '</div>' +
      '<div class="ask">' + tr('ако', 'якщо') + '</div>' +
      '<div class="grid4">' +
        cell(F[0]) + cell('+') + cell(F[1]) + cell('=') + cell(q.R1) +
        cell('+') + blank + cell('+') + blank + blank +
        cell(F[2]) + cell('−') + cell(F[3]) + cell('=') + cell(q.R2) +
        cell('=') + blank + cell('=') + blank + blank +
        cell(q.C1) + blank + cell(q.C2) + blank + blank +
      '</div>' +
      '<div class="line md">' + SLOT + '</div>';
  }
  const F = q.f.map(ic);
  return '<div class="ask">' + tr('Пресметнете ', 'Обчисліть ') + F[q.askd[0]] + ' − ' + F[q.askd[1]] + tr(', ако:', ', якщо:') + '</div>' +
    '<div class="eqs"><span>' + F[1] + ' + ' + F[0] + ' = ' + q.s1 + '</span>' +
    '<span>' + F[0] + ' + ' + F[2] + ' = ' + q.s2 + '</span>' +
    '<span>' + F[2] + ' + ' + F[0] + ' + ' + F[1] + ' = ' + q.s3 + '</span></div>' +
    '<div class="line md">' + SLOT + '</div>';
}
function eqFruiteq(q){
  if(q.shape) return eqFlowerEq(q);
  if(q.tri) return '(' + q.s1 + ' + ' + q.s2 + ' + ' + q.s3 + ') : 2 = ' + q.ans;
  if(q.grid) return [q.A, q.B, q.C, q.D].join(', ') + ' → ' + q.ans;
  return q.s1 + ', ' + q.s2 + ', ' + q.s3 + ' → ' + q.ans;
}
function whyFruiteq(q, full){
  if(q.shape) return whyFlowerEq(q, full);
  if(q.tri){
    if(!full) return tr('Събери трите реда. Колко пъти е вътре всяка фигура?', 'Додай три рядки. Скільки разів у них кожна фігура?');
    return q.s1 + ' + ' + q.s2 + ' + ' + q.s3 + ' = ' + (q.s1 + q.s2 + q.s3) + tr(' — всяка фигура по два пъти', ' — кожна фігура двічі') + ' &nbsp;→&nbsp; ' + (q.s1 + q.s2 + q.s3) + ' : 2 = ' + q.ans;
  }
  if(q.grid){
    if(!full) return tr('Двата стълба заедно съдържат всичките четири плода.', 'Два стовпці разом містять усі чотири фрукти.');
    const F = q.f.map(ic), v = [q.A, q.B, q.C, q.D];
    const both = q.C1 + q.C2, low = both - q.R1;
    const bits = v.map((x, i) => (i ? (q.signs[i] > 0 ? ' + ' : ' − ') : '') + x);
    return tr('двата стълба заедно: ', 'два стовпці разом: ') + q.C1 + ' + ' + q.C2 + ' = ' + both + tr(', а горният ред е ', ', а верхній рядок — ') + q.R1 +
      ' &nbsp;→&nbsp; ' + tr('долният ред заедно е ', 'нижній рядок разом — ') + both + ' − ' + q.R1 + ' = <b>' + low +
      '</b>' + tr(', а разликата му е ', ', а його різниця — ') + q.R2 + ' &nbsp;→&nbsp; ' + F[2] + ' = <b>' + q.C + '</b>, ' + F[3] +
      ' = <b>' + q.D + '</b> &nbsp;→&nbsp; ' + F[0] + ' = ' + q.C1 + ' − ' + q.C + ' = <b>' + q.A +
      '</b>, ' + F[1] + ' = ' + q.R1 + ' − ' + q.A + ' = <b>' + q.B + '</b> &nbsp;→&nbsp; ' +
      bits.join('') + ' = ' + q.ans;
  }
  if(!full) return tr('Третото равенство съдържа първото — започни оттам.', 'Третя рівність містить першу — почни звідти.');
  const F = q.f.map(ic);
  const v = [q.a, q.b, q.c];
  return F[2] + ' = ' + q.s3 + ' − ' + q.s1 + ' = <b>' + q.c + '</b> &nbsp;→&nbsp; ' +
    F[0] + ' = ' + q.s2 + ' − ' + q.c + ' = <b>' + q.a + '</b> &nbsp;→&nbsp; ' +
    F[1] + ' = ' + q.s1 + ' − ' + q.a + ' = <b>' + q.b + '</b> &nbsp;→&nbsp; ' +
    v[q.askd[0]] + ' − ' + v[q.askd[1]] + ' = ' + q.ans;
}
KIND.fruiteq = { draw:drawFruiteq, eq:eqFruiteq, why:whyFruiteq };
