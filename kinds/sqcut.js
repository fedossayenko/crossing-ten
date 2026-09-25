// Question kind 'sqcut': level 21 Обиколка — Squares, sheets and triangles — sides and perimeters.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

const BGNUM_M = {2:'два', 3:'три', 4:'четири'};   // masculine nouns take два, not две

const BGCOUNT = {4:'четири', 9:'девет'};
const sqcutQuads = n => n + (n < 5 ? ' квадрати' : ' квадратів');   // 4 квадрати, 9 квадратів

// Задача 15: a square cut into equal squares. The small side is never divided out —
// it is found by asking what adds up to the big side.
function cutRectSvg(a, extra){
  const W = 160, u = W / (a + extra), H = a * u;
  return '<div class="fig"><svg viewBox="-4 -4 ' + (W + 8) + ' ' + (H + 8) + '" role="img" aria-label="' + tr('лист, разрязан на квадрат и правоъгълник', 'аркуш, розрізаний на квадрат і прямокутник') + '">' +
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
  if(Math.min(t.w, t.h) > 1 && Math.random() < 0.3){
    // Зима 2023: the other way round — the rectangle's shorter side is given, the small squares' side asked
    const s2 = 1 + rnd(5), short = Math.min(t.w, t.h)*s2;
    return {kind:'sqcut', shape:5, rev:1, t, s: s2, n: t.sq.length, few: t.sq.filter(r => r[2] === least).length, short, ans: least*s2};
  }
  return {kind:'sqcut', shape:5, t, s, n: t.sq.length,
          few: t.sq.filter(r => r[2] === least).length, side: least * s, ans: 2*(t.w + t.h)*s};
}
// Задача 12: two perimeters told in different units, so the square has to be brought
// to centimetres before the comparison means anything.
function genTriSq(){
  if(Math.random() < 0.3){
    // Зима 2023: a square with its side in милиметри against an equilateral triangle in сантиметри,
    // and the difference of the perimeters in сантиметри — which can well be 0 (15 мм and 2 см)
    for(;;){
      const mm = 5*(2 + rnd(7)), t = 1 + rnd(4), P = 4*mm/10, p = 3*t;
      if(P % 1 || (P !== p && Math.random() < 0.3)) continue;
      return {kind:'sqcut', shape:4, mm, t, P, p, ans: Math.abs(P - p)};
    }
  }
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
    '" role="img" aria-label="' + tr('правоъгълник, съставен от квадрати', 'прямокутник, складений із квадратів') + '">' +
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
    '" role="img" aria-label="' + tr('триъгълник и квадрат', 'трикутник і квадрат') + '">' +
    '<g stroke="var(--ink)" stroke-width="2.2" fill="none" stroke-linejoin="round">' +
    '<path d="M0 ' + H.toFixed(1) + 'L' + (L*u).toFixed(1) + ' ' + H.toFixed(1) + 'L' + (ax*u).toFixed(1) +
      ' ' + (H - ay*u).toFixed(1) + 'Z"/>' +
    '<rect x="' + sx.toFixed(1) + '" y="' + (H - S*u).toFixed(1) + '" width="' + (S*u).toFixed(1) +
      '" height="' + (S*u).toFixed(1) + '"/></g>' +
    t(L*u/2, H + 15, L + ' см') +
    t(ax*u/2 - 9, H - ay*u/2, r + ' см') +
    t((ax + L)*u/2 + 9, H - ay*u/2, p + ' см') +
    t(sx + S*u/2, H + 15, q.sqLabel || q.dm + (q.inCm ? ' см' : ' дм')) + '</svg></div>';
}
function genSqCut(){
  if(Math.random() < 0.2){
    // Задача 15: strips, and the answer wanted in милиметри — ten to the centimetre.
    const k = 2 + rnd(3);                      // 2, 3 or 4 strips
    const w = 1 + rnd(3), side = k*w;
    const mm = Math.random() < 0.6;
    if(k === 2 && Math.random() < 0.4){
      // Зима 2020: a square of perimeter 8 cut in two — the two perimeters add to the square's
      // plus the cut counted twice: 8 + 2 + 2 = 12, wherever the cut goes
      const s2 = 2 + rnd(8);
      return {kind:'sqcut', shape:6, both:1, k:2, side: s2, P: 4*s2, ans: 4*s2 + 2*s2};
    }
    const P = 2*(w + side), u = mm ? 10 : 1;
    // Есен 2020: four equal pieces can also be four squares, and a square is a rectangle —
    // the key takes both (100 или 80), so here both are asked for, and no picture picks one
    if(k === 4) return {kind:'sqcut', shape:6, k, w, side, mm, slots:2, ans: u*P, alt:[u*2*side]};
    return {kind:'sqcut', shape:6, k, w, side, mm, ans: u*P};
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
    '" role="img" aria-label="' + (k === 1 ? tr('квадрат', 'квадрат') : tr('квадрат, разрязан на еднакви ивици', 'квадрат, розрізаний на однакові смужки')) + '">' +
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
  return '<div class="fig"><svg viewBox="-8 -24 ' + (S+16) + ' ' + (S+32) + '" role="img" aria-label="' + tr('квадрат, разрязан на еднакви квадрати', 'квадрат, розрізаний на однакові квадрати') + '">' +
    '<g stroke="var(--ink)" stroke-width="1.9" fill="none">' + g + '</g>' +
    '<text x="' + S/2 + '" y="-9" text-anchor="middle" font-size="15" font-weight="700" ' +
    'fill="var(--muted)" font-family="Nunito, sans-serif">' + side + ' см</text></svg></div>';
}

function drawSqcut(q){
  if(q.kind === 'sqcut' && q.shape === 6 && q.both){
    return '<div class="ask">' + tr('Квадрат с обиколка <span class="num">' + q.P + '</span> см е разрязан на два правоъгълника. Колко сантиметра е <b>сборът от обиколките</b> на двата правоъгълника?',
      'Квадрат із периметром <span class="num">' + q.P + '</span> см розрізали на два прямокутники. Скільки сантиметрів становить <b>сума периметрів</b> обох прямокутників?') + '</div>' +
      stripSvg(1, q.side) + '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT + CM + '</div>';
  }
  if(q.kind === 'sqcut' && q.shape === 6){
    return '<div class="ask">' + tr('Квадрат със страна <span class="num">' + q.side +
      '</span> см е разрязан на <span class="num">' + BGNUM_M[q.k] +
      '</span> еднакви правоъгълника. Колко <b>' + (q.mm ? 'милиметра' : 'сантиметра') +
      '</b> е обиколката на всеки един от тези правоъгълници?',
      'Квадрат зі стороною <span class="num">' + q.side +
      '</span> см розрізали на <span class="num">' + UKNUM[q.k] +
      '</span> однакові прямокутники. Скільки <b>' + (q.mm ? 'міліметрів' : 'сантиметрів') +
      '</b> становить периметр кожного з цих прямокутників?') + '</div>' +
      stripSvg(q.slots ? 1 : q.k, q.side) +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT +
      (q.slots ? ' <span class="or">' + tr('или', 'або') + '</span> <span class="slot" id="slot1"></span>' : '') +
      ' <span class="unit">' + (q.mm ? 'мм' : 'см') + '</span></div>';
  }
  if(q.kind === 'sqcut' && q.shape === 5 && q.rev){
    const sizes = [...new Set(q.t.sq.map(r => r[2]))], twoAndTwo = q.n === 4 && q.few === 2 && sizes.length === 3;   // the paper's own figure
    return '<div class="ask">' + (twoAndTwo
      ? tr('Правоъгълникът на чертежа е съставен от <b>два еднакви и два различни</b> квадрата. По-малката страна на този правоъгълник е <span class="num">' + q.short + '</span> см. Колко сантиметра е страната на <b>еднаквите</b> квадрати?',
           'Прямокутник на рисунку складено з <b>двох однакових і двох різних</b> квадратів. Менша сторона цього прямокутника — <span class="num">' + q.short + '</span> см. Скільки сантиметрів становить сторона <b>однакових</b> квадратів?')
      : tr('Правоъгълникът на чертежа е съставен от <span class="num">' + q.n + '</span> квадрата. По-малката му страна е <span class="num">' + q.short + '</span> см. Колко сантиметра е страната на <b>най-малките</b> квадрати?',
           'Прямокутник на рисунку складено з <span class="num">' + q.n + '</span> квадратів. Його менша сторона — <span class="num">' + q.short + '</span> см. Скільки сантиметрів становить сторона <b>найменших</b> квадратів?')) + '</div>' +
      tilesSvg(q.t) +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT + CM + '</div>';
  }
  if(q.kind === 'sqcut' && q.shape === 5){
    const many = {2:'два', 3:'три', 4:'четири'}[q.few];
    const which = q.few === q.n ? 'всички квадрати имат' : many + ' от квадратите имат';
    return '<div class="ask">' + tr('Колко сантиметра е обиколката на правоъгълника, който е съставен от <span class="num">' +
      q.n + '</span> квадрата, ако ' + which + ' страна <span class="num">' + q.side + '</span> см?',
      'Скільки сантиметрів становить периметр прямокутника, складеного з <span class="num">' +
      q.n + '</span> квадратів, якщо ' + (q.few === q.n ? 'всі квадрати мають' : UKNUM[q.few] + ' з них мають') +
      ' сторону <span class="num">' + q.side + '</span> см?') + '</div>' +
      tilesSvg(q.t) +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT + CM + '</div>';
  }
  if(q.kind === 'sqcut' && q.shape === 4 && q.mm){
    return '<div class="ask">' + tr('Квадрат има дължина на страната <span class="num">' + q.mm + '</span> милиметра, а страната на равностранен триъгълник е <span class="num">' + q.t + '</span> см. Колко сантиметра е <b>разликата</b> на обиколките им?',
      'Сторона квадрата — <span class="num">' + q.mm + '</span> міліметрів, а сторона рівностороннього трикутника — <span class="num">' + q.t + '</span> см. Скільки сантиметрів становить <b>різниця</b> їхніх периметрів?') + '</div>' +
      triSqSvg({ sides:[q.t, q.t, q.t], inCm:true, dm: q.mm/10, sqLabel: q.mm + ' мм' }) +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + SLOT + CM + '</div>';
  }
  if(q.kind === 'sqcut' && q.shape === 4){
    return '<div class="ask">' + tr('Триъгълник има страни', 'Трикутник має сторони') + ' <span class="num">' +
      q.sides.join('</span> см, <span class="num">') +
      '</span> см. ' + tr('Квадрат има страна', 'Квадрат має сторону') + ' <span class="num">' + q.dm +
      '</span> ' + (q.inCm ? 'см' : 'дм') +
      tr('. С колко сантиметра обиколката на <b>квадрата</b> е по-голяма от обиколката на <b>триъгълника</b>?',
         '. На скільки сантиметрів периметр <b>квадрата</b> більший за периметр <b>трикутника</b>?') + '</div>' +
      triSqSvg(q) +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + SLOT + CM + '</div>';
  }
  if(q.kind === 'sqcut' && q.shape === 3){
    return '<div class="ask">' + tr('Разрязах правоъгълен лист с обиколка <span class="num">' + q.P +
      '</span> см на квадрат <b>A</b> със страна <span class="num">' + q.a +
      '</span> см и правоъгълник <b>B</b>. Колко сантиметра е ' +
      (q.asksSide ? '<b>по-малката страна</b> на правоъгълник B' : '<b>обиколката</b> на правоъгълник B') + '?',
      'Прямокутний аркуш із периметром <span class="num">' + q.P +
      '</span> см розрізали на квадрат <b>A</b> зі стороною <span class="num">' + q.a +
      '</span> см і прямокутник <b>B</b>. Скільки сантиметрів становить ' +
      (q.asksSide ? '<b>менша сторона</b> прямокутника B' : '<b>периметр</b> прямокутника B') + '?') + '</div>' +
      cutRectSvg(q.a, q.extra) +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT + CM + '</div>';
  }
  if(q.kind === 'sqcut'){
    const ask = q.shape === 0 ? tr('Колко сантиметра е сборът от страните на всеки един от тези еднакви квадрати?',
                                   'Скільки сантиметрів становить сума сторін кожного з цих однакових квадратів?')
              : q.shape === 1 ? tr('Колко сантиметра е обиколката на големия квадрат?',
                                   'Скільки сантиметрів становить периметр великого квадрата?')
              : tr('Колко сантиметра е сборът от обиколките на всички малки квадрати?',
                   'Скільки сантиметрів становить сума периметрів усіх малих квадратів?');
    return '<div class="ask">' + tr('Квадрат със страна <span class="num">' + q.side + '</span> см е разрязан на ' +
      BGCOUNT[q.parts*q.parts] + ' еднакви квадрата. ',
      'Квадрат зі стороною <span class="num">' + q.side + '</span> см розрізали на ' +
      (q.parts === 2 ? 'чотири однакові квадрати. ' : 'дев’ять однакових квадратів. ')) + ask + '</div>' +
      sqSvg(q.parts, q.side) +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT + CM + '</div>';
  }
}
function eqSqcut(q){
  if(q.kind === 'sqcut' && q.shape === 6 && q.both) return q.P + ' + ' + q.side + ' + ' + q.side + ' = ' + q.ans;
  if(q.kind === 'sqcut' && q.shape === 6) return 'квадрат ' + q.side + tr(', на ' + q.k + ' ивици → ', ', на ' + q.k + ' смужки → ') +
    q.w + '×' + q.side + ' → ' + q.ans + (q.slots ? tr(' или 4 квадрата → ', ' або 4 квадрати → ') + q.alt[0] : '');
  if(q.kind === 'sqcut' && q.shape === 5 && q.rev) return tr('по-малката страна ', 'менша сторона ') + q.short + ' = ' + Math.min(q.t.w, q.t.h) + ' · ' + q.ans + ' → ' + q.ans;
  if(q.kind === 'sqcut' && q.shape === 5) return tr(q.n + ' квадрата, страна ' + q.side + ' → правоъгълник ',
    q.n + ' квадрати, сторона ' + q.side + ' → прямокутник ') + (q.t.w*q.s) + '×' + (q.t.h*q.s) + ' → ' + q.ans;
  if(q.kind === 'sqcut' && q.shape === 4 && q.mm) return 'квадрат ' + q.mm + ' мм → ' + q.P + tr(' см, триъгълник ', ' см, трикутник ') + '3 · ' + q.t + ' = ' + q.p + ' → ' + q.ans;
  if(q.kind === 'sqcut' && q.shape === 4) return 'квадрат ' + q.dm + (q.inCm ? ' см → ' : ' дм → ') + q.P + tr(', триъгълник ', ', трикутник ') +
    q.sides.join('+') + ' = ' + q.p + ' → ' + q.ans;
  if(q.kind === 'sqcut') return q.shape === 3
    ? tr('лист с обиколка ', 'аркуш із периметром ') + q.P + ', квадрат ' + q.a + ' → ' + q.ans
    : tr('страна ' + q.side + ', на ' + (q.parts*q.parts) + ' квадрата → ', 'сторона ' + q.side + ', на ' + sqcutQuads(q.parts*q.parts) + ' → ') + q.ans;
}
function whySqcut(q, full){
  if(q.kind === 'sqcut' && q.shape === 6 && q.both){
    if(!full) return tr('Двете парчета имат всичко от обиколката на квадрата — и още нещо. Какво?', 'Дві частини мають увесь периметр квадрата — і ще дещо. Що?');
    return tr('страната е ', 'сторона ') + q.P + ' : 4 = <b>' + q.side + '</b> &nbsp;→&nbsp; ' + tr('разрезът е страна и на двете парчета', 'розріз — сторона обох частин') + ' &nbsp;→&nbsp; ' + q.P + ' + ' + q.side + ' + ' + q.side + ' = ' + q.ans;
  }
  if(q.kind === 'sqcut' && q.shape === 6){
    if(!full && q.slots) return tr('Четири еднакви части: четири ивици — или четири квадрата, а и квадратът е правоъгълник.',
      'Чотири однакові частини: чотири смужки — або чотири квадрати, адже квадрат теж прямокутник.');
    if(!full) return tr('Едната страна на ивицата е цялата страна на квадрата, другата е част от нея.',
      'Одна сторона смужки — це вся сторона квадрата, а друга — її частина.');
    const P = 2*(q.w + q.side);
    return tr('всяка ивица е', 'кожна смужка —') + ' <b>' + q.w + '</b> на <b>' + q.side + '</b> см &nbsp;→&nbsp; ' + q.w + ' + ' +
      q.side + ' = ' + (q.w + q.side) + tr(', два пъти', ', двічі') + ' &nbsp;→&nbsp; <b>' + P + ' см</b>' +
      (q.mm ? ' &nbsp;→&nbsp; 1 см = 10 мм, ' + tr('значи', 'отже,') + ' ' + q.ans + ' мм' : '') +
      (q.slots ? '; ' + tr('или четири квадрата със страна ', 'або чотири квадрати зі стороною ') + q.side/2 + ' см &nbsp;→&nbsp; ' + q.side/2 + ' · 4 = <b>' + 2*q.side + ' см</b>' +
        (q.mm ? ' = ' + q.alt[0] + ' мм' : '') : '');
  }
  if(q.kind === 'sqcut' && q.shape === 5 && q.rev){
    if(!full) return tr('Колко от най-малките страни се нареждат по късата страна на правоъгълника?', 'Скільки найменших сторін уміщається вздовж короткої сторони прямокутника?');
    const m = Math.min(q.t.w, q.t.h);
    return tr('по късата страна се нареждат ', 'уздовж короткої сторони вміщається ') + m + tr(' от най-малките страни &nbsp;→&nbsp; ', ' найменших сторін &nbsp;→&nbsp; ') + q.short + ' : ' + m + ' = ' + q.ans;
  }
  if(q.kind === 'sqcut' && q.shape === 5){
    if(!full) return tr('Най-малкото квадратче дава мярката — с нея измери целия правоъгълник.',
      'Найменший квадратик дає мірку — нею виміряй увесь прямокутник.');
    return tr('страната на най-малкото е ' + q.side + ' &nbsp;→&nbsp; правоъгълникът е <b>',
      'сторона найменшого — ' + q.side + ' &nbsp;→&nbsp; прямокутник — <b>') + (q.t.w*q.s) +
      '</b> на <b>' + (q.t.h*q.s) + '</b> &nbsp;→&nbsp; ' + (q.t.w*q.s) + ' + ' + (q.t.h*q.s) + ' = ' +
      ((q.t.w + q.t.h)*q.s) + tr(', два пъти', ', двічі') + ' &nbsp;→&nbsp; ' + q.ans;
  }
  if(q.kind === 'sqcut' && q.shape === 4 && q.mm){
    if(!full) return tr('Равностранният има три равни страни. И двете обиколки — в сантиметри.', 'У рівностороннього три рівні сторони. І обидва периметри — у сантиметрах.');
    return '4 · ' + q.mm + ' = ' + 4*q.mm + ' мм = <b>' + q.P + ' см</b>, 3 · ' + q.t + ' = <b>' + q.p + ' см</b> &nbsp;→&nbsp; ' + Math.max(q.P, q.p) + ' − ' + Math.min(q.P, q.p) + ' = ' + q.ans;
  }
  if(q.kind === 'sqcut' && q.shape === 4){
    if(!full) return q.inCm ? tr('Пресметни поотделно двете обиколки.', 'Обчисли окремо обидва периметри.')
                            : tr('Двете обиколки са в различни мерки — изравни ги първо.',
                                 'Периметри дано в різних одиницях — спершу переведи їх в однакові.');
    const side = q.inCm ? q.dm : 10*q.dm;
    return (q.inCm ? '' : q.dm + ' дм = <b>' + side + '</b> см &nbsp;→&nbsp; ') +
      tr('квадратът е 4 × ', 'периметр квадрата 4 × ') + side + ' = <b>' + q.P +
      tr('</b>, триъгълникът е ', '</b>, трикутника ') + q.sides.join(' + ') + ' = <b>' + q.p + '</b> &nbsp;→&nbsp; ' +
      q.P + ' − ' + q.p + ' = ' + q.ans;
  }
  if(q.kind === 'sqcut' && q.shape === 3){
    if(!full) return tr('Половината обиколка са двете различни страни, взети по веднъж.',
      'Половина периметра — це дві різні сторони, узяті по одному разу.');
    const half = q.P / 2, wide = half - q.a;
    return tr('половината обиколка е ' + q.P + ' : 2 = <b>' + half + '</b>, а височината е ' + q.a +
      ' &nbsp;→&nbsp; дължината е ' + half + ' − ' + q.a + ' = <b>' + wide + '</b>' +
      ' &nbsp;→&nbsp; B е ' + q.extra + ' на ' + q.a,
      'половина периметра: ' + q.P + ' : 2 = <b>' + half + '</b>, а висота ' + q.a +
      ' &nbsp;→&nbsp; довжина ' + half + ' − ' + q.a + ' = <b>' + wide + '</b>' +
      ' &nbsp;→&nbsp; B — ' + q.extra + ' на ' + q.a) +
      (q.asksSide ? tr(', по-малката страна е ', ', менша сторона — ') + q.ans
                  : tr(', обиколката ѝ е ', ', його периметр ') + q.extra + ' + ' + q.a + ' + ' + q.extra + ' + ' + q.a + ' = ' + q.ans);
  }
  if(q.kind === 'sqcut'){
    if(!full) return q.shape === 1 ? tr('Обиколката е сборът от четирите страни.', 'Периметр — це сума чотирьох сторін.')
                                   : tr('Колко прави малката страна?', 'Скільки становить сторона малого квадрата?');
    const add = (v, n) => Array(n).fill(v).join(' + ');
    const found = add(q.small, q.parts) + ' = ' + q.side + tr(', значи малката страна е <b>', ', отже, сторона малого квадрата — <b>') + q.small + '</b>';
    if(q.shape === 0) return found + ' &nbsp;→&nbsp; ' + add(q.small, 4) + ' = ' + q.ans;
    if(q.shape === 1) return add(q.side, 4) + ' = ' + q.ans;
    return found + tr(', обиколката ѝ е <b>', ', його периметр <b>') + (4*q.small) + '</b> &nbsp;→&nbsp; ' + add(4*q.small, q.parts*q.parts) + ' = ' + q.ans;
  }
}
KIND.sqcut = { draw:drawSqcut, eq:eqSqcut, why:whySqcut };
