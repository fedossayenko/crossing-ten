// Question kind 'paint': level 34 Оцветени — Paint whole rows and columns — what is left.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

const BGROW = {1:['един ред','един стълб'], 2:['два реда','два стълба'], 3:['три реда','три стълба']};

// Задача 14: whole rows and columns painted. What survives is the leftover rows
// times the leftover columns — the crossings are counted twice the other way.
function genPaint(){
  const R = 3 + rnd(3), C = 4 + rnd(4);
  const r = 1 + rnd(Math.min(3, R - 1)), c = 1 + rnd(Math.min(3, C - 1));
  const left = (R - r) * (C - c);
  const asksLeft = Math.random() < 0.7;
  return {kind:'paint', R, C, r, c, left, asksLeft, ans: asksLeft ? left : R*C - left};
}

function drawPaint(q){
  if(q.kind === 'paint'){
    return '<div class="ask">Правоъгълник е съставен от <span class="num">' + (q.R*q.C) +
      '</span> квадратчета в <span class="num">' + q.R + '</span> реда и <span class="num">' + q.C +
      '</span> стълба. Ако оцветим квадратчетата в <b>' + BGROW[q.r][0] + '</b> и в <b>' + BGROW[q.c][1] +
      '</b>, колко квадратчета ще останат <b>' + (q.asksLeft ? 'неоцветени' : 'оцветени') + '</b>?</div>' +
      gridSvg(q.C, q.R, 0, 0) +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT + '</div>';
  }
}
function eqPaint(q){
  if(q.kind === 'paint') return q.R + '×' + q.C + ', оцветени ' + q.r + ' реда и ' + q.c + ' стълба → ' + q.ans;
}
function whyPaint(q, full){
  if(q.kind === 'paint'){
    if(!full) return 'Квадратчетата в кръстовищата се броят само веднъж.';
    const rr = q.R - q.r, cc = q.C - q.c;
    const rows = rr === 1 ? '<b>1</b> неоцветен ред' : '<b>' + rr + '</b> неоцветени реда';
    const cols = cc === 1 ? '<b>1</b> неоцветен стълб' : '<b>' + cc + '</b> неоцветени стълба';
    const body = 'остават ' + rows + ' и ' + cols + ' &nbsp;→&nbsp; ' +
      (rr === 1 ? String(q.left)
       : rr <= 5 ? Array(rr).fill(cc).join(' + ') + ' = ' + q.left
       : rr + ' × ' + cc + ' = ' + q.left);
    return q.asksLeft ? body : body + ' &nbsp;→&nbsp; ' + (q.R*q.C) + ' − ' + q.left + ' = ' + q.ans;
  }
}
KIND.paint = { draw:drawPaint, eq:eqPaint, why:whyPaint };
