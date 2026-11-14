// Question kind 'toybox': level 397 Кошничка, която не е изпусната — Five boxes of four toys, four were dropped and their toys lie scattered: which box was not.

// Кенгуру 2024, задача 10: five numbered boxes of 4 toys each (frogs, ducks, ladybugs, rhinos), four of them dropped and the toys of those lie
// about on the floor, 16 of them: the toys missing from the floor are the toys of the box that was not dropped, box 2 (a ladybug twice, a frog
// and a rhino). The five boxes never have the same four toys, so what is missing from the floor fits one box only.
import { KIND, answerLine, ukN, rnd, shuffle, svgFrame, tr, trN, SVG_FONT } from '../js/core.js';
const TOYS = ['🐸', '🦆', '🐞', '🐳'];
const WORD = [['жаба', 'жаби', 'жаба', 'жаби', 'жаб'], ['патица', 'патици', 'качка', 'качки', 'качок'], ['калинка', 'калинки', 'сонечко', 'сонечка', 'сонечок'], ['кит', 'кита', 'кит', 'кити', 'китів']];
const PRINTED = [[0, 1, 1, 2], [0, 2, 2, 3], [0, 1, 3, 3], [1, 2, 2, 3], [0, 1, 1, 3]];   // the toys of boxes 1 to 5, as kinds
export function genToyBox(){
  if(rnd(6) === 0) return mk(PRINTED, 1);
  for(;;){
    const boxes = Array.from({ length: 5 }, () => Array.from({ length: 4 }, () => rnd(4)).sort());
    if(new Set(boxes.map(b => b.join())).size === 5) return mk(boxes, rnd(5));
  }
}
function mk(boxes, whole){
  const floor = [];
  boxes.forEach((b, i) => { if(i !== whole) b.forEach(k => floor.push(k)); });
  const cells = shuffle(Array.from({ length: 32 }, (v, i) => i)).slice(0, floor.length);
  const spots = shuffle(floor).map((k, i) => ({ k, x: 18 + (cells[i] % 8)*37 + rnd(9) - 4, y: 104 + Math.floor(cells[i] / 8)*37 + rnd(9) - 4 }));
  return {kind:'toybox', boxes, floor: spots, whole, ans: whole + 1, traps: [1, 2, 3, 4, 5].filter(v => v !== whole + 1)};
}
const toy = (/** @type {number} */ k, /** @type {number} */ x, /** @type {number} */ y, /** @type {number} */ size) => '<text x="' + x + '" y="' + y + '" font-size="' + size + '" text-anchor="middle" dominant-baseline="central" ' + SVG_FONT + '>' + TOYS[k] + '</text>';
function pic(q, mark){
  let g = '';
  q.boxes.forEach((b, i) => {
    const x0 = 6 + i*58, on = mark && i === q.whole;
    g += '<rect x="' + x0 + '" y="4" width="52" height="52" rx="5" fill="var(--paper)" stroke="' + (on ? 'var(--good)' : 'var(--fur-dark)') + '" stroke-width="' + (on ? 4 : 2) + '"/>';
    b.forEach((k, j) => { g += toy(k, x0 + 14 + (j % 2)*24, 18 + Math.floor(j / 2)*24, 20); });
    g += '<text x="' + (x0 + 26) + '" y="72" font-size="15" font-weight="800" text-anchor="middle" fill="var(--ink)" ' + SVG_FONT + '>' + (i + 1) + '</text>';
  });
  g += '<rect x="3" y="84" width="294" height="154" rx="8" fill="color-mix(in srgb, var(--warm) 14%, transparent)" stroke="var(--fur-dark)" stroke-width="1.6" stroke-dasharray="5 4"/>';
  q.floor.forEach(s => { g += toy(s.k, s.x, s.y, 22); });
  return svgFrame('0 0 300 244', 340, tr('пет кошнички с играчки и разпилени на пода играчки', 'п’ять коробок з іграшками та розсипані на підлозі іграшки')) + g + '</svg>';
}
/** what is missing from the floor, kind by kind */
const missing = (/** @type {any} */ q) => TOYS.map((t, k) => q.boxes.reduce((a, /** @type {number[]} */ b) => a + b.filter(x => x === k).length, 0) - q.floor.filter((/** @type {{k: number}} */ s) => s.k === k).length);
function drawToyBox(q){
  return '<div class="ask">' + tr('Показани са 5 кошнички, номерирани с числата от 1 до 5. Във всяка кошничка има по 4 играчки. Четири от кошничките били изпуснати и играчките в тях се разпилели. Кой е номерът на тази, която не е била изпусната?',
    'Показано 5 коробок, пронумерованих числами від 1 до 5. У кожній коробці по 4 іграшки. Чотири з коробок впустили, і іграшки в них розсипалися. Який номер тієї, яку не впускали?') + '</div>' + pic(q, false) + answerLine('md');
}
function eqToyBox(q){
  return tr('кошничка ', 'коробка ') + q.ans;
}
function whyToyBox(q, full){
  if(!full) return tr('Преброй играчките на пода по видове и ги сравни с играчките във всички кошнички. Играчките на коя кошничка липсват на пода?', 'Порахуй іграшки на підлозі за видами й порівняй з іграшками у всіх коробках. Чиїх іграшок на підлозі немає?');
  const m = missing(q);
  return pic(q, true) + '<div style="text-align:center">' + tr('На пода липсват: ' + m.map((n, k) => n > 0 ? trN(n, WORD[k][0], WORD[k][1], WORD[k][2], WORD[k][3], WORD[k][4]) : '').filter(Boolean).join(', ') + '. Това са играчките на кошничка ' + q.ans + '.',
    'На підлозі бракує: ' + m.map((n, k) => n > 0 ? ukN(n, WORD[k][2], WORD[k][3], WORD[k][4]) : '').filter(Boolean).join(', ') + '. Це іграшки коробки ' + q.ans + '.') + '</div>';
}
KIND.toybox = { draw:drawToyBox, eq:eqToyBox, why:whyToyBox };
