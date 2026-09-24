// Question kind 'coins': level 43 Монети — The one amount a handful of coins cannot pay.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 18: a single 1-euro coin lets you fix the parity, so every amount up to the
// total can be paid and the first that cannot is one above it.
// МБГ Зима 2023: five coins, each 1 or 2 euro, both kinds there — every amount they can make.
// All ones would be 5, all twos 10; with both kinds it is 6, 7, 8 or 9 — one per count of twos.
function genCoinsMix(){
  const n = 3 + rnd(3), vals = [];
  for(let k = 1; k < n; k++) vals.push(n + k);                    // k coins of 2, the rest 1
  return {kind:'coins', shape:'mix', n, vals, slots: vals.length, ans: vals[0], alt: vals.slice(1)};
}
function genCoins(){
  if(Math.random() < 0.25) return genCoinsMix();
  const n1 = 1 + rnd(4), n2 = 1 + rnd(5);
  const T = n1 + 2*n2;
  const asksMax = Math.random() < 0.3;
  return {kind:'coins', n1, n2, T, limit: T + 2, asksMax, ans: asksMax ? T : T + 1};
}
const coinWord = n => n === 1 ? 'монета' : 'монети';
const coinsUkWord = n => ({one:'монету', few:'монети'})[new Intl.PluralRules('uk').select(n)] || 'монет';

function drawCoins(q){
  if(q.kind === 'coins' && q.shape === 'mix'){
    const slots = q.vals.map((_, i) => i ? ' <span class="or">,</span> <span class="slot" id="slot' + i + '"></span>' : SLOT).join('');
    return '<div class="ask">' + tr('Саид има <span class="num">' + q.n + '</span> монети, всяка от които е или 1, или 2 евро. Колко евро може да има Саид? (Саид има <b>и от двата вида</b> монети.)',
      'Саїд має <span class="num">' + q.n + '</span> монет' + (q.n < 5 ? 'и' : '') + ', кожна з яких — або 1, або 2 євро. Скільки євро може бути в Саїда? (Саїд має монети <b>обох видів</b>.)') + '</div>' +
      '<div class="note">' + tr('Запиши всички възможни суми.', 'Випиши всі можливі суми.') + '</div>' +
      '<div class="line" style="font-size:clamp(20px,5.6vw,34px)">' + slots + ' <span class="unit">' + tr('евро', 'євро') + '</span></div>';
  }
  if(q.kind === 'coins'){
    const have = tr('<span class="num">' + q.n1 + '</span> ' + coinWord(q.n1) + ' от 1 евро и <span class="num">' +
      q.n2 + '</span> ' + coinWord(q.n2) + ' от 2 евро',
      '<span class="num">' + q.n1 + '</span> ' + coinsUkWord(q.n1) + ' по 1 євро і <span class="num">' +
      q.n2 + '</span> ' + coinsUkWord(q.n2) + ' по 2 євро');
    return '<div class="ask">' + (q.asksMax
      ? tr('Коя е <b>най-голямата</b> сума, която можем да заплатим, ако имаме ' + have + '?',
           'Яку <b>найбільшу</b> суму ми можемо заплатити, якщо маємо ' + have + '?')
      : tr('Коя сума, по-малка от <span class="num">' + q.limit + '</span> евро, <b>НЕ</b> може да се заплати, ако имаме ' +
        have + '?',
           'Яку суму, меншу за <span class="num">' + q.limit + '</span> євро, <b>НЕ</b> можна заплатити, якщо маємо ' +
        have + '?')) + '</div>' +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + SLOT + ' <span class="unit">' + tr('евро', 'євро') + '</span></div>';
  }
}
function eqCoins(q){
  if(q.kind === 'coins' && q.shape === 'mix') return q.n + tr(' монети, и от двата вида → ', ' монет, обох видів → ') + q.vals.join(', ');
  if(q.kind === 'coins') return q.n1 + '×1 + ' + q.n2 + '×2 = ' + q.T + ' → ' + q.ans;
}
function whyCoins(q, full){
  if(q.kind === 'coins' && q.shape === 'mix'){
    if(!full) return tr('Колко от монетите може да са по 2 евро? Поне една, но не всички.', 'Скільки монет можуть бути по 2 євро? Хоча б одна, але не всі.');
    return q.vals.map((v, i) => (i + 1) + ' × 2 + ' + (q.n - i - 1) + ' × 1 = ' + v).join('; ') + ' &nbsp;→&nbsp; ' + q.vals.join(', ');
  }
  if(q.kind === 'coins'){
    if(!full) return tr('Монетите от 1 евро позволяват всяка сума до сбора.', 'Монети по 1 євро дають змогу заплатити будь-яку суму аж до загальної.');
    const total = q.n1 + ' + ' + (2*q.n2) + ' = <b>' + q.T + '</b> ' + tr('евро', 'євро');
    return tr('всичко имаме ', 'усього маємо ') + total + (q.asksMax ? '' :
      tr(' &nbsp;→&nbsp; всяка сума до ' + q.T + ' може да се плати, значи не може ',
         ' &nbsp;→&nbsp; будь-яку суму до ' + q.T + ' можна заплатити, отже не можна ') + q.ans);
  }
}
KIND.coins = { draw:drawCoins, eq:eqCoins, why:whyCoins };
