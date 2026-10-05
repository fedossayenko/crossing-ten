// Question kind 'digperm': level 167 Всички двуцифрени — Every two-digit number from given digits, added up.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Пролет 2023, 1 клас, задача 6: two worked examples — 1, 2 give 12 and 21, 12 + 21 = 33;
// 0, 1, 2 give 10, 12, 20, 21, sum 63 — then 0, 1, 3: 10, 13, 30, 31, and 10 + 13 + 30 + 31 = 84.
// Two different digits in each number, and 0 never in front.
const digPermNums = ds => { const r = []; ds.forEach(a => ds.forEach(b => { if(a !== b && a) r.push(10*a + b); })); return r.sort((x, y) => x - y); };
// МБГ Пролет 2021, 1 клас, задача 15: not the sum but how many. 5, 2, 1 make 10 < 12 < 15 < 21 < 25 < 51 <
// 52 < 100 — 6 numbers; 2, 6, 0 make 20, 26, 60, 62 — 4, as 0 never stands in front. The digits as printed, unsorted.
function genDigCount(){
  for(;;){
    // three digits, with a 0 or without, or now and then two or four; never a 1 beside the 0 — 10 would be the frame's own 10
    const zero = Math.random() < 0.5, k = Math.random() < 0.7 ? 3 : Math.random() < 0.5 ? 2 : 4;
    const ds = shuffle((zero ? [0] : []).concat(Array.from({length: zero ? k - 1 : k}, () => 1 + rnd(9))));
    if(new Set(ds).size !== ds.length || (zero && ds.includes(1)) || ds.slice().sort().join() === '1,2,5') continue;
    const nums = digPermNums(ds);
    return {kind:'digperm', shape:'count', ds, nums, ans: nums.length};
  }
}
function genDigPerm(){
  if(Math.random() < 0.35) return genDigCount();
  for(;;){
    // two digits without a 0, or three with one; the sum kept within 100, and not one of the examples
    const ds = Math.random() < 0.2 ? [0, 1, 2 + rnd(2)] : [1 + rnd(8), 1 + rnd(8)].sort((a, b) => a - b);
    if(new Set(ds).size !== ds.length || ds.join() === '1,2' || ds.join() === '0,1,2') continue;
    const nums = digPermNums(ds), S = nums.reduce((t, v) => t + v, 0);
    if(S > 99) continue;
    return {kind:'digperm', ds, nums, ans: S};
  }
}
function drawDigPerm(q){
  if(q.kind === 'digperm' && q.shape === 'count'){
    return '<div class="ask">' + tr('Виж примера. <b>Колко</b> двуцифрени числа с различни цифри могат да се запишат с дадените цифри?',
      'Подивись на приклад. <b>Скільки</b> двоцифрових чисел з різними цифрами можна записати з даних цифр?') + '</div>' +
      '<div class="given" style="font-size:clamp(14px,3.8vw,20px)">5, 2, 1 &nbsp;⟹&nbsp; 10 &lt; 12 &lt; 15 &lt; 21 &lt; 25 &lt; 51 &lt; 52 &lt; 100 &nbsp;→&nbsp; ' + tr('6 числа', '6 чисел') + '</div>' +
      '<div class="line" style="font-size:clamp(20px,6vw,36px)">' + q.ds.join(', ') + ' &nbsp;⟹&nbsp; 10 &lt; … &lt; 100 &nbsp;→&nbsp; ' + SLOT + '</div>';
  }
  if(q.kind === 'digperm'){
    const row = (ds, nums, last) => '<div class="given" style="font-size:clamp(14px,3.8vw,20px)">' + ds.join(', ') + ' &nbsp;⟹&nbsp; ' + nums.join(', ') + '; &nbsp;' + nums.join(' + ') + ' = ' + last + '</div>';
    return '<div class="ask">' + tr('Виж примерите. Запиши <b>всички двуцифрени числа</b> с различни цифри от дадените и ги събери.',
      'Подивись на приклади. Випиши <b>усі двоцифрові числа</b> з різними цифрами з даних і додай їх.') + '</div>' +
      row([1, 2], [12, 21], 33) + row([0, 1, 2], [10, 12, 20, 21], 63) +
      '<div class="line" style="font-size:clamp(20px,6vw,36px)">' + q.ds.join(', ') + ' &nbsp;⟹&nbsp; ' + q.nums.map(() => '…').join(' + ') + ' = ' + SLOT + '</div>';
  }
}
function eqDigPerm(q){
  if(q.kind === 'digperm' && q.shape === 'count') return q.ds.join(', ') + ' → ' + q.nums.join(', ') + ' → ' + q.ans;
  if(q.kind === 'digperm') return q.ds.join(', ') + ' → ' + q.nums.join(' + ') + ' = ' + q.ans;
}
function whyDigPerm(q, full){
  if(q.kind === 'digperm'){
    if(!full) return tr('Запиши числата подред: първо с най-малката цифра отпред, после със следващата. 0 не може да стои отпред.',
      'Випиши числа по порядку: спершу з найменшою цифрою попереду, потім з наступною. 0 не може стояти попереду.');
    return tr('от ', 'з ') + q.ds.join(', ') + ': <b>' + q.nums.join(', ') + '</b>' + (q.ds.includes(0) ? tr(' (0 не стои отпред)', ' (0 не стоїть попереду)') : '') +
      ' &nbsp;→&nbsp; ' + (q.shape === 'count' ? tr('на брой ', 'усього ') + q.ans : q.nums.join(' + ') + ' = ' + q.ans);
  }
}
KIND.digperm = { draw:drawDigPerm, eq:eqDigPerm, why:whyDigPerm };
