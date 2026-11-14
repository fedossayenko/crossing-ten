// Question kind 'coingrid': level 407 Монета на мястото — A 4 × 4 grid of coins with two in every row and column, one coin missing: on which letter it goes.

// Кенгуру 2022, 2 клас, задача 6: 7 coins in a 4 × 4 grid and the letters A–E on five empty squares; every row and every column must hold two
// coins. Only row 3 and column 3 have one, so the coin goes on their square, D (key D). The kind takes a full grid (two in every row and
// column), lifts one coin and letters five empty squares: the missing one, and slips that share its row, its column or neither.
import { KIND, rnd, shuffle, svgText, tr } from '../js/core.js';

const LET = 'ABCDE';
// every 4 × 4 grid of 0/1 with two ones in each row and each column
const FULL = [];
(function walk(/** @type {number[][]} */ rows, /** @type {number[]} */ cols){
  if(rows.length === 4){ if(cols.every(c => c === 2)) FULL.push(rows); return; }
  for(let a = 0; a < 4; a++) for(let b = a + 1; b < 4; b++){
    if(cols[a] > 1 || cols[b] > 1) continue;
    const r = [0, 0, 0, 0]; r[a] = r[b] = 1;
    walk(rows.concat([r]), cols.map((c, j) => c + r[j]));
  }
})([], [0, 0, 0, 0]);
/** where the coin goes: the one row and the one column that have a single coin */
export const coinWhere = (/** @type {number[][]} */ g) => [g.findIndex(row => row.reduce((s, x) => s + x, 0) === 1), [0, 1, 2, 3].find(j => g.reduce((s, row) => s + row[j], 0) === 1) ?? -1];
export function genCoinGrid(){
  const g = FULL[rnd(FULL.length)].map(r => r.slice()), ones = [];
  g.forEach((r, i) => r.forEach((x, j) => { if(x) ones.push([i, j]); }));
  const [r0, c0] = ones[rnd(ones.length)];
  g[r0][c0] = 0;
  const [r, c] = coinWhere(g);
  const empties = [];
  g.forEach((row, i) => row.forEach((x, j) => { if(!x && !(i === r && j === c)) empties.push([i, j]); }));
  const inRow = shuffle(empties.filter(([i]) => i === r)), inCol = shuffle(empties.filter(([, j]) => j === c)), rest = shuffle(empties.filter(([i, j]) => i !== r && j !== c));
  const a = rnd(2), b = rnd(2), wrong = inRow.slice(0, a).concat(inCol.slice(0, b), rest).slice(0, 4);
  const cells = shuffle([[r, c]].concat(wrong)), marks = cells.map(([i, j], k) => ({ i, j, l: LET[k] })), pick = cells.findIndex(([i, j]) => i === r && j === c);
  return {kind:'coingrid', g, marks, at: [r, c], options: LET.split('').map((l, id) => ({ id, v: id, text: [l, l] })), pick, own:true, ans: pick};
}
function gridSvg(q){
  const u = 44;
  let s = '';
  q.g.forEach((/** @type {number[]} */ row, /** @type {number} */ i) => row.forEach((x, j) => {
    s += '<rect x="' + (2 + j*u) + '" y="' + (2 + i*u) + '" width="' + u + '" height="' + u + '" fill="var(--solid)" stroke="var(--line)" stroke-width="2"/>';
    if(x) s += '<circle class="coin" cx="' + (2 + j*u + u/2) + '" cy="' + (2 + i*u + u/2) + '" r="16" fill="var(--warm)" stroke="var(--ink)" stroke-width="2"/>';
  }));
  q.marks.forEach((/** @type {{i: number, j: number, l: string}} */ m) => { s += svgText(2 + m.j*u + u/2, 2 + m.i*u + u/2 + 7, m.l, 21, 'var(--accent)', ' class="lt" font-style="italic"'); });
  return '<svg viewBox="0 0 ' + (4*u + 4) + ' ' + (4*u + 4) + '" style="display:block; width:200px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + tr('таблица 4 на 4 с монети; букви на празните места: ', 'таблиця 4 на 4 з монетами; літери на порожніх місцях: ') +
    q.marks.map((/** @type {{i: number, j: number, l: string}} */ m) => m.l + tr(' (ред ', ' (рядок ') + (m.i + 1) + tr(', колона ', ', стовпець ') + (m.j + 1) + ')').join('; ') + '">' + s + '</svg>';
}
function drawCoinGrid(q){
  return '<div class="ask">' + tr('Кръгчетата на картинката вдясно са монети. На мястото на коя от буквите A, B, C, D и E трябва да се постави монета, така че на всеки ред и на всеки стълб да има по две монети?',
    'Кружечки на малюнку праворуч — це монети. На місці якої з літер A, B, C, D і E треба покласти монету, щоб у кожному рядку й у кожному стовпці було по дві монети?') + '</div>' + gridSvg(q);
}
function eqCoinGrid(q){
  return tr('монета на ' + LET[q.pick] + ': ред ' + (q.at[0] + 1) + ' и колона ' + (q.at[1] + 1), 'монета на ' + LET[q.pick] + ': рядок ' + (q.at[0] + 1) + ' і стовпець ' + (q.at[1] + 1));
}
function whyCoinGrid(q, full){
  if(!full) return tr('Преброй монетите във всеки ред и във всяка колона. Кой ред и коя колона имат само една монета?', 'Порахуй монети в кожному рядку й стовпці. У якому рядку й стовпці лише одна монета?');
  const rows = q.g.map((/** @type {number[]} */ r) => r.reduce((s, x) => s + x, 0)), cols = [0, 1, 2, 3].map(j => q.g.reduce((/** @type {number} */ s, /** @type {number[]} */ r) => s + r[j], 0));
  return tr('Монети по редове: ', 'Монети за рядками: ') + rows.join(', ') + '<br>' + tr('Монети по колони: ', 'Монети за стовпцями: ') + cols.join(', ') + '<br>' +
    tr('Втора монета липсва само в ред ' + (q.at[0] + 1) + ' и в колона ' + (q.at[1] + 1) + ': монетата отива на ', 'Другої монети бракує лише в рядку ' + (q.at[0] + 1) + ' і в стовпці ' + (q.at[1] + 1) + ': монета йде на ') + '<b>' + LET[q.pick] + '</b>';
}
KIND.coingrid = { draw:drawCoinGrid, eq:eqCoinGrid, why:whyCoinGrid };
