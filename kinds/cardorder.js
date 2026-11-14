// Question kind 'cardorder': level 418 Редът на картите — Five equal square cards lie on a table, overlapping: in what order were they put down.

// Кенгуру 2019, 2 клас, задача 11: five equal square cards with the numbers 1–5; card 1 lies over 4, 3 over 1 and 4, 2 over 3 (and under 5), 5 over 2 and 3:
// put down 4, 1, 3, 2, 5 (A). The picture is drawn card by card in the order they were put down, so a later card hides part of an earlier one; each number
// sits in its card's corner and is never hidden. Every pair that overlaps shows which is on top, and together they leave one order only (the
// generator reads that back from its own raster before it keeps a layout). The answer is a row of numbers, so the kind brings its own А–Д.
import { KIND, rnd, shuffle, svgText, tr } from '../js/core.js';

export const CO_SIZE = 60, CO_PAD = 4;
const FILL = ['var(--accentbg)', 'var(--warmbg)', 'var(--goodbg)', 'var(--badbg)', 'var(--fur-light)'];
/** the cards by number 1–5 as [x, y]; pile = the numbers from the first put down to the last */
const owner = (/** @type {number[][]} */ pos, /** @type {number[]} */ pile, /** @type {number} */ x, /** @type {number} */ y) => {
  let top = 0;
  pile.forEach(n => { const [cx, cy] = pos[n - 1]; if(x >= cx && x < cx + CO_SIZE && y >= cy && y < cy + CO_SIZE) top = n; });
  return top;
};
/** the orders the picture allows: every order that puts each visible overlap the way it shows */
export function coAllowed(/** @type {number[][]} */ pos, /** @type {number[]} */ pile){
  const above = /** @type {Record<string, number>} */ ({});
  for(let x = 0; x < 150; x += 3) for(let y = 0; y < 150; y += 3){
    const inn = [1, 2, 3, 4, 5].filter(n => x >= pos[n - 1][0] && x < pos[n - 1][0] + CO_SIZE && y >= pos[n - 1][1] && y < pos[n - 1][1] + CO_SIZE);
    if(inn.length < 2) continue;
    const t = owner(pos, pile, x, y);
    inn.forEach(b => { if(b !== t) above[t + '>' + b] = (above[t + '>' + b] || 0) + 1; });
  }
  const rel = Object.keys(above).filter(k => above[k] >= 3).map(k => k.split('>').map(Number));
  const out = /** @type {number[][]} */ ([]);
  const perm = (/** @type {number[]} */ a, /** @type {number[]} */ r) => { if(!a.length){ if(rel.every(([t, b]) => r.indexOf(t) > r.indexOf(b))) out.push(r); } else a.forEach((v, i) => perm(a.filter((_, j) => j !== i), r.concat(v))); };
  perm([1, 2, 3, 4, 5], []);
  return out;
}
/** the question for a layout (cards by number, [x, y]) and the order they were put down: five answers, one of them the order */
export function cardOrder(/** @type {number[][]} */ pos, /** @type {number[]} */ pile){
  const all = /** @type {number[][]} */ ([]);
  const perm = (/** @type {number[]} */ a, /** @type {number[]} */ r) => { if(!a.length) all.push(r); else a.forEach((v, i) => perm(a.filter((_, j) => j !== i), r.concat(v))); };
  perm([1, 2, 3, 4, 5], []);
  for(let t = 0; t < 30; t++){
    const set = shuffle(all.filter(p => p.join() !== pile.join())).slice(0, 4).concat([pile]);
    const modal = [0, 1, 2, 3, 4].map(l => [1, 2, 3, 4, 5].map(s => [s, set.filter(p => p[l] === s).length]).sort((a, b) => b[1] - a[1])[0][0]);
    const score = set.map(p => p.filter((s, l) => s === modal[l]).length);
    if(score[4] === Math.max(...score)) continue;   // a vote on each place must not give the answer
    const order = shuffle(set.slice()), pick = order.indexOf(pile);
    return {kind:'cardorder', pos, pile, options: order.map((p, id) => ({ id, v: id, text: [p.join('-'), p.join('-')], seq: p })), pick, own: true, ans: pick};
  }
  return null;
}
export function genCardOrder(){
  for(;;){
    const pile = shuffle([1, 2, 3, 4, 5]), pos = [1, 2, 3, 4, 5].map(() => [CO_PAD + rnd(15) * 5, CO_PAD + rnd(15) * 5]);
    // a number sits at its card's corner: it must not be under a later card, nor near another number
    const seen = pile.every((n, i) => { const [cx, cy] = pos[n - 1]; return pile.slice(i + 1).every(m => { const [mx, my] = pos[m - 1]; return !(cx + 10 > mx - 8 && cx + 10 < mx + CO_SIZE + 8 && cy + 10 > my - 8 && cy + 10 < my + CO_SIZE + 8); }); });
    if(!seen || [1, 2, 3, 4, 5].some(a => [1, 2, 3, 4, 5].some(b => a < b && Math.hypot(pos[a - 1][0] - pos[b - 1][0], pos[a - 1][1] - pos[b - 1][1]) < 20))) continue;
    const ok = coAllowed(pos, pile);
    if(ok.length !== 1 || ok[0].join() !== pile.join()) continue;
    const q = cardOrder(pos, pile);
    if(q) return q;
  }
}
function pic(q){
  const g = q.pile.map((/** @type {number} */ n) => { const [x, y] = q.pos[n - 1];
    return '<g data-card="' + n + '"><rect x="' + x + '" y="' + y + '" width="' + CO_SIZE + '" height="' + CO_SIZE + '" fill="' + FILL[n - 1] + '" stroke="var(--fur-dark)" stroke-width="2"/>' +
      '<circle cx="' + (x + 10) + '" cy="' + (y + 10) + '" r="7.5" fill="var(--paper)" stroke="var(--fur-dark)" stroke-width="1.6"/>' + svgText(x + 10, y + 14.5, n, 12, 'var(--ink)') + '</g>'; }).join('');
  const W = CO_PAD * 2 + 70 + CO_SIZE;
  return '<svg viewBox="0 0 ' + W + ' ' + W + '" style="display:block; width:270px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('пет еднакви квадратни карти с номера от 1 до 5, които се застъпват', 'п’ять однакових квадратних карток з номерами від 1 до 5, що перекриваються') + '">' + g + '</svg>';
}
function drawCardOrder(q){
  return '<div class="ask">' + tr('На масата са поставени пет еднакви квадратни карти, както е показано на схемата. <b>В каква последователност са били поставени картите?</b> Номерата са от първата поставена до последната.',
    'На столі лежать п’ять однакових квадратних карток, як показано на схемі. <b>У якій послідовності їх клали?</b> Номери — від першої покладеної до останньої.') + '</div>' + pic(q);
}
function eqCardOrder(q){ return tr('първата е най-отдолу, последната — най-отгоре: ', 'перша — найнижче, остання — найвище: ') + q.pile.join('-'); }
function whyCardOrder(q, full){
  if(!full) return tr('Картата, която е отгоре на друга, е поставена по-късно. Намери коя е най-отдолу, после коя е върху нея, и така нататък.', 'Картка, що лежить на іншій, покладена пізніше. Знайди, яка найнижче, потім яка на ній, і так далі.');
  return q.pile.slice(1).map((/** @type {number} */ b, i) => tr('върху ' + q.pile[i] + ' е ' + b, 'на ' + q.pile[i] + ' — ' + b)).join('<br>') + '<br>' + tr('Ред: ', 'Порядок: ') + '<b>' + q.pile.join('-') + '</b>';
}
KIND.cardorder = { draw: drawCardOrder, eq: eqCardOrder, why: whyCardOrder };
