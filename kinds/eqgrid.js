// Question kind 'eqgrid': level 491 Равенства в таблица — Four equalities joined in one grid, and the heart in the last.

// Салабашев 2019, задача 2: along the top ▢ + 23 = 32, along the left 50 − 5 = ▢, down the right of it ▢ + ▢ = ▢, along the bottom ▢ − ♡ = 16, the
// operators in grey boxes. The top one is 32 − 23 = 9, the left one 50 − 5 = 45, the column 9 + 45 = 54, and 54 − ♡ = 16 leaves ♡ = 38.
// q.a + q.b = q.c across the top, q.e − q.f = q.g across the left, q.a + q.g = q.h down the column, q.h − ♡ = q.k along the bottom.
import { KIND, SLOT, rnd, svgFrame, svgText, tr } from '../js/core.js';
export function genEqGrid(){
  for(;;){
    const a = 3 + rnd(38), b = 10 + rnd(31), e = 30 + rnd(41), f = 2 + rnd(24), g = e - f, h = a + g, k = 5 + rnd(Math.max(1, h - 10));
    if(a + b > 99 || h > 99 || h - k < 5) continue;
    return {kind:'eqgrid', a, b, c: a + b, e, f, g, h, k, ans: h - k};
  }
}
const U = 32;
/** the cells of the grid: [column, row, text, kind] with kind 'n' a number box, 'o' an operator in grey, 'x' the heart */
const cellsOf = (/** @type {any} */ q) => /** @type {[number, number, string|number, string][]} */ ([
  [4, 0, '', 'n'], [5, 0, '+', 'o'], [6, 0, q.b, 'n'], [7, 0, '=', 'o'], [8, 0, q.c, 'n'],
  [4, 1, '+', 'o'],
  [0, 2, q.e, 'n'], [1, 2, '−', 'o'], [2, 2, q.f, 'n'], [3, 2, '=', 'o'], [4, 2, '', 'n'],
  [4, 3, '=', 'o'],
  [4, 4, '', 'n'], [5, 4, '−', 'o'], [6, 4, '♡', 'x'], [7, 4, '=', 'o'], [8, 4, q.k, 'n'],
]);
function gridPic(/** @type {any} */ q){
  const s = cellsOf(q).map(([i, j, t, k]) => {
    const x = i*U + 2, y = j*U + 2, w = U - 4;
    if(k === 'o') return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + w + '" rx="4" fill="var(--line)"/>' + svgText(i*U + U/2, j*U + U/2 + 6, t, 18, 'var(--ink)');
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + w + '" rx="4" fill="var(--solid)" stroke="var(--ink)" stroke-width="1.6"/>' +
      (t === '' ? '' : svgText(i*U + U/2, j*U + U/2 + 6, t, k === 'x' ? 20 : 16, k === 'x' ? 'var(--bad)' : 'var(--ink)'));
  }).join('');
  return svgFrame('0 0 ' + 9*U + ' ' + 5*U, 340, tr('равенства в таблица', 'рівності в таблиці')) + s + '</svg>';
}
const heart = '<span class="circle">♡</span>';
function drawEqGrid(/** @type {any} */ q){
  return '<div class="ask">' + tr('Равенствата в таблицата са верни, по редове и по колони. Колко е ' + heart + '?', 'Рівності в таблиці правильні, по рядках і по стовпцях. Чому дорівнює ' + heart + '?') + '</div>' +
    '<div class="fig">' + gridPic(q) + '</div><div class="line md">' + heart + ' = ' + SLOT + '</div>';
}
const steps = (/** @type {any} */ q) => [q.c + ' − ' + q.b + ' = ' + q.a, q.e + ' − ' + q.f + ' = ' + q.g, q.a + ' + ' + q.g + ' = ' + q.h, q.h + ' − ' + q.k + ' = ' + q.ans];
function eqEqGrid(/** @type {any} */ q){ return steps(q).join(', '); }
function whyEqGrid(/** @type {any} */ q, /** @type {boolean} */ full){
  if(!full) return tr('Започни от равенство, в което липсва само едно число. Едното равенство е в горния ред, друго — в левия.', 'Почни з рівності, де бракує лише одного числа. Одна рівність у верхньому рядку, друга — у лівому.');
  const s = steps(q);
  return tr('Горе: ' + s[0] + '. Вляво: ' + s[1] + '. В колоната: ' + s[2] + '. Долу: ' + s[3].replace(/= (\d+)$/, '= <b>$1</b>') + '.',
    'Угорі: ' + s[0] + '. Ліворуч: ' + s[1] + '. У стовпці: ' + s[2] + '. Унизу: ' + s[3].replace(/= (\d+)$/, '= <b>$1</b>') + '.');
}
KIND.eqgrid = { draw:drawEqGrid, eq:eqEqGrid, why:whyEqGrid };
