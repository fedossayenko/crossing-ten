// Question kind 'boxtri': level 391 Най-много триъгълници — Five boxes of circles, triangles and squares: which picture has the most triangles.

// Кенгуру 2022, задача 1: five boxes of 6, 6, 6, 5 and 4 shapes; the triangles are 1, 4, 2, 3 and 1, so B. The answer is a picture, so
// the kind brings its own А–Д. The box with the most triangles is the only one, and it is never the box with the most shapes, circles or
// squares, nor the one with the fewest (the options must not be solvable by a vote on something else than triangles).
import { KIND, rnd, shuffle, tr } from '../js/core.js';
const PRINTED = [[3, 1, 2], [1, 4, 1], [2, 2, 2], [1, 3, 1], [1, 1, 2]];   // [circles, triangles, squares] of each box, A to E
const LETTERS = 'АБВГД';
const unique = (/** @type {number[]} */ v, /** @type {(a: number, b: number) => boolean} */ better) => { const best = v.reduce((m, x) => better(x, m) ? x : m); return v.filter(x => x === best).length === 1 ? v.indexOf(best) : -1; };
export function genBoxTri(){
  if(rnd(6) === 0) return mk(PRINTED, 1);
  for(;;){
    const t = 3 + rnd(3), boxes = [];
    for(let i = 0; i < 5; i++){
      const tri = i === 0 ? t : i === 1 ? t - 1 : rnd(t), all = Math.min(6, Math.max(4, tri) + rnd(3)), rest = all - tri, c = rnd(rest + 1);
      boxes.push([c, tri, rest - c]);
    }
    const order = shuffle(boxes.map((b, i) => i)), at = order.indexOf(0);
    const q = mk(order.map(i => boxes[i]), at);
    if(q) return q;
  }
}
function mk(boxes, at){
  const tri = boxes.map(b => b[1]), tot = boxes.map(b => b[0] + b[1] + b[2]), cir = boxes.map(b => b[0]), sq = boxes.map(b => b[2]);
  if(unique(tri, (a, b) => a > b) !== at) return null;
  for(const v of [tot, cir, sq]) for(const better of [(/** @type {number} */ a, /** @type {number} */ b) => a > b, (/** @type {number} */ a, /** @type {number} */ b) => a < b]) if(unique(v, better) === at) return null;
  return {kind:'boxtri', boxes, own:true, pick:at, ans:at, options: boxes.map((b, id) => ({ id, v:id, text:both(pic(b, id)), n:b[1] }))};
}
const both = (/** @type {string} */ svg) => [svg.replace('%L', 'кутия').replace('%A', 'с фигурки'), svg.replace('%L', 'коробка').replace('%A', 'з фігурами')];
/** a box as the paper draws it: its shapes in a 3 x 2 grid of places, each place with its own shape, all one colour */
function pic(b, id){
  const kinds = shuffle([].concat(Array(b[0]).fill('c'), Array(b[1]).fill('t'), Array(b[2]).fill('s'))), cells = shuffle([0, 1, 2, 3, 4, 5]).slice(0, kinds.length), fill = 'fill="var(--accent)"';
  const g = kinds.map((k, i) => {
    const cx = 25 + (cells[i] % 3)*50 + rnd(9) - 4, cy = 21 + Math.floor(cells[i] / 3)*42 + rnd(7) - 3;
    return k === 'c' ? '<circle cx="' + cx + '" cy="' + cy + '" r="10" ' + fill + '/>'
      : k === 't' ? '<polygon points="' + (cx - 11) + ',' + (cy + 9) + ' ' + (cx + 11) + ',' + (cy + 9) + ' ' + cx + ',' + (cy - 10) + '" ' + fill + '/>'
      : '<rect x="' + (cx - 9) + '" y="' + (cy - 9) + '" width="18" height="18" ' + fill + '/>';
  }).join('');
  return '<span class="vw"><svg viewBox="0 0 150 84" width="150" height="84" role="img" aria-label="%L ' + LETTERS[id] + ' %A"><rect x="1" y="1" width="148" height="82" fill="var(--paper)" stroke="var(--fur-dark)" stroke-width="2"/>' + g + '</svg></span>';
}
function drawBoxTri(){
  return '<div class="ask">' + tr('Коя е картинката с най-много <b>триъгълници</b>?', 'Яка картинка має найбільше <b>трикутників</b>?') + '</div>';
}
function eqBoxTri(q){
  return tr('най-много триъгълници: ', 'найбільше трикутників: ') + q.boxes[q.pick][1];
}
function whyBoxTri(q, full){
  if(!full) return tr('Брой само триъгълниците във всяка картинка, другите фигурки не са важни.', 'Рахуй лише трикутники на кожній картинці, інші фігурки не важливі.');
  return tr('Триъгълници: ', 'Трикутників: ') + q.boxes.map((b, i) => LETTERS[i] + ' — ' + b[1]).join(', ') + '. ' + tr('Най-много има в ', 'Найбільше в ') + LETTERS[q.pick] + '.';
}
KIND.boxtri = { draw:drawBoxTri, eq:eqBoxTri, why:whyBoxTri };
