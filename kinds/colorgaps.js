// Question kind 'colorgaps': level 494 Празните квадратчета — Three digits into three gaps so that three coloured figures have one sum.

// Салабашев 2020, задача 11: a grid of 3 by 5 squares in three colours with a gap in each colour; put 2, 3 and 4 into the gaps (once each) so that the
// numbers in the green, the red and the yellow figure add up to the same sum, and say the sum. Without the gaps the figures make 18, 16 and 17, so the
// 2 goes with the 18, the 4 with the 16 and the 3 with the 17: 18 + 2 = 16 + 4 = 17 + 3 = 20, and no other way of placing the three digits does it.
// q.rows: the numbers, 0 for a gap; q.digits: the three digits; q.sums: what each colour makes without its gap; q.give: the digit that goes to each colour.
import { KIND, answerLine, rnd, shuffle, svgFrame, svgText, tr } from '../js/core.js';
const MAP = ['GGRYY', 'GRRRY', 'GGRYY'], GAPS = ['0,1', '1,2', '0,3'], COLORS = ['G', 'R', 'Y'];
const split = (/** @type {number} */ k) => { for(;;){ const v = [1 + rnd(9), 1 + rnd(9), 1 + rnd(9)], l = k - v[0] - v[1] - v[2]; if(l >= 1 && l <= 9) return [...v, l]; } };
export function genColorGaps(){
  for(;;){
    const a = 1 + rnd(6), digits = [a, a + 1, a + 2], give = shuffle(digits.slice()), sum = 15 + rnd(14), sums = give.map(d => sum - d);
    if(sums.some(s => s < 6 || s > 30)) continue;
    const cells = COLORS.map((c, k) => split(sums[k])), at = [0, 0, 0], rows = MAP.map((line, r) => [...line].map((ch, i) => GAPS.includes(r + ',' + i) ? 0 : cells[COLORS.indexOf(ch)][at[COLORS.indexOf(ch)]++]));
    // exactly one way of putting the digits into the gaps gives three equal sums
    const ways = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].filter(p => new Set(sums.map((s, k) => s + digits[p[k]])).size === 1);
    if(ways.length !== 1) continue;
    return {kind:'colorgaps', rows, digits, sums, give, ans: sum, traps:[sums[0], sum - 1]};
  }
}
const FILL = { G: 'var(--good)', R: 'var(--bad)', Y: 'var(--lemon)' };
const U = 40;
function gridPic(/** @type {any} */ q){
  const g = MAP.map((line, r) => [...line].map((ch, i) => '<rect x="' + i*U + '" y="' + r*U + '" width="' + U + '" height="' + U + '" fill="' + FILL[ch] + '" fill-opacity=".55" stroke="var(--ink)" stroke-width="2"/>' +
    (q.rows[r][i] ? svgText(i*U + U/2, r*U + U/2 + 7, q.rows[r][i], 21, 'var(--ink)') : '')).join('')).join('');
  return svgFrame('-3 -3 ' + (5*U + 6) + ' ' + (3*U + 6), 300, tr('таблица от квадратчета в три цвята, с по едно празно във всеки цвят', 'таблиця з квадратиків трьох кольорів, по одному порожньому в кожному кольорі')) + g + '</svg>';
}
const num = (/** @type {number} */ n) => '<span class="num">' + n + '</span>';
function drawColorGaps(/** @type {any} */ q){
  const [a, b, c] = q.digits;
  return '<div class="ask">' + tr('В празните квадратчета запиши цифрите ' + num(a) + ', ' + num(b) + ' и ' + num(c) + ', по веднъж, така че сборът на числата в зелената, в червената и в жълтата фигура да е един и същ. На колко е равен този сбор?',
    'У порожні клітинки впиши цифри ' + num(a) + ', ' + num(b) + ' і ' + num(c) + ', по разу, так щоб сума чисел у зеленій, у червоній і в жовтій фігурі була однакова. Чому дорівнює ця сума?') + '</div>' +
    '<div class="fig">' + gridPic(q) + '</div>' + answerLine('xl');
}
const sumLine = (/** @type {any} */ q) => q.sums.map((/** @type {number} */ s, /** @type {number} */ k) => s + ' + ' + q.give[k]).join(' = ') + ' = ' + q.ans;
function eqColorGaps(/** @type {any} */ q){ return sumLine(q); }
function whyColorGaps(/** @type {any} */ q, /** @type {boolean} */ full){
  if(!full) return tr('Събери числата във всяка фигура без празното квадратче. Най-голямата сума се нуждае от най-малката цифра.', 'Додай числа в кожній фігурі без порожньої клітинки. Найбільшій сумі потрібна найменша цифра.');
  return tr('Без празните квадратчета: зелената ' + q.sums[0] + ', червената ' + q.sums[1] + ', жълтата ' + q.sums[2] + '. Най-голямата сума взема най-малката цифра, най-малката — най-голямата: ' + sumLine(q).replace(/= (\d+)$/, '= <b>$1</b>') + '.',
    'Без порожніх клітинок: зелена ' + q.sums[0] + ', червона ' + q.sums[1] + ', жовта ' + q.sums[2] + '. Найбільша сума бере найменшу цифру, найменша — найбільшу: ' + sumLine(q).replace(/= (\d+)$/, '= <b>$1</b>') + '.');
}
KIND.colorgaps = { draw:drawColorGaps, eq:eqColorGaps, why:whyColorGaps };
