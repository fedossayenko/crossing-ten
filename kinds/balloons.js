// Question kind 'balloons': level 87 Балоните — A total shared out: a few with several each, the rest with one.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Зима 2024, задача 16: 21 balloons, 3 children with three each, every other child
// with one. The 3 children are counted as well as the ones with a single balloon: 3 + 12 = 15.
function genBalloons(){
  const k = 2 + rnd(4), m = 2 + rnd(4), rest = 2 + rnd(Math.random() < 0.3 ? 30 : 14);   // Зима 2023: 3 by 3 and 31 more
  return {kind:'balloons', k, m, rest, T: k*m + rest, ans: k + rest};
}
// Ukrainian "кулька" after a number: 1 кульку, 2–4 кульки, 5+ кульок
const balloonsUk = n => ['кульку', 'кульки', 'кульок'][{one:0, few:1, many:2}[new Intl.PluralRules('uk').select(n)]];
function drawBalloons(q){
  if(q.kind === 'balloons'){
    return '<div class="ask">' + tr('Няколко деца имат общо <span class="num">' + q.T + '</span> балона, като <span class="num">' + q.k +
      '</span> деца имат по <span class="num">' + q.m + '</span> балона, а всяко от останалите — по един. <b>Колко са децата?</b>',
      'Кілька дітей мають разом <span class="num">' + q.T + '</span> ' + balloonsUk(q.T) + ', причому <span class="num">' + q.k +
      '</span> ' + ukN(q.k, 'дитина', 'дитини', 'дітей').replace(/^\d+ /, '') + ' мають по <span class="num">' + q.m + '</span> ' + balloonsUk(q.m) + ', а кожна з решти — по одній. <b>Скільки всього дітей?</b>') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqBalloons(q){
  if(q.kind === 'balloons') return q.T + ' − ' + q.k + ' · ' + q.m + ' = ' + q.rest + ', ' + q.k + ' + ' + q.rest + ' = ' + q.ans;
}
function whyBalloons(q, full){
  if(q.kind === 'balloons'){
    if(!full) return tr('Първо намери колко балона имат децата с повече балони. Не забравяй и тях да ги преброиш!',
                        'Спочатку знайди, скільки кульок у дітей, які мають більше. І не забудь їх теж порахувати!');
    return q.k + ' · ' + q.m + ' = ' + q.k*q.m + tr(' балона', ' ' + balloonsUk(q.k*q.m)) + ' &nbsp;→&nbsp; ' +
      q.T + ' − ' + q.k*q.m + ' = <b>' + q.rest + '</b>' + tr(' деца с по един', ' ' + ukN(q.rest, 'дитина', 'дитини', 'дітей').replace(/^\d+ /, '') + ' по одній') +
      ' &nbsp;→&nbsp; ' + q.k + ' + ' + q.rest + ' = ' + q.ans;
  }
}
KIND.balloons = { draw:drawBalloons, eq:eqBalloons, why:whyBalloons };
