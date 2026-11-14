// Question kind 'countsq': level 105 Всички квадрати — Squares of every size in a figure of tiles.

// МБГ Зима 2022, задача 14: a figure of 11 square tiles; 11 small squares and 3 of two by two, 14.
// The big ones are the trap: every 2 × 2 (or 3 × 3) block of tiles is a square too. Counted here
// by looking at every block, never by a rule.
import { KIND, answerLine, popAt, rnd, tr } from '../js/core.js';
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
// Салабашев 2020, задача 7: a 4 × 4 square cut into tiles of mixed sizes (a rectangle two by one, small squares, two big squares of
// two by two): the squares of every size, those made of several tiles too. A square counts when no tile crosses its edge: 6 + 2 big tiles +
// 3 made of the small tiles and the rectangle + the whole = 12. Cut by filling the first empty cell with a tile that fits.
export function genCountSqMixed(){
  const SIZES = [[1, 1], [1, 1], [1, 1], [2, 1], [1, 2], [2, 2], [2, 2]];
  for(;;){
    const taken = Array.from({ length: 4 }, () => Array(4).fill(false)), tiles = [];
    for(let y = 0; y < 4; y++) for(let x = 0; x < 4; x++){
      if(taken[y][x]) continue;
      const fit = SIZES.filter(([w, h]) => x + w <= 4 && y + h <= 4 && taken[y].slice(x, x + w).every(v => !v) && (h === 1 || !taken[y + 1].slice(x, x + w).some(v => v)));
      const [w, h] = fit[rnd(fit.length)];
      for(let j = 0; j < h; j++) for(let i = 0; i < w; i++) taken[y + j][x + i] = true;
      tiles.push([x, y, w, h]);
    }
    const bySize = mixedSquares(tiles), sizes = Object.values(bySize), ans = sizes.reduce((a, b) => a + b, 0);
    if(new Set(tiles.map(t => t[2] + 'x' + t[3])).size < 3 || bySize[1] === undefined || ans < 8 || ans > 16) continue;
    return {kind:'countsq', shape:'mixed', tiles, bySize, sizes, ans};
  }
}
/** squares of side k at (x, y) that no tile crosses: counted by size */
function mixedSquares(tiles){
  const by = {};
  for(let k = 1; k <= 4; k++) for(let y = 0; y + k <= 4; y++) for(let x = 0; x + k <= 4; x++)
    if(tiles.every(([tx, ty, w, h]) => { const inside = tx >= x && ty >= y && tx + w <= x + k && ty + h <= y + k, outside = tx >= x + k || ty >= y + k || tx + w <= x || ty + h <= y; return inside || outside; })) by[k] = (by[k] || 0) + 1;
  return by;
}
function mixedSvg(q, only){
  const u = 30, s = only ? 9 : u, shown = only ? [only[0], only[1], only[2]] : null;
  const g = q.tiles.map(([x, y, w, h]) => '<rect x="' + x*s + '" y="' + y*s + '" width="' + w*s + '" height="' + h*s + '" fill="' + (only ? 'none' : 'color-mix(in srgb, var(--warm) 30%, transparent)') + '" stroke="' + (only ? 'var(--muted)' : 'var(--accent)') + '" stroke-width="' + (only ? 0.8 : 3) + '"/>').join('') +
    (shown ? '<rect x="' + shown[0]*s + '" y="' + shown[1]*s + '" width="' + shown[2]*s + '" height="' + shown[2]*s + '" fill="rgba(47,111,143,.2)" stroke="var(--accent)" stroke-width="2"/>' : '');
  return g;
}
function countSqSvg(cells){
  const u = 30, W = Math.max(...cells.map(c => c[0])) + 1, H = Math.max(...cells.map(c => c[1])) + 1;
  return '<div class="fig"><svg viewBox="-3 -3 ' + (W*u + 6) + ' ' + (H*u + 6) + '" style="max-width:' + (W*44) + 'px" role="img" aria-label="' + tr('фигура от квадратни плочки', 'фігура з квадратних плиток') + '">' +
    cells.map(([x, y]) => '<rect x="' + x*u + '" y="' + y*u + '" width="' + u + '" height="' + u + '" fill="color-mix(in srgb, var(--warm) 35%, transparent)" stroke="var(--ink)" stroke-width="1.6"/>').join('') + '</svg></div>';
}
function drawCountSq(q){
  if(q.shape === 'mixed') return '<div class="ask">' + tr('Колко <b>квадрата</b> има на фигурата?', 'Скільки <b>квадратів</b> на фігурі?') + '</div><div class="fig"><svg viewBox="-4 -4 128 128" style="max-width:220px" role="img" aria-label="' +
    tr('квадрат 4 на 4, разделен на плочки', 'квадрат 4 на 4, поділений на плитки') + '">' + mixedSvg(q) + '</svg></div>' + answerLine('xl');
  if(q.shape === 'strip') return '<div class="ask">' + tr('Фигурата е образувана от <span class="num">' + q.cells.length + '</span> еднакви малки квадратчета. Колко са <b>всичките</b> квадрати на фигурата?',
    'Фігуру утворено з <span class="num">' + q.cells.length + '</span> однакових маленьких квадратиків. Скільки <b>всього</b> квадратів на фігурі?') + '</div>' +
    countSqSvg(q.cells) + answerLine('xl');
  return '<div class="ask">' + tr('Фигурата е образувана от <span class="num">' + q.cells.length + '</span> квадратни плочки. Колко <b>общо</b> са квадратите на фигурата?',
    'Фігуру складено з <span class="num">' + q.cells.length + '</span> квадратних плиток. Скільки <b>всього</b> квадратів на фігурі?') + '</div>' +
    countSqSvg(q.cells) + answerLine('xl');
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
  if(q.shape === 'mixed'){
    if(!full) return tr('Не само плочките: квадрат е и всяко място, на което няма плочка през границата му — дори да е направено от няколко плочки.', 'Не лише плитки: квадрат — це й кожне місце, де жодна плитка не перетинає його межі, навіть складене з кількох плиток.');
    const sizes = Object.keys(q.bySize), big = [];
    for(let k = 2; k <= 4; k++) for(let y = 0; y + k <= 4; y++) for(let x = 0; x + k <= 4; x++)
      if(q.tiles.every(([tx, ty, w, h]) => (tx >= x && ty >= y && tx + w <= x + k && ty + h <= y + k) || tx >= x + k || ty >= y + k || tx + w <= x || ty + h <= y)) big.push([x, y, k]);
    const per = 5, gx = 10, rows = Math.ceil(big.length / per);
    const mini = big.map((b, i) => '<g transform="translate(' + (i % per)*(36 + gx) + ' ' + Math.floor(i / per)*46 + ')"' + popAt(1 + i*0.4) + '>' + mixedSvg(q, b) + '</g>').join('');
    const w = Math.min(big.length, per)*(36 + gx) - gx;
    return (big.length ? '<svg viewBox="-3 -3 ' + (w + 6) + ' ' + (rows*46 - 10 + 6) + '" style="display:block; width:' + Math.round((w + 6)*1.4) + 'px; max-width:100%; margin:6px auto" role="img" aria-label="' + tr('по-големите квадрати', 'більші квадрати') + '">' + mini + '</svg>' : '') +
      sizes.map(k => k + ' на ' + k + ': <b>' + q.bySize[k] + '</b>').join(', ') + ' &nbsp;→&nbsp; ' + q.sizes.join(' + ') + ' = ' + q.ans;
  }
  if(!full && q.shape === 'strip') return tr('Не само малките: всеки четири квадратчета, събрани две на две, образуват квадрат — а може да има и по-голям.', 'Не лише маленькі: кожні чотири квадратики, складені два на два, утворюють квадрат — а може бути й більший.');
  if(!full) return tr('Не само малките: и всяко каре от плочки два на два е квадрат.', 'Не лише маленькі: кожен блок плиток два на два — теж квадрат.');
  return (q.shape === 'strip' ? countSqBig(q) : '') + q.sizes.map((n, i) => (i + 1) + ' на ' + (i + 1) + ': <b>' + n + '</b>').join(', ') + ' &nbsp;→&nbsp; ' + q.sizes.join(' + ') + ' = ' + q.ans;
}
KIND.countsq = { draw:drawCountSq, eq:eqCountSq, why:whyCountSq };
