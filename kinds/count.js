// Question kind 'count': level 12 Колко? Сбор? — How many — or the sum — of a range given by a condition.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 5: counting a range given as a condition. The wording rotates — including
// «между», where the two ends are NOT counted — so the condition has to be read.
// The same four conditions asked two ways: how many numbers, or what they add up to.
// Telling "Колко са" from "сборът на" is the point, so both live in one level.
function genCount(){
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

function drawCount(q){
  if(q.kind === 'count' && q.set){
    return '<div class="ask">' + tr('Колко ' + (q.asksSum ? 'е <b>сборът</b> на' : 'са') +
      ' <b>различните</b> цифри?', q.asksSum ? 'Чому дорівнює <b>сума</b> <b>різних</b> цифр?' : 'Скільки <b>різних</b> цифр?') + '</div>' +
      '<div class="seq">' + q.list.join(', ') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'count'){
    const cond = q.shape === 0 ? 'не са по-големи от ' + q.n
               : q.shape === 1 ? 'са по-малки от ' + q.n
               : q.shape === 2 ? 'не са по-малки от ' + q.a + ' и не са по-големи от ' + q.b
               : q.shape === 3 ? 'са между ' + q.a + ' и ' + q.b
               : 'са по-малки от ' + q.b + ' и са по-големи от ' + q.a;
    const ukCond = q.shape === 0 ? 'не більші за ' + q.n
                 : q.shape === 1 ? 'менші за ' + q.n
                 : q.shape === 2 ? 'не менші за ' + q.a + ' і не більші за ' + q.b
                 : q.shape === 3 ? 'лежать між ' + q.a + ' і ' + q.b
                 : 'менші за ' + q.b + ' і більші за ' + q.a;
    const what = q.natural ? '<b>естествени</b> числа' : q.two ? '<b>двуцифрени</b> числа' : 'числа';
    const ukWhat = q.natural ? '<b>натуральних</b> чисел' : q.two ? '<b>двоцифрових</b> чисел' : 'чисел';
    if(q.name){
      return '<div class="ask">' + tr('<b>Кои са</b> числата, които ' + cond + '?', '<b>Які</b> числа ' + ukCond + '?') + '</div>' +
        '<div class="note">' + tr('Числата са 0, 1, 2, 3, …', 'Числа — це 0, 1, 2, 3, …') + '</div>' +
        '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT +
        ' <span class="or">' + tr('и', 'і') + '</span> <span class="slot" id="slot1"></span></div>';
    }
    const ask = q.sum ? tr('Пресметнете <b>сбора</b> на всички ' + what + ', които ' + cond + '.',
                           'Обчисліть <b>суму</b> всіх ' + ukWhat + ', які ' + ukCond + '.')
                      : tr('<b>Колко са</b> всички ' + what + ', които ' + cond + '?',
                           '<b>Скільки всього</b> ' + ukWhat + ', які ' + ukCond + '?');
    return '<div class="ask">' + ask + '</div>' +
      '<div class="note">' + (q.natural ? tr('Естествените числа са 1, 2, 3, …', 'Натуральні числа — це 1, 2, 3, …')
        : q.two ? tr('Двуцифрените числа са 10, 11, … 99', 'Двоцифрові числа — це 10, 11, … 99')
        : tr('Числата са 0, 1, 2, 3, …', 'Числа — це 0, 1, 2, 3, …')) + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqCount(q){
  if(q.kind === 'count' && q.set) return tr('различни: ', 'різні: ') + q.pool.join(', ') + ' → ' + q.ans;
  if(q.kind === 'count' && q.name) return tr('между ' + q.a + ' и ' + q.b + ' → ' + q.lo + ' и ' + q.hi,
                                             'між ' + q.a + ' і ' + q.b + ' → ' + q.lo + ' і ' + q.hi);
  if(q.kind === 'count') return tr((q.sum ? 'сборът, ' : 'броят, ') +
    (q.natural ? 'естествени, ' : q.two ? 'двуцифрени, ' : '') + 'от ' + q.lo + ' до ' + q.hi,
    (q.sum ? 'сума, ' : 'кількість, ') +
    (q.natural ? 'натуральні, ' : q.two ? 'двоцифрові, ' : '') + 'від ' + q.lo + ' до ' + q.hi) + ' → ' + q.ans;
}
function whyCount(q, full){
  if(q.kind === 'count' && q.set){
    if(!full) return tr('Едно и също число, повторено, се брои само веднъж.', 'Те саме число, навіть повторене, рахується лише один раз.');
    return tr('различните са <b>', 'різні — це <b>') + q.pool.join(', ') + '</b> &nbsp;→&nbsp; ' +
      (q.asksSum ? q.pool.join(' + ') + ' = ' + q.ans : tr('на брой ', 'усього ') + q.ans);
  }
  if(q.kind === 'count' && q.name){
    if(!full) return tr('Краищата не се броят — гледай само какво остава между тях.', 'Кінці не рахуються — дивись лише на те, що є між ними.');
    return tr('между ' + q.a + ' и ' + q.b + ', без краищата', 'між ' + q.a + ' і ' + q.b + ', без кінців') +
      ' &nbsp;→&nbsp; <b>' + q.lo + '</b> ' + tr('и', 'і') + ' <b>' + q.hi + '</b>';
  }
  if(q.kind === 'count'){
    if(!full) return q.two ? tr('Двуцифрените числа започват от десет.', 'Двоцифрові числа починаються з десяти.')
            : q.natural ? tr('Естествените числа започват от едно.', 'Натуральні числа починаються з одиниці.')
            : q.sum ? tr('Събирай ги по двойки от двата края.', 'Додавай їх парами з обох кінців.')
            : q.shape >= 3 ? tr('Краищата не се броят.', 'Кінці не рахуються.')
            : q.shape === 2 ? tr('И двата края се броят.', 'Обидва кінці рахуються.')
            : tr('Не забравяй нулата — тя също е число.', 'Не забудь про нуль — це теж число.');
    if(q.sum){
      const n = q.hi - q.lo + 1;
      if(n >= 4 && n % 2 === 0){
        const each = q.lo + q.hi;
        return tr('двойките ', 'пари ') + q.lo + ' + ' + q.hi + ', &nbsp;' + (q.lo+1) + ' + ' + (q.hi-1) +
          tr(' … правят по <b>', ' … дають по <b>') + each + '</b> &nbsp;→&nbsp; ' + Array(n/2).fill(each).join(' + ') + ' = ' + q.ans;
      }
      const list = [];
      for(let v = q.lo; v <= q.hi; v++) list.push(v);
      return list.join(' + ') + ' = ' + q.ans;
    }
    const edge = q.shape === 0 ? tr('включително ' + q.n, 'включно з ' + q.n)
               : q.shape === 1 ? q.n + tr(' не се брои', ' не рахується')
               : q.shape === 2 ? tr('с двата края', 'з обома кінцями')
               : tr('без краищата', 'без кінців');
    const zero = q.natural ? tr('нулата не е естествено число', 'нуль не є натуральним числом')
               : q.lo === 0 ? tr('<b>нулата също се брои</b>', '<b>нуль теж рахується</b>') : '';
    return q.lo + ', ' + (q.lo + 1) + ', …, ' + q.hi +
      ' &nbsp;(' + edge + (zero ? '; ' + zero : '') + ') &nbsp;→&nbsp; ' + q.ans;
  }
}
KIND.count = { draw:drawCount, eq:eqCount, why:whyCount };
