// Question kind 'sqcut': level 21 Обиколка — Squares, sheets and triangles — sides and perimeters.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

const BGNUM_M = {2:'два', 3:'три', 4:'четири'};   // masculine nouns take два, not две

const BGCOUNT = {4:'четири', 9:'девет'};

// Задача 15: a square cut into equal squares. The small side is never divided out —
// it is found by asking what adds up to the big side.
function cutRectSvg(a, extra){
  const W = 160, u = W / (a + extra), H = a * u;
  return '<div class="fig"><svg viewBox="-4 -4 ' + (W + 8) + ' ' + (H + 8) + '" role="img" aria-label="лист, разрязан на квадрат и правоъгълник">' +
    '<g stroke="var(--ink)" stroke-width="2.2" fill="none">' +
    '<rect x="0" y="0" width="' + W + '" height="' + H.toFixed(1) + '"/>' +
    '<line x1="' + (a*u).toFixed(1) + '" y1="0" x2="' + (a*u).toFixed(1) + '" y2="' + H.toFixed(1) + '"/></g>' +
    '<text x="' + (a*u/2).toFixed(1) + '" y="' + (H/2 + 6).toFixed(1) + '" text-anchor="middle" font-size="17" ' +
    'font-weight="700" fill="var(--ink)" font-family="Nunito, sans-serif">A</text>' +
    '<text x="' + (a*u + extra*u/2).toFixed(1) + '" y="' + (H/2 + 6).toFixed(1) + '" text-anchor="middle" font-size="17" ' +
    'font-weight="700" fill="var(--ink)" font-family="Nunito, sans-serif">B</text></svg></div>';
}
// Задача 13: a rectangle tiled by squares. The figure gives the shape, one line of text
// gives the scale — everything else is read off the picture.
// Each tiling is [x, y, side] in units, y measured down from the top.
const TILINGS = [
  { w:5, h:3, sq:[[0,0,2],[0,2,1],[1,2,1],[2,0,3]] },
  { w:3, h:2, sq:[[0,0,2],[2,0,1],[2,1,1]] },
  { w:3, h:1, sq:[[0,0,1],[1,0,1],[2,0,1]] },
  { w:4, h:3, sq:[[0,0,3],[3,0,1],[3,1,1],[3,2,1]] },
  { w:5, h:2, sq:[[0,0,2],[2,0,2],[4,0,1],[4,1,1]] }
];
function genTiles(){
  const t = TILINGS[rnd(TILINGS.length)];
  const s = 1 + rnd(3);
  const least = Math.min.apply(null, t.sq.map(r => r[2]));
  return {kind:'sqcut', shape:5, t, s, n: t.sq.length,
          few: t.sq.filter(r => r[2] === least).length, side: least * s, ans: 2*(t.w + t.h)*s};
}
// Задача 12: two perimeters told in different units, so the square has to be brought
// to centimetres before the comparison means anything.
function genTriSq(){
  for(;;){
    const inCm = Math.random() < 0.45;         // told in сантиметри, so there is nothing to convert
    const dm = inCm ? 3 + rnd(8) : 1 + rnd(2);
    const P = inCm ? 4*dm : 40*dm;
    const a = 2 + rnd(5), b = a + rnd(5), c = b + rnd(5);   // sides may repeat, so 7-7-6 can come up
    if(c >= a + b) continue;                   // three lengths only close into a triangle if the short two beat the long one
    const p = a + b + c;
    if(p >= P) continue;
    return {kind:'sqcut', shape:4, inCm, dm, P, sides:[a, b, c], p, ans: P - p};
  }
}
// The tiling drawn from its unit layout, outer edge heavier than the cuts.
function tilesSvg(t){
  const u = 190 / t.w, H = t.h * u;
  const box = (x, y, w, h, sw) => '<rect x="' + (x*u).toFixed(1) + '" y="' + (y*u).toFixed(1) +
    '" width="' + (w*u).toFixed(1) + '" height="' + (h*u).toFixed(1) + '" stroke-width="' + sw + '"/>';
  return '<div class="fig"><svg viewBox="-4 -4 198 ' + (H + 8).toFixed(1) +
    '" role="img" aria-label="правоъгълник, съставен от квадрати">' +
    '<g stroke="var(--ink)" fill="none" stroke-linejoin="round">' +
    t.sq.map(r => box(r[0], r[1], r[2], r[2], '1.8')).join('') +
    box(0, 0, t.w, t.h, '2.8') + '</g></svg></div>';
}
// Both shapes drawn to one scale, so the square looking bigger is not a coincidence.
function triSqSvg(q){
  const [p, r, L] = q.sides.slice().sort((x, y) => x - y);   // L is the longest, so it makes the base
  const ax = (L*L + r*r - p*p) / (2*L), ay = Math.sqrt(Math.max(1, r*r - ax*ax));
  const S = q.inCm ? q.dm : 10 * q.dm, u = 200 / (L + S + 4), H = Math.max(ay, S) * u;
  const t = (x, y, txt) => '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) +
    '" text-anchor="middle" font-size="13" font-weight="700" fill="var(--muted)" font-family="Nunito, sans-serif">' + txt + '</text>';
  const sx = (L + 4) * u;
  return '<div class="fig"><svg viewBox="-16 -16 ' + (232).toFixed(0) + ' ' + (H + 34).toFixed(1) +
    '" role="img" aria-label="триъгълник и квадрат">' +
    '<g stroke="var(--ink)" stroke-width="2.2" fill="none" stroke-linejoin="round">' +
    '<path d="M0 ' + H.toFixed(1) + 'L' + (L*u).toFixed(1) + ' ' + H.toFixed(1) + 'L' + (ax*u).toFixed(1) +
      ' ' + (H - ay*u).toFixed(1) + 'Z"/>' +
    '<rect x="' + sx.toFixed(1) + '" y="' + (H - S*u).toFixed(1) + '" width="' + (S*u).toFixed(1) +
      '" height="' + (S*u).toFixed(1) + '"/></g>' +
    t(L*u/2, H + 15, L + ' см') +
    t(ax*u/2 - 9, H - ay*u/2, r + ' см') +
    t((ax + L)*u/2 + 9, H - ay*u/2, p + ' см') +
    t(sx + S*u/2, H + 15, q.dm + (q.inCm ? ' см' : ' дм')) + '</svg></div>';
}
function genSqCut(){
  if(Math.random() < 0.2){
    // Задача 15: strips, and the answer wanted in милиметри — ten to the centimetre.
    const k = 2 + rnd(3);                      // 2, 3 or 4 strips
    const w = 1 + rnd(3), side = k*w;
    const mm = Math.random() < 0.6;
    const P = 2*(w + side);
    return {kind:'sqcut', shape:6, k, w, side, mm, ans: mm ? 10*P : P};
  }
  if(Math.random() < 0.26) return genTiles();
  if(Math.random() < 0.28) return genTriSq();
  if(Math.random() < 0.3){
    // Задача 13: a sheet cut into a square and what is left over. The square's side is
    // the whole height, so the leftover width comes out of the half-perimeter.
    const a = 3 + rnd(5);
    const extra = 1 + rnd(a - 1);              // keeps B's short side the shorter one
    const asksSide = Math.random() < 0.65;
    return {kind:'sqcut', shape:3, a, extra, P: 2*(2*a + extra),
            ans: asksSide ? extra : 2*(extra + a), asksSide};
  }
  const parts = Math.random() < 0.75 ? 2 : 3;
  const small = 2 + rnd(4);
  const side = parts * small;
  const shape = parts === 2 ? rnd(3) : rnd(2);
  return {kind:'sqcut', parts, side, small, shape,
          ans: shape === 0 ? 4*small : shape === 1 ? 4*side : 4*small*parts*parts};
}
// Задача 15: the same square, but cut the one way into strips — so the pieces are long
// and thin rather than square, and their two sides are not the same.
function stripSvg(k, side){
  const S = 118, u = S/k;
  let g = '<rect x="0" y="0" width="' + S + '" height="' + S + '"/>';
  for(let i = 1; i < k; i++)
    g += '<line x1="0" y1="' + (i*u).toFixed(1) + '" x2="' + S + '" y2="' + (i*u).toFixed(1) + '"/>';
  return '<div class="fig"><svg viewBox="-8 -24 ' + (S+16) + ' ' + (S+32) +
    '" role="img" aria-label="квадрат, разрязан на еднакви ивици">' +
    '<g stroke="var(--ink)" stroke-width="1.9" fill="none">' + g + '</g>' +
    '<text x="' + S/2 + '" y="-9" text-anchor="middle" font-size="15" font-weight="700" ' +
    'fill="var(--muted)" font-family="Nunito, sans-serif">' + side + ' см</text></svg></div>';
}
function sqSvg(parts, side){
  const S = 118, u = S/parts;
  let g = '<rect x="0" y="0" width="' + S + '" height="' + S + '"/>';
  for(let i = 1; i < parts; i++)
    g += '<line x1="' + i*u + '" y1="0" x2="' + i*u + '" y2="' + S + '"/>' +
         '<line x1="0" y1="' + i*u + '" x2="' + S + '" y2="' + i*u + '"/>';
  return '<div class="fig"><svg viewBox="-8 -24 ' + (S+16) + ' ' + (S+32) + '" role="img" aria-label="квадрат, разрязан на еднакви квадрати">' +
    '<g stroke="var(--ink)" stroke-width="1.9" fill="none">' + g + '</g>' +
    '<text x="' + S/2 + '" y="-9" text-anchor="middle" font-size="15" font-weight="700" ' +
    'fill="var(--muted)" font-family="Nunito, sans-serif">' + side + ' см</text></svg></div>';
}

function drawSqcut(q){
  if(q.kind === 'sqcut' && q.shape === 6){
    return '<div class="ask">Квадрат със страна <span class="num">' + q.side +
      '</span> см е разрязан на <span class="num">' + BGNUM_M[q.k] +
      '</span> еднакви правоъгълника. Колко <b>' + (q.mm ? 'милиметра' : 'сантиметра') +
      '</b> е обиколката на всеки един от тези правоъгълници?</div>' +
      stripSvg(q.k, q.side) +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT +
      ' <span class="unit">' + (q.mm ? 'мм' : 'см') + '</span></div>';
  }
  if(q.kind === 'sqcut' && q.shape === 5){
    const many = {2:'два', 3:'три', 4:'четири'}[q.few];
    const which = q.few === q.n ? 'всички квадрати имат' : many + ' от квадратите имат';
    return '<div class="ask">Колко сантиметра е обиколката на правоъгълника, който е съставен от <span class="num">' +
      q.n + '</span> квадрата, ако ' + which + ' страна <span class="num">' + q.side + '</span> см?</div>' +
      tilesSvg(q.t) +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT + CM + '</div>';
  }
  if(q.kind === 'sqcut' && q.shape === 4){
    return '<div class="ask">Триъгълник има страни <span class="num">' + q.sides.join('</span> см, <span class="num">') +
      '</span> см. Квадрат има страна <span class="num">' + q.dm +
      '</span> ' + (q.inCm ? 'см' : 'дм') +
      '. С колко сантиметра обиколката на <b>квадрата</b> е по-голяма от обиколката на <b>триъгълника</b>?</div>' +
      triSqSvg(q) +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + SLOT + CM + '</div>';
  }
  if(q.kind === 'sqcut' && q.shape === 3){
    return '<div class="ask">Разрязах правоъгълен лист с обиколка <span class="num">' + q.P +
      '</span> см на квадрат <b>A</b> със страна <span class="num">' + q.a +
      '</span> см и правоъгълник <b>B</b>. Колко сантиметра е ' +
      (q.asksSide ? '<b>по-малката страна</b> на правоъгълник B' : '<b>обиколката</b> на правоъгълник B') + '?</div>' +
      cutRectSvg(q.a, q.extra) +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT + CM + '</div>';
  }
  if(q.kind === 'sqcut'){
    const ask = q.shape === 0 ? 'Колко сантиметра е сборът от страните на всеки един от тези еднакви квадрати?'
              : q.shape === 1 ? 'Колко сантиметра е обиколката на големия квадрат?'
              : 'Колко сантиметра е сборът от обиколките на всички малки квадрати?';
    return '<div class="ask">Квадрат със страна <span class="num">' + q.side + '</span> см е разрязан на ' +
      BGCOUNT[q.parts*q.parts] + ' еднакви квадрата. ' + ask + '</div>' +
      sqSvg(q.parts, q.side) +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT + CM + '</div>';
  }
}
function eqSqcut(q){
  if(q.kind === 'sqcut' && q.shape === 6) return 'квадрат ' + q.side + ', на ' + q.k + ' ивици → ' +
    q.w + '×' + q.side + ' → ' + q.ans;
  if(q.kind === 'sqcut' && q.shape === 5) return q.n + ' квадрата, страна ' + q.side + ' → правоъгълник ' +
    (q.t.w*q.s) + '×' + (q.t.h*q.s) + ' → ' + q.ans;
  if(q.kind === 'sqcut' && q.shape === 4) return 'квадрат ' + q.dm + (q.inCm ? ' см → ' : ' дм → ') + q.P + ', триъгълник ' +
    q.sides.join('+') + ' = ' + q.p + ' → ' + q.ans;
  if(q.kind === 'sqcut') return q.shape === 3
    ? 'лист с обиколка ' + q.P + ', квадрат ' + q.a + ' → ' + q.ans
    : 'страна ' + q.side + ', на ' + (q.parts*q.parts) + ' квадрата → ' + q.ans;
}
function whySqcut(q, full){
  if(q.kind === 'sqcut' && q.shape === 6){
    if(!full) return 'Едната страна на ивицата е цялата страна на квадрата, другата е част от нея.';
    const P = 2*(q.w + q.side);
    return 'всяка ивица е <b>' + q.w + '</b> на <b>' + q.side + '</b> см &nbsp;→&nbsp; ' + q.w + ' + ' +
      q.side + ' = ' + (q.w + q.side) + ', два пъти &nbsp;→&nbsp; <b>' + P + ' см</b>' +
      (q.mm ? ' &nbsp;→&nbsp; 1 см = 10 мм, значи ' + q.ans + ' мм' : '');
  }
  if(q.kind === 'sqcut' && q.shape === 5){
    if(!full) return 'Най-малкото квадратче дава мярката — с нея измери целия правоъгълник.';
    return 'страната на най-малкото е ' + q.side + ' &nbsp;→&nbsp; правоъгълникът е <b>' + (q.t.w*q.s) +
      '</b> на <b>' + (q.t.h*q.s) + '</b> &nbsp;→&nbsp; ' + (q.t.w*q.s) + ' + ' + (q.t.h*q.s) + ' = ' +
      ((q.t.w + q.t.h)*q.s) + ', два пъти &nbsp;→&nbsp; ' + q.ans;
  }
  if(q.kind === 'sqcut' && q.shape === 4){
    if(!full) return q.inCm ? 'Пресметни поотделно двете обиколки.'
                            : 'Двете обиколки са в различни мерки — изравни ги първо.';
    const side = q.inCm ? q.dm : 10*q.dm;
    return (q.inCm ? '' : q.dm + ' дм = <b>' + side + '</b> см &nbsp;→&nbsp; ') +
      'квадратът е 4 × ' + side + ' = <b>' + q.P +
      '</b>, триъгълникът е ' + q.sides.join(' + ') + ' = <b>' + q.p + '</b> &nbsp;→&nbsp; ' +
      q.P + ' − ' + q.p + ' = ' + q.ans;
  }
  if(q.kind === 'sqcut' && q.shape === 3){
    if(!full) return 'Половината обиколка са двете различни страни, взети по веднъж.';
    const half = q.P / 2, wide = half - q.a;
    return 'половината обиколка е ' + q.P + ' : 2 = <b>' + half + '</b>, а височината е ' + q.a +
      ' &nbsp;→&nbsp; дължината е ' + half + ' − ' + q.a + ' = <b>' + wide + '</b>' +
      ' &nbsp;→&nbsp; B е ' + q.extra + ' на ' + q.a +
      (q.asksSide ? ', по-малката страна е ' + q.ans
                  : ', обиколката ѝ е ' + q.extra + ' + ' + q.a + ' + ' + q.extra + ' + ' + q.a + ' = ' + q.ans);
  }
  if(q.kind === 'sqcut'){
    if(!full) return q.shape === 1 ? 'Обиколката е сборът от четирите страни.' : 'Колко прави малката страна?';
    const add = (v, n) => Array(n).fill(v).join(' + ');
    const found = add(q.small, q.parts) + ' = ' + q.side + ', значи малката страна е <b>' + q.small + '</b>';
    if(q.shape === 0) return found + ' &nbsp;→&nbsp; ' + add(q.small, 4) + ' = ' + q.ans;
    if(q.shape === 1) return add(q.side, 4) + ' = ' + q.ans;
    return found + ', обиколката ѝ е <b>' + (4*q.small) + '</b> &nbsp;→&nbsp; ' + add(4*q.small, q.parts*q.parts) + ' = ' + q.ans;
  }
}
KIND.sqcut = { draw:drawSqcut, eq:eqSqcut, why:whySqcut };
