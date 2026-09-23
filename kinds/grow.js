// Question kind 'grow': level 14 Нов сбор — Every addend changes by the same amount.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 7: every addend moves by the same amount, so the sum moves that many times.
function genGrow(){
  const k = 2 + rnd(3);
  const d = 2 + rnd(5);
  const up = Math.random() < 0.65;
  const base = up ? 3 + rnd(15) : k*d + rnd(12);
  return {kind:'grow', k, d, up, base, ans: up ? base + k*d : base - k*d};
}

const growUkGen = {2:'двох', 3:'трьох', 4:'чотирьох'};
function drawGrow(q){
  if(q.kind === 'grow'){
    return '<div class="ask">' + tr('Сборът на ' + BGNUM[q.k] + ' числа е <span class="num">' + q.base +
      '</span>. Всяко от събираемите ' + (q.up ? 'увеличаваме' : 'намаляваме') +
      ' с <span class="num">' + q.d + '</span>. Колко е новият сбор?',
      'Сума ' + growUkGen[q.k] + ' чисел дорівнює <span class="num">' + q.base +
      '</span>. Кожен доданок ' + (q.up ? 'збільшуємо' : 'зменшуємо') +
      ' на <span class="num">' + q.d + '</span>. Якою буде нова сума?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqGrow(q){
  if(q.kind === 'grow') return tr(BGNUM[q.k] + ' числа, сбор ' + q.base + ', всяко ',
    UKNUM[q.k] + ' числа, сума ' + q.base + ', кожне ') + (q.up ? '+' : '−') + q.d + ' → ' + q.ans;
}
function whyGrow(q, full){
  if(q.kind === 'grow'){
    if(!full) return tr('Всяко число се променя — колко пъти общо?', 'Змінюється кожне число — скільки разів загалом?');
    const step = Array(q.k).fill(q.d).join(' + ');
    return step + ' = <b>' + (q.k*q.d) + '</b> ' + (q.up ? tr('повече', 'більше') : tr('по-малко', 'менше')) +
      ' &nbsp;→&nbsp; ' + q.base + ' ' + (q.up ? '+' : '−') + ' ' + (q.k*q.d) + ' = ' + q.ans;
  }
}
KIND.grow = { draw:drawGrow, eq:eqGrow, why:whyGrow };
