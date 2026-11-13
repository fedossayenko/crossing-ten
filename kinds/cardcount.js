// Question kind 'cardcount': level 343 — four digit cards (two alike), three of them make a two-digit minus a one-digit number:
// how many different results.

// Кенгуру 2023, 2 клас, задача 24: the cards 1, 1, 2, 3. The three cards chosen are 1 1 2, 1 1 3 or 1 2 3 (two ways, the same
// digits); each triple gives its subtractions, and the different results are 8, 9, 11, 12, 18, 20, 22, 29, 30, 31 — ten.
import { KIND, SLOT, bgList, shuffle, tr } from '../js/core.js';
// every subtraction (two-digit − one-digit) from three of the four cards, as [text, value], grouped by the three digits chosen
export function cardSubs(cards){
  const groups = {};
  for(let i = 0; i < 4; i++) for(let j = 0; j < 4; j++) for(let k = 0; k < 4; k++){
    if(i === j || j === k || i === k) continue;
    const key = [cards[i], cards[j], cards[k]].sort((a, b) => a - b).join(' ');
    const v = 10 * cards[i] + cards[j] - cards[k], t = (10 * cards[i] + cards[j]) + ' − ' + cards[k] + ' = ' + v;
    const g = groups[key] = groups[key] || [];
    if(!g.some(x => x[0] === t)) g.push([t, v]);
  }
  return groups;
}
export function cardResults(cards){
  const all = new Set();
  Object.values(cardSubs(cards)).forEach(g => g.forEach(x => all.add(x[1])));
  return [...all].sort((a, b) => a - b);
}
export function genCardCount(){
  for(;;){
    const d = shuffle([1, 2, 3, 4, 5]).slice(0, 3), cards = [d[0], d[0], d[1], d[2]].sort((a, b) => a - b), n = cardResults(cards).length;
    if(n < 6 || n > 11) continue;   // digits 1–5, and a pair of equal results: the count is under the 12 of all different
    return {kind:'cardcount', cards, traps:[24, 12].filter(v => v !== n), ans: n};
  }
}
function drawCardCount(q){
  return '<div class="ask">' + tr('Цифрите <span class="num">' + bgList(q.cards) + '</span> са отпечатани върху 4 различни карти. Ако две карти се поставят една до друга, се получава двуцифрено число. От четирите карти са избрани 3 и е образувано действие изваждане: двуцифрено число минус едноцифрено. Колко са възможните различни резултати?',
    'Цифри <span class="num">' + q.cards.slice(0, -1).join(', ') + ' і ' + q.cards[3] + '</span> надруковано на 4 різних картках. Якщо дві картки покласти поруч, виходить двоцифрове число. З чотирьох карток вибрано 3 і утворено віднімання: двоцифрове число мінус одноцифрове. Скільки є різних можливих результатів?') + '</div>' +
    '<div class="given"><span class="circle">□□</span> − <span class="circle">□</span></div><div class="line xl">' + SLOT + '</div>';
}
function eqCardCount(q){ return cardResults(q.cards).join(', ') + ' → ' + q.ans; }
function whyCardCount(q, full){
  if(!full) return tr('Избери три карти. Една от тях е за изваждане, другите две правят двуцифрено число — и в двата реда. Запиши всички резултати и ги преброй, като еднаквите броиш веднъж.',
    'Вибери три картки. Одна — для віднімання, дві інші складають двоцифрове число — в обох порядках. Випиши всі результати й порахуй, однакові рахуючи один раз.');
  const gs = cardSubs(q.cards), lines = Object.keys(gs).map(k => '<b>' + k + '</b>: ' + gs[k].map(x => x[0]).join('; ')).join('<br>');
  return lines + '<br>' + tr('различните резултати: ', 'різні результати: ') + cardResults(q.cards).join(', ') + ' &nbsp;→&nbsp; <b>' + q.ans + '</b>';
}
KIND.cardcount = { draw:drawCardCount, eq:eqCardCount, why:whyCardCount };
