// Question kind 'boxdig': level 242 20□ + 22□ — One digit in two places: compare part by part, not the whole sums.

// МБГ Есен 2024, 3 клас, задача 8: 20□ + 22□ < 201 + 221. □ is the units digit of both numbers, so the left side is
// 200 + 220 + □ + □ and the right one 200 + 220 + 1 + 1: □ + □ < 2, only □ = 0. Есен 2023, задача 8: 20 · □ + 23 · □ <
// 20 · 1 + 23 · 1 — □ is a factor of both, 43 · □ < 43 · 1, so □ = 0 again. The same comparison the other way (>) leaves
// only 9, and an equality the one digit between the two on the right (as factors, by round numbers: 20 · □ + 30 · □ =
// 20 · 7 + 30 · 2 = 200, □ = 4). Whatever the sign, exactly one digit fits.
import { KIND, SLOT, rnd, tr } from '../js/core.js';
const BOX = '<span class="circle">□</span>';
// in the numbers the box stands for a digit, so it is drawn as big as one (the numbers' font has a small □)
const DIG = '<span class="circle" style="font-family:var(--ui-font)">□</span>';
const REL = { '<':'&lt;', '>':'&gt;', '=':'=' };
// the left side for the digit x, and the right side
const boxL = (q, x) => q.shape === 'mul' ? q.a*x + q.b*x : 10*q.a + x + 10*q.b + x;
const boxR = q => q.shape === 'mul' ? q.a*q.p + q.b*q.r : 10*q.a + q.p + 10*q.b + q.r;
const boxHolds = (q, x) => q.rel === '<' ? boxL(q, x) < boxR(q) : q.rel === '>' ? boxL(q, x) > boxR(q) : boxL(q, x) === boxR(q);
export function genBoxDig(){
  const mul = Math.random() < 0.5, r0 = Math.random(), rel = r0 < 0.5 ? '<' : r0 < 0.75 ? '=' : '>';
  for(;;){
    // as factors an equality needs round numbers (20 and 30), or only the digit on the right itself fits
    const round = mul && rel === '=', a = round ? 10 + 10*rnd(5) : 10 + rnd(30), b = round ? 10 + 10*rnd(5) : 10 + rnd(30);
    const p = rnd(10), r = rnd(10);
    // as factors no 0 on the right (20 · 0 reads as a slip); with < that leaves the paper's 20 · 1 + 23 · 1
    if(a === b || rel === '=' && p === r || mul && !(p && r)) continue;
    const q = {kind:'boxdig', shape: mul ? 'mul' : 'last', a, b, p, r, rel};
    const fit = [...Array(10).keys()].filter(x => boxHolds(q, x));
    if(fit.length !== 1) continue;
    // the slips: 1 copied from the right (it is 0), 8 (it is 9), one of the two digits on the right (the one between them)
    return Object.assign(q, {traps:[rel === '<' ? fit[0] + 1 : rel === '>' ? fit[0] - 1 : p], ans: fit[0]});
  }
}
function boxText(q){
  if(q.shape === 'mul') return q.a + ' · ' + DIG + ' + ' + q.b + ' · ' + DIG + ' ' + REL[q.rel] + ' ' + q.a + ' · ' + q.p + ' + ' + q.b + ' · ' + q.r;
  return q.a + DIG + ' + ' + q.b + DIG + ' ' + REL[q.rel] + ' ' + (10*q.a + q.p) + ' + ' + (10*q.b + q.r);
}
function drawBoxDig(q){
  return '<div class="ask">' + tr('Коя цифра трябва да поставим вместо ' + BOX + ', така че да е вярно?', 'Яку цифру треба поставити замість ' + BOX + ', щоб було правильно?') + '</div>' +
    '<div class="given" style="text-wrap:balance">' + boxText(q) + '</div>' +
    '<div class="line xl">' + DIG + ' = ' + SLOT + '</div>';
}
// the left side and the right side, the same parts set aside
function boxLeft(q){
  return q.shape === 'mul' ? (q.a + q.b) + ' · □ ' + REL[q.rel] + ' ' + boxR(q) : '□ + □ ' + REL[q.rel] + ' ' + (q.p + q.r);
}
function eqBoxDig(q){
  return boxLeft(q) + ' → □ = ' + q.ans;
}
function whyBoxDig(q, full){
  if(!full) return q.shape === 'mul'
    ? tr('И двете числа отляво се умножават по една и съща цифра □. Сравни с произведенията отдясно: кое е същото и кое е различно?',
         'Обидва числа ліворуч множаться на одну й ту саму цифру □. Порівняй із добутками праворуч: що однакове, а що різне?')
    : tr('И двете числа отляво завършват на една и съща цифра □. Сравни ги с числата отдясно: кое е същото и кое е различно?',
         'Обидва числа ліворуч закінчуються однією й тією самою цифрою □. Порівняй їх із числами праворуч: що однакове, а що різне?');
  // the digit that fits, and beside it the next one, which no longer does
  const x = q.ans, val = v => q.shape === 'mul' ? (q.a + q.b) + ' · ' + v + ' = ' + (q.a + q.b)*v : v + ' + ' + v + ' = ' + 2*v;
  const tries = q.rel === '<' ? val(x) + ' ✓, ' + val(x + 1) + ' ✗' : q.rel === '>' ? val(x - 1) + ' ✗, ' + val(x) + ' ✓' : val(x) + ' ✓';
  if(q.shape === 'mul'){
    const right = q.p === q.r ? (q.a + q.b) + ' · ' + q.p : q.a*q.p + ' + ' + q.b*q.r;
    return q.a + ' · □ + ' + q.b + ' · □ = ' + (q.a + q.b) + ' · □, &nbsp;' + q.a + ' · ' + q.p + ' + ' + q.b + ' · ' + q.r + ' = ' + right + ' = ' + boxR(q) +
      ' &nbsp;→&nbsp; ' + boxLeft(q) + ': ' + tries + ' &nbsp;→&nbsp; □ = ' + x;
  }
  const A = 10*q.a, B = 10*q.b;
  return q.a + '□ = ' + A + ' + □, ' + q.b + '□ = ' + B + ' + □; &nbsp;' + (A + q.p) + ' = ' + A + ' + ' + q.p + ', ' + (B + q.r) + ' = ' + B + ' + ' + q.r +
    tr(' &nbsp;→&nbsp; ' + A + ' и ' + B + ' са от двете страни: ', ' &nbsp;→&nbsp; ' + A + ' і ' + B + ' є з обох боків: ') + boxLeft(q) + ': ' + tries + ' &nbsp;→&nbsp; □ = ' + x;
}
KIND.boxdig = { draw:drawBoxDig, eq:eqBoxDig, why:whyBoxDig };
