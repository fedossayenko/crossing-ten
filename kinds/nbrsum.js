// Question kind 'nbrsum': level 384 Равни на съседите си — Numbers joined by lines: how many equal the sum of the numbers joined to them.

// Кенгуру 2024, 2 клас, задача 16: 3 7 / 12 1 5 / 4 2 10 are written on the nodes of a 3 × 3 net joined along the sides and the
// diagonals of the squares. For each number add the numbers it is joined to (for 3: 12 + 1 + 1 = 14); how many numbers equal
// their own sum? Only 7 (1 + 1 + 5), so 1. The net is drawn from the numbers, the answer is counted over every node.
import { KIND, answerLine, rnd, svgText, tr } from '../js/core.js';

const PRINTED = [[3, 1, 7], [12, 1, 5], [4, 2, 10]];
/** the numbers joined to the node at row i, column j: its side and corner neighbours */
export const nbrs = (g, i, j) => { const out = []; for(let a = -1; a <= 1; a++) for(let b = -1; b <= 1; b++) if((a || b) && g[i + a] && g[i + a][j + b] !== undefined) out.push(g[i + a][j + b]); return out; };
const total = a => a.reduce((s, x) => s + x, 0);
export const nbrMatches = g => { const m = []; g.forEach((row, i) => row.forEach((v, j) => { if(total(nbrs(g, i, j)) === v) m.push([i, j]); })); return m; };
/** the net turned or flipped one of the 8 ways */
const turned = (g, k) => { let t = g; for(let i = 0; i < k % 4; i++) t = t[0].map((_, j) => t.map(r => r[j]).reverse()); return k >= 4 ? t.map(r => r.slice().reverse()) : t; };
export function genNbrSum(){
  if(rnd(4) === 0){ const g = turned(PRINTED, rnd(8)); return {kind:'nbrsum', g, ans: nbrMatches(g).length}; }
  for(;;){
    const g = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => 1 + rnd(12)));
    for(let k = rnd(3); k > 0; k--){ const i = 2*rnd(2), j = 2*rnd(2), s = total(nbrs(g, i, j)); if(s <= 24) g[i][j] = s; }   // a corner made equal to its sum
    const ans = nbrMatches(g).length;
    if(ans <= 4) return {kind:'nbrsum', g, ans};
  }
}
/** the first node, in reading order, whose number is not its sum: the worked example */
const sample = q => { for(let i = 0; i < 3; i++) for(let j = 0; j < 3; j++) if(total(nbrs(q.g, i, j)) !== q.g[i][j]) return [i, j]; return [0, 0]; };
function netSvg(q){
  const st = 58, r = 18, W = 2*st + 2*r + 6;
  let g = '';
  for(let i = 0; i < 3; i++) for(let j = 0; j < 3; j++){
    if(j < 2) g += '<line x1="' + (r + 3 + j*st) + '" y1="' + (r + 3 + i*st) + '" x2="' + (r + 3 + (j + 1)*st) + '" y2="' + (r + 3 + i*st) + '"/>';
    if(i < 2) g += '<line x1="' + (r + 3 + j*st) + '" y1="' + (r + 3 + i*st) + '" x2="' + (r + 3 + j*st) + '" y2="' + (r + 3 + (i + 1)*st) + '"/>';
    if(i < 2 && j < 2) g += '<line x1="' + (r + 3 + j*st) + '" y1="' + (r + 3 + i*st) + '" x2="' + (r + 3 + (j + 1)*st) + '" y2="' + (r + 3 + (i + 1)*st) + '"/><line x1="' + (r + 3 + (j + 1)*st) + '" y1="' + (r + 3 + i*st) + '" x2="' + (r + 3 + j*st) + '" y2="' + (r + 3 + (i + 1)*st) + '"/>';
  }
  g = '<g stroke="var(--muted)" stroke-width="2">' + g + '</g>';
  for(let i = 0; i < 3; i++) for(let j = 0; j < 3; j++)
    g += '<circle cx="' + (r + 3 + j*st) + '" cy="' + (r + 3 + i*st) + '" r="' + r + '" fill="var(--accentbg)" stroke="var(--accent)" stroke-width="2"/>' + svgText(r + 3 + j*st, r + 3 + i*st + 6, q.g[i][j], 18, 'var(--ink)');
  return '<svg viewBox="0 0 ' + W + ' ' + W + '" style="display:block; width:' + (W*1.3) + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + tr('числа във възли, свързани с линии: ', 'числа у вузлах, з’єднаних лініями: ') + q.g.map(r => r.join(', ')).join('; ') + '">' + g + '</svg>';
}
const sumText = (q, i, j) => nbrs(q.g, i, j).sort((a, b) => b - a).join(' + ') + ' = ' + total(nbrs(q.g, i, j));
function drawNbrSum(q){
  const [i, j] = sample(q);
  return '<div class="ask">' + tr('За всяко от числата вдясно пресмятаме сбора на съседните му числа, т.е. пресмятаме сбора на тези, които са свързани непосредствено с него. Например сборът, съответен на числото ' + q.g[i][j] + ', е ' + sumText(q, i, j) + '. Колко от числата вдясно са равни на съответните им сборове?',
    'Для кожного з чисел праворуч обчислюємо суму сусідніх чисел, тобто суму тих, що з’єднані з ним безпосередньо. Наприклад, сума, що відповідає числу ' + q.g[i][j] + ', дорівнює ' + sumText(q, i, j) + '. Скільки з чисел праворуч дорівнюють відповідним їм сумам?') + '</div>' + netSvg(q) + answerLine('xl');
}
function eqNbrSum(q){
  return nbrMatches(q.g).map(([i, j]) => q.g[i][j] + ' = ' + nbrs(q.g, i, j).join(' + ')).join('; ') + (q.ans ? ' → ' + q.ans : '0');
}
function whyNbrSum(q, full){
  if(!full) return tr('За всяко число събери числата, свързани с него, и сравни сбора със самото число. Брой само тези, при които са равни.', 'Для кожного числа додай числа, з’єднані з ним, і порівняй суму з самим числом. Рахуй лише ті, де вони рівні.');
  const lines = [];
  q.g.forEach((row, i) => row.forEach((v, j) => lines.push(v + ': ' + sumText(q, i, j) + (total(nbrs(q.g, i, j)) === v ? ' &nbsp;<b>=</b>' : ' &nbsp;≠'))));
  return lines.join('<br>') + '<br>' + tr('равни са ', 'рівні ') + '<b>' + q.ans + '</b>';
}
KIND.nbrsum = { draw:drawNbrSum, eq:eqNbrSum, why:whyNbrSum };
