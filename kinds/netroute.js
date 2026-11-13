// Question kind 'netroute': level 356 Най-късият път — Villages joined by roads with the kilometres written on them: the shortest way between two of them.

// Кенгуру 2023, 2 клас, задача 26: seven villages, twelve roads with their kilometres; the shortest way from O to L is 29 km (O–M–G–A–L, 4 + 8 + 9 + 8),
// not the way along the fewest roads. The road map keeps the paper's shape, a road or two now and then missing, the kilometres drawn at random
// (3–15) and the villages named by other letters; the two to join are far apart, and the way with the fewest roads is never the shortest. The answer is typed.
import { KIND, answerLine, popAt, rnd, shuffle, svgFrame, svgText, textW, tr } from '../js/core.js';
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
  return '<div class="ask">' + tr('На схемата са показани разстоянията в километри между няколко селища в планинска местност. Колко километра е най-късото разстояние между ' + q.names[q.a] + ' и ' + q.names[q.b] + '?',
    'На схемі показано відстані в кілометрах між кількома селами в гірській місцевості. Скільки кілометрів становить найкоротша відстань між ' + q.names[q.a] + ' і ' + q.names[q.b] + '?') + '</div>' +
    '<div class="fig maze">' + net(q, false) + '</div>' + answerLine('xl');
}
function sumLine(q){
  const [km, way] = netShortest(q.roads, q.a, q.b), kmOf = (x, y) => q.roads.find(([a, b]) => a === x && b === y || a === y && b === x)[2];
  return way.map(i => q.names[i]).join(' → ') + ': ' + way.slice(1).map((p, i) => kmOf(way[i], p)).join(' + ') + ' = ' + km;
}
function whyNetRoute(q, full){
  if(!full) return tr('Опитай различни пътища от едното селище до другото и за всеки сметни колко километра е. Пътят с най-малко отсечки не винаги е най-късият.',
    'Спробуй різні шляхи від одного села до іншого й для кожного порахуй, скільки це кілометрів. Шлях із найменшою кількістю доріг не завжди найкоротший.');
  return tr('най-късият път е оцветен: ', 'найкоротший шлях зафарбовано: ') + net(q, true) + '<div><b>' + sumLine(q) + '</b></div>';
}
KIND.netroute = { draw:drawNetRoute, eq:sumLine, why:whyNetRoute };
