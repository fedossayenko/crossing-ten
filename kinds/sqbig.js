// Question kind 'sqbig': level 401 Квадрат с голям сбор — A table 1, 2, 3, … and a 2 × 2 square whose sum is over a number: which number must be in it.

// Кенгуру 2019, 2 клас, задача 23: the table 1–20 in 4 rows of 5; a square of four small squares has a sum over 63. A square at n adds
// n + (n + 1) + (n + 5) + (n + 6) = 4n + 12, so only 13 (64) and 14 (68) are over 63: both hold 14 (and 19), so 14 is certainly in it (key A).
// The answer is a number among five, so the kind brings its own options: one number from every such square, three held by only one
// of them, and one held by none (as the paper: 14, 15, 18, 20 and 17). The other number the squares share is never offered.
import { KIND, rnd, shuffle, svgText, tr } from '../js/core.js';

const SIZES = [[4, 5], [4, 6], [5, 5], [5, 4]];   // rows, columns of the table
/** every 2 × 2 square of a table numbered 1… along the rows: the numbers in it and their sum */
export function bigSquares(/** @type {number} */ R, /** @type {number} */ C){
  const out = [];
  for(let r = 0; r + 1 < R; r++) for(let c = 0; c + 1 < C; c++){ const n = r*C + c + 1, cells = [n, n + 1, n + C, n + C + 1]; out.push({ cells, sum: cells.reduce((s, x) => s + x, 0) }); }
  return out;
}
export function genSqBig(){
  const [R, C] = SIZES[rnd(SIZES.length)], sq = bigSquares(R, C).sort((a, b) => b.sum - a.sum);
  const S = sq[2].sum + rnd(sq[1].sum - sq[2].sum);   // over S: exactly the two biggest squares, side by side
  const common = sq[0].cells.filter(x => sq[1].cells.includes(x)), union = [...new Set(sq[0].cells.concat(sq[1].cells))];
  const right = common[rnd(common.length)], only = shuffle(union.filter(x => !common.includes(x))).slice(0, 3);
  const outside = shuffle(Array.from({ length: R*C }, (_, i) => i + 1).filter(x => !union.includes(x)));
  const nums = [right].concat(only, outside.slice(0, 1)).sort((a, b) => a - b), pick = nums.indexOf(right);
  return {kind:'sqbig', R, C, S, right, nums, options: nums.map((n, id) => ({ id, v: id, text: [String(n), String(n)] })), pick, own:true, ans: pick};
}
function tableSvg(q){
  const u = 36, W = q.C*u + 4, H = q.R*u + 4;
  let g = '';
  for(let r = 0; r < q.R; r++) for(let c = 0; c < q.C; c++)
    g += '<rect x="' + (2 + c*u) + '" y="' + (2 + r*u) + '" width="' + u + '" height="' + u + '" fill="var(--solid)" stroke="var(--line)" stroke-width="1.5"/>' + svgText(2 + c*u + u/2, 2 + r*u + 24, r*q.C + c + 1, 17, 'var(--ink)', ' class="cn"');
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" style="display:block; width:' + Math.min(W*1.5, 340) + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('таблица с числата от 1 до ' + q.R*q.C + ' в ' + q.R + ' реда', 'таблиця з числами від 1 до ' + q.R*q.C + ' у ' + q.R + ' рядках') + '">' + g + '</svg>';
}
function drawSqBig(q){
  return '<div class="ask">' + tr('Петър избрал от показаната таблица един квадрат, съставен от четири малки квадратчета, така че сборът от числата в него е по-голям от ' + q.S + '. <b>Кое от числата по-долу със сигурност е било в избрания квадрат?</b>',
    'Петро вибрав із показаної таблиці один квадрат із чотирьох маленьких клітинок так, що сума чисел у ньому більша за ' + q.S + '. <b>Яке з наведених нижче чисел точно було у вибраному квадраті?</b>') + '</div>' + tableSvg(q);
}
const over = (/** @type {{R: number, C: number, S: number}} */ q) => bigSquares(q.R, q.C).filter(s => s.sum > q.S);
function eqSqBig(q){
  return over(q).map(s => s.cells.join(' + ') + ' = ' + s.sum).join('; ') + ' → ' + q.right;
}
function whySqBig(q, full){
  if(!full) return tr('Кои квадрати имат сбор над ' + q.S + '? Много големите числа са долу вдясно. Кое число е във всички такива квадрати?', 'Які квадрати мають суму понад ' + q.S + '? Великі числа — внизу праворуч. Яке число є в усіх таких квадратах?');
  return over(q).map(s => s.cells.join(' + ') + ' = ' + s.sum).join('<br>') + '<br>' + tr('И в двата квадрата има ', 'В обох квадратах є ') + '<b>' + q.right + '</b>';
}
KIND.sqbig = { draw:drawSqBig, eq:eqSqBig, why:whySqBig };
