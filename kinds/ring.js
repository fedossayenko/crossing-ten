// Question kind 'ring': level 115 Децата в кръг — Children in a circle, counted from both sides.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Зима 2020, задача 19: to Петър's left, between him and Иван, 4 children; to his right 6. The
// two groups fill the circle between the two boys — and the boys themselves count: 4 + 6 + 2 = 12.
function genRing(){
  const l = 1 + rnd(9), r = 1 + rnd(9);
  return {kind:'ring', l, r, ans: l + r + 2};
}
function drawRing(q){
  if(q.kind === 'ring'){
    return '<div class="ask">' + tr('Няколко деца са наредени в кръг. Отляво на Петър, между Петър и Иван, има <span class="num">' + q.l + '</span> деца. Отдясно на Петър, между Петър и Иван, има <span class="num">' + q.r + '</span> деца. Колко общо са децата в кръга?',
      'Кілька дітей стоять у колі. Ліворуч від Петра, між Петром та Іваном, <span class="num">' + q.l + '</span> дітей. Праворуч від Петра, між Петром та Іваном, <span class="num">' + q.r + '</span> дітей. Скільки всього дітей у колі?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqRing(q){
  if(q.kind === 'ring') return q.l + ' + ' + q.r + ' + 2 = ' + q.ans;
}
function whyRing(q, full){
  if(q.kind === 'ring'){
    if(!full) return tr('Нарисувай кръга. Кой още е в него, освен децата между двете момчета?', 'Намалюй коло. Хто ще в ньому, крім дітей між двома хлопцями?');
    return q.l + tr(' отляво и ', ' ліворуч і ') + q.r + tr(' отдясно, и самите Петър и Иван', ' праворуч, і самі Петро та Іван') + ' &nbsp;→&nbsp; ' + q.l + ' + ' + q.r + ' + 2 = ' + q.ans;
  }
}
KIND.ring = { draw:drawRing, eq:eqRing, why:whyRing };
