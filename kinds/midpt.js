// Question kind 'midpt': level 71 Селищата — A midpoint, and a place a few kilometres from it.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Есен, 3 клас, задача 13: A to B is 32 km, M is halfway, N lies between A and M with MN = 4 km;
// N to B is 16 + 4 = 20 km. Sometimes it asks for A to N instead: 16 − 4.
function genMidPt(){
  const half = 8 + rnd(23), m = 1 + rnd(half - 2), toB = Math.random() < 0.65;
  return {kind:'midpt', AB: 2*half, half, m, toB, ans: toB ? half + m : half - m,
          traps: [toB ? half - m : half + m, 2*half - m, half].filter((v, i, a) => a.indexOf(v) === i)};
}
function midSvg(q){
  const W = 260, at = v => 12 + v / q.AB * (W - 24);
  const pts = [[0, 'A'], [q.half - q.m, 'N'], [q.half, 'M'], [q.AB, 'B']];
  return '<div class="fig wide"><svg viewBox="0 -14 ' + W + ' 46" role="img" aria-label="' + tr('селищата върху пътя', 'села на дорозі') + '">' +
    '<line x1="4" y1="10" x2="' + (W - 4) + '" y2="10" stroke="var(--ink)" stroke-width="2"/>' +
    pts.map(([v, n]) => '<circle cx="' + at(v).toFixed(1) + '" cy="10" r="3.6" fill="var(--ink)"/><text x="' + at(v).toFixed(1) +
      '" y="-2" text-anchor="middle" font-size="15" font-weight="800" fill="var(--ink)" font-family="Nunito, sans-serif">' + n + '</text>').join('') +
    '</svg></div>';
}
function drawMidPt(q){
  if(q.kind === 'midpt'){
    const ask = q.toB ? ['N и B', 'N і B'] : ['A и N', 'A і N'];
    return '<div class="ask">' + tr('Разстоянието между селищата A и B е <span class="num">' + q.AB + '</span> км, като селището M се намира точно в средата на пътя между тях. ' +
      'Селището N е разположено между A и M, като разстоянието от M до N е <span class="num">' + q.m + '</span> км. Колко километра е разстоянието между селищата ' + ask[0] + '?',
      'Відстань між селами A і B становить <span class="num">' + q.AB + '</span> км, а село M розташоване точно посередині дороги між ними. ' +
      'Село N розташоване між A і M, причому відстань від M до N — <span class="num">' + q.m + '</span> км. Скільки кілометрів становить відстань між селами ' + ask[1] + '?') +
      '</div>' + midSvg(q) + '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT + ' <span class="unit">км</span></div>';
  }
}
function eqMidPt(q){
  if(q.kind === 'midpt') return q.AB + ' : 2 = ' + q.half + ' → ' + q.half + (q.toB ? ' + ' : ' − ') + q.m + ' = ' + q.ans + ' км';
}
function whyMidPt(q, full){
  if(q.kind === 'midpt'){
    if(!full) return tr('Първо: колко е от M до всяко от двете селища?', 'Спершу: скільки від M до кожного з двох сіл?');
    return 'AM = MB = ' + q.AB + ' : 2 = ' + q.half + ' км &nbsp;→&nbsp; ' + (q.toB ? 'NB = NM + MB = ' + q.m + ' + ' + q.half : 'AN = AM − NM = ' + q.half + ' − ' + q.m) +
      ' = ' + q.ans + ' км';
  }
}
KIND.midpt = { draw:drawMidPt, eq:eqMidPt, why:whyMidPt };
