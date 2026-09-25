// Question kind 'tripts': level 113 Триъгълници от точки — Triangles with corners at given points.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Зима 2020, задача 17: five points in a plus. Any three make a triangle unless they lie on one
// line — and the plus has two such lines of three: 10 threes − 2 = 8. Counted over every three.
const TRIPTS = [
  [[1,0],[0,1],[1,1],[2,1],[1,2]],             // the paper's plus
  [[0,1],[1,1],[2,1],[1,0]],                   // a row of three and one above
  [[0,0],[2,0],[0,2],[2,2],[1,1]],             // a square and its middle
  [[0,1],[1,1],[2,1],[0,0],[2,2]],             // a row of three and two off it
  [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1]]        // two rows of three
];
const triCollinear = ([a, b], [c, d], [e, f]) => (c - a)*(f - b) === (d - b)*(e - a);
function genTriPts(){
  const pts = TRIPTS[rnd(TRIPTS.length)];
  let all = 0, flat = 0;
  for(let i = 0; i < pts.length; i++) for(let j = i + 1; j < pts.length; j++) for(let k = j + 1; k < pts.length; k++){ all++; if(triCollinear(pts[i], pts[j], pts[k])) flat++; }
  return {kind:'tripts', dots: pts, all, flat, ans: all - flat};
}
function triPtsSvg(pts){
  const u = 36;
  return '<div class="fig"><svg viewBox="-12 -12 ' + (2*u + 24) + ' ' + (2*u + 24) + '" style="max-width:150px" role="img" aria-label="' + tr('точки', 'точки') + '">' +
    pts.map(([x, y]) => '<circle cx="' + x*u + '" cy="' + y*u + '" r="5" fill="var(--ink)"/>').join('') + '</svg></div>';
}
function drawTriPts(q){
  if(q.kind === 'tripts'){
    return '<div class="ask">' + tr('Колко са триъгълниците с върхове <b>3 от точките</b> на чертежа?', 'Скільки трикутників із вершинами в <b>3 з точок</b> на рисунку?') + '</div>' +
      triPtsSvg(q.dots) + '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqTriPts(q){
  if(q.kind === 'tripts') return q.all + ' − ' + q.flat + ' = ' + q.ans;
}
function whyTriPts(q, full){
  if(q.kind === 'tripts'){
    if(!full) return tr('Всеки три точки дават триъгълник — освен ако са на една права.', 'Будь-які три точки дають трикутник — якщо тільки вони не на одній прямій.');
    return tr('всички тройки точки: <b>', 'усіх трійок точок: <b>') + q.all + '</b>, ' + tr('на една права: <b>', 'на одній прямій: <b>') + q.flat + '</b> &nbsp;→&nbsp; ' + q.all + ' − ' + q.flat + ' = ' + q.ans;
  }
}
KIND.tripts = { draw:drawTriPts, eq:eqTriPts, why:whyTriPts };
