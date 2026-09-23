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

function drawTrees(q){
  if(q.kind === 'trees'){
    const ask = q.shape === 3
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
  if(q.kind === 'trees') return q.n + ' дръвчета, ' + q.d + ' м, редица ' + q.len + ' м → ' + q.ans;
}
function whyTrees(q, full){
  if(q.kind === 'trees'){
    if(!full) return q.shape === 3 ? 'Разстоянията са с едно по-малко от дръвчетата — и мерките трябва да съвпадат.'
                                   : 'Разстоянията са с едно по-малко от дръвчетата.';
    const gaps = q.n - 1;
    if(q.shape === 3) return q.dm + ' дм = <b>' + q.d + '</b> м, а между ' + q.n + ' дръвчета има <b>' +
      gaps + '</b> разстояния &nbsp;→&nbsp; ' + gaps + ' × ' + q.d + ' = ' + q.ans;
    if(q.shape === 0) return 'между ' + q.n + ' дръвчета има <b>' + gaps + '</b> разстояния &nbsp;→&nbsp; ' +
      (q.d === 1 ? 'по един метър всяко, значи ' + q.ans
       : gaps <= 6 ? Array(gaps).fill(q.d).join(' + ') + ' = ' + q.ans
       : gaps + ' × ' + q.d + ' = ' + q.ans);
    if(q.shape === 1) return q.len + ' м на стъпки по ' + q.d + ' м дава <b>' + gaps +
      '</b> разстояния &nbsp;→&nbsp; дръвчетата са с едно повече: ' + q.ans;
    return 'между ' + q.n + ' дръвчета има <b>' + gaps + '</b> разстояния &nbsp;→&nbsp; ' +
      q.len + ' м, разделени на ' + gaps + ' → ' + q.ans;
  }
}
KIND.trees = { draw:drawTrees, eq:eqTrees, why:whyTrees };
