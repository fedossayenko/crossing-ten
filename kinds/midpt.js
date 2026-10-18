// Question kind 'midpt': level 71 Селищата and level 271 Средата на отсечката — A midpoint, and a place a few kilometres (centimetres) from it.

// МБГ Есен, 3 клас, задача 13: A to B is 32 km, M is halfway, N lies between A and M with MN = 4 km;
// N to B is 16 + 4 = 20 km. Sometimes it asks for A to N instead: 16 − 4.
import { KIND, SLOT, rnd, tr } from '../js/core.js';
export function genMidPt(){
  const half = 8 + rnd(23), m = 1 + rnd(half - 2), toB = Math.random() < 0.65;
  return {kind:'midpt', AB: 2*half, half, m, toB, ans: toB ? half + m : half - m,
          traps: [toB ? half - m : half + m, 2*half - m, half].filter((v, i, a) => a.indexOf(v) === i)};
}
// 2nd grade, level 271 (shape 'cm'): a segment in centimetres, as the 2nd-grade papers put points on a line —
// AB = 20 см, M its middle, N between A and M, 3 см from M: AN = 10 − 3. The half is 10 + 10 = 20, no division.
export function genMidPtSeg(){
  const half = 5 + rnd(16), m = 1 + rnd(half - 2), toB = Math.random() < 0.5, ans = toB ? half + m : half - m;
  return {kind:'midpt', shape:'cm', AB: 2*half, half, m, toB, ans,
          traps: [toB ? half - m : half + m, 2*half - m, half].filter((v, i, a) => v !== ans && a.indexOf(v) === i)};
}
function midSvg(q){
  const W = 260, at = v => 12 + v / q.AB * (W - 24);
  const tight = q.m / q.AB * (W - 24) < 18;   // N and M closer than a letter is wide: N leans left, M right
  const pts = [[0, 'A'], [q.half - q.m, 'N'], [q.half, 'M'], [q.AB, 'B']];
  return '<div class="fig wide"><svg viewBox="0 -14 ' + W + ' 46" role="img" aria-label="' + (q.shape === 'cm' ? tr('отсечката AB', 'відрізок AB') : tr('селищата върху пътя', 'села на дорозі')) + '">' +
    '<line x1="4" y1="10" x2="' + (W - 4) + '" y2="10" stroke="var(--ink)" stroke-width="2"/>' +
    pts.map(([v, n]) => '<circle cx="' + at(v).toFixed(1) + '" cy="10" r="3.6" fill="var(--ink)"/><text x="' + (at(v) + (tight ? (n === 'N' ? -3 : n === 'M' ? 3 : 0) : 0)).toFixed(1) +
      '" y="-2" text-anchor="' + (tight && n === 'N' ? 'end' : tight && n === 'M' ? 'start' : 'middle') + '" font-size="15" font-weight="800" fill="var(--ink)" font-family="Nunito, sans-serif">' + n + '</text>').join('') +
    '</svg></div>';
}
function drawMidPt(q){
  const ask = q.toB ? ['N и B', 'N і B'] : ['A и N', 'A і N'];
  return '<div class="ask">' + tr('Разстоянието между селищата A и B е <span class="num">' + q.AB + '</span> км, като селището M се намира точно в средата на пътя между тях. ' +
    'Селището N е разположено между A и M, като разстоянието от M до N е <span class="num">' + q.m + '</span> км. Колко километра е разстоянието между селищата ' + ask[0] + '?',
    'Відстань між селами A і B становить <span class="num">' + q.AB + '</span> км, а село M розташоване точно посередині дороги між ними. ' +
    'Село N розташоване між A і M, причому відстань від M до N — <span class="num">' + q.m + '</span> км. Скільки кілометрів становить відстань між селами ' + ask[1] + '?') +
    '</div>' + midSvg(q) + '<div class="line md">' + SLOT + ' <span class="unit">км</span></div>';
}
function eqMidPt(q){
  return q.AB + ' : 2 = ' + q.half + ' → ' + q.half + (q.toB ? ' + ' : ' − ') + q.m + ' = ' + q.ans + ' км';
}
function whyMidPt(q, full){
  if(!full) return tr('Първо: колко е от M до всяко от двете селища?', 'Спершу: скільки від M до кожного з двох сіл?');
  return 'AM = MB = ' + q.AB + ' : 2 = ' + q.half + ' км &nbsp;→&nbsp; ' + (q.toB ? 'NB = NM + MB = ' + q.m + ' + ' + q.half : 'AN = AM − NM = ' + q.half + ' − ' + q.m) +
    ' = ' + q.ans + ' км';
}
function drawMidSeg(q){
  const ask = q.toB ? 'NB' : 'AN', num = n => '<span class="num">' + n + '</span>';
  return '<div class="ask">' + tr('Отсечката AB е дълга ' + num(q.AB) + ' см. Точката M е точно в средата на AB. Точката N е между A и M, на ' + num(q.m) + ' см от M. ' +
      'Колко сантиметра е дълга отсечката ' + ask + '?',
    'Відрізок AB має довжину ' + num(q.AB) + ' см. Точка M — точно посередині AB. Точка N лежить між A і M, на відстані ' + num(q.m) + ' см від M. ' +
      'Скільки сантиметрів має відрізок ' + ask + '?') +
    '</div>' + midSvg(q) + '<div class="line md">' + SLOT + ' <span class="unit">см</span></div>';
}
const midSegLast = q => (q.toB ? 'NB = ' + q.m + ' + ' + q.half : 'AN = ' + q.half + ' − ' + q.m) + ' = ' + q.ans + ' см';
function whyMidSeg(q, full){
  if(!full) return tr('Първо: колко сантиметра е от M до A и от M до B?', 'Спершу: скільки сантиметрів від M до A і від M до B?');
  return 'AM = MB = ' + q.half + ' см (' + q.half + ' + ' + q.half + ' = ' + q.AB + ') &nbsp;→&nbsp; ' + midSegLast(q);
}
KIND.midpt = { draw: q => q.shape === 'cm' ? drawMidSeg(q) : drawMidPt(q),
  eq: q => q.shape === 'cm' ? 'AM = ' + q.half + ' см → ' + midSegLast(q) : eqMidPt(q),
  why: (q, full) => q.shape === 'cm' ? whyMidSeg(q, full) : whyMidPt(q, full) };
