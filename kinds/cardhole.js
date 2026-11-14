// Question kind 'cardhole': level 413 Дупка през картончетата — Four equal cards lie overlapping, five points are marked: through which one a hole goes through all four.

// Кенгуру 2021, 2 клас, задача 4: four equal square cards are stacked, shifted a little; the points A and B lie on some of them, C, D and E on others;
// only D is on all four (D). The cards are drawn opaque in a few theme colours, the points as dots with letters. The answer is a letter, so the kind
// brings its own А–Д: the five letters; the other four points lie on 3, 3, 2 and 1 (or similar) of the cards, never on all four.
import { KIND, rnd, shuffle, svgText, tr } from '../js/core.js';

export const CH_SIZE = 100, CH_PAD = 8, CH_EDGE = 6;   // a card, the picture's margin, how far a dot is from any card edge
const FILL = ['var(--accentbg)', 'var(--warmbg)', 'var(--goodbg)', 'var(--badbg)'];
const LET = ['A', 'B', 'C', 'D', 'E'];
/** how many of the cards a point lies on (a point too near an edge to tell is -1) */
export const chCount = (/** @type {number[][]} */ cards, /** @type {number} */ x, /** @type {number} */ y) => {
  let n = 0;
  for(const [cx, cy] of cards){
    const dx = Math.max(cx - x, x - (cx + CH_SIZE), 0), dy = Math.max(cy - y, y - (cy + CH_SIZE), 0), inside = Math.min(x - cx, cx + CH_SIZE - x, y - cy, cy + CH_SIZE - y);
    if(dx || dy){ if(Math.hypot(dx, dy) < CH_EDGE) return -1; }
    else if(inside < CH_EDGE) return -1;
    else n++;
  }
  return n;
};
export function genCardHole(){
  for(;;){
    const cards = [0, 1, 2, 3].map(() => [CH_PAD + rnd(9) * 8, CH_PAD + rnd(9) * 8]), xs = cards.map(c => c[0]), ys = cards.map(c => c[1]);
    const sx = Math.max(...xs) - Math.min(...xs), sy = Math.max(...ys) - Math.min(...ys);
    if(sx < 40 || sx > 64 || sy < 40 || sy > 64) continue;   // the four overlap in a patch of 36–60, not a sliver, not nearly a card
    const W = CH_SIZE + sx + 2 * CH_PAD + 20, H = CH_SIZE + sy + 2 * CH_PAD, by = /** @type {number[][][]} */ ([[], [], [], [], []]);
    for(let x = 12; x <= W - 26; x += 4) for(let y = 10; y <= H - 10; y += 4){ const n = chCount(cards, x, y); if(n >= 0) by[n > 4 ? 4 : n].push([x, y]); }
    const want = [[3, 3, 2, 1], [3, 2, 2, 1], [3, 3, 3, 2], [3, 3, 2, 2]][rnd(4)], pts = [];
    const take = (/** @type {number} */ n) => { for(const p of shuffle(by[n].slice())) if(pts.every(o => Math.hypot(o[0] - p[0], o[1] - p[1]) >= 26)){ pts.push(p); return true; } return false; };
    if(!take(4) || !want.every(take)) continue;
    const order = shuffle([0, 1, 2, 3, 4]);   // order[k] = which point carries the letter k
    return cardHole(W, H, cards, order.map(i => pts[i]));
  }
}
/** the question for four cards (by [x, y]) and the five points in the order of the letters A–E: the answer is the point on all four */
export function cardHole(/** @type {number} */ W, /** @type {number} */ H, /** @type {number[][]} */ cards, /** @type {number[][]} */ pts){
  const right = pts.findIndex(p => chCount(cards, p[0], p[1]) === 4);
  return {kind:'cardhole', W, H, cards, dots: pts, options: LET.map((l, id) => ({ id, v: id, text: [l, l] })), pick: right, own: true, ans: right};
}
function pic(q){
  const g = q.cards.map((/** @type {number[]} */ c, i) => '<rect x="' + c[0] + '" y="' + c[1] + '" width="' + CH_SIZE + '" height="' + CH_SIZE + '" fill="' + FILL[i] + '" stroke="var(--fur-dark)" stroke-width="2"/>').join('') +
    q.dots.map((/** @type {number[]} */ p, i) => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3.6" fill="var(--ink)"/>' + svgText(p[0] + 11, p[1] + 5, LET[i], 14, 'var(--ink)')).join('');
  return '<svg viewBox="0 0 ' + q.W + ' ' + q.H + '" style="display:block; width:' + Math.min(q.W * 1.5, 330) + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('четири еднакви картончета, поставени едно върху друго със слабо отместване, и пет точки A, B, C, D, E', 'чотири однакові картки, покладені одна на одну з невеликим зсувом, і п’ять точок A, B, C, D, E') + '">' + g + '</svg>';
}
function drawCardHole(q){
  return '<div class="ask">' + tr('Четири картончета с еднакви размери са поставени, както е показано. <b>През коя от точките A, B, C, D или E трябва да се пробие дупка така, че и четирите картончета да бъдат пробити?</b>',
    'Чотири картки однакових розмірів покладено, як показано. <b>Через яку з точок A, B, C, D чи E треба проколоти дірку, щоб були проколоті всі чотири картки?</b>') + '</div>' + pic(q);
}
const cnt = (/** @type {any} */ q) => q.dots.map((/** @type {number[]} */ p) => chCount(q.cards, p[0], p[1]));
function eqCardHole(q){ return tr('точката, която е на всички картончета: ', 'точка, яка лежить на всіх картках: ') + LET[q.pick]; }
function whyCardHole(q, full){
  if(!full) return tr('Дупката трябва да мине през всички картончета, значи точката е там, където те се застъпват всички. Провери всяка точка: на колко картончета лежи.', 'Дірка має пройти через усі картки, тож точка там, де вони перекриваються всі. Перевір кожну точку: на скількох картках вона лежить.');
  return cnt(q).map((n, i) => LET[i] + ': ' + n + tr(' от 4', ' з 4')).join(', ') + '<br>' + tr('Само ', 'Лише ') + '<b>' + LET[q.pick] + '</b>' + tr(' е на всичките четири.', ' лежить на всіх чотирьох.');
}
KIND.cardhole = { draw: drawCardHole, eq: eqCardHole, why: whyCardHole };
