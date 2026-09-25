// Question kind 'cutrect': level 106 Разрязан правоъгълник — A rectangle cut in three: find the lost side.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Зима 2022, задача 13: a 4 by 5 rectangle cut into 1 by 2, 2 by 3 and X by 4. The small
// squares are what is shared out: 20 = 2 + 6 + 4 · X, so 4 · X = 12 and X = 3. Generated from
// real cuts — a strip off one side, then the rest in two — so the pieces always fit.
function genCutRect(){
  for(;;){
    const W = 3 + rnd(4), H = 3 + rnd(4);
    if(W*H > 36) continue;
    const c = 1 + rnd(W - 1), r = 1 + rnd(H - 1);
    const pieces = shuffle([[c, H], [W - c, r], [W - c, H - r]].map(p => rnd(2) ? p : [p[1], p[0]]));
    const at = rnd(3), side = rnd(2), X = pieces[at][side], other = pieces[at][1 - side];
    if(X === other && Math.random() < 0.7) continue;
    const turn = rnd(2);                                          // the big one told either way round (the paper says 4 by 5)
    return {kind:'cutrect', W: turn ? H : W, H: turn ? W : H, pieces, at, side, other, ans: X};
  }
}
function cutThreeSvg(q){
  const u = 16, gap = 18;
  let x = 0, out = '';
  const rect = (w, h, lw, lh) => { const s = '<g transform="translate(' + x + ',' + (6*u - h*u) + ')"><rect x="0" y="0" width="' + w*u + '" height="' + h*u + '" fill="none" stroke="var(--ink)" stroke-width="2"/>' +
      '<text x="' + (w*u/2) + '" y="' + (h*u + 15) + '" text-anchor="middle" font-size="13" font-weight="800" fill="var(--muted)" font-family="Nunito, sans-serif">' + lw + '</text>' +
      '<text x="-6" y="' + (h*u/2 + 5) + '" text-anchor="end" font-size="13" font-weight="800" fill="var(--muted)" font-family="Nunito, sans-serif">' + lh + '</text></g>'; x += w*u + gap + 10; return s; };
  x = 14;
  out += rect(q.W, q.H, q.W, q.H);
  q.pieces.forEach(([w, h], i) => { out += rect(w, h, i === q.at && q.side === 0 ? 'X' : w, i === q.at && q.side === 1 ? 'X' : h); });
  return '<div class="fig wide"><svg viewBox="0 0 ' + x + ' ' + (6*u + 22) + '" role="img" aria-label="' + tr('правоъгълник и трите му части', 'прямокутник і три його частини') + '">' + out + '</svg></div>';
}
function drawCutRect(q){
  if(q.kind === 'cutrect'){
    const sides = p => p[0] + ' см, ' + p[0] + ' см, ' + p[1] + ' см ' + tr('и', 'і') + ' ' + p[1] + ' см';
    const named = q.pieces.map((p, i) => i === q.at ? (q.side === 0 ? 'X см, X см, ' + p[1] + ' см ' + tr('и', 'і') + ' ' + p[1] + ' см' : p[0] + ' см, ' + p[0] + ' см, X см ' + tr('и', 'і') + ' X см') : sides(p));
    return '<div class="ask">' + tr('Правоъгълник със страни ' + sides([q.W, q.H]) + ' разрязах на три правоъгълника: първият със страни ' + named[0] + '; вторият — ' + named[1] + '; третият — ' + named[2] + '. Колко е <b>X</b>?',
      'Прямокутник зі сторонами ' + sides([q.W, q.H]) + ' розрізали на три прямокутники: перший зі сторонами ' + named[0] + '; другий — ' + named[1] + '; третій — ' + named[2] + '. Чому дорівнює <b>X</b>?') + '</div>' +
      cutThreeSvg(q) + '<div class="line" style="font-size:clamp(34px,10vw,56px)">X = ' + SLOT + '</div>';
  }
}
const cutRectRest = q => q.W*q.H - q.pieces.filter((_, i) => i !== q.at).reduce((t, p) => t + p[0]*p[1], 0);
function eqCutRect(q){
  if(q.kind === 'cutrect') return q.W + '·' + q.H + ' − ' + q.pieces.filter((_, i) => i !== q.at).map(p => p[0] + '·' + p[1]).join(' − ') + ' = ' + cutRectRest(q) + ' = X·' + q.other + ' → ' + q.ans;
}
function whyCutRect(q, full){
  if(q.kind === 'cutrect'){
    if(!full) return tr('Раздели всичко на квадратчета със страна един сантиметър. Колко са в големия? А в двете известни парчета?', 'Поділи все на квадратики зі стороною один сантиметр. Скільки їх у великому? А у двох відомих частинах?');
    const known = q.pieces.filter((_, i) => i !== q.at), rest = cutRectRest(q);
    return tr('квадратчета: ', 'квадратиків: ') + q.W + ' · ' + q.H + ' = <b>' + q.W*q.H + '</b>, ' + tr('в известните ', 'у відомих ') + known.map(p => p[0] + ' · ' + p[1] + ' = ' + p[0]*p[1]).join(tr(' и ', ' і ')) +
      ' &nbsp;→&nbsp; ' + tr('остават ', 'лишається ') + rest + ' = X · ' + q.other + ' &nbsp;→&nbsp; X = ' + q.ans;
  }
}
KIND.cutrect = { draw:drawCutRect, eq:eqCutRect, why:whyCutRect };
