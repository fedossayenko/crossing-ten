// Question kind 'coins': level 43 Монети — The one amount a handful of coins cannot pay.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 18: a single 1-euro coin lets you fix the parity, so every amount up to the
// total can be paid and the first that cannot is one above it.
function genCoins(){
  const n1 = 1 + rnd(4), n2 = 1 + rnd(5);
  const T = n1 + 2*n2;
  const asksMax = Math.random() < 0.3;
  return {kind:'coins', n1, n2, T, limit: T + 2, asksMax, ans: asksMax ? T : T + 1};
}
const coinWord = n => n === 1 ? 'монета' : 'монети';

function drawCoins(q){
  if(q.kind === 'coins'){
    const have = '<span class="num">' + q.n1 + '</span> ' + coinWord(q.n1) + ' от 1 евро и <span class="num">' +
      q.n2 + '</span> ' + coinWord(q.n2) + ' от 2 евро';
    return '<div class="ask">' + (q.asksMax
      ? 'Коя е <b>най-голямата</b> сума, която можем да заплатим, ако имаме ' + have + '?'
      : 'Коя сума, по-малка от <span class="num">' + q.limit + '</span> евро, <b>НЕ</b> може да се заплати, ако имаме ' +
        have + '?') + '</div>' +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + SLOT + ' <span class="unit">евро</span></div>';
  }
}
function eqCoins(q){
  if(q.kind === 'coins') return q.n1 + '×1 + ' + q.n2 + '×2 = ' + q.T + ' → ' + q.ans;
}
function whyCoins(q, full){
  if(q.kind === 'coins'){
    if(!full) return 'Монетите от 1 евро позволяват всяка сума до сбора.';
    const total = q.n1 + ' + ' + (2*q.n2) + ' = <b>' + q.T + '</b> евро';
    return 'всичко имаме ' + total + (q.asksMax ? '' :
      ' &nbsp;→&nbsp; всяка сума до ' + q.T + ' може да се плати, значи не може ' + q.ans);
  }
}
KIND.coins = { draw:drawCoins, eq:eqCoins, why:whyCoins };
