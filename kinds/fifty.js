// Question kind 'fifty': level 79 1 + 49 + 2 + 48 — Numbers that pair up into a round fifty, then used.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Зима 2024, задачи 1–3: 1 + 49 and 2 + 48 make a hundred on sight. Then take a
// round number away, count the tens, or say how much bigger it is than 11 + 22 + 33.
function genFifty(){
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
function drawFifty(q){
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
  if(q.kind === 'fifty') return q.shape === 2 ? q.T + ' − ' + q.S + ' = ' + q.ans
    : fiftyExpr(q) + (q.shape === 1 ? ' = ' + q.T + tr(', десетици: ', ', десятків: ') : ' = ') + q.ans;
}
function whyFifty(q, full){
  if(q.kind === 'fifty'){
    if(!full) return tr('Потърси по две числа, които заедно правят кръгло число.', 'Пошукай по два числа, які разом дають кругле число.');
    const [a, b] = q.nums.slice().sort((x, y) => x - y);
    const pairs = '(' + a + ' + ' + (q.base - a) + ') + (' + b + ' + ' + (q.base - b) + ') = ' + q.base + ' + ' + q.base + ' = <b>' + q.T + '</b>';
    if(q.shape === 0) return pairs + ' &nbsp;→&nbsp; ' + q.T + ' − ' + q.sub + ' = ' + q.ans;
    if(q.shape === 1) return pairs + tr(' &nbsp;→&nbsp; десетиците са ', ' &nbsp;→&nbsp; десятків ') + q.ans;
    return pairs + ', ' + q.other.join(' + ') + ' = <b>' + q.S + '</b> &nbsp;→&nbsp; ' + q.T + ' − ' + q.S + ' = ' + q.ans;
  }
}
KIND.fifty = { draw:drawFifty, eq:eqFifty, why:whyFifty };
