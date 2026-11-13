// Question kind 'roomsum': level 354 Стаи със сбор — A maze of rooms marked with sums: only rooms with a given sum may be walked through; which door leads out.

// Кенгуру 2024, 2 клас, задача 12: a maze of 4 × 4 rooms, each marked with a sum such as 3 + 4. You come in by the top left door and go from room to
// room through the gaps in the walls, but only through rooms whose sum is 7. Which of the other doors can you leave by? Most rooms with a 7 can be
// reached, but some are cut off by a wall, and one exit door is the only one a walk reaches: the banana (the paper's key A). The answer is a picture
// of the exit (a fruit), so the kind brings its own А–Д, one for each fruit at a door, and the wrong ones are the doors of rooms that are passable
// but shut off, and of rooms with a near sum.
import { KIND, SVG_FONT, popAt, rnd, shuffle, svgFrame, svgText, tr } from '../js/core.js';
const N = 4, U = 58, M = 32;
// [emoji, Bulgarian, Ukrainian]
/** @type {[string, string, string][]} */
const FRUITS = [['🍌', 'банан', 'банан'], ['🍊', 'портокал', 'апельсин'], ['🥕', 'морков', 'морква'], ['🍐', 'круша', 'груша'], ['🍎', 'ябълка', 'яблуко'], ['🍇', 'грозде', 'виноград'], ['🍓', 'ягода', 'полуниця']];
// The maze is q.sums (rows of [a, b]), q.h[r][c]: wall above room (r, c), r = 0..N (r = N is the bottom edge), q.v[r][c]: wall left of room (r, c), c = 0..N,
// and the exits q.exits [{side: 'top' | 'right' | 'bottom' | 'left', at, fruit}] (a gap in the edge), the way in being the left edge of room (0, 0).
// The rooms she can be in: from the first room through gaps into rooms with the sum.
export function roomsReach(q){
  const ok = (r, c) => q.sums[r][c][0] + q.sums[r][c][1] === q.S, seen = new Set(['0,0']), todo = [[0, 0]];
  if(!ok(0, 0)) return seen;
  while(todo.length){
    const [r, c] = todo.pop();
    /** @type {[number, number, boolean][]} */
    const next = [[r - 1, c, !q.h[r][c]], [r + 1, c, !q.h[r + 1][c]], [r, c - 1, !q.v[r][c]], [r, c + 1, !q.v[r][c + 1]]];
    next.forEach(([nr, nc, open]) => {
      if(open && nr >= 0 && nr < N && nc >= 0 && nc < N && ok(nr, nc) && !seen.has(nr + ',' + nc)) seen.add(nr + ',' + nc), todo.push([nr, nc]);
    });
  }
  return seen;
}
// the room next to an exit
export const exitRoom = e => e.side === 'top' ? [0, e.at] : e.side === 'bottom' ? [N - 1, e.at] : e.side === 'left' ? [e.at, 0] : [e.at, N - 1];
export function roomsExitsOut(q){ const seen = roomsReach(q); return q.exits.map((e, i) => [e, i]).filter(([e]) => seen.has(exitRoom(e).join(','))).map(([, i]) => i); }
// the picked option of a built question: the right exit among the five
function withOptions(q, right){
  const ids = shuffle(q.exits.map((_, i) => i));
  q.options = ids.map((ex, id) => ({ id, v: id, text: [fruitSpanOf(q.exits[ex].fruit, 0), fruitSpanOf(q.exits[ex].fruit, 1)] }));
  q.pick = ids.indexOf(right); q.ans = q.pick; q.own = true;
  return q;
}
export const fruitSpanOf = (f, uk) => '<span role="img" aria-label="' + FRUITS[f][1 + uk] + '" style="font-size:30px">' + FRUITS[f][0] + '</span>';
export function genRoomSum(){
  for(;;){
    const S = 6 + rnd(4), pass = [];
    const sums = [...Array(N)].map(() => [...Array(N)].map(() => {
      const good = rnd(100) < 72, a = rnd(S + 1), t = good ? S : S + [-2, -1, 1][rnd(3)];
      pass.push(good);
      return [Math.min(a, t), t - Math.min(a, t)];
    }));
    sums[0][0] = (a => [a, S - a])(rnd(S + 1));
    const h = [...Array(N + 1)].map((_, r) => [...Array(N)].map(() => r > 0 && r < N && rnd(100) < 30));
    const v = [...Array(N)].map(() => [...Array(N + 1)].map((_, c) => c > 0 && c < N && rnd(100) < 30));
    // five gaps in the outer edge besides the way in and the door of the first room (which is always passable), each a different fruit
    const slots = [];
    for(let i = 0; i < N; i++) slots.push(i ? {side:'top', at:i} : null, {side:'bottom', at:i}, {side:'right', at:i}, i ? {side:'left', at:i} : null);
    const exits = shuffle(slots.filter(Boolean)).slice(0, 5), fr = shuffle(FRUITS.map((_, i) => i));
    exits.forEach((e, i) => { e.fruit = fr[i]; });
    const q = {kind:'roomsum', S, sums, h, v, exits, traps:[]};
    const out = roomsExitsOut(q);
    if(out.length !== 1) continue;
    // a wrong door that a room with the sum stands behind (so only the walls say no), and one with a wrong sum
    const rest = exits.map((e, i) => i).filter(i => i !== out[0]), okRoom = i => { const [r, c] = exitRoom(exits[i]); return sums[r][c][0] + sums[r][c][1] === S; };
    if(!rest.some(okRoom) || !rest.some(i => !okRoom(i))) continue;
    return withOptions(q, out[0]);
  }
}
function drawMaze(q, full){
  const W = N * U + 2 * M, reach = roomsReach(q), exit = roomsExitsOut(q)[0], ex = e => { const [r, c] = exitRoom(e); return [M + c * U + U / 2, M + r * U + U / 2]; };
  const gapAt = (side, at) => q.exits.some(e => e.side === side && e.at === at) || side === 'left' && at === 0;
  let s = '', wall = '';
  if(full) for(const k of reach){ const [r, c] = k.split(',').map(Number); s += '<rect x="' + (M + c * U + 2) + '" y="' + (M + r * U + 2) + '" width="' + (U - 4) + '" height="' + (U - 4) + '" fill="var(--goodbg)"/>'; }
  for(let r = 0; r <= N; r++) for(let c = 0; c < N; c++)
    if(q.h[r][c] || r === 0 && !gapAt('top', c) || r === N && !gapAt('bottom', c)) wall += 'M' + (M + c * U) + ',' + (M + r * U) + ' h' + U + ' ';
  for(let r = 0; r < N; r++) for(let c = 0; c <= N; c++)
    if(q.v[r][c] || c === 0 && !gapAt('left', r) || c === N && !gapAt('right', r)) wall += 'M' + (M + c * U) + ',' + (M + r * U) + ' v' + U + ' ';
  s += '<path d="' + wall + '" stroke="var(--ink)" stroke-width="4" stroke-linecap="round" fill="none"/>';
  const out = (e, t, size) => { const [x, y] = ex(e), d = e.side === 'top' ? [0, -U / 2 - 14] : e.side === 'bottom' ? [0, U / 2 + 22] : e.side === 'left' ? [-U / 2 - 14, 8] : [U / 2 + 14, 8];
    return '<text x="' + (x + d[0]) + '" y="' + (y + d[1]) + '" text-anchor="middle" font-size="' + size + '" ' + SVG_FONT + '>' + t + '</text>\n'; };
  s += out({side:'left', at:0}, '🧑', 24);
  q.exits.forEach(e => { s += out(e, FRUITS[e.fruit][0], 24); });
  if(full){   // the walk, room by room, to the exit
    const to = exitRoom(q.exits[exit]), prev = {'0,0': null}, todo = [[0, 0]];
    while(todo.length){
      const [r, c] = todo.shift();
      /** @type {[number, number, boolean][]} */
      const next = [[r - 1, c, !q.h[r][c]], [r + 1, c, !q.h[r + 1][c]], [r, c - 1, !q.v[r][c]], [r, c + 1, !q.v[r][c + 1]]];
      next.forEach(([nr, nc, open]) => {
        const k = nr + ',' + nc;
        if(open && reach.has(k) && !(k in prev)) prev[k] = r + ',' + c, todo.push([nr, nc]);
      });
    }
    const way = []; for(let k = to.join(','); k; k = prev[k]) way.unshift(k.split(',').map(Number));
    const e = q.exits[exit], [x1, y1] = ex(e), d = e.side === 'top' ? [0, -U / 2] : e.side === 'bottom' ? [0, U / 2] : e.side === 'left' ? [-U / 2, 0] : [U / 2, 0];
    const pts = [[M - U / 2 + 4, M + U / 2]].concat(way.map(([r, c]) => [M + c * U + U / 2, M + r * U + U / 2])).concat([[x1 + d[0], y1 + d[1]]]);
    s += '<polyline' + popAt(1) + ' points="' + pts.map(p => p.join(',')).join(' ') + '" fill="none" stroke="var(--warm)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>';
  }
  for(let r = 0; r < N; r++) for(let c = 0; c < N; c++)
    s += svgText(M + c * U + U / 2, M + r * U + U / 2 + 5, q.sums[r][c][0] + ' + ' + q.sums[r][c][1], 15, 'var(--ink)', full ? ' paint-order="stroke" stroke="var(--solid)" stroke-width="4" stroke-linejoin="round"' : '');
  return svgFrame('0 0 ' + W + ' ' + W, W, tr('лабиринт от стаи със сборове', 'лабіринт із кімнат із сумами')) + s + '</svg>';
}
function drawRoomSum(q){
  return '<div class="ask">' + tr('За влизане в лабиринта се използва вратата горе вляво и се преминава от „стая“ в „стая“. Разрешено е преминаване само през „стаи“ със сбор на числата в тях, равен на ' + q.S + '. През коя врата, различна от входа, може да се излезе от лабиринта?',
    'Для входу в лабіринт використовують двері вгорі ліворуч і переходять із «кімнати» в «кімнату». Дозволено проходити лише через «кімнати», у яких сума чисел дорівнює ' + q.S + '. Через які двері, відмінні від входу, можна вийти з лабіринту?') + '</div>' +
    '<div class="fig maze">' + drawMaze(q, false) + '</div>';
}
const nameOf = q => { const e = q.exits[roomsExitsOut(q)[0]]; return tr(FRUITS[e.fruit][1], FRUITS[e.fruit][2]); };
function eqRoomSum(q){ return tr('вратата с картинката: ', 'двері з малюнком: ') + nameOf(q); }
function whyRoomSum(q, full){
  if(!full) return tr('Оцвети в ума си стаите, в които сборът е верният. После върви от входа само през тях и само през отворените места в стените. Има стаи, до които не можеш да стигнеш.',
    'Зафарбуй подумки кімнати з потрібною сумою. Потім іди від входу лише через них і лише крізь прохідні місця в стінах. Є кімнати, до яких не дійти.');
  return tr('Само оцветените стаи имат сбор ' + q.S + ' и до тях се стига от входа. Изходът е вратата с картинката: ' + nameOf(q) + '.',
    'Лише зафарбовані кімнати мають суму ' + q.S + ', і до них можна дійти від входу. Вихід — двері з малюнком: ' + nameOf(q) + '.') + drawMaze(q, true);
}
KIND.roomsum = { draw:drawRoomSum, eq:eqRoomSum, why:whyRoomSum };
