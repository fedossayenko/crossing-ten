// Question kind 'candles': level 395 Свещички на тортата — Big candles are ten years, small ones one: how old is the birthday person.

// Кенгуру 2023, задача 6: a cake with 7 big and 6 small candles, a big one for 10 years and a small one for 1: 70 + 6 = 76. Counted in
// tens and ones, never by a times table: seven tens are 10, 20, … 70. The slips are the candles counted as they are (13), and the two
// counts swapped (67). Big and small candles stand mixed in two rows, as on a cake; they differ in height and colour.
import { KIND, addUp, answerLine, rnd, shuffle, svgFrame, tr } from '../js/core.js';
export function genCandles(){
  if(rnd(6) === 0) return mk(7, 6, 0);
  const big = 6 + rnd(4);
  let small = 3 + rnd(7);
  if(small === big) small = big === 9 ? 3 : big + 1;
  return mk(big, small, rnd(2));
}
function mk(big, small, who){
  const row = shuffle([].concat(Array(big).fill(1), Array(small).fill(0)));
  return {kind:'candles', big, small, row, who, ans: big*10 + small, traps:[big + small, small*10 + big]};
}
function pic(q){
  const n = q.row.length, step = Math.min(24, 252 / (n - 1));
  let g = '<rect x="12" y="104" width="276" height="34" rx="6" fill="var(--ant)"/><rect x="12" y="90" width="276" height="24" rx="10" fill="var(--rose)"/>';
  q.row.forEach((big, i) => {
    const x = 150 + (i - (n - 1) / 2)*step, y = i % 2 ? 106 : 96, h = big ? 54 : 26;
    g += '<rect x="' + (x - 4).toFixed(1) + '" y="' + (y - h) + '" width="8" height="' + h + '" rx="1.5" fill="var(--' + (big ? 'accent' : 'warm') + ')" stroke="var(--fur-dark)" stroke-width="1.2"/>' +
      '<path d="M' + x.toFixed(1) + ',' + (y - h - 11) + ' q5,6 0,10 q-5,-4 0,-10Z" fill="var(--bad)"/>';
  });
  return svgFrame('0 0 300 142', 340, tr('торта с големи и малки свещички', 'торт із великими й маленькими свічками')) + g + '</svg>';
}
function drawCandles(q){
  return '<div class="ask">' + tr('Днес ' + (q.who ? 'баба' : 'дядо') + ' има рожден ден. На празничната торта има големи и малки свещички. Всяка голяма отговаря на <b>10 години</b>, а всяка малка отговаря на <b>1 година</b>. Колко години навършва ' + (q.who ? 'баба' : 'дядо') + ' днес?',
    'Сьогодні в ' + (q.who ? 'бабусі' : 'дідуся') + ' день народження. На святковому торті є великі й маленькі свічки. Кожна велика означає <b>10 років</b>, а кожна маленька — <b>1 рік</b>. Скільки років виповнюється ' + (q.who ? 'бабусі' : 'дідусеві') + ' сьогодні?') + '</div>' + pic(q) + answerLine('md');
}
function eqCandles(q){
  return (q.big*10) + ' + ' + q.small + ' = ' + q.ans;
}
function whyCandles(q, full){
  if(!full) return tr('Брой отделно големите и отделно малките. Големите са десетици, малките са единици.', 'Рахуй окремо великі й окремо маленькі. Великі — десятки, маленькі — одиниці.');
  return tr('Големи: ' + addUp(q.big, 10) + '. Малки: ' + q.small + '. ' + (q.big*10) + ' + ' + q.small + ' = ' + q.ans + '.', 'Великі: ' + addUp(q.big, 10) + '. Маленькі: ' + q.small + '. ' + (q.big*10) + ' + ' + q.small + ' = ' + q.ans + '.');
}
KIND.candles = { draw:drawCandles, eq:eqCandles, why:whyCandles };
