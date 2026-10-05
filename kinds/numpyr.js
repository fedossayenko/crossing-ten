// Question kind 'numpyr': level 124 Пирамиди от числа — Two number pyramids that share a row, and the stars at their tips.

// Коледно 2024, задача 7: in the upper pyramid each box is the sum of the two below it, in the
// lower one of the two above; the rows joined by = are the same. From 0, 1, 1 and the 3 and 6
// shown, the base is 0, 1, 1, 2, 1, so the top star is 19; the lower pyramid stands on 2, 1, 14,
// so its star is 3 + 15 = 18, and 19 − 18 = 1.
// Коледно 2023, задача 9: one pyramid of five rows, each box the sum of the two under it. Only 99 at the top,
// 55, 22, 22 and 11 are shown; the letters are found row by row, from wherever only one box is missing:
// A = 99 − 55 = 44, Б = 33, В = 22, then down to the base. (A+Б+В) − (Г+Д+Е+Ж+З+И+К) = 99 − 55 = 44 (here A … M).
// rows[r][i]: row r from the top. Shown are the paper's five places; every other box has a letter.
import { KIND, SLOT, rnd, tr } from '../js/core.js';
export const PYR_SHOWN = [[0, 0], [1, 0], [2, 1], [3, 0], [4, 3]];
// ponytail: Latin letters where the paper has А, Б, … — «И» and «Е» would read as words to check.js's Ukrainian test
/** @type {[number, number, string][]} */
export const PYR_LET = [[1, 1, 'A'], [2, 0, 'B'], [2, 2, 'C'], [3, 1, 'D'], [3, 2, 'E'], [3, 3, 'F'], [4, 0, 'G'], [4, 1, 'H'], [4, 2, 'K'], [4, 4, 'M']];
function pyrRows(base){ const rows = [base]; while(rows[0].length > 1) rows.unshift(rows[0].slice(1).map((v, i) => rows[0][i] + v)); return rows; }
function genPyrOne(){
  for(;;){
    const base = [0, 0, 0, 0, 0].map(() => rnd(13)), rows = pyrRows(base);
    if(rows[0][0] > 99 || rows[0][0] < 30) continue;
    const up = PYR_LET.slice(0, 3).reduce((t, [r, i]) => t + rows[r][i], 0), low = PYR_LET.slice(3).reduce((t, [r, i]) => t + rows[r][i], 0);
    const asks = up - low >= 0 && Math.random() < 0.7 ? -1 : rnd(PYR_LET.length);
    return {kind:'numpyr', shape:'one', rows, up, low, asks, ans: asks < 0 ? up - low : rows[PYR_LET[asks][0]][PYR_LET[asks][1]]};
  }
}
function pyrOneSvg(q){
  const w = 34, h = 26;
  let s = '';
  for(let r = 0; r < 5; r++) for(let i = 0; i <= r; i++){
    const x = (4 - r)*w/2 + i*w, y = r*h, shown = PYR_SHOWN.some(([a, b]) => a === r && b === i), L = PYR_LET.find(([a, b]) => a === r && b === i);
    s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="none" stroke="var(--ink)" stroke-width="1.4"/>' +
      (shown ? '<text x="' + (x + w/2) + '" y="' + (y + 18) + '" text-anchor="middle" font-size="14" font-weight="800" fill="var(--ink)" font-family="Nunito, sans-serif">' + q.rows[r][i] + '</text>' : '') +
      (L ? '<text x="' + (x + 4) + '" y="' + (y + 11) + '" font-size="10" font-weight="800" fill="var(--accent)" font-family="Nunito, sans-serif">' + L[2] + '</text>' : '');
  }
  return '<div class="fig"><svg viewBox="-3 -3 ' + (5*w + 6) + ' ' + (5*h + 6) + '" style="height:clamp(110px,19vh,170px)" role="img" aria-label="' + tr('пирамида от числа', 'піраміда з чисел') + '">' + s + '</svg></div>';
}
const pyrLetSum = (from, to) => PYR_LET.slice(from, to).map(x => x[2]).join('+');
export function genNumPyr(){
  if(Math.random() < 0.3) return genPyrOne();
  for(;;){
    const b = [rnd(4), rnd(5), 1 + rnd(4), 1 + rnd(5), rnd(6)], z = 5 + rnd(16);
    const r1 = b.slice(1).map((v, i) => b[i] + v), r2 = r1.slice(1).map((v, i) => r1[i] + v), r3 = r2.slice(1).map((v, i) => r2[i] + v);
    const top = r3[0] + r3[1], bot = b[3] + 2*b[4] + z, asks = rnd(3);
    if(asks === 2 && top <= bot) continue;
    return {kind:'numpyr', b, z, r1, r2, top, bot, asks, ans: asks === 0 ? top : asks === 1 ? bot : top - bot};
  }
}
function numPyrSvg(q){
  const w = 30, h = 24, cell = (x, y, t, star) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + (star ? 'var(--solid)' : 'none') + '" stroke="var(--ink)" stroke-width="1.4"/>' +
    (t === '' ? '' : '<text x="' + (x + w/2) + '" y="' + (y + 17) + '" text-anchor="middle" font-size="14" font-weight="800" fill="' + (star ? 'var(--accent)' : 'var(--ink)') + '" font-family="Nunito, sans-serif">' + t + '</text>');
  let s = '';
  // the upper pyramid: row r from the top has r + 1 boxes; what the paper shows is filled in
  const shown = [['★'], ['', ''], ['', '', q.r2[2]], [q.r1[0], '', q.r1[2], ''], [q.b[0], q.b[1], q.b[2], '', '']];
  shown.forEach((row, r) => row.forEach((t, i) => { s += cell((4 - r)*w/2 + i*w, r*h, t, t === '★'); }));
  s += cell(5*w, 4*h, q.z);
  for(let i = 0; i < 6; i++) s += '<text x="' + (i*w + w/2) + '" y="' + (5*h + 17) + '" text-anchor="middle" font-size="16" font-weight="800" fill="var(--muted)" font-family="Nunito, sans-serif">‖</text>';
  [q.b[0], q.b[1], q.b[2], '', '', ''].forEach((t, i) => { s += cell(i*w, 6*h, t); });
  s += cell(3.5*w, 7*h, '') + cell(4.5*w, 7*h, '') + cell(4*w, 8*h, '★', true);
  return '<div class="fig tall"><svg viewBox="-4 -4 ' + (6*w + 8) + ' ' + (9*h + 8) + '" role="img" aria-label="' + tr('две пирамиди от числа', 'дві піраміди з чисел') + '">' + s + '</svg></div>';
}
function drawNumPyr(q){
  if(q.shape === 'one'){
    const ask = q.asks < 0 ? tr('пресметнете <span class="num">(' + pyrLetSum(0, 3) + ') − (' + pyrLetSum(3) + ')</span>', 'обчисліть <span class="num">(' + pyrLetSum(0, 3) + ') − (' + pyrLetSum(3) + ')</span>')
      : tr('кое число стои на мястото на буквата <b>' + PYR_LET[q.asks][2] + '</b>?', 'яке число стоїть на місці букви <b>' + PYR_LET[q.asks][2] + '</b>?');
    return '<div class="ask">' + tr('Всяко число в пирамидата е сборът на двете под него. След като замените буквите с числа, ', 'Кожне число в піраміді — сума двох чисел під ним. Замінивши букви числами, ') + ask + '</div>' +
      pyrOneSvg(q) + '<div class="line xl">' + SLOT + '</div>';
  }
  const ask = q.asks === 2 ? tr('Колко е <b>разликата</b> от числата, които трябва да се запишат на мястото на звездичките?', 'Чому дорівнює <b>різниця</b> чисел, які треба записати замість зірочок?')
    : tr('Кое число трябва да се запише на мястото на звездичката в <b>' + (q.asks ? 'долната' : 'горната') + '</b> пирамида?', 'Яке число треба записати замість зірочки в <b>' + (q.asks ? 'нижній' : 'верхній') + '</b> піраміді?');
  return '<div class="ask">' + tr('В горната пирамида всяко число е сборът от двете под него, а в долната — от двете над него. Редовете, свързани с ‖, са еднакви. ',
    'У верхній піраміді кожне число — сума двох під ним, а в нижній — двох над ним. Ряди, з’єднані знаком ‖, однакові. ') + ask + '</div>' +
    numPyrSvg(q) + '<div class="line xl">' + SLOT + '</div>';
}
function eqNumPyr(q){
  if(q.shape === 'one') return q.asks < 0 ? q.up + ' − ' + q.low + ' = ' + q.ans : PYR_LET[q.asks][2] + ' = ' + q.ans;
  return tr('долният ред ', 'нижній ряд ') + q.b.join(', ') + ' → ★ ' + q.top + ', ★ ' + q.bot + ' → ' + q.ans;
}
function whyNumPyr(q, full){
  if(q.shape === 'one'){
    if(!full) return tr('Търси две съседни кутии, на които знаеш едната и тази над тях. Горе се изважда, долу се събира.', 'Шукай дві сусідні клітинки, де відома одна з них і та, що над ними. Згори віднімаєш, знизу додаєш.');
    const v = (/** @type {[number, number, string]} */ [r, i]) => q.rows[r][i];
    return PYR_LET.map(L => L[2] + ' = ' + v(L)).join(', ') + ' &nbsp;→&nbsp; ' + (q.asks < 0 ? '(' + PYR_LET.slice(0, 3).map(v).join(' + ') + ') − (' + PYR_LET.slice(3).map(v).join(' + ') + ') = ' + q.up + ' − ' + q.low + ' = ' + q.ans : q.ans);
  }
  if(!full) return tr('Първо допълни най-долния ред на горната пирамида: кое число с известното до него дава числото над тях?', 'Спершу доповни найнижчий ряд верхньої піраміди: яке число разом із сусіднім дає число над ними?');
  const [b0, b1, b2, b3, b4] = q.b;
  const up = q.r1[2] + ' − ' + b2 + ' = <b>' + b3 + '</b>, ' + q.r2[2] + ' − ' + q.r1[2] + ' = ' + q.r1[3] + ', ' + q.r1[3] + ' − ' + b3 + ' = <b>' + b4 + '</b>';
  const top = tr('горе: ', 'угорі: ') + q.r2.join(', ') + ' → ' + (q.r2[0] + q.r2[1]) + ', ' + (q.r2[1] + q.r2[2]) + ' → <b>' + q.top + '</b>';
  const bot = tr('долу: ', 'унизу: ') + b3 + ', ' + b4 + ', ' + q.z + ' → ' + (b3 + b4) + ', ' + (b4 + q.z) + ' → <b>' + q.bot + '</b>';
  return up + ' &nbsp;→&nbsp; ' + (q.asks === 1 ? bot : q.asks === 0 ? top : top + '; ' + bot + ' &nbsp;→&nbsp; ' + q.top + ' − ' + q.bot + ' = ' + q.ans);
}
KIND.numpyr = { draw:drawNumPyr, eq:eqNumPyr, why:whyNumPyr };
