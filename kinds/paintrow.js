// Question kind 'paintrow': level 101 Оцвети квадратчетата — Colour a row so no two neighbours match.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Зима 2023, задача 19: three squares in a row, white, green or red, no two neighbours
// alike. The first has 3 choices, each next one 2 (anything but its neighbour's): 3 · 2 · 2 = 12.
const PAINT_COL = [['бяло','біле'], ['зелено','зелене'], ['червено','червоне'], ['синьо','синє']];
// МБГ Пролет 2025, задача 14: three rectangles in a figure where each touches both others, white, green
// or red, neighbours different. The first has 3 choices, the second 2, the third only 1: 3 · 2 · 1 = 6.
function genPaintFig(){
  const c = 3 + rnd(2);
  return {kind:'paintrow', fig:1, c, traps:[c*(c - 1)*(c - 1)], ans: c*(c - 1)*(c - 2)};
}
function genPaintRow(){
  if(Math.random() < 0.3) return genPaintFig();
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
function paintFigSvg(){
  return '<div class="fig"><svg viewBox="-3 -3 106 86" style="max-width:150px" role="img" aria-label="' + tr('фигура от три правоъгълника', 'фігура з трьох прямокутників') + '">' +
    '<g stroke="var(--ink)" stroke-width="2.2" fill="none"><rect x="0" y="0" width="34" height="58"/><rect x="0" y="58" width="34" height="22"/><rect x="34" y="0" width="66" height="80"/></g></svg></div>';
}
function drawPaintRow(q){
  if(q.kind === 'paintrow' && q.fig){
    const cols = PAINT_COL.slice(0, q.c), list = i => cols.slice(0, -1).map(x => x[i]).join(', ') + (i ? ' і ' : ' и ') + cols[q.c - 1][i];
    return '<div class="ask">' + tr('Фигурата на чертежа е съставена от 3 правоъгълника. Трябва да ги оцветим в ' + list(0) + ', като <b>два съседни</b> правоъгълника не са оцветени в един и същ цвят. По колко начина можем да направим оцветяването?',
      'Фігура на рисунку складається з 3 прямокутників. Їх треба зафарбувати в ' + list(1) + ' кольори так, щоб <b>два сусідні</b> прямокутники не були одного кольору. Скількома способами це можна зробити?') + '</div>' +
      paintFigSvg() + '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
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
  if(q.kind === 'paintrow' && q.fig) return q.c + ' · ' + (q.c - 1) + ' · ' + (q.c - 2) + ' = ' + q.ans;
  if(q.kind === 'paintrow') return [q.c].concat(Array(q.n - 1).fill(q.c - 1)).join(' · ') + ' = ' + q.ans;
}
function whyPaintRow(q, full){
  if(q.kind === 'paintrow' && q.fig){
    if(!full) return tr('Тук всеки правоъгълник допира и двата други. Колко цвята остават за третия?', 'Тут кожен прямокутник торкається обох інших. Скільки кольорів лишається для третього?');
    return tr('първият — <b>' + q.c + '</b>, вторият — <b>' + (q.c - 1) + '</b>, третият допира и двата — <b>' + (q.c - 2) + '</b>', 'перший — <b>' + q.c + '</b>, другий — <b>' + (q.c - 1) + '</b>, третій торкається обох — <b>' + (q.c - 2) + '</b>') + ' &nbsp;→&nbsp; ' + eqPaintRow(q);
  }
  if(q.kind === 'paintrow'){
    if(!full) return tr('Първото квадратче има ' + q.c + ' възможности. А всяко следващо?', 'Перший квадратик має ' + q.c + ' можливості. А кожен наступний?');
    return tr('първото — <b>' + q.c + '</b> цвята, всяко следващо — <b>' + (q.c - 1) + '</b> (без цвета на съседа)', 'перший — <b>' + q.c + '</b> кольори, кожен наступний — <b>' + (q.c - 1) + '</b> (без кольору сусіда)') +
      ' &nbsp;→&nbsp; ' + eqPaintRow(q);
  }
}
KIND.paintrow = { draw:drawPaintRow, eq:eqPaintRow, why:whyPaintRow };
