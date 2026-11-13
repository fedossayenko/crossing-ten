// Question kind 'combotab': level 385 Под мастилото — A table of shape × animal with ink over some squares: which pair is under the X.

// Кенгуру 2026, 2 клас, задача 19: 3 rows of shapes (square, circle, pentagon) down the left, 4 animals (pig, frog, kangaroo, hedgehog)
// along the top, every square the shape of its row with the animal of its column; ink covers some squares and the X is on the one
// in the circle row, kangaroo column. The circle is seen in two other squares of its row, the kangaroo in another square of its
// column, so the pair is circle + kangaroo (key E). The answer is a picture, so the kind brings its own А–Д: the same animal in the
// other shapes and the same shape with the other animals.
import { KIND, rnd, shuffle, tr } from '../js/core.js';

const SHAPE = [['квадрат', 'квадрат'], ['кръг', 'коло'], ['петоъгълник', 'п’ятикутник'], ['триъгълник', 'трикутник']];
// [Bulgarian, Ukrainian, picture, Ukrainian after «з»]
const ANIMAL = [['прасе', 'свиня', '🐷', 'зі свинею'], ['жаба', 'жаба', '🐸', 'з жабою'], ['кенгуру', 'кенгуру', '🦘', 'з кенгуру'], ['таралеж', 'їжак', '🦔', 'з їжаком'], ['коте', 'кошеня', '🐱', 'з кошеням'], ['куче', 'собака', '🐶', 'із собакою']];
const SHAPESETS = [[0, 1, 2], [3, 1, 0], [2, 3, 1]];
const ANIMSETS = [[0, 1, 2, 3], [4, 5, 0, 1], [2, 3, 4, 5]];
// the ink: what it covers (animals on top by column, shapes on the left by row, squares as [row, column]) and where the X is
export const COMBO_MASKS = [
  { top: [1, 2], left: [1], cells: [[0, 1], [0, 3], [1, 1], [1, 2], [2, 0], [2, 2]], x: [1, 2] },
  { top: [1], left: [0], cells: [[0, 0], [0, 1], [1, 3], [2, 2]], x: [0, 1] },
  { top: [0, 3], left: [2], cells: [[1, 0], [1, 3], [2, 3], [0, 2]], x: [2, 3] },
  { top: [], left: [0, 1], cells: [[0, 2], [1, 0], [1, 1], [2, 3]], x: [1, 1] },
];
export function genComboTab(){
  const sh = rnd(SHAPESETS.length), an = rnd(ANIMSETS.length), mask = rnd(COMBO_MASKS.length), S = SHAPESETS[sh], A = ANIMSETS[an], [r, c] = COMBO_MASKS[mask].x;
  const right = [S[r], A[c]], pair = [];
  S.forEach(s => A.forEach(a => pair.push([s, a])));
  // the slips: the shape of the row with another animal, the animal of the column in another shape, and two pairs that share neither
  // (two of each kind would make the right pair the only one whose shape and animal both come back)
  const sameShape = shuffle(pair.filter(p => p[0] === right[0] && p[1] !== right[1])).slice(0, 1), sameAnimal = shuffle(pair.filter(p => p[1] === right[1] && p[0] !== right[0])).slice(0, 1);
  const neither = shuffle(pair.filter(p => p[0] !== right[0] && p[1] !== right[1])).slice(0, 2);
  const opts = shuffle(sameShape.concat(sameAnimal, neither, [right])), pick = opts.findIndex(p => p === right);
  return {kind:'combotab', sh, an, mask, right, options: opts.map((p, id) => ({ id, v: id, text: [pairSvg(p, 0), pairSvg(p, 1)] })), pick, own:true, ans: pick};
}
const SZ = 44;
/** a shape outline centred at (x, y) with the animal inside (or none) */
function figure(s, a, x, y, k){
  const r = SZ*0.38, st = ' fill="var(--solid)" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round"';
  const pts = f => f.map(([dx, dy]) => (x + dx*r).toFixed(1) + ',' + (y + dy*r).toFixed(1)).join(' ');
  const body = s === 0 ? '<rect x="' + (x - r) + '" y="' + (y - r) + '" width="' + 2*r + '" height="' + 2*r + '"' + st + '/>'
    : s === 1 ? '<circle cx="' + x + '" cy="' + y + '" r="' + r + '"' + st + '/>'
    : s === 2 ? '<polygon points="' + pts([[0, -1.05], [1, -0.3], [0.62, 0.85], [-0.62, 0.85], [-1, -0.3]]) + '"' + st + '/>'
    : '<polygon points="' + pts([[0, -1.05], [1.1, 0.85], [-1.1, 0.85]]) + '"' + st + '/>';
  return body + (a === undefined ? '' : '<text x="' + x + '" y="' + (y + r*0.42) + '" text-anchor="middle" font-size="' + Math.round(r*1.15) + '">' + ANIMAL[a][2] + '</text>');
}
const pairName = (p, k) => SHAPE[p[0]][k] + ', ' + ANIMAL[p[1]][k];
const pairWords = (p, k) => SHAPE[p[0]][k] + ' ' + (k ? ANIMAL[p[1]][3] : 'с ' + ANIMAL[p[1]][0]);
function pairSvg(p, k){
  return '<svg viewBox="0 0 52 48" width="52" height="48" role="img" aria-label="' + pairName(p, k) + '">' + figure(p[0], p[1], 26, 24, 0) + '</svg>';
}
function tableSvg(q){
  const S = SHAPESETS[q.sh], A = ANIMSETS[q.an], M = COMBO_MASKS[q.mask], W = 5*SZ + 4, H = 4*SZ + 4;
  const mid = (i, j) => [2 + (j + 0.5)*SZ, 2 + (i + 0.5)*SZ];
  let g = '<g stroke="var(--line)" stroke-width="1.5" fill="var(--glass)">';
  for(let i = 0; i < 4; i++) for(let j = 0; j < 5; j++) g += '<rect x="' + (2 + j*SZ) + '" y="' + (2 + i*SZ) + '" width="' + SZ + '" height="' + SZ + '"/>';
  g += '</g>';
  A.forEach((a, j) => { const [x, y] = mid(0, j + 1); g += '<text x="' + x + '" y="' + (y + 8) + '" text-anchor="middle" font-size="24">' + ANIMAL[a][2] + '</text>'; });
  S.forEach((s, i) => { const [x, y] = mid(i + 1, 0); g += figure(s, undefined, x, y, 0); });
  S.forEach((s, i) => A.forEach((a, j) => { const [x, y] = mid(i + 1, j + 1); g += figure(s, a, x, y, 0); }));
  const ink = (i, j) => '<rect x="' + (2 + j*SZ - 2) + '" y="' + (2 + i*SZ - 2) + '" width="' + (SZ + 4) + '" height="' + (SZ + 4) + '" rx="14" fill="var(--muted)" stroke="var(--ink)" stroke-width="1.5"/>';
  M.top.forEach(j => { g += ink(0, j + 1); });
  M.left.forEach(i => { g += ink(i + 1, 0); });
  M.cells.forEach(([i, j]) => { g += ink(i + 1, j + 1); });
  const [x, y] = mid(M.x[0] + 1, M.x[1] + 1);
  g += '<text x="' + x + '" y="' + (y + 8) + '" text-anchor="middle" font-size="24" font-weight="800" fill="var(--solid)" font-family="Nunito, sans-serif">X</text>';
  const label = tr('таблица с 3 реда фигури и 4 колонки животни; мастило покрива част от квадратчетата, под X е едно от тях', 'таблиця з 3 рядками фігур і 4 стовпцями тварин; чорнило закриває частину клітинок, під X — одна з них');
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" style="display:block; width:' + Math.min(W*1.4, 340) + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + label + '">' + g + '</svg>';
}
function drawComboTab(q){
  return '<div class="ask">' + tr('Таблицата се състои от 12 квадратчета (3 реда и 4 колонки). Най-вляво, едно под друго, са 3 фигури, които се повтарят в редовете си. Най-горе, едно до друго, са 4 животни, които се повтарят в колонките си. Всяко от 12-те квадратчета е фигурата на своя ред заедно с животното на своята колонка. Разлято мастило е закрило някои от квадратчетата. <b>Коя комбинация се намира под знака X?</b>',
    'Таблиця складається з 12 клітинок (3 рядки і 4 стовпці). Ліворуч, одна під одною, — 3 фігури, які повторюються у своїх рядках. Угорі, одна біля одної, — 4 тварини, які повторюються у своїх стовпцях. Кожна з 12 клітинок — це фігура свого рядка разом із твариною свого стовпця. Розлите чорнило закрило деякі клітинки. <b>Яка комбінація під знаком X?</b>') + '</div>' + tableSvg(q);
}
const answerOf = q => q.right;
function eqComboTab(q){
  return tr(pairWords(answerOf(q), 0), pairWords(answerOf(q), 1));
}
function whyComboTab(q, full){
  if(!full) return tr('Първо реда на X: коя фигура се вижда в другите му квадратчета? После колонката на X: кое животно се вижда в другите й квадратчета?', 'Спершу рядок X: яку фігуру видно в інших його клітинках? Потім стовпець X: яку тварину видно в інших його клітинках?');
  const p = answerOf(q);
  return tr('в реда на X се вижда ' + SHAPE[p[0]][0] + ', в колонката на X — ' + ANIMAL[p[1]][0], 'у рядку X видно ' + SHAPE[p[0]][1] + ', у стовпці X — ' + ANIMAL[p[1]][1]) + ' &nbsp;→&nbsp; ' + pairSvg(p, 0) + ' ' + tr(pairWords(p, 0), pairWords(p, 1));
}
KIND.combotab = { draw:drawComboTab, eq:eqComboTab, why:whyComboTab };
