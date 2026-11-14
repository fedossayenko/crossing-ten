// Question kind 'vtri': level 123 Връх A — How many triangles in a figure of lines have one given point as a corner.

// Коледно 2024, задача 1: a rectangle of two squares with both its diagonals; A is where they
// cross. A triangle with a corner at A has its other two corners on two different lines through
// A, and those two corners joined by a third line: 3 on the top side, 3 on the bottom, 1 on each
// end — 8. Each figure is its points and its lines, a line listing every point on it in order.
import { KIND, SVG_FONT, answerLine, popAt, rnd, tr } from '../js/core.js';
export const VTRI = [
  { pts:{a:[0,0], b:[2,0], c:[4,0], d:[0,2], e:[2,2], f:[4,2], o:[2,1]},                         // the paper's
    lines:['abc', 'def', 'ad', 'cf', 'boe', 'aof', 'doc'] },
  { pts:{a:[0,0], c:[2,0], d:[0,2], f:[2,2], o:[1,1]}, lines:['ac', 'df', 'ad', 'cf', 'aof', 'doc'] },  // a square and its diagonals
  { pts:{a:[0,0], b:[1,0], c:[2,0], d:[0,2], e:[1,2], f:[2,2], o:[1,1]},                         // the same, halved upright
    lines:['abc', 'def', 'ad', 'cf', 'boe', 'aof', 'doc'] },
  { pts:{a:[0,0], b:[2,0], c:[4,0], d:[0,2], e:[2,2], f:[4,2], o:[2,1], g:[0,1], h:[4,1]},       // the paper's, halved across too
    lines:['abc', 'def', 'agd', 'chf', 'boe', 'aof', 'doc', 'goh'] }
];
function vtriCount(F, V){
  const on = (p, q) => F.lines.find(l => l.includes(p) && l.includes(q));
  const names = Object.keys(F.pts).filter(p => p !== V), out = [];
  for(let i = 0; i < names.length; i++) for(let j = i + 1; j < names.length; j++){
    const P = names[i], R = names[j], l1 = on(V, P), l2 = on(V, R);
    if(l1 && l2 && l1 !== l2 && on(P, R)) out.push(V + P + R);
  }
  return out;
}
export function genVTri(){
  for(;;){
    const f = rnd(VTRI.length), F = VTRI[f], V = Math.random() < 0.6 ? 'o' : Object.keys(F.pts)[rnd(Object.keys(F.pts).length)];
    const n = vtriCount(F, V).length;
    if(n < 3) continue;
    return {kind:'vtri', f, V, ans: n};
  }
}
// Level 284 Елхичката. Аз и числата 2025, задача 1: a fir tree of three triangles, each one's top poking up into the one
// above. Three big triangles — and where each top pokes in, the base above cuts off a small one: 3 + 2 = 5. A tree of n
// has n big and n − 1 small. The trap is to count only the big ones (shape 'tree').
export function genTreeCount(){
  const n = 2 + rnd(4);
  return {kind:'vtri', shape:'tree', n, traps:[n, n - 1, 2*n].filter(v => v !== 2*n - 1), ans: 2*n - 1};
}
// the tree's triangles, top down: [apex x, apex y, half width, height]; each top 16 above the base over it
const treeTris = n => Array.from({ length: n }, (_, i) => [70, 8 + i*30, 34 + 8*i, 46]);
function treeSvg(q, full){
  const T = treeTris(q.n), H = 8 + (q.n - 1)*30 + 46 + 8, tri = t => { const [x, y, h, d] = t; return 'M' + x + ' ' + y + 'L' + (x + h) + ' ' + (y + d) + 'L' + (x - h) + ' ' + (y + d) + 'Z'; };
  // the small one under each base: the top of the next triangle, down to that base
  const small = T.slice(1).map(([x, y, h, d], i) => { const by = T[i][1] + T[i][3], k = (by - y) / d * h; return 'M' + x + ' ' + y + 'L' + (x + k) + ' ' + by + 'L' + (x - k) + ' ' + by + 'Z'; });
  return '<svg viewBox="0 0 140 ' + H + '"' + (full ? ' style="display:block; height:' + Math.min(170, H*1.2) + 'px; margin:6px auto 0"' : '') + ' role="img" aria-label="' + tr('елха от триъгълници', 'ялинка з трикутників') + '">' +
    (full ? small.map((d, i) => '<path d="' + d + '" fill="var(--warm)" opacity="0.45"' + popAt(i + 1) + '/>').join('') : '') +
    T.map(t => '<path d="' + tri(t) + '" fill="none" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round"/>').join('') + '</svg>';
}
function drawTree(q){
  return '<div class="ask">' + tr('Колко са <b>триъгълниците</b> в елхичката?', 'Скільки <b>трикутників</b> у ялинці?') + '</div><div class="fig">' + treeSvg(q, false) + '</div>' + answerLine('xl');
}
function whyTree(q, full){
  if(!full) return tr('Не само големите: виж къде върхът на всеки триъгълник влиза в този над него.', 'Не лише великі: подивись, де верхівка кожного трикутника заходить у той, що над ним.');
  return tr('големи: <b>', 'великих: <b>') + q.n + tr('</b>; малки, където върхът влиза в триъгълника отгоре: <b>', '</b>; малих, де верхівка заходить у трикутник згори: <b>') + (q.n - 1) + '</b>' + treeSvg(q, true) +
    q.n + ' + ' + (q.n - 1) + ' = ' + q.ans;
}
function vtriSvg(q){
  const F = VTRI[q.f], u = 44, P = n => F.pts[n].map(v => v*u);
  const w = Math.max(...Object.values(F.pts).map(p => p[0]))*u, h = 2*u;
  const [vx, vy] = P(q.V);
  return '<div class="fig"><svg viewBox="-16 -16 ' + (w + 32) + ' ' + (h + 32) + '" style="max-width:' + (w + 32)*1.3 + 'px" role="img" aria-label="' + tr('чертеж с отсечки', 'рисунок з відрізками') + '">' +
    F.lines.map(l => { const [x1, y1] = P(l[0]), [x2, y2] = P(l[l.length - 1]); return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="var(--ink)" stroke-width="1.6"/>'; }).join('') +
    Object.keys(F.pts).map(n => { const [x, y] = P(n); return '<circle cx="' + x + '" cy="' + y + '" r="' + (n === q.V ? 5 : 3) + '" fill="' + (n === q.V ? 'var(--accent)' : 'var(--ink)') + '"/>'; }).join('') +
    '<text x="' + (vx + (vx >= w ? -14 : 8)) + '" y="' + (vy + (vy >= h ? -8 : vy > 0 && vy < h ? 5 : 16)) + '" font-size="15" font-weight="800" fill="var(--accent)" ' + SVG_FONT + '>A</text></svg></div>';
}
// Коледно 2023, задача 1: a square, its two midlines and the rhombus through their ends — 12 triangles and
// 6 squares (the rhombus is one), so 6 more triangles. Коледно 2022, задача 6: a 3 × 3 grid with one inner line
// missing and a diagonal — 11 triangles and 11 squares. Every count is done here by trying every three or
// four points: a triangle's three sides lie on three different lines, a square's four on drawn lines.
// A grid's points are named by letter, row by row: (x, y) is 'abcdefghijklmnop'[4y + x].
const gp = (x, y) => 'abcdefghijklmnop'[4*y + x];
const gridPts = (W, H) => { const o = {}; for(let y = 0; y <= H; y++) for(let x = 0; x <= W; x++) o[gp(x, y)] = [x, y]; return o; };
export const FIGS = [
  { pts:{a:[0,0], b:[1,0], c:[2,0], g:[0,1], o:[1,1], h:[2,1], d:[0,2], e:[1,2], f:[2,2]},                    // Коледно 2023
    lines:['abc', 'def', 'agd', 'chf', 'boe', 'goh', 'bh', 'he', 'eg', 'gb'] },
  { pts:gridPts(3, 3), lines:['abcd', 'efgh', 'ijkl', 'mnop', 'aeim', 'bfjn', 'cgk', 'dhlp', 'afkp'] },        // Коледно 2022
  { pts:{a:[0,0], b:[1,0], c:[2,0], g:[0,1], o:[1,1], h:[2,1], d:[0,2], e:[1,2], f:[2,2]},                    // midlines and diagonals
    lines:['abc', 'def', 'agd', 'chf', 'boe', 'goh', 'aof', 'doc'] },
  { pts:gridPts(3, 2), lines:['abcd', 'efgh', 'ijkl', 'aei', 'bfj', 'cgk', 'dhl', 'afk'] },                   // a 3 × 2 grid and a slant
  { pts:gridPts(2, 2), lines:['abc', 'efg', 'ijk', 'aei', 'bfj', 'cgk', 'afk'] },                             // 2 × 2 and one diagonal
  { pts:gridPts(3, 3), lines:['abcd', 'efgh', 'ijkl', 'mnop', 'aeim', 'bfj', 'cgko', 'dhlp', 'afkp'] }         // 3 × 3, a line missing, a diagonal
];
function figCount(F){
  const on = (p, q) => F.lines.find(l => l.includes(p) && l.includes(q)), N = Object.keys(F.pts);
  let tri = 0, sq = 0;
  for(let i = 0; i < N.length; i++) for(let j = i + 1; j < N.length; j++) for(let k = j + 1; k < N.length; k++){
    const l1 = on(N[i], N[j]), l2 = on(N[j], N[k]), l3 = on(N[i], N[k]);
    if(l1 && l2 && l3 && l1 !== l2 && l2 !== l3 && l1 !== l3) tri++;
  }
  const d2 = (p, q) => (F.pts[p][0] - F.pts[q][0])**2 + (F.pts[p][1] - F.pts[q][1])**2;
  for(let i = 0; i < N.length; i++) for(let j = i + 1; j < N.length; j++) for(let k = j + 1; k < N.length; k++) for(let m = k + 1; m < N.length; m++){
    const P = [N[i], N[j], N[k], N[m]];
    // the order round the square: the point farthest from P[0] is its opposite corner
    const opp = P.slice(1).sort((x, y) => d2(P[0], y) - d2(P[0], x))[0], rest = P.slice(1).filter(x => x !== opp), [A, B] = rest;
    const s = d2(P[0], A);
    if(!s || d2(P[0], B) !== s || d2(opp, A) !== s || d2(opp, B) !== s || d2(P[0], opp) !== 2*s) continue;
    if([[P[0], A], [A, opp], [opp, B], [B, P[0]]].every(([x, y]) => on(x, y))) sq++;
  }
  return {tri, sq};
}
export function genFigCount(){
  for(;;){
    const f = rnd(FIGS.length), {tri, sq} = figCount(FIGS[f]), asks = rnd(3);
    if(asks === 2 && tri <= sq) continue;
    return {kind:'vtri', shape:'count', f, tri, sq, asks, traps:[asks === 0 ? sq : asks === 1 ? tri : tri + sq], ans: asks === 0 ? tri : asks === 1 ? sq : tri - sq};
  }
}
function figSvg(q){
  const F = FIGS[q.f], u = 40, P = n => F.pts[n].map(v => v*u), xs = Object.values(F.pts).map(p => p[0]), ys = Object.values(F.pts).map(p => p[1]);
  const w = Math.max(...xs)*u, h = Math.max(...ys)*u;
  return '<div class="fig"><svg viewBox="-4 -4 ' + (w + 8) + ' ' + (h + 8) + '" style="max-width:' + (w + 8)*1.5 + 'px" role="img" aria-label="' + tr('чертеж от отсечки', 'рисунок із відрізків') + '">' +
    F.lines.map(l => { const [x1, y1] = P(l[0]), [x2, y2] = P(l[l.length - 1]); return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="var(--ink)" stroke-width="2" stroke-linecap="round"/>'; }).join('') + '</svg></div>';
}
function drawVTri(q){
  if(q.shape === 'tris') return '<div class="ask">' + tr('Колко са <b>триъгълниците</b> на фигурата?', 'Скільки <b>трикутників</b> на фігурі?') + '</div>' + trisSvg(q) + answerLine('xl');
  if(q.shape === 'tree') return drawTree(q);
  if(q.shape === 'count'){
    const ask = [tr('Колко са <b>триъгълниците</b> на чертежа?', 'Скільки <b>трикутників</b> на рисунку?'), tr('Колко са <b>квадратите</b> на чертежа?', 'Скільки <b>квадратів</b> на рисунку?'),
      tr('С колко броят на триъгълниците е по-голям от броя на квадратите?', 'На скільки трикутників більше, ніж квадратів?')][q.asks];
    return '<div class="ask">' + ask + '</div>' + figSvg(q) + answerLine('xl');
  }
  return '<div class="ask">' + tr('На колко триъгълника е <b>връх</b> точка A?', 'Скільки трикутників мають <b>вершину</b> в точці A?') + '</div>' +
    vtriSvg(q) + answerLine('xl');
}
function eqVTri(q){
  if(q.shape === 'tris') return tr('триъгълници → ', 'трикутників → ') + q.ans;
  if(q.shape === 'tree') return tr('големи ', 'великих ') + q.n + tr(', малки ', ', малих ') + (q.n - 1) + ' → ' + q.ans;
  if(q.shape === 'count') return tr('триъгълници ', 'трикутників ') + q.tri + tr(', квадрати ', ', квадратів ') + q.sq + ' → ' + q.ans;
  return tr('триъгълници с връх A → ', 'трикутників з вершиною A → ') + q.ans;
}
function whyVTri(q, full){
  if(q.shape === 'tris') return full ? tr('триъгълници: <b>', 'трикутників: <b>') + q.ans + '</b>' : tr('Брой по големина: първо най-малките, после тези, съставени от няколко. Всеки триъгълник има три страни върху начертани отсечки.', 'Рахуй за розміром: спершу найменші, потім складені з кількох. Кожен трикутник має три сторони на накреслених відрізках.');
  if(q.shape === 'tree') return whyTree(q, full);
  if(q.shape === 'count'){
    if(!full) return tr('Брой по големина: първо най-малките, после съставените от няколко. И големият квадрат се брои.', 'Рахуй за розміром: спершу найменші, потім складені з кількох. І великий квадрат теж рахується.');
    return tr('триъгълници: <b>', 'трикутників: <b>') + q.tri + tr('</b>, квадрати: <b>', '</b>, квадратів: <b>') + q.sq + '</b>' + (q.asks === 2 ? ' &nbsp;→&nbsp; ' + q.tri + ' − ' + q.sq + ' = ' + q.ans : '');
  }
  if(!full) return tr('От A тръгват няколко отсечки. Вземи две различни — триъгълник има, ако краищата им са свързани с трета отсечка.', 'Від A виходить кілька відрізків. Візьми два різні — трикутник є, якщо їхні кінці сполучені третім відрізком.');
  const F = VTRI[q.f], on = (p, r) => F.lines.find(l => l.includes(p) && l.includes(r));
  const by = {};
  vtriCount(F, q.V).forEach(t => { const l = on(t[1], t[2]); by[l] = (by[l] || 0) + 1; });
  return tr('по третата страна: ', 'за третьою стороною: ') + Object.values(by).join(' + ') + ' = ' + q.ans;
}
KIND.vtri = { draw:drawVTri, eq:eqVTri, why:whyVTri };
// Салабашев 2 клас: how many triangles in a figure of segments (shape 'tris'): 2019 #7 a heptagon with chords and a line (14), 2022 #4 a ring of
// the triangular lattice round an empty hexagon (20), 2023 #8 a rectangle open at the top with four crossing lines (14). A figure is its
// segments; every crossing is a point, a triangle is three points not on one line whose three sides are each covered by drawn segments.
// The rectangle's variants move the top point along the open side.
const TRI_E = 1e-6;
function arrangeSegs(segs){
  const P = [], add = (x, y) => { if(!P.some(p => Math.hypot(p[0] - x, p[1] - y) < TRI_E)) P.push([x, y]); };
  segs.forEach(([x1, y1, x2, y2]) => { add(x1, y1); add(x2, y2); });
  for(let i = 0; i < segs.length; i++) for(let j = i + 1; j < segs.length; j++){
    const [x1, y1, x2, y2] = segs[i], [x3, y3, x4, y4] = segs[j], d = (x2 - x1)*(y4 - y3) - (y2 - y1)*(x4 - x3);
    if(Math.abs(d) < 1e-9) continue;
    const t = ((x3 - x1)*(y4 - y3) - (y3 - y1)*(x4 - x3)) / d, u = ((x3 - x1)*(y2 - y1) - (y3 - y1)*(x2 - x1)) / d;
    if(t >= -TRI_E && t <= 1 + TRI_E && u >= -TRI_E && u <= 1 + TRI_E) add(x1 + t*(x2 - x1), y1 + t*(y2 - y1));
  }
  return P;
}
// collinear segments that overlap or touch become one longer segment
function mergeSegs(segs){
  const groups = [];
  for(const [x1, y1, x2, y2] of segs){
    const L = Math.hypot(x2 - x1, y2 - y1), dx = (x2 - x1)/L, dy = (y2 - y1)/L;
    let g = groups.find(g => Math.abs(g.dx*dy - g.dy*dx) < 1e-6 && Math.abs((x1 - g.x)*g.dy - (y1 - g.y)*g.dx) < 1e-6);
    if(!g) groups.push(g = { x:x1, y:y1, dx, dy, iv:[] });
    const a = (x1 - g.x)*g.dx + (y1 - g.y)*g.dy, b = (x2 - g.x)*g.dx + (y2 - g.y)*g.dy;
    g.iv.push([Math.min(a, b), Math.max(a, b)]);
  }
  const out = [];
  for(const g of groups){
    const m = [];
    g.iv.sort((a, b) => a[0] - b[0]).forEach(v => { if(m.length && v[0] <= m[m.length - 1][1] + TRI_E) m[m.length - 1][1] = Math.max(m[m.length - 1][1], v[1]); else m.push([...v]); });
    m.forEach(([lo, hi]) => out.push([g.x + lo*g.dx, g.y + lo*g.dy, g.x + hi*g.dx, g.y + hi*g.dy]));
  }
  return out;
}
export function triCount(segs){
  const P = arrangeSegs(segs);
  const onSeg = (p, [x1, y1, x2, y2]) => Math.abs((x2 - x1)*(p[1] - y1) - (y2 - y1)*(p[0] - x1)) < 1e-6 && Math.min(x1, x2) - TRI_E <= p[0] && p[0] <= Math.max(x1, x2) + TRI_E && Math.min(y1, y2) - TRI_E <= p[1] && p[1] <= Math.max(y1, y2) + TRI_E;
  const drawn = (p, r) => segs.some(s => onSeg(p, s) && onSeg(r, s));
  let n = 0;
  for(let a = 0; a < P.length; a++) for(let b = a + 1; b < P.length; b++) for(let c = b + 1; c < P.length; c++)
    if(Math.abs((P[b][0] - P[a][0])*(P[c][1] - P[a][1]) - (P[b][1] - P[a][1])*(P[c][0] - P[a][0])) > 1e-6 && drawn(P[a], P[b]) && drawn(P[b], P[c]) && drawn(P[a], P[c])) n++;
  return n;
}
const hexRing = (() => { const h = Math.sqrt(3)/2, lp = (i, j) => [i + j/2, j*h], hd = (i, j) => Math.max(Math.abs(i), Math.abs(j), Math.abs(i + j)), s = [];
  for(let i = -2; i <= 2; i++) for(let j = -2; j <= 2; j++) if(hd(i, j) && hd(i, j) <= 2) for(const [di, dj] of [[1, 0], [0, 1], [-1, 1]]){
    const k = i + di, l = j + dj; if(hd(k, l) && hd(k, l) <= 2) s.push([...lp(i, j), ...lp(k, l)]); }
  return s; })();
const hept = (() => { const T = [2.16, 0], UL = [0.46, 0.8], UR = [3.82, 0.8], L = [0, 2.66], R = [4.26, 2.66], BL = [1.2, 4.14], BR = [3.1, 4.14];
  return [[T, UL], [UL, L], [L, BL], [BL, BR], [BR, R], [R, UR], [UR, T], [L, R], [UL, BL], [T, BL], [T, BR], [UR, BR]].map(([a, b]) => [...a, ...b]); })();
const openBox = ax => [[0, 0, 0, 2], [4, 0, 4, 2], [0, 2, 4, 2], [0, 0, 4, 2], [4, 0, 0, 2], [ax, 0, 0, 2], [ax, 0, 4, 2]];
/** the figures: the three printed ones first, then the rectangle with its top point moved to a quarter (flipped, the other quarter) */
export const TRI_FIGS = [hept, hexRing, openBox(2), openBox(1)].map(raw => {
  const m = mergeSegs(raw), x0 = Math.min(...m.flatMap(s => [s[0], s[2]])), y0 = Math.min(...m.flatMap(s => [s[1], s[3]])), segs = m.map(([a, b, c, d]) => [a - x0, b - y0, c - x0, d - y0]);   // the top left corner at 0, 0
  return { segs, tri: triCount(segs) };
});
export function genTriFig(){
  const f = rnd(TRI_FIGS.length), flip = rnd(2);
  return {kind:'vtri', shape:'tris', f, flip, ans: TRI_FIGS[f].tri};
}
function trisSvg(q){
  const F = TRI_FIGS[q.f], u = 40, xs = F.segs.flatMap(s => [s[0], s[2]]), w = Math.max(...xs), h = Math.max(...F.segs.flatMap(s => [s[1], s[3]])), X = x => (q.flip ? w - x : x)*u;
  return '<div class="fig"><svg viewBox="-4 -4 ' + (w*u + 8) + ' ' + (h*u + 8) + '" style="max-width:' + (w*u + 8)*1.5 + 'px" role="img" aria-label="' + tr('чертеж от отсечки', 'рисунок із відрізків') + '">' +
    F.segs.map(([x1, y1, x2, y2]) => '<line x1="' + X(x1).toFixed(1) + '" y1="' + (y1*u).toFixed(1) + '" x2="' + X(x2).toFixed(1) + '" y2="' + (y2*u).toFixed(1) + '" stroke="var(--ink)" stroke-width="2" stroke-linecap="round"/>').join('') + '</svg></div>';
}
