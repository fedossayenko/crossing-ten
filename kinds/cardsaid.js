// Question kind 'cardsaid': level 484 Картата на масата — Cards on a table, boys name theirs with one number raised: which card is left.

// Салабашев 2019, 2 клас, задача 15: ten cards, 1 to 10. Ангел, Борис and Васил take three each and one is left on the table. Ангел says «I took
// 1, 5 and 9», Борис «2, 5 and 10», Васил «3, 6 and 10». Each boy named two of his cards truly and raised the number of the third by 1.
// Which card is left? Every boy said one number too many by 1, so the cards they took add up to 51 − 3 = 48 (1 + 5 + 9 + 2 + 5 + 10 + 3 + 6 + 10 =
// 51), the ten cards to 55, and 55 − 48 = 7. Which card each boy raised does not matter, so the left card is one number whatever the deal
// (check/sal-S4.js tries every deal that fits the statements). Two boys and seven cards, or three and ten.
import { KIND, answerLine, popAt, rnd, shuffle, svgFrame, svgText, tr } from '../js/core.js';
// [Bulgarian, Ukrainian]
/** @type {[string, string][]} */
const BOYS = [['Ангел', 'Ангел'], ['Борис', 'Борис'], ['Васил', 'Василь'], ['Иван', 'Іван'], ['Стефан', 'Стефан'], ['Тодор', 'Тодор'], ['Никола', 'Микола']];
export function genCardSaid(){
  for(;;){
    const k = Math.random() < 0.8 ? 3 : 2, N = 3*k + 1, deal = shuffle(Array.from({length: N}, (_, i) => i + 1)), said = [];
    let ok = true;
    for(let b = 0; b < k && ok; b++){
      const own = deal.slice(3*b, 3*b + 3), up = own.filter(v => v < N && !own.includes(v + 1));
      if(!up.length){ ok = false; break; }
      const raised = up[rnd(up.length)];
      said.push(own.map(v => v === raised ? v + 1 : v).sort((x, y) => x - y));
    }
    if(!ok) continue;
    const left = deal[3*k], total = N*(N + 1)/2, naive = total - said.flat().reduce((t, v) => t + v, 0);
    return {kind:'cardsaid', k, N, who: shuffle([0, 1, 2, 3, 4, 5, 6]).slice(0, k), said, traps:[naive].filter(v => v > 0 && v !== left), ans: left};
  }
}
const sum = a => a.reduce((t, v) => t + v, 0);
const said = q => q.said.flat();
// the card left: all of them, less what the boys took — what they said, less 1 each
export const cardSaidLeft = (N, told) => N*(N + 1)/2 - (told.flat().reduce((t, v) => t + v, 0) - told.length);
// the cards in a row, numbered; the left one picked out when the solution shows it
function cardsSvg(q, left){
  const W = 26, w = q.N*W + 4;
  let g = '';
  for(let v = 1; v <= q.N; v++){
    const x = 2 + (v - 1)*W, mark = left && v === q.ans;
    g += '<g' + (mark ? popAt(1) : '') + '><rect x="' + x + '" y="4" width="' + (W - 4) + '" height="34" rx="5" fill="' + (mark ? 'var(--warm)' : 'var(--solid)') + '" stroke="var(--ink)" stroke-width="1.4"/>' +
      svgText(x + (W - 4)/2, 27, v, 14, mark ? '#fff' : 'var(--ink)') + '</g>';
  }
  if(left) g += svgText(w / 2, 58, (q.N*(q.N + 1)/2) + ' − ' + (q.N*(q.N + 1)/2 - q.ans) + ' = ' + q.ans, 15, 'var(--ink)', popAt(2));
  return svgFrame('0 0 ' + w + ' ' + (left ? 66 : 42), Math.round(w*1.3), tr('картите на масата', 'картки на столі')) + g + '</svg>';
}
function drawCardSaid(q){
  const who = q.who.map(i => BOYS[i]);
  const names = uk => who.map(w => w[uk ? 1 : 0]), join = (a, and) => a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' ' + and + ' ' + a[a.length - 1];
  const says = uk => who.map((w, i) => '<i>' + w[uk ? 1 : 0] + (uk ? ' сказав' : ' казал') + '</i>: ' + (uk ? 'Я взяв ' : 'Аз взех ') + join(q.said[i].map(String), uk ? 'і' : 'и') + '.').join('<br>');
  return '<div class="ask">' + tr('На масата поставили ' + (q.N === 10 ? 'десет' : 'седем') + ' карти, на които са написани числата от 1 до ' + q.N + '. ' + join(names(false), 'и') + ' си взели по три карти и една карта останала на масата.',
    'На столі розклали ' + (q.N === 10 ? 'десять' : 'сім') + ' карток, на яких написані числа від 1 до ' + q.N + '. ' + join(names(true), 'і') + ' узяли по три картки, і одна картка лишилася на столі.') + '</div>' +
    cardsSvg(q, false) +
    '<div class="given" style="text-align:left">' + tr(says(false), says(true)) + '</div>' +
    '<div class="ask">' + tr('Всяко момче казало вярно числата на две от своите карти, а числото на третата карта <b>увеличило с 1</b>. Кое е числото на картата, която останала на масата?',
      'Кожен хлопчик правильно назвав числа двох своїх карток, а число третьої картки <b>збільшив на 1</b>. Яке число на картці, що лишилася на столі?') + '</div>' +
    answerLine('xl');
}
function eqCardSaid(q){
  const all = q.N*(q.N + 1)/2, got = sum(said(q)) - q.k;
  return sum(said(q)) + ' − ' + q.k + ' = ' + got + tr('; ', '; ') + all + ' − ' + got + ' = ' + q.ans;
}
function whyCardSaid(q, full){
  if(!full) return tr('Всяко момче е казало едно число с единица повече. С колко повече са казали всички заедно? Колко са истинските числа на взетите карти?', 'Кожен хлопчик назвав одне число на одиницю більше. На скільки більше назвали всі разом? Яка справжня сума взятих карток?');
  const all = q.N*(q.N + 1)/2, got = sum(said(q)) - q.k;
  return tr('казаното: ' + q.said.map(s => s.join(' + ') + ' = ' + sum(s)).join('; ') + ' &nbsp;→&nbsp; ' + sum(said(q)) + '; всяко момче е казало с 1 повече: ' + sum(said(q)) + ' − ' + q.k + ' = <b>' + got + '</b> — това са взетите карти; всички карти: 1 + 2 + … + ' + q.N + ' = ' + all,
    'названі числа: ' + q.said.map(s => s.join(' + ') + ' = ' + sum(s)).join('; ') + ' &nbsp;→&nbsp; ' + sum(said(q)) + '; кожен назвав на 1 більше: ' + sum(said(q)) + ' − ' + q.k + ' = <b>' + got + '</b> — це взяті картки; усі картки: 1 + 2 + … + ' + q.N + ' = ' + all) +
    ' &nbsp;→&nbsp; <b>' + all + ' − ' + got + ' = ' + q.ans + '</b>' + cardsSvg(q, true);
}
KIND.cardsaid = { draw:drawCardSaid, eq:eqCardSaid, why:whyCardSaid };
