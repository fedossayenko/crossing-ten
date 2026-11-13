// Question kind 'pathcount': level 351 Колко пътя — A cat and a bowl in two corners of a board: how many ways, moving only down or right.

// Кенгуру 2019, 2 клас, задача 13: a 3×3 board, the cat top left and the bowl of milk bottom right, one square at a time, only down
// or right: 6 ways. Each square can be reached from the one above it or the one to its left, so the ways to a square are the two
// neighbours' ways added. Asked on boards of 2–4 squares a side, now and then with a brick in one square that nobody may step on,
// and now and then turned over (the cat bottom left, only up or right). The answer is typed.
import { KIND, SVG_FONT, answerLine, popAt, rnd, svgFrame, svgText, tr } from '../js/core.js';
const U = 46;   // a square, in the picture
// the ways to every square of an R × C board from the first, moving to the next row or the next column; a stone square has none
export function pathWays(R, C, stone){
  /** @type {number[][]} */
  const w = [];
  for(let r = 0; r < R; r++){
    w.push([]);
    for(let c = 0; c < C; c++){
      const blocked = stone && stone[0] === r && stone[1] === c;
      w[r].push(blocked ? 0 : r === 0 && c === 0 ? 1 : (r ? w[r - 1][c] : 0) + (c ? w[r][c - 1] : 0));
    }
  }
  return w;
}
export function genPathCount(){
  for(;;){
    const stone = Math.random() < 0.35, R = 2 + rnd(3), C = 2 + rnd(3), up = Math.random() < 0.3;
    if(R === 2 && C === 2 || R === 4 && C === 4) continue;
    if(!stone){
      const n = pathWays(R, C)[R - 1][C - 1], traps = [R * C, R + C].filter(v => v !== n);
      return {kind:'pathcount', shape:'plain', R, C, up, stone:null, traps, ans: n};
    }
    if(R < 3 || C < 3) continue;
    const at = [rnd(R), rnd(C)];
    if(at[0] === 0 && at[1] === 0 || at[0] === R - 1 && at[1] === C - 1) continue;
    const plain = pathWays(R, C)[R - 1][C - 1], n = pathWays(R, C, at)[R - 1][C - 1];
    if(n < 2 || n >= plain) continue;
    return {kind:'pathcount', shape:'stone', R, C, up, stone:at, traps:[plain], ans: n};
  }
}
const ways = q => pathWays(q.R, q.C, q.stone);
// the board, the cat in the first square, the bowl in the last; with the ways written in (full) or a route drawn (hint)
function board(q, full){
  const { R, C } = q, w = ways(q), W = Math.max(C * U + 8, 150), x0 = (W - C * U) / 2, dr = r => q.up ? R - 1 - r : r;
  const X = c => x0 + c * U, Y = r => 4 + dr(r) * U;
  let g = '';
  for(let r = 0; r < R; r++) for(let c = 0; c < C; c++){
    const stone = q.stone && q.stone[0] === r && q.stone[1] === c;
    g += '<rect x="' + X(c) + '" y="' + Y(r) + '" width="' + U + '" height="' + U + '" fill="' + (stone ? 'var(--warmbg)' : 'var(--solid)') + '" stroke="var(--ink)" stroke-width="2"/>';
  }
  const emoji = (r, c, t, s, dx, dy) => '<text x="' + (X(c) + U / 2 + dx) + '" y="' + (Y(r) + U / 2 + dy) + '" text-anchor="middle" font-size="' + s + '" ' + SVG_FONT + '>' + t + '</text>\n';
  g += emoji(0, 0, '🐱', full ? 18 : 28, full ? -10 : 0, full ? -3 : 9) + emoji(R - 1, C - 1, '🥣', full ? 18 : 28, full ? -10 : 0, full ? -3 : 9);
  if(q.stone) g += emoji(q.stone[0], q.stone[1], '🧱', 26, 0, 9);
  if(full){
    let k = 0;
    for(let r = 0; r < R; r++) for(let c = 0; c < C; c++){
      const stone = q.stone && q.stone[0] === r && q.stone[1] === c;
      if(!stone) g += svgText(X(c) + U / 2 + (r === 0 && c === 0 || r === R - 1 && c === C - 1 ? 7 : 0), Y(r) + U / 2 + 8, w[r][c], 18, 'var(--accent-ink)', popAt(1 + k++ * 0.5));
    }
  } else {   // one route back from the bowl, through squares that can be reached
    const pts = [[R - 1, C - 1]];
    while(pts[pts.length - 1][0] + pts[pts.length - 1][1] > 0){
      const [r, c] = pts[pts.length - 1];
      pts.push(r && w[r - 1][c] ? [r - 1, c] : [r, c - 1]);
    }
    g += '<polyline points="' + pts.map(([r, c]) => (X(c) + U / 2) + ',' + (Y(r) + U / 2)).join(' ') + '" fill="none" stroke="var(--accent)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/>';
  }
  return svgFrame('0 0 ' + W + ' ' + (R * U + 8), W, tr('дъска с котка и купичка', 'дошка з кішкою і мисочкою')) + g + '</svg>';
}
function drawPathCount(q){
  const brick = q.stone ? tr(' На едно квадратче има тухла — през него не може да се минава.', ' На одній клітинці лежить цегла — через неї не можна проходити.') : '';
  return '<div class="ask">' + tr('Котката и купичката с мляко се намират в два ъгъла на показаната дъска. По колко начина може котката да отиде до купичката, ако се придвижва от квадратче в квадратче само в посока ' + (q.up ? 'нагоре или надясно' : 'надолу или надясно') + '?' + brick,
    'Кішка і мисочка з молоком опинилися у двох кутках показаної дошки. Скількома способами кішка може дійти до мисочки, якщо вона рухається з клітинки в клітинку лише в напрямку ' + (q.up ? 'вгору або праворуч' : 'вниз або праворуч') + '?' + brick) + '</div>' +
    '<div class="fig">' + board(q, false).replace(/<polyline[^>]*\/>/, '') + '</div>' + answerLine('xl');
}
// the last square's two neighbours added
function lastSum(q){
  const w = ways(q);
  return w[q.R - 2][q.C - 1] + ' + ' + w[q.R - 1][q.C - 2] + ' = ' + q.ans;
}
function whyPathCount(q, full){
  const from = q.up ? tr('отдолу или отляво', 'знизу або зліва') : tr('отгоре или отляво', 'зверху або зліва');
  if(!full) return tr('До всяко квадратче котката стига ' + from + '. Започни от котката и във всяко квадратче пресметни по колко начина се стига до него.',
    'До кожної клітинки кішка потрапляє ' + from + '. Почни від кішки й у кожній клітинці порахуй, скількома способами сюди доходять.') + '<div class="fig">' + board(q, false) + '</div>';
  return tr('във всяко квадратче пишем по колко начина се стига до него: събираме числата ' + from.replace(' или ', ' и '),
    'у кожну клітинку пишемо, скількома способами сюди доходять: додаємо числа ' + from.replace(' або ', ' і ')) + (q.stone ? tr(' (в тухлата не се стига — там няма начини)', ' (до цегли не дійти — там способів немає)') : '') +
    board(q, true) + '<div><b>' + lastSum(q) + '</b></div>';
}
KIND.pathcount = { draw:drawPathCount, eq:lastSum, why:whyPathCount };
