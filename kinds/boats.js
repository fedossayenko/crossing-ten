// Question kind 'boats': level 394 Коя е моята лодка — Five sailing boats with portholes, and triangles and squares on a sail: which boat is it.

// Кенгуру 2023, задача 5: «повече от едно кръгче и върху едно от платната триъгълничетата са с 2 повече от квадратчетата»: the boats are
// (portholes, triangles, squares) 2-2-1, 3-3-2, 1-5-3, 2-1-3, 3-4-2 and only E has both. The answer is a picture, so the kind brings its own
// А–Д. Exactly one boat has both; one more has the triangles right and one porthole, the other three have portholes and wrong triangles.
// No boat is the one with the most or the fewest of anything (a vote on portholes, triangles, squares or all of them must not give it away).
import { KIND, rnd, shuffle, trN, tr } from '../js/core.js';
const PRINTED = [[2, 2, 1], [3, 3, 2], [1, 5, 3], [2, 1, 3], [3, 4, 2]];   // [portholes, triangles, squares], A to E
const LETTERS = 'АБВГД', JIB = ['bad', 'warm', 'grape', 'accent', 'good'];
const SLOTS = [[70, 32], [81, 32], [70, 45], [81, 45], [92, 45], [70, 58], [81, 58], [92, 58]];
const unique = (/** @type {number[]} */ v, /** @type {number} */ sign) => { const best = Math.max(...v.map(x => x*sign)); return v.filter(x => x*sign === best).length === 1 ? v.findIndex(x => x*sign === best) : -1; };
const good = (/** @type {number[]} */ b) => b[0] > 1 && b[1] === b[2] + 2;
export function genBoats(){
  if(rnd(6) === 0) return mk(PRINTED);
  for(;;){
    const s = 1 + rnd(3), boats = [[2 + rnd(2), s + 2, s]], seen = [boats[0].join()];
    const want = ['one'].concat(shuffle(['plus1', 'same', 'plus3', 'minus']).slice(0, 3));
    want.forEach(w => {
      const s2 = 1 + rnd(3), p = w === 'one' ? 1 : 2 + rnd(2), t = w === 'one' ? s2 + 2 : w === 'plus1' ? s2 + 1 : w === 'same' ? s2 : w === 'plus3' ? s2 + 3 : Math.max(0, s2 - 1);
      boats.push([p, t, s2]);
    });
    if(boats.filter(b => b[0] === 1).length !== 1 || boats.filter(good).length !== 1 || new Set(boats.map(b => b.join())).size !== 5 || boats.some(b => b[1] + b[2] > 8)) continue;
    const at = rnd(5), order = boats.slice(1); order.splice(at, 0, boats[0]);
    const q = mk(order);
    if(q) return q;
  }
}
function mk(boats){
  const at = boats.findIndex(good);
  for(const v of [boats.map(b => b[0]), boats.map(b => b[1]), boats.map(b => b[2]), boats.map(b => b[0] + b[1] + b[2])]) for(const sign of [1, -1]) if(unique(v, sign) === at) return null;
  const jibs = shuffle(JIB.slice());
  return {kind:'boats', boats, own:true, pick:at, ans:at, options: boats.map((b, id) => ({ id, v:id, text:both(pic(b, jibs[id], id)), ports:b[0], tri:b[1], sq:b[2] }))};
}
const both = (/** @type {string} */ svg) => [svg.replace('%L', 'платноходка'), svg.replace('%L', 'вітрильник')];
const sq = (/** @type {number} */ x, /** @type {number} */ y) => '<rect x="' + (x - 4.5) + '" y="' + (y - 4.5) + '" width="9" height="9" fill="var(--warm)" stroke="var(--fur-dark)" stroke-width="1"/>';
const tri = (/** @type {number} */ x, /** @type {number} */ y) => '<polygon points="' + (x - 5.5) + ',' + (y + 4.5) + ' ' + (x + 5.5) + ',' + (y + 4.5) + ' ' + x + ',' + (y - 5.5) + '" fill="var(--good)" stroke="var(--fur-dark)" stroke-width="1" stroke-linejoin="round"/>';
function pic(b, jib, id){
  const marks = shuffle([].concat(Array(b[1]).fill('t'), Array(b[2]).fill('s'))), at = shuffle(SLOTS.slice());
  let g = '<path d="M62,8 Q108,40 106,72 L62,72Z" fill="var(--paper)" stroke="var(--fur-dark)" stroke-width="2" stroke-linejoin="round"/>' +
    '<path d="M57,14 L57,72 L16,72 Q40,40 57,14Z" fill="var(--' + jib + ')" stroke="var(--fur-dark)" stroke-width="2" stroke-linejoin="round"/>' +
    '<rect x="58.5" y="4" width="3" height="68" fill="var(--ant)"/><rect x="61" y="3" width="26" height="9" fill="var(--warm)" stroke="var(--fur-dark)" stroke-width="1"/>' +
    marks.map((m, i) => m === 't' ? tri(at[i][0], at[i][1]) : sq(at[i][0], at[i][1])).join('') +
    '<path d="M6,76 H114 L102,102 H18Z" fill="var(--ant)" stroke="var(--fur-dark)" stroke-width="2" stroke-linejoin="round"/>' +
    '<path d="M0,106 q7,-6 14,0 t14,0 t14,0 t14,0 t14,0 t14,0 t14,0 t14,0 t14,0" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linecap="round"/>';
  for(let i = 0; i < b[0]; i++) g += '<circle cx="' + (60 + (i - (b[0] - 1) / 2)*20) + '" cy="89" r="6" fill="var(--paper)" stroke="var(--bad)" stroke-width="2.6"/>';
  return '<span class="vw"><svg viewBox="0 0 120 112" width="150" height="140" role="img" aria-label="%L ' + LETTERS[id] + '">' + g + '</svg></span>';
}
const portsW = (/** @type {number} */ n) => trN(n, 'кръгче', 'кръгчета', 'ілюмінатор', 'ілюмінатори', 'ілюмінаторів');
const triW = (/** @type {number} */ n) => trN(n, 'триъгълник', 'триъгълника', 'трикутник', 'трикутники', 'трикутників');
const sqW = (/** @type {number} */ n) => trN(n, 'квадрат', 'квадрата', 'квадрат', 'квадрати', 'квадратів');
function drawBoats(){
  return '<div class="ask">' + tr('Платноходката ми има повече от едно кръгче и върху едно от платната триъгълничетата са с <b>2 повече</b> от квадратчетата. Коя е моята лодка?',
    'У мого вітрильника більше ніж один ілюмінатор, а на одному з вітрил трикутників <b>на 2 більше</b>, ніж квадратиків. Який мій човен?') + '</div>';
}
function eqBoats(q){
  return tr('повече от едно кръгче и триъгълниците с 2 повече', 'більше одного ілюмінатора й трикутників на 2 більше');
}
function whyBoats(q, full){
  if(!full) return tr('Търси две неща: повече от едно кръгче и триъгълничета с две повече от квадратчетата. Само на една лодка са верни и двете.', 'Шукай дві речі: більше одного ілюмінатора й трикутників на два більше, ніж квадратиків. Лише на одному човні є і те, і те.');
  const b = q.boats[q.pick];
  return tr('Лодка ' + LETTERS[q.pick] + ': ' + portsW(b[0]) + ', ' + triW(b[1]) + ' и ' + sqW(b[2]) + ' — ' + b[1] + ' = ' + b[2] + ' + 2.',
    'Човен ' + LETTERS[q.pick] + ': ' + portsW(b[0]) + ', ' + triW(b[1]) + ' і ' + sqW(b[2]) + ' — ' + b[1] + ' = ' + b[2] + ' + 2.');
}
KIND.boats = { draw:drawBoats, eq:eqBoats, why:whyBoats };
