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

const paintRowUk = {1:['одному рядку','одному стовпці'], 2:['двох рядках','двох стовпцях'], 3:['трьох рядках','трьох стовпцях']};
const paintPl = (n, one, few, many) => ({one, few}[new Intl.PluralRules('uk').select(n)] || many);

function drawPaint(q){
  if(q.kind === 'paint'){
    return '<div class="ask">' + tr('Правоъгълник е съставен от <span class="num">' + (q.R*q.C) +
      '</span> квадратчета в <span class="num">' + q.R + '</span> реда и <span class="num">' + q.C +
      '</span> стълба. Ако оцветим квадратчетата в <b>' + BGROW[q.r][0] + '</b> и в <b>' + BGROW[q.c][1] +
      '</b>, колко квадратчета ще останат <b>' + (q.asksLeft ? 'неоцветени' : 'оцветени') + '</b>?',
      'Прямокутник складено з <span class="num">' + (q.R*q.C) + '</span> ' + paintPl(q.R*q.C, 'квадратика', 'квадратиків', 'квадратиків') + ', розміщених у <span class="num">' +
      q.R + '</span> рядках і <span class="num">' + q.C + '</span> стовпцях. Якщо зафарбувати квадратики в <b>' +
      paintRowUk[q.r][0] + '</b> і в <b>' + paintRowUk[q.c][1] + '</b>, скільки квадратиків ' +
      (q.asksLeft ? 'залишиться <b>незафарбованими</b>' : 'буде <b>зафарбовано</b>') + '?') + '</div>' +
      gridSvg(q.C, q.R, 0, 0) +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT + '</div>';
  }
}
function eqPaint(q){
  if(q.kind === 'paint') return tr(q.R + '×' + q.C + ', оцветени ' + q.r + ' реда и ' + q.c + ' стълба → ' + q.ans,
    q.R + '×' + q.C + ', зафарбовано ' + q.r + ' ' + paintPl(q.r, 'рядок', 'рядки', 'рядків') + ' і ' + q.c + ' ' +
    paintPl(q.c, 'стовпець', 'стовпці', 'стовпців') + ' → ' + q.ans);
}
function whyPaint(q, full){
  if(q.kind === 'paint'){
    if(!full) return tr('Квадратчетата в кръстовищата се броят само веднъж.', 'Квадратики на перетинах рахуються лише один раз.');
    const rr = q.R - q.r, cc = q.C - q.c;
    const rows = tr(rr === 1 ? '<b>1</b> неоцветен ред' : '<b>' + rr + '</b> неоцветени реда',
      '<b>' + rr + '</b> ' + paintPl(rr, 'незафарбований рядок', 'незафарбовані рядки', 'незафарбованих рядків'));
    const cols = tr(cc === 1 ? '<b>1</b> неоцветен стълб' : '<b>' + cc + '</b> неоцветени стълба',
      '<b>' + cc + '</b> ' + paintPl(cc, 'незафарбований стовпець', 'незафарбовані стовпці', 'незафарбованих стовпців'));
    const body = tr('остават ', 'лишаються ') + rows + tr(' и ', ' і ') + cols + ' &nbsp;→&nbsp; ' +
      (rr === 1 ? String(q.left)
       : rr <= 5 ? Array(rr).fill(cc).join(' + ') + ' = ' + q.left
       : rr + ' × ' + cc + ' = ' + q.left);
    return q.asksLeft ? body : body + ' &nbsp;→&nbsp; ' + (q.R*q.C) + ' − ' + q.left + ' = ' + q.ans;
  }
}
KIND.paint = { draw:drawPaint, eq:eqPaint, why:whyPaint };
