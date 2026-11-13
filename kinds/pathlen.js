// Question kind 'pathlen': level 350 Най-дълга пътека — Five paths drawn on a grid: which is the longest, or the shortest.

// Кенгуру 2021, 2 клас, задача 3: five paths along the lines of a grid, which is the longest? Count the little sides each one runs along. Кенгуру 2025,
// задача 4: five little kangaroos go to their mothers across the same grid, each by a path with some steps up and down; which is the shortest? Every path
// crosses the whole width, so only what it goes up and down differs. The answer is a picture, so the kind brings its own А–Д: the paths drawn on a grid,
// the right one the only longest (or shortest), the slip the path with the most (or fewest) bends, which is not the one that runs the farthest.
import { KIND, rnd, shuffle, svgFrame, tr } from '../js/core.js';
const W = 10, S = 11;   // the kangaroos' grid: 10 across; a square
// a path is a list of lattice points [x, y]; its length is the little sides it runs along
export const pathSides = pts => pts.reduce((n, p, i) => i ? n + Math.abs(p[0] - pts[i - 1][0]) + Math.abs(p[1] - pts[i - 1][1]) : 0, 0);
// a kangaroo's path across a grid W wide from row s: jumps [[x, dy]], x growing; the points it passes
export const kangPath = (s, jumps) => {
  /** @type {number[][]} */
  const pts = [[0, s]];
  let y = s;
  jumps.forEach(([x, dy]) => { pts.push([x, y], [x, y + dy]); y += dy; });
  pts.push([W, y]);
  return pts;
};
// the five paths of a question, as points
export const pathsOf = q => q.paths.map(p => q.shape === 'kang' ? kangPath(q.s, p) : p);
// which of the paths is the longest (or shortest): the index, or -1 where two tie for it
export function pathPick(paths, longest){
  const L = paths.map(pathSides), best = longest ? Math.max(...L) : Math.min(...L);
  return L.filter(v => v === best).length === 1 ? L.indexOf(best) : -1;
}
// a path with n sides on the 6 × 5 lattice (0–5 across, 0–4 down), never going over a point twice
function walk(n){
  for(;;){
    const at = [rnd(6), rnd(5)], pts = [at], seen = new Set([at.join()]);
    const go = () => {
      if(pts.length === n + 1) return true;
      const [x, y] = pts[pts.length - 1];
      for(const [dx, dy] of shuffle([[1, 0], [-1, 0], [0, 1], [0, -1]])){
        const nx = x + dx, ny = y + dy;
        if(nx < 0 || nx > 5 || ny < 0 || ny > 4 || seen.has(nx + ',' + ny)) continue;
        pts.push([nx, ny]); seen.add(nx + ',' + ny);
        if(go()) return true;
        pts.pop(); seen.delete(nx + ',' + ny);
      }
      return false;
    };
    if(go()) return pts;
  }
}
// the corners of a walk: its shape without the points in the middle of a straight run
const corners = pts => pts.filter((p, i) => !i || i === pts.length - 1 || (p[0] - pts[i - 1][0]) * (pts[i + 1][1] - p[1]) !== (p[1] - pts[i - 1][1]) * (pts[i + 1][0] - p[0]));
function genWalk(longest){
  for(;;){
    const top = longest ? 12 + rnd(5) : 8 + rnd(3), lens = [top];
    // the others: one a single side off, the rest further off
    for(let i = 0; i < 4; i++) lens.push(longest ? top - 1 - (i ? rnd(5) : 0) : top + 1 + (i ? rnd(5) : 0));
    if(lens.some(v => v < 6 || v > 17)) continue;
    const ps = lens.map(walk), keys = ps.map(p => corners(p).join(';'));
    if(new Set(keys).size < 5) continue;
    const order = shuffle([0, 1, 2, 3, 4]);
    return {kind:'pathlen', shape:'walk', longest, paths: order.map(i => corners(ps[i])), s: 0, pick: order.indexOf(0), own: true};
  }
}
function genKang(longest){
  for(;;){
    const s = 3 + rnd(4), jumps = [];
    for(let i = 0; i < 5; i++){
      const k = 1 + rnd(3), xs = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, k).sort((a, b) => a - b), js = [];
      let y = s;
      for(const x of xs){ const ys = [1, 2, 3, 4].flatMap(d => [d, -d]).filter(d => y + d >= 0 && y + d < S); const dy = ys[rnd(ys.length)]; js.push([x, dy]); y += dy; }
      jumps.push(js);
    }
    const V = jumps.map(js => js.reduce((n, [, dy]) => n + Math.abs(dy), 0)), best = longest ? Math.max(...V) : Math.min(...V);
    if(V.filter(v => v === best).length !== 1) continue;
    const at = V.indexOf(best), bends = jumps.map(j => j.length);
    // the slip: some other path has fewer bends than the shortest (more than the longest), and is not what the answer is
    if(!jumps.some((j, i) => i !== at && (longest ? j.length > bends[at] : j.length < bends[at]))) continue;
    const order = shuffle([0, 1, 2, 3, 4]);
    return {kind:'pathlen', shape:'kang', longest, s, paths: order.map(i => jumps[i]), pick: order.indexOf(at), own: true};
  }
}
export function genPathLen(){
  const longest = Math.random() < 0.5;
  const q = Math.random() < 0.5 ? genKang(longest) : genWalk(longest);
  q.options = q.paths.map((_, id) => ({ id, v: id, text: [pathSvg(q, id, 0), pathSvg(q, id, 1)] }));
  q.ans = q.pick;
  return q;
}
const LET = ['А', 'Б', 'В', 'Г', 'Д'];
export function pathSvg(q, i, uk){
  const kang = q.shape === 'kang', pts = pathsOf(q)[i], cols = kang ? W : 5, rows = kang ? W : 4, u = kang ? 11 : 20;
  const x = p => 4 + p[0] * u, y = p => 4 + p[1] * u;
  let g = '';
  for(let c = 0; c <= cols; c++) g += '<line x1="' + (4 + c * u) + '" y1="4" x2="' + (4 + c * u) + '" y2="' + (4 + rows * u) + '"/>';
  for(let r = 0; r <= rows; r++) g += '<line x1="4" y1="' + (4 + r * u) + '" x2="' + (4 + cols * u) + '" y2="' + (4 + r * u) + '"/>';
  const w = cols * u + 8, h = rows * u + 8, lab = uk ? 'шлях ' + LET[i] : 'пътека ' + LET[i];
  return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + (kang ? 112 : 124) + '" role="img" aria-label="' + lab + '"><g stroke="var(--line)" stroke-width="1">' + g + '</g>' +
    '<polyline points="' + pts.map(p => x(p) + ',' + y(p)).join(' ') + '" fill="none" stroke="var(--accent-ink)" stroke-width="' + (kang ? 2.6 : 3.6) + '" stroke-linejoin="round" stroke-linecap="round"/></svg>';
}
function drawPathLen(q){
  if(q.shape === 'kang') return '<div class="ask">' + tr('Петте малки кенгурчета отиват при майките си по показаните пътечки. Кое от тях ще измине ' + (q.longest ? 'най-дълъг' : 'най-кратък') + ' път?',
    'П’ятеро маленьких кенгуренят ідуть до своїх мам за показаними стежками. Яке з них пройде ' + (q.longest ? 'найдовший' : 'найкоротший') + ' шлях?') + '</div>';
  return '<div class="ask">' + tr('Коя от показаните пътеки е ' + (q.longest ? 'най-дълга' : 'най-къса') + '?', 'Яка з показаних стежок ' + (q.longest ? 'найдовша' : 'найкоротша') + '?') + '</div>';
}
const sides = q => pathsOf(q).map(pathSides);
function eqPathLen(q){ return (q.longest ? tr('най-дълга: ', 'найдовша: ') : tr('най-къса: ', 'найкоротша: ')) + LET[q.pick]; }
function whyPathLen(q, full){
  if(!full) return q.shape === 'kang'
    ? tr('Всички пътеки минават през цялото поле отляво надясно. Разликата е колко нагоре и колко надолу се качва и слиза всяка. Брой квадратчетата нагоре и надолу.', 'Усі стежки йдуть через усе поле зліва направо. Різниця в тому, скільки кожна йде вгору й вниз. Рахуй клітинки вгору й вниз.')
    : tr('Брой малките отсечки, по които върви всяка пътека — по една за всяка страна на квадратче. Не гледай колко място заема, а колко е дълга.', 'Рахуй маленькі відрізки, по яких іде кожна стежка — по одному на кожну сторону клітинки. Дивись не на те, скільки місця вона займає, а на довжину.');
  const L = sides(q);
  if(q.shape === 'kang'){
    const up = L.map(v => v - W);
    return tr('всички вървят ' + W + ' квадратчета надясно; нагоре и надолу: ', 'усі йдуть ' + W + ' клітинок праворуч; вгору й вниз: ') + LET.map((l, i) => l + ' — ' + up[i]).join(', ') + '. ' +
      (q.longest ? tr('Най-много е при ', 'Найбільше в ') : tr('Най-малко е при ', 'Найменше в ')) + LET[q.pick] + '.';
  }
  return tr('малките отсечки по пътеките: ', 'маленькі відрізки на стежках: ') + LET.map((l, i) => l + ' — ' + L[i]).join(', ') + '. ' +
    (q.longest ? tr('Най-дълга е ', 'Найдовша — ') : tr('Най-къса е ', 'Найкоротша — ')) + LET[q.pick] + '.';
}
KIND.pathlen = { draw:drawPathLen, eq:eqPathLen, why:whyPathLen };
