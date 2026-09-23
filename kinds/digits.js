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
function genDigits(){
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
  if(q.kind === 'digits' && q.shape === 3){
    const what = q.asks === 0 ? 'Пресметнете <b>сбора на цифрите</b> на всички'
               : q.asks === 1 ? '<b>Колко са</b> всички'
               : 'Пресметнете <b>сбора</b> на всички';
    return '<div class="ask">' + what + ' двуцифрени числа, записани с <b>различни цифри</b> измежду цифрите <span class="num">' +
      q.pool.join(', ') + '</span>' + (q.asks === 1 ? '?' : '.') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'digits'){
    const ask = q.shape === 2
      ? 'Колко са двуцифрените числа, една от цифрите на които е <span class="num">' + q.d +
        '</span>, а другата е <b>' + (q.smaller ? 'по-малка' : 'по-голяма') + '</b> от <span class="num">' + q.d + '</span>?'
      : q.shape === 0
      ? 'Колко двуцифрени числа имат сбор на цифрите <span class="num">' + q.n + '</span>?'
      : 'Вместо да запиша всичките 90 двуцифрени числа, записах пресметнатите 90 сбора от цифрите им. Колко е сборът на сборовете, които се срещат само веднъж?';
    return '<div class="ask">' + ask + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqDigits(q){
  if(q.kind === 'digits' && q.shape === 3) return 'от ' + q.pool.join(',') + ' → ' + q.made.join(', ') + ' → ' + q.ans;
  if(q.kind === 'digits' && q.shape === 2) return 'едната цифра ' + q.d + ', другата ' +
    (q.smaller ? 'по-малка' : 'по-голяма') + ' → ' + q.ans;
  if(q.kind === 'digits') return q.shape === 0
    ? 'сбор на цифрите ' + q.n + ' → ' + q.ans
    : 'срещат се веднъж: 1 и 18 → ' + q.ans;
}
function whyDigits(q, full){
  if(q.kind === 'digits' && q.shape === 2){
    if(!full) return 'Цифрата на десетиците не може да е нула.';
    return q.list.join(', ') + ' &nbsp;→&nbsp; ' + q.ans;
  }
  if(q.kind === 'digits' && q.shape === 3){
    if(!full) return q.pool.indexOf(0) >= 0 ? 'Число не може да започва с нула — това маха няколко от списъка.'
                                             : 'Всяка двойка цифри дава две числа, според коя е отпред.';
    const tail = q.asks === 0
      ? q.made.map(v => ((v / 10) | 0) + ' + ' + v % 10).join(', ') + ' &nbsp;→&nbsp; ' + q.ans
      : q.asks === 1 ? 'на брой ' + q.ans
      : q.made.join(' + ') + ' = ' + q.ans;
    return 'числата са <b>' + q.made.join(', ') + '</b> &nbsp;→&nbsp; ' + tail;
  }
  if(q.kind === 'digits'){
    if(!full) return q.shape === 0 ? 'Опитай по десетиците подред.' : 'Кои сборове се получават само от едно число?';
    if(q.shape === 1) return 'само <b>10</b> дава 1, само <b>99</b> дава 18, всички други се повтарят' +
      ' &nbsp;→&nbsp; 1 + 18 = ' + q.ans;
    return twoDigitWith(q.n).join(', ') + ' &nbsp;→&nbsp; ' + q.ans;
  }
}
KIND.digits = { draw:drawDigits, eq:eqDigits, why:whyDigits };
