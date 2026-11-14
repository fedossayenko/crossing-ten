// Question kind 'stairs': level 362 Цветни и бели — A pyramid or a staircase of coloured and white squares in turn: by how many are the coloured more.

// Кенгуру 2026, задача 7: a pyramid of 6 rows (1, 3, 5, 7, 9, 11 squares), coloured and white in turn, a coloured one at both ends of every
// row. Every row has one coloured more than white, so six rows: 21 coloured, 15 white, 6 more. The staircase (rows of 1, 2, 3, …,
// coloured first, like a chessboard) is the same count with rows that give 1 and 0 in turn.
import { KIND, answerLine, popAt, rnd, svgFrame, tr } from '../js/core.js';
export function genStairs(){
  if(rnd(5) === 0) return mk('pyramid', 6);
  for(;;){
    const q = rnd(3) ? mk('pyramid', 3 + rnd(5)) : mk('steps', 4 + rnd(5));
    if(!q.traps.includes(q.ans)) return q;
  }
}
// each square: [row, column, coloured] — the column counts from the left edge of the figure
function cellsOf(shape, N){
  const out = [];
  for(let r = 0; r < N; r++){
    const w = shape === 'pyramid' ? 2*r + 1 : r + 1, x0 = shape === 'pyramid' ? N - 1 - r : 0;
    for(let c = 0; c < w; c++) out.push([r, x0 + c, (shape === 'pyramid' ? c : r + c) % 2 === 0 ? 1 : 0]);
  }
  return out;
}
function mk(shape, N){
  const cells = cellsOf(shape, N), col = cells.filter(c => c[2]).length, white = cells.length - col;
  return {kind:'stairs', shape, N, cells, col, white, traps:[col, white], ans: col - white};
}
function pic(q, mark){
  const u = 26, W = q.shape === 'pyramid' ? 2*q.N - 1 : q.N;
  const g = q.cells.map(([r, x, on]) => '<rect x="' + x*u + '" y="' + r*u + '" width="' + u + '" height="' + u + '" fill="' + (on ? 'var(--good)' : 'var(--paper)') + '" stroke="var(--fur-dark)" stroke-width="1.4"/>').join('');
  let lab = '';
  if(mark) for(let r = 0; r < q.N; r++){
    const row = q.cells.filter(c => c[0] === r), d = row.filter(c => c[2]).length - row.filter(c => !c[2]).length;
    lab += '<text' + popAt(1 + r*0.3) + ' x="' + (W*u + 10) + '" y="' + (r*u + 19) + '" font-size="15" font-weight="800" fill="var(--ink)" font-family="Nunito, sans-serif">+' + d + '</text>';
  }
  return svgFrame('-3 -3 ' + (W*u + (mark ? 48 : 6)) + ' ' + (q.N*u + 6), Math.round((W*u + (mark ? 48 : 6))*1.1), tr('квадратчета, оцветени и бели последователно', 'квадратики, зафарбовані й білі по черзі')) + g + lab + '</svg>';
}
function drawStairs(q){
  return '<div class="ask">' + tr('С колко <b>цветните</b> квадратчета са повече от <b>белите</b>?', 'На скільки <b>кольорових</b> квадратиків більше, ніж <b>білих</b>?') + '</div>' + pic(q, false) + answerLine('md');
}
function eqStairs(q){
  return q.col + ' − ' + q.white + ' = ' + q.ans;
}
function whyStairs(q, full){
  if(!full) return q.shape === 'pyramid'
    ? tr('Погледни само един ред: колко са цветните и колко белите? Всеки ред започва и свършва с цветно квадратче.', 'Подивись лише на один рядок: скільки кольорових і скільки білих? Кожен рядок починається й закінчується кольоровим квадратиком.')
    : tr('Погледни ред по ред: колко са цветните и колко белите във всеки ред?', 'Дивись рядок за рядком: скільки кольорових і скільки білих у кожному рядку?');
  const sums = (q.shape === 'pyramid' ? 'всеки ред е с едно повече цветно' : 'редовете дават ту +1, ту +0'), sumsUk = (q.shape === 'pyramid' ? 'у кожному рядку на один кольоровий більше' : 'рядки дають по черзі +1 або +0');
  return pic(q, true) + '<div style="text-align:center">' + tr('Цветни ' + q.col + ', бели ' + q.white + ' (' + sums + '): ' + q.col + ' − ' + q.white + ' = ' + q.ans + '.',
    'Кольорових ' + q.col + ', білих ' + q.white + ' (' + sumsUk + '): ' + q.col + ' − ' + q.white + ' = ' + q.ans + '.') + '</div>';
}
KIND.stairs = { draw:drawStairs, eq:eqStairs, why:whyStairs };
