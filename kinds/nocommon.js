// Question kind 'nocommon': level 258 Без общ връх — Triangles and squares with no vertex in common: how many of each.

// МБГ Есен 2023, 3 клас, задача 14: 7 figures, triangles and squares, none sharing a vertex with another, 23 vertices in
// all — how many triangles? Were all 7 triangles there would be 7 · 3 = 21 vertices; a square has one more, so the
// 23 − 21 = 2 extra are 2 squares, and 7 − 2 = 5 triangles. The slip: the squares given for the triangles.
// 5 to 12 figures; mostly the triangles asked, as on the paper, sometimes the squares.
import { KIND, SLOT, rnd, tr, ukN } from '../js/core.js';
export function genNoCommon(){
  const n = 5 + rnd(8), s = 1 + rnd(n - 1), t = n - s, askT = Math.random() < 0.7, ans = askT ? t : s;
  return {kind:'nocommon', n, t, s, V: 3*t + 4*s, askT, traps: [askT ? s : t].filter(v => v !== ans), ans};
}
function drawNoCommon(q){
  const what = q.askT ? ['триъгълници', 'трикутників'] : ['квадрати', 'квадратів'];
  return '<div class="ask">' + tr('Начертах триъгълници и квадрати – общо <span class="num">' + q.n + '</span> фигури. Сред тези фигури няма такава, която да има общ връх с друга от начертаните фигури. ' +
    'Колко са начертаните <b>' + what[0] + '</b>, ако върховете на начертаните фигури са общо <span class="num">' + q.V + '</span>?',
    'Я накреслив трикутники й квадрати — усього ' + ukN(q.n, 'фігура', 'фігури', 'фігур').replace(/^(\d+)/, '<span class="num">$1</span>') + '. Серед цих фігур немає жодної, яка мала б спільну вершину з іншою накресленою фігурою. ' +
    'Скільки накреслено <b>' + what[1] + '</b>, якщо всього вершин у накреслених фігур <span class="num">' + q.V + '</span>?') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqNoCommon(q){
  return q.n + ' · 3 = ' + 3*q.n + ', ' + q.V + ' − ' + 3*q.n + ' = ' + q.s + (q.askT ? ', ' + q.n + ' − ' + q.s + ' = ' + q.t : '');
}
// the figures apart, every vertex its own dot: the triangles, then the squares
function noCommonSvg(q){
  const step = 30, W = q.n*step;
  let g = '';
  for(let k = 0; k < q.n; k++){
    const x = k*step + 3, tri = k < q.t, col = tri ? 'var(--accent)' : 'var(--warm)';
    const pts = tri ? [[x + 12, 2], [x + 24, 24], [x, 24]] : [[x + 1, 3], [x + 23, 3], [x + 23, 25], [x + 1, 25]];
    g += '<polygon points="' + pts.map(p => p.join(',')).join(' ') + '" fill="none" stroke="' + col + '" stroke-width="2"/>' +
      pts.map(p => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2.6" fill="' + col + '"/>').join('');
  }
  return '<svg viewBox="-2 -2 ' + (W + 4) + ' 32" style="display:block; width:' + Math.min(320, Math.round((W + 4)*1.2)) + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + tr('триъгълниците и квадратите', 'трикутники й квадрати') + '">' + g + '</svg>';
}
function whyNoCommon(q, full){
  if(!full) return tr('Ако всички фигури бяха триъгълници, колко върха щяха да имат? С колко върха квадратът има повече от триъгълника?',
    'Якби всі фігури були трикутниками, скільки вершин вони мали б? На скільки вершин у квадрата більше, ніж у трикутника?');
  return tr('Никой връх не е общ, значи броим върховете на всяка фигура. Ако всички ' + q.n + ' фигури бяха триъгълници: ', 'Жодна вершина не спільна, тож рахуємо вершини кожної фігури. Якби всі ' + q.n + ' фігур були трикутниками: ') +
    q.n + ' · 3 = <b>' + 3*q.n + '</b> &nbsp;→&nbsp; ' + q.V + ' − ' + 3*q.n + ' = <b>' + q.s + '</b> ' + tr((q.s === 1 ? 'връх' : 'върха') + ' повече, а всеки квадрат има един връх повече от триъгълник', '— на стільки більше вершин, а кожен квадрат має на одну вершину більше, ніж трикутник') +
    noCommonSvg(q) + tr('значи квадратите са ', 'отже, квадратів — ') + q.s + (q.askT ? tr(', триъгълниците: ', ', трикутників: ') + q.n + ' − ' + q.s + ' = ' + q.t : '');
}
KIND.nocommon = { draw:drawNoCommon, eq:eqNoCommon, why:whyNoCommon };
