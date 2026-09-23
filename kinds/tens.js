// Question kind 'tens': level 51 Десетици — A number said in tens, ones and hundreds.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

const PLACE = {1:['единица','единици'], 10:['десетица','десетици'], 100:['стотица','стотици']};
const places = (n, u) => n + ' ' + PLACE[u][n === 1 ? 0 : 1];
// Задача 1 and 5: a number said in tens, ones and hundreds instead of digits. Ten ones
// make a десетица and ten десетици a стотица, so the same amount has many spellings.
function genTens(){
  const shape = rnd(5);
  if(shape === 4){
    // Задача 1: the count of ones runs past nine, so it carries into the tens — and the
    // box is a digit of the answer rather than a count of anything.
    const a = 3 + rnd(7), b = rnd(10), tot = 10*a + b;
    const t = 1 + rnd(Math.min(5, a - 1));
    return {kind:'tens', shape, t, u: tot - 10*t, b, tot, ans: a};
  }
  if(shape === 0){                              // 50 = □ десетици + 20 единици
    const ans = 2 + rnd(8);
    const c = Math.random() < 0.6 ? 10*(1 + rnd(4)) : 2 + rnd(8);
    return {kind:'tens', shape, c, N: 10*ans + c, ans};
  }
  if(shape === 1){                              // 7 десетици + 8 десетици + 50 единици = □ стотици
    const ans = 1 + rnd(2);
    for(;;){
      const a = 2 + rnd(8), b = 2 + rnd(8), m = 10*ans - a - b;
      if(m < 2 || m > 9) continue;
      return {kind:'tens', shape, a, b, m, ans};
    }
  }
  if(shape === 2){                              // 74 = 5 десетици + □ единици
    const t = 2 + rnd(7), ans = 1 + rnd(29);
    return {kind:'tens', shape, t, N: 10*t + ans, ans};
  }
  const a = 1 + rnd(2), b = 2 + rnd(8), c = 1 + rnd(9);   // 2 стотици + 4 десетици + 7 единици = □
  return {kind:'tens', shape:3, a, b, c, ans: 100*a + 10*b + c};
}

// Ukrainian forms by Intl plural category: one (1 десяток), few (2 десятки), many (5 десятків)
const tensUk = {1:{one:'одиниця', few:'одиниці', many:'одиниць'}, 10:{one:'десяток', few:'десятки', many:'десятків'},
                100:{one:'сотня', few:'сотні', many:'сотень'}};
const tensUkPlaces = (n, u) => n + ' ' + tensUk[u][new Intl.PluralRules('uk').select(n)];
const tensPlaces = (n, u) => tr(places(n, u), tensUkPlaces(n, u));
function drawTens(q){
  if(q.kind === 'tens'){
    const B = '<span class="circle">□</span>';
    // the box holds a single digit in the first two, a whole number in the others
    const digit = q.shape < 2 || q.shape === 4;
    const ask = tr('Ко' + (digit ? 'я цифра' : 'е число') + ' трябва да поставим вместо ' + B +
      ', така че да е вярно равенството?',
      (digit ? 'Яку цифру' : 'Яке число') + ' треба поставити замість ' + B + ', щоб рівність була правильною?');
    const eq = q.shape === 0 ? q.N + ' = ' + B + ' ' + tr(PLACE[10][1], tensUk[10].many) + ' + ' + tensPlaces(q.c, 1)
             : q.shape === 1 ? tensPlaces(q.a, 10) + ' + ' + tensPlaces(q.b, 10) + ' + ' + tensPlaces(10*q.m, 1) +
                               ' = ' + B + ' ' + tr(PLACE[100][1], tensUk[100].many)
             : q.shape === 4 ? tensPlaces(q.t, 10) + ' + ' + tensPlaces(q.u, 1) + ' = ' + B + q.b
             : q.shape === 2 ? q.N + ' = ' + tensPlaces(q.t, 10) + ' + ' + B + ' ' + tr(PLACE[1][1], tensUk[1].many)
             : tensPlaces(q.a, 100) + ' + ' + tensPlaces(q.b, 10) + ' + ' + tensPlaces(q.c, 1) + ' = ' + B;
    return '<div class="ask">' + ask + '</div>' +
      '<div class="given">' + eq + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqTens(q){
  if(q.kind === 'tens') return tr('разредни единици → ', 'розрядні одиниці → ') + q.ans;
}
function whyTens(q, full){
  if(q.kind === 'tens'){
    if(!full) return tr('Всяка десетица е десет единици, а всяка стотица — десет десетици.',
                        'Кожен десяток — це десять одиниць, а кожна сотня — десять десятків.');
    if(q.shape === 0) return q.N + ' − ' + q.c + ' = <b>' + (q.N - q.c) + '</b> &nbsp;→&nbsp; ' +
      tr((q.N - q.c) + ' са ' + q.ans + ' ' + PLACE[10][1], (q.N - q.c) + ' — це ' + tensUkPlaces(q.ans, 10));
    if(q.shape === 1) return tensPlaces(q.a, 10) + ' = ' + (10*q.a) + ', ' + tensPlaces(q.b, 10) + ' = ' + (10*q.b) +
      ', ' + tensPlaces(10*q.m, 1) + ' = ' + (10*q.m) + ' &nbsp;→&nbsp; ' + (10*q.a) + ' + ' + (10*q.b) + ' + ' +
      (10*q.m) + ' = <b>' + (100*q.ans) + '</b> &nbsp;→&nbsp; ' +
      tr('това са ' + q.ans + ' ' + PLACE[100][1], 'це ' + tensUkPlaces(q.ans, 100));
    if(q.shape === 4) return tensPlaces(q.t, 10) + ' = ' + (10*q.t) + ' &nbsp;→&nbsp; ' + (10*q.t) + ' + ' +
      q.u + ' = <b>' + q.tot + '</b> &nbsp;→&nbsp; ' + tr('цифрата на десетиците е ', 'цифра десятків — ') + q.ans;
    if(q.shape === 2) return tensPlaces(q.t, 10) + ' = <b>' + (10*q.t) + '</b> &nbsp;→&nbsp; ' + q.N + ' − ' +
      (10*q.t) + ' = ' + q.ans;
    return (100*q.a) + ' + ' + (10*q.b) + ' + ' + q.c + ' = ' + q.ans;
  }
}
KIND.tens = { draw:drawTens, eq:eqTens, why:whyTens };
