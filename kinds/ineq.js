// Question kind 'ineq': level 16 Вместо ? — How many digits make the statement false.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 10: how many single digits make the statement false. The relation and the
// negation both move, so "не е вярно" has to be worked through rather than skipped.
function genIneq(){
  if(Math.random() < 0.2){
    // Зима 2023: bigger numbers, «>», and every number counts, not only one-digit ones:
    // 43 − 19 > ? + 17 is true for ? = 0 … 6, so 7 numbers
    for(;;){
      const B = 11 + rnd(25), L = 12 + rnd(30), A = L + B, C = 5 + rnd(L - 6);
      if(A > 80 || L - C < 2 || L - C > 12) continue;
      return {kind:'ineq', shape:3, A, B, L, C, ans: L - C};
    }
  }
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
    const rel = q.shape === 3 ? q.A + ' − ' + q.B + ' &gt; ? + ' + q.C
      : q.shape === 2
      ? '? + ' + q.C + ' &lt; ' + q.A + ' − ' + q.B
      : q.A + ' − ' + q.B + ' &lt; ? + ' + q.C;
    const head = q.shape === 3
      ? tr('Намерете <b>броя</b> на всички различни числа, които можем да поставим вместо ?, така че <b>да е вярно</b>:',
           'Знайдіть <b>кількість</b> усіх різних чисел, які можна поставити замість ?, щоб <b>було правильно</b>:')
      : q.asksSum
      ? tr('Намерете <b>сбора</b> на всички различни числа, които можем да поставим вместо ?, така че <b>да НЕ е вярно</b>:',
           'Знайдіть <b>суму</b> всіх різних чисел, які можна поставити замість ?, щоб <b>НЕ було правильно</b>:')
      : tr('Колко различни едноцифрени числа можем да поставим вместо ?, така че ' +
        (q.shape === 1 ? '<b>да е вярно</b>' : '<b>да НЕ е вярно</b>') + ':',
           'Скільки різних одноцифрових чисел можна поставити замість ?, щоб ' +
        (q.shape === 1 ? '<b>було правильно</b>' : '<b>НЕ було правильно</b>') + ':');
    return '<div class="ask">' + head + '</div>' +
      '<div class="given">' + rel + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqIneq(q){
  if(q.kind === 'ineq' && q.shape === 3) return q.A + ' − ' + q.B + ' > ? + ' + q.C + tr(' вярно', ' правильно') + ' → ' + q.ans;
  if(q.kind === 'ineq') return (q.shape === 2 ? '? + ' + q.C + ' < ' + q.A + ' − ' + q.B
    : q.A + ' − ' + q.B + ' < ? + ' + q.C) + (q.shape === 1 ? tr(' вярно', ' правильно') : tr(' невярно', ' неправильно')) +
    (q.asksSum ? tr(', сборът', ', сума') : '') + ' → ' + q.ans;
}
function whyIneq(q, full){
  if(q.kind === 'ineq'){
    if(!full && q.shape === 3) return tr('Първо пресметни лявата страна. И 0 е число.', 'Спочатку обчисли ліву частину. І 0 — теж число.');
    if(q.shape === 3 && full) return q.A + ' − ' + q.B + ' = <b>' + q.L + '</b> &nbsp;→&nbsp; ' + tr('трябва', 'треба') + ' ? + ' + q.C + ' < ' + q.L +
      tr(', значи', ', отже') + ' ? < ' + (q.L - q.C) + ' &nbsp;→&nbsp; 0 … ' + (q.L - q.C - 1) + ' &nbsp;→&nbsp; ' + q.ans;
    if(!full) return q.asksSum ? tr('Първо намери кои числа стават, после ги събери.', 'Спочатку знайди, які числа підходять, а потім додай їх.')
            : q.shape === 1 ? tr('Първо пресметни лявата страна.', 'Спочатку обчисли ліву частину.')
            : tr('„Не е вярно" обръща знака.', '«НЕ правильно» перевертає знак.');
    const lim = q.L - q.C;
    if(q.asksSum){
      const list = [];
      for(let v = 0; v <= lim; v++) list.push(v);
      return q.A + ' − ' + q.B + ' = <b>' + q.L + '</b> &nbsp;→&nbsp; ' + tr('трябва', 'треба') + ' ? + ' + q.C + ' ≤ ' + q.L +
        tr(', значи', ', отже') + ' ? ≤ ' + lim + ' &nbsp;→&nbsp; ' + list.join(' + ') + ' = ' + q.ans;
    }
    const head = q.A + ' − ' + q.B + ' = <b>' + q.L + '</b> &nbsp;→&nbsp; ';
    if(q.shape === 0) return head + tr('трябва', 'треба') + ' ? + ' + q.C + ' ≤ ' + q.L + tr(', значи', ', отже') + ' ? ≤ ' + lim +
      ' &nbsp;→&nbsp; 0 … ' + lim + ' &nbsp;→&nbsp; ' + q.ans;
    if(q.shape === 1) return head + tr('трябва', 'треба') + ' ? + ' + q.C + ' > ' + q.L + tr(', значи', ', отже') + ' ? ≥ ' + (lim+1) +
      ' &nbsp;→&nbsp; ' + (lim+1) + ' … 9 &nbsp;→&nbsp; ' + q.ans;
    return head + tr('трябва', 'треба') + ' ? + ' + q.C + ' ≥ ' + q.L + tr(', значи', ', отже') + ' ? ≥ ' + lim +
      ' &nbsp;→&nbsp; ' + Math.max(0, lim) + ' … 9 &nbsp;→&nbsp; ' + q.ans;
  }
}
KIND.ineq = { draw:drawIneq, eq:eqIneq, why:whyIneq };
