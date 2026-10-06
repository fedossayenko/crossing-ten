// Question kind 'count': level 12 Колко? Сбор? — How many — or the sum — of a range given by a condition.

// Задача 5: counting a range given as a condition. The wording rotates — including
// «между», where the two ends are NOT counted — so the condition has to be read.
// The same four conditions asked two ways: how many numbers, or what they add up to.
// Telling "Колко са" from "сборът на" is the point, so both live in one level.
import { KIND, SLOT, bgList, popAt, rnd, shuffle, svgText, tr } from '../js/core.js';
export function genCount(){
  if(Math.random() < 0.14){
    // Задача 3: a list with repeats. What is asked is about the set behind it, not the
    // list — so the repeats have to be noticed and set aside.
    const k = 4 + rnd(5);
    const pool = shuffle([0,1,2,3,4,5,6,7,8,9]).slice(0, k);
    const list = pool.slice();
    for(let i = 0, extra = 3 + rnd(4); i < extra; i++) list.push(pool[rnd(k)]);
    shuffle(list);
    const asksSum = Math.random() < 0.35;
    return {kind:'count', shape:5, set:1, list, pool: pool.slice().sort((a, b) => a - b), asksSum,
            sum:false, natural:false, two:false,
            ans: asksSum ? pool.reduce((t, v) => t + v, 0) : k};
  }
  const sum = Math.random() < 0.45;
  if(!sum && Math.random() < 0.16){
    // Задача 9: only two numbers fit, and they are what is asked for — not how many.
    const a = 5 + rnd(25);
    return {kind:'count', shape:4, name:1, sum:false, natural:false, two:false,
            a, b: a + 3, lo: a + 1, hi: a + 2, slots:2, ans: a + 1, alt:[a + 2]};
  }
  // Задача 7: the same conditions, but only the two-digit numbers count — so the range
  // starts at ten however low the condition reaches.
  const two = !sum && Math.random() < 0.28;
  const top = sum ? 10 : two ? 60 : 15;
  const shape = rnd(5);
  // "естествени числа" are 1, 2, 3 … — zero is not one of them, which changes a count
  // but never a sum.
  const natural = !two && Math.random() < 0.4;
  const q = {kind:'count', sum, shape, natural, two};
  // Зима 2023: a range between two two-digit bounds (by 37 and 52) — the count, not a sum
  const big = !sum && !two && (shape === 2 || shape === 4) && Math.random() < 0.3;
  const lowA = two ? 8 + rnd(28) : big ? 10 + rnd(50) : 1 + rnd(sum ? 6 : 8);
  if(shape === 0){ q.n = (two ? 14 : 3) + rnd(top - 2); q.lo = 0; q.hi = q.n; }
  else if(shape === 1){ q.n = (two ? 14 : 3) + rnd(top - 2); q.lo = 0; q.hi = q.n - 1; }
  else if(shape === 2){ q.a = lowA; q.b = q.a + 2 + rnd(sum ? 6 : two ? 30 : big ? 20 : 9); q.lo = q.a; q.hi = q.b; }
  else { q.a = lowA; q.b = q.a + 3 + rnd(sum ? 6 : two ? 30 : big ? 20 : 8); q.lo = q.a + 1; q.hi = q.b - 1; }
  if(natural) q.lo = Math.max(q.lo, 1);
  if(two) q.lo = Math.max(q.lo, 10);                 // a two-digit number starts at ten
  if(q.hi < q.lo + 1) return genCount();             // a range with nothing, or only one thing, in it
  const n = q.hi - q.lo + 1;
  q.ans = sum ? (q.lo + q.hi) * n / 2 : n;
  return q;
}
// МБГ Пролет 2023 and 2025, 1 клас: how many numbers are not greater than 14 (15, with the 0), and the sum of
// all one-digit numbers that are NOT less than 7 (7 + 8 + 9 = 24) — the one-digit numbers stop at 9.
// Пролет 2022 and 2021: how many one-digit numbers are not greater than 7 (0 … 7: 8), how many one-digit
// numbers there are (10, with the 0), how many two-digit numbers are less than 15 (10 … 14: 5).
export function genCountShort(){
  const more = rnd(4);
  if(more === 0 && Math.random() < 0.25) return {kind:'count', shape:7, one:true, sum:false, natural:false, two:false, lo:0, hi:9, ans:10};
  if(more <= 1){ const shape = rnd(2), n = 3 + rnd(7); return {kind:'count', shape, one:true, sum:false, natural:false, two:false, n, lo:0, hi: shape ? n - 1 : n, ans: shape ? n : n + 1}; }
  if(more === 2){ const n = 12 + rnd(9); return {kind:'count', shape:1, sum:false, natural:false, two:true, n, lo:10, hi:n - 1, ans:n - 10}; }
  const sum = Math.random() < 0.5;
  if(Math.random() < 0.5){
    const a = 3 + rnd(6);
    return {kind:'count', shape:6, one:true, sum, natural:false, two:false, a, lo:a, hi:9, ans: sum ? (a + 9)*(10 - a)/2 : 10 - a};
  }
  const shape = rnd(2), n = (sum ? 3 : 5) + rnd(sum ? 5 : 11), natural = Math.random() < 0.3;
  const lo = natural ? 1 : 0, hi = shape ? n - 1 : n;
  return {kind:'count', shape, sum, natural, two:false, n, lo, hi, ans: sum ? (lo + hi)*(hi - lo + 1)/2 : hi - lo + 1};
}
// МБГ Полуфинал 2025, 1 клас, задача 6: Петър meant to write every number from 1 to 12, but wrote only 11, 1, 2,
// 7, 9, 12 and 8 — how many did he leave out? 12 numbers, 7 of them written: 12 − 7 = 5.
export function genCountMissed(){
  const N = 8 + rnd(8), k = 4 + rnd(N - 5), list = shuffle([...Array(N).keys()].map(v => v + 1)).slice(0, k);
  return {kind:'count', shape:8, N, list, traps:[k, N].filter(v => v !== N - k), ans: N - k};
}
// the numbers from 1 to N: the written ones, then the ones left out ringed one by one
function countMissedSvg(q){
  const rows = Math.ceil(q.N / 8), X = v => 22 + ((v - 1) % 8) * 28, Y = v => 18 + Math.floor((v - 1) / 8) * 30;
  let g = '', step = 1;
  for(let v = 1; v <= q.N; v++){
    const left = !q.list.includes(v);
    g += svgText(X(v), Y(v), v, 14, left ? 'var(--warm)' : 'var(--good)') + (left ? '<circle' + popAt(step++) + ' cx="' + X(v) + '" cy="' + (Y(v) - 5) + '" r="12" fill="none" stroke="var(--warm)" stroke-width="2"/>' : '');
  }
  g += svgText(120, 22 + rows * 30, q.N + ' − ' + q.list.length + ' = ' + q.ans, 15, 'var(--ink)', popAt(step + 1));
  return '<svg viewBox="0 0 240 ' + (32 + rows * 30) + '" style="display:block; width:240px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + tr('пропуснатите числа', 'пропущені числа') + '">' + g + '</svg>';
}

function drawCount(q){
  if(q.shape === 8){
    return '<div class="ask">' + tr('Петър искал да запише на дъската всички числа от 1 до <span class="num">' + q.N + '</span>, но записал само ' + bgList(q.list) + '. Колко числа е пропуснал да запише?',
      'Петро хотів записати на дошці всі числа від 1 до <span class="num">' + q.N + '</span>, але записав лише ' + bgList(q.list) + '. Скільки чисел він пропустив?') + '</div>' +
      '<div class="line xl">' + SLOT + '</div>';
  }
  if(q.set){
    return '<div class="ask">' + tr('Колко ' + (q.asksSum ? 'е <b>сборът</b> на' : 'са') +
      ' <b>различните</b> цифри?', q.asksSum ? 'Чому дорівнює <b>сума</b> <b>різних</b> цифр?' : 'Скільки <b>різних</b> цифр?') + '</div>' +
      '<div class="seq">' + q.list.join(', ') + '</div>' +
      '<div class="line xl">' + SLOT + '</div>';
  }
  if(q.shape === 7){
    return '<div class="ask">' + tr('<b>Колко са</b> едноцифрените числа?', '<b>Скільки всього</b> одноцифрових чисел?') + '</div>' +
      '<div class="line xl">' + SLOT + '</div>';
  }
  const cond = q.shape === 6 ? 'НЕ са по-малки от ' + q.a
             : q.shape === 0 ? 'не са по-големи от ' + q.n
             : q.shape === 1 ? 'са по-малки от ' + q.n
             : q.shape === 2 ? 'не са по-малки от ' + q.a + ' и не са по-големи от ' + q.b
             : q.shape === 3 ? 'са между ' + q.a + ' и ' + q.b
             : 'са по-малки от ' + q.b + ' и са по-големи от ' + q.a;
  const ukCond = q.shape === 6 ? 'НЕ менші за ' + q.a
               : q.shape === 0 ? 'не більші за ' + q.n
               : q.shape === 1 ? 'менші за ' + q.n
               : q.shape === 2 ? 'не менші за ' + q.a + ' і не більші за ' + q.b
               : q.shape === 3 ? 'лежать між ' + q.a + ' і ' + q.b
               : 'менші за ' + q.b + ' і більші за ' + q.a;
  const what = q.one ? '<b>едноцифрени</b> числа' : q.natural ? '<b>естествени</b> числа' : q.two ? '<b>двуцифрени</b> числа' : 'числа';
  const ukWhat = q.one ? '<b>одноцифрових</b> чисел' : q.natural ? '<b>натуральних</b> чисел' : q.two ? '<b>двоцифрових</b> чисел' : 'чисел';
  if(q.name){
    return '<div class="ask">' + tr('<b>Кои са</b> числата, които ' + cond + '?', '<b>Які</b> числа ' + ukCond + '?') + '</div>' +
      '<div class="note">' + tr('Числата са 0, 1, 2, 3, …', 'Числа — це 0, 1, 2, 3, …') + '</div>' +
      '<div class="line md">' + SLOT +
      ' <span class="or">' + tr('и', 'і') + '</span> <span class="slot" id="slot1"></span></div>';
  }
  const ask = q.sum ? tr('Пресметнете <b>сбора</b> на всички ' + what + ', които ' + cond + '.',
                         'Обчисліть <b>суму</b> всіх ' + ukWhat + ', які ' + ukCond + '.')
                    : tr('<b>Колко са</b> всички ' + what + ', които ' + cond + '?',
                         '<b>Скільки всього</b> ' + ukWhat + ', які ' + ukCond + '?');
  return '<div class="ask">' + ask + '</div>' +
    '<div class="note">' + (q.natural ? tr('Естествените числа са 1, 2, 3, …', 'Натуральні числа — це 1, 2, 3, …')
      : q.two ? tr('Двуцифрените числа са 10, 11, … 99', 'Двоцифрові числа — це 10, 11, … 99')
      : q.one ? tr('Едноцифрените числа са 0, 1, 2, … 9', 'Одноцифрові числа — це 0, 1, 2, … 9')
      : tr('Числата са 0, 1, 2, 3, …', 'Числа — це 0, 1, 2, 3, …')) + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqCount(q){
  if(q.shape === 8) return '1 … ' + q.N + tr(', записани ', ', записано ') + q.list.length + ' → ' + q.N + ' − ' + q.list.length + ' = ' + q.ans;
  if(q.set) return tr('различни: ', 'різні: ') + q.pool.join(', ') + ' → ' + q.ans;
  if(q.name) return tr('между ' + q.a + ' и ' + q.b + ' → ' + q.lo + ' и ' + q.hi,
                                             'між ' + q.a + ' і ' + q.b + ' → ' + q.lo + ' і ' + q.hi);
  return tr((q.sum ? 'сборът, ' : 'броят, ') +
    (q.natural ? 'естествени, ' : q.two ? 'двуцифрени, ' : q.one ? 'едноцифрени, ' : '') + 'от ' + q.lo + ' до ' + q.hi,
    (q.sum ? 'сума, ' : 'кількість, ') +
    (q.natural ? 'натуральні, ' : q.two ? 'двоцифрові, ' : q.one ? 'одноцифрові, ' : '') + 'від ' + q.lo + ' до ' + q.hi) + ' → ' + q.ans;
}
// The pictures. A range is a number line: the numbers that count light up one by one, numbered as she
// would count them; an end that does not count, 0 for the natural numbers and 9 for the two-digit ones
// stand crossed out in red. A long range shows only its two ends and how many lie from one to the other;
// a sum joins the numbers in pairs from both ends. The hint's line has no numbers: a filled end counts,
// a hollow one does not.
function countLine(q, full){
  const svg = (h, g, label) => '<svg viewBox="0 -24 240 ' + h + '" style="display:block; width:230px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + label + '">' + g + '</svg>';
  const label = tr('числата, които се броят', 'числа, які рахуються');
  if(!full){
    const inLo = q.shape <= 2 || q.shape >= 6, inHi = q.shape === 0 || q.shape === 2 || q.shape >= 6;   // whether each end itself counts
    const end = (x, fill) => '<circle cx="' + x + '" cy="0" r="7" fill="' + (fill ? 'var(--good)' : 'none') + '" stroke="' + (fill ? 'var(--good)' : 'var(--bad)') + '" stroke-width="3"/>';
    return svg(40, '<line x1="10" y1="0" x2="230" y2="0" stroke="var(--line)" stroke-width="2"/><line x1="40" y1="0" x2="200" y2="0" stroke="var(--good)" stroke-width="6" stroke-linecap="round"/>' +
      end(40, inLo) + end(200, inHi), label);
  }
  const n = q.hi - q.lo + 1, col = 'var(--good)';
  const cross = (x, v) => svgText(x, -10, v, 12, 'var(--bad)') + '<path d="M' + (x - 6) + ',-6 l12,12 M' + (x + 6) + ',-6 l-12,12" stroke="var(--bad)" stroke-width="2.5"/>';
  if(!q.sum && n > 14){
    // a long range: its first and last numbers, and the count between
    const X = [36, 70, 104, 136, 170, 204];
    let g = '<line x1="8" y1="0" x2="232" y2="0" stroke="var(--line)" stroke-width="2"/>' + (q.lo > 0 ? cross(14, q.lo - 1) : '');
    [q.lo, q.lo + 1, q.lo + 2].forEach((v, i) => { g += '<g' + popAt(1 + i) + '><circle cx="' + X[i] + '" cy="0" r="6" fill="' + col + '"/>' + svgText(X[i], -10, v, 12, 'var(--ink)') + '</g>'; });
    g += svgText(120, 4, '…', 16, 'var(--muted)');
    [q.hi - 1, q.hi].forEach((v, i) => { g += '<g' + popAt(5 + i) + '><circle cx="' + X[4 + i] + '" cy="0" r="6" fill="' + col + '"/>' + svgText(X[4 + i], -10, v, 12, 'var(--ink)') + '</g>'; });
    g += cross(226, q.hi + 1) + svgText(120, 30, q.hi + ' − ' + q.lo + ' + 1 = ' + n, 16, 'var(--ink)', popAt(8));
    return svg(64, g, label);
  }
  const lo = Math.max(0, q.lo - 1), hi = q.hi + 1, step = 220 / (hi - lo + 1), X = v => (10 + (v - lo + 0.5) * step).toFixed(1);
  let g = '<line x1="6" y1="0" x2="234" y2="0" stroke="var(--line)" stroke-width="2"/>';
  for(let v = lo; v <= hi; v++){
    if(v < q.lo || v > q.hi){ g += cross(+X(v), v); continue; }
    const k = v - q.lo + 1;
    g += '<g' + popAt(k) + '><circle cx="' + X(v) + '" cy="0" r="' + Math.min(7, step / 2.6).toFixed(1) + '" fill="' + col + '"/>' + svgText(X(v), -10, v, step < 16 ? 10 : 12, 'var(--ink)') +
      (q.sum ? '' : svgText(X(v), 20, k, 10, col)) + '</g>';
  }
  if(q.sum){
    // the pairs from both ends, each making the same total
    const each = q.lo + q.hi;
    for(let i = 0; q.lo + i < q.hi - i; i++){
      const a = +X(q.lo + i), b = +X(q.hi - i), h = 10 + (b - a) * 0.18;
      g += '<path' + popAt(n + 2 + i) + ' d="M' + a + ',8 Q' + ((a + b) / 2).toFixed(1) + ',' + (8 + 2*h).toFixed(1) + ' ' + b + ',8" stroke="var(--warm)" stroke-width="2.2" fill="none"/>';
    }
    g += svgText(120, 64, tr('всяка двойка: ', 'кожна пара: ') + each + ' → ' + q.ans, 14, 'var(--ink)', popAt(n + 3 + Math.floor(n / 2)));
    return svg(98, g, label);
  }
  g += svgText(120, 44, n + tr(' числа', ' чисел'), 15, 'var(--ink)', popAt(n + 2));
  return svg(76, g, label);
}
// The list with repeats: each number that has turned up before fades as it is met, the different ones stay.
function countSet(q, full){
  const W = 220 / q.list.length, seen = new Set();
  let g = '', step = 1;
  q.list.forEach((v, i) => {
    const again = seen.has(v); seen.add(v);
    const x = (10 + (i + 0.5) * W).toFixed(1);
    g += svgText(x, 0, v, 16, again ? 'var(--muted)' : 'var(--good)') + (again && full ? '<path' + popAt(step++) + ' d="M' + (+x - 6) + ',-12 l12,14" stroke="var(--bad)" stroke-width="2.5"/>' : '');
  });
  if(full) g += svgText(120, 30, (q.asksSum ? q.pool.join(' + ') + ' = ' : q.pool.join(', ') + ' → ') + q.ans, 14, 'var(--ink)', popAt(step + 1));
  return '<svg viewBox="0 -22 240 ' + (full ? 62 : 32) + '" style="display:block; width:230px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + tr('различните цифри', 'різні цифри') + '">' + g + '</svg>';
}
function whyCount(q, full){
  if(q.shape === 8){
    if(!full) return tr('Колко са всички числа, които е искал да запише? А колко е записал?', 'Скільки всього чисел він хотів записати? А скільки записав?');
    return tr('от 1 до ' + q.N + ' са <b>' + q.N + '</b> числа, записани са <b>' + q.list.length + '</b>', 'від 1 до ' + q.N + ' — <b>' + q.N + '</b> чисел, записано <b>' + q.list.length + '</b>') +
      ' &nbsp;→&nbsp; ' + q.N + ' − ' + q.list.length + ' = ' + q.ans + countMissedSvg(q);
  }
  if(q.set){
    if(!full) return tr('Едно и също число, повторено, се брои само веднъж.', 'Те саме число, навіть повторене, рахується лише один раз.');
    return tr('различните са <b>', 'різні — це <b>') + q.pool.join(', ') + '</b> &nbsp;→&nbsp; ' +
      (q.asksSum ? q.pool.join(' + ') + ' = ' + q.ans : tr('на брой ', 'усього ') + q.ans) + countSet(q, true);
  }
  if(q.name){
    if(!full) return tr('Краищата не се броят — гледай само какво остава между тях.', 'Кінці не рахуються — дивись лише на те, що є між ними.');
    return tr('между ' + q.a + ' и ' + q.b + ', без краищата', 'між ' + q.a + ' і ' + q.b + ', без кінців') +
      ' &nbsp;→&nbsp; <b>' + q.lo + '</b> ' + tr('и', 'і') + ' <b>' + q.hi + '</b>';
  }
  if(!full && q.shape === 7) return tr('Едноцифрените числа са от нулата до най-голямата цифра — не забравяй нулата.', 'Одноцифрові числа — від нуля до найбільшої цифри; не забудь про нуль.') + countLine(q, false);
  if(!full) return (q.one && q.shape === 1 ? tr('Едноцифрените числа започват от нулата. Числото от условието не се брои.', 'Одноцифрові числа починаються з нуля. Число з умови не рахується.')
          : q.one && q.shape === 0 ? tr('Едноцифрените числа започват от нулата. Числото от условието също се брои.', 'Одноцифрові числа починаються з нуля. Число з умови теж рахується.')
          : q.one ? tr('Едноцифрените числа стигат до девет. Числото от условието също се брои.', 'Одноцифрові числа закінчуються дев’яткою. Число з умови теж рахується.')
          : q.two ? tr('Двуцифрените числа започват от десет.', 'Двоцифрові числа починаються з десяти.')
          : q.natural ? tr('Естествените числа започват от едно.', 'Натуральні числа починаються з одиниці.')
          : q.sum ? tr('Събирай ги по двойки от двата края.', 'Додавай їх парами з обох кінців.')
          : q.shape >= 3 ? tr('Краищата не се броят.', 'Кінці не рахуються.')
          : q.shape === 2 ? tr('И двата края се броят.', 'Обидва кінці рахуються.')
          : tr('Не забравяй нулата — тя също е число.', 'Не забудь про нуль — це теж число.')) + countLine(q, false);
  if(q.sum){
    const n = q.hi - q.lo + 1;
    if(n >= 4 && n % 2 === 0){
      const each = q.lo + q.hi;
      return tr('двойките ', 'пари ') + q.lo + ' + ' + q.hi + ', &nbsp;' + (q.lo+1) + ' + ' + (q.hi-1) +
        tr(' … правят по <b>', ' … дають по <b>') + each + '</b> &nbsp;→&nbsp; ' + Array(n/2).fill(each).join(' + ') + ' = ' + q.ans + countLine(q, true);
    }
    const list = [];
    for(let v = q.lo; v <= q.hi; v++) list.push(v);
    return list.join(' + ') + ' = ' + q.ans + countLine(q, true);
  }
  const edge = q.shape === 7 ? tr('всички едноцифрени', 'усі одноцифрові')
             : q.shape === 6 ? tr('до 9 — само едноцифрените', 'до 9 — лише одноцифрові')
             : q.shape === 0 ? tr('включително ' + q.n, 'включно з ' + q.n)
             : q.shape === 1 ? q.n + tr(' не се брои', ' не рахується')
             : q.shape === 2 ? tr('с двата края', 'з обома кінцями')
             : tr('без краищата', 'без кінців');
  const zero = q.natural ? tr('нулата не е естествено число', 'нуль не є натуральним числом')
             : q.lo === 0 ? tr('<b>нулата също се брои</b>', '<b>нуль теж рахується</b>') : '';
  // a short range is listed whole: 7, 8, 9 — not 7, 8, …, 9
  return (q.hi - q.lo <= 3 ? Array.from({length: q.hi - q.lo + 1}, (_, i) => q.lo + i).join(', ') : q.lo + ', ' + (q.lo + 1) + ', …, ' + q.hi) +
    ' &nbsp;(' + edge + (zero ? '; ' + zero : '') + ') &nbsp;→&nbsp; ' + q.ans + countLine(q, true);
}
KIND.count = { draw:drawCount, eq:eqCount, why:whyCount };
