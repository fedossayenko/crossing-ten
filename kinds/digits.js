// Question kind 'digits': level 18 Сбор на цифрите — How many two-digit numbers have a given digit sum.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 12: digit sums of the two-digit numbers. The count climbs to nine and falls
// back — which is why only the extremes, 1 and 18, happen exactly once.
// Задача 8: from three digits, every two-digit number with two different ones — and a
// leading zero does not make a number, which is what has to be spotted.
function genFromDigits(){
  const pool = shuffle([0,1,2,3,4,5,6,7,8,9]).slice(0, 3);
  if(Math.random() < 0.6 && pool.indexOf(0) < 0) pool[rnd(3)] = 0;
  const made = [];
  pool.forEach(t => pool.forEach(u => { if(t !== u && t !== 0) made.push(10*t + u); }));
  made.sort((a, b) => a - b);
  const asks = rnd(3);                        // the digits added up, how many numbers, or the numbers added up
  const digitSum = made.reduce((s, v) => s + ((v / 10) | 0) + v % 10, 0);
  return {kind:'digits', shape:3, pool: pool.slice().sort((a, b) => a - b), made, asks,
          ans: asks === 0 ? digitSum : asks === 1 ? made.length : made.reduce((s, v) => s + v, 0)};
}
// Коледно 2024, задача 5: of 22, 45, 76, 81, 57, 92, 84, 49, 37, 41, 69, 62, 51, how many have a
// ones digit at least 2 bigger than the tens digit: 57, 49, 37, 69. 45 is only 1 bigger.
function genDigitGap(){
  for(;;){
    const k = 1 + rnd(3), ones = Math.random() < 0.7, list = [];
    while(list.length < 13){ const v = 10 + rnd(90); if(!list.includes(v)) list.push(v); }
    const ok = v => (ones ? v % 10 - Math.floor(v / 10) : Math.floor(v / 10) - v % 10) >= k;
    const ans = list.filter(ok).length, near = list.filter(v => (ones ? v % 10 - Math.floor(v / 10) : Math.floor(v / 10) - v % 10) === k - 1).length;
    if(ans < 2 || ans > 7 || !near) continue;
    return {kind:'digits', shape:4, k, ones, list, traps:[ans + near], ans};
  }
}
function genDigits(){
  if(Math.random() < 0.18) return genDigitGap();
  if(Math.random() < 0.28) return genFromDigits();
  if(Math.random() < 0.3){
    // Задача 15: one digit fixed, the other either side of it. The tens digit cannot
    // be zero, which is what makes the two cases come out different.
    const d = 2 + rnd(7);
    const smaller = Math.random() < 0.6;
    const list = [];
    for(let o = 0; o <= 9; o++) if(smaller ? o < d : o > d) list.push(10*d + o);
    for(let t = 1; t <= 9; t++) if(smaller ? t < d : t > d) list.push(10*t + d);
    return {kind:'digits', shape:2, d, smaller, list: list.sort((x, y) => x - y), ans: list.length};
  }
  if(Math.random() < 0.18) return {kind:'digits', shape:1, ans:19};
  const n = 1 + rnd(18);
  return {kind:'digits', shape:0, n, ans: n <= 9 ? n : 19 - n};
}
const twoDigitWith = n => { const out = []; for(let v = 10; v <= 99; v++) if((v%10) + Math.floor(v/10) === n) out.push(v); return out; };

function drawDigits(q){
  if(q.kind === 'digits' && q.shape === 4){
    const [bgA, bgB] = q.ones ? ['единиците', 'десетиците'] : ['десетиците', 'единиците'], [ukA, ukB] = q.ones ? ['одиниць', 'десятків'] : ['десятків', 'одиниць'];
    return '<div class="ask">' + tr('Колко от числата <span class="num">' + q.list.join(', ') + '</span> имат цифра на ' + bgA + ', <b>поне с ' + q.k + ' по-голяма</b> от цифрата на ' + bgB + '?',
      'Скільки з чисел <span class="num">' + q.list.join(', ') + '</span> мають цифру ' + ukA + ' <b>щонайменше на ' + q.k + ' більшу</b> за цифру ' + ukB + '?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'digits' && q.shape === 3){
    const what = q.asks === 0 ? tr('Пресметнете <b>сбора на цифрите</b> на всички', 'Обчисліть <b>суму цифр</b> усіх')
               : q.asks === 1 ? tr('<b>Колко са</b> всички', '<b>Скільки всього</b> є')
               : tr('Пресметнете <b>сбора</b> на всички', 'Обчисліть <b>суму</b> всіх');
    return '<div class="ask">' + what + tr(' двуцифрени числа, записани с <b>различни цифри</b> измежду цифрите <span class="num">',
      ' двоцифрових чисел, записаних <b>різними цифрами</b> з цифр <span class="num">') +
      q.pool.join(', ') + '</span>' + (q.asks === 1 ? '?' : '.') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'digits'){
    const ask = q.shape === 2
      ? tr('Колко са двуцифрените числа, една от цифрите на които е <span class="num">' + q.d +
        '</span>, а другата е <b>' + (q.smaller ? 'по-малка' : 'по-голяма') + '</b> от <span class="num">' + q.d + '</span>?',
        'Скільки є двоцифрових чисел, одна з цифр яких — <span class="num">' + q.d +
        '</span>, а друга <b>' + (q.smaller ? 'менша' : 'більша') + '</b> від <span class="num">' + q.d + '</span>?')
      : q.shape === 0
      ? tr('Колко двуцифрени числа имат сбор на цифрите <span class="num">', 'Скільки двоцифрових чисел мають суму цифр <span class="num">') +
        q.n + '</span>?'
      : tr('Вместо да запиша всичките 90 двуцифрени числа, записах пресметнатите 90 сбора от цифрите им. Колко е сборът на сборовете, които се срещат само веднъж?',
        'Замість усіх 90 двоцифрових чисел записали 90 сум їхніх цифр. Чому дорівнює сума тих сум, які трапляються лише один раз?');
    return '<div class="ask">' + ask + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
const digitGapOk = q => q.list.filter(v => (q.ones ? v % 10 - Math.floor(v / 10) : Math.floor(v / 10) - v % 10) >= q.k);
function eqDigits(q){
  if(q.kind === 'digits' && q.shape === 4) return digitGapOk(q).join(', ') + ' → ' + q.ans;
  if(q.kind === 'digits' && q.shape === 3) return tr('от ', 'з ') + q.pool.join(',') + ' → ' + q.made.join(', ') + ' → ' + q.ans;
  if(q.kind === 'digits' && q.shape === 2) return tr('едната цифра ' + q.d + ', другата ' +
    (q.smaller ? 'по-малка' : 'по-голяма'), 'одна цифра ' + q.d + ', друга ' + (q.smaller ? 'менша' : 'більша')) + ' → ' + q.ans;
  if(q.kind === 'digits') return q.shape === 0
    ? tr('сбор на цифрите ', 'сума цифр ') + q.n + ' → ' + q.ans
    : tr('срещат се веднъж: 1 и 18 → ', 'трапляються один раз: 1 і 18 → ') + q.ans;
}
function whyDigits(q, full){
  if(q.kind === 'digits' && q.shape === 4){
    if(!full) return tr('За всяко число: с колко се различават двете цифри — и коя е по-голямата?', 'Для кожного числа: на скільки відрізняються дві цифри — і яка з них більша?');
    return tr('стават: ', 'підходять: ') + digitGapOk(q).map(v => '<b>' + v + '</b>').join(', ') + tr(' — «поне с ', ' — «щонайменше на ') + q.k + tr('» значи ', '» означає ') + q.k + tr(' или повече', ' або більше') + ' &nbsp;→&nbsp; ' + q.ans;
  }
  if(q.kind === 'digits' && q.shape === 2){
    if(!full) return tr('Цифрата на десетиците не може да е нула.', 'Цифра десятків не може бути нулем.');
    return q.list.join(', ') + ' &nbsp;→&nbsp; ' + q.ans;
  }
  if(q.kind === 'digits' && q.shape === 3){
    if(!full) return q.pool.indexOf(0) >= 0 ? tr('Число не може да започва с нула — това маха няколко от списъка.',
                                                'Число не може починатися з нуля — через це кілька чисел випадають зі списку.')
                                             : tr('Всяка двойка цифри дава две числа, според коя е отпред.',
                                                'Кожна пара цифр дає два числа — залежно від того, яка цифра стоїть першою.');
    const tail = q.asks === 0
      ? q.made.map(v => ((v / 10) | 0) + ' + ' + v % 10).join(', ') + ' &nbsp;→&nbsp; ' + q.ans
      : q.asks === 1 ? tr('на брой ', 'усього ') + q.ans
      : q.made.join(' + ') + ' = ' + q.ans;
    return tr('числата са <b>', 'числа: <b>') + q.made.join(', ') + '</b> &nbsp;→&nbsp; ' + tail;
  }
  if(q.kind === 'digits'){
    if(!full) return q.shape === 0 ? tr('Опитай по десетиците подред.', 'Перебери десятки по черзі.')
                                   : tr('Кои сборове се получават само от едно число?', 'Які суми виходять лише в одного числа?');
    if(q.shape === 1) return tr('само <b>10</b> дава 1, само <b>99</b> дава 18, всички други се повтарят',
      'лише <b>10</b> дає 1, лише <b>99</b> дає 18, усі інші повторюються') +
      ' &nbsp;→&nbsp; 1 + 18 = ' + q.ans;
    return twoDigitWith(q.n).join(', ') + ' &nbsp;→&nbsp; ' + q.ans;
  }
}
KIND.digits = { draw:drawDigits, eq:eqDigits, why:whyDigits };
