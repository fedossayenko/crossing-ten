// Question kind 'countsq': level 105 Всички квадрати — Squares of every size in a figure of tiles.

// МБГ Зима 2022, задача 14: a figure of 11 square tiles; 11 small squares and 3 of two by two, 14.
// The big ones are the trap: every 2 × 2 (or 3 × 3) block of tiles is a square too. Counted here
// by looking at every block, never by a rule.
import { KIND, SLOT, popAt, rnd, tr } from '../js/core.js';
function countSquares(cells){
  const has = (x, y) => cells.some(c => c[0] === x && c[1] === y), sizes = [];
  for(let k = 1; k <= 4; k++){
    let n = 0;
    cells.forEach(([x, y]) => { let ok = true; for(let i = 0; i < k && ok; i++) for(let j = 0; j < k && ok; j++) ok = has(x + i, y + j); if(ok) n++; });
    if(n) sizes.push(n);
  }
  return sizes;
}
export function genCountSq(){
  for(;;){
    const W = 3 + rnd(3), H = 2 + rnd(3), cells = [];
    for(let x = 0; x < W; x++) for(let y = 0; y < H; y++) cells.push([x, y]);
    // take away a few tiles from the edge, keeping it in one piece
    const drop = 2 + rnd(5);
    for(let i = 0; i < drop; i++){
      const edge = cells.filter(([x, y]) => [[1,0],[-1,0],[0,1],[0,-1]].some(([dx, dy]) => !cells.some(c => c[0] === x + dx && c[1] === y + dy)));
      const [x, y] = edge[rnd(edge.length)];
      cells.splice(cells.findIndex(c => c[0] === x && c[1] === y), 1);
    }
    const sizes = countSquares(cells);
    if(cells.length < 7 || sizes.length < 2) continue;
    return {kind:'countsq', cells, sizes, ans: sizes.reduce((a, b) => a + b, 0)};
  }
}
// МБГ Полуфинал 2022, 1 клас, задача 15: «Фигурата е образувана от 10 еднакви малки квадратчета», two rows of five —
// how many squares in all? 10 small ones and 4 of two by two: 14. Two rows of 3 to 6 make 2n + (n − 1) = 3n − 1;
// now and then three rows of three, the same words: 9 + 4 + 1 = 14. The slips: the small ones only, or the
// squares of four that do not overlap.
export function genCountSqStrip(){
  const block = Math.random() < 0.2, W = block ? 3 : 3 + rnd(4), H = block ? 3 : 2, cells = [];
  for(let x = 0; x < W; x++) for(let y = 0; y < H; y++) cells.push([x, y]);
  const sizes = countSquares(cells);
  return {kind:'countsq', shape:'strip', cells, sizes, traps:[W*H, W*H + Math.floor(W/2)], ans: sizes.reduce((a, b) => a + b, 0)};
}
function countSqSvg(cells){
  const u = 30, W = Math.max(...cells.map(c => c[0])) + 1, H = Math.max(...cells.map(c => c[1])) + 1;
  return '<div class="fig"><svg viewBox="-3 -3 ' + (W*u + 6) + ' ' + (H*u + 6) + '" style="max-width:' + (W*44) + 'px" role="img" aria-label="' + tr('фигура от квадратни плочки', 'фігура з квадратних плиток') + '">' +
    cells.map(([x, y]) => '<rect x="' + x*u + '" y="' + y*u + '" width="' + u + '" height="' + u + '" fill="color-mix(in srgb, var(--warm) 35%, transparent)" stroke="var(--ink)" stroke-width="1.6"/>').join('') + '</svg></div>';
}
function drawCountSq(q){
  if(q.shape === 'strip') return '<div class="ask">' + tr('Фигурата е образувана от <span class="num">' + q.cells.length + '</span> еднакви малки квадратчета. Колко са <b>всичките</b> квадрати на фигурата?',
    'Фігуру утворено з <span class="num">' + q.cells.length + '</span> однакових маленьких квадратиків. Скільки <b>всього</b> квадратів на фігурі?') + '</div>' +
    countSqSvg(q.cells) + '<div class="line xl">' + SLOT + '</div>';
  return '<div class="ask">' + tr('Фигурата е образувана от <span class="num">' + q.cells.length + '</span> квадратни плочки. Колко <b>общо</b> са квадратите на фигурата?',
    'Фігуру складено з <span class="num">' + q.cells.length + '</span> квадратних плиток. Скільки <b>всього</b> квадратів на фігурі?') + '</div>' +
    countSqSvg(q.cells) + '<div class="line xl">' + SLOT + '</div>';
}
// The bigger squares of the figure, each on a small copy of its own, two by two first, then three by three.
function countSqBig(q){
  const has = (x, y) => q.cells.some(c => c[0] === x && c[1] === y), s = 9, W = Math.max(...q.cells.map(c => c[0])) + 1, H = Math.max(...q.cells.map(c => c[1])) + 1, big = [];
  for(let k = 2; k <= 4; k++) for(let y = 0; y < H; y++) for(let x = 0; x < W; x++){
    let ok = true; for(let i = 0; i < k && ok; i++) for(let j = 0; j < k && ok; j++) ok = has(x + i, y + j);
    if(ok) big.push([x, y, k]);
  }
  const tw = W*s, gx = 10, per = Math.max(1, Math.floor(300 / (tw + gx))), th = H*s;
  const g = big.map(([x, y, k], i) => { const ox = (i % per)*(tw + gx), oy = Math.floor(i / per)*(th + 10);
    return '<g' + popAt(1 + i*0.4) + '>' + q.cells.map(([cx, cy]) => '<rect x="' + (ox + cx*s) + '" y="' + (oy + cy*s) + '" width="' + s + '" height="' + s + '" fill="none" stroke="var(--muted)" stroke-width=".8"/>').join('') +
      '<rect x="' + (ox + x*s) + '" y="' + (oy + y*s) + '" width="' + k*s + '" height="' + k*s + '" fill="rgba(47,111,143,.2)" stroke="' + (k === 2 ? 'var(--accent)' : 'var(--warm)') + '" stroke-width="2"/></g>'; }).join('');
  const w = Math.min(big.length, per)*(tw + gx) - gx, h = Math.ceil(big.length / per)*(th + 10) - 10;
  return '<svg viewBox="-3 -3 ' + (w + 6) + ' ' + (h + 6) + '" style="display:block; width:' + Math.round((w + 6)*1.3) + 'px; max-width:100%; margin:6px auto" role="img" aria-label="' +
    tr('големите квадрати на фигурата', 'великі квадрати на фігурі') + '">' + g + '</svg>';
}
function eqCountSq(q){
  return q.sizes.join(' + ') + ' = ' + q.ans;
}
function whyCountSq(q, full){
  if(!full && q.shape === 'strip') return tr('Не само малките: всеки четири квадратчета, събрани две на две, образуват квадрат — а може да има и по-голям.', 'Не лише маленькі: кожні чотири квадратики, складені два на два, утворюють квадрат — а може бути й більший.');
  if(!full) return tr('Не само малките: и всяко каре от плочки два на два е квадрат.', 'Не лише маленькі: кожен блок плиток два на два — теж квадрат.');
  return (q.shape === 'strip' ? countSqBig(q) : '') + q.sizes.map((n, i) => (i + 1) + '×' + (i + 1) + ': <b>' + n + '</b>').join(', ') + ' &nbsp;→&nbsp; ' + q.sizes.join(' + ') + ' = ' + q.ans;
}
KIND.countsq = { draw:drawCountSq, eq:eqCountSq, why:whyCountSq };
