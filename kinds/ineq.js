// Question kind 'ineq': level 16 Вместо ? — How many digits make the statement false.

// Задача 10: how many single digits make the statement false. The relation and the
// negation both move, so "не е вярно" has to be worked through rather than skipped.
// Level 120: the same inequalities with the traps moved — any number counts, only two-digit ones
// do, or the unknown is a tens digit (Зима 2021–2023). Rated a dot easier than level 16.
import { KIND, SLOT, exprText, rnd, tr } from '../js/core.js';
export function genIneqWide(){
  const pick = rnd(3);
  if(pick === 0){
    // Зима 2022, задача 7: only two-digit numbers fit the box — □ + 10 < 30 leaves 10 … 19
    for(;;){
      const C = 5 + rnd(26), T = C + 12 + rnd(29);
      if(T > 70) continue;
      return {kind:'ineq', shape:4, C, T, ans: T - C - 10};
    }
  }
  if(pick === 1){
    // Зима 2022, задача 9: the unknown is a tens digit — 22 is not less than ❄2 for ❄ = 1 or 2
    for(;;){
      // Зима 2021 the same with three digits: 299 is not less than ❄99 for ❄ = 1 or 2
      const three = Math.random() < 0.35, d = rnd(10), N = three ? 120 + rnd(280) : 12 + rnd(30), fits = [];
      for(let t = 1; t <= 9; t++) if((three ? 100*t + 11*d : 10*t + d) <= N) fits.push(t);
      if(fits.length < 2 || fits.length > 3) continue;
      return {kind:'ineq', shape:5, three, d, N, fits, slots: fits.length, ans: fits[0], alt: fits.slice(1)};
    }
  }
  {
    // Зима 2023: bigger numbers, «>», and every number counts, not only one-digit ones:
    // 43 − 19 > ? + 17 is true for ? = 0 … 6, so 7 numbers
    for(;;){
      const B = 11 + rnd(25), L = 12 + rnd(30), A = L + B, C = 5 + rnd(L - 6);
      if(A > 80 || L - C < 2 || L - C > 12) continue;
      return {kind:'ineq', shape:3, A, B, L, C, ans: L - C};
    }
  }
}
// МБГ Пролет 2025, 1 клас, задача 6: how many numbers fit 10 + ■ < 12? ■ is 0 or 1 — 2, because 0 counts.
// The box added (on either side of the plus) or taken away, all within 20.
export function genIneqSmall(){
  const r = Math.random();
  if(r < 0.4) return genIneqDigit();
  if(r >= 0.88) return genIneqBig();
  const form = rnd(3), k = 1 + rnd(6);
  if(form === 2){ const L = rnd(10), A = L + k; return {kind:'ineq', shape:6, form, A, L, traps:[k - 1], ans: k}; }   // A − ■ > L: ■ = 0 … k − 1
  const A = 2 + rnd(13), L = A + k;
  return L > 20 ? genIneqSmall() : {kind:'ineq', shape:6, form, A, L, traps:[k - 1], ans: k};
}
// МБГ Полуфинал 2024, 1 клас, задача 5: how many numbers fit 20 + ■ < 24? 0, 1, 2 and 3 — 4. The same box,
// with bigger numbers: the number added is 15 … 20 and the bound up to 25.
function genIneqBig(){
  const form = rnd(2), A = 15 + rnd(6), k = 1 + rnd(Math.min(6, 25 - A));
  return {kind:'ineq', shape:8, form, A, L: A + k, traps:[k - 1], ans: k};
}
// МБГ Пролет 2022, задача 8: how many digits fit 100 − 10 − 20 < □0? 70 < □0 leaves 8 and 9 — 2.
// Пролет 2021, задача 9: which digit fits 31 − 9 − 1 > 2□? 21 > 2□ leaves only 20, so 0.
function genIneqDigit(){
  if(Math.random() < 0.65){
    const less = Math.random() < 0.6, V = 10*(less ? 5 + rnd(3) : 3 + rnd(3)), start = Math.random() < 0.6 ? 100 : 90;
    const b = 10*(1 + rnd(3)), c = start - V - b;
    if(c < 10 || c > 40) return genIneqDigit();
    // МБГ Полуфинал 2022, 1 клас, задача 8: 80 − 10 − 10 < □0 — 60 < □0 leaves 7, 8 and 9, so 3. Now and then from 80,
    // drawn after the rest, so the other questions keep their seeds
    if(Math.random() < 0.2) for(;;){
      const less = Math.random() < 0.6, V = 10*(less ? 5 + rnd(3) : 3 + rnd(3)), b = 10*(1 + rnd(3)), c = 80 - V - b;
      if(c >= 10 && c <= 40) return ineqCount(80, b, c, V, less);
    }
    return ineqCount(start, b, c, V, less);
  }
  const more = Math.random() < 0.6, T = 1 + rnd(3), V = 10*T + (more ? 1 : 8), b = 1 + rnd(9), c = 1 + rnd(9);   // V > T□ only for □ = 0, V < T□ only for □ = 9
  return {kind:'ineq', shape:7, ask:'which', terms:[{op:'', n:V + b + c}, {op:'−', n:b}, {op:'−', n:c}], V, more, T, traps: more ? [1, 2, 8] : [8, 7, 0], ans: more ? 0 : 9};
}
const ineqCount = (start, b, c, V, less) => ({kind:'ineq', shape:7, ask:'count', terms:[{op:'', n:start}, {op:'−', n:b}, {op:'−', n:c}], V, less, traps:[less ? 10 - V / 10 : V / 10], ans: less ? 9 - V / 10 : V / 10 - 1});
const ineqDigitText = q => exprText(q.terms) + (q.ask === 'count' ? (q.less ? ' &lt; □0' : ' &gt; □0') : (q.more ? ' &gt; ' : ' &lt; ') + q.T + '□');
const ineqSmallText = q => ['A + ■ &lt; L', '■ + A &lt; L', 'A − ■ &gt; L'][q.form].replace('A', q.A).replace('L', q.L);
export function genIneq(){
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
  if(q.shape === 7){
    return '<div class="ask">' + (q.ask === 'count' ? tr('Колко е броят на различните цифри, които можем да поставим вместо □, за да е вярно:', 'Скільки різних цифр можна поставити замість □, щоб було правильно:')
      : tr('Коя е цифрата, която трябва да поставим вместо □, за да е вярно:', 'Яку цифру треба поставити замість □, щоб було правильно:')) + '</div>' +
      '<div class="given">' + ineqDigitText(q) + '</div><div class="line xl">' + SLOT + '</div>';
  }
  if(q.shape === 6 || q.shape === 8){   // 8: the same with bigger numbers
    return '<div class="ask">' + tr('Колко числа можем да поставим вместо ■, за да е вярно?', 'Скільки чисел можна поставити замість ■, щоб було правильно?') + '</div>' +
      '<div class="given">' + ineqSmallText(q) + '</div><div class="line xl">' + SLOT + '</div>';
  }
  if(q.shape === 4){
    return '<div class="ask">' + tr('Колко са всички <b>двуцифрени</b> числа, които могат да се запишат в □, така че да е вярно', 'Скільки всього <b>двоцифрових</b> чисел можна записати в □, щоб було правильно') + '</div>' +
      '<div class="given">□ + ' + q.C + ' &lt; ' + q.T + '</div><div class="line xl">' + SLOT + '</div>';
  }
  if(q.shape === 5){
    const slots = q.fits.map((_, i) => i ? ' <span class="or">' + tr('и', 'і') + '</span> <span class="slot" id="slot' + i + '"></span>' : SLOT).join('');
    return '<div class="ask">' + tr('Кои цифри можем да поставим вместо ❄, така че числото <span class="num">' + q.N + '</span> да <b>не е по-малко</b> от ' + (q.three ? 'трицифреното' : 'двуцифреното') + ' число ❄' + q.d + (q.three ? q.d : '') + '?',
      'Які цифри можна поставити замість ❄, щоб число <span class="num">' + q.N + '</span> було <b>не менше</b> за ' + (q.three ? 'трицифрове' : 'двоцифрове') + ' число ❄' + q.d + (q.three ? q.d : '') + '?') + '</div>' +
      '<div class="line md">' + slots + '</div>';
  }
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
    '<div class="line xl">' + SLOT + '</div>';
}
function eqIneq(q){
  if(q.shape === 7) return ineqDigitText(q).replace('&lt;', '<').replace('&gt;', '>') + ' → ' + q.V + ' → ' + q.ans;
  if(q.shape === 6 || q.shape === 8) return ineqSmallText(q).replace('&lt;', '<').replace('&gt;', '>') + ' → ■ = ' + (q.ans > 1 ? '0 … ' + (q.ans - 1) : '0') + ' → ' + q.ans;
  if(q.shape === 4) return '□ + ' + q.C + ' < ' + q.T + ' → □ < ' + (q.T - q.C) + tr(', двуцифрени: 10 … ', ', двоцифрові: 10 … ') + (q.T - q.C - 1) + ' → ' + q.ans;
  if(q.shape === 5) return '❄' + q.d + (q.three ? q.d : '') + ' ≤ ' + q.N + ' → ❄ = ' + q.fits.join(', ');
  if(q.shape === 3) return q.A + ' − ' + q.B + ' > ? + ' + q.C + tr(' вярно', ' правильно') + ' → ' + q.ans;
  return (q.shape === 2 ? '? + ' + q.C + ' < ' + q.A + ' − ' + q.B
    : q.A + ' − ' + q.B + ' < ? + ' + q.C) + (q.shape === 1 ? tr(' вярно', ' правильно') : tr(' невярно', ' неправильно')) +
    (q.asksSum ? tr(', сборът', ', сума') : '') + ' → ' + q.ans;
}
function whyIneq(q, full){
  if(q.shape === 7){
    if(!full) return tr('Първо пресметни лявата страна. После опитай цифрите на мястото на □.', 'Спершу обчисли ліву частину. Потім пробуй цифри замість □.');
    const head = exprText(q.terms) + ' = <b>' + q.V + '</b> &nbsp;→&nbsp; ';
    if(q.ask === 'which') return head + q.V + (q.more ? ' &gt; ' : ' &lt; ') + q.T + '□ ' + tr('само за ', 'лише для ') + q.T + q.ans + ' &nbsp;→&nbsp; □ = ' + q.ans;
    const fit = []; for(let d = 1; d <= 9; d++) if(q.less ? 10*d > q.V : 10*d < q.V) fit.push(d);
    return head + q.V + (q.less ? ' &lt; □0' : ' &gt; □0') + ' &nbsp;→&nbsp; □ = ' + fit.join(', ') + ' &nbsp;→&nbsp; ' + q.ans;
  }
  if(q.shape === 6 || q.shape === 8){
    if(!full) return tr('Опитвай числата подред, като започнеш от нулата — докога е вярно?', 'Пробуй числа по черзі, починаючи з нуля, — доки правильно?');
    const fit = [...Array(q.ans).keys()];
    return ineqSmallText(q) + ' &nbsp;→&nbsp; ■ &lt; ' + q.ans + ' &nbsp;→&nbsp; ■ = <b>' + fit.join(', ') + '</b> &nbsp;→&nbsp; ' + q.ans;
  }
  if(q.shape === 4){
    if(!full) return tr('Колко най-много може да е □? И само двуцифрените се броят.', 'Яким найбільшим може бути □? І рахуються лише двоцифрові.');
    return '□ + ' + q.C + ' < ' + q.T + ' &nbsp;→&nbsp; □ < ' + (q.T - q.C) + ' &nbsp;→&nbsp; 10, 11, …, ' + (q.T - q.C - 1) + ' &nbsp;→&nbsp; ' + (q.T - q.C - 1) + ' − 10 + 1 = ' + q.ans;
  }
  if(q.shape === 5){
    if(!full) return tr('„Не е по-малко" значи по-голямо или равно. Опитвай цифрите подред.', '«Не менше» означає більше або дорівнює. Пробуй цифри по черзі.');
    const tries = []; for(let t = 1; t <= q.fits[q.fits.length - 1] + 1 && t <= 9; t++) { const v = q.three ? 100*t + 11*q.d : 10*t + q.d; tries.push(v + (v <= q.N ? ' ≤ ' : ' > ') + q.N); }
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
KIND.ineq = { draw:drawIneq, eq:eqIneq, why:whyIneq };
