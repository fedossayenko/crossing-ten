// Question kind 'paintrow': level 101 Оцвети квадратчетата — Colour a row so no two neighbours match.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Зима 2023, задача 19: three squares in a row, white, green or red, no two neighbours
// alike. The first has 3 choices, each next one 2 (anything but its neighbour's): 3 · 2 · 2 = 12.
const PAINT_COL = [['бяло','біле'], ['зелено','зелене'], ['червено','червоне'], ['синьо','синє']];
function genPaintRow(){
  for(;;){
    const n = 2 + rnd(3), c = 2 + rnd(3), ans = c * Math.pow(c - 1, n - 1);
    if(ans > 36 || ans < 4) continue;
    return {kind:'paintrow', n, c, ans};
  }
}
function paintRowSvg(n){
  const u = 44;
  let g = '';
  for(let i = 0; i < n; i++) g += '<rect x="' + i*u + '" y="0" width="' + u + '" height="' + u + '"/>';
  return '<div class="fig"><svg viewBox="-3 -3 ' + (n*u + 6) + ' ' + (u + 6) + '" style="max-width:' + (n*56) + 'px" role="img" aria-label="' + tr('квадратчета в редица', 'квадратики в ряд') + '">' +
    '<g stroke="var(--ink)" stroke-width="2.2" fill="none">' + g + '</g></svg></div>';
}
function drawPaintRow(q){
  if(q.kind === 'paintrow'){
    const cols = PAINT_COL.slice(0, q.c), list = (_, i) => cols.slice(0, -1).map(x => x[i]).join(', ') + (i ? ' або ' : ' или ') + cols[q.c - 1][i];
    return '<div class="ask">' + tr('Всяко от ' + ({2:'двете', 3:'трите', 4:'четирите'})[q.n] + ' квадратчета трябва да се оцвети в някой от цветовете ' + list(cols, 0) +
      ', като <b>две съседни</b> квадратчета не могат да бъдат оцветени в един и същ цвят. По колко начина може да стане оцветяването?',
      'Кожен із ' + ({2:'двох', 3:'трьох', 4:'чотирьох'})[q.n] + ' квадратиків треба зафарбувати в один із кольорів: ' + list(cols, 1) +
      ', причому <b>два сусідні</b> квадратики не можуть бути одного кольору. Скількома способами можна їх зафарбувати?') + '</div>' +
      paintRowSvg(q.n) + '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqPaintRow(q){
  if(q.kind === 'paintrow') return [q.c].concat(Array(q.n - 1).fill(q.c - 1)).join(' · ') + ' = ' + q.ans;
}
function whyPaintRow(q, full){
  if(q.kind === 'paintrow'){
    if(!full) return tr('Първото квадратче има ' + q.c + ' възможности. А всяко следващо?', 'Перший квадратик має ' + q.c + ' можливості. А кожен наступний?');
    return tr('първото — <b>' + q.c + '</b> цвята, всяко следващо — <b>' + (q.c - 1) + '</b> (без цвета на съседа)', 'перший — <b>' + q.c + '</b> кольори, кожен наступний — <b>' + (q.c - 1) + '</b> (без кольору сусіда)') +
      ' &nbsp;→&nbsp; ' + eqPaintRow(q);
  }
}
KIND.paintrow = { draw:drawPaintRow, eq:eqPaintRow, why:whyPaintRow };
