// Question kind 'petals': level 492 Цветето — A flower whose every petal and its outer circle make the number in the middle.

// Салабашев 2020, задача 3: six yellow petals round a green centre, a blue circle outside each — 37 and 63, 48 and 52, 86 and 14, 19 and 81, 45 and 55,
// 22 and 78. Each yellow number and the blue one beside it make the number in the centre: 37 + 63 = 100, and every other pair makes 100 as well.
// q.pairs: the yellow numbers and the blue ones, petal by petal clockwise from the top; q.ans the centre.
import { KIND, answerLine, rnd, shuffle, svgFrame, svgText, tr } from '../js/core.js';
export function genPetals(){
  const centre = 50 + 10*rnd(6), pool = [];   // 50, 60 … 100; a number and its partner never both on the flower
  for(let y = 8; y <= centre - 8; y++) if(y !== centre - y) pool.push(y);
  const ys = [];
  for(const y of shuffle(pool)) if(ys.length < 6 && !ys.some(v => v === y || v === centre - y)) ys.push(y);
  return {kind:'petals', ys, bs: ys.map(y => centre - y), ans: centre, traps:[centre - 10, 10]};
}
const R0 = 26, R1 = 56, R2 = 104;   // the centre, the yellow ring, the blue ring
/** the petal k sits at 60° steps from the top */
const at = (/** @type {number} */ k, /** @type {number} */ r) => [+(r*Math.sin(k*Math.PI/3)).toFixed(1), +(-r*Math.cos(k*Math.PI/3)).toFixed(1)];
function flowerPic(/** @type {any} */ q){
  let g = '';
  q.ys.forEach((/** @type {number} */ y, /** @type {number} */ k) => {
    const [x, yy] = at(k, R1), [bx, by] = at(k, R2), [lx, ly] = at(k, R1 + 22), [mx, my] = at(k, R2 - 17);   // the link runs between the two circles' edges, never behind a number
    g += '<line x1="' + lx + '" y1="' + ly + '" x2="' + mx + '" y2="' + my + '" stroke="var(--muted)" stroke-width="1.4"/>' +
      '<circle cx="' + x + '" cy="' + yy + '" r="22" fill="var(--lemon)" fill-opacity=".6" stroke="var(--warm)" stroke-width="2"/>' + svgText(x, yy + 6, y, 17, 'var(--ink)') +
      '<circle cx="' + bx + '" cy="' + by + '" r="17" fill="var(--accent)" fill-opacity=".3" stroke="var(--accent)" stroke-width="2"/>' + svgText(bx, by + 5.5, q.bs[k], 15, 'var(--ink)');
  });
  g += '<circle cx="0" cy="0" r="' + R0 + '" fill="var(--good)" fill-opacity=".45" stroke="var(--good)" stroke-width="2.4"/>' + svgText(0, 9, '?', 27, 'var(--ink)');
  return svgFrame('-124 -124 248 248', 300, tr('цвете с шест листенца, всяко с кръгче отвън', 'квітка з шістьма пелюстками, кожна з кружечком ззовні')) + g + '</svg>';
}
function drawPetals(/** @type {any} */ q){
  return '<div class="ask">' + tr('Жълтото листенце и синьото кръгче до него дават числото в средата — за всяко листенце. Кое е числото в зеленото кръгче?',
    'Жовта пелюстка й синє кружечок біля неї дають число посередині — для кожної пелюстки. Яке число в зеленому кружечку?') + '</div>' + flowerPic(q) + answerLine('xl');
}
function eqPetals(/** @type {any} */ q){ return q.ys[0] + ' + ' + q.bs[0] + ' = ' + q.ans; }
function whyPetals(/** @type {any} */ q, /** @type {boolean} */ full){
  if(!full) return tr('Вземи едно листенце и синьото кръгче до него. Колко правят заедно? Същото число е в средата.', 'Візьми одну пелюстку й синє кружечок біля неї. Скільки вони разом? Те саме число посередині.');
  return tr('Едното листенце и кръгчето до него: ' + q.ys[0] + ' + ' + q.bs[0] + ' = <b>' + q.ans + '</b>. Другите двойки дават същото: ' + q.ys[1] + ' + ' + q.bs[1] + ' = ' + q.ans + '.',
    'Одна пелюстка й кружечок біля неї: ' + q.ys[0] + ' + ' + q.bs[0] + ' = <b>' + q.ans + '</b>. Інші пари дають те саме: ' + q.ys[1] + ' + ' + q.bs[1] + ' = ' + q.ans + '.');
}
KIND.petals = { draw:drawPetals, eq:eqPetals, why:whyPetals };
