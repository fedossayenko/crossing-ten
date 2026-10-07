// Question kind 'balloons': level 87 Балоните — A total shared out: a few with several each, the rest with one;
// level 262 Балоните по два — the same, the rest with two, three or four each.

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
const BALLOONS_BG = {2:'два', 3:'три', 4:'четири'};
// Ukrainian "кулька" after a number: 1 кульку, 2–4 кульки, 5+ кульок
const balloonsUk = n => ['кульку', 'кульки', 'кульок'][{one:0, few:1, many:2}[UK_PLURAL.select(n)]];
function drawBalloons(q){
  return '<div class="ask">' + tr('Няколко деца имат общо <span class="num">' + q.T + '</span> балона, като <span class="num">' + q.k +
    '</span> деца имат по <span class="num">' + q.m + '</span> балона, а всяко от останалите — по ' + (q.e ? BALLOONS_BG[q.e] : 'един') + '. <b>Колко са децата?</b>',
    'Кілька дітей мають разом <span class="num">' + q.T + '</span> ' + balloonsUk(q.T) + ', причому <span class="num">' + q.k +
    '</span> ' + ukN(q.k, 'дитина', 'дитини', 'дітей').replace(/^\d+ /, '') + ' мають по <span class="num">' + q.m + '</span> ' + balloonsUk(q.m) + ', а кожна з решти — по ' + (q.e ? UKNUM_F[q.e] : 'одній') + '. <b>Скільки всього дітей?</b>') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqBalloons(q){
  if(q.e) return q.T + ' − ' + q.k + ' · ' + q.m + ' = ' + q.rest + ', ' + q.rest + ' : ' + q.e + ' = ' + q.r + ', ' + q.k + ' + ' + q.r + ' = ' + q.ans;
  return q.T + ' − ' + q.k + ' · ' + q.m + ' = ' + q.rest + ', ' + q.k + ' + ' + q.rest + ' = ' + q.ans;
}
function whyBalloons(q, full){
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
