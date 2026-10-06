// Question kind 'eqcross': level 158 Кръстът ■ ● — Two equalities crossing at one shared box.

// МБГ Пролет 2023, 1 клас, задача 4: down, 7 + ■ = 11; across, 10 − ■ = ●; ● − ■ = ? The
// equality with only ■ in it comes first: ■ = 4, then ● = 10 − 4 = 6, and 6 − 4 = 2.
// Пролет 2025, задача 4: the same cross with 9 + ■ = 11 — ■ = 2, ● = 8, ● − ■ = 6. Пролет 2021, задача 6:
// 3 + ■ = 5, 6 − ■ = ● — ● − ■ = 2; Пролет 2022, задача 7: 5 + ■ = 9, 7 − ■ = ●, and ● + ● − ■ = 3 + 3 − 4 = 2.
import { KIND, SLOT, rnd, svgText, tr } from '../js/core.js';
// МБГ Полуфинал 2025, 1 клас, задача 10: 🌼 + 5 = 17, and under it 🌼 − 5 = ? — no cross, one flower in both lines:
// the same flower is the same number, 🌼 = 17 − 5 = 12, so 12 − 5 = 7 (shape 'stack').
function genEqStack(){
  const s = 1 + rnd(9), x = s + rnd(21 - 2*s);
  return {kind:'eqcross', shape:'stack', s, x, b: x + s, ans: x - s};
}
export function genEqCross(){
  if(Math.random() < 0.25) return genEqStack();
  for(;;){
    const s = 1 + rnd(9), a = 1 + rnd(20 - s), c = 5 + rnd(16), dot = c - s, r = Math.random();
    const ask = r < 0.45 ? 'minus' : r < 0.65 ? 'twice' : r < 0.85 ? 'plus' : 'dot';
    if(dot < 1 || (ask === 'minus' && dot < s) || (ask === 'plus' && dot + s > 20) || (ask === 'twice' && (2*dot < s || 2*dot > 20))) continue;
    // now and then ● first in the row instead, drawn after the rest, so the other crosses keep their seeds
    if(Math.random() < 0.25) return genEqFlip();
    return {kind:'eqcross', a, s, b: a + s, c, dot, ask, ans: ask === 'minus' ? dot - s : ask === 'plus' ? dot + s : ask === 'twice' ? 2*dot - s : dot};
  }
}
// МБГ Полуфинал 2022, 1 клас, задача 7: down 6 + ■ = 8, across ● − ■ = 5 — ● stands first in the row, so it is the bigger
// one: ■ = 2, ● = 5 + 2 = 7, and ● + ■ = 9 (shape 'flip'; ● + ■ stays within 20).
function genEqFlip(){
  const s = 1 + rnd(9), a = 1 + rnd(20 - s), c = 1 + rnd(20 - 2*s), dot = c + s, ask = Math.random() < 0.7 ? 'plus' : 'dot';
  return {kind:'eqcross', shape:'flip', a, s, b: a + s, c, dot, ask, ans: ask === 'plus' ? dot + s : dot};
}
const eqCrossAsk = q => q.ask === 'minus' ? '● − ■' : q.ask === 'plus' ? '● + ■' : q.ask === 'twice' ? '● + ● − ■' : '●';
// the cross: a + ■ = b down the middle column, c − ■ = ● along the middle row ('flip': ● − ■ = c), ■ in both
function eqCrossSvg(q){
  const u = 34, cell = (i, j, t, tint) => '<rect x="' + (i*u + 2) + '" y="' + (j*u + 2) + '" width="' + (u - 4) + '" height="' + (u - 4) + '" rx="6" fill="' +
    (tint ? 'var(--warmbg)' : 'var(--solid)') + '" stroke="' + (tint ? 'var(--warm)' : 'var(--line)') + '" stroke-width="1.6"/>' + svgText(i*u + u/2, j*u + u/2 + 6, t, 17, 'var(--ink)');
  const down = [q.a, '+', '■', '=', q.b], across = q.shape === 'flip' ? ['●', '−', '■', '=', q.c] : [q.c, '−', '■', '=', '●'];
  return '<div class="fig"><svg viewBox="0 0 ' + 5*u + ' ' + 5*u + '" style="max-width:190px" role="img" aria-label="' + tr('две равенства на кръст', 'дві рівності хрестом') + '">' +
    down.map((t, j) => j === 2 ? '' : cell(2, j, t)).join('') + across.map((t, i) => cell(i, 2, t, i === 2)).join('') + '</svg></div>';
}
// a daisy for the hidden number of 'stack'
const FLOWER = '<svg class="ic" viewBox="-11 -11 22 22" aria-hidden="true">' + [0, 60, 120, 180, 240, 300].map(r =>
  '<circle cx="' + (6*Math.cos(r*Math.PI/180)).toFixed(1) + '" cy="' + (6*Math.sin(r*Math.PI/180)).toFixed(1) + '" r="4.2" fill="var(--lemon)" stroke="var(--warm)" stroke-width=".8"/>').join('') +
  '<circle cx="0" cy="0" r="3.6" fill="var(--warm)"/></svg>';
function drawEqCross(q){
  if(q.shape === 'stack') return '<div class="ask">' + tr('Под еднаквите цветя е скрито едно и също число.', 'Під однаковими квітками сховане те саме число.') + '</div>' +
    '<div class="line md">' + FLOWER + ' + ' + q.s + ' = ' + q.b + '</div><div class="line md">' + FLOWER + ' − ' + q.s + ' = ' + SLOT + '</div>';
  return '<div class="ask">' + tr('Колко е <span class="num">' + eqCrossAsk(q) + '</span>?', 'Скільки дорівнює <span class="num">' + eqCrossAsk(q) + '</span>?') + '</div>' +
    eqCrossSvg(q) + '<div class="line md">' + eqCrossAsk(q) + ' = ' + SLOT + '</div>';
}
function eqEqCross(q){
  if(q.shape === 'stack') return '🌼 + ' + q.s + ' = ' + q.b + ' → 🌼 = ' + q.x + ' → ' + q.x + ' − ' + q.s + ' = ' + q.ans;
  return q.a + ' + ■ = ' + q.b + ', ' + (q.shape === 'flip' ? '● − ■ = ' + q.c : q.c + ' − ■ = ●') + ' → ■ = ' + q.s + ', ● = ' + q.dot + ' → ' + q.ans;
}
function whyEqCross(q, full){
  if(q.shape === 'stack'){
    if(!full) return tr('Еднаквите цветя крият едно и също число. Намери го от реда, в който всичко друго се знае.', 'Однакові квітки ховають те саме число. Знайди його з рядка, де все інше відоме.');
    return FLOWER + ' + ' + q.s + ' = ' + q.b + ' &nbsp;→&nbsp; ' + FLOWER + ' = ' + q.b + ' − ' + q.s + ' = <b>' + q.x + '</b> &nbsp;→&nbsp; ' + q.x + ' − ' + q.s + ' = ' + q.ans;
  }
  if(!full) return tr('Започни от равенството, в което има само ■. После ■ ще ти помогне да намериш ●.',
    'Почни з рівності, де є лише ■. Потім ■ допоможе знайти ●.');
  return q.a + ' + ■ = ' + q.b + ' &nbsp;→&nbsp; ■ = ' + q.b + ' − ' + q.a + ' = <b>' + q.s + '</b> &nbsp;→&nbsp; ' + (q.shape === 'flip' ? '● − ' + q.s + ' = ' + q.c + ' &nbsp;→&nbsp; ● = ' + q.c + ' + ' : '● = ' + q.c + ' − ') + q.s + ' = <b>' + q.dot + '</b>' +
    (q.ask === 'dot' ? '' : ' &nbsp;→&nbsp; ' + q.dot + (q.ask === 'twice' ? ' + ' + q.dot + ' − ' : q.ask === 'minus' ? ' − ' : ' + ') + q.s + ' = ' + q.ans);
}
KIND.eqcross = { draw:drawEqCross, eq:eqEqCross, why:whyEqCross };
