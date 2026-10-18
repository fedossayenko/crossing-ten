// Question kind 'shared': level 22 Обща страна — Two figures share an edge — what it costs the outline.

// A square with a rectangle standing on it, corners named the way the question names them.
import { CM, KIND, SLOT, addUp, popAt, rnd, roomFor, svgText, tr } from '../js/core.js';
import { sqWalkSvg } from './sqcut.js';
function stackSvg(q){
  const u = 150 / (q.a + q.h), W = q.a * u, hh = q.h * u, aa = q.a * u;
  const lab = (x, y, txt) => '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) +
    '" text-anchor="middle" font-size="14" font-weight="700" fill="var(--muted)" font-family="Nunito, sans-serif">' +
    txt + '</text>';
  return '<div class="fig"><svg viewBox="-24 -22 ' + (W + 48).toFixed(1) + ' ' + (hh + aa + 44).toFixed(1) +
    '" role="img" aria-label="' + tr('квадрат с правоъгълник върху него', 'квадрат із прямокутником над ним') + '">' +
    '<g stroke="var(--ink)" stroke-width="2.2" fill="none" stroke-linejoin="round">' +
    '<rect x="0" y="0" width="' + W.toFixed(1) + '" height="' + (hh + aa).toFixed(1) + '"/>' +
    '<line x1="0" y1="' + hh.toFixed(1) + '" x2="' + W.toFixed(1) + '" y2="' + hh.toFixed(1) + '"/></g>' +
    lab(-12, 4, 'F') + lab(W + 12, 4, 'E') +
    lab(-12, hh + 5, 'D') + lab(W + 12, hh + 5, 'C') +
    lab(-12, hh + aa + 5, 'A') + lab(W + 12, hh + aa + 5, 'B') + '</svg></div>';
}
// Задача 14: a square with a rectangle sitting on it. The tall rectangle beats the wide
// one by the square's two upright sides — the height of the piece on top cancels out.
function genStack(){
  const a = 2 + rnd(9), h = 1 + rnd(9);
  return {kind:'shared', shape:2, a, h, d: 2*a, ans: 4*a};
}
export function genShared(){
  if(Math.random() < 0.3) return genStack();
  if(Math.random() < 0.4){
    // Задача 18: a triangle cut off a square along one whole side. The boundary loses
    // that side and gains the triangle's other two.
    const c = 3 + rnd(6);
    const p = 2*c + 1 + rnd(12);
    return {kind:'shared', shape:1, c, P: 4*c, p, ans: 4*c - c + (p - c)};
  }
  for(;;){
    const c = 2 + rnd(8);
    const P = 12 + rnd(18);
    const tot = P + 2*c;
    const p1 = Math.floor(tot/2) - rnd(4);
    const p2 = tot - p1;
    // each half must be a possible triangle: its other two sides together beat the cut
    if(p1 <= 2*c || p2 <= 2*c || p1 >= P + c || p2 >= P + c) continue;
    return {kind:'shared', shape:0, P, p1, p2, ans: c};
  }
}

function drawShared(q){
  if(q.shape === 2){
    return '<div class="ask">' + tr('Квадрат <b>ABCD</b> и правоъгълник <b>DCEF</b> имат обща страна <b>DC</b>. ' +
      'Обиколката на правоъгълника <b>ABEF</b> е по-голяма от обиколката на правоъгълника <b>DCEF</b> с <span class="num">' +
      q.d + '</span> см. Колко сантиметра е обиколката на <b>квадрата ABCD</b>?',
      'Квадрат <b>ABCD</b> і прямокутник <b>DCEF</b> мають спільну сторону <b>DC</b>. ' +
      'Периметр прямокутника <b>ABEF</b> більший за периметр прямокутника <b>DCEF</b> на <span class="num">' +
      q.d + '</span> см. Скільки сантиметрів становить периметр <b>квадрата ABCD</b>?') + '</div>' +
      stackSvg(q) +
      '<div class="line md">' + SLOT + CM + '</div>';
  }
  if(q.shape === 1){
    return '<div class="ask">' + tr('От квадрат с обиколка <span class="num">' + q.P +
      '</span> см е изрязан триъгълник с обиколка <span class="num">' + q.p +
      '</span> см, който има обща страна с квадрата. Колко см е обиколката на получената фигура?',
      'Від квадрата з периметром <span class="num">' + q.P +
      '</span> см відрізали трикутник з периметром <span class="num">' + q.p +
      '</span> см, який має спільну сторону з квадратом. Скільки см становить периметр фігури, що залишилася?') + '</div>' +
      '<div class="line lg">' + SLOT + CM + '</div>';
  }
  return '<div class="ask">' + tr('Триъгълник с обиколка <span class="num">' + q.P +
    '</span> см разрязали на два триъгълника с обиколки <span class="num">' + q.p1 +
    '</span> см и <span class="num">' + q.p2 + '</span> см. Колко сантиметра е общата им страна?',
    'Трикутник з периметром <span class="num">' + q.P +
    '</span> см розрізали на два трикутники з периметрами <span class="num">' + q.p1 +
    '</span> см і <span class="num">' + q.p2 + '</span> см. Скільки сантиметрів завдовжки їхня спільна сторона?') + '</div>' +
    '<div class="line lg">' + SLOT + CM + '</div>';
}
function eqShared(q){
  if(q.shape === 2) return tr('разлика ', 'різниця ') + q.d + tr(' → страна ', ' → сторона ') + q.a + ' → ' + q.ans;
  return q.shape === 1
    ? 'квадрат ' + q.P + tr(', триъгълник ', ', трикутник ') + q.p + ' → ' + q.ans
    : q.p1 + ' + ' + q.p2 + ' − ' + q.P + ' = ' + (2*q.ans) + ' → ' + q.ans;
}
// The stack, both outlines side by side, each traced around: DCEF's in blue; ABEF's has the same blue sides
// (EF, the two short uprights, and AB as long as DC) and the square's two uprights AD and BC on top, in orange —
// all that ABEF has more than DCEF.
function stackWhySvg(q){
  const u = 100 / (q.a + q.h), w = q.a * u, hh = q.h * u, H = (q.a + q.h) * u, gap = 80, B = 'var(--accent)', O = 'var(--warm)';
  const f = v => v.toFixed(1), line = (x1, y1, x2, y2, col, st) => '<line' + popAt(st) + ' x1="' + f(x1) + '" y1="' + f(y1) + '" x2="' + f(x2) + '" y2="' + f(y2) + '" stroke="' + col + '" stroke-width="4" stroke-linecap="round"/>';
  const fig = (x, name) => '<g stroke="var(--muted)" stroke-width="1.4" fill="none"><rect x="' + f(x) + '" y="0" width="' + f(w) + '" height="' + f(H) + '"/><line x1="' + f(x) + '" y1="' + f(hh) + '" x2="' + f(x + w) + '" y2="' + f(hh) + '"/></g>' +
    [['F', 0, 0], ['E', 1, 0], ['D', 0, hh], ['C', 1, hh], ['A', 0, H], ['B', 1, H]].map(([t, r, y]) => svgText(f(x + (r ? w + 9 : -9)), f(+y + 5), t, 11, 'var(--muted)')).join('') +
    svgText(f(x + w / 2), -12, name, 13, 'var(--ink)');
  const R = w + gap;
  let g = fig(0, 'DCEF') + fig(R, 'ABEF');
  // DCEF all round, then ABEF: the same four, AB standing in for DC
  g += '<path' + popAt(1) + ' d="M0,' + f(hh) + ' V0 H' + f(w) + ' V' + f(hh) + ' Z" fill="none" stroke="' + B + '" stroke-width="4" stroke-linejoin="round"/>';
  g += '<path' + popAt(2) + ' d="M' + f(R) + ',' + f(hh) + ' V0 H' + f(R + w) + ' V' + f(hh) + '" fill="none" stroke="' + B + '" stroke-width="4" stroke-linejoin="round"/>' +
    line(R, H, R + w, H, B, 2) + svgText(f(R + w / 2), f(H + 16), 'AB = DC', 11, B, popAt(2.5));
  // and what ABEF has more: the square's two uprights, together the difference
  g += line(R, hh, R, H, O, 3.5) + line(R + w, hh, R + w, H, O, 3.5) +
    '<g' + popAt(4.5) + '>' + svgText(f(R - 22), f(hh + (H - hh) / 2 + 5), q.a, 13, O) + svgText(f(R + w + 22), f(hh + (H - hh) / 2 + 5), q.a, 13, O) + '</g>';
  const foot = q.d + ' = ' + q.a + ' + ' + q.a + ', ' + addUp(4, q.a), [l, r] = roomFor(-32, R + w + 32, (R + w) / 2, foot, 15);
  g += svgText(f((R + w) / 2), f(H + 44), foot, 15, 'var(--ink)', popAt(5.5));
  return '<svg viewBox="' + f(l) + ' -30 ' + f(r - l) + ' ' + f(H + 84) + '" style="display:block; width:' + Math.round((r - l) * 1.25) + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('двете обиколки една до друга', 'обидва периметри поруч') + '">' + g + '</svg>';
}
// The pictures. A triangle cut in two: the halves pull apart and the cut lights up on both — it is
// in both perimeters, so the sum is the big one plus the cut twice. The stack: stackWhySvg. The notch:
// three sides of the square stay, the fourth goes, and the triangle's other two take its place.
function sharedSvg(q){
  if(q.shape === 2) return stackWhySvg(q);
  if(q.shape === 1){
    const c = q.c, k = c * 0.55;
    return sqWalkSvg(c, c, [[0, 0, c / 2, k], [c / 2, k, c, 0]], null, [[0, 0, 0, c, c], [0, c, c, c, c], [c, c, c, 0, c], [0, 0, c / 2, k, ''], [c / 2, k, c, 0, '']],
      q.P + ' − ' + c + ' + ' + (q.p - c) + ' = ' + q.ans);
  }
  // the two halves, apart, the cut on each
  const half = (dx, a, b, step) => '<g' + popAt(step) + '><path d="M' + (a[0] + dx) + ',' + a[1] + ' L' + (b[0] + dx) + ',' + b[1] + ' L' + (80 + dx) + ',0" fill="none" stroke="var(--accent)" stroke-width="2.4" stroke-linejoin="round"/>' +
    '<line x1="' + (80 + dx) + '" y1="0" x2="' + (90 + dx) + '" y2="90" stroke="var(--warm)" stroke-width="4" stroke-linecap="round"/></g>';
  const g = half(-14, [90, 90], [0, 90], 1) + half(14, [90, 90], [170, 90], 2) +
    svgText(30, 112, q.p1, 13, 'var(--accent)', popAt(1)) + svgText(150, 112, q.p2, 13, 'var(--accent)', popAt(2)) +
    svgText(85, 112, '?', 14, 'var(--warm)', popAt(3)) +
    svgText(90, 140, q.p1 + ' + ' + q.p2 + ' − ' + q.P + ' = ' + q.ans + ' + ' + q.ans, 15, 'var(--ink)', popAt(4));
  return '<svg viewBox="-30 -10 240 160" style="display:block; width:280px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + tr('двете части и общата им страна', 'дві частини і їхня спільна сторона') + '">' + g + '</svg>';
}
function whyShared(q, full){
  const text = whySharedText(q, full);
  return full && text ? text + sharedSvg(q) : text;
}
function whySharedText(q, full){
  if(q.kind === 'shared' && q.shape === 2){
    if(!full) return tr('Обиколи двата правоъгълника страна по страна. Кои страни има обиколката на ABEF, а на DCEF ги няма?',
      'Обійди обидва прямокутники сторона за стороною. Які сторони є в периметрі ABEF, а в периметрі DCEF їх немає?');
    return tr('обиколката на ABEF има всички страни на DCEF (AB е колкото DC) и още две — <b>AD</b> и <b>BC</b>',
      'периметр ABEF має всі сторони DCEF (AB така сама, як DC) і ще дві — <b>AD</b> і <b>BC</b>') +
      ' &nbsp;→&nbsp; AD + BC = ' + q.d + tr(', а AD е колкото BC', ', а AD така сама, як BC') + ': ' + q.d + ' = ' + q.a + ' + ' + q.a + ' &nbsp;→&nbsp; AD = <b>' +
      q.a + tr('</b> е страната на квадрата &nbsp;→&nbsp; ', '</b> — це сторона квадрата &nbsp;→&nbsp; ') + addUp(4, q.a);
  }
  if(q.kind === 'shared' && q.shape === 1){
    if(!full) return tr('Общата страна изчезва, а другите две се появяват.', 'Спільна сторона зникає, а дві інші з’являються.');
    return tr('страната на квадрата е <b>' + q.c + '</b> см &nbsp;→&nbsp; другите две страни на триъгълника са ',
      'сторона квадрата — <b>' + q.c + '</b> см &nbsp;→&nbsp; дві інші сторони трикутника разом — ') +
      q.p + ' − ' + q.c + ' = <b>' + (q.p - q.c) + '</b> &nbsp;→&nbsp; ' + q.P + ' − ' + q.c + ' + ' +
      (q.p - q.c) + ' = ' + q.ans;
  }
  if(q.kind === 'shared'){
    if(!full) return tr('Общата страна е в двете обиколки.', 'Спільна сторона входить в обидва периметри.');
    return q.p1 + ' + ' + q.p2 + ' = <b>' + (q.p1+q.p2) + tr('</b>, а обиколката е ', '</b>, а периметр — ') + q.P +
      ' &nbsp;→&nbsp; ' + (q.p1+q.p2) + ' − ' + q.P + ' = ' + (2*q.ans) +
      tr(', това е общата страна <b>два пъти</b> &nbsp;→&nbsp; ', ' — це спільна сторона, узята <b>двічі</b> &nbsp;→&nbsp; ') + q.ans;
  }
}
KIND.shared = { draw:drawShared, eq:eqShared, why:whyShared };
