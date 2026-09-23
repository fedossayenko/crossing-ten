// Question kind 'ineq': level 16 Вместо ? — How many digits make the statement false.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 10: how many single digits make the statement false. The relation and the
// negation both move, so "не е вярно" has to be worked through rather than skipped.
function genIneq(){
  for(;;){
    const shape = rnd(3);
    const L = 1 + rnd(9), B = 1 + rnd(17), A = L + B, C = 1 + rnd(8);
    if(A > 30) continue;
    const atMost = Math.max(0, Math.min(10, L - C + 1));   // digits with ? + C <= L
    const ans = shape === 0 ? atMost
              : shape === 1 ? 10 - atMost
              : 10 - Math.max(0, Math.min(10, L - C));
    if(ans < 1 || ans > 9) continue;
    if(shape === 0 && atMost >= 3 && Math.random() < 0.35){
      // the values run 0 … lim, so their sum needs no "one-digit" limit to be finite
      const lim = L - C;
      return {kind:'ineq', shape, asksSum:true, A, B, L, C, lim, ans: lim*(lim + 1)/2};
    }
    return {kind:'ineq', shape, A, B, L, C, ans};
  }
}

function drawIneq(q){
  if(q.kind === 'ineq'){
    const rel = q.shape === 2
      ? '? + ' + q.C + ' &lt; ' + q.A + ' − ' + q.B
      : q.A + ' − ' + q.B + ' &lt; ? + ' + q.C;
    const head = q.asksSum
      ? 'Намерете <b>сбора</b> на всички различни числа, които можем да поставим вместо ?, така че <b>да НЕ е вярно</b>:'
      : 'Колко различни едноцифрени числа можем да поставим вместо ?, така че ' +
        (q.shape === 1 ? '<b>да е вярно</b>' : '<b>да НЕ е вярно</b>') + ':';
    return '<div class="ask">' + head + '</div>' +
      '<div class="given">' + rel + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqIneq(q){
  if(q.kind === 'ineq') return (q.shape === 2 ? '? + ' + q.C + ' < ' + q.A + ' − ' + q.B
    : q.A + ' − ' + q.B + ' < ? + ' + q.C) + (q.shape === 1 ? ' вярно' : ' невярно') +
    (q.asksSum ? ', сборът' : '') + ' → ' + q.ans;
}
function whyIneq(q, full){
  if(q.kind === 'ineq'){
    if(!full) return q.asksSum ? 'Първо намери кои числа стават, после ги събери.'
            : q.shape === 1 ? 'Първо пресметни лявата страна.' : '„Не е вярно" обръща знака.';
    const lim = q.L - q.C;
    if(q.asksSum){
      const list = [];
      for(let v = 0; v <= lim; v++) list.push(v);
      return q.A + ' − ' + q.B + ' = <b>' + q.L + '</b> &nbsp;→&nbsp; трябва ? + ' + q.C + ' ≤ ' + q.L +
        ', значи ? ≤ ' + lim + ' &nbsp;→&nbsp; ' + list.join(' + ') + ' = ' + q.ans;
    }
    const head = q.A + ' − ' + q.B + ' = <b>' + q.L + '</b> &nbsp;→&nbsp; ';
    if(q.shape === 0) return head + 'трябва ? + ' + q.C + ' ≤ ' + q.L + ', значи ? ≤ ' + lim +
      ' &nbsp;→&nbsp; 0 … ' + lim + ' &nbsp;→&nbsp; ' + q.ans;
    if(q.shape === 1) return head + 'трябва ? + ' + q.C + ' > ' + q.L + ', значи ? ≥ ' + (lim+1) +
      ' &nbsp;→&nbsp; ' + (lim+1) + ' … 9 &nbsp;→&nbsp; ' + q.ans;
    return head + 'трябва ? + ' + q.C + ' ≥ ' + q.L + ', значи ? ≥ ' + lim +
      ' &nbsp;→&nbsp; ' + Math.max(0, lim) + ' … 9 &nbsp;→&nbsp; ' + q.ans;
  }
}
KIND.ineq = { draw:drawIneq, eq:eqIneq, why:whyIneq };
