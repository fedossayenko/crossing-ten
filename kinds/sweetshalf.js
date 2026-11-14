// Question kind 'sweetshalf': level 464 Половината и още — Half of one kind and some of another are gone: what is left of the second.

// Салабашев 2019, 2 клас, задача 9: Карлсон got 60 sweets, some chocolate, the rest mint; he ate half of the chocolate ones and 8
// mint ones, and 34 were left — how many of those left are mint? 60 − 34 = 26 were eaten, 26 − 8 = 18 of them chocolate, which is
// half of the chocolate ones: another 18 chocolate sweets are left. So 34 − 18 = 16 mint sweets are left.
import { KIND, answerLine, rnd, tr, ukPl } from '../js/core.js';
const num = n => '<span class="num">' + n + '</span>';
// the two kinds: Bulgarian plural, Ukrainian nominative plural, Ukrainian genitive plural — chocolate / mint, caramel / lemon
const KINDS = [[['шоколадови', 'ментови'], ['шоколадні', 'м’ятні'], ['шоколадних', 'м’ятних']], [['карамелени', 'лимонови'], ['карамельні', 'лимонні'], ['карамельних', 'лимонних']]];
// who: Bulgarian name, «got», «ate», «He/She»; Ukrainian name, «got», «ate», «He/She»
const WHO = [['Карлсон', 'получил', 'изял', 'Той', 'Карлсон', 'отримав', 'з’їв', 'Він'], ['Мила', 'получила', 'изяла', 'Тя', 'Міла', 'отримала', 'з’їла', 'Вона']];
export function genSweetsHalf(){
  for(;;){
    const h = 6 + rnd(19), mint = 10 + rnd(31), x = 3 + rnd(9);
    if(mint - x < 3 || 2*h + mint > 99) continue;
    const T = 2*h + mint, left = h + mint - x;
    return {kind:'sweetshalf', who: rnd(WHO.length), set: rnd(KINDS.length), T, h, mint, x, left, traps:[left - x].filter(v => v !== mint - x), ans: mint - x};
  }
}
// «5 ментови бонбона» / «5 м’ятних цукерок»: x is 3 or more, so 3 and 4 take the plural, the rest the genitive
const ukSweets = (n, set, i) => num(n) + ' ' + (n < 5 ? KINDS[set][1][i] + ' цукерки' : KINDS[set][2][i] + ' цукерок');
function drawSweetsHalf(q){
  const w = WHO[q.who], k = KINDS[q.set];
  return '<div class="ask">' + tr(w[0] + ' ' + w[1] + ' ' + num(q.T) + ' бонбона, някои ' + k[0][0] + ', а останалите ' + k[0][1] + '. ' + w[3] + ' ' + w[2] + ' половината от ' + k[0][0] + 'те бонбони и ' + num(q.x) + ' ' + k[0][1] + ' бонбона. Останали общо ' + num(q.left) + ' бонбона. <b>Колко от останалите бонбони са ' + k[0][1] + '?</b>',
    w[4] + ' ' + w[5] + ' ' + ukPl(q.T, 'цукерку', 'цукерки', 'цукерок') + ', деякі ' + k[1][0] + ', а решта ' + k[1][1] + '. ' + w[7] + ' ' + w[6] + ' половину ' + k[2][0] + ' цукерок і ' + ukSweets(q.x, q.set, 1) + '. Залишилося всього ' + ukPl(q.left, 'цукерка', 'цукерки', 'цукерок') + '. <b>Скільки з тих, що залишилися, ' + k[1][1] + '?</b>') + '</div>' + answerLine('lg');
}
function eqSweetsHalf(q){
  return q.T + ' − ' + q.left + ' = ' + (q.T - q.left) + ', ' + (q.T - q.left) + ' − ' + q.x + ' = ' + q.h + ', ' + q.left + ' − ' + q.h + ' = ' + q.ans;
}
function whySweetsHalf(q, full){
  const k = KINDS[q.set];
  if(!full) return tr('Колко бонбона са изядени общо? Колко от тях са ' + k[0][0] + ' — и колко ' + k[0][0] + ' остават?', 'Скільки цукерок з’їдено всього? Скільки з них ' + k[2][0] + ' — і скільки ' + k[2][0] + ' лишається?');
  return q.T + ' − ' + q.left + ' = <b>' + (q.T - q.left) + '</b> ' + tr('са изядени', 'з’їдено') + ' &nbsp;→&nbsp; ' + (q.T - q.left) + ' − ' + q.x + ' = <b>' + q.h + '</b> ' + tr('— толкова ' + k[0][0] + ' са изядени и толкова остават (половината)', '— стільки ' + k[1][0] + ' з’їли і стільки лишилося (половина)') +
    ' &nbsp;→&nbsp; ' + q.left + ' − ' + q.h + ' = ' + q.ans;
}
KIND.sweetshalf = { draw:drawSweetsHalf, eq:eqSweetsHalf, why:whySweetsHalf };
