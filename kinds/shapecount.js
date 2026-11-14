// Question kind 'shapecount': level 393 Триъгълници и квадрати — Scattered shapes: by how many are the triangles more than the squares.

// Кенгуру 2025, задача 3: 15 shapes, among them 6 triangles and 4-cornered ones: one square (turned on its corner), a rectangle and a
// slanted parallelogram; the circles, stars and a moon are only there. 6 − 1 = 5. The traps are the three tidy ones: counting the squares
// that stand on a side only, counting every four-cornered shape as a square, and not subtracting at all. Every shape is drawn as points,
// a square is a drawn polygon of four equal sides and right angles whatever way it is turned.
import { KIND, answerLine, rnd, shuffle, svgFrame, tr } from '../js/core.js';
const COLS = ['accent', 'bad', 'good', 'warm', 'grape'];
export function genShapeCount(){
  if(rnd(6) === 0) return mk(6, 1, 2, 6);
  const s = 1 + rnd(3);
  return mk(s + 2 + rnd(3), s, 1 + rnd(2), 3 + rnd(3));
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
  return '<div class="ask">' + tr('Показани са различни фигурки, между които триъгълници и четириъгълници. С колко <b>триъгълниците</b> са повече от <b>квадратите</b>?',
    'Показано різні фігурки, серед яких трикутники та чотирикутники. На скільки <b>трикутників</b> більше, ніж <b>квадратів</b>?') + '</div>' + pic(q) + answerLine('md');
}
function eqShapeCount(q){
  return q.tri + ' − ' + q.sq + ' = ' + q.ans;
}
function whyShapeCount(q, full){
  if(!full) return tr('Квадратът има четири равни страни и прави ъгли, дори когато стои на върха си. Другите четириъгълници, правоъгълниците и наклонените, не са квадрати.', 'Квадрат має чотири рівні сторони й прямі кути, навіть коли стоїть на вершині. Інші чотирикутники, прямокутники й похилі, — не квадрати.');
  return tr('Триъгълници ' + q.tri + ', квадрати ' + q.sq + ': ' + q.tri + ' − ' + q.sq + ' = ' + q.ans + '.', 'Трикутників ' + q.tri + ', квадратів ' + q.sq + ': ' + q.tri + ' − ' + q.sq + ' = ' + q.ans + '.');
}
KIND.shapecount = { draw:drawShapeCount, eq:eqShapeCount, why:whyShapeCount };
