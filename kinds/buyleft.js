// Question kind 'buyleft': level 148 Колко останаха? — Money, a few things bought at one price, what is left;
// level 295 Рестото — one euro, three different things bought, two or three of one of them, and the change.
// The papers' лева and стотинки are asked as евро and цента, as Bulgaria pays since 2026.

// Коледно 2022, задача 2: Рая had 92 ст. and bought two decorations at 14 ст. each: 14 + 14 = 28, 92 − 28 = 64.
// The traps are 28 (what she spent) and 78 (one decoration only). Two or three things, added up, not multiplied.
import { KIND, SLOT, rnd, tr, ukN } from '../js/core.js';
export function genBuyLeft(){
  for(;;){
    const M = 50 + rnd(50), k = 2 + rnd(2), p = 8 + rnd(18), spent = k*p;
    if(M - spent < 5) continue;
    return {kind:'buyleft', M, k, p, spent, traps:[spent, M - p], ans: M - spent};
  }
}
// Level 295. Аз и числата 2023, 2 клас, задача 10: Марина had 1 лев and bought a wafer for 35 ст., two lollipops at
// 20 ст. each and a sweet for 15 ст.: 1 лев = 100 ст., 35 + 20 + 20 + 15 = 90, 100 − 90 = 10. The slips: one lollipop
// only (30), or the money spent (90). Prices in fives, as the paper's.
const MIX_WHO = [['Марина', 'Марина'], ['Ива', 'Іва'], ['Мая', 'Мая']];
// one thing: [Bulgarian, Ukrainian (accusative)]; several: [Bulgarian plural, Ukrainian 2, Ukrainian 3]
const MIX_ONE = [['вафла', 'вафлю'], ['бонбон', 'цукерку'], ['дъвка', 'жуйку'], ['кифла', 'булочку']];
const MIX_MANY = [['близалки', 'два льодяники', 'три льодяники'], ['курабийки', 'дві печивки', 'три печивки'], ['шоколадчета', 'дві шоколадки', 'три шоколадки']];
export function genBuyMix(){
  for(;;){
    const k = 2 + rnd(2), p1 = 5*(3 + rnd(8)), p2 = 5*(1 + rnd(6)), p3 = 5*(1 + rnd(6)), spent = p1 + k*p2 + p3;
    if(spent > 95 || spent < 60 || p1 === p3) continue;
    const i = rnd(MIX_ONE.length), j = (i + 1 + rnd(MIX_ONE.length - 1)) % MIX_ONE.length;
    return {kind:'buyleft', shape:'mix', who: rnd(MIX_WHO.length), one:[i, j], many: rnd(MIX_MANY.length), k, p1, p2, p3, spent,
      traps:[100 - p1 - p2 - p3, spent], ans: 100 - spent};
  }
}
const mixNum = x => '<span class="num">' + x + '</span>';
function drawBuyMix(q){
  const [bgWho, ukWho] = MIX_WHO[q.who], A = MIX_ONE[q.one[0]], C = MIX_ONE[q.one[1]], B = MIX_MANY[q.many];
  return '<div class="ask">' + tr(bgWho + ' имала 1 евро. Купила си ' + A[0] + ' за ' + mixNum(q.p1) + ' цента, ' + ['', '', 'две', 'три'][q.k] + ' ' + B[0] + ' по ' + mixNum(q.p2) +
      ' цента и ' + C[0] + ' за ' + mixNum(q.p3) + ' цента. Колко цента ѝ останали?',
    ukWho + ' мала 1 євро. Вона купила ' + A[1] + ' за ' + mixNum(q.p1) + ' центів, ' + B[q.k - 1] + ' по ' + mixNum(q.p2) + ' центів і ' + C[1] + ' за ' + mixNum(q.p3) +
      ' центів. Скільки центів у неї залишилося?') + '</div>' +
    '<div class="line xl">' + SLOT + ' <span class="unit">' + tr('цента', 'ц.') + '</span></div>';
}
function drawBuyLeft(q){
  if(q.shape === 'mix') return drawBuyMix(q);
  return '<div class="ask">' + tr('Рая имала <span class="num">' + q.M + '</span> цента. Купила си ' + ['', '', 'две', 'три'][q.k] + ' играчки за украса на елхата по <span class="num">' + q.p + '</span> цента. Колко цента са останали на Рая?',
    'Рая мала <span class="num">' + ukN(q.M, 'цент', 'центи', 'центів').replace(' ', '</span> ') + '. Вона купила ' + ['', '', 'дві', 'три'][q.k] + ' прикраси на ялинку по <span class="num">' + ukN(q.p, 'цент', 'центи', 'центів').replace(' ', '</span> ') + '. Скільки центів залишилося в Раї?') + '</div>' +
    '<div class="line xl">' + SLOT + ' <span class="unit">' + tr('цента', 'ц.') + '</span></div>';
}
function eqBuyLeft(q){
  if(q.shape === 'mix') return '100 − ' + q.p1 + ' − ' + Array(q.k).fill(q.p2).join(' − ') + ' − ' + q.p3 + ' = ' + q.ans;
  return q.M + ' − ' + Array(q.k).fill(q.p).join(' − ') + ' = ' + q.ans;
}
function whyBuyLeft(q, full){
  if(q.shape === 'mix'){
    if(!full) return tr('Едно евро е сто цента. Колко струва всичко купено? Внимавай: от едното нещо е купила повече от едно. После извади.',
      'Одне євро — це сто центів. Скільки коштує все куплене? Уважно: однієї з речей вона купила більше ніж одну. Потім відніми.');
    return tr('1 евро = 100 цента', '1 євро = 100 центів') + ' &nbsp;→&nbsp; ' + tr('похарчила: ', 'витратила: ') + [q.p1].concat(Array(q.k).fill(q.p2), q.p3).join(' + ') + ' = <b>' + q.spent + '</b>' + tr(' цента', ' центів') + ' &nbsp;→&nbsp; 100 − ' + q.spent + ' = ' + q.ans;
  }
  if(!full) return tr('Колко цента струват всички играчки заедно? После ги извади.', 'Скільки центів коштують усі прикраси разом? Потім відніми.');
  return Array(q.k).fill(q.p).join(' + ') + ' = <b>' + q.spent + '</b> &nbsp;→&nbsp; ' + q.M + ' − ' + q.spent + ' = ' + q.ans;
}
KIND.buyleft = { draw:drawBuyLeft, eq:eqBuyLeft, why:whyBuyLeft };
