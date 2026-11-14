// Question kind 'pyrcol': level 409 Оцветена пирамида — A pyramid of 10 squares painted 4 + 3 + 2 + 1 in four colours so that equal colours never touch: the colour of the X.

// Кенгуру 2025, 2 клас, задача 23: the pyramid of 1, 2, 3 and 4 squares, 4 red, 3 blue, 2 green and 1 yellow, same colours not touching; the X
// (the middle of the third row) is red (key A). Every way of painting is tried: there are six, the four red squares are always the two corners of
// the base, the top and the middle of the third row, and every other square can be painted in more than one colour. So the X is red, or «not possible to
// tell» (the paper's option E). The colours are given to the numbers 4, 3, 2, 1 at random, and the X is on one of the ten squares.
import { KIND, rnd, shuffle, tr } from '../js/core.js';

const ROWS = 4;
// colour: name (Bulgarian: to paint «в …», the answer; Ukrainian: the same), token
const COL = [['червено', 'червен', 'червоний', 'червоний', 'var(--bad)'], ['синьо', 'син', 'синій', 'синій', 'var(--accent)'], ['зелено', 'зелен', 'зелений', 'зелений', 'var(--good)'], ['жълто', 'жълт', 'жовтий', 'жовтий', 'var(--lemon)']];
export const PYR_CELLS = (() => { const c = []; for(let r = 0; r < ROWS; r++) for(let i = 0; i <= r; i++) c.push([r, i]); return c; })();
/** the squares that share an edge with each square: in its row, and the two below and the two above it */
export const PYR_ADJ = PYR_CELLS.map(([r, i]) => PYR_CELLS.map((_c, j) => j).filter(j => { const [r2, i2] = PYR_CELLS[j]; return (r2 === r && Math.abs(i2 - i) === 1) || (r2 === r + 1 && (i2 === i || i2 === i + 1)) || (r2 === r - 1 && (i2 === i || i2 === i - 1)); }));
/** every painting with the given numbers of squares in each colour and no two touching of one colour: a colour for each square */
export function pyrPaintings(/** @type {number[]} */ counts){
  const out = [], col = Array(PYR_CELLS.length).fill(-1), rem = counts.slice();
  (function go(/** @type {number} */ k){
    if(k === PYR_CELLS.length){ out.push(col.slice()); return; }
    for(let x = 0; x < rem.length; x++){ if(!rem[x] || PYR_ADJ[k].some(j => j < k && col[j] === x)) continue; col[k] = x; rem[x]--; go(k + 1); rem[x]++; col[k] = -1; }
  })(0);
  return out;
}
const PAINT = pyrPaintings([4, 3, 2, 1]);
/** the colours the square can have in some painting */
export const pyrColours = (/** @type {number[][]} */ all, /** @type {number} */ cell) => [...new Set(all.map(p => p[cell]))];
export function genPyrCol(){
  const names = shuffle([0, 1, 2, 3]);   // names[n] = the colour that gets 4 − n squares
  const sure = PAINT.length ? PYR_CELLS.map((_c, k) => k).filter(k => pyrColours(PAINT, k).length === 1) : [];
  const unsure = PYR_CELLS.map((_c, k) => k).filter(k => !sure.includes(k));
  const x = rnd(2) ? sure[rnd(sure.length)] : unsure[rnd(unsure.length)];
  const opts = shuffle([0, 1, 2, 3, -1].map(c => ({ c })));   // the colours and «not possible to tell» in any order
  const right = pyrColours(PAINT, x).length === 1 ? names[PAINT[0][x]] : -1;   // painting colours are the numbers 0…3 = 4, 3, 2, 1 squares
  const pick = opts.findIndex(o => o.c === right);
  return {kind:'pyrcol', names, x, ans: pick, pick, own:true, options: opts.map((o, id) => ({ id, v: id, text: [optHtml(o.c, 0), optHtml(o.c, 1)] })), right};
}
const nameOf = (/** @type {number} */ c, /** @type {number} */ k) => COL[c][k ? 3 : 1];
function optHtml(/** @type {number} */ c, /** @type {number} */ k){
  if(c < 0) return k ? 'неможливо визначити' : 'не е възможно да се определи';
  return '<span style="display:inline-flex; align-items:center; gap:7px"><svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><rect x="2" y="2" width="16" height="16" rx="2" fill="' + COL[c][4] + '" stroke="var(--ink)" stroke-width="1.6"/></svg>' + nameOf(c, k) + '</span>';
}
function pyrSvg(q){
  const u = 34, W = ROWS*u + 6, H = ROWS*u + 6;
  let g = '';
  PYR_CELLS.forEach(([r, i], k) => {
    const x = 3 + (ROWS - 1 - r)*u/2 + i*u, y = 3 + r*u;
    g += '<rect x="' + x + '" y="' + y + '" width="' + u + '" height="' + u + '" fill="var(--paper)" stroke="var(--fur-dark)" stroke-width="2"/>';
    if(k === q.x) g += '<text class="px" x="' + (x + u/2) + '" y="' + (y + 24) + '" text-anchor="middle" font-size="20" font-weight="800" fill="var(--fur-dark)" font-family="Nunito, sans-serif">X</text>';
  });
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" style="display:block; width:200px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + tr('пирамида от квадратчета в 4 реда; X е в ред ' + (PYR_CELLS[q.x][0] + 1), 'піраміда з квадратиків у 4 рядках; X — у рядку ' + (PYR_CELLS[q.x][0] + 1)) + '">' + g + '</svg>';
}
function drawPyrCol(q){
  const n = q.names;
  return '<div class="ask">' + tr('Оцветете 4 от квадратчетата вдясно в ' + COL[n[0]][0] + ', 3 в ' + COL[n[1]][0] + ', 2 в ' + COL[n[2]][0] + ' и едно квадратче в ' + COL[n[3]][0] + ', така че квадратчетата с един и същ цвят да не се допират. <b>Какъв е цветът на квадратчето, означено с X?</b>',
    'Зафарбуйте 4 з квадратиків праворуч у ' + COL[n[0]][2] + ' колір, 3 — у ' + COL[n[1]][2] + ' колір, 2 — у ' + COL[n[2]][2] + ' колір і один квадратик — у ' + COL[n[3]][2] + ' колір, так щоб квадратики одного кольору не торкалися. <b>Якого кольору квадратик, позначений X?</b>') + '</div>' + pyrSvg(q);
}
function eqPyrCol(q){
  return q.right < 0 ? tr('не е възможно да се определи', 'неможливо визначити') : tr(nameOf(q.right, 0), nameOf(q.right, 1));
}
function whyPyrCol(q, full){
  if(!full) return tr('Най-много са квадратчетата в първия цвят: къде могат да са четирите, без да се допират? Опитай и виж дали X е винаги там.', 'Найбільше квадратиків першого кольору: де можуть стояти чотири, щоб не торкатися? Спробуй і подивись, чи X завжди там.');
  return tr('Четирите квадратчета в ' + COL[q.names[0]][0] + ' могат да стоят само на едно място: горе, в двата края на основата и в средата на третия ред. Всяко друго квадратче може да е с повече от един цвят.',
    'Чотири квадратики, зафарбовані у ' + COL[q.names[0]][2] + ' колір, можуть стояти лише в одному місці: вгорі, у двох кінцях основи й посередині третього рядка. Кожен інший квадратик може мати більше ніж один колір.') +
    '<br>' + (q.right < 0 ? tr('X не е на тези места: не е възможно да се определи.', 'X не на цих місцях: неможливо визначити.') : tr('X е на едно от тези места: ', 'X на одному з цих місць: ') + '<b>' + tr(nameOf(q.right, 0), nameOf(q.right, 1)) + '</b>');
}
KIND.pyrcol = { draw:drawPyrCol, eq:eqPyrCol, why:whyPyrCol };
