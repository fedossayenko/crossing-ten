// Question kind 'brickmap': level 516 Оцвети стената — A map of bricks in three rows: the fewest colours so that bricks that touch differ.

// Салабашев 2024, задача 15: three rows of bricks, 3 + 3 + 4 of them (cut at 4 and 8, at 2 and 10, at 3, 6 and 9 of a width of 12): every field gets a
// colour so that fields with a common border differ: at least 4 colours (the long middle brick touches all nine bricks round it and those nine
// make a ring of an odd length, which needs three colours by itself). Two bricks touch when they share a piece of border: bricks of one row
// that stand side by side, and bricks of neighbouring rows whose spans overlap by more than a point. The answer is the fewest colours, found by trying 2, 3, 4.
import { KIND, answerLine, popAt, rnd, svgFrame, tr } from '../js/core.js';
export const BRICK_W = 12;
/** rows of cuts: the places where a row is cut, from 2 to 10, at least two apart */
function cuts(){
  for(;;){
    const n = 1 + rnd(3), c = [];
    while(c.length < n){ const v = 2 + rnd(9); if(!c.some(x => Math.abs(x - v) < 2)) c.push(v); }
    return c.sort((a, b) => a - b);
  }
}
/** the bricks [row, from, to] of a map, and which pairs touch */
export function brickGraph(rows){
  const bricks = [];
  rows.forEach((cs, r) => { const e = [0].concat(cs, [BRICK_W]); for(let i = 0; i + 1 < e.length; i++) bricks.push([r, e[i], e[i + 1]]); });
  const edges = [];
  for(let i = 0; i < bricks.length; i++) for(let j = i + 1; j < bricks.length; j++){
    const [r1, a1, b1] = bricks[i], [r2, a2, b2] = bricks[j];
    if(r1 === r2 ? b1 === a2 || b2 === a1 : Math.abs(r1 - r2) === 1 && Math.min(b1, b2) > Math.max(a1, a2)) edges.push([i, j]);
  }
  return { bricks, edges };
}
/** a colouring of the bricks with k colours, or null */
export function brickColour(n, edges, k){
  const col = Array(n).fill(-1), adj = Array.from({ length: n }, () => []);
  edges.forEach(([a, b]) => { adj[a].push(b); adj[b].push(a); });
  const go = i => { if(i === n) return true; for(let c = 0; c < k; c++){ if(adj[i].some(j => col[j] === c)) continue; col[i] = c; if(go(i + 1)) return true; } col[i] = -1; return false; };
  return go(0) ? col : null;
}
export function brickFewest(n, edges){ for(let k = 1; k <= n; k++) if(brickColour(n, edges, k)) return k; return n; }
export function genBrickMap(){
  for(;;){
    const rows = [cuts(), cuts(), cuts()], { bricks, edges } = brickGraph(rows), ans = brickFewest(bricks.length, edges);
    if(bricks.length < 8 || bricks.length > 11 || ans < 3 || ans > 4) continue;
    if(ans === 3 && rnd(2)) continue;   // about as many fours as threes
    return {kind:'brickmap', rows, ans};
  }
}
const COLS = ['var(--accent)', 'var(--warm)', 'var(--good)', 'var(--grape)'];
function mapSvg(q, col, mark){
  const u = 24, h = 40, { bricks } = brickGraph(q.rows);
  return svgFrame('-3 -3 ' + (BRICK_W*u + 6) + ' ' + (3*h + 6), 300, tr('стена от полета в три реда', 'стіна з полів у три ряди')) + bricks.map(([r, a, b], i) =>
    '<g' + (col ? popAt(1 + i*0.3) : '') + '><rect x="' + a*u + '" y="' + r*h + '" width="' + (b - a)*u + '" height="' + h + '" fill="' + (col ? 'color-mix(in srgb, ' + COLS[col[i]] + ' 45%, var(--paper))' : 'none') + '" stroke="var(--ink)" stroke-width="' + (mark === i ? 3.6 : 1.8) + '"/></g>').join('') + '</svg>';
}
function drawBrickMap(q){
  return '<div class="ask">' + tr('Всяко от полетата на чертежа трябва да се оцвети в някакъв цвят, така че полетата с обща граница да са разноцветни. Най-малко колко цвята са необходими?',
    'Кожне з полів на рисунку треба зафарбувати якимось кольором так, щоб поля зі спільною межею були різнокольорові. Яка найменша кількість кольорів потрібна?') + '</div><div class="fig">' + mapSvg(q) + '</div>' + answerLine('xl');
}
function eqBrickMap(q){
  return tr('най-малко цвята: ', 'найменше кольорів: ') + q.ans;
}
function whyBrickMap(q, full){
  if(!full) return tr('Започни от поле, което граничи с много други — тези трябва да са различни от него и един от друг, ако и те се допират. Опитай първо с по-малко цвята, после с повече.', 'Почни з поля, що межує з багатьма іншими, — вони мають відрізнятися від нього й одне від одного, якщо теж торкаються. Спробуй спершу з меншою кількістю кольорів, потім з більшою.');
  const { bricks, edges } = brickGraph(q.rows), col = brickColour(bricks.length, edges, q.ans);
  return mapSvg(q, col) + tr('с ' + q.ans + ' цвята става: полетата с обща граница са разноцветни, а с ' + (q.ans - 1) + ' — не. Отговор: ', 'з ' + q.ans + ' кольорами виходить: поля зі спільною межею різнокольорові, а з ' + (q.ans - 1) + ' — ні. Відповідь: ') + q.ans;
}
KIND.brickmap = { draw:drawBrickMap, eq:eqBrickMap, why:whyBrickMap };
