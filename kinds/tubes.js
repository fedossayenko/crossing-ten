// Question kind 'tubes': level 365 Тубички боя — A letter drawn on a grid, a part of it painted with one tube: how many more tubes.

// Кенгуру 2026, задача 14: the letter К on a grid of 3 by 4 squares, its two top stem squares painted with one tube. The К has 8 whole
// squares and 4 halves (two corner triangles at each arm: 8 + 2 = 10 squares), so it takes 10 squares, 5 tubes of 2: 4 more. The
// plain letters (Г, Т, П, Н) are whole squares only. A piece is [column, row, kind]: kind 0 a whole square, 1–4 the half cut off
// by a diagonal that keeps the top-left, top-right, bottom-right or bottom-left corner.
import { KIND, answerLine, popAt, rnd, svgFrame, tr, ukWord } from '../js/core.js';
const K_PIECES = [[0, 0, 0], [0, 1, 0], [0, 2, 0], [0, 3, 0], [1, 0, 3], [1, 1, 0], [1, 2, 0], [1, 3, 2], [2, 0, 0], [2, 1, 1], [2, 2, 4], [2, 3, 0]];
const col = (x, ys) => ys.map(y => [x, y, 0]);
const row = (y, xs) => xs.map(x => [x, y, 0]);
const range = (a, b) => Array.from({length: b - a}, (_, i) => a + i);
// the letters in order of painting: the part that is painted is the first pieces
function letterPieces(letter, h, w){
  if(letter === 'Г') return col(0, range(0, h)).concat(row(0, range(1, w)));
  if(letter === 'П') return col(0, range(0, h)).concat(row(0, range(1, w - 1)), col(w - 1, range(0, h)));
  if(letter === 'Н') return col(0, range(0, h)).concat(row(Math.floor(h/2), range(1, w - 1)), col(w - 1, range(0, h)));
  return row(0, range(0, w)).concat(col((w - 1)/2, range(1, h)));   // Т
}
export function genTubes(){
  if(rnd(4) === 0){
    const oc = rnd(2) ? 2 : 1;   // the printed paint is two squares of the stem
    return mk('half', 'К', K_PIECES, oc, 3, 4);
  }
  for(;;){
    const letter = 'ГПНТ'[rnd(4)], h = 4 + rnd(3), w = letter === 'Т' ? 3 + 2*rnd(2) : 3 + rnd(3);
    const pieces = letterPieces(letter, h, w), u = 2, t = pieces.length / u;
    if(pieces.length % u || t < 3 || t > 7 || pieces.length - u === t - 1) continue;
    return mk('letter', letter, pieces, u, w, h);
  }
}
const area2 = ps => ps.reduce((a, p) => a + (p[2] ? 1 : 2), 0);
function mk(shape, letter, pieces, oc, W, H){
  const a = area2(pieces), o = area2(pieces.slice(0, oc)), tubes = a / o;
  return {kind:'tubes', shape, letter, pieces, oc, W, H, a, o, tubes, traps:[tubes, pieces.length - oc], ans: tubes - 1};
}
const pts = ([x, y, t]) => t === 0 ? [[x, y], [x + 1, y], [x + 1, y + 1], [x, y + 1]] : t === 1 ? [[x, y], [x + 1, y], [x, y + 1]] : t === 2 ? [[x, y], [x + 1, y], [x + 1, y + 1]]
  : t === 3 ? [[x + 1, y], [x + 1, y + 1], [x, y + 1]] : [[x, y], [x, y + 1], [x + 1, y + 1]];
function pic(q){
  const u = 30;
  let grid = '', fill = '', edges = {}, line = '';
  for(let i = 0; i <= q.W; i++) grid += '<line x1="' + i*u + '" y1="0" x2="' + i*u + '" y2="' + q.H*u + '"/>';
  for(let j = 0; j <= q.H; j++) grid += '<line x1="0" y1="' + j*u + '" x2="' + q.W*u + '" y2="' + j*u + '"/>';
  q.pieces.forEach((p, i) => {
    const ps = pts(p);
    fill += '<polygon' + (i < q.oc ? popAt(1 + i*0.3) : '') + ' points="' + ps.map(([x, y]) => x*u + ',' + y*u).join(' ') + '" fill="' + (i < q.oc ? 'var(--warm)' : 'none') + '" fill-opacity=".85"/>';
    ps.forEach((a, k) => { const b = ps[(k + 1) % ps.length], key = (a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]) ? a.concat(b) : b.concat(a)).join(','); edges[key] = (edges[key] || 0) + 1; });
  });
  Object.keys(edges).forEach(key => { if(edges[key] === 1){ const [x1, y1, x2, y2] = key.split(',').map(Number); line += '<line x1="' + x1*u + '" y1="' + y1*u + '" x2="' + x2*u + '" y2="' + y2*u + '"/>'; } });
  return svgFrame('-5 -5 ' + (q.W*u + 10) + ' ' + (q.H*u + 10), Math.round(q.W*u*1.3), tr('буквата ' + q.letter + ' върху квадратна мрежа, част от нея е оцветена', 'літера ' + q.letter + ' на квадратній сітці, частину її зафарбовано')) +
    '<g stroke="var(--muted)" stroke-opacity=".6" stroke-width="1">' + grid + '</g>' + fill + '<g stroke="var(--ink)" stroke-width="3.2" stroke-linecap="round">' + line + '</g></svg>';
}
function drawTubes(q){
  return '<div class="ask">' + tr('Бобърът Били оцветява буквата ' + q.letter + ', както е показано. За оцветената част той е използвал <b>една</b> тубичка боя. Още колко тубички са необходими на бобъра Били, за да довърши оцветяването на буквата ' + q.letter + '?',
    'Бобер Біллі розфарбовує літеру ' + q.letter + ', як показано. На зафарбовану частину він витратив <b>один</b> тюбик фарби. Скільки ще тюбиків потрібно боброві Біллі, щоб дофарбувати літеру ' + q.letter + '?') + '</div>' + pic(q) + answerLine('md');
}
function eqTubes(q){
  return q.tubes + ' − 1 = ' + q.ans;
}
function whyTubes(q, full){
  if(!full) return q.shape === 'half'
    ? tr('Две половинки правят едно цяло квадратче. Колко квадратчета е цялата буква? Колко такива части като оцветената има в нея?', 'Дві половинки утворюють один цілий квадратик. Скільки квадратиків усього в літері? Скільки таких частин, як зафарбована, у ній?')
    : tr('Колко квадратчета е цялата буква и колко е оцветената част? Колко такива части има в нея?', 'Скільки квадратиків усього в літері і скільки в зафарбованій частині? Скільки таких частин у ній?');
  const halves = q.pieces.filter(p => p[2]).length, whole = q.pieces.length - halves, cells = q.a/2, paint = q.o/2;
  return pic(q) + '<div style="text-align:center">' + tr('Цялата буква: ' + whole + (halves ? ' цели квадратчета и ' + halves + ' половинки (те правят ' + halves/2 + ')' : ' квадратчета') + ' = ' + cells + '. Оцветеното е ' + paint + ', значи в буквата има ' + q.tubes + ' такива части. Една е готова, още ' + q.tubes + ' − 1 = ' + q.ans + '.',
    'Уся літера: ' + whole + (halves ? ' цілих квадратиків і ' + halves + ' половинки (вони дають ' + halves/2 + ')' : ' квадратиків') + ' = ' + cells + '. Зафарбовано ' + paint + ', отже в літері ' + q.tubes + ' ' + ukWord(q.tubes, 'така частина', 'такі частини', 'таких частин') + '. Одна готова, ще ' + q.tubes + ' − 1 = ' + q.ans + '.') + '</div>';
}
KIND.tubes = { draw:drawTubes, eq:eqTubes, why:whyTubes };
