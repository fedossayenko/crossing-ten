// Question kind 'eqcross': level 158 Кръстът ■ ● — Two equalities crossing at one shared box.

// МБГ Пролет 2023, 1 клас, задача 4: down, 7 + ■ = 11; across, 10 − ■ = ●; ● − ■ = ? The
// equality with only ■ in it comes first: ■ = 4, then ● = 10 − 4 = 6, and 6 − 4 = 2.
// Пролет 2025, задача 4: the same cross with 9 + ■ = 11 — ■ = 2, ● = 8, ● − ■ = 6. Пролет 2021, задача 6:
// 3 + ■ = 5, 6 − ■ = ● — ● − ■ = 2; Пролет 2022, задача 7: 5 + ■ = 9, 7 − ■ = ●, and ● + ● − ■ = 3 + 3 − 4 = 2.
import { KIND, SLOT, rnd, svgText, tr } from '../js/core.js';
export function genEqCross(){
  for(;;){
    const s = 1 + rnd(9), a = 1 + rnd(20 - s), c = 5 + rnd(16), dot = c - s, r = Math.random();
    const ask = r < 0.45 ? 'minus' : r < 0.65 ? 'twice' : r < 0.85 ? 'plus' : 'dot';
    if(dot < 1 || (ask === 'minus' && dot < s) || (ask === 'plus' && dot + s > 20) || (ask === 'twice' && (2*dot < s || 2*dot > 20))) continue;
    return {kind:'eqcross', a, s, b: a + s, c, dot, ask, ans: ask === 'minus' ? dot - s : ask === 'plus' ? dot + s : ask === 'twice' ? 2*dot - s : dot};
  }
}
const eqCrossAsk = q => q.ask === 'minus' ? '● − ■' : q.ask === 'plus' ? '● + ■' : q.ask === 'twice' ? '● + ● − ■' : '●';
// the cross: a + ■ = b down the middle column, c − ■ = ● along the middle row, ■ in both
function eqCrossSvg(q){
  const u = 34, cell = (i, j, t, tint) => '<rect x="' + (i*u + 2) + '" y="' + (j*u + 2) + '" width="' + (u - 4) + '" height="' + (u - 4) + '" rx="6" fill="' +
    (tint ? 'var(--warmbg)' : 'var(--solid)') + '" stroke="' + (tint ? 'var(--warm)' : 'var(--line)') + '" stroke-width="1.6"/>' + svgText(i*u + u/2, j*u + u/2 + 6, t, 17, 'var(--ink)');
  const down = [q.a, '+', '■', '=', q.b], across = [q.c, '−', '■', '=', '●'];
  return '<div class="fig"><svg viewBox="0 0 ' + 5*u + ' ' + 5*u + '" style="max-width:190px" role="img" aria-label="' + tr('две равенства на кръст', 'дві рівності хрестом') + '">' +
    down.map((t, j) => j === 2 ? '' : cell(2, j, t)).join('') + across.map((t, i) => cell(i, 2, t, i === 2)).join('') + '</svg></div>';
}
function drawEqCross(q){
  return '<div class="ask">' + tr('Колко е <span class="num">' + eqCrossAsk(q) + '</span>?', 'Скільки дорівнює <span class="num">' + eqCrossAsk(q) + '</span>?') + '</div>' +
    eqCrossSvg(q) + '<div class="line md">' + eqCrossAsk(q) + ' = ' + SLOT + '</div>';
}
function eqEqCross(q){
  return q.a + ' + ■ = ' + q.b + ', ' + q.c + ' − ■ = ● → ■ = ' + q.s + ', ● = ' + q.dot + ' → ' + q.ans;
}
function whyEqCross(q, full){
  if(!full) return tr('Започни от равенството, в което има само ■. После ■ ще ти помогне да намериш ●.',
    'Почни з рівності, де є лише ■. Потім ■ допоможе знайти ●.');
  return q.a + ' + ■ = ' + q.b + ' &nbsp;→&nbsp; ■ = ' + q.b + ' − ' + q.a + ' = <b>' + q.s + '</b> &nbsp;→&nbsp; ● = ' + q.c + ' − ' + q.s + ' = <b>' + q.dot + '</b>' +
    (q.ask === 'dot' ? '' : ' &nbsp;→&nbsp; ' + q.dot + (q.ask === 'twice' ? ' + ' + q.dot + ' − ' : q.ask === 'minus' ? ' − ' : ' + ') + q.s + ' = ' + q.ans);
}
KIND.eqcross = { draw:drawEqCross, eq:eqEqCross, why:whyEqCross };
