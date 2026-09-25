// Question kind 'ineq': level 16 Вместо ? — How many digits make the statement false.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 10: how many single digits make the statement false. The relation and the
// negation both move, so "не е вярно" has to be worked through rather than skipped.
function genIneq(){
  if(Math.random() < 0.12){
    // Зима 2022, задача 7: only two-digit numbers fit the box — □ + 10 < 30 leaves 10 … 19
    for(;;){
      const C = 5 + rnd(26), T = C + 12 + rnd(29);
      if(T > 70) continue;
      return {kind:'ineq', shape:4, C, T, ans: T - C - 10};
    }
  }
  if(Math.random() < 0.12){
    // Зима 2022, задача 9: the unknown is a tens digit — 22 is not less than ❄2 for ❄ = 1 or 2
    for(;;){
      const d = rnd(10), N = 12 + rnd(30), fits = [];
      for(let t = 1; t <= 9; t++) if(10*t + d <= N) fits.push(t);
      if(fits.length < 2 || fits.length > 3) continue;
      return {kind:'ineq', shape:5, d, N, fits, slots: fits.length, ans: fits[0], alt: fits.slice(1)};
    }
  }
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
  if(q.kind === 'ineq' && q.shape === 4){
    return '<div class="ask">' + tr('Колко са всички <b>двуцифрени</b> числа, които могат да се запишат в □, така че да е вярно', 'Скільки всього <b>двоцифрових</b> чисел можна записати в □, щоб було правильно') + '</div>' +
      '<div class="given">□ + ' + q.C + ' &lt; ' + q.T + '</div><div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'ineq' && q.shape === 5){
    const slots = q.fits.map((_, i) => i ? ' <span class="or">' + tr('и', 'і') + '</span> <span class="slot" id="slot' + i + '"></span>' : SLOT).join('');
    return '<div class="ask">' + tr('Кои цифри можем да поставим вместо ❄, така че числото <span class="num">' + q.N + '</span> да <b>не е по-малко</b> от двуцифреното число ❄' + q.d + '?',
      'Які цифри можна поставити замість ❄, щоб число <span class="num">' + q.N + '</span> було <b>не менше</b> за двоцифрове число ❄' + q.d + '?') + '</div>' +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + slots + '</div>';
  }
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
  if(q.kind === 'ineq' && q.shape === 4) return '□ + ' + q.C + ' < ' + q.T + ' → □ < ' + (q.T - q.C) + tr(', двуцифрени: 10 … ', ', двоцифрові: 10 … ') + (q.T - q.C - 1) + ' → ' + q.ans;
  if(q.kind === 'ineq' && q.shape === 5) return '❄' + q.d + ' ≤ ' + q.N + ' → ❄ = ' + q.fits.join(', ');
  if(q.kind === 'ineq' && q.shape === 3) return q.A + ' − ' + q.B + ' > ? + ' + q.C + tr(' вярно', ' правильно') + ' → ' + q.ans;
  if(q.kind === 'ineq') return (q.shape === 2 ? '? + ' + q.C + ' < ' + q.A + ' − ' + q.B
    : q.A + ' − ' + q.B + ' < ? + ' + q.C) + (q.shape === 1 ? tr(' вярно', ' правильно') : tr(' невярно', ' неправильно')) +
    (q.asksSum ? tr(', сборът', ', сума') : '') + ' → ' + q.ans;
}
function whyIneq(q, full){
  if(q.kind === 'ineq'){
    if(q.shape === 4){
      if(!full) return tr('Колко най-много може да е □? И само двуцифрените се броят.', 'Яким найбільшим може бути □? І рахуються лише двоцифрові.');
      return '□ + ' + q.C + ' < ' + q.T + ' &nbsp;→&nbsp; □ < ' + (q.T - q.C) + ' &nbsp;→&nbsp; 10, 11, …, ' + (q.T - q.C - 1) + ' &nbsp;→&nbsp; ' + (q.T - q.C - 1) + ' − 10 + 1 = ' + q.ans;
    }
    if(q.shape === 5){
      if(!full) return tr('„Не е по-малко" значи по-голямо или равно. Опитвай цифрите подред.', '«Не менше» означає більше або дорівнює. Пробуй цифри по черзі.');
      const tries = []; for(let t = 1; t <= q.fits[q.fits.length - 1] + 1 && t <= 9; t++) tries.push((10*t + q.d) + (10*t + q.d <= q.N ? ' ≤ ' : ' > ') + q.N);
      return tries.join(', ') + ' &nbsp;→&nbsp; ❄ = ' + q.fits.join(tr(' и ', ' і '));
    }
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
