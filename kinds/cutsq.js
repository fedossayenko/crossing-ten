// Question kind 'cutsq': level 137 Квадратчета от лист — How many small squares can be cut from a sheet.

// МБГ Пролет 2025, задача 12: squares of side 4 см cut from a square of side 20 см: 5 along each side,
// 5 rows of 5, 25. On a rectangle whose sides do not divide exactly, the leftover strip is wasted.
import { KIND, SLOT, rnd, tr } from '../js/core.js';
export function genCutSq(){
  for(;;){
    const s = 2 + rnd(4), sq = Math.random() < 0.5, exact = Math.random() < 0.7;
    const m = 2 + rnd(5), n = sq ? m : 2 + rnd(5);
    const a = m*s + (exact ? 0 : rnd(s)), b = n*s + (exact || sq ? 0 : rnd(s));
    if(sq && !exact && a === m*s) continue;
    const W = a, H = sq ? a : b, ans = Math.floor(W / s)*Math.floor(H / s);
    if(W > 40 || H > 40) continue;
    return {kind:'cutsq', s, sq, W, H, traps: Number.isInteger(W*H / (s*s)) ? [] : [Math.round(W*H / (s*s))], ans};
  }
}
// Level 252. МБГ Есен 2024, 3 клас, задача 12: squares of side 3 см from a square of side 12 см — 4 rows of 4, 16.
// The 3rd grade asks it with the whole times table: small squares up to 9 см, up to 9 of them along a side.
export function genCutSq3(){
  for(;;){
    const s = 2 + rnd(8), sq = Math.random() < 0.5, exact = Math.random() < 0.7;
    const m = 3 + rnd(7), n = sq ? m : 3 + rnd(7);
    const W = m*s + (exact ? 0 : rnd(s)), H = sq ? W : n*s + (exact ? 0 : rnd(s));
    if(!exact && W % s === 0 && H % s === 0) continue;
    if(!sq && W === H || W > 60 || H > 60) continue;           // a «rectangle» with equal sides would be the square
    // the slip: the sheet's area shared out as if the strips left over could be used
    const ans = Math.floor(W / s)*Math.floor(H / s), area = Math.round(W*H / (s*s));
    return {kind:'cutsq', s, sq, W, H, traps: area === ans ? [] : [area], ans};
  }
}
function drawCutSq(q){
  const from = q.sq ? tr('квадрат със страна <span class="num">' + q.W + '</span> см', 'квадрата зі стороною <span class="num">' + q.W + '</span> см')
                    : tr('правоъгълник със страни <span class="num">' + q.W + '</span> см и <span class="num">' + q.H + '</span> см', 'прямокутника зі сторонами <span class="num">' + q.W + '</span> см і <span class="num">' + q.H + '</span> см');
  return '<div class="ask">' + tr('Колко <b>най-много</b> квадратчета със страна <span class="num">' + q.s + '</span> см можем да изрежем от ' + from + '?',
    'Скільки <b>найбільше</b> квадратиків зі стороною <span class="num">' + q.s + '</span> см можна вирізати з ' + from + '?') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqCutSq(q){
  return Math.floor(q.W / q.s) + ' · ' + Math.floor(q.H / q.s) + ' = ' + q.ans;
}
function whyCutSq(q, full){
  if(!full) return tr('Колко квадратчета се нареждат по едната страна — и колко такива реда се побират?', 'Скільки квадратиків уміститься вздовж однієї сторони — і скільки таких рядів?');
  const a = Math.floor(q.W / q.s), b = Math.floor(q.H / q.s);
  return tr('по едната страна: ', 'уздовж однієї сторони: ') + q.W + ' : ' + q.s + ' → <b>' + a + '</b>' + (q.W % q.s ? tr(' (остава ивица)', ' (лишається смужка)') : '') + ', ' + tr('по другата: ', 'уздовж другої: ') + q.H + ' : ' + q.s + ' → <b>' + b + '</b>' + (q.H % q.s ? tr(' (остава ивица)', ' (лишається смужка)') : '') + ' &nbsp;→&nbsp; ' + a + ' · ' + b + ' = ' + q.ans;
}
KIND.cutsq = { draw:drawCutSq, eq:eqCutSq, why:whyCutSq };
