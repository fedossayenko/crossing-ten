// Question kind 'consec': level 93 Последователни числа — Two numbers in a row, from a sum given in words.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Коледно състезание 2025, задача 5: two consecutive numbers add to the gap between the largest
// and the smallest two-digit numbers with tens digit 5: 59 − 50 = 9 = 4 + 5, so 4. Two
// numbers in a row are a number and one more: take the one away, halve what is left.
function genConsec(){
  for(;;){
    const t = 1 + rnd(9), s = 1 + rnd(t), X = 10*t + 9 - 10*s;
    if(X > 99) continue;
    const small = Math.random() < 0.65;
    return {kind:'consec', t, s, X, small, ans: small ? (X - 1) / 2 : (X + 1) / 2};
  }
}
function drawConsec(q){
  if(q.kind === 'consec'){
    const which = q.t === q.s ? tr('най-голямото и най-малкото двуцифрени числа с цифра на десетиците <span class="num">' + q.t + '</span>',
                                  'найбільшого й найменшого двоцифрових чисел із цифрою десятків <span class="num">' + q.t + '</span>')
      : tr('най-голямото двуцифрено число с цифра на десетиците <span class="num">' + q.t + '</span> и най-малкото двуцифрено число с цифра на десетиците <span class="num">' + q.s + '</span>',
           'найбільшого двоцифрового числа з цифрою десятків <span class="num">' + q.t + '</span> і найменшого двоцифрового числа з цифрою десятків <span class="num">' + q.s + '</span>');
    return '<div class="ask">' + tr('Сборът на две <b>последователни</b> числа е равен на разликата на ' + which + '. Кое е <b>' + (q.small ? 'по-малкото' : 'по-голямото') + '</b> от последователните числа?',
      'Сума двох <b>послідовних</b> чисел дорівнює різниці ' + which + '. Яке з послідовних чисел <b>' + (q.small ? 'менше' : 'більше') + '</b>?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqConsec(q){
  if(q.kind === 'consec') return (10*q.t + 9) + ' − ' + 10*q.s + ' = ' + q.X + ' = ' + (q.X - 1)/2 + ' + ' + (q.X + 1)/2 + ' → ' + q.ans;
}
function whyConsec(q, full){
  if(q.kind === 'consec'){
    if(!full) return tr('Първо намери двете двуцифрени числа. Последователните числа се различават с едно.', 'Спершу знайди два двоцифрові числа. Послідовні числа різняться на одиницю.');
    const a = (q.X - 1) / 2;
    return (10*q.t + 9) + ' − ' + 10*q.s + ' = <b>' + q.X + '</b> &nbsp;→&nbsp; ' + q.X + ' − 1 = ' + (q.X - 1) + ', ' + (q.X - 1) + ' : 2 = ' + a +
      ' &nbsp;→&nbsp; ' + a + ' + ' + (a + 1) + ' = ' + q.X + ' &nbsp;→&nbsp; ' + q.ans;
  }
}
KIND.consec = { draw:drawConsec, eq:eqConsec, why:whyConsec };
