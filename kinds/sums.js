// Question kind 'sums': level 24 Колко сбора? — How many different results two numbers can make.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 18: how many different results are reachable — find the two ends, count between.
// МБГ Зима 2023: two different numbers picked from a short list, at least one of them two-digit;
// how many different sums. Listing the pairs is the method, and a repeated sum counts once.
function genSumsList(){
  for(;;){
    const nums = shuffle([1,2,3,4,5,6,7,8,9]).slice(0, 2).concat(shuffle([10,11,12,13,20,21,22,30,31]).slice(0, 2 + rnd(2))).sort((a, b) => a - b);
    const two = Math.random() < 0.7, pairs = [];
    for(let i = 0; i < nums.length; i++) for(let j = i + 1; j < nums.length; j++) if(!two || nums[j] >= 10) pairs.push([nums[i], nums[j]]);
    const sums = [...new Set(pairs.map(([a, b]) => a + b))];
    return {kind:'sums', shape:4, nums, two, pairs, ans: sums.length};
  }
}
function genSums(){
  if(Math.random() < 0.25) return genSumsList();
  const shape = rnd(3);
  if(shape === 0){ const k = 2 + rnd(3); return {kind:'sums', shape, k, top: 9*k, ans: 9*k + 1}; }
  if(shape === 1){ const n = 3 + rnd(10); return {kind:'sums', shape, n, top: 2*n, ans: 2*n + 1}; }
  return {kind:'sums', shape, top: 9, ans: 10};
}

// МБГ Есен, 3 клас, задача 7: how many different two-digit numbers the sum of two two-digit
// numbers can be — from 10 + 10 = 20 up to 99, so 80. Counted by brute force over every pair.
const SUMS_TWO = [
  ['двуцифрени числа можем да получим при събирането на две двуцифрени числа', 'двоцифрових чисел можна отримати, додаючи два двоцифрові числа', (x, y) => x + y, v => v <= 99],
  ['трицифрени числа можем да получим при събирането на две двуцифрени числа', 'трицифрових чисел можна отримати, додаючи два двоцифрові числа', (x, y) => x + y, v => v >= 100],
  ['двуцифрени числа можем да получим като разлика на две двуцифрени числа', 'двоцифрових чисел можна отримати як різницю двох двоцифрових чисел', (x, y) => x - y, v => v >= 10],
  ['двуцифрени числа можем да получим при събирането на две <b>различни</b> двуцифрени числа', 'двоцифрових чисел можна отримати, додаючи два <b>різні</b> двоцифрові числа', (x, y) => x === y ? -1 : x + y, v => v >= 10 && v <= 99]
];
function genSumsTwo(){
  const v = rnd(SUMS_TWO.length), got = new Set();
  for(let x = 10; x <= 99; x++) for(let y = 10; y <= 99; y++){ const r = SUMS_TWO[v][2](x, y); if(r >= 0 && SUMS_TWO[v][3](r)) got.add(r); }
  const all = [...got].sort((a, b) => a - b);
  return {kind:'sums', shape:3, v, lo: all[0], hi: all[all.length - 1], ans: all.length, traps: [all.length - 1, all[all.length - 1] - all[0]].filter(n => n !== all.length)};
}

const sumsUkGen = {2:'двох', 3:'трьох', 4:'чотирьох'};
function drawSums(q){
  if(q.kind === 'sums' && q.shape === 4){
    const list = q.nums.slice(0, -1).join(', ') + tr(' и ', ' і ') + q.nums[q.nums.length - 1];
    return '<div class="ask">' + tr('Съберете две <b>различни</b> числа от числата <span class="num">' + list + '</span>' + (q.two ? ', като <b>поне едното</b> събираемо е двуцифрено' : '') + '. Колко <b>различни</b> сбора ще получите?',
      'Додайте два <b>різні</b> числа з чисел <span class="num">' + list + '</span>' + (q.two ? ', причому <b>хоча б один</b> доданок двоцифровий' : '') + '. Скільки <b>різних</b> сум ви отримаєте?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'sums' && q.shape === 3){
    return '<div class="ask">' + tr('Колко различни ' + SUMS_TWO[q.v][0] + '?', 'Скільки різних ' + SUMS_TWO[q.v][1] + '?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
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
  if(q.kind === 'sums' && q.shape === 4) return q.pairs.map(([a, b]) => a + b).join(', ') + ' → ' + q.ans;
  if(q.kind === 'sums' && q.shape === 3) return tr('от ', 'від ') + q.lo + tr(' до ', ' до ') + q.hi + ' → ' + q.ans;
  if(q.kind === 'sums') return tr('от 0 до ', 'від 0 до ') + q.top + ' → ' + q.ans;
}
function whySums(q, full){
  if(q.kind === 'sums' && q.shape === 4){
    if(!full) return tr('Изпиши всички двойки подред — ' + (q.two ? 'без двете едноцифрени заедно — ' : '') + 'и зачеркни сборовете, които се повтарят.',
      'Випиши всі пари по черзі — ' + (q.two ? 'без двох одноцифрових разом — ' : '') + 'і закресли суми, що повторюються.');
    const seen = new Set();
    return q.pairs.map(([a, b]) => { const r = a + b, dup = seen.has(r); seen.add(r); return a + ' + ' + b + ' = ' + (dup ? '<s>' + r + '</s>' : r); }).join('; ') + ' &nbsp;→&nbsp; ' + q.ans;
  }
  if(q.kind === 'sums' && q.shape === 3){
    if(!full) return tr('Намери най-малкия и най-големия възможен резултат, после преброй всички между тях.',
                        'Знайди найменший і найбільший можливий результат, потім порахуй усі між ними.');
    return tr('най-малкото е <b>' + q.lo + '</b>, най-голямото е <b>' + q.hi + '</b>', 'найменше — <b>' + q.lo + '</b>, найбільше — <b>' + q.hi + '</b>') +
      ' &nbsp;→&nbsp; ' + q.hi + ' − ' + q.lo + ' + 1 = ' + q.ans;
  }
  if(q.kind === 'sums'){
    if(!full) return tr('Кой е най-малкият и кой най-големият резултат?', 'Який результат найменший, а який найбільший?');
    return tr('най-малкото е <b>0</b>, най-голямото е <b>' + q.top + '</b> &nbsp;→&nbsp; от 0 до ' + q.top +
      ' &nbsp;(с нулата) &nbsp;→&nbsp; ',
      'найменший — <b>0</b>, найбільший — <b>' + q.top + '</b> &nbsp;→&nbsp; від 0 до ' + q.top +
      ' &nbsp;(разом із нулем) &nbsp;→&nbsp; ') + q.ans;
  }
}
KIND.sums = { draw:drawSums, eq:eqSums, why:whySums };
