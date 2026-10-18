// Question kind 'digits': level 18 Сбор на цифрите — How many two-digit numbers have a given digit sum.

// Задача 12: digit sums of the two-digit numbers. The count climbs to nine and falls
// back — which is why only the extremes, 1 and 18, happen exactly once.
// Задача 8: from three digits, every two-digit number with two different ones — and a
// leading zero does not make a number, which is what has to be spotted.
import { KIND, SLOT, rnd, shuffle, tr, ukN } from '../js/core.js';
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
// Level 286. Аз и числата 2025, задача 6: colour the squares whose numbers have 2 десетици — 26 52 84 27 25 /
// 92 23 21 42 72 / 12 28 24 69 22: eight of them. The traps hold the 2 as their ones: 52, 92, 42, 72, 12.
// Here: how many. Аз и числата 2022, задача 5 (shape 'all') asks to write every two-digit number with tens
// digit 5 — 50 to 59, ten; here how many, and with a given ones digit there are nine, as 0 cannot lead.
// Аз и числата 2023, задача 1 (shape 'even'): 10 □ □ □ □ 20 — the two-digit numbers between 10 and 20 that divide
// by 2 go in the boxes: 12, 14, 16, 18. «Between» leaves out 10 and 20.
export function genTensDigit(){
  const w = Math.random();
  if(w < 0.3){
    const lo = 10*(1 + rnd(8)), list = [2, 4, 6, 8].map(u => lo + u);
    return {kind:'digits', shape:'even', lo, hi: lo + 10, slots:4, ordered:true, ans: list[0], alt: list.slice(1)};
  }
  if(w < 0.55){
    const tens = Math.random() < 0.6, d = tens ? 1 + rnd(9) : rnd(10);
    return {kind:'digits', shape:'all', tens, d, traps:[tens ? 9 : 10], ans: tens ? 10 : 9};
  }
  const t = 1 + rnd(9), k = 5 + rnd(5), j = 3 + rnd(3);
  const own = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(u => 10*t + u)).slice(0, k);
  const swapped = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9].filter(x => x !== t).map(x => 10*x + t)).slice(0, j);
  const others = [];
  for(let v = 10; v <= 99; v++) if(Math.floor(v / 10) !== t && v % 10 !== t) others.push(v);
  return {kind:'digits', shape:'grid', t, list: shuffle(own.concat(swapped, shuffle(others).slice(0, 15 - k - j))), traps:[k + j], ans: k};
}
const tensDigitOwn = q => q.list.filter(v => Math.floor(v / 10) === q.t);
const tensDigitAll = q => { const out = []; for(let v = 10; v <= 99; v++) if((q.tens ? Math.floor(v / 10) : v % 10) === q.d) out.push(v); return out; };
const tensDigitBg = t => t + ' ' + (t === 1 ? 'десетица' : 'десетици');
// a line of numbers and boxes that has to fit its own length on a phone
const TD_LINE = '<div class="line" style="font-size:clamp(20px,5.5vw,34px)">';
export function genDigits(){
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
  if(q.shape === 'grid'){
    const td = v => '<td style="border:1.5px solid var(--muted); padding:4px 10px; text-align:center">' + v + '</td>';
    return '<div class="ask">' + tr('Колко от числата в таблицата имат <b>' + tensDigitBg(q.t) + '</b>?', 'Скільки чисел у таблиці мають <b>' + ukN(q.t, 'десяток', 'десятки', 'десятків') + '</b>?') + '</div>' +
      '<table style="margin:8px auto; border-collapse:collapse; font-family:Fredoka,sans-serif; font-size:clamp(18px,5.5vw,26px)">' +
      [0, 1, 2].map(r => '<tr>' + q.list.slice(5*r, 5*r + 5).map(td).join('') + '</tr>').join('') + '</table>' +
      '<div class="line xl">' + SLOT + '</div>';
  }
  if(q.shape === 'all'){
    return '<div class="ask">' + tr('Колко са <b>двуцифрените</b> числа с цифра на ' + (q.tens ? 'десетиците' : 'единиците') + ' <span class="num">' + q.d + '</span>?',
      'Скільки є <b>двоцифрових</b> чисел із цифрою ' + (q.tens ? 'десятків' : 'одиниць') + ' <span class="num">' + q.d + '</span>?') + '</div>' +
      '<div class="line xl">' + SLOT + '</div>';
  }
  if(q.shape === 'even'){
    return '<div class="ask">' + tr('Запиши всички двуцифрени числа между <span class="num">' + q.lo + '</span> и <span class="num">' + q.hi + '</span>, които се делят на <span class="num">2</span>.',
      'Напиши всі двоцифрові числа між <span class="num">' + q.lo + '</span> і <span class="num">' + q.hi + '</span>, які діляться на <span class="num">2</span>.') + '</div>' +
      TD_LINE + q.lo + ' ' + SLOT + ' <span class="slot" id="slot1"></span> <span class="slot" id="slot2"></span> <span class="slot" id="slot3"></span> ' + q.hi + '</div>';   // the paper's row: 10 □ □ □ □ 20
  }
  if(q.shape === 4){
    const [bgA, bgB] = q.ones ? ['единиците', 'десетиците'] : ['десетиците', 'единиците'], [ukA, ukB] = q.ones ? ['одиниць', 'десятків'] : ['десятків', 'одиниць'];
    return '<div class="ask">' + tr('Колко от числата <span class="num">' + q.list.join(', ') + '</span> имат цифра на ' + bgA + ', <b>поне с ' + q.k + ' по-голяма</b> от цифрата на ' + bgB + '?',
      'Скільки з чисел <span class="num">' + q.list.join(', ') + '</span> мають цифру ' + ukA + ' <b>щонайменше на ' + q.k + ' більшу</b> за цифру ' + ukB + '?') + '</div>' +
      '<div class="line xl">' + SLOT + '</div>';
  }
  if(q.shape === 3){
    const what = q.asks === 0 ? tr('Пресметнете <b>сбора на цифрите</b> на всички', 'Обчисліть <b>суму цифр</b> усіх')
               : q.asks === 1 ? tr('<b>Колко са</b> всички', '<b>Скільки всього</b> є')
               : tr('Пресметнете <b>сбора</b> на всички', 'Обчисліть <b>суму</b> всіх');
    return '<div class="ask">' + what + tr(' двуцифрени числа, записани с <b>различни цифри</b> измежду цифрите <span class="num">',
      ' двоцифрових чисел, записаних <b>різними цифрами</b> з цифр <span class="num">') +
      q.pool.join(', ') + '</span>' + (q.asks === 1 ? '?' : '.') + '</div>' +
      '<div class="line xl">' + SLOT + '</div>';
  }
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
    '<div class="line xl">' + SLOT + '</div>';
}
const digitGapOk = q => q.list.filter(v => (q.ones ? v % 10 - Math.floor(v / 10) : Math.floor(v / 10) - v % 10) >= q.k);
function eqDigits(q){
  if(q.shape === 'grid') return tensDigitOwn(q).join(', ') + ' → ' + q.ans;
  if(q.shape === 'all'){ const a = tensDigitAll(q); return a[0] + ', ' + a[1] + ', …, ' + a[a.length - 1] + ' → ' + q.ans; }
  if(q.shape === 'even') return [q.ans].concat(q.alt).join(', ');
  if(q.shape === 4) return digitGapOk(q).join(', ') + ' → ' + q.ans;
  if(q.shape === 3) return tr('от ', 'з ') + q.pool.join(',') + ' → ' + q.made.join(', ') + ' → ' + q.ans;
  if(q.shape === 2) return tr('едната цифра ' + q.d + ', другата ' +
    (q.smaller ? 'по-малка' : 'по-голяма'), 'одна цифра ' + q.d + ', друга ' + (q.smaller ? 'менша' : 'більша')) + ' → ' + q.ans;
  return q.shape === 0
    ? tr('сбор на цифрите ', 'сума цифр ') + q.n + ' → ' + q.ans
    : tr('срещат се веднъж: 1 и 18 → ', 'трапляються один раз: 1 і 18 → ') + q.ans;
}
function whyDigits(q, full){
  if(q.shape === 'grid'){
    if(!full) return tr('Цифрата на десетиците е първата цифра на двуцифреното число. Внимавай с числата, в които тази цифра е на мястото на единиците.',
      'Цифра десятків — перша цифра двоцифрового числа. Обережно з числами, де ця цифра стоїть на місці одиниць.');
    const sw = q.list.filter(v => v % 10 === q.t && Math.floor(v / 10) !== q.t);
    return tr('не стават — там ' + q.t + ' е цифрата на единиците: ', 'не підходять — там ' + q.t + ' — цифра одиниць: ') + sw.join(', ') + '; &nbsp;' +
      tr('стават: ', 'підходять: ') + tensDigitOwn(q).map(v => '<b>' + v + '</b>').join(', ') + ' &nbsp;→&nbsp; ' + q.ans;
  }
  if(q.shape === 'all'){
    if(!full) return q.tens ? tr('Цифрата на единиците може да е всяка. Колко цифри има?', 'Цифра одиниць може бути будь-якою. Скільки всього цифр?')
                            : tr('Цифрата на десетиците може да е всяка — освен една. Коя?', 'Цифра десятків може бути будь-якою — крім однієї. Якої?');
    return tensDigitAll(q).join(', ') + (q.tens ? '' : tr(' — нулата не може да е отпред', ' — нуль не може стояти першим')) + ' &nbsp;→&nbsp; ' + q.ans;
  }
  if(q.shape === 'even'){
    if(!full) return tr('Числата, които се делят на 2, завършват на 0, 2, 4, 6 или 8. А „между“ не включва двете крайни числа.',
      'Числа, які діляться на 2, закінчуються на 0, 2, 4, 6 або 8. А «між» не включає двох крайніх чисел.');
    return tr(q.lo + ' и ' + q.hi + ' са крайните, не са „между“; ', q.lo + ' і ' + q.hi + ' — крайні, вони не «між»; ') + tr('делят се на 2: ', 'діляться на 2: ') + [q.ans].concat(q.alt).map(v => '<b>' + v + '</b>').join(', ');
  }
  if(q.shape === 4){
    if(!full) return tr('За всяко число: с колко се различават двете цифри — и коя е по-голямата?', 'Для кожного числа: на скільки відрізняються дві цифри — і яка з них більша?');
    return tr('стават: ', 'підходять: ') + digitGapOk(q).map(v => '<b>' + v + '</b>').join(', ') + tr(' — «поне с ', ' — «щонайменше на ') + q.k + tr('» значи ', '» означає ') + q.k + tr(' или повече', ' або більше') + ' &nbsp;→&nbsp; ' + q.ans;
  }
  if(q.shape === 2){
    if(!full) return q.smaller ? tr('Цифрата на десетиците не може да е нула.', 'Цифра десятків не може бути нулем.')
      : tr('Цифрата може да е и в десетиците, и в единиците.', 'Цифра може стояти і в десятках, і в одиницях.');
    return q.list.join(', ') + ' &nbsp;→&nbsp; ' + q.ans;
  }
  if(q.shape === 3){
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
  if(!full) return q.shape === 0 ? tr('Опитай по десетиците подред.', 'Перебери десятки по черзі.')
                                 : tr('Кои сборове се получават само от едно число?', 'Які суми виходять лише в одного числа?');
  if(q.shape === 1) return tr('само <b>10</b> дава 1, само <b>99</b> дава 18, всички други се повтарят',
    'лише <b>10</b> дає 1, лише <b>99</b> дає 18, усі інші повторюються') +
    ' &nbsp;→&nbsp; 1 + 18 = ' + q.ans;
  return twoDigitWith(q.n).join(', ') + ' &nbsp;→&nbsp; ' + q.ans;
}
KIND.digits = { draw:drawDigits, eq:eqDigits, why:whyDigits };
