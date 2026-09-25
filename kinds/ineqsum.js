// Question kind 'ineqsum': level 140 a > 5 > b > c — Three numbers with a known sum, in a known order, one parity pinned.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Пролет 2025, задача 19: a + b + c = 12 and a > 5 > b > c, c odd. If c were 3, b would be 4 and
// a 5, which is not bigger than 5; so c = 1 (and b may be 2, 3 or 4). Every triple is tried here.
function ineqSols(S, k){ const out = []; for(let c = 0; c < k; c++) for(let b = c + 1; b < k; b++){ const a = S - b - c; if(a > k) out.push([a, b, c]); } return out; }
function genIneqSum(){
  for(;;){
    const S = 9 + rnd(12), k = 3 + rnd(5), odd = Math.random() < 0.6, sols = ineqSols(S, k).filter(([, , c]) => (c % 2 === 1) === odd);
    const cs = [...new Set(sols.map(t => t[2]))];
    if(cs.length !== 1 || ineqSols(S, k).length === sols.length) continue;
    return {kind:'ineqsum', S, k, odd, traps:[cs[0] + 2], ans: cs[0]};
  }
}
function drawIneqSum(q){
  if(q.kind === 'ineqsum'){
    return '<div class="ask">' + tr('Кое е <b>' + (q.odd ? 'нечетното' : 'четното') + '</b> число <i>c</i>, ако', 'Яке <b>' + (q.odd ? 'непарне' : 'парне') + '</b> число <i>c</i>, якщо') + '</div>' +
      '<div class="given"><span style="white-space:nowrap"><i>a</i> + <i>b</i> + <i>c</i> = ' + q.S + '</span> &nbsp;' + tr('и', 'і') + '&nbsp; <span style="white-space:nowrap"><i>a</i> &gt; ' + q.k + ' &gt; <i>b</i> &gt; <i>c</i></span></div>' +
      '<div class="note">' + tr('Числата са 0, 1, 2, 3, …', 'Числа — це 0, 1, 2, 3, …') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)"><i>c</i> = ' + SLOT + '</div>';
  }
}
function eqIneqSum(q){
  if(q.kind === 'ineqsum') return ineqSols(q.S, q.k).filter(t => (t[2] % 2 === 1) === q.odd).map(t => t.join('+')).join(', ') + ' → c = ' + q.ans;
}
function whyIneqSum(q, full){
  if(q.kind === 'ineqsum'){
    if(!full) return tr('b и c са по-малки от средното число, и c е по-малко от b. Опитай всяко възможно c — стига ли остатъкът за a?', 'b і c менші від середнього числа, а c менше від b. Спробуй кожне можливе c — чи вистачає решти для a?');
    const tries = []; for(let c = q.odd ? 1 : 0; c < q.k - 1; c += 2){ const b = q.k - 1, a = q.S - b - c; tries.push('c = ' + c + ': ' + tr('най-голямото b е ', 'найбільше b — ') + b + ', a = ' + a + (a > q.k ? ' ✓' : ' ✗')); }
    return tries.join('; ') + ' &nbsp;→&nbsp; c = ' + q.ans;
  }
}
KIND.ineqsum = { draw:drawIneqSum, eq:eqIneqSum, why:whyIneqSum };
