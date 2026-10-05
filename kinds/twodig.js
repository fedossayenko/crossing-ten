// Question kind 'twodig': level 35 Две двуцифрени — Two different two-digit numbers with a given sum.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 15: both numbers are at least ten and different, which for these sums
// leaves exactly one pair — at the bottom of the range or at the top.
function genTwoDig(){
  const three = Math.random() < 0.25;
  const M = three ? 100 : 10, X = three ? 999 : 99;
  const bottom = three ? true : Math.random() < 0.5;
  const k = 1 + rnd(2);
  const lo = bottom ? M : X - k, hi = bottom ? M + k : X;
  const ask = rnd(3);
  return {kind:'twodig', three, S: lo + hi, lo, hi, ask,
          ans: ask === 0 ? hi - lo : ask === 1 ? hi : lo};
}
// МБГ Пролет 2022, 1 клас, задача 14: two different two-digit numbers add to less than 23; the bigger minus the
// smaller? Only 10 + 11 and 10 + 12 are small enough, so 1 or 2 — both are written. Or the bigger one asked.
function genTwoDigUnder(){
  const B = 23 + rnd(4), ask = rnd(2), pairs = [];
  for(let lo = 10; lo < 99; lo++) for(let hi = lo + 1; lo + hi < B; hi++) pairs.push([lo, hi]);
  const vals = [...new Set(pairs.map(([lo, hi]) => ask ? hi : hi - lo))].sort((a, b) => a - b);
  return {kind:'twodig', shape:'under', B, ask, pairs, slots: vals.length, ans: vals[0], alt: vals.slice(1)};
}
const twoDigUnderVals = q => [q.ans].concat(q.alt);

function drawTwodig(q){
  if(q.kind === 'twodig' && q.shape === 'under'){
    const slots = twoDigUnderVals(q).map((_, i) => i ? ', <span class="slot" id="slot' + i + '"></span>' : SLOT).join('');
    return '<div class="ask">' + tr('Събрах две различни двуцифрени числа и получих сбор, по-малък от <span class="num">' + q.B + '</span>. ' +
      (q.ask ? 'Кое е по-голямото от тях?' : 'От по-голямото от тези числа извадих по-малкото. Кое число съм получил?') + ' Запишете <b>всички</b> възможни отговори.',
      'Я додав два різні двоцифрові числа й отримав суму, меншу за <span class="num">' + q.B + '</span>. ' +
      (q.ask ? 'Яке з них більше?' : 'Від більшого з цих чисел я відняв менше. Яке число я отримав?') + ' Запишіть <b>усі</b> можливі відповіді.') + '</div>' +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + slots + '</div>';
  }
  if(q.kind === 'twodig'){
    const what = q.ask === 0 ? tr('От по-голямото извадете по-малкото. Колко е получената разлика?',
                                  'Від більшого відніміть менше. Чому дорівнює отримана різниця?')
               : q.ask === 1 ? tr('Кое е по-голямото от тях?', 'Яке з них більше?')
               : tr('Кое е по-малкото от тях?', 'Яке з них менше?');
    return '<div class="ask">' + tr('Сборът на две <b>различни</b> ' + (q.three ? 'трицифрени' : 'двуцифрени') +
      ' числа е <span class="num">', 'Сума двох <b>різних</b> ' + (q.three ? 'трицифрових' : 'двоцифрових') +
      ' чисел дорівнює <span class="num">') + q.S + '</span>. ' + what + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqTwodig(q){
  if(q.kind === 'twodig' && q.shape === 'under') return q.pairs.map(p => p.join(' + ')).join(', ') + ' → ' + twoDigUnderVals(q).join(', ');
  if(q.kind === 'twodig') return tr('сбор ', 'сума ') + q.S + ' → ' + q.lo + tr(' и ', ' і ') + q.hi + ' → ' + q.ans;
}
function whyTwodig(q, full){
  if(q.kind === 'twodig' && q.shape === 'under'){
    if(!full) return tr('Започни от най-малкото двуцифрено число и търси второ, различно, така че сборът да е достатъчно малък.', 'Почни з найменшого двоцифрового числа й шукай друге, інше, щоб сума була досить малою.');
    return q.pairs.map(([lo, hi]) => lo + ' + ' + hi + ' = ' + (lo + hi)).join(', &nbsp;') + ' &nbsp;→&nbsp; ' +
      (q.ask ? tr('по-голямото: ', 'більше: ') + twoDigUnderVals(q).join(', ') : q.pairs.map(([lo, hi]) => hi + ' − ' + lo + ' = ' + (hi - lo)).join(', ') + ' &nbsp;→&nbsp; ' + twoDigUnderVals(q).join(', '));
  }
  if(q.kind === 'twodig'){
    if(!full) return q.three ? tr('Най-малкото трицифрено число е граница.', 'Найменше трицифрове число — це межа.')
                             : tr('Най-малкото двуцифрено число е граница.', 'Найменше двоцифрове число — це межа.');
    return tr('числата могат да са само <b>' + q.lo + '</b> и <b>', 'числа можуть бути лише <b>' + q.lo + '</b> і <b>') +
      q.hi + '</b> &nbsp;→&nbsp; ' +
      (q.ask === 0 ? q.hi + ' − ' + q.lo + ' = ' + q.ans : tr('търсеното е ', 'шукане число — ') + q.ans);
  }
}
KIND.twodig = { draw:drawTwodig, eq:eqTwodig, why:whyTwodig };
