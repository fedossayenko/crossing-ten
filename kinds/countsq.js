// Question kind 'countsq': level 105 Всички квадрати — Squares of every size in a figure of tiles.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Зима 2022, задача 14: a figure of 11 square tiles; 11 small squares and 3 of two by two, 14.
// The big ones are the trap: every 2 × 2 (or 3 × 3) block of tiles is a square too. Counted here
// by looking at every block, never by a rule.
function countSquares(cells){
  const has = (x, y) => cells.some(c => c[0] === x && c[1] === y), sizes = [];
  for(let k = 1; k <= 4; k++){
    let n = 0;
    cells.forEach(([x, y]) => { let ok = true; for(let i = 0; i < k && ok; i++) for(let j = 0; j < k && ok; j++) ok = has(x + i, y + j); if(ok) n++; });
    if(n) sizes.push(n);
  }
  return sizes;
}
function genCountSq(){
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
function countSqSvg(cells){
  const u = 30, W = Math.max(...cells.map(c => c[0])) + 1, H = Math.max(...cells.map(c => c[1])) + 1;
  return '<div class="fig"><svg viewBox="-3 -3 ' + (W*u + 6) + ' ' + (H*u + 6) + '" style="max-width:' + (W*44) + 'px" role="img" aria-label="' + tr('фигура от квадратни плочки', 'фігура з квадратних плиток') + '">' +
    cells.map(([x, y]) => '<rect x="' + x*u + '" y="' + y*u + '" width="' + u + '" height="' + u + '" fill="color-mix(in srgb, var(--warm) 35%, transparent)" stroke="var(--ink)" stroke-width="1.6"/>').join('') + '</svg></div>';
}
function drawCountSq(q){
  if(q.kind === 'countsq'){
    return '<div class="ask">' + tr('Фигурата е образувана от <span class="num">' + q.cells.length + '</span> квадратни плочки. Колко <b>общо</b> са квадратите на фигурата?',
      'Фігуру складено з <span class="num">' + q.cells.length + '</span> квадратних плиток. Скільки <b>всього</b> квадратів на фігурі?') + '</div>' +
      countSqSvg(q.cells) + '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqCountSq(q){
  if(q.kind === 'countsq') return q.sizes.join(' + ') + ' = ' + q.ans;
}
function whyCountSq(q, full){
  if(q.kind === 'countsq'){
    if(!full) return tr('Не само малките: и всяко каре от плочки два на два е квадрат.', 'Не лише маленькі: кожен блок плиток два на два — теж квадрат.');
    return q.sizes.map((n, i) => (i + 1) + '×' + (i + 1) + ': <b>' + n + '</b>').join(', ') + ' &nbsp;→&nbsp; ' + q.sizes.join(' + ') + ' = ' + q.ans;
  }
}
KIND.countsq = { draw:drawCountSq, eq:eqCountSq, why:whyCountSq };
