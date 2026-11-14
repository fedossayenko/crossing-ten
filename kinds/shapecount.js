// Question kind 'shapecount': level 393 Триъгълници и квадрати — Scattered shapes: by how many are the triangles more than the squares.

// Кенгуру 2025, задача 3: 15 shapes, among them 6 triangles and 4-cornered ones: one square (turned on its corner), a rectangle and a
// slanted parallelogram; the circles, stars and a moon are only there. 6 − 1 = 5. The traps are the three tidy ones: counting the squares
// that stand on a side only, counting every four-cornered shape as a square, and not subtracting at all. Every shape is drawn as points,
// a square is a drawn polygon of four equal sides and right angles whatever way it is turned.
import { KIND, SVG_FONT, answerLine, rnd, shuffle, svgFrame, tr } from '../js/core.js';
const COLS = ['accent', 'bad', 'good', 'warm', 'grape'];
export function genShapeCount(){
  if(rnd(6) === 0) return mk(6, 1, 2, 6);
  const s = 1 + rnd(3);
  return mk(s + 2 + rnd(3), s, 1 + rnd(2), 3 + rnd(3));
}
// Салабашев 2020, задача 1: the letters И and С made of unit squares and half-square triangles; the squares are more than the triangles
// by 17 − 7 = 10. И: two columns of h squares and, between them, h half squares stepping down by half a square each (right angle top left);
// С: a column of m squares, a half square above and below it (right angle in the column's corner), a squares beside each half square.
export function genShapeLetters(){
  const h = 3 + rnd(3), a = 1 + rnd(3), m = 2 + rnd(3), sq = 2*h + 2*a + m, tri = h + 2;
  return {kind:'shapecount', shape:'letters', h, a, m, sq, tri, traps:[sq, sq + tri], ans: sq - tri};
}
/** the pieces of И and С as polygons in square units: [kind, points] */
function letterPieces(q){
  const out = [], G = 1.5 + 0.5*q.h, sq = (x, y) => out.push(['sq', [[x, y], [x + 1, y], [x + 1, y + 1], [x, y + 1]]]);
  for(let r = 0; r < q.h; r++){ sq(0, r); sq(G, r); const x = G - 1 - 0.5*r; out.push(['tri', [[x, r], [x + 1, r], [x, r + 1]]]); }
  const o = G + 2, H = q.m + 2;
  out.push(['tri', [[o, 1], [o + 1, 1], [o + 1, 0]]], ['tri', [[o, H - 1], [o + 1, H - 1], [o + 1, H]]]);
  for(let j = 0; j < q.m; j++) sq(o, 1 + j);
  for(let i = 0; i < q.a; i++){ sq(o + 1 + i, 0); sq(o + 1 + i, H - 1); }
  return out;
}
function lettersSvg(q){
  const u = 26, P = letterPieces(q), xs = P.flatMap(p => p[1].map(v => v[0])), ys = P.flatMap(p => p[1].map(v => v[1])), w = Math.max(...xs), h = Math.max(...ys);
  return svgFrame('-3 -3 ' + (w*u + 6) + ' ' + (h*u + 6), Math.round(w*u*1.3 + 8), tr('буквите И и С, направени от квадрати и триъгълници', 'літери И та С з квадратів і трикутників')) +
    P.map(([, pts]) => '<polygon points="' + poly(pts.map(([x, y]) => [x*u, y*u])) + '" fill="color-mix(in srgb, var(--good) 28%, transparent)" stroke="var(--ink)" stroke-width="1.6" stroke-linejoin="round"/>').join('') + '</svg>';
}
function mk(tri, sq, quad, other){
  const kinds = shuffle([].concat(Array(tri).fill('tri'), Array(sq).fill('sq'), Array(quad).fill('quad'), Array(other).fill('other'))), cells = shuffle(Array.from({ length: 18 }, (v, i) => i)).slice(0, kinds.length);
  const shapes = kinds.map((k, i) => ({ k, cx: 25 + (cells[i] % 6)*50 + rnd(5) - 2, cy: 25 + Math.floor(cells[i] / 6)*50 + rnd(5) - 2, rot: rnd(360), v: rnd(4), g1: 95 + rnd(41), g2: 95 + rnd(41), rad: 9 + rnd(5), col: COLS[rnd(COLS.length)] }));
  return {kind:'shapecount', shapes, tri, sq, quad, ans: tri - sq, traps:[tri, Math.max(0, tri - sq - quad)]};
}
const rot = (/** @type {number[][]} */ pts, /** @type {number} */ a, /** @type {number} */ cx, /** @type {number} */ cy) => pts.map(([x, y]) => [cx + x*Math.cos(a) - y*Math.sin(a), cy + x*Math.sin(a) + y*Math.cos(a)]);
const poly = (/** @type {number[][]} */ pts) => pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
function shapeSvg(s){
  const a = s.rot*Math.PI / 180, c = 'var(--' + s.col + ')', st = 'fill="color-mix(in srgb, ' + c + ' 24%, transparent)" stroke="' + c + '" stroke-width="2.4" stroke-linejoin="round"';
  if(s.k === 'tri'){
    const g = [0, s.g1, s.g1 + s.g2].map(d => d*Math.PI / 180);
    return '<polygon points="' + poly(rot(g.map(t => [19*Math.cos(t), 19*Math.sin(t)]), a, s.cx, s.cy)) + '" ' + st + '/>';
  }
  if(s.k === 'sq') return '<polygon points="' + poly(rot([[-12, -12], [12, -12], [12, 12], [-12, 12]], a, s.cx, s.cy)) + '" ' + st + '/>';
  if(s.k === 'quad') return '<polygon points="' + poly(rot(s.v % 2 ? [[-19, -9], [19, -9], [19, 9], [-19, 9]] : [[-20, 9], [-7, -9], [20, -9], [7, 9]], a, s.cx, s.cy)) + '" ' + st + '/>';
  if(s.v === 0) return '<circle cx="' + s.cx + '" cy="' + s.cy + '" r="' + s.rad + '" ' + st + '/>';
  if(s.v === 1) return '<polygon points="' + poly(rot([0, 1, 2, 3, 4].map(i => [16*Math.cos(i*1.2566), 16*Math.sin(i*1.2566)]), a, s.cx, s.cy)) + '" ' + st + '/>';
  if(s.v === 2) return '<polygon points="' + poly(rot([0, 1, 2, 3, 4, 5, 6, 7].map(i => [(i % 2 ? 6 : 18)*Math.cos(i*Math.PI/4), (i % 2 ? 6 : 18)*Math.sin(i*Math.PI/4)]), a, s.cx, s.cy)) + '" ' + st + '/>';
  const [p, q, r] = rot([[0, -16], [0, 16], [10, 0]], a, s.cx, s.cy);
  return '<path d="M' + p[0].toFixed(1) + ',' + p[1].toFixed(1) + ' A16,16 0 0 0 ' + q[0].toFixed(1) + ',' + q[1].toFixed(1) + ' Q' + r[0].toFixed(1) + ',' + r[1].toFixed(1) + ' ' + p[0].toFixed(1) + ',' + p[1].toFixed(1) + 'Z" ' + st + '/>';
}
function pic(q){
  return svgFrame('0 0 300 150', 340, tr('разхвърляни фигурки: триъгълници, четириъгълници и други', 'розкидані фігурки: трикутники, чотирикутники та інші')) + q.shapes.map(shapeSvg).join('') + '</svg>';
}
function drawShapeCount(q){
  if(q.shape === 'letters') return '<div class="ask">' + tr('С колко <b>квадратите</b> са повече от <b>триъгълниците</b> на фигурата?', 'На скільки <b>квадратів</b> більше, ніж <b>трикутників</b> на фігурі?') + '</div>' + lettersSvg(q) + answerLine('md');
  if(q.shape === 'wall') return drawWall(q);
  return '<div class="ask">' + tr('Показани са различни фигурки, между които триъгълници и четириъгълници. С колко <b>триъгълниците</b> са повече от <b>квадратите</b>?',
    'Показано різні фігурки, серед яких трикутники та чотирикутники. На скільки <b>трикутників</b> більше, ніж <b>квадратів</b>?') + '</div>' + pic(q) + answerLine('md');
}
function eqShapeCount(q){
  if(q.shape === 'wall') return eqWall(q);
  if(q.shape === 'letters') return q.sq + ' − ' + q.tri + ' = ' + q.ans;
  return q.tri + ' − ' + q.sq + ' = ' + q.ans;
}
function whyShapeCount(q, full){
  if(q.shape === 'wall') return whyWall(q, full);
  if(q.shape === 'letters'){
    if(!full) return tr('Преброй квадратите, после триъгълниците — те са половинки от квадрат — и извади.', 'Порахуй квадрати, потім трикутники — вони половинки квадрата — і відніми.');
    return tr('квадрати: ' + q.sq + ', триъгълници: ' + q.tri + ': ' + q.sq + ' − ' + q.tri + ' = ' + q.ans, 'квадратів: ' + q.sq + ', трикутників: ' + q.tri + ': ' + q.sq + ' − ' + q.tri + ' = ' + q.ans);
  }
  if(!full) return tr('Квадратът има четири равни страни и прави ъгли, дори когато стои на върха си. Другите четириъгълници, правоъгълниците и наклонените, не са квадрати.', 'Квадрат має чотири рівні сторони й прямі кути, навіть коли стоїть на вершині. Інші чотирикутники, прямокутники й похилі, — не квадрати.');
  return tr('Триъгълници ' + q.tri + ', квадрати ' + q.sq + ': ' + q.tri + ' − ' + q.sq + ' = ' + q.ans + '.', 'Трикутників ' + q.tri + ', квадратів ' + q.sq + ': ' + q.tri + ' − ' + q.sq + ' = ' + q.ans + '.');
}
// Салабашев 2021, задача 6: a wall of bricks in three rows, a snowflake in one: by how many the bricks with a snowflake are fewer than those
// without. A row is three units wide, cut into 1 + 2, 2 + 1, 1 + 1 + 1 or left whole; the printed wall is 2 + 1, 1 + 2, 1 + 1 + 1 with the
// flake in the first brick of the middle row: 7 bricks, 6 − 1 = 5.
const WALL_ROWS = [[3], [1, 2], [2, 1], [1, 1, 1]];
export function genWall(){
  for(;;){
    const rows = [rnd(4), rnd(4), rnd(4)].map(i => WALL_ROWS[i]), total = rows.reduce((t, r) => t + r.length, 0), k = 1 + rnd(3);
    if(total < 5 || total > 8 || total === 2*k || new Set(rows.map(String)).size === 1) continue;
    const bricks = rows.flatMap((r, i) => r.map((w, j) => i*10 + j)), snow = shuffle(bricks.slice()).slice(0, k).sort((x, y) => x - y);
    const fewer = total - k > k;
    return {kind:'shapecount', shape:'wall', rows, snow, total, k, fewer, ans: Math.abs(total - 2*k)};
  }
}
function wallSvg(q, full){
  const u = 60, ink = 'var(--ink)';
  let g = '';
  q.rows.forEach((r, i) => { let x = 0; r.forEach((w, j) => {
    const flake = q.snow.includes(i*10 + j);
    g += '<rect x="' + x*u + '" y="' + i*u*0.7 + '" width="' + w*u + '" height="' + u*0.7 + '" fill="' + (full && flake ? 'color-mix(in srgb, var(--accent) 22%, transparent)' : 'none') + '" stroke="' + ink + '" stroke-width="2"/>' +
      (flake ? '<text x="' + (x*u + w*u/2) + '" y="' + (i*u*0.7 + u*0.7/2 + 8) + '" text-anchor="middle" font-size="24" fill="var(--accent)" ' + SVG_FONT + '>❄</text>' : '');
    x += w; }); });
  return svgFrame('-3 -3 ' + (3*u + 6) + ' ' + (3*u*0.7 + 6), 230, tr('стена от правоъгълници в три реда, някои със снежинка', 'стіна з прямокутників у три ряди, деякі зі сніжинкою')) + g + '</svg>';
}
function drawWall(q){
  return '<div class="ask">' + tr('С колко правоъгълниците, в които има снежинка, са ' + (q.fewer ? 'по-малко' : 'повече') + ' от правоъгълниците, в които няма снежинка? Брой правоъгълниците, на които е разделен чертежът.',
    'На скільки прямокутників зі сніжинкою ' + (q.fewer ? 'менше' : 'більше') + ', ніж прямокутників без сніжинки? Рахуй прямокутники, на які поділено рисунок.') + '</div><div class="fig">' + wallSvg(q, false) + '</div>' + answerLine('md');
}
function eqWall(q){
  return q.fewer ? (q.total - q.k) + ' − ' + q.k + ' = ' + q.ans : q.k + ' − ' + (q.total - q.k) + ' = ' + q.ans;
}
function whyWall(q, full){
  if(!full) return tr('Първо преброй всички правоъгълници, после тези със снежинка. Без снежинка са останалите.', 'Спершу порахуй усі прямокутники, потім ті зі сніжинкою. Без сніжинки — решта.');
  const w = q.total - q.k;
  return tr('всички: ' + q.total + ', със снежинка: ' + q.k + ', без снежинка: ' + w + ' &nbsp;→&nbsp; ', 'усього: ' + q.total + ', зі сніжинкою: ' + q.k + ', без сніжинки: ' + w + ' &nbsp;→&nbsp; ') + '<div class="fig">' + wallSvg(q, true) + '</div>' + eqWall(q);
}
KIND.shapecount = { draw:drawShapeCount, eq:eqShapeCount, why:whyShapeCount };
