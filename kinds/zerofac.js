// Question kind 'zerofac': level 83 (…) · (1 + 2 + 3 − 6) — One bracket comes to 0, so the long one needs no working.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Зима 2024, задача 9: (1·2 + 2·3 + 3·4 + 5·6) · (1 + 2 + 3 − 6). The long bracket is a
// decoy: the short one is 0, and anything times 0 is 0. Sometimes a number is added after.
function genZeroFac(){
  const prods = [];
  for(let a = 1 + rnd(3), i = 0; i < 3 + rnd(2); i++, a += 1 + rnd(2)) prods.push([a, a + 1]);
  const parts = shuffle([1,2,3,4,5,6,7]).slice(0, 2 + rnd(2)).sort((x, y) => x - y);
  const zero = parts.map(String).join(' + ') + ' − ' + parts.reduce((x, y) => x + y, 0);
  const long = prods.map(p => p[0] + ' · ' + p[1]).join(' + ');
  const first = rnd(2) === 0, add = Math.random() < 0.5 ? 0 : 2 + rnd(30);
  return {kind:'zerofac', long, zero, first, add, ans: add};
}
const zeroFacExpr = q => { const br = x => '<span style="white-space:nowrap">(' + x + ')</span>';   // a bracket never breaks
  return (q.first ? br(q.zero) + ' · ' + br(q.long) : br(q.long) + ' · ' + br(q.zero)) + (q.add ? ' + ' + q.add : ''); };
function drawZeroFac(q){
  if(q.kind === 'zerofac'){
    return '<div class="ask">' + tr('Пресметнете', 'Обчисліть') + '</div>' +
      '<div class="line" style="font-size:clamp(18px,5vw,30px)"><span class="num">' + zeroFacExpr(q) + '</span></div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqZeroFac(q){
  if(q.kind === 'zerofac') return q.zero + ' = 0 → (…) · 0' + (q.add ? ' + ' + q.add : '') + ' = ' + q.ans;
}
function whyZeroFac(q, full){
  if(q.kind === 'zerofac'){
    if(!full) return tr('Не започвай с дългата скоба — пресметни първо късата.', 'Не починай із довгої дужки — спочатку обчисли коротку.');
    return q.zero + ' = <b>0</b> &nbsp;→&nbsp; ' + tr('всяко число, умножено по 0, е 0', 'будь-яке число, помножене на 0, дорівнює 0') +
      (q.add ? ' &nbsp;→&nbsp; 0 + ' + q.add + ' = ' + q.ans : ' &nbsp;→&nbsp; 0');
  }
}
KIND.zerofac = { draw:drawZeroFac, eq:eqZeroFac, why:whyZeroFac };
