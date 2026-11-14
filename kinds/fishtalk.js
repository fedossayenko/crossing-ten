// Question kind 'fishtalk': level 467 Рибарите си говорят — Four true statements about catches, one after the other: two of them together.

// Салабашев 2021, 2 клас, задача 8: Стоян, Алекс, Ради and Оги went fishing, and each told the truth. Ради: «I and Оги caught 12 fish
// together.» Стоян: «I and Алекс caught 6 more than you two.» Оги: «I caught 2 more than Ради.» Алекс: «I caught 4 more than Стоян.»
// How many did Ради and Алекс catch together? 12 − 2 = 10 = 5 + 5, so Ради 5 and Оги 7; the other two caught 12 + 6 = 18 together,
// 18 − 4 = 14 = 7 + 7, so Стоян 7 and Алекс 11; 5 + 11 = 16. Each pair in turn is two numbers with a given sum and difference.
import { KIND, answerLine, rnd, tr, ukN } from '../js/core.js';
const num = n => '<span class="num">' + n + '</span>';
// the four, in the order of the paper's roles: R (says the total), S (says «you two»), O, A — Bulgarian, Ukrainian
const CREWS = [[['Ради', 'Раді'], ['Стоян', 'Стоян'], ['Оги', 'Огі'], ['Алекс', 'Алекс']], [['Мони', 'Моні'], ['Тони', 'Тоні'], ['Пепи', 'Пепі'], ['Данко', 'Данко']]];
export function genFishTalk(){
  for(;;){
    const r = 2 + rnd(9), j = 2 + rnd(5), m = 2 + rnd(7), k = 2 + rnd(7), o = r + j, s0 = r + o + m - k;
    if(s0 < 2 || s0 % 2) continue;
    const s = s0 / 2, a = s + k;
    if(Math.max(r, o, s, a) > 20) continue;
    return {kind:'fishtalk', crew: rnd(CREWS.length), r, o, s, a, j, m, k, T: r + o, traps:[r + o].filter(v => v !== r + a), ans: r + a};
  }
}
// «с 2 риби повече» / «на 2 риби більше»: the count is 2 or more
const ukFish = n => ukN(n, 'рибину', 'рибини', 'риб');
function drawFishTalk(q){
  const c = CREWS[q.crew], bg = c.map(x => x[0]), uk = c.map(x => x[1]);
  return '<div class="ask">' + tr(bg[1] + ', ' + bg[3] + ', ' + bg[0] + ' и ' + bg[2] + ' отишли за риба. В края на деня провели следния разговор, като всеки казал истината.<br>' +
      bg[0] + ': „Аз и ' + bg[2] + ' уловихме общо ' + num(q.T) + ' риби.“<br>' + bg[1] + ': „Аз и ' + bg[3] + ' общо уловихме с ' + num(q.m) + ' риби повече от вас!“<br>' +
      bg[2] + ': „Аз улових с ' + num(q.j) + ' риби повече от ' + bg[0] + '.“<br>' + bg[3] + ': „Аз улових с ' + num(q.k) + ' риби повече от ' + bg[1] + '!“<br><b>Колко риби общо са уловили ' + bg[0] + ' и ' + bg[3] + '?</b>',
    uk[1] + ', ' + uk[3] + ', ' + uk[0] + ' і ' + uk[2] + ' пішли на рибалку. Увечері вони провели таку розмову, і кожен казав правду.<br>' +
      uk[0] + ': «Я й ' + uk[2] + ' упіймали разом ' + ukN(q.T, 'рибу', 'риби', 'риб').replace(/^\d+/, num(q.T)) + '.»<br>' + uk[1] + ': «Я й ' + uk[3] + ' упіймали разом на ' + ukFish(q.m).replace(/^\d+/, num(q.m)) + ' більше, ніж ви двоє!»<br>' +
      uk[2] + ': «Я упіймав на ' + ukFish(q.j).replace(/^\d+/, num(q.j)) + ' більше, ніж ' + uk[0] + '.»<br>' + uk[3] + ': «Я упіймав на ' + ukFish(q.k).replace(/^\d+/, num(q.k)) + ' більше, ніж ' + uk[1] + '!»<br><b>Скільки риб упіймали разом ' + uk[0] + ' і ' + uk[3] + '?</b>') + '</div>' + answerLine('xl');
}
function eqFishTalk(q){
  return q.T + ' − ' + q.j + ' = ' + (q.T - q.j) + ' = ' + q.r + ' + ' + q.r + ', ' + q.T + ' + ' + q.m + ' = ' + (q.T + q.m) + ', ' + (q.T + q.m) + ' − ' + q.k + ' = ' + 2*q.s + ' = ' + q.s + ' + ' + q.s + ', ' + q.r + ' + ' + q.a + ' = ' + q.ans;
}
function whyFishTalk(q, full){
  const c = CREWS[q.crew], bg = c.map(x => x[0]), uk = c.map(x => x[1]);
  if(!full) return tr('Започни с двамата, за които знаеш сбора и разликата. Махни разликата — остават две равни части.', 'Почни з двох, про яких знаєш суму й різницю. Прибери різницю — лишаються дві рівні частини.');
  return q.T + ' − ' + q.j + ' = ' + (q.T - q.j) + ' = <b>' + q.r + '</b> + ' + q.r + ' &nbsp;→&nbsp; ' + tr(bg[0] + ' ' + q.r + ', ' + bg[2] + ' ' + q.o, uk[0] + ' ' + q.r + ', ' + uk[2] + ' ' + q.o) + '<br>' +
    q.T + ' + ' + q.m + ' = <b>' + (q.T + q.m) + '</b> ' + tr('са другите двама', 'у двох інших') + ' &nbsp;→&nbsp; ' + (q.T + q.m) + ' − ' + q.k + ' = ' + 2*q.s + ' = <b>' + q.s + '</b> + ' + q.s + ' &nbsp;→&nbsp; ' + tr(bg[1] + ' ' + q.s + ', ' + bg[3] + ' ' + q.a, uk[1] + ' ' + q.s + ', ' + uk[3] + ' ' + q.a) +
    '<br>' + q.r + ' + ' + q.a + ' = ' + q.ans;
}
KIND.fishtalk = { draw:drawFishTalk, eq:eqFishTalk, why:whyFishTalk };
