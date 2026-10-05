// Question kind 'trees': level 31 Дръвчета — Trees in a row: the gaps are one fewer, and the units may not match.
import { KIND, NAMES, SLOT, UK_PLURAL, popAt, rnd, svgText, tr } from '../js/core.js';
import { LANG } from '../js/i18n.js';

export function genTrees(){
  const nm = NAMES[rnd(5)], who = nm[0], did = nm[1];
  // a row can run to two dozen, and the gap may be a single metre — which is the purest
  // form of the lesson, since then the length is just the number of gaps
  let n, d;
  do { n = 4 + rnd(21); d = 1 + rnd(6); } while((n - 1) * d > 100);
  const shape = rnd(4);
  if(shape === 3){
    // Задача 11: told in дециметри, asked in метри — the gap count is the same puzzle,
    // with a conversion sitting in front of it.
    const k = 2 + rnd(2), m = 6 + rnd(11);   // a whole metre between trees would make the conversion do nothing
    return {kind:'trees', who, did, n:m, d:k, dm: 10*k, shape, len: (m - 1)*k, ans: (m - 1)*k};
  }
  return {kind:'trees', who, did, n, d, shape, len: (n - 1) * d,
          ans: shape === 0 ? (n - 1) * d : shape === 1 ? n : d};
}

const treesPl = (n, one, few, many) => ({one, few}[UK_PLURAL.select(n)] || many);
const treesN = n => n + ' ' + treesPl(n, 'деревце', 'деревця', 'деревець');
const treesM = n => treesPl(n, 'метр', 'метри', 'метрів');
const treesGaps = n => treesPl(n, 'проміжок', 'проміжки', 'проміжків');
function treesUkAsk(q){
  const nm = NAMES.find(x => x[0] === q.who), who = nm[2], did = nm[3], num = x => '<span class="num">' + x + '</span>';
  const trees = n => num(n) + ' ' + treesPl(n, 'деревце', 'деревця', 'деревець');
  if(q.shape === 3) return who + ' ' + did + ' ' + trees(q.n) + ' в один ряд на відстані ' + num(q.dm) +
    ' дм одне від одного. Скільки <b>метрів</b> завдовжки цей ряд?';
  if(q.shape === 0) return who + ' ' + did + ' ' + trees(q.n) + ' в один ряд на відстані ' + num(q.d) + ' ' +
    treesM(q.d) + ' одне від одного. Скільки метрів завдовжки цей ряд?';
  if(q.shape === 1) return who + ' ' + did + ' деревця в один ряд завдовжки ' + num(q.len) + ' ' + treesM(q.len) +
    ' на відстані ' + num(q.d) + ' ' + treesM(q.d) + ' одне від одного. Скільки деревець ' +
    (/в$/.test(did) ? 'він' : 'вона') + ' ' + did + '?';
  return who + ' ' + did + ' ' + trees(q.n) + ' в ряд завдовжки ' + num(q.len) + ' ' + treesM(q.len) +
    ' на однаковій відстані. Скільки метрів між двома сусідніми деревцями?';
}

function drawTrees(q){
  const ask = LANG === 'uk' ? treesUkAsk(q) : q.shape === 3
    ? q.who + ' ' + q.did + ' <span class="num">' + q.n + '</span> дръвчета в една редица на разстояние <span class="num">' +
      q.dm + '</span> дм едно от друго. Колко <b>метра</b> е дълга редицата?'
    : q.shape === 0
    ? q.who + ' ' + q.did + ' <span class="num">' + q.n + '</span> дръвчета в една редица на разстояние <span class="num">' +
      q.d + '</span> ' + (q.d === 1 ? 'метър' : 'метра') + ' едно от друго. Колко метра е дълга редицата?'
    : q.shape === 1
    ? q.who + ' ' + q.did + ' дръвчета в една редица, дълга <span class="num">' + q.len +
      '</span> метра, на разстояние <span class="num">' + q.d + '</span> метра едно от друго. Колко дръвчета е ' + q.did + '?'
    : q.who + ' ' + q.did + ' <span class="num">' + q.n + '</span> дръвчета в редица, дълга <span class="num">' + q.len +
      '</span> метра, на равни разстояния. Колко метра е разстоянието между две съседни дръвчета?';
  return '<div class="ask">' + ask + '</div>' +
    '<div class="line lg">' + SLOT +
    (q.shape === 1 ? '' : ' <span class="unit">м</span>') + '</div>';
}
function eqTrees(q){
  return tr(q.n + ' дръвчета, ' + q.d + ' м, редица ' + q.len + ' м → ' + q.ans,
    treesN(q.n) + ', ' + q.d + ' м, ряд ' + q.len + ' м → ' + q.ans);
}
// The picture: the trees go in first, then an arc over every gap, numbered — so the gaps come out one
// fewer than the trees. A long row shows its first three trees and its last two. The hint draws four
// trees and their three gaps with no numbers at all.
function treesSvg(q, full){
  const tree = (x, extra) => '<g' + (extra || '') + '><rect x="' + (x - 1.5).toFixed(1) + '" y="-9" width="3" height="9" fill="var(--warm)"/>' +
    '<circle cx="' + x.toFixed(1) + '" cy="-17" r="8" fill="var(--good)"/></g>';
  const arc = (a, b, extra) => '<path' + (extra || '') + ' d="M' + (a + 4).toFixed(1) + ',-28 Q' + ((a + b) / 2).toFixed(1) + ',-44 ' + (b - 4).toFixed(1) + ',-28" stroke="var(--accent)" stroke-width="2.4" fill="none"/>';
  const svg = (h, g) => '<svg viewBox="0 -58 246 ' + h + '" style="display:block; width:300px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('дръвчетата и разстоянията между тях', 'деревця і проміжки між ними') + '"><line x1="4" y1="0" x2="242" y2="0" stroke="var(--line)" stroke-width="2"/>' + g + '</svg>';
  if(!full){
    const X = [33, 93, 153, 213];
    return svg(66, X.map(x => tree(x)).join('') + X.slice(1).map((x, i) => arc(X[i], x)).join(''));
  }
  const n = q.n, gaps = n - 1, long = n > 9;
  const at = long ? [1, 2, 3, n - 1, n] : Array.from({length: n}, (_, i) => i + 1);
  const X = long ? [18, 60, 102, 186, 228] : at.map(k => 18 + (k - 1) * 210 / gaps);
  let g = '';
  at.forEach((k, i) => { g += tree(X[i], popAt(i * 0.5)) + svgText(X[i], 18, k, 11, 'var(--good)', popAt(i * 0.5)); });
  if(long) g += svgText(144, -14, '…', 18, 'var(--muted)') + svgText(144, -42, '…', 14, 'var(--muted)');
  const t0 = at.length * 0.5 + 1;
  at.forEach((k, i) => { if(i && at[i - 1] === k - 1)
    g += '<g' + popAt(t0 + i) + '>' + arc(X[i - 1], X[i]) + svgText((X[i - 1] + X[i]) / 2, -46, k - 1, 11, 'var(--accent)') + '</g>'; });
  const foot = q.shape === 1 ? gaps + ' + 1 = ' + q.ans : q.shape === 2 ? q.len + ' : ' + gaps + ' = ' + q.ans : gaps + ' × ' + q.d + ' = ' + q.ans;
  return svg(104, g + svgText(123, 40, foot, 15, 'var(--ink)', popAt(t0 + at.length + 1)));
}
function whyTrees(q, full){
  if(!full) return (q.shape === 3 ? tr('Разстоянията са с едно по-малко от дръвчетата — и мерките трябва да съвпадат.',
                                      'Проміжків на один менше, ніж деревець, — і одиниці вимірювання мають збігатися.')
                                 : tr('Разстоянията са с едно по-малко от дръвчетата.', 'Проміжків на один менше, ніж деревець.')) + treesSvg(q, false);
  return whyTreesText(q) + treesSvg(q, true);
}
function whyTreesText(q){
  const gaps = q.n - 1;
  const between = tr('между ' + q.n + ' дръвчета има <b>' + gaps + '</b> разстояния',
    'між ' + q.n + (q.n % 10 === 1 && q.n % 100 !== 11 ? ' деревцем' : ' деревцями') + ' <b>' + gaps + '</b> ' + treesGaps(gaps));
  if(q.shape === 3) return q.dm + ' дм = <b>' + q.d + '</b> м, ' + 'а ' + between + ' &nbsp;→&nbsp; ' + gaps + ' × ' + q.d + ' = ' + q.ans;
  if(q.shape === 0) return between + ' &nbsp;→&nbsp; ' +
    (q.d === 1 ? tr('по един метър всяко, значи ', 'по одному метру кожен, отже ') + q.ans
     : gaps <= 6 ? Array(gaps).fill(q.d).join(' + ') + ' = ' + q.ans
     : gaps + ' × ' + q.d + ' = ' + q.ans);
  if(q.shape === 1) return tr(q.len + ' м на стъпки по ' + q.d + ' м дава <b>' + gaps +
    '</b> разстояния &nbsp;→&nbsp; дръвчетата са с едно повече: ' + q.ans,
    q.len + ' м кроками по ' + q.d + ' м дають <b>' + gaps + '</b> ' + treesGaps(gaps) +
    ' &nbsp;→&nbsp; деревець на одне більше: ' + q.ans);
  return between + ' &nbsp;→&nbsp; ' + q.len + tr(' м, разделени на ', ' м, поділені на ') + gaps + ' → ' + q.ans;
}
KIND.trees = { draw:drawTrees, eq:eqTrees, why:whyTrees };
