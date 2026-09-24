// Question kind 'minuend': level 92 Най-малкото умаляемо — The smallest a number can be, given a difference.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Коледно състезание 2025, задача 4: the difference of two numbers is 4 — the smallest possible
// minuend? 4, since 4 − 0 = 4: the 0 is allowed and is the whole trick. When the numbers
// have to be two-digit it is 10 more, and when neither may be 0 it is one more.
function genMinuend(){
  const d = 2 + rnd(15), kind = [0, 0, 1, 2][rnd(4)], asks = rnd(2);        // asks: the minuend, or the sum of the two
  const sub = kind === 0 ? 0 : kind === 1 ? 10 : 1;
  return {kind:'minuend', d, which: kind, asks, sub, ans: asks === 0 ? sub + d : 2*sub + d};
}
const minuendWhat = q => q.which === 1 ? tr('<b>двуцифрени</b> числа', '<b>двоцифрових</b> чисел') : q.which === 2 ? tr('числа, <b>различни от 0</b>,', 'чисел, <b>відмінних від 0</b>,') : tr('числа', 'чисел');
function drawMinuend(q){
  if(q.kind === 'minuend'){
    const ask = q.asks === 0 ? tr('Колко е <b>най-малкото</b> възможно умаляемо?', 'Яке <b>найменше</b> можливе зменшуване?')
                             : tr('Колко е <b>най-малкият</b> възможен сбор на двете числа?', 'Яка <b>найменша</b> можлива сума цих двох чисел?');
    return '<div class="ask">' + tr('Разликата на две ', 'Різниця двох ') + minuendWhat(q) + tr(' е <span class="num">', ' дорівнює <span class="num">') + q.d + '</span>. ' + ask + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqMinuend(q){
  if(q.kind === 'minuend') return (q.sub + q.d) + ' − ' + q.sub + ' = ' + q.d + (q.asks ? ' → ' + (q.sub + q.d) + ' + ' + q.sub : '') + ' → ' + q.ans;
}
function whyMinuend(q, full){
  if(q.kind === 'minuend'){
    if(!full) return tr('Умалителят трябва да е възможно най-малък. Кое е най-малкото число, което може да бъде?', 'Від’ємник має бути якомога меншим. Яке найменше число він може бути?');
    const low = q.which === 0 ? tr('най-малкият умалител е <b>0</b>', 'найменший від’ємник — <b>0</b>') : q.which === 1 ? tr('най-малкото двуцифрено е <b>10</b>', 'найменше двоцифрове — <b>10</b>') : tr('без 0 най-малкото е <b>1</b>', 'без 0 найменше — <b>1</b>');
    return low + ' &nbsp;→&nbsp; ' + (q.sub + q.d) + ' − ' + q.sub + ' = ' + q.d + ' &nbsp;→&nbsp; ' +
      (q.asks ? (q.sub + q.d) + ' + ' + q.sub + ' = ' + q.ans : tr('умаляемото е ', 'зменшуване — ') + q.ans);
  }
}
KIND.minuend = { draw:drawMinuend, eq:eqMinuend, why:whyMinuend };
