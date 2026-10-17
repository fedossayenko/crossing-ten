// Question kind 'balloons': level 87 Балоните — A total shared out: a few with several each, the rest with one;
// level 262 Балоните по два — the same, the rest with two, three or four each;
// level 293 Един и другите — one with so many, the others with one or two each: the total, or how many have one.

// МБГ Зима 2024, задача 16: 21 balloons, 3 children with three each, every other child
// with one. The 3 children are counted as well as the ones with a single balloon: 3 + 12 = 15.
// Level 262, МБГ Есен 2024, 3 клас, задача 15: 50 balloons, 10 children with three each and every other child with
// two (e). The rest of the balloons, 50 − 30 = 20, are shared out two by two: 10 children, and with the first 10, 20.
import { KIND, SLOT, UKNUM_F, UK_PLURAL, rnd, tr, ukN } from '../js/core.js';
export function genBalloons(){
  const k = 2 + rnd(4), m = 2 + rnd(4), rest = 2 + rnd(Math.random() < 0.3 ? 30 : 14);   // Зима 2023: 3 by 3 and 31 more
  return {kind:'balloons', k, m, rest, T: k*m + rest, ans: k + rest};
}
// the 3rd grade's: the rest have e each (2 to 4), the first k have more; rest is the balloons left for them, r the children
export function genBalloons3(){
  for(;;){
    const e = 2 + rnd(3), m = e + 1 + rnd(3), k = 2 + rnd(11), r = 2 + rnd(14), T = k*m + r*e;
    if(T > 100) continue;
    return {kind:'balloons', k, m, e, r, rest: r*e, T, traps: [r, k + r*e], ans: k + r};
  }
}
// Level 293. Аз и числата 2026, 2 клас, задача 12 (shape 'shoes'): Снежанка has 4 pairs of shoes and the seven dwarfs
// one pair each — the seven is said in a word: 4 + 7 = 11. Аз и числата 2025, задача 12 (shape 'week'): two лева on
// Monday, one a day on the other six days of the week: 2 + 6 = 8 (the slip counts seven days) — asked in euro, as Bulgaria pays since 2026. Аз и числата 2023,
// задача 7 (shape 'rest'): 52 pencils, 9 children with two each, the rest with one — only those with one are asked:
// 52 − 18 = 34 (level 87 adds the 9 back; that is the slip here).
export function genBalloonsOne(){
  const w = Math.random();
  if(w < 0.35){
    const b = 1 + rnd(2), a = b + 1 + rnd(9 - b);   // «само по» one or two: she has more
    return {kind:'balloons', shape:'shoes', a, b, traps:[a + b, 7*b], ans: a + 7*b};
  }
  if(w < 0.65){
    const a = 2 + rnd(8), b = 1 + rnd(3);
    return {kind:'balloons', shape:'week', a, b, traps:[a + 7*b, a + b], ans: a + 6*b};
  }
  for(;;){
    const m = 2 + rnd(2), k = 3 + rnd(10), r = 5 + rnd(56), T = k*m + r;
    if(T > 99) continue;
    return {kind:'balloons', shape:'rest', m, k, r, T, traps:[k + r, T - k], ans: r};
  }
}
const BALLOONS_BG = {2:'два', 3:'три', 4:'четири'};
// Ukrainian "кулька" after a number: 1 кульку, 2–4 кульки, 5+ кульок
const balloonsUk = n => ['кульку', 'кульки', 'кульок'][{one:0, few:1, many:2}[UK_PLURAL.select(n)]];
const ONE_BG = {1:'един', 2:'два', 3:'три', 4:'четири', 5:'пет', 6:'шест', 7:'седем', 8:'осем', 9:'девет'};
const EUR_BG = n => ({1:'едно', 2:'две'}[n] || ONE_BG[n]) + ' евро';   // евро is neuter: едно, две
const ONE_UK = {1:'один', 2:'два', 3:'три', 4:'чотири', 5:'п’ять', 6:'шість', 7:'сім', 8:'вісім', 9:'дев’ять'};
const oneUk = (n, one, few, many) => ({one, few}[UK_PLURAL.select(n)] || many);
const oneNum = x => '<span class="num">' + x + '</span>';
function drawBalloonsOne(q){
  if(q.shape === 'shoes') return '<div class="ask">' + tr('Снежанка имала ' + oneNum(q.a) + ' чифта обувки, а седемте джуджета само по ' + oneNum(q.b) + (q.b === 1 ? ' чифт' : ' чифта') +
      '. Колко чифта обувки имат Снежанка и джуджетата общо?',
    'Білосніжка мала ' + oneNum(q.a) + ' ' + oneUk(q.a, 'пару', 'пари', 'пар') + ' взуття, а семеро гномів — лише по ' + oneNum(q.b) + (q.b === 1 ? ' парі' : ' пари') +
      '. Скільки пар взуття мають Білосніжка і гноми разом?') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
  if(q.shape === 'week') return '<div class="ask">' + tr('Ани спестявала пари за коледни играчки. В понеделник спестила ' + EUR_BG(q.a) + ', а през останалите шест дни от седмицата — по ' +
      EUR_BG(q.b) + ' на ден. Колко пари спестила Ани за една седмица?',
    'Ані відкладала гроші на ялинкові іграшки. У понеділок вона відклала ' + ONE_UK[q.a] + ' євро, а протягом решти шести днів тижня — по ' +
      (q.b === 1 ? 'одному' : ONE_UK[q.b]) + ' євро на день. Скільки грошей відклала Ані за тиждень?') + '</div>' +
    '<div class="line xl">' + SLOT + ' <span class="unit">' + tr('евро', 'євро') + '</span></div>';
  return '<div class="ask">' + tr('За състезанието „Аз и числата“ няколко деца носят общо ' + oneNum(q.T) + ' молива, като ' + oneNum(q.k) + ' носят по ' + ONE_BG[q.m] +
      ' молива, а останалите — по един. Колко деца носят по един молив?',
    'На змагання «Я і числа» кілька дітей несуть разом ' + oneNum(q.T) + ' ' + oneUk(q.T, 'олівець', 'олівці', 'олівців') + ', причому ' + oneNum(q.k) + ' несуть по ' + ONE_UK[q.m] +
      ' олівці, а решта — по одному. Скільки дітей несуть по одному олівцю?') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqBalloonsOne(q){
  if(q.shape === 'shoes') return q.a + ' + 7 · ' + q.b + ' = ' + q.ans;
  if(q.shape === 'week') return q.a + ' + 6 · ' + q.b + ' = ' + q.ans;
  return q.T + ' − ' + q.k + ' · ' + q.m + ' = ' + q.ans;
}
function whyBalloonsOne(q, full){
  if(q.shape === 'shoes'){
    if(!full) return tr('Колко чифта имат всички джуджета заедно? После прибави и чифтовете на Снежанка.', 'Скільки пар мають усі гноми разом? Потім додай і пари Білосніжки.');
    return tr('седемте джуджета по ', 'семеро гномів по ') + q.b + ': ' + Array(7).fill(q.b).join(' + ') + ' = <b>' + 7*q.b + '</b> &nbsp;→&nbsp; ' + q.a + ' + ' + 7*q.b + ' = ' + q.ans;
  }
  if(q.shape === 'week'){
    if(!full) return tr('В седмицата има седем дни: понеделник и още шест. Колко е спестила през тези шест дни?', 'У тижні сім днів: понеділок і ще шість. Скільки вона відклала за ці шість днів?');
    return tr('шест дни по ', 'шість днів по ') + q.b + tr(' евро: ', ' євро: ') + Array(6).fill(q.b).join(' + ') + ' = <b>' + 6*q.b + '</b> &nbsp;→&nbsp; ' + q.a + ' + ' + 6*q.b + ' = ' + q.ans;
  }
  if(!full) return tr('Първо намери колко молива носят децата с повече моливи. Всеки от останалите моливи е на едно дете.', 'Спершу знайди, скільки олівців несуть діти, які мають більше. Кожен з решти олівців — в однієї дитини.');
  return q.k + ' · ' + q.m + ' = <b>' + q.k*q.m + '</b>' + tr(' молива носят децата с по ' + ONE_BG[q.m], ' ' + oneUk(q.k*q.m, 'олівець', 'олівці', 'олівців') + ' несуть діти по ' + ONE_UK[q.m]) +
    ' &nbsp;→&nbsp; ' + q.T + ' − ' + q.k*q.m + ' = ' + q.ans + tr(' молива, по един на дете', ' ' + oneUk(q.ans, 'олівець', 'олівці', 'олівців') + ', по одному на дитину') + ' &nbsp;→&nbsp; ' + q.ans +
    tr(' деца', ' ' + oneUk(q.ans, 'дитина', 'дитини', 'дітей'));
}
function drawBalloons(q){
  if(q.shape) return drawBalloonsOne(q);
  return '<div class="ask">' + tr('Няколко деца имат общо <span class="num">' + q.T + '</span> балона, като <span class="num">' + q.k +
    '</span> деца имат по <span class="num">' + q.m + '</span> балона, а всяко от останалите — по ' + (q.e ? BALLOONS_BG[q.e] : 'един') + '. <b>Колко са децата?</b>',
    'Кілька дітей мають разом <span class="num">' + q.T + '</span> ' + balloonsUk(q.T) + ', причому <span class="num">' + q.k +
    '</span> ' + ukN(q.k, 'дитина', 'дитини', 'дітей').replace(/^\d+ /, '') + ' мають по <span class="num">' + q.m + '</span> ' + balloonsUk(q.m) + ', а кожна з решти — по ' + (q.e ? UKNUM_F[q.e] : 'одній') + '. <b>Скільки всього дітей?</b>') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqBalloons(q){
  if(q.shape) return eqBalloonsOne(q);
  if(q.e) return q.T + ' − ' + q.k + ' · ' + q.m + ' = ' + q.rest + ', ' + q.rest + ' : ' + q.e + ' = ' + q.r + ', ' + q.k + ' + ' + q.r + ' = ' + q.ans;
  return q.T + ' − ' + q.k + ' · ' + q.m + ' = ' + q.rest + ', ' + q.k + ' + ' + q.rest + ' = ' + q.ans;
}
function whyBalloons(q, full){
  if(q.shape) return whyBalloonsOne(q, full);
  if(q.e) return whyBalloons3(q, full);
  if(!full) return tr('Първо намери колко балона имат децата с повече балони. Не забравяй и тях да ги преброиш!',
                      'Спочатку знайди, скільки кульок у дітей, які мають більше. І не забудь їх теж порахувати!');
  return q.k + ' · ' + q.m + ' = ' + q.k*q.m + tr(' балона', ' ' + balloonsUk(q.k*q.m)) + ' &nbsp;→&nbsp; ' +
    q.T + ' − ' + q.k*q.m + ' = <b>' + q.rest + '</b>' + tr(' деца с по един', ' ' + ukN(q.rest, 'дитина', 'дитини', 'дітей').replace(/^\d+ /, '') + ' по одній') +
    ' &nbsp;→&nbsp; ' + q.k + ' + ' + q.rest + ' = ' + q.ans;
}
function whyBalloons3(q, full){
  if(!full) return tr('Първо намери колко балона остават за останалите деца и на колко деца стигат. Не забравяй и първите деца!',
                      'Спершу знайди, скільки кульок лишається решті дітей і на скількох дітей їх вистачить. І не забудь про перших дітей!');
  return q.k + ' · ' + q.m + ' = ' + q.k*q.m + tr(' балона', ' ' + balloonsUk(q.k*q.m)) + ' &nbsp;→&nbsp; ' + q.T + ' − ' + q.k*q.m + ' = ' + q.rest +
    tr(' балона за останалите', ' ' + balloonsUk(q.rest) + ' для решти') + ' &nbsp;→&nbsp; ' + q.rest + ' : ' + q.e + ' = <b>' + q.r + '</b>' +
    tr(' деца', ' ' + ukN(q.r, 'дитина', 'дитини', 'дітей').replace(/^\d+ /, '')) + ' &nbsp;→&nbsp; ' + q.k + ' + ' + q.r + ' = ' + q.ans;
}
KIND.balloons = { draw:drawBalloons, eq:eqBalloons, why:whyBalloons };
