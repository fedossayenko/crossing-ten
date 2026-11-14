// Question kind 'housesum': level 405 Две къщи с равни сборове — Numbers on two houses add up the same: the number in the place of the question mark.

// Кенгуру 2022, 2 клас, задача 17: the first house has 6, 2 and 5 (the two empty circles between the houses are not numbers), the second 3, ? and 1;
// 6 + 2 + 5 = 13 = 3 + ? + 1, so ? = 9 (key D). The kind draws the same two houses with other numbers, the question mark on either house.
import { KIND, answerLine, rnd, shuffle, svgText, tr } from '../js/core.js';

export function genHouseSum(){
  for(;;){
    const full = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3), sum = full.reduce((s, x) => s + x, 0);
    const two = [1 + rnd(9), 1 + rnd(9)], ans = sum - two[0] - two[1];
    if(ans < 1 || ans > 9 || two[0] === two[1]) continue;
    const side = rnd(2), slot = rnd(3), other = two.slice();
    other.splice(slot, 0, 0);
    return {kind:'housesum', side, nums: side ? [other, full] : [full, other], ans};
  }
}
const POS = [[[57, 17], [14, 76], [14, 126]], [[149, 17], [192, 76], [192, 126]]];   // the three places on each house: roof, outer wall, outer corner
/** the numbers on a house as read back by the checks: 0 is the question mark */
function housePic(q){
  let g = '';
  [0, 1].forEach(h => {
    const x0 = 14 + h*92, x1 = x0 + 86;
    g += '<path d="M' + x0 + ',60 L' + (x0 + 43) + ',20 L' + x1 + ',60 V140 H' + x0 + ' Z" fill="' + (h ? 'var(--glass)' : 'var(--accentbg)') + '" stroke="var(--accent)" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<rect x="' + (x0 + 14) + '" y="88" width="20" height="52" fill="none" stroke="var(--accent)" stroke-width="2"/><rect x="' + (x0 + 48) + '" y="72" width="22" height="22" fill="none" stroke="var(--accent)" stroke-width="2"/>';
  });
  for(const [x, y] of [[103, 76], [103, 126]]) g += '<circle cx="' + x + '" cy="' + y + '" r="12" fill="var(--solid)" stroke="var(--line)" stroke-width="2"/>';
  q.nums.forEach((/** @type {number[]} */ h, /** @type {number} */ hi) => h.forEach((n, i) => {
    const [x, y] = POS[hi][i];
    g += '<circle cx="' + x + '" cy="' + y + '" r="14" fill="var(--solid)" stroke="' + (n ? 'var(--ink)' : 'var(--accent)') + '" stroke-width="2.4"/>' + svgText(x, y + 6, n || '?', 17, n ? 'var(--ink)' : 'var(--accent)', n ? ' class="hn"' : ' class="hq"');
  }));
  return '<svg viewBox="-4 0 214 148" style="display:block; width:300px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + tr('две къщи с числа: ', 'два будинки з числами: ') +
    q.nums.map((/** @type {number[]} */ h) => h.map(n => n || '?').join(', ')).join(tr(' и ', ' і ')) + '">' + g + '</svg>';
}
function drawHouseSum(q){
  return '<div class="ask">' + tr('Сборът на числата, прикрепени към едната къща, е равен на сбора на числата, прикрепени към втората къща. <b>Кое число трябва да стои на мястото на въпросителния знак?</b>',
    'Сума чисел, прикріплених до одного будинку, дорівнює сумі чисел, прикріплених до другого будинку. <b>Яке число має стояти на місці знака питання?</b>') + '</div>' + housePic(q) + answerLine('xl');
}
const sumOf = (/** @type {number[]} */ h) => h.reduce((s, x) => s + x, 0);
function eqHouseSum(q){
  const full = q.nums[q.side], known = q.nums[1 - q.side].filter((/** @type {number} */ n) => n);
  return sumOf(full) + ' − (' + known.join(' + ') + ') = ' + q.ans;
}
function whyHouseSum(q, full){
  if(!full) return tr('Събери трите числа на къщата, на която няма въпросителен знак. Толкова трябва да е и другата къща.', 'Додай три числа на будинку без знака питання. Стільки має бути й на другому.');
  const fullH = q.nums[q.side], known = q.nums[1 - q.side].filter((/** @type {number} */ n) => n);
  return fullH.join(' + ') + ' = ' + sumOf(fullH) + '<br>' + known.join(' + ') + ' + ? = ' + sumOf(fullH) + '<br>' + sumOf(fullH) + ' − ' + sumOf(known) + ' = <b>' + q.ans + '</b>';
}
KIND.housesum = { draw:drawHouseSum, eq:eqHouseSum, why:whyHouseSum };
