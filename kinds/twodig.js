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

function drawTwodig(q){
  if(q.kind === 'twodig'){
    const what = q.ask === 0 ? 'От по-голямото извадете по-малкото. Колко е получената разлика?'
               : q.ask === 1 ? 'Кое е по-голямото от тях?' : 'Кое е по-малкото от тях?';
    return '<div class="ask">Сборът на две <b>различни</b> ' + (q.three ? 'трицифрени' : 'двуцифрени') +
      ' числа е <span class="num">' + q.S + '</span>. ' + what + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqTwodig(q){
  if(q.kind === 'twodig') return 'сбор ' + q.S + ' → ' + q.lo + ' и ' + q.hi + ' → ' + q.ans;
}
function whyTwodig(q, full){
  if(q.kind === 'twodig'){
    if(!full) return q.three ? 'Най-малкото трицифрено число е граница.' : 'Най-малкото двуцифрено число е граница.';
    return 'числата могат да са само <b>' + q.lo + '</b> и <b>' + q.hi + '</b> &nbsp;→&nbsp; ' +
      (q.ask === 0 ? q.hi + ' − ' + q.lo + ' = ' + q.ans : 'търсеното е ' + q.ans);
  }
}
KIND.twodig = { draw:drawTwodig, eq:eqTwodig, why:whyTwodig };
