// Question kind 'tiles': level 73 Плочки — Rectangles made of two squares, and the big rectangle they tile.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Есен, 3 клас, задача 15: two equal rectangles, each with perimeter 12 cm, and 8 equal squares
// build a rectangle 3 squares wide and 4 high. The picture shows each small rectangle is two
// squares, so its perimeter is 6 square sides: a side is 2 cm, and the big one is 6 by 8 cm, 28 cm round.
function genPlates(){
  for(;;){
    const w = 3 + rnd(2), h = 3 + rnd(3), m = 1 + rnd(3), u = 1 + rnd(3);
    if(m > h || w*h - 2*m < 4) continue;
    const rows = shuffle([...Array(h).keys()]).slice(0, m).sort((a, b) => a - b);
    const dom = rows.map(r => [r, rnd(w - 1)]);               // [row, first column] of each two-square rectangle
    return {kind:'tiles', w, h, m, u, R: 6*u, sq: w*h - 2*m, dom, ans: 2*(w + h)*u,
            traps: [2*(w + h), (w*h)*u, 4*u*(w + h) / 2 + 2*u].filter(v => v !== 2*(w + h)*u)};
  }
}
function plateSvg(q){
  const c = 26, W = q.w*c, H = q.h*c;
  let lines = '';
  for(let r = 1; r < q.h; r++) lines += '<line x1="0" y1="' + r*c + '" x2="' + W + '" y2="' + r*c + '"/>';
  for(let r = 0; r < q.h; r++) for(let x = 1; x < q.w; x++){
    const d = q.dom.find(p => p[0] === r);
    if(d && x === d[1] + 1) continue;                          // inside a two-square rectangle: no line
    lines += '<line x1="' + x*c + '" y1="' + r*c + '" x2="' + x*c + '" y2="' + (r + 1)*c + '"/>';
  }
  return '<div class="fig small"><svg viewBox="-4 -4 ' + (W + 8) + ' ' + (H + 8) + '" role="img" aria-label="' + tr('правоъгълник от плочки', 'прямокутник із плиток') + '">' +
    '<rect x="0" y="0" width="' + W + '" height="' + H + '" fill="none" stroke="var(--ink)" stroke-width="2"/><g stroke="var(--ink)" stroke-width="1.4">' + lines + '</g></svg></div>';
}
function drawTiles(q){
  if(q.kind === 'tiles'){
    const one = q.m === 1;
    return '<div class="ask">' + tr((one ? 'С един правоъгълник с обиколка <span class="num">' + q.R + '</span> см'
        : 'С <span class="num">' + q.m + '</span> еднакви правоъгълника, всеки с обиколка <span class="num">' + q.R + '</span> см,') +
      ' и <span class="num">' + q.sq + '</span> еднакви квадрата построих правоъгълник. Пресметнете в сантиметри обиколката на построения правоъгълник.',
      (one ? 'З одного прямокутника з периметром <span class="num">' + q.R + '</span> см'
        : 'З <span class="num">' + q.m + '</span> однакових прямокутників, кожен з периметром <span class="num">' + q.R + '</span> см,') +
      ' і <span class="num">' + q.sq + '</span> однакових квадратів я побудував прямокутник. Обчисліть у сантиметрах периметр побудованого прямокутника.') +
      '</div>' + plateSvg(q) + '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT + CM + '</div>';
  }
}
function eqTiles(q){
  if(q.kind === 'tiles') return q.R + ' : 6 = ' + q.u + ' → 2 · (' + q.w*q.u + ' + ' + q.h*q.u + ') = ' + q.ans + ' см';
}
function whyTiles(q, full){
  if(q.kind === 'tiles'){
    if(!full) return tr('По чертежа: малкият правоъгълник е два квадрата. Колко страни на квадрат е обиколката му?',
                        'За рисунком: малий прямокутник — це два квадрати. Скільки сторін квадрата становить його периметр?');
    return tr('обиколката на малкия правоъгълник е 6 страни на квадрат', 'периметр малого прямокутника — 6 сторін квадрата') + ' &nbsp;→&nbsp; ' + q.R + ' : 6 = ' + q.u +
      tr(' см &nbsp;→&nbsp; страните: ', ' см &nbsp;→&nbsp; сторони: ') + q.w + ' · ' + q.u + ' = ' + q.w*q.u + tr(' и ', ' і ') + q.h + ' · ' + q.u + ' = ' + q.h*q.u +
      ' &nbsp;→&nbsp; 2 · (' + q.w*q.u + ' + ' + q.h*q.u + ') = ' + q.ans + ' см';
  }
}
KIND.tiles = { draw:drawTiles, eq:eqTiles, why:whyTiles };
