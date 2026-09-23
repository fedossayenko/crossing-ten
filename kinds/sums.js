// Question kind 'sums': level 24 Колко сбора? — How many different results two numbers can make.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 18: how many different results are reachable — find the two ends, count between.
function genSums(){
  const shape = rnd(3);
  if(shape === 0){ const k = 2 + rnd(3); return {kind:'sums', shape, k, top: 9*k, ans: 9*k + 1}; }
  if(shape === 1){ const n = 3 + rnd(10); return {kind:'sums', shape, n, top: 2*n, ans: 2*n + 1}; }
  return {kind:'sums', shape, top: 9, ans: 10};
}

const sumsUkGen = {2:'двох', 3:'трьох', 4:'чотирьох'};
function drawSums(q){
  if(q.kind === 'sums'){
    const ask = q.shape === 0
      ? tr('Колко различни числа можем да получим при сбор на ' + BGNUM[q.k] + ' едноцифрени числа?',
           'Скільки різних чисел можна отримати як суму ' + sumsUkGen[q.k] + ' одноцифрових чисел?')
      : q.shape === 1
      ? tr('Колко различни числа можем да получим при сбор на две числа, всяко от които не е по-голямо от <span class="num">' + q.n + '</span>?',
           'Скільки різних чисел можна отримати як суму двох чисел, кожне з яких не більше за <span class="num">' + q.n + '</span>?')
      : tr('Колко различни числа можем да получим при разлика на две едноцифрени числа?',
           'Скільки різних чисел можна отримати як різницю двох одноцифрових чисел?');
    return '<div class="ask">' + ask + '</div>' +
      '<div class="note">' + tr('Числата са', 'Числа:') + ' 0, 1, 2, 3, …</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqSums(q){
  if(q.kind === 'sums') return tr('от 0 до ', 'від 0 до ') + q.top + ' → ' + q.ans;
}
function whySums(q, full){
  if(q.kind === 'sums'){
    if(!full) return tr('Кой е най-малкият и кой най-големият резултат?', 'Який результат найменший, а який найбільший?');
    return tr('най-малкото е <b>0</b>, най-голямото е <b>' + q.top + '</b> &nbsp;→&nbsp; от 0 до ' + q.top +
      ' &nbsp;(с нулата) &nbsp;→&nbsp; ',
      'найменший — <b>0</b>, найбільший — <b>' + q.top + '</b> &nbsp;→&nbsp; від 0 до ' + q.top +
      ' &nbsp;(разом із нулем) &nbsp;→&nbsp; ') + q.ans;
  }
}
KIND.sums = { draw:drawSums, eq:eqSums, why:whySums };
