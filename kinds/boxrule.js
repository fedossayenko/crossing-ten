// Question kind 'boxrule': level 493 Правилото в кутийките — Three boxes of four numbers built by one rule, the heart in the last.

// Салабашев 2021, задача 2: three yellow boxes, 9 8 / 12 5, 11 6 / 3 14 and 7 10 / 2 ♡, no rule given. Both rows of the first two boxes make 17
// (so every box makes 34), the columns and the diagonals do not; so 2 + ♡ = 17 and ♡ = 15 (key Б, 15).
// q.boxes: three boxes as [[top-left, top-right], [bottom-left, bottom-right]]; q.hide: the cell of the third that is the heart, [row, column].
import { KIND, SLOT, rnd, svgFrame, svgText, tr } from '../js/core.js';
export function genBoxRule(){
  for(;;){
    const s = 12 + rnd(13), pick = () => 1 + rnd(s - 1);
    const boxes = [0, 1, 2].map(() => { const a = pick(), c = pick(); return [[a, s - a], [c, s - c]]; });
    const a = boxes[0][0][0], c = boxes[0][1][0], d = boxes[1][0][0], f = boxes[1][1][0];   // the left column of each of the first two boxes
    // the other rules a child could read out of two boxes — equal columns, equal diagonals — must not hold in both of them
    if(a === c || a + c === s || d === f || d + f === s) continue;
    const hide = [rnd(2), rnd(2)], ans = boxes[2][hide[0]][hide[1]];
    return {kind:'boxrule', s, boxes, hide, ans, traps:[s, 2*s - ans]};
  }
}
const U = 36, GAP = 24;
function boxesPic(/** @type {any} */ q){
  let g = '';
  q.boxes.forEach((/** @type {number[][]} */ b, /** @type {number} */ k) => {
    const x0 = k*(2*U + GAP);
    g += '<rect x="' + x0 + '" y="0" width="' + 2*U + '" height="' + 2*U + '" fill="var(--lemon)" fill-opacity=".55" stroke="var(--warm)" stroke-width="2.4"/>';
    for(let r = 0; r < 2; r++) for(let i = 0; i < 2; i++){
      const hidden = k === 2 && q.hide[0] === r && q.hide[1] === i;
      g += svgText(x0 + i*U + U/2, r*U + U/2 + 7, hidden ? '♡' : b[r][i], hidden ? 24 : 20, hidden ? 'var(--bad)' : 'var(--ink)');
    }
  });
  return svgFrame('-3 -3 ' + (3*2*U + 2*GAP + 6) + ' ' + (2*U + 6), 330, tr('три жълти кутии с по четири числа', 'три жовті коробки з чотирма числами')) + g + '</svg>';
}
function drawBoxRule(/** @type {any} */ q){
  return '<div class="ask">' + tr('Числата в трите кутии са подредени по едно и също правило. Намери го и кажи колко е <span class="circle">♡</span>.',
    'Числа в трьох коробках розташовані за одним правилом. Знайди його й скажи, чому дорівнює <span class="circle">♡</span>.') + '</div>' +
    '<div class="fig">' + boxesPic(q) + '</div><div class="line md"><span class="circle">♡</span> = ' + SLOT + '</div>';
}
const partner = (/** @type {any} */ q) => q.boxes[2][q.hide[0]][1 - q.hide[1]];
function eqBoxRule(/** @type {any} */ q){ return q.boxes[0][0][0] + ' + ' + q.boxes[0][0][1] + ' = ' + q.s + ', ' + q.s + ' − ' + partner(q) + ' = ' + q.ans; }
function whyBoxRule(/** @type {any} */ q, /** @type {boolean} */ full){
  if(!full) return tr('Сметни сбора на числата в един ред, после в друг. Какво забелязваш в двете пълни кутии?', 'Підрахуй суму чисел в одному рядку, потім в іншому. Що ти помічаєш у двох повних коробках?');
  return tr('Във всеки ред сборът е ' + q.s + ': ' + q.boxes[0][0][0] + ' + ' + q.boxes[0][0][1] + ' = ' + q.s + ', ' + q.boxes[0][1][0] + ' + ' + q.boxes[0][1][1] + ' = ' + q.s + '. В реда на ♡ е другото число ' + partner(q) + ', значи ♡ = ' + q.s + ' − ' + partner(q) + ' = <b>' + q.ans + '</b>.',
    'У кожному рядку сума дорівнює ' + q.s + ': ' + q.boxes[0][0][0] + ' + ' + q.boxes[0][0][1] + ' = ' + q.s + ', ' + q.boxes[0][1][0] + ' + ' + q.boxes[0][1][1] + ' = ' + q.s + '. У рядку з ♡ друге число ' + partner(q) + ', отже ♡ = ' + q.s + ' − ' + partner(q) + ' = <b>' + q.ans + '</b>.');
}
KIND.boxrule = { draw:drawBoxRule, eq:eqBoxRule, why:whyBoxRule };
