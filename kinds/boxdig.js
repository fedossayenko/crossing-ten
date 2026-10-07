// Question kind 'boxdig': level 242 20□ + 22□ — One digit in two places: compare part by part, not the whole sums.

// МБГ Есен 2024, 3 клас, задача 8: 20□ + 22□ < 201 + 221. □ is the units digit of both numbers, so the left side is
// 200 + 220 + □ + □ and the right one 200 + 220 + 1 + 1: □ + □ < 2, only □ = 0. Есен 2023, задача 8: 20 · □ + 23 · □ <
// 20 · 1 + 23 · 1 — □ is a factor of both, 43 · □ < 43 · 1, so □ = 0 again. A < that only one digit fits is always 0 (and
// a > always 9), so the level mostly asks the largest digit that fits a < (□ + □ < 9: 4) and the smallest that fits a >,
// the right side's digits free; an equality has its one digit between the two on the right (as factors, by round
// numbers: 20 · □ + 30 · □ = 20 · 7 + 30 · 2 = 200, □ = 4). Whatever the sign, the answer can be any digit.
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
  const mul = Math.random() < 0.5, r0 = Math.random(), rel = r0 < 0.4 ? '<' : r0 < 0.7 ? '>' : '=';
  // 'one': the one digit that fits (the papers' question); 'max' / 'min': the largest that fits a <, the smallest a >
  const ask = rel === '=' || Math.random() < 0.25 ? 'one' : rel === '<' ? 'max' : 'min';
  for(;;){
    // as factors an equality needs round numbers (20 and 30), or only the digit on the right itself fits
    const round = mul && rel === '=', a = round ? 10 + 10*rnd(5) : 10 + rnd(30), b = round ? 10 + 10*rnd(5) : 10 + rnd(30);
    const p = rnd(10), r = rnd(10);
    // as factors no 0 on the right (20 · 0 reads as a slip); with < that leaves the paper's 20 · 1 + 23 · 1
    if(a === b || rel === '=' && p === r || mul && !(p && r)) continue;
    const q = {kind:'boxdig', shape: mul ? 'mul' : 'last', a, b, p, r, rel, ask};
    const fit = [...Array(10).keys()].filter(x => boxHolds(q, x));
    // some digit fits and some does not: «the largest» is never just 9
    if(!fit.length || fit.length === 10 || ask === 'one' && fit.length !== 1) continue;
    const x = ask === 'min' ? fit[0] : fit[fit.length - 1];
    // the slips: the next digit, where the two sides are equal or just past it; one of the two digits on the right
    return Object.assign(q, {traps:[rel === '<' ? x + 1 : rel === '>' ? x - 1 : p], ans: x});
  }
}
function boxText(q){
  if(q.shape === 'mul') return q.a + ' · ' + DIG + ' + ' + q.b + ' · ' + DIG + ' ' + REL[q.rel] + ' ' + q.a + ' · ' + q.p + ' + ' + q.b + ' · ' + q.r;
  return q.a + DIG + ' + ' + q.b + DIG + ' ' + REL[q.rel] + ' ' + (10*q.a + q.p) + ' + ' + (10*q.b + q.r);
}
function drawBoxDig(q){
  const ask = q.ask === 'one' ? tr('Коя цифра трябва да поставим вместо ' + BOX + ', така че да е вярно?', 'Яку цифру треба поставити замість ' + BOX + ', щоб було правильно?')
    : tr('Коя е <b>най-' + (q.ask === 'max' ? 'голямата' : 'малката') + '</b> цифра, която можем да поставим вместо ' + BOX + ', така че да е вярно?',
         'Яку <b>най' + (q.ask === 'max' ? 'більшу' : 'меншу') + '</b> цифру можна поставити замість ' + BOX + ', щоб було правильно?');
  return '<div class="ask">' + ask + '</div>' +
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
