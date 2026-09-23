// Question kind 'trees': level 31 Дръвчета — Trees in a row: the gaps are one fewer, and the units may not match.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

function genTrees(){
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

const treesPl = (n, one, few, many) => ({one, few}[new Intl.PluralRules('uk').select(n)] || many);
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
  if(q.kind === 'trees'){
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
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + SLOT +
      (q.shape === 1 ? '' : ' <span class="unit">м</span>') + '</div>';
  }
}
function eqTrees(q){
  if(q.kind === 'trees') return tr(q.n + ' дръвчета, ' + q.d + ' м, редица ' + q.len + ' м → ' + q.ans,
    treesN(q.n) + ', ' + q.d + ' м, ряд ' + q.len + ' м → ' + q.ans);
}
function whyTrees(q, full){
  if(q.kind === 'trees'){
    if(!full) return q.shape === 3 ? tr('Разстоянията са с едно по-малко от дръвчетата — и мерките трябва да съвпадат.',
                                        'Проміжків на один менше, ніж деревець, — і одиниці вимірювання мають збігатися.')
                                   : tr('Разстоянията са с едно по-малко от дръвчетата.', 'Проміжків на один менше, ніж деревець.');
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
}
KIND.trees = { draw:drawTrees, eq:eqTrees, why:whyTrees };
