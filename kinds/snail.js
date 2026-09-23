// Question kind 'snail': level 58 Охлювът — Up by day, back by night — when the top is reached.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 20: a snail that climbs by day and slips back by night. It only has to reach the
// top once, so the last climb is not followed by a slip — the slipping stops there.
function genSnail(){
  for(;;){
    const up = 5 + rnd(6), down = 2 + rnd(up - 3);
    const gain = up - down;
    const H = up + 1 + rnd(30);
    const k = Math.ceil((H - up) / gain);
    if(k < 2 || k > 12) continue;
    return {kind:'snail', H, up, down, gain, k, ans: 2*k + 1};
  }
}

const snailM = n => ({one:'метр', few:'метри', many:'метрів'})[new Intl.PluralRules('uk').select(n)] || 'метра';
function drawSnail(q){
  if(q.kind === 'snail'){
    return tr('<div class="ask">Един охлюв се катери по дървена греда, висока <span class="num">' + q.H +
      '</span> метра. През деня се изкачва <span class="num">' + q.up +
      '</span> метра нагоре, а през нощта се смъква <span class="num">' + q.down +
      '</span> метра надолу. След колко <b>дни</b> охлювът ще стигне върха, ако тръгва от земята?</div>',
      '<div class="ask">Равлик повзе по дерев’яній жердині заввишки <span class="num">' + q.H +
      '</span> ' + snailM(q.H) + '. Удень він піднімається на <span class="num">' + q.up +
      '</span> ' + snailM(q.up) + ' вгору, а вночі сповзає на <span class="num">' + q.down +
      '</span> ' + snailM(q.down) + ' вниз. Через скільки <b>днів</b> равлик доповзе до верху, якщо починає від землі?</div>') +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + ' <span class="unit">' + tr('дни', 'днів') + '</span></div>';
  }
}
function eqSnail(q){
  if(q.kind === 'snail') return q.H + ' м, +' + q.up + '/−' + q.down + ' → ' + q.ans;
}
function whySnail(q, full){
  if(q.kind === 'snail'){
    if(!full) return tr('Всяко денонощие го качва с малко, но последното изкачване няма връщане назад.',
      'Кожна доба піднімає його трохи вище, але після останнього підйому він уже не сповзає.');
    const before = q.gain * (q.k - 1);
    return tr('за всяко денонощие печели ', 'за кожну добу він просувається на ') + q.up + ' − ' + q.down + ' = <b>' + q.gain +
      tr('</b> м &nbsp;→&nbsp; трябва преди последното изкачване да е на ', '</b> м &nbsp;→&nbsp; перед останнім підйомом він має бути на висоті ') +
      q.H + ' − ' + q.up + ' = <b>' + (q.H - q.up) +
      tr('</b> м или повече &nbsp;→&nbsp; това става след ' + q.k + ' денонощия (',
         '</b> м або вище &nbsp;→&nbsp; так буде після ' + q.k + ' діб (') +
      (q.gain*q.k) + ' м) &nbsp;→&nbsp; ' + q.k + ' × 2 + 1 = ' + q.ans;
  }
}
KIND.snail = { draw:drawSnail, eq:eqSnail, why:whySnail };
