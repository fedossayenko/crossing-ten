// Question kind 'stickers': level 417 Стикери един върху друг — Four stickers are stuck one on another in some order told in words: which picture of the pile.

// Кенгуру 2022, 2 клас, задача 16: Радка sticks a circle, a square, a star and a triangle on one another; the star comes after the square but before the
// triangle (the circle is anywhere). The answer is a picture, so the kind brings its own А–Д: the same four stickers in the same places, stuck in five
// different orders; only one order has the star above the square and under the triangle. The four stickers overlap one another all round, so every
// pair shows which is on top (check/ek-W3.js reads that back from the drawing).
import { KIND, rnd, shuffle, tr } from '../js/core.js';

// 0 circle, 1 square, 2 star, 3 triangle: [Bulgarian, participle, Ukrainian nominative, participle, genitive, instrumental]
const SH = [['кръгчето', 'залепено', 'кружечок', 'приклеєний', 'кружечка', 'кружечком'], ['квадратчето', 'залепено', 'квадратик', 'приклеєний', 'квадратика', 'квадратиком'],
  ['звездичката', 'залепена', 'зірочка', 'приклеєна', 'зірочки', 'зірочкою'], ['триъгълничето', 'залепено', 'трикутничок', 'приклеєний', 'трикутничка', 'трикутничком']];
const COL = ['var(--bad)', 'var(--good)', 'var(--warm)', 'var(--accent)'];
// a five-pointed star round (61, 58) with outer radius 25; the four are drawn close together so that every pair overlaps a good deal in every pile
const star = Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 11.25 : 25; return (61 + r * Math.cos(a)).toFixed(1) + ',' + (58 + r * Math.sin(a)).toFixed(1); }).join(' ');
const BODY = [
  '<circle cx="38" cy="44" r="22" fill="var(--bad)"', '<rect x="51" y="29" width="40" height="40" fill="var(--good)"',
  '<polygon points="' + star + '" fill="var(--warm)"', '<polygon points="65,36 92,93 36,68" fill="var(--accent)"'];
const ICON = ['14 20 48 48', '49 27 44 44', '34 31 54 54', '34 34 60 62'], NM = [['кръгче', 'кружечок'], ['квадратче', 'квадратик'], ['звездичка', 'зірочка'], ['триъгълниче', 'трикутничок']];
/** @typedef {number[]} Pile  the stickers 0–3 from the first stuck (the bottom) to the last */
export const stPicture = (/** @type {Pile} */ pile, /** @type {number} */ k) => '<svg viewBox="0 0 112 100" width="134" height="120" style="max-width:100%" role="img" aria-label="' +
  (k ? 'стикери один на одному, знизу вгору: ' : 'стикери един върху друг, отдолу нагоре: ') + pile.map(i => NM[i][k]).join(', ') + '">' +
  pile.map(i => BODY[i] + ' stroke="var(--ink)" stroke-width="1.8" stroke-linejoin="round" data-s="' + i + '"/>').join('') + '</svg>';
export function genStickers(){
  for(;;){
    const right = shuffle([0, 1, 2, 3]), [i, j, k] = shuffle([0, 1, 2, 3]).slice(0, 3).sort((a, b) => a - b), y = right[i], x = right[j], z = right[k];
    const sat = (/** @type {number[]} */ p) => p.indexOf(y) < p.indexOf(x) && p.indexOf(x) < p.indexOf(z);
    const all = [], seen = new Set();
    const perm = (/** @type {number[]} */ a, /** @type {number[]} */ r) => { if(!a.length) all.push(r); else a.forEach((v, n) => perm(a.filter((_, m) => m !== n), r.concat(v))); };
    perm([0, 1, 2, 3], []);
    for(let t = 0; t < 30; t++){
      const wrong = shuffle(all.filter(p => !sat(p))).slice(0, 4), set = wrong.concat([right]);
      if(new Set(set.map(p => p.join())).size < 5 || seen.has(wrong.join('|'))) continue;
      seen.add(wrong.join('|'));
      // a vote on what lies on top at each level of the pile must not give the right pile
      const modal = [0, 1, 2, 3].map(l => [0, 1, 2, 3].map(s => [s, set.filter(p => p[l] === s).length]).sort((a, b) => b[1] - a[1])[0][0]);
      const score = set.map(p => p.filter((s, l) => s === modal[l]).length);
      if(score[4] === Math.max(...score)) continue;
      const order = shuffle(set.slice()), pick = order.indexOf(right);
      return {kind:'stickers', x, y, z, options: order.map((p, id) => ({ id, v: id, text: [stPicture(p, 0), stPicture(p, 1)], pile: p })), pick, own: true, ans: pick};
    }
  }
}
function drawStickers(q){
  const said = tr(SH[q.x][0] + ' е ' + SH[q.x][1] + ' след ' + SH[q.y][0] + ', но преди ' + SH[q.z][0], SH[q.x][2] + ' ' + SH[q.x][3] + ' після ' + SH[q.y][4] + ', але перед ' + SH[q.z][5]);
  return '<div class="ask">' + tr('Радка има четири стикера: кръгче, квадратче, звездичка и триъгълниче. Тя ги залепва един върху друг в някакъв ред. <b>Как изглеждат залепените стикери, ако ' + said + '?</b>',
    'Радка має чотири стікери: кружечок, квадратик, зірочку й трикутничок. Вона клеїть їх один на одного в якомусь порядку. <b>Як виглядають наклеєні стікери, якщо ' + said + '?</b>') + '</div>' +
    '<div class="given" style="text-align:center">' + [0, 1, 2, 3].map(i => '<svg viewBox="' + ICON[i] + '" width="46" height="46" style="margin:0 5px" role="img" aria-label="' + tr(SH[i][0], SH[i][2]) + '">' + BODY[i] + ' stroke="var(--ink)" stroke-width="1.8" stroke-linejoin="round"/></svg>').join('') + '</div>';
}
function eqStickers(q){ return tr(SH[q.y][0] + ' → ' + SH[q.x][0] + ' → ' + SH[q.z][0] + ' (отдолу нагоре)', SH[q.y][2] + ' → ' + SH[q.x][2] + ' → ' + SH[q.z][2] + ' (знизу вгору)'); }
function whyStickers(q, full){
  if(!full) return tr('Залепеното по-късно е отгоре. Търси картинката, в която средният е над първия и под последния.', 'Що наклеєно пізніше, те зверху. Шукай малюнок, де середній над першим і під останнім.');
  return tr('Отдолу нагоре: ' + SH[q.y][0] + ', после ' + SH[q.x][0] + ', после ' + SH[q.z][0] + '; четвъртият стикер може да е навсякъде.', 'Знизу вгору: ' + SH[q.y][2] + ', потім ' + SH[q.x][2] + ', потім ' + SH[q.z][2] + '; четвертий стікер може бути де завгодно.') + '<br>' + tr(stPicture(q.options[q.pick].pile, 0), stPicture(q.options[q.pick].pile, 1));
}
KIND.stickers = { draw: drawStickers, eq: eqStickers, why: whyStickers };
