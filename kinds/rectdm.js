// Question kind 'rectdm': level 91 Обиколка в дм — A rectangle's perimeter, asked in another unit.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Коледно състезание 2025, задача 3: a 16 см by 24 см rectangle, its perimeter in дециметри.
// 16 + 24 = 40, twice is 80 см, and 10 см make a дециметър: 8. The trap is stopping at 80.
function genRectDm(){
  for(;;){
    const a = 3 + rnd(28), b = a + 1 + rnd(25), P = 2*(a + b);
    if(P % 10 || P > 150) continue;
    return {kind:'rectdm', a, b, P, ans: P / 10};
  }
}
function drawRectDm(q){
  if(q.kind === 'rectdm'){
    return '<div class="ask">' + tr('Колко <b>дециметра</b> е обиколката на правоъгълник със страни <span class="num">' + q.a + '&nbsp;см</span> и <span class="num">' + q.b + '&nbsp;см</span>?',
      'Скільки <b>дециметрів</b> становить периметр прямокутника зі сторонами <span class="num">' + q.a + '&nbsp;см</span> і <span class="num">' + q.b + '&nbsp;см</span>?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + ' <span class="unit">дм</span></div>';
  }
}
function eqRectDm(q){
  if(q.kind === 'rectdm') return '2 · (' + q.a + ' + ' + q.b + ') = ' + q.P + ' см = ' + q.ans + ' дм';
}
function whyRectDm(q, full){
  if(q.kind === 'rectdm'){
    if(!full) return tr('Първо обиколката в сантиметри — после колко дециметра прави.', 'Спершу периметр у сантиметрах — потім скільки це дециметрів.');
    return q.a + ' + ' + q.b + ' = ' + (q.a + q.b) + tr(', два пъти', ', двічі') + ' → <b>' + q.P + ' см</b> &nbsp;→&nbsp; 10 см = 1 дм' +
      tr(', значи ', ', отже ') + q.ans + ' дм';
  }
}
KIND.rectdm = { draw:drawRectDm, eq:eqRectDm, why:whyRectDm };
