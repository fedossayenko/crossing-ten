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
function drawVTri(q){
  if(q.kind === 'vtri'){
    return '<div class="ask">' + tr('На колко триъгълника е <b>връх</b> точка A?', 'Скільки трикутників мають <b>вершину</b> в точці A?') + '</div>' +
      vtriSvg(q) + '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqVTri(q){
  if(q.kind === 'vtri') return tr('триъгълници с връх A → ', 'трикутників з вершиною A → ') + q.ans;
}
function whyVTri(q, full){
  if(q.kind === 'vtri'){
    if(!full) return tr('От A тръгват няколко отсечки. Вземи две различни — триъгълник има, ако краищата им са свързани с трета отсечка.', 'Від A виходить кілька відрізків. Візьми два різні — трикутник є, якщо їхні кінці сполучені третім відрізком.');
    const F = VTRI[q.f], on = (p, r) => F.lines.find(l => l.includes(p) && l.includes(r));
    const by = {};
    vtriCount(F, q.V).forEach(t => { const l = on(t[1], t[2]); by[l] = (by[l] || 0) + 1; });
    return tr('по третата страна: ', 'за третьою стороною: ') + Object.values(by).join(' + ') + ' = ' + q.ans;
  }
}
KIND.vtri = { draw:drawVTri, eq:eqVTri, why:whyVTri };
