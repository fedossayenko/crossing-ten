// Question kind 'rectdm': level 91 Обиколка в дм — A rectangle's perimeter, asked in another unit.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Коледно състезание 2025, задача 3: a 16 см by 24 см rectangle, its perimeter in дециметри.
// 16 + 24 = 40, twice is 80 см, and 10 см make a дециметър: 8. The trap is stopping at 80.
// МБГ Зима 2021–2023: one side given, the other «с 2 дм по-дълга», and the perimeter asked in
// метра — or in мм and дециметра. Two unit changes, one inside the problem and one at the end.
const RECT_U = { мм:1, см:10, дм:100, м:1000 }, RECT_W = { см:['сантиметра','сантиметрів'], дм:['дециметра','дециметрів'], м:['метра','метрів'] };
function genRectLonger(){
  for(;;){
    const mm = Math.random() < 0.3, base = mm ? 'мм' : 'см', dU = mm ? 'мм' : 'дм';
    const a = 5 + rnd(40), d = mm ? 5 + rnd(40) : 1 + rnd(4), b = a + d*RECT_U[dU]/RECT_U[base], P = 2*(a + b);
    const to = (mm ? ['дм', 'см'] : ['м', 'дм']).find(u => P*RECT_U[base] % RECT_U[u] === 0);
    if(!to || (to === (mm ? 'см' : 'дм') && Math.random() < 0.7)) continue;   // mostly the bigger unit, as the papers ask
    return {kind:'rectdm', shape:1, a, d, base, dU, b, P, to, ans: P*RECT_U[base]/RECT_U[to]};
  }
}
function genRectDm(){
  for(;;){
    const a = 3 + rnd(28), b = a + 1 + rnd(25), P = 2*(a + b);
    if(P % 10 || P > 150) continue;
    return {kind:'rectdm', a, b, P, ans: P / 10};
  }
}
function drawRectDm(q){
  if(q.kind === 'rectdm' && q.shape === 1){
    const w = RECT_W[q.to];
    return '<div class="ask">' + tr('Една от страните на правоъгълник е <span class="num">' + q.a + '&nbsp;' + q.base + '</span>, а другата е с <span class="num">' + q.d + '&nbsp;' + q.dU + '</span> по-дълга. Колко <b>' + w[0] + '</b> е обиколката на правоъгълника?',
      'Одна зі сторін прямокутника — <span class="num">' + q.a + '&nbsp;' + q.base + '</span>, а інша на <span class="num">' + q.d + '&nbsp;' + q.dU + '</span> довша. Скільки <b>' + w[1] + '</b> становить периметр прямокутника?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + ' <span class="unit">' + q.to + '</span></div>';
  }
  if(q.kind === 'rectdm'){
    return '<div class="ask">' + tr('Колко <b>дециметра</b> е обиколката на правоъгълник със страни <span class="num">' + q.a + '&nbsp;см</span> и <span class="num">' + q.b + '&nbsp;см</span>?',
      'Скільки <b>дециметрів</b> становить периметр прямокутника зі сторонами <span class="num">' + q.a + '&nbsp;см</span> і <span class="num">' + q.b + '&nbsp;см</span>?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + ' <span class="unit">дм</span></div>';
  }
}
function eqRectDm(q){
  if(q.kind === 'rectdm' && q.shape === 1) return q.a + ' + ' + q.d + ' ' + q.dU + ' = ' + q.b + ' ' + q.base + ', 2 · (' + q.a + ' + ' + q.b + ') = ' + q.P + ' ' + q.base + ' = ' + q.ans + ' ' + q.to;
  if(q.kind === 'rectdm') return '2 · (' + q.a + ' + ' + q.b + ') = ' + q.P + ' см = ' + q.ans + ' дм';
}
function whyRectDm(q, full){
  if(q.kind === 'rectdm'){
    if(q.shape === 1){
      if(!full) return tr('Първо двете страни в едни и същи мерки — после обиколката, и накрая в каквото е попитано.', 'Спершу обидві сторони в однакових одиницях — потім периметр, і нарешті в тому, про що питають.');
      return (q.dU === q.base ? '' : q.d + ' ' + q.dU + ' = ' + q.d*RECT_U[q.dU]/RECT_U[q.base] + ' ' + q.base + ', ') + tr('другата страна ', 'інша сторона ') + q.a + ' + ' + (q.b - q.a) + ' = <b>' + q.b + ' ' + q.base + '</b> &nbsp;→&nbsp; ' +
        q.a + ' + ' + q.b + ' = ' + (q.a + q.b) + tr(', два пъти', ', двічі') + ' → <b>' + q.P + ' ' + q.base + '</b> &nbsp;→&nbsp; 1 ' + q.to + ' = ' + RECT_U[q.to]/RECT_U[q.base] + ' ' + q.base + tr(', значи ', ', отже ') + q.ans + ' ' + q.to;
    }
    if(!full) return tr('Първо обиколката в сантиметри — после колко дециметра прави.', 'Спершу периметр у сантиметрах — потім скільки це дециметрів.');
    return q.a + ' + ' + q.b + ' = ' + (q.a + q.b) + tr(', два пъти', ', двічі') + ' → <b>' + q.P + ' см</b> &nbsp;→&nbsp; 10 см = 1 дм' +
      tr(', значи ', ', отже ') + q.ans + ' дм';
  }
}
KIND.rectdm = { draw:drawRectDm, eq:eqRectDm, why:whyRectDm };
