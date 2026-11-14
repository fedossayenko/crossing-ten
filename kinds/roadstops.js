// Question kind 'roadstops': level 432 Спирания на кръстовищата — A road that crosses itself: the car stops at every crossing it drives through.

// Кенгуру 2023, 2 клас, задача 8: Stefan drives from X to Y along a winding road that crosses itself seven times (seven red dots) and stops at every crossing;
// the car goes through each crossing twice, once on each part of the road, so it stops 14 times (the paper's key E). The road here is a line on a grid of
// little squares (straight pieces, turns at corners only), kept only when it crosses itself in whole crossings (never along a stretch, never at a corner):
// the crossings are the grid points the road visits twice, found by driving it point by point. The answer is typed; the slip is the number of dots.
import { KIND, SVG_FONT, answerLine, rnd, svgFrame, tr, trN } from '../js/core.js';
const W = 8, H = 5, U = 34;
// drive the road from its first corner to its last, one grid step at a time: every point it is at, in order
/** @param {number[][]} road */
export function roadWalk(road){
  const out = [road[0].slice()];
  for(let i = 1; i < road.length; i++){
    const dx = Math.sign(road[i][0] - road[i - 1][0]), dy = Math.sign(road[i][1] - road[i - 1][1]);
    let [x, y] = road[i - 1];
    while(x !== road[i][0] || y !== road[i][1]){ x += dx; y += dy; out.push([x, y]); }
  }
  return out;
}
// the stops: every visit to a grid point the road passes through twice, in the order driven
export function roadStops(road){
  const walk = roadWalk(road), seen = {};
  walk.forEach(([x, y]) => { seen[x + ',' + y] = (seen[x + ',' + y] || 0) + 1; });
  return walk.filter(([x, y]) => seen[x + ',' + y] > 1);
}
// a road is clean when no grid step is driven twice, no point is visited three times, and a point visited twice is straight through both times
function clean(road){
  const walk = roadWalk(road), edge = new Set(), visit = {};
  for(let i = 0; i < walk.length; i++){
    const k = walk[i].join(',');
    visit[k] = (visit[k] || []).concat(i);
    if(i && edge.has(walk[i - 1].join() + '>' + k) || i && edge.has(k + '>' + walk[i - 1].join())) return false;
    if(i) edge.add(walk[i - 1].join() + '>' + k);
  }
  for(const k in visit){
    if(visit[k].length > 2) return false;
    if(visit[k].length === 2) for(const i of visit[k]){
      if(i === 0 || i === walk.length - 1) return false;
      const a = walk[i - 1], b = walk[i + 1];
      if(a[0] !== b[0] && a[1] !== b[1]) return false;   // a corner
    }
  }
  return true;
}
export function genRoadStops(){
  for(;;){
    const road = [[rnd(W + 1), rnd(H + 1)]];
    let horiz = rnd(2) === 0, ok = true;
    for(let s = 0, n = 9 + rnd(4); s < n && ok; s++, horiz = !horiz){
      const [x, y] = road[road.length - 1], len = 1 + rnd(5), dir = rnd(2) ? 1 : -1, to = horiz ? [x + dir * len, y] : [x, y + dir * len];
      if(to[0] < 0 || to[0] > W || to[1] < 0 || to[1] > H){ ok = false; break; }
      road.push(to);
    }
    if(!ok || !clean(road)) continue;
    const K = roadStops(road).length / 2;
    if(K < 4 || K > 7) continue;
    return {kind:'roadstops', road, K, traps:[K], ans: 2 * K};
  }
}
const at = (/** @type {number[]} */ p) => [26 + p[0] * U, 30 + p[1] * U];
function roadPic(q){
  const road = q.road, walk = roadWalk(road), seen = {};
  walk.forEach(([x, y]) => { seen[x + ',' + y] = (seen[x + ',' + y] || 0) + 1; });
  const dots = Object.keys(seen).filter(k => seen[k] > 1).map(k => k.split(',').map(Number));
  const HALO = ' paint-order="stroke" stroke="var(--solid)" stroke-width="4" stroke-linejoin="round"', [sx, sy] = at(road[0]), [ex, ey] = at(road[road.length - 1]);
  let s = '<polyline points="' + road.map(p => at(p).join(',')).join(' ') + '" fill="none" stroke="var(--accent)" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>';
  dots.forEach(d => { const [x, y] = at(d); s += '<circle cx="' + x + '" cy="' + y + '" r="6" fill="var(--bad)" stroke="var(--ink)" stroke-width="1.5"/>'; });
  s += '<circle cx="' + sx + '" cy="' + sy + '" r="6" fill="var(--ink)"/><circle cx="' + ex + '" cy="' + ey + '" r="6" fill="var(--ink)"/>';
  const lab = (x, y, t) => '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-size="17" font-weight="800" fill="var(--ink)" ' + SVG_FONT + HALO + '>' + t + '</text>\n';
  const off = ([x, y], p) => [x + (p[0] === 0 ? -14 : 14), y + (p[1] === 0 ? -9 : 17)];
  const [lx, ly] = off([sx, sy], road[0]), [mx, my] = off([ex, ey], road[road.length - 1]);
  s += lab(lx, ly, 'X') + lab(mx, my, 'Y');
  return svgFrame('0 0 ' + (W * U + 52) + ' ' + (H * U + 56), W * U + 52, tr('път, който се пресича със себе си, с червени точки на кръстовищата', 'дорога, що перетинає сама себе, з червоними точками на перехрестях')) + s + '</svg>';
}
function drawRoadStops(q){
  return '<div class="ask">' + tr('Стефан шофира от X към Y и спира на всяко кръстовище, след което продължава по права линия. Намерете броя на спиранията.',
    'Стефан їде від X до Y і зупиняється на кожному перехресті, після чого їде далі прямо. Знайдіть кількість зупинок.') + '</div>' +
    '<div class="fig maze">' + roadPic(q) + '</div>' + answerLine('xl');
}
const eqRoad = q => trN(q.K, 'кръстовище', 'кръстовища', 'перехрестя', 'перехрестя', 'перехресть') + tr(', всяко минато два пъти: ', ', кожне проїжджає двічі: ') + Array(q.K).fill(2).join(' + ') + ' = ' + q.ans;
function whyRoadStops(q, full){
  if(!full) return tr('Пътят се пресича със себе си в червените точки. Колко пъти минава колата през всяка от тях? Спира всеки път, когато минава.',
    'Дорога перетинає сама себе в червоних точках. Скільки разів машина проїжджає кожну з них? Вона зупиняється щоразу, коли проїжджає.') + '<div class="fig maze">' + roadPic(q) + '</div>';
  return tr('Броят на червените точки е ' + q.K + '. Колата минава през всяка два пъти (по единия път и по другия) и спира всеки път: ',
    'Кількість червоних точок — ' + q.K + '. Машина проїжджає кожну двічі (по одній частині дороги й по другій) і щоразу зупиняється: ') + '<b>' + Array(q.K).fill(2).join(' + ') + ' = ' + q.ans + '</b>' + roadPic(q);
}
KIND.roadstops = { draw:drawRoadStops, eq:eqRoad, why:whyRoadStops };
