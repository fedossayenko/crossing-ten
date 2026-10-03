// Question kind 'vtri': level 123 Връх A — How many triangles in a figure of lines have one given point as a corner.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Коледно 2024, задача 1: a rectangle of two squares with both its diagonals; A is where they
// cross. A triangle with a corner at A has its other two corners on two different lines through
// A, and those two corners joined by a third line: 3 on the top side, 3 on the bottom, 1 on each
// end — 8. Each figure is its points and its lines, a line listing every point on it in order.
const VTRI = [
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
function genVTri(){
  for(;;){
    const f = rnd(VTRI.length), F = VTRI[f], V = Math.random() < 0.6 ? 'o' : Object.keys(F.pts)[rnd(Object.keys(F.pts).length)];
    const n = vtriCount(F, V).length;
    if(n < 3) continue;
    return {kind:'vtri', f, V, ans: n};
  }
}
function vtriSvg(q){
  const F = VTRI[q.f], u = 44, P = n => F.pts[n].map(v => v*u);
  const w = Math.max(...Object.values(F.pts).map(p => p[0]))*u, h = 2*u;
  const [vx, vy] = P(q.V);
  return '<div class="fig"><svg viewBox="-16 -16 ' + (w + 32) + ' ' + (h + 32) + '" style="max-width:' + (w + 32)*1.3 + 'px" role="img" aria-label="' + tr('чертеж с отсечки', 'рисунок з відрізками') + '">' +
    F.lines.map(l => { const [x1, y1] = P(l[0]), [x2, y2] = P(l[l.length - 1]); return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="var(--ink)" stroke-width="1.6"/>'; }).join('') +
    Object.keys(F.pts).map(n => { const [x, y] = P(n); return '<circle cx="' + x + '" cy="' + y + '" r="' + (n === q.V ? 5 : 3) + '" fill="' + (n === q.V ? 'var(--accent)' : 'var(--ink)') + '"/>'; }).join('') +
    '<text x="' + (vx + (vx >= w ? -14 : 8)) + '" y="' + (vy + (vy >= h ? -8 : vy > 0 && vy < h ? 5 : 16)) + '" font-size="15" font-weight="800" fill="var(--accent)" font-family="Nunito, sans-serif">A</text></svg></div>';
}
// Коледно 2023, задача 1: a square, its two midlines and the rhombus through their ends — 12 triangles and
// 6 squares (the rhombus is one), so 6 more triangles. Коледно 2022, задача 6: a 3 × 3 grid with one inner line
// missing and a diagonal — 11 triangles and 11 squares. Every count is done here by trying every three or
// four points: a triangle's three sides lie on three different lines, a square's four on drawn lines.
// A grid's points are named by letter, row by row: (x, y) is 'abcdefghijklmnop'[4y + x].
const gp = (x, y) => 'abcdefghijklmnop'[4*y + x];
const gridPts = (W, H) => { const o = {}; for(let y = 0; y <= H; y++) for(let x = 0; x <= W; x++) o[gp(x, y)] = [x, y]; return o; };
const FIGS = [
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
function genFigCount(){
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
  if(q.kind === 'vtri' && q.shape === 'count'){
    const ask = [tr('Колко са <b>триъгълниците</b> на чертежа?', 'Скільки <b>трикутників</b> на рисунку?'), tr('Колко са <b>квадратите</b> на чертежа?', 'Скільки <b>квадратів</b> на рисунку?'),
      tr('С колко броят на триъгълниците е по-голям от броя на квадратите?', 'На скільки трикутників більше, ніж квадратів?')][q.asks];
    return '<div class="ask">' + ask + '</div>' + figSvg(q) + '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'vtri'){
    return '<div class="ask">' + tr('На колко триъгълника е <b>връх</b> точка A?', 'Скільки трикутників мають <b>вершину</b> в точці A?') + '</div>' +
      vtriSvg(q) + '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqVTri(q){
  if(q.kind === 'vtri' && q.shape === 'count') return tr('триъгълници ', 'трикутників ') + q.tri + tr(', квадрати ', ', квадратів ') + q.sq + ' → ' + q.ans;
  if(q.kind === 'vtri') return tr('триъгълници с връх A → ', 'трикутників з вершиною A → ') + q.ans;
}
function whyVTri(q, full){
  if(q.kind === 'vtri' && q.shape === 'count'){
    if(!full) return tr('Брой по големина: първо най-малките, после съставените от няколко. И големият квадрат се брои.', 'Рахуй за розміром: спершу найменші, потім складені з кількох. І великий квадрат теж рахується.');
    return tr('триъгълници: <b>', 'трикутників: <b>') + q.tri + tr('</b>, квадрати: <b>', '</b>, квадратів: <b>') + q.sq + '</b>' + (q.asks === 2 ? ' &nbsp;→&nbsp; ' + q.tri + ' − ' + q.sq + ' = ' + q.ans : '');
  }
  if(q.kind === 'vtri'){
    if(!full) return tr('От A тръгват няколко отсечки. Вземи две различни — триъгълник има, ако краищата им са свързани с трета отсечка.', 'Від A виходить кілька відрізків. Візьми два різні — трикутник є, якщо їхні кінці сполучені третім відрізком.');
    const F = VTRI[q.f], on = (p, r) => F.lines.find(l => l.includes(p) && l.includes(r));
    const by = {};
    vtriCount(F, q.V).forEach(t => { const l = on(t[1], t[2]); by[l] = (by[l] || 0) + 1; });
    return tr('по третата страна: ', 'за третьою стороною: ') + Object.values(by).join(' + ') + ' = ' + q.ans;
  }
}
KIND.vtri = { draw:drawVTri, eq:eqVTri, why:whyVTri };
