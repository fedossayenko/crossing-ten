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
  const lowA = two ? 8 + rnd(28) : 1 + rnd(sum ? 6 : 8);
  if(shape === 0){ q.n = (two ? 14 : 3) + rnd(top - 2); q.lo = 0; q.hi = q.n; }
  else if(shape === 1){ q.n = (two ? 14 : 3) + rnd(top - 2); q.lo = 0; q.hi = q.n - 1; }
  else if(shape === 2){ q.a = lowA; q.b = q.a + 2 + rnd(sum ? 6 : two ? 30 : 9); q.lo = q.a; q.hi = q.b; }
  else { q.a = lowA; q.b = q.a + 3 + rnd(sum ? 6 : two ? 30 : 8); q.lo = q.a + 1; q.hi = q.b - 1; }
  if(natural) q.lo = Math.max(q.lo, 1);
  if(two) q.lo = Math.max(q.lo, 10);                 // a two-digit number starts at ten
  if(q.hi < q.lo + 1) return genCount();             // a range with nothing, or only one thing, in it
  const n = q.hi - q.lo + 1;
  q.ans = sum ? (q.lo + q.hi) * n / 2 : n;
  return q;
}

function drawCount(q){
  if(q.kind === 'count' && q.set){
    return '<div class="ask">Колко ' + (q.asksSum ? 'е <b>сборът</b> на' : 'са') +
      ' <b>различните</b> цифри?</div>' +
      '<div class="seq">' + q.list.join(', ') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'count'){
    const cond = q.shape === 0 ? 'не са по-големи от ' + q.n
               : q.shape === 1 ? 'са по-малки от ' + q.n
               : q.shape === 2 ? 'не са по-малки от ' + q.a + ' и не са по-големи от ' + q.b
               : q.shape === 3 ? 'са между ' + q.a + ' и ' + q.b
               : 'са по-малки от ' + q.b + ' и са по-големи от ' + q.a;
    const what = q.natural ? '<b>естествени</b> числа' : q.two ? '<b>двуцифрени</b> числа' : 'числа';
    if(q.name){
      return '<div class="ask"><b>Кои са</b> числата, които ' + cond + '?</div>' +
        '<div class="note">Числата са 0, 1, 2, 3, …</div>' +
        '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT +
        ' <span class="or">и</span> <span class="slot" id="slot1"></span></div>';
    }
    const ask = q.sum ? 'Пресметнете <b>сбора</b> на всички ' + what + ', които ' + cond + '.'
                      : '<b>Колко са</b> всички ' + what + ', които ' + cond + '?';
    return '<div class="ask">' + ask + '</div>' +
      '<div class="note">' + (q.natural ? 'Естествените числа са 1, 2, 3, …'
        : q.two ? 'Двуцифрените числа са 10, 11, … 99' : 'Числата са 0, 1, 2, 3, …') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqCount(q){
  if(q.kind === 'count' && q.set) return 'различни: ' + q.pool.join(', ') + ' → ' + q.ans;
  if(q.kind === 'count' && q.name) return 'между ' + q.a + ' и ' + q.b + ' → ' + q.lo + ' и ' + q.hi;
  if(q.kind === 'count') return (q.sum ? 'сборът, ' : 'броят, ') +
    (q.natural ? 'естествени, ' : q.two ? 'двуцифрени, ' : '') + 'от ' + q.lo + ' до ' + q.hi + ' → ' + q.ans;
}
function whyCount(q, full){
  if(q.kind === 'count' && q.set){
    if(!full) return 'Едно и също число, повторено, се брои само веднъж.';
    return 'различните са <b>' + q.pool.join(', ') + '</b> &nbsp;→&nbsp; ' +
      (q.asksSum ? q.pool.join(' + ') + ' = ' + q.ans : 'на брой ' + q.ans);
  }
  if(q.kind === 'count' && q.name){
    if(!full) return 'Краищата не се броят — гледай само какво остава между тях.';
    return 'между ' + q.a + ' и ' + q.b + ', без краищата &nbsp;→&nbsp; <b>' + q.lo + '</b> и <b>' + q.hi + '</b>';
  }
  if(q.kind === 'count'){
    if(!full) return q.two ? 'Двуцифрените числа започват от десет.'
            : q.natural ? 'Естествените числа започват от едно.'
            : q.sum ? 'Събирай ги по двойки от двата края.'
            : q.shape >= 3 ? 'Краищата не се броят.'
            : q.shape === 2 ? 'И двата края се броят.'
            : 'Не забравяй нулата — тя също е число.';
    if(q.sum){
      const n = q.hi - q.lo + 1;
      if(n >= 4 && n % 2 === 0){
        const each = q.lo + q.hi;
        return 'двойките ' + q.lo + ' + ' + q.hi + ', &nbsp;' + (q.lo+1) + ' + ' + (q.hi-1) +
          ' … правят по <b>' + each + '</b> &nbsp;→&nbsp; ' + Array(n/2).fill(each).join(' + ') + ' = ' + q.ans;
      }
      const list = [];
      for(let v = q.lo; v <= q.hi; v++) list.push(v);
      return list.join(' + ') + ' = ' + q.ans;
    }
    const edge = q.shape === 0 ? 'включително ' + q.n
               : q.shape === 1 ? q.n + ' не се брои'
               : q.shape === 2 ? 'с двата края'
               : 'без краищата';
    const zero = q.natural ? 'нулата не е естествено число'
               : q.lo === 0 ? '<b>нулата също се брои</b>' : '';
    return q.lo + ', ' + (q.lo + 1) + ', …, ' + q.hi +
      ' &nbsp;(' + edge + (zero ? '; ' + zero : '') + ') &nbsp;→&nbsp; ' + q.ans;
  }
}
KIND.count = { draw:drawCount, eq:eqCount, why:whyCount };
