// Question kind 'roomsmax': level 355 Най-голям сбор по стаите — Rooms in two rows with numbers on them: walk from the entrance to the exit, no room twice, the biggest sum.

// Кенгуру 2022, 2 клас, задача 20: eight rooms in two rows of four, numbered 1–4 above 5–8, the dinosaur comes in at room 1 and leaves by room 8, going
// from room to room (through the gaps between neighbours) and adding up the numbers; what is the biggest sum if no room may be passed twice? Not all
// the rooms: room 1 and room 8 have the same colour on a chessboard, so a walk cannot take in every room — 36 is out, 34 is the best (leave room 2
// out). Asked on any eight different numbers from 1–9, and now and then from top right to bottom left. The answer is typed.
import { KIND, SVG_FONT, answerLine, popAt, shuffle, svgFrame, svgText, tr } from '../js/core.js';
const U = 62, M = 30;
// the best walk from the top left room to the bottom right one through the 2 × 4 rooms (rows of numbers, the first walk of the biggest sum): [sum, rooms]
/** @returns {[number, number[][]]} */
export function roomsBest(nums, flip){
  const start = [0, flip ? 3 : 0], end = [1, flip ? 0 : 3];
  /** @type {[number, number[][]]} */
  let best = [0, []];
  const go = (r, c, seen, sum, way) => {
    if(r === end[0] && c === end[1]){ if(sum > best[0]) best = [sum, way.slice()]; return; }
    [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].forEach(([nr, nc]) => {
      if(nr < 0 || nr > 1 || nc < 0 || nc > 3 || seen.has(nr * 4 + nc)) return;
      seen.add(nr * 4 + nc); way.push([nr, nc]);
      go(nr, nc, seen, sum + nums[nr][nc], way);
      way.pop(); seen.delete(nr * 4 + nc);
    });
  };
  go(start[0], start[1], new Set([start[0] * 4 + start[1]]), nums[start[0]][start[1]], [start]);
  return best;
}
export function genRoomsMax(){
  const v = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 8), nums = [v.slice(0, 4), v.slice(4)], flip = Math.random() < 0.3;
  const total = v.reduce((s, x) => s + x, 0), best = roomsBest(nums, flip)[0];
  return {kind:'roomsmax', nums, flip, traps:[total], ans: best};
}
function drawRooms(q, full){
  const W = 4 * U + 2 * M, H = 2 * U + 2 * M, X = c => M + c * U, Y = r => M + r * U, inC = q.flip ? 3 : 0, outC = q.flip ? 0 : 3;
  let s = '', wall = '';
  for(let c = 0; c < 4; c++){ wall += 'M' + X(c) + ',' + Y(0) + ' h' + U + ' M' + X(c) + ',' + Y(2) + ' h' + U + ' '; }
  // the walls between neighbours leave a gap in the middle (a door): short pieces at both ends
  for(let c = 0; c < 4; c++) wall += 'M' + X(c) + ',' + Y(1) + ' h' + 16 + ' M' + (X(c) + U - 16) + ',' + Y(1) + ' h' + 16 + ' ';
  for(let r = 0; r < 2; r++) for(let c = 0; c <= 4; c++){
    if(c === 0 || c === 4){   // the outer wall, with a gap for the way in (row 0) and the way out (row 1)
      if(!(r === 0 && c === (q.flip ? 4 : 0) || r === 1 && c === (q.flip ? 0 : 4))) wall += 'M' + X(c) + ',' + Y(r) + ' v' + U + ' ';
    } else wall += 'M' + X(c) + ',' + Y(r) + ' v16 M' + X(c) + ',' + (Y(r) + U - 16) + ' v16 ';
  }
  const best = roomsBest(q.nums, q.flip)[1];
  if(full) s += '<polyline' + popAt(1) + ' points="' + [[inC === 0 ? -0.55 : 4.55, 0]].concat(best.map(([r, c]) => [c, r])).concat([[outC === 3 ? 4.55 : -0.55, 1]]).map(([c, r]) => (X(c) + U / 2) + ',' + (Y(r) + U / 2)).join(' ') +
    '" fill="none" stroke="var(--warm)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/>';
  s += '<path d="' + wall + '" stroke="var(--ink)" stroke-width="4" stroke-linecap="round" fill="none"/>';
  for(let r = 0; r < 2; r++) for(let c = 0; c < 4; c++) s += svgText(X(c) + U / 2, Y(r) + U / 2 + 8, q.nums[r][c], 24, 'var(--ink)', full ? ' paint-order="stroke" stroke="var(--solid)" stroke-width="5" stroke-linejoin="round"' : '');
  const em = (x, y, t) => '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-size="26" ' + SVG_FONT + '>' + t + '</text>\n';
  s += em(inC === 0 ? M / 2 : W - M / 2, Y(0) + U / 2 + 9, '🦕') + svgText(inC === 0 ? W - M / 2 : M / 2, Y(1) + U / 2 + 8, inC === 0 ? '→' : '←', 24, 'var(--accent)');
  return svgFrame('0 0 ' + W + ' ' + H, W, tr('две редици стаи с числа', 'два ряди кімнат із числами')) + s + '</svg>';
}
function drawRoomsMax(q){
  return '<div class="ask">' + tr('Дино се движи от входа към изхода и преминава от стая в стая, като събира числата, с които са означени стаите. Какъв най-голям сбор може да получи Дино, ако не е разрешено да се преминава през една стая повече от веднъж?',
    'Діно рухається від входу до виходу й переходить із кімнати в кімнату, збираючи числа, якими позначені кімнати. Яку найбільшу суму може отримати Діно, якщо не дозволено проходити через одну кімнату більше ніж один раз?') + '</div>' +
    '<div class="fig maze">' + drawRooms(q, false) + '</div>' + answerLine('xl');
}
const sumText = q => roomsBest(q.nums, q.flip)[1].map(([r, c]) => q.nums[r][c]).join(' + ') + ' = ' + q.ans;
function whyRoomsMax(q, full){
  if(!full) return tr('Не можеш да минеш през всички стаи: от някоя стая няма да има как да продължиш. Опитай да пропуснеш най-малката възможна стая или стаи.',
    'Пройти через усі кімнати не вийде: з якоїсь не буде як рухатися далі. Спробуй пропустити найменшу можливу кімнату або кімнати.');
  return tr('най-добрият път, без да се връщаш в стая: ', 'найкращий шлях, не повертаючись у кімнату: ') + drawRooms(q, true) + '<div><b>' + sumText(q) + '</b></div>';
}
KIND.roomsmax = { draw:drawRoomsMax, eq:sumText, why:whyRoomsMax };
