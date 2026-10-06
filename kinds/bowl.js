// Question kind 'bowl': level 190 Фруктиерата — Apples and lemons, and how many of them are yellow.

// МБГ Пролет 2022, 1 клас, задача 17: apples and lemons in a bowl; 6 apples, 2 of them yellow; 11 yellow
// fruit in all — how many fruit? Every lemon is yellow, so the yellow ones that are not apples are the
// lemons: 11 − 2 = 9, and 6 + 9 = 15. Пролет 2021 asks the same with 8 apples, 5 yellow, 11 yellow: 14.
// Полуфинал 2022, задача 17: 6 apples, 4 of them yellow, 11 yellow in all — 7 lemons, 13 fruit.
import { KIND, SLOT, popAt, rnd, svgText, tr } from '../js/core.js';
export function genBowl(){
  for(;;){
    const A = 3 + rnd(7), k = 1 + rnd(A - 1), Y = k + 1 + rnd(10);
    if(A + Y - k > 20) continue;
    return {kind:'bowl', A, k, Y, traps:[A + Y, A + Y - k - k], ans: A + Y - k};
  }
}
// the solution's picture: the apples, the yellow ones yellow, then the lemons that make up the yellow count
function bowlSvg(q){
  const L = q.Y - q.k, per = 10, W = 26, row = (n, y, f, t0) => { let g = ''; for(let i = 0; i < n; i++){ const x = 16 + (i % per)*W, yy = y + Math.floor(i / per)*26;
    g += '<g' + popAt(t0 + i*0.3) + '>' + f(x, yy, i) + '</g>'; } return g; };
  const apple = (x, y, i) => '<circle cx="' + x + '" cy="' + y + '" r="9" fill="' + (i < q.k ? 'var(--lemon)' : 'var(--apple)') + '"/><path d="M' + x + ',' + (y - 9) + ' v-4" stroke="var(--ant)" stroke-width="1.6"/>';
  const lemon = (x, y) => '<ellipse cx="' + x + '" cy="' + y + '" rx="10" ry="7" fill="var(--lemon)" stroke="var(--warm)" stroke-width="1"/>';
  const rowsA = Math.ceil(q.A / per), yL = 20 + rowsA*26 + 12, rowsL = Math.ceil(L / per), H = yL + rowsL*26 + 24;
  return '<svg viewBox="0 0 ' + (24 + per*W) + ' ' + H + '" style="display:block; width:300px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + tr('ябълките и лимоните', 'яблука й лимони') + '">' +
    row(q.A, 20, apple, 1) + row(L, yL, lemon, 2 + q.A*0.3) +
    svgText(150, H - 6, q.A + ' + ' + L + ' = ' + q.ans, 14, 'var(--ink)', popAt(3 + (q.A + L)*0.3)) + '</svg>';
}
function drawBowl(q){
  return '<div class="ask">' + tr('Във фруктиера има ябълки и лимони. Ябълките са <span class="num">' + q.A + '</span>, от които <span class="num">' + q.k + '</span> ' + (q.k === 1 ? 'е жълта' : 'са жълти') +
    '. Жълтите плодове са общо <span class="num">' + q.Y + '</span>. Колко <b>общо</b> са плодовете във фруктиерата?',
    'У вазі для фруктів є яблука й лимони. Яблук <span class="num">' + q.A + '</span>, з них <span class="num">' + q.k + '</span> ' + (q.k === 1 ? 'жовте' : q.k < 5 ? 'жовті' : 'жовтих') +
    '. Жовтих фруктів усього <span class="num">' + q.Y + '</span>. Скільки <b>всього</b> фруктів у вазі?') + '</div>' +
    '<div class="note">' + tr('Лимоните са жълти.', 'Лимони — жовті.') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqBowl(q){
  return q.Y + ' − ' + q.k + ' = ' + (q.Y - q.k) + ', ' + q.A + ' + ' + (q.Y - q.k) + ' = ' + q.ans;
}
function whyBowl(q, full){
  if(!full) return tr('Кои плодове са жълти? Не само ябълките.', 'Які фрукти жовті? Не лише яблука.');
  const L = q.Y - q.k;
  return tr('жълтите са жълтите ябълки и всички лимони &nbsp;→&nbsp; лимоните са ' + q.Y + ' − ' + q.k + ' = <b>' + L + '</b> &nbsp;→&nbsp; ' + q.A + ' + ' + L + ' = ' + q.ans,
    'жовті — це жовті яблука й усі лимони &nbsp;→&nbsp; лимонів ' + q.Y + ' − ' + q.k + ' = <b>' + L + '</b> &nbsp;→&nbsp; ' + q.A + ' + ' + L + ' = ' + q.ans) + bowlSvg(q);
}
KIND.bowl = { draw:drawBowl, eq:eqBowl, why:whyBowl };
