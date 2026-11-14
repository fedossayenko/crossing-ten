// Question kind 'turnsq': level 372 Завъртане на рисунка — A square with two triangles and a circle in its corners, turned a quarter turn as shown: the picture after the same turn once more.

// Кенгуру 2024, задача 4: ▶ at the top left, ● top right, ▼ bottom right; a quarter turn clockwise gives ▼ top right, ● bottom right, ◀ bottom
// left; once more: ▲ top left, ● bottom left, ◀ bottom right (C). The answer is a picture, so the kind brings its own А–Д. Two quarter
// turns the same way are a half turn; the slips are the real ones: not turning again, turning back, turning the other way, moving the
// pieces but not the way the triangles point, and the mirror image. A picture is a map corner → piece, turned by moving each corner
// along (and each triangle's point with it).
import { KIND, shuffle, tr } from '../js/core.js';
// corners 0 top left, 1 top right, 2 bottom right, 3 bottom left; a piece: 'c' (the circle) or a triangle pointing 0 up, 1 right, 2 down, 3 left
/** @typedef {(string | number | null)[]} TqPic */
export const tqTurn = (/** @type {TqPic} */ p, /** @type {number} */ k) => { let r = p; for(let i = 0; i < ((k % 4) + 4) % 4; i++) r = [r[3], r[0], r[1], r[2]].map(x => typeof x === 'number' ? (x + 1) % 4 : x); return r; };   // a quarter turn clockwise, k times
/** the same pieces in the turned places, the triangles still pointing as before */
const tqMoved = (/** @type {TqPic} */ p, /** @type {number} */ k) => { let r = p; for(let i = 0; i < k; i++) r = [r[3], r[0], r[1], r[2]]; return r; };
/** the mirror image, left to right: corners 0 ↔ 1 and 3 ↔ 2, a triangle pointing right or left changes sides */
export const tqMirror = (/** @type {TqPic} */ p) => [p[1], p[0], p[3], p[2]].map(x => x === 1 ? 3 : x === 3 ? 1 : x);
export const tqKey = (/** @type {TqPic} */ p) => p.map(x => x === null ? '.' : x === 'c' ? 'c' : '▲▶▼◀'[/** @type {number} */ (x)]).join('');
export function genTurnSq(){
  for(;;){
    const cw = Math.random() < 0.7, empty = Math.floor(Math.random() * 4);
    const pieces = shuffle(['c', Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)]);
    const p1 = [0, 1, 2, 3].map(i => i === empty ? null : pieces.pop()), d = cw ? 1 : -1;
    // the eight ways to turn or mirror the first picture must all look different, or an option could be the answer twice
    const all = [0, 1, 2, 3].flatMap(k => [tqTurn(p1, k), tqTurn(tqMirror(p1), k)].map(tqKey));
    if(new Set(all).size !== 8) continue;
    const p2 = tqTurn(p1, d), right = tqTurn(p1, 2 * d);
    const cand = [[p2, 'same'], [p1, 'back'], [tqTurn(p1, -d), 'other'], [tqMoved(p1, 2), 'moved'], [tqMirror(right), 'mirror'], [tqMirror(p1), 'mirror1'], [tqMoved(p2, 1), 'moved1']];
    /** @type {[TqPic, string][]} */
    const opts = [[right, 'right']];
    shuffle(cand.slice(0, 5)).concat(shuffle(cand.slice(5))).forEach(([p, how]) => { if(opts.length < 5 && !opts.some(o => tqKey(o[0]) === tqKey(p))) opts.push([p, how]); });
    if(opts.length < 5 || opts.filter(o => tqKey(o[0]) === tqKey(right)).length !== 1) continue;
    const order = shuffle(opts.slice()), pick = order.findIndex(o => o[1] === 'right');
    return {kind:'turnsq', cw, p1, p2, right, options: order.map((o, id) => ({ id, v: id, text: [sq(o[0], 66), sq(o[0], 66)], pic: o[0], how: o[1] })), pick, own: true, ans: pick};
  }
}
/** a square with its pieces */
function sq(/** @type {TqPic} */ p, w){
  const at = [[18, 18], [52, 18], [52, 52], [18, 52]];
  const g = p.map((x, i) => {
    if(x === null) return '';
    const [cx, cy] = at[i];
    return x === 'c' ? '<circle cx="' + cx + '" cy="' + cy + '" r="8" fill="var(--accent)"/>'
      : '<polygon transform="translate(' + cx + ' ' + cy + ') rotate(' + /** @type {number} */ (x) * 90 + ')" points="0,-10 9,8 -9,8" fill="var(--bad)" stroke="var(--ink)" stroke-width="1.2" stroke-linejoin="round"/>';
  }).join('');
  const names = p.map((x, i) => x === null ? '' : (x === 'c' ? tr('кръг', 'коло') : tr('триъгълник, сочи ' + ['нагоре', 'надясно', 'надолу', 'наляво'][/** @type {number} */ (x)], 'трикутник, показує ' + ['вгору', 'праворуч', 'вниз', 'ліворуч'][/** @type {number} */ (x)])) + ' ' + tr(['горе вляво', 'горе вдясно', 'долу вдясно', 'долу вляво'][i], ['вгорі ліворуч', 'вгорі праворуч', 'внизу праворуч', 'внизу ліворуч'][i])).filter(Boolean).join('; ');
  return '<svg viewBox="0 0 70 70" width="' + w + '" height="' + w + '" style="max-width:100%" role="img" aria-label="' + names + '"><rect x="2" y="2" width="66" height="66" rx="4" fill="none" stroke="var(--ink)" stroke-width="2"/>' + g + '</svg>';
}
const arrow = (/** @type {boolean} */ cw) => '<svg viewBox="0 0 30 40" width="26" height="36" role="img" aria-label="' + tr(cw ? 'четвърт оборот надясно' : 'четвърт оборот наляво', cw ? 'чверть оберта праворуч' : 'чверть оберта ліворуч') + '"><path d="' + (cw ? 'M4,30 C4,6 22,4 22,20' : 'M26,30 C26,6 8,4 8,20') + '" fill="none" stroke="var(--ink)" stroke-width="2.4" stroke-linecap="round"/><path d="' + (cw ? 'M14,16 L22,26 L30,16' : 'M0,16 L8,26 L16,16') + '" fill="none" stroke="var(--ink)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function drawTurnSq(q){
  const unknown = '<svg viewBox="0 0 70 70" width="78" height="78" style="max-width:100%" role="img" aria-label="?"><rect x="2" y="2" width="66" height="66" rx="4" fill="none" stroke="var(--ink)" stroke-width="2"/><text x="35" y="49" text-anchor="middle" font-size="40" font-weight="800" fill="var(--ink)">?</text></svg>';
  return '<div class="ask">' + tr('Кенгуруто Кевин поставя на масата една рисунка с две триъгълничета и едно кръгче. Той завърта рисунката ' + (q.cw ? 'надясно' : 'наляво') + ' на четвърт оборот, както е показано. <b>Какво вижда Кевин сега, след като завърти рисунката още веднъж по същия начин?</b>',
    'Кенгуру Кевін кладе на стіл малюнок із двома трикутничками й одним кружечком. Він повертає малюнок ' + (q.cw ? 'праворуч' : 'ліворуч') + ' на чверть оберта, як показано. <b>Що бачить Кевін тепер, після того як повернув малюнок ще раз у той самий бік?</b>') + '</div>' +
    '<div class="given" style="display:flex; align-items:center; justify-content:center; gap:4px">' + sq(q.p1, 78) + arrow(q.cw) + sq(q.p2, 78) + arrow(q.cw) + unknown + '</div>';
}
function eqTurnSq(q){ return tr('още един четвърт оборот: половин оборот от началото', 'ще одна чверть оберта: пів оберта від початку'); }
function whyTurnSq(q, full){
  if(!full) return tr('Два пъти по четвърт оборот в една и съща посока правят половин оборот. Завърти листа и следи едно по едно триъгълничетата: накъде сочат.', 'Двічі по чверті оберта в один бік — це пів оберта. Поверни аркуш і стеж за трикутничками по одному: куди вони показують.');
  return sq(q.p1, 64) + ' ' + arrow(q.cw) + ' ' + sq(q.p2, 64) + ' ' + arrow(q.cw) + ' ' + sq(q.right, 64) + '<br>' +
    tr('Всяко парче отива в срещуположния ъгъл на първата рисунка, а триъгълничетата гледат на обратната страна. Това е отговорът.', 'Кожна фігурка йде в протилежний кут першого малюнка, а трикутнички дивляться в протилежний бік. Це відповідь.');
}
KIND.turnsq = { draw:drawTurnSq, eq:eqTurnSq, why:whyTurnSq };
