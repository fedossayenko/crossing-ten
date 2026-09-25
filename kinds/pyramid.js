// Question kind 'pyramid': level 86 Пирамида от кутии — Rows of boxes that grow by the same amount each time.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Зима 2024, задача 13: a stepped pyramid, three boxes wide, four rows high, the top
// three shown. Row by row from the top: 3, 9, 15 — six more each time — so the fourth is
// 21 and the whole pyramid 48. The picture has to be counted; the rule does the rest.
function genPyramid(){
  const w = 2 + rnd(3), shown = 2 + rnd(2), n = shown + 1 + (Math.random() < 0.3 ? 1 : 0);
  const rows = [];
  for(let k = 1; k <= n; k++) rows.push(w*(2*k - 1));
  const last = Math.random() < 0.3;
  return {kind:'pyramid', w, shown, n, rows, last, ans: last ? rows[n - 1] : rows.reduce((a, b) => a + b, 0)};
}
// Isometric boxes, drawn back to front: the steps along i, towards the viewer on the left as on
// the paper, the width along j, height z. Faces are opaque, so hidden boxes stay hidden.
function pyramidSvg(q){
  const a = 26, cx = a*0.866, cy = a*0.5, r = q.shown, D = 2*r - 1;
  const cubes = [];
  for(let i = 0; i < D; i++) for(let j = 0; j < q.w; j++) for(let z = 0; z < r - Math.abs(i - (r - 1)); z++) cubes.push([i, j, z]);
  cubes.sort((p, s) => (p[0] + p[1]) - (s[0] + s[1]) || p[2] - s[2]);
  const P = (x, y, z) => [(y - x)*cx, (x + y)*cy - z*a];
  const poly = (pts, fill) => '<polygon points="' + pts.map(p => P(...p).map(v => v.toFixed(1)).join(',')).join(' ') +
    '" fill="' + fill + '" stroke="var(--ink)" stroke-width="1.4" stroke-linejoin="round"/>';
  const body = cubes.map(([i, j, z]) =>
    poly([[i, j, z+1], [i+1, j, z+1], [i+1, j+1, z+1], [i, j+1, z+1]], 'var(--solid)') +
    poly([[i+1, j, z], [i+1, j+1, z], [i+1, j+1, z+1], [i+1, j, z+1]], 'color-mix(in srgb, var(--solid), var(--accent) 22%)') +
    poly([[i, j+1, z], [i+1, j+1, z], [i+1, j+1, z+1], [i, j+1, z+1]], 'color-mix(in srgb, var(--solid), var(--accent) 42%)')).join('');
  const x0 = -D*cx - 4, x1 = q.w*cx + 4, y0 = -r*a - 4, y1 = (q.w + D)*cy + 4;
  return '<div class="fig"><svg viewBox="' + [x0, y0, x1 - x0, y1 - y0].map(v => v.toFixed(1)).join(' ') + '" role="img" aria-label="' +
    tr('пирамида от кутии', 'піраміда з ящиків') + '" style="max-width:320px">' + body + '</svg></div>';
}
function drawPyramid(q){
  if(q.kind === 'pyramid'){
    const top = q.shown === 3 ? tr('Трите най-горни реда', 'Три верхні ряди') : tr('Двата най-горни реда', 'Два верхні ряди');
    const ask = q.last ? tr('Колко кутии има в <b>най-долния</b> ред?', 'Скільки ящиків у <b>найнижчому</b> ряду?')
      : tr('Колко е <b>общият брой</b> кутии в тези ' + q.n + ' реда?', 'Скільки <b>всього</b> ящиків у цих ' + q.n + ' рядах?');
    return '<div class="ask">' + tr('Продавач на плодове е построил пирамида от еднакви кутии с плодове в <span class="num">' + q.n + '</span> реда. ',
      'Продавець фруктів збудував піраміду з однакових ящиків із фруктами у <span class="num">' + ukN(q.n, 'ряд', 'ряди', 'рядів').replace(' ', '</span> ') + '. ') +
      top + tr(' са показани на изображението. ', ' показано на малюнку. ') + ask + '</div>' +
      pyramidSvg(q) + '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqPyramid(q){
  if(q.kind === 'pyramid') return q.rows.join(q.last ? ', ' : ' + ') + (q.last ? ' → ' : ' = ') + q.ans;
}
function whyPyramid(q, full){
  if(q.kind === 'pyramid'){
    if(!full) return tr('Преброй кутиите във всеки ред отгоре надолу. С колко расте всеки следващ ред?',
                        'Порахуй ящики в кожному ряду згори вниз. На скільки більшає кожен наступний ряд?');
    const seen = q.rows.slice(0, q.shown).join(', ');
    return tr('отгоре: ', 'згори: ') + seen + tr(' — всеки ред има с ', ' — кожен ряд має на ') + 2*q.w + tr(' повече', ' більше') +
      ' &nbsp;→&nbsp; ' + q.rows.slice(q.shown).map((v, k) => (q.rows[q.shown + k - 1]) + ' + ' + 2*q.w + ' = ' + v).join(', ') +
      (q.last ? '' : ' &nbsp;→&nbsp; ' + q.rows.join(' + ') + ' = ' + q.ans);
  }
}
KIND.pyramid = { draw:drawPyramid, eq:eqPyramid, why:whyPyramid };
