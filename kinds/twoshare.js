// Question kind 'twoshare': level 78 Портокалите — Sharing out two ways: short with one, exact with the other; level 456 — one more share bought, left over and short.

// МБГ Есен, 3 клас, задача 20: under 30 oranges; 7 to each child leaves me 4 short, 6 to each
// shares them all. One more for each child costs exactly the 4 missing, so there are 4 children
// and 6 · 4 = 24 oranges. Sometimes the first way leaves some over instead of short.
import { KIND, answerLine, numSpan, rnd, tr, ukN, ukPl } from '../js/core.js';
export function genTwoShare(){
  for(;;){
    const b = 3 + rnd(6), g = Math.random() < 0.75 ? 1 : 2, a = b + g, k = 2 + rnd(7), over = Math.random() < 0.3;
    const N = over ? a*k : b*k, s = g*k;                      // over: b each leaves s over, a each is exact
    const L = Math.ceil((N + 1) / 10) * 10 + (N % 10 > 6 ? 10 : 0);
    if(N > 60 || s < 2 || s > 12) continue;
    return {kind:'twoshare', a, b, k, s, N, L, over, ans: N, traps: [a*k, b*k, a*k - s, b*k + s].filter(v => v !== N && v > 0)};
  }
}
// Level 456: Салабашев 2019 #13 (shape 'price'): buying a backpack for me and Аника leaves 6 coins, but 9 are short for one more for Томи: how much money? The one more
// backpack costs what is left and what is short together, 6 + 9 = 15; two of them and the 6 left: 15 + 15 + 6 = 36. The slip is the price (15), or three of them.
// Grade 2, no × or ÷: the backpacks are added.
export function genTwoSharePrice(){
  for(;;){
    const r = 2 + rnd(8), s = 2 + rnd(11), p = r + s;
    if(p === 2*r || 2*p + r > 60) continue;
    return {kind:'twoshare', shape:'price', r, s, p, traps:[p], ans: 2*p + r};
  }
}
function drawPrice(q){
  return '<div class="ask">' + tr('Пипи тръгнала по магазините. Тя пресметнала, че ако купи раница на себе си и на Аника, ще останат ' + numSpan(q.r) + ' парички, но ' + numSpan(q.s) + ' парички не стигат, за да купи раница и за Томи. <b>С колко парички е тръгнала по магазините Пипи?</b>',
    'Піпі вирушила по магазинах. Вона розрахувала, що якщо купить наплічник собі й Аніці, то залишиться ' + ukPl(q.r, 'монета', 'монети', 'монет') + ', але ще бракує ' + numSpan(q.s) + ' монет, щоб купити наплічник і Томі. <b>Скільки монет було у Піпі, коли вона вирушила по магазинах?</b>') + '</div>' + answerLine('xl');
}
const eqPrice = q => q.r + ' + ' + q.s + ' = ' + q.p + ', ' + q.p + ' + ' + q.p + ' + ' + q.r + ' = ' + q.ans;
function whyPrice(q, full){
  if(!full) return tr('Още една раница струва точно колкото останат и колкото не стигат заедно. После колко струват две раници — и още останалите.', 'Ще один наплічник коштує рівно стільки, скільки залишиться й скільки бракує, разом. Потім скільки коштують два наплічники — і ще те, що залишилося.');
  return tr('една раница: ', 'один наплічник: ') + q.r + ' + ' + q.s + ' = <b>' + q.p + '</b> &nbsp;→&nbsp; ' + tr('парички: ', 'монет: ') + q.p + ' + ' + q.p + ' + ' + q.r + ' = ' + q.ans;
}
// Ukrainian: 2–4 апельсини, 5 and more апельсинів
const apl = n => n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 'апельсини' : 'апельсинів';
function drawTwoShare(q){
  if(q.shape === 'price') return drawPrice(q);
  const [first, second] = q.over ? [q.b, q.a] : [q.a, q.b];
  return '<div class="ask">' + tr('Разполагам с по-малко от <span class="num">' + q.L + '</span> портокала. Ако реша да подаря на всяко от няколко деца по <span class="num">' + first +
    '</span> портокала, ' + (q.over ? 'ще ми останат <span class="num">' + q.s + '</span> портокала' : 'няма да ми достигат <span class="num">' + q.s + '</span> портокала') +
    '. Затова подарих на всяко дете по <span class="num">' + second + '</span> портокала и раздадох всички портокали, които имам. Колко портокала съм имал?',
    'У мене менше ніж <span class="num">' + q.L + '</span> ' + apl(q.L) + '. Якщо я вирішу подарувати кожній із кількох дітей по <span class="num">' + first +
    '</span> ' + apl(first) + ', ' + (q.over ? 'у мене залишиться <span class="num">' + q.s + '</span> ' + apl(q.s) : 'мені забракне <span class="num">' + q.s + '</span> ' + apl(q.s)) +
    '. Тому я подарував кожній дитині по <span class="num">' + second + '</span> ' + apl(second) + ' й роздав усі апельсини, які мав. Скільки апельсинів у мене було?') + '</div>' +
    answerLine('xl');
}
function eqTwoShare(q){
  if(q.shape === 'price') return eqPrice(q);
  return q.s + ' : ' + (q.a - q.b) + ' = ' + tr(q.k + ' деца', ukN(q.k, 'дитина', 'дитини', 'дітей')) + ' → ' + (q.over ? q.a : q.b) + ' · ' + q.k + ' = ' + q.N;
}
function whyTwoShare(q, full){
  if(q.shape === 'price') return whyPrice(q, full);
  if(!full) return tr('Разликата между двата начина е по ' + (q.a - q.b) + ' на дете — и тя струва точно ' + q.s + ' портокала.',
                      'Різниця між двома способами — по ' + (q.a - q.b) + ' на дитину, і вона коштує рівно ' + q.s + ' ' + apl(q.s) + '.');
  return tr('по ' + (q.a - q.b) + ' повече на всяко дете = ' + q.s + ' портокала', 'по ' + (q.a - q.b) + ' більше на кожну дитину = ' + q.s + ' ' + apl(q.s)) + ' &nbsp;→&nbsp; ' +
    q.s + ' : ' + (q.a - q.b) + ' = ' + tr(q.k + ' деца', ukN(q.k, 'дитина', 'дитини', 'дітей')) + ' &nbsp;→&nbsp; ' + (q.over ? q.a : q.b) + ' · ' + q.k + ' = ' + q.N;
}
KIND.twoshare = { draw:drawTwoShare, eq:eqTwoShare, why:whyTwoShare };
