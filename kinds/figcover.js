// Question kind 'figcover': level 406 Покрити числа — A 3 × 3 table of numbers and five-square figures laid on it: the one that covers the most.

// Кенгуру 2023, 2 клас, задача 22: the table 1 6 7 / 9 5 4 / 2 8 3 and five figures of five squares that fit the 3 × 3 table exactly (the L, the
// steps, the cross, the S and the F); the one covers 6 + 7 + 9 + 5 + 8 = 35, the most (key E). The answer is a picture, so the kind brings its own
// five options: five different figures of that size. The one with the largest sum is not the only one over the biggest number
// of the table, and not the only one that stays off the smallest.
import { KIND, rnd, shuffle, svgText, tr } from '../js/core.js';

// five-square figures that fill a 3 × 3 box, as rows of 0/1: the L (V), steps (W), cross (X), T, F, S (Z)
const BASE = [['100', '100', '111'], ['100', '110', '011'], ['010', '111', '010'], ['111', '010', '010'], ['011', '110', '010'], ['110', '010', '011']];
const turn = (/** @type {string[]} */ m) => [0, 1, 2].map(j => [2, 1, 0].map(i => m[i][j]).join(''));
const flip = (/** @type {string[]} */ m) => m.map(r => [...r].reverse().join(''));
/** every way up a figure can lie in the box (a symmetric figure has fewer) */
export const FIG_TURNS = BASE.map(b => { const out = []; let m = b; for(let f = 0; f < 2; f++){ for(let t = 0; t < 4; t++){ if(!out.includes(m.join('/'))) out.push(m.join('/')); m = turn(m); } m = flip(m); } return out; });
export const figCells = (/** @type {string} */ f) => { const out = []; f.split('/').forEach((r, i) => [...r].forEach((x, j) => { if(x === '1') out.push([i, j]); })); return out; };
export const figSum = (/** @type {number[][]} */ t, /** @type {string} */ f) => figCells(f).reduce((s, [i, j]) => s + t[i][j], 0);
export function genFigCover(){
  for(;;){
    const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]), table = [0, 1, 2].map(i => nums.slice(i*3, i*3 + 3));
    const figs = shuffle([0, 1, 2, 3, 4, 5]).slice(0, 5).map(b => FIG_TURNS[b][rnd(FIG_TURNS[b].length)]);
    const sums = figs.map(f => figSum(table, f)), m = Math.max(...sums), pick = sums.indexOf(m);
    if(sums.filter(x => x === m).length !== 1) continue;
    const at = (/** @type {number} */ v) => { const p = nums.indexOf(v); return [Math.floor(p / 3), p % 3]; };
    const over = (/** @type {number} */ v) => { const [i, j] = at(v); return figs.map((f, k) => k).filter(k => figCells(figs[k]).some(([a, b]) => a === i && b === j)); };
    if(over(9).length === 1 && over(9)[0] === pick) continue;                 // the figure over the 9 is not the answer by that alone
    if(over(1).length === 4 && !over(1).includes(pick)) continue;             // nor the one figure that misses the 1
    return {kind:'figcover', table, figs, options: figs.map((f, id) => ({ id, v: id, text: [figPic(f, 0), figPic(f, 1)] })), pick, own:true, ans: pick};
  }
}
function figPic(/** @type {string} */ f, /** @type {number} */ k){
  const u = 22;
  const g = figCells(f).map(([i, j]) => '<rect x="' + (3 + j*u) + '" y="' + (3 + i*u) + '" width="' + u + '" height="' + u + '" fill="var(--accentbg)" stroke="var(--accent)" stroke-width="2"/>').join('');
  return '<svg viewBox="0 0 72 72" width="72" height="72" role="img" aria-label="' + (k ? 'фігурка з 5 квадратиків у квадраті 3 на 3: ' : 'фигурка от 5 квадратчета в квадрат 3 на 3: ') +
    f.split('/').map((r, i) => (i + 1) + (k ? ' рядок ' : ' ред ') + [...r].map((x, j) => x === '1' ? j + 1 : '').filter(Boolean).join(', ')).join('; ') + '">' + g + '</svg>';
}
function tableSvg(q){
  const u = 38;
  let g = '';
  q.table.forEach((/** @type {number[]} */ row, /** @type {number} */ i) => row.forEach((n, j) => {
    g += '<rect x="' + (2 + j*u) + '" y="' + (2 + i*u) + '" width="' + u + '" height="' + u + '" fill="var(--solid)" stroke="var(--accent)" stroke-width="1.8"/>' + svgText(2 + j*u + u/2, 2 + i*u + 26, n, 20, 'var(--ink)', ' class="cn"');
  }));
  return '<svg viewBox="0 0 ' + (3*u + 4) + ' ' + (3*u + 4) + '" style="display:block; width:150px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + tr('таблица 3 на 3: ', 'таблиця 3 на 3: ') +
    q.table.map((/** @type {number[]} */ r) => r.join(' ')).join('; ') + '">' + g + '</svg>';
}
function drawFigCover(q){
  return '<div class="ask">' + tr('Коя от посочените по-долу фигурки трябва да се постави върху таблицата вдясно така, че сборът на покритите 5 числа да е най-голям?',
    'Яку з наведених нижче фігурок треба покласти на таблицю праворуч так, щоб сума п’яти накритих чисел була найбільшою?') + '</div>' + tableSvg(q);
}
const termsOf = (/** @type {{table: number[][], figs: string[]}} */ q, /** @type {number} */ k) => figCells(q.figs[k]).map(([i, j]) => q.table[i][j]);
function eqFigCover(q){
  return termsOf(q, q.pick).join(' + ') + ' = ' + figSum(q.table, q.figs[q.pick]);
}
function whyFigCover(q, full){
  if(!full) return tr('Положи мислено всяка фигурка върху таблицата и събери петте покрити числа. Сравни сборовете.', 'Поклади подумки кожну фігурку на таблицю й додай п’ять накритих чисел. Порівняй суми.');
  return q.figs.map((_f, k) => 'АБВГД'[k] + ') ' + termsOf(q, k).join(' + ') + ' = ' + figSum(q.table, q.figs[k]) + (k === q.pick ? ' &nbsp;<b>←</b>' : '')).join('<br>') + '<br>' + tr('Най-голям е сборът ', 'Найбільша сума — ') + '<b>' + figSum(q.table, q.figs[q.pick]) + '</b>';
}
KIND.figcover = { draw:drawFigCover, eq:eqFigCover, why:whyFigCover };
