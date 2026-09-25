// Question kind 'fifty': level 79 1 + 49 + 2 + 48 — Numbers that pair up into a round fifty, then used.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Зима 2024, задачи 1–3: 1 + 49 and 2 + 48 make a hundred on sight. Then take a
// round number away, count the tens, or say how much bigger it is than 11 + 22 + 33.
// МБГ Зима 2021, 2023: a longer chain whose pairs make different round numbers (1 + 9, 2 + 18,
// 13 + 87) and one more number; then how many tens the sum has, or how far it is short of 100.
function genFiftyLong(){
  for(;;){
    const k = 3 + rnd(2), smalls = shuffle([1,2,3,4,5,6,7,8,9,11,12,13]).slice(0, k), pairs = [];
    smalls.forEach(a => { const bases = [10, 20, 30, 40, 50, 100].filter(b => b > a + 1); const b = bases[rnd(bases.length)]; pairs.push([a, b - a]); });
    const extra = Math.random() < 0.3 ? 0 : 5 + 10*(1 + rnd(6));
    const inOrder = Math.random() < 0.6;
    const nums = inOrder ? pairs.flat() : shuffle(pairs.flat());
    if(extra) nums.push(extra);
    const T = nums.reduce((a, b) => a + b, 0);
    if(T > 199 || T === 100) continue;
    const less = T < 100 && Math.random() < 0.5;
    return {kind:'fifty', shape:3, pairs, extra, nums, T, less, ans: less ? 100 - T : Math.floor(T/10)};
  }
}
// МБГ Зима 2022: round tens, each with a little taken off — 40 − 1 + 20 − 2 + 30 − 3 + 20 − 4.
// The tens make 110, the ones take 10 away: 100, so 10 tens.
function genFiftyTens(){
  const k = 3 + rnd(2), tens = [], ones = shuffle([1,2,3,4,5,6,7,8,9]).slice(0, k), ordered = Math.random() < 0.5;
  if(ordered) ones.sort((a, b) => a - b);
  for(let i = 0; i < k; i++) tens.push(10*(1 + rnd(5)));
  const T = tens.reduce((a, b) => a + b, 0) - ones.reduce((a, b) => a + b, 0);
  return {kind:'fifty', shape:4, tens, ones, T, ans: Math.floor(T/10)};
}
function genFifty(){
  if(Math.random() < 0.15) return genFiftyTens();
  if(Math.random() < 0.3) return genFiftyLong();
  const base = [30, 40, 50][rnd(3)];
  const small = shuffle([1,2,3,4,5,6,7,8,9]).slice(0, 2);
  const nums = [];
  small.forEach(a => nums.push(a, base - a));
  const T = 2*base, shape = rnd(3);
  if(shape === 0){
    // 1 + 49 + 2 + 48 − 60: each small one sits next to its partner
    const sub = 10*(1 + rnd(T/10 - 1));
    return {kind:'fifty', shape, base, nums, sub, T, ans: T - sub};
  }
  if(shape === 1) return {kind:'fifty', shape, base, nums: shuffle(nums).sort((a, b) => a - b), T, ans: T/10};
  // the other sum: two or three numbers made of repeated digits, smaller than T
  for(;;){
    const k = 2 + rnd(2), other = shuffle([11,22,33,44]).slice(0, k).sort((a, b) => a - b);
    const S = other.reduce((a, b) => a + b, 0);
    if(S < T) return {kind:'fifty', shape, base, nums: [nums[0], nums[2], nums[1], nums[3]], other, S, T, ans: T - S};
  }
}
const fiftyExpr = q => q.nums.join(' + ') + (q.shape === 0 ? ' − ' + q.sub : '');
const fiftyTensExpr = q => q.tens.map((t, i) => (i ? ' + ' : '') + t + ' − ' + q.ones[i]).join('');
function drawFifty(q){
  if(q.kind === 'fifty' && q.shape === 4){
    const E = '<span class="num">' + fiftyTensExpr(q) + '</span>';
    return '<div class="ask">' + tr('Пресметнете ' + E + '. Колко са <b>десетиците</b> в полученото число?', 'Обчисліть ' + E + '. Скільки <b>десятків</b> в отриманому числі?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'fifty' && q.shape === 3){
    const E = '<span class="num">' + q.nums.join(' + ') + '</span>';
    return '<div class="ask">' + (q.less ? tr('С колко сборът ' + E + ' е <b>по-малък</b> от <span class="num">100</span>?', 'На скільки сума ' + E + ' <b>менша</b> за <span class="num">100</span>?')
      : tr('Пресметнете ' + E + '. Колко са <b>десетиците</b> в полученото число?', 'Обчисліть ' + E + '. Скільки <b>десятків</b> в отриманому числі?')) + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'fifty'){
    const ask = q.shape === 0 ? tr('Пресметнете', 'Обчисліть')
      : q.shape === 1 ? tr('Колко са <b>десетиците</b> в пресметнатия сбор?', 'Скільки <b>десятків</b> в обчисленій сумі?')
      : tr('С колко сборът <span class="num">' + q.nums.join(' + ') + '</span> е <b>по-голям</b> от сбора <span class="num">' + q.other.join(' + ') + '</span>?',
           'На скільки сума <span class="num">' + q.nums.join(' + ') + '</span> <b>більша</b> за суму <span class="num">' + q.other.join(' + ') + '</span>?');
    return '<div class="ask">' + ask + '</div>' +
      (q.shape === 2 ? '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>'
        : '<div class="line" style="font-size:clamp(26px,7.5vw,44px)"><span class="num">' + fiftyExpr(q) + '</span>' +
          (q.shape === 0 ? ' = ' + SLOT : '</div><div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT) + '</div>');
  }
}
function eqFifty(q){
  if(q.kind === 'fifty' && q.shape === 4) return fiftyTensExpr(q) + ' = ' + q.T + tr(', десетици: ', ', десятків: ') + q.ans;
  if(q.kind === 'fifty' && q.shape === 3) return q.nums.join(' + ') + ' = ' + q.T + (q.less ? ', 100 − ' + q.T + ' = ' : tr(', десетици: ', ', десятків: ')) + q.ans;
  if(q.kind === 'fifty') return q.shape === 2 ? q.T + ' − ' + q.S + ' = ' + q.ans
    : fiftyExpr(q) + (q.shape === 1 ? ' = ' + q.T + tr(', десетици: ', ', десятків: ') : ' = ') + q.ans;
}
function whyFifty(q, full){
  if(q.kind === 'fifty'){
    if(!full) return tr('Потърси по две числа, които заедно правят кръгло число.', 'Пошукай по два числа, які разом дають кругле число.');
    if(q.shape === 4){
      const up = q.tens.reduce((a, b) => a + b, 0), down = q.ones.reduce((a, b) => a + b, 0);
      return tr('десетиците: ', 'десятки: ') + q.tens.join(' + ') + ' = <b>' + up + '</b>, ' + tr('извадените: ', 'відняті: ') + q.ones.join(' + ') + ' = <b>' + down + '</b> &nbsp;→&nbsp; ' + up + ' − ' + down + ' = ' + q.T +
        ' &nbsp;→&nbsp; ' + tr(q.ans + ' десетици', ukN(q.ans, 'десяток', 'десятки', 'десятків')) + (q.T % 10 ? ' + ' + q.T % 10 : '') + ' &nbsp;→&nbsp; ' + q.ans;
    }
    if(q.shape === 3){
      const grouped = q.pairs.map(([a, b]) => '(' + a + ' + ' + b + ')').join(' + ') + (q.extra ? ' + ' + q.extra : '');
      const rounds = q.pairs.map(([a, b]) => a + b).join(' + ') + (q.extra ? ' + ' + q.extra : '');
      return grouped + ' = ' + rounds + ' = <b>' + q.T + '</b> &nbsp;→&nbsp; ' + (q.less ? '100 − ' + q.T + ' = ' + q.ans
        : q.T + ' = ' + tr(q.ans + ' десетици', ukN(q.ans, 'десяток', 'десятки', 'десятків')) + (q.T % 10 ? ' + ' + q.T % 10 : '') + ' &nbsp;→&nbsp; ' + q.ans);
    }
    const [a, b] = q.nums.slice().sort((x, y) => x - y);
    const pairs = '(' + a + ' + ' + (q.base - a) + ') + (' + b + ' + ' + (q.base - b) + ') = ' + q.base + ' + ' + q.base + ' = <b>' + q.T + '</b>';
    if(q.shape === 0) return pairs + ' &nbsp;→&nbsp; ' + q.T + ' − ' + q.sub + ' = ' + q.ans;
    if(q.shape === 1) return pairs + tr(' &nbsp;→&nbsp; десетиците са ', ' &nbsp;→&nbsp; десятків ') + q.ans;
    return pairs + ', ' + q.other.join(' + ') + ' = <b>' + q.S + '</b> &nbsp;→&nbsp; ' + q.T + ' − ' + q.S + ' = ' + q.ans;
  }
}
KIND.fifty = { draw:drawFifty, eq:eqFifty, why:whyFifty };
