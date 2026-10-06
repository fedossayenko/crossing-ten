// Question kind 'paintrow': level 101 Оцвети квадратчетата — Colour a row so no two neighbours match.

// МБГ Зима 2023, задача 19: three squares in a row, white, green or red, no two neighbours
// alike. The first has 3 choices, each next one 2 (anything but its neighbour's): 3 · 2 · 2 = 12.
import { KIND, SLOT, popAt, rnd, tr } from '../js/core.js';
const PAINT_COL = [['бяло','біле'], ['зелено','зелене'], ['червено','червоне'], ['синьо','синє']];
// МБГ Пролет 2025, задача 14: three rectangles in a figure where each touches both others, white, green
// or red, neighbours different. The first has 3 choices, the second 2, the third only 1: 3 · 2 · 1 = 6.
function genPaintFig(){
  const c = 3 + rnd(2);
  return {kind:'paintrow', fig:1, c, traps:[c*(c - 1)*(c - 1)], ans: c*(c - 1)*(c - 2)};
}
export function genPaintRow(){
  if(Math.random() < 0.3) return genPaintFig();
  for(;;){
    const n = 2 + rnd(3), c = 2 + rnd(3), ans = c * Math.pow(c - 1, n - 1);
    if(ans > 36 || ans < 4) continue;
    return {kind:'paintrow', n, c, ans};
  }
}
// МБГ Полуфинал 2024, 1 клас, задача 20: three squares in a row, each green or red, neighbours different. Once
// the first is chosen the rest follow, so there are 2 ways, however long the row. Also two squares in three
// colours (3 · 2 = 6), and a row whose first square is already green: 1 way.
export function genPaintTwo(){
  const r = Math.random(), n = 2 + rnd(3);
  if(r < 0.2) return {kind:'paintrow', shape:'pair', n:2, c:3, traps:[9, 3], ans:6};
  if(r < 0.4) return {kind:'paintrow', shape:'end', n, c:2, cols:[1, 2], traps:[2], ans:1};
  return {kind:'paintrow', shape:'two', n, c:2, cols:[1, 2], traps:[Math.pow(2, n)], ans:2};   // the slip: 2 · 2 · 2, neighbours forgotten
}
const PAINT_FILL = ['#fff', 'var(--good)', 'var(--bad)', 'var(--accent)'];   // white stays white in the dark theme
// every way to colour the row, each a row of small squares (the first square fixed when it is painted already)
function paintWaysSvg(q){
  const cols = q.cols || [0, 1, 2, 3].slice(0, q.c), ways = [];
  (function go(row){
    if(row.length === q.n){ ways.push(row); return; }
    cols.forEach(c => { if(row[row.length - 1] !== c && !(q.shape === 'end' && !row.length && c !== cols[0])) go(row.concat(c)); });
  })([]);
  const s = 18, gap = 6;
  let g = '';
  ways.forEach((w, j) => w.forEach((c, i) => { g += '<rect' + popAt(1 + j) + ' x="' + i*s + '" y="' + j*(s + gap) + '" width="' + s + '" height="' + s + '" fill="' + PAINT_FILL[c] + '" stroke="var(--ink)" stroke-width="1.4"/>'; }));
  return '<svg viewBox="-2 -2 ' + (q.n*s + 4) + ' ' + (ways.length*(s + gap) - gap + 4) + '" style="display:block; width:' + (q.n*s + 4)*1.3 + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('всички оцветявания', 'усі розфарбування') + '">' + g + '</svg>';
}
function paintRowSvg(n, first){
  const u = 44;
  let g = '';
  for(let i = 0; i < n; i++) g += '<rect x="' + i*u + '" y="0" width="' + u + '" height="' + u + '"' + (i === 0 && first ? ' fill="' + first + '"' : '') + '/>';
  return '<div class="fig"><svg viewBox="-3 -3 ' + (n*u + 6) + ' ' + (u + 6) + '" style="max-width:' + (n*56) + 'px" role="img" aria-label="' + tr('квадратчета в редица', 'квадратики в ряд') + '">' +
    '<g stroke="var(--ink)" stroke-width="2.2" fill="none">' + g + '</g></svg></div>';
}
function paintFigSvg(){
  return '<div class="fig"><svg viewBox="-3 -3 106 86" style="max-width:150px" role="img" aria-label="' + tr('фигура от три правоъгълника', 'фігура з трьох прямокутників') + '">' +
    '<g stroke="var(--ink)" stroke-width="2.2" fill="none"><rect x="0" y="0" width="34" height="58"/><rect x="0" y="58" width="34" height="22"/><rect x="34" y="0" width="66" height="80"/></g></svg></div>';
}
function drawPaintRow(q){
  if(q.fig){
    const cols = PAINT_COL.slice(0, q.c), list = i => cols.slice(0, -1).map(x => x[i]).join(', ') + (i ? ' і ' : ' и ') + cols[q.c - 1][i];
    return '<div class="ask">' + tr('Фигурата на чертежа е съставена от 3 правоъгълника. Трябва да ги оцветим в ' + list(0) + ', като <b>два съседни</b> правоъгълника не са оцветени в един и същ цвят. По колко начина можем да направим оцветяването?',
      'Фігура на рисунку складається з 3 прямокутників. Їх треба зафарбувати в ' + list(1) + ' кольори так, щоб <b>два сусідні</b> прямокутники не були одного кольору. Скількома способами це можна зробити?') + '</div>' +
      paintFigSvg() + '<div class="line xl">' + SLOT + '</div>';
  }
  const cols = q.cols ? q.cols.map(c => PAINT_COL[c]) : PAINT_COL.slice(0, q.c), list = (_, i) => cols.slice(0, -1).map(x => x[i]).join(', ') + (i ? ' або ' : ' или ') + cols[q.c - 1][i];
  const end = q.shape === 'end';   // the first square painted already, in the first colour (green)
  return '<div class="ask">' + tr('Всяко от ' + ({2:'двете', 3:'трите', 4:'четирите', 5:'петте'})[q.n] + ' квадратчета трябва да се оцвети в някой от цветовете ' + list(cols, 0) +
    ', като <b>две съседни</b> квадратчета не могат да бъдат оцветени в един и същ цвят.' + (end ? ' Първото квадратче вече е оцветено в зелено.' : '') + ' По колко начина може да стане оцветяването?',
    'Кожен із ' + ({2:'двох', 3:'трьох', 4:'чотирьох', 5:'п’яти'})[q.n] + ' квадратиків треба зафарбувати в один із кольорів: ' + list(cols, 1) +
    ', причому <b>два сусідні</b> квадратики не можуть бути одного кольору.' + (end ? ' Перший квадратик уже зафарбовано в зелений колір.' : '') + ' Скількома способами можна їх зафарбувати?') + '</div>' +
    paintRowSvg(q.n, end ? PAINT_FILL[q.cols[0]] : '') + '<div class="line xl">' + SLOT + '</div>';
}
function eqPaintRow(q){
  if(q.shape === 'end') return Array(q.n).fill(1).join(' · ') + ' = ' + q.ans;
  if(q.kind === 'paintrow' && q.fig) return q.c + ' · ' + (q.c - 1) + ' · ' + (q.c - 2) + ' = ' + q.ans;
  if(q.kind === 'paintrow') return [q.c].concat(Array(q.n - 1).fill(q.c - 1)).join(' · ') + ' = ' + q.ans;
}
function whyPaintRow(q, full){
  if(q.fig){
    if(!full) return tr('Тук всеки правоъгълник допира и двата други. Колко цвята остават за третия?', 'Тут кожен прямокутник торкається обох інших. Скільки кольорів лишається для третього?');
    return tr('първият — <b>' + q.c + '</b>, вторият — <b>' + (q.c - 1) + '</b>, третият допира и двата — <b>' + (q.c - 2) + '</b>', 'перший — <b>' + q.c + '</b>, другий — <b>' + (q.c - 1) + '</b>, третій торкається обох — <b>' + (q.c - 2) + '</b>') + ' &nbsp;→&nbsp; ' + eqPaintRow(q);
  }
  if(q.shape === 'end'){
    if(!full) return tr('Първото вече е зелено. Какъв цвят остава за съседа му? А за следващото?', 'Перший уже зелений. Який колір лишається для його сусіда? А для наступного?');
    return tr('първото вече е зелено, всяко следващо — само <b>1</b> цвят (другият)', 'перший уже зелений, кожен наступний — лише <b>1</b> колір (інший)') + paintWaysSvg(q) + eqPaintRow(q);
  }
  if(q.shape === 'two' && !full) return tr('Оцвети първото квадратче. Има ли избор за следващото?', 'Зафарбуй перший квадратик. Чи є вибір для наступного?');
  if(!full) return tr('Първото квадратче има ' + q.c + ' възможности. А всяко следващо?', 'Перший квадратик має ' + q.c + ' можливості. А кожен наступний?');
  if(q.shape) return tr('първото — <b>' + q.c + '</b> цвята, всяко следващо — <b>' + (q.c - 1) + '</b> (без цвета на съседа)', 'перший — <b>' + q.c + '</b> кольори, кожен наступний — <b>' + (q.c - 1) + '</b> (без кольору сусіда)') +
    paintWaysSvg(q) + eqPaintRow(q);
  return tr('първото — <b>' + q.c + '</b> цвята, всяко следващо — <b>' + (q.c - 1) + '</b> (без цвета на съседа)', 'перший — <b>' + q.c + '</b> кольори, кожен наступний — <b>' + (q.c - 1) + '</b> (без кольору сусіда)') +
    ' &nbsp;→&nbsp; ' + eqPaintRow(q);
}
KIND.paintrow = { draw:drawPaintRow, eq:eqPaintRow, why:whyPaintRow };
