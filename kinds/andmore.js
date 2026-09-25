// Question kind 'andmore': level 119 И с толкова повече — One group, another with so many more: how many in all.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Зима 2020, задача 5: 12 girls and 7 more boys. The trap is 12 + 7: the boys are 12 + 7 = 19,
// and the children 12 + 19 = 31.
function genAndMore(){
  const a = 5 + rnd(20), d = 2 + rnd(10), fewer = Math.random() < 0.3;
  if(fewer && d >= a) return genAndMore();
  return {kind:'andmore', a, d, fewer, b: fewer ? a - d : a + d, ans: fewer ? 2*a - d : 2*a + d};
}
function drawAndMore(q){
  if(q.kind === 'andmore'){
    return '<div class="ask">' + tr('На спортната площадка играят <span class="num">' + q.a + '</span> момичета и със <span class="num">' + q.d + '</span> ' + (q.fewer ? 'по-малко' : 'повече') + ' момчета. Колко общо са децата, които играят на площадката?',
      'На спортивному майданчику грають <span class="num">' + q.a + '</span> дівчаток і на <span class="num">' + q.d + '</span> ' + (q.fewer ? 'менше' : 'більше') + ' хлопчиків. Скільки всього дітей грає на майданчику?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqAndMore(q){
  if(q.kind === 'andmore') return q.a + (q.fewer ? ' − ' : ' + ') + q.d + ' = ' + q.b + ', ' + q.a + ' + ' + q.b + ' = ' + q.ans;
}
function whyAndMore(q, full){
  if(q.kind === 'andmore'){
    if(!full) return tr('Първо колко са момчетата — после всички деца.', 'Спершу скільки хлопчиків — потім усі діти.');
    return tr('момчетата: ', 'хлопчиків: ') + q.a + (q.fewer ? ' − ' : ' + ') + q.d + ' = <b>' + q.b + '</b> &nbsp;→&nbsp; ' + tr('всички: ', 'усього: ') + q.a + ' + ' + q.b + ' = ' + q.ans;
  }
}
KIND.andmore = { draw:drawAndMore, eq:eqAndMore, why:whyAndMore };
