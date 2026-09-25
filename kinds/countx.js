// Question kind 'countx': level 132 По-малки от 50 − 10 · 2 — How many two-digit numbers fit a bound that is itself a sum to work out.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Пролет 2025, задача 5: two-digit numbers less than 50 − 10 · 2. Multiplication first: the
// bound is 30, and 10 to 29 are 20 numbers. Worked left to right it would be 800, which is the trap.
function genCountX(){
  for(;;){
    const form = rnd(3), a = 10*(3 + rnd(7)), b = 2 + rnd(9), c = 2 + rnd(4);
    const N = form === 0 ? a - b*c : form === 1 ? b*c + a / 10 : a + b*c;
    const rel = rnd(3);   // 0 less than, 1 not bigger than, 2 bigger than
    if(N < 12 || N > 95) continue;
    const ans = rel === 0 ? N - 10 : rel === 1 ? N - 9 : 99 - N;
    const wrong = form === 0 ? (a - b)*c : form === 2 ? (a + b)*c : null;
    return {kind:'countx', form, a, b, c, N, rel, traps: wrong !== null && wrong >= 10 && wrong <= 99 ? [rel === 0 ? wrong - 10 : rel === 1 ? wrong - 9 : 99 - wrong] : [], ans};
  }
}
const countXExpr = q => q.form === 0 ? q.a + ' − ' + q.b + ' · ' + q.c : q.form === 1 ? q.b + ' · ' + q.c + ' + ' + q.a / 10 : q.a + ' + ' + q.b + ' · ' + q.c;
function drawCountX(q){
  if(q.kind === 'countx'){
    const rel = [tr('по-малки от', 'менші від'), tr('не са по-големи от', 'не більші за'), tr('по-големи от', 'більші за')][q.rel];
    return '<div class="ask">' + tr('Колко са <b>двуцифрените</b> числа, които са ' + rel + ' числото, равно на <span class="num">' + countXExpr(q) + '</span>?',
      'Скільки є <b>двоцифрових</b> чисел, які ' + rel + ' число, що дорівнює <span class="num">' + countXExpr(q) + '</span>?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqCountX(q){
  if(q.kind === 'countx') return countXExpr(q) + ' = ' + q.N + ' → ' + q.ans;
}
function whyCountX(q, full){
  if(q.kind === 'countx'){
    if(!full) return tr('Първо пресметни числото — умножението е преди събирането и изваждането.', 'Спершу обчисли число — множення виконують раніше за додавання й віднімання.');
    const [lo, hi] = q.rel === 0 ? [10, q.N - 1] : q.rel === 1 ? [10, q.N] : [q.N + 1, 99];
    return countXExpr(q) + ' = <b>' + q.N + '</b> &nbsp;→&nbsp; ' + tr('от ', 'від ') + lo + tr(' до ', ' до ') + hi + ' &nbsp;→&nbsp; ' + hi + ' − ' + lo + ' + 1 = ' + q.ans;
  }
}
KIND.countx = { draw:drawCountX, eq:eqCountX, why:whyCountX };
