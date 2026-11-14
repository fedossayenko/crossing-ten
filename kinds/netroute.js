// Question kind 'netroute': level 356 Най-късият път — Villages joined by roads with the kilometres written on them: the shortest way between two of them.

// Кенгуру 2023, 2 клас, задача 26: seven villages, twelve roads with their kilometres; the shortest way from O to L is 29 km (O–M–G–A–L, 4 + 8 + 9 + 8),
// not the way along the fewest roads. The road map keeps the paper's shape, a road or two now and then missing, the kilometres drawn at random
// (3–15) and the villages named by other letters; the two to join are far apart, and the way with the fewest roads is never the shortest. The answer is typed.
import { KIND, SLOT, answerLine, popAt, rnd, shuffle, svgFrame, svgText, textW, tr } from '../js/core.js';
// where the seven places are on the map, and the twelve roads between them (as printed)
const POS = [[18, 92], [118, 102], [194, 14], [226, 102], [304, 44], [304, 134], [204, 182]];   // O G A B L N M
export const NET_ROADS = [[0, 1], [0, 6], [1, 2], [1, 3], [1, 6], [2, 3], [2, 4], [2, 5], [3, 6], [3, 5], [4, 5], [6, 5]];
const LETTERS = 'ABCDEFGHKLMNOPRSTUVZ';
// the shortest km from a to b over roads [[from, to, km]]: Dijkstra, with the way as places
/** @returns {[number, number[]]} */
export function netShortest(roads, a, b){
  const d = {[a]: 0}, from = {}, done = new Set();
  for(;;){
    let at = -1;
    for(const k in d) if(!done.has(+k) && (at < 0 || d[k] < d[at])) at = +k;
    if(at < 0 || at === b) break;
    done.add(at);
    roads.forEach(([x, y, w]) => { const to = x === at ? y : y === at ? x : -1; if(to >= 0 && (!(to in d) || d[at] + w < d[to])) d[to] = d[at] + w, from[to] = at; });
  }
  const way = [b]; while(way[0] !== a) way.unshift(from[way[0]]);
  return [d[b], way];
}
// the cheapest of the ways with the fewest roads
function fewestRoads(roads, a, b){
  let level = [[a, 0, [a]]], best = null;
  const seen = new Set([a]);
  while(level.length && !best){
    const next = [];
    for(const [at, km, way] of level) roads.forEach(([x, y, w]) => { const to = x === at ? y : y === at ? x : -1;
      if(to < 0) return;
      if(to === b) best = best === null ? km + w : Math.min(best, km + w); else if(!way.includes(to)) next.push([to, km + w, way.concat(to)]); });
    level = next;
    level.forEach(l => seen.add(l[0]));
  }
  return best;
}
export function genNetRoute(){
  for(;;){
    const names = shuffle(LETTERS.split('')).slice(0, 7), drop = shuffle(NET_ROADS.map((_, i) => i)).slice(0, rnd(3));
    const roads = NET_ROADS.map(([a, b], i) => [a, b, 3 + rnd(13)]).filter((_, i) => !drop.includes(i));
    const a = rnd(7), b = rnd(7);
    if(a === b) continue;
    const reach = new Set([a]); for(let k = 0; k < 7; k++) roads.forEach(([x, y]) => { if(reach.has(x) || reach.has(y)) reach.add(x), reach.add(y); });
    if(reach.size < 7) continue;
    const [km, way] = netShortest(roads, a, b), few = fewestRoads(roads, a, b);
    if(way.length < 4 || few === km) continue;   // at least three roads, and a trap in the fewest-roads way
    return {kind:'netroute', names, roads, a, b, traps:[few], ans: km};
  }
}
function net(q, full){
  const way = full ? netShortest(q.roads, q.a, q.b)[1] : [], on = (x, y) => way.some((p, i) => i && (way[i - 1] === x && p === y || way[i - 1] === y && p === x));
  let s = '', lab = '';
  q.roads.forEach(([x, y, w]) => {
    const [x1, y1] = POS[x], [x2, y2] = POS[y], hot = on(x, y), mx = (x1 + x2) / 2, my = (y1 + y2) / 2, bw = textW(w, 13) + 8;
    s += '<line' + (hot ? popAt(1 + way.findIndex((p, i) => i && (way[i - 1] === x && p === y || way[i - 1] === y && p === x))) : '') + ' x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (hot ? 'var(--warm)' : 'var(--ink)') + '" stroke-width="' + (hot ? 5 : 2) + '" stroke-linecap="round"/>';
    lab += '<rect x="' + (mx - bw / 2).toFixed(1) + '" y="' + (my - 9).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="17" rx="4" fill="var(--solid)"/>' + svgText(mx.toFixed(1), (my + 5).toFixed(1), w, 13, hot ? 'var(--warmink)' : 'var(--muted)');
  });
  s += lab;
  const HALO = ' paint-order="stroke" stroke="var(--solid)" stroke-width="4" stroke-linejoin="round"';   // a name stays legible where a road runs under it
  const SPOT = [[-16, 5], [-11, -10], [0, -10], [11, -10], [17, 5], [17, 5], [0, 22]];   // where each name sits beside its village
  q.names.forEach((n, i) => {
    const [x, y] = POS[i], isEnd = i === q.a || i === q.b;
    s += '<circle cx="' + x + '" cy="' + y + '" r="' + (isEnd ? 7 : 5) + '" fill="' + (isEnd ? 'var(--accent)' : 'var(--ink)') + '"/>' + svgText(x + SPOT[i][0], y + SPOT[i][1], n, 16, isEnd ? 'var(--accent-ink)' : 'var(--ink)', HALO);
  });
  return svgFrame('-14 -12 346 218', 346, tr('схема на селища и пътища с километри', 'схема сіл і доріг із кілометрами')) + s + '</svg>';
}
function drawNetRoute(q){
  if(q.shape === 'hare') return drawHare(q);
  return '<div class="ask">' + tr('На схемата са показани разстоянията в километри между няколко селища в планинска местност. Колко километра е най-късото разстояние между ' + q.names[q.a] + ' и ' + q.names[q.b] + '?',
    'На схемі показано відстані в кілометрах між кількома селами в гірській місцевості. Скільки кілометрів становить найкоротша відстань між ' + q.names[q.a] + ' і ' + q.names[q.b] + '?') + '</div>' +
    '<div class="fig maze">' + net(q, false) + '</div>' + answerLine('xl');
}
function sumLine(q){
  if(q.shape === 'hare') return eqHare(q);
  const [km, way] = netShortest(q.roads, q.a, q.b), kmOf = (x, y) => q.roads.find(([a, b]) => a === x && b === y || a === y && b === x)[2];
  return way.map(i => q.names[i]).join(' → ') + ': ' + way.slice(1).map((p, i) => kmOf(way[i], p)).join(' + ') + ' = ' + km;
}
function whyNetRoute(q, full){
  if(q.shape === 'hare') return whyHare(q, full);
  if(!full) return tr('Опитай различни пътища от едното селище до другото и за всеки сметни колко километра е. Пътят с най-малко отсечки не винаги е най-късият.',
    'Спробуй різні шляхи від одного села до іншого й для кожного порахуй, скільки це кілометрів. Шлях із найменшою кількістю доріг не завжди найкоротший.');
  return tr('най-късият път е оцветен: ', 'найкоротший шлях зафарбовано: ') + net(q, true) + '<div><b>' + sumLine(q) + '</b></div>';
}
// Салабашев 2025, 2 клас, задача 4 (level 505): the hare at З wants the carrot at М, past the pine Б on the straight path (22 + 17 = 39 м) or round the corner at П past the
// stream (36 + 15 = 51 м): how much shorter is the first, 51 − 39 = 12. The paper's triangle is 15, 36, 39 (a right angle at П), so the generator takes a right triangle with
// whole sides (3-4-5, 5-12-13, 8-15-17 and the like, times 1, 2 or 3), puts Б on the long side, and draws it to scale.
const TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20], [15, 20, 25], [7, 24, 25], [12, 35, 37], [20, 21, 29]];
export function genHareRoutes(){
  for(;;){
    const t = TRIPLES[rnd(TRIPLES.length)], k = 1 + rnd(3);
    const d = t[0]*k, c = t[1]*k, hyp = t[2]*k;     // d = the upright leg П–М, c = the flat one З–П
    if(hyp > 60 || hyp < 15) continue;
    const a = 6 + rnd(hyp - 11), b = hyp - a;
    if(a === b || a < 5 || b < 5) continue;
    return {kind:'netroute', shape:'hare', a, b, c, d, ans: c + d - hyp};
  }
}
function hareSvg(q, full){
  const u = Math.min(230 / q.c, 130 / q.d), f = v => v.toFixed(1), X = v => 26 + v*u, Y = v => 22 + (q.d - v)*u;
  const hyp = q.a + q.b, pt = { z: [X(0), Y(0)], p: [X(q.c), Y(0)], m: [X(q.c), Y(q.d)], b: [X(q.c*q.a/hyp), Y(q.d*q.a/hyp)] };
  const seg = (A, B, t, col, w, step) => {
    const [x1, y1] = A, [x2, y2] = B, mx = (x1 + x2) / 2, my = (y1 + y2) / 2, bw = textW(t + ' м', 13) + 8;
    return '<line' + (step ? popAt(step) : '') + ' x1="' + f(x1) + '" y1="' + f(y1) + '" x2="' + f(x2) + '" y2="' + f(y2) + '" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round"/>' +
      '<rect x="' + f(mx - bw / 2) + '" y="' + f(my - 9) + '" width="' + f(bw) + '" height="17" rx="4" fill="var(--solid)"/>' + svgText(f(mx), f(my + 5), t + ' м', 13, 'var(--muted)');
  };
  const col1 = full ? 'var(--warm)' : 'var(--ink)', col2 = full ? 'var(--accent)' : 'var(--ink)', w = full ? 5 : 2.5;
  const HALO = ' paint-order="stroke" stroke="var(--solid)" stroke-width="4" stroke-linejoin="round"';
  let s = seg(pt.z, pt.b, q.a, col1, w, full && 1) + seg(pt.b, pt.m, q.b, col1, w, full && 2) + seg(pt.z, pt.p, q.c, col2, w, full && 3) + seg(pt.p, pt.m, q.d, col2, w, full && 4);
  [{ n:'З', p:pt.z, o:[-14, 18] }, { n:'Б', p:pt.b, o:[-14, -6] }, { n:'П', p:pt.p, o:[14, 18] }, { n:'М', p:pt.m, o:[14, -8] }].forEach(({ n, p, o }) => {
    s += '<circle cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="5" fill="var(--ink)"/>' + svgText(f(p[0] + o[0]), f(p[1] + o[1]), n, 16, 'var(--ink)', HALO);
  });
  return svgFrame('0 0 ' + f(X(q.c) + 34) + ' ' + f(Y(0) + 30), Math.round((X(q.c) + 34)*1.2), tr('триъгълна поляна с два пътя от З до М', 'трикутна галявина з двома шляхами від З до М')) + s + '</svg>';
}
function drawHare(q){
  return '<div class="ask">' + tr('Зайко е в точка <b>З</b> на чертежа и иска да стигне до моркова <b>М</b>. Той може да мине по пряка пътека край борчето <b>Б</b>, а може и да завие покрай поточето <b>П</b>. Разстоянията са посочени на чертежа. С колко метра по-малко ще измине Зайко, ако мине край борчето, вместо край поточето?',
    'Зайчик у точці <b>З</b> на рисунку й хоче дістатися моркви <b>М</b>. Він може піти прямою стежкою повз бір <b>Б</b>, а може завернути повз струмок <b>П</b>. Відстані позначено на рисунку. На скільки метрів менше пройде Зайчик, якщо піде повз бір, а не повз струмок?') + '</div>' +
    '<div class="fig maze">' + hareSvg(q, false) + '</div><div class="line md">' + SLOT + ' <span class="unit">м</span></div>';
}
const eqHare = q => q.c + ' + ' + q.d + ' = ' + (q.c + q.d) + ', ' + q.a + ' + ' + q.b + ' = ' + (q.a + q.b) + ', ' + (q.c + q.d) + ' − ' + (q.a + q.b) + ' = ' + q.ans;
function whyHare(q, full){
  if(!full) return tr('Събери разстоянията по единия път и по другия. Кой е по-кратък и с колко?', 'Додай відстані одним шляхом і другим. Який коротший і на скільки?');
  return tr('край борчето: ', 'повз бір: ') + q.a + ' + ' + q.b + ' = <b>' + (q.a + q.b) + '</b>, ' + tr('край поточето: ', 'повз струмок: ') + q.c + ' + ' + q.d + ' = <b>' + (q.c + q.d) + '</b>' + hareSvg(q, true) +
    (q.c + q.d) + ' − ' + (q.a + q.b) + ' = ' + q.ans;
}
KIND.netroute = { draw:drawNetRoute, eq:sumLine, why:whyNetRoute };
