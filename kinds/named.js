// Question kind 'named': level 13 Най-малкото — Smallest two-digit, largest one-digit, then compare.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 6: the vocabulary of place value, on its own or feeding a comparison.
const NAMED = [
  { nm:'най-голямото едноцифрено число', v:9 },
  { nm:'най-малкото двуцифрено число',   v:10 },
  { nm:'най-голямото двуцифрено число',  v:99 },
  { nm:'най-малкото трицифрено число',   v:100 }
];
// The widest gap between the largest and smallest of k different digits adding to S,
// found by looking at every such set rather than by a rule.
function widestGap(k, S){
  let best = -1, wit = null;
  (function walk(start, left, cur, sum){
    if(sum > S) return;
    if(left === 0){
      if(sum === S){
        const gap = cur[cur.length-1] - cur[0];
        if(gap > best){ best = gap; wit = cur.slice(); }
      }
      return;
    }
    for(let v = start; v <= 9; v++) walk(v + 1, left - 1, cur.concat(v), sum + v);
  })(0, k, [], 0);
  return {best, wit};
}
function genNamed(){
  if(Math.random() < 0.22){
    // Задача 18: with the sum fixed, the biggest is as large as the others are small —
    // and the smallest the others can be is 0, 1, 2, …
    for(;;){
      const k = 4 + rnd(3);
      const floor = (k - 2)*(k - 1)/2;
      const S = floor + 2 + rnd(12);
      const top = S - floor;
      if(top <= k - 2) continue;               // the biggest has to beat every other one
      return {kind:'named', shape:4, k, S, floor, ans: top};
    }
  }
  if(Math.random() < 0.25){
    // Задача 16: how far apart the ends can be, given the sum.
    if(Math.random() < 0.25){
      const S = 12 + rnd(24);                  // "няколко" — nothing stops us taking 0 and 9
      return {kind:'named', shape:3, loose:true, S, ans: 9};
    }
    for(;;){
      const k = 3 + rnd(3);
      const S = 6 + rnd(25);
      const g = widestGap(k, S);
      if(g.best < 2) continue;
      return {kind:'named', shape:3, k, S, wit: g.wit, ans: g.best};
    }
  }
  if(Math.random() < 0.3){
    // Задача 17: the smallest (or largest) sum of k different numbers — take the k
    // smallest, or the k largest. Zero counts as a one-digit number.
    const k = 3 + rnd(4);
    const small = Math.random() < 0.6, two = Math.random() < 0.3;
    const list = [];
    for(let i = 0; i < k; i++) list.push(small ? (two ? 10 : 0) + i : (two ? 99 : 9) - i);
    return {kind:'named', shape:2, k, small, two, list, ans: list.reduce((t, v) => t + v, 0)};
  }
  if(Math.random() < 0.55){
    const t = NAMED[rnd(NAMED.length)];
    return {kind:'named', shape:0, nm:t.nm, ans:t.v};
  }
  const R = [14,15,16,17,18,20,22,25][rnd(8)];   // 10 + 9 = 19, so R is never 19
  return {kind:'named', shape:1, R, ans: Math.abs(19 - R)};
}

function drawNamed(q){
  if(q.kind === 'named'){
    if(q.shape === 4){
      return '<div class="ask">Сборът на <b>' + BGNUM[q.k] + ' различни</b> числа е <span class="num">' +
        q.S + '</span>. Колко <b>най-много</b> може да бъде <b>най-голямото</b> сред тях?</div>' +
        '<div class="note">Числата са 0, 1, 2, 3, …</div>' +
        '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
    }
    const ask = q.shape === 3
      ? 'Сборът на <b>' + (q.loose ? 'няколко' : BGNUM[q.k]) +
        ' различни</b> едноцифрени числа е <span class="num">' + q.S +
        '</span>. Пресметнете <b>най-голямата възможна разлика</b> на най-голямото и най-малкото сред тях.'
      : q.shape === 2
      ? 'Колко е най-' + (q.small ? 'малкият' : 'големият') + ' сбор на <b>' + BGNUM[q.k] +
        ' различни</b> ' + (q.two ? 'двуцифрени' : 'едноцифрени') + ' числа?'
      : q.shape === 0
      ? 'Кое е ' + q.nm + '?'
      : 'Съберете най-малкото двуцифрено и най-голямото едноцифрено число. С колко полученият сбор е ' +
        (q.R > 19 ? 'по-малък' : 'по-голям') + ' от <span class="num">' + q.R + '</span>?';
    return '<div class="ask">' + ask + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqNamed(q){
  if(q.kind === 'named' && q.shape === 4) return q.k + ' различни, сбор ' + q.S + ' → най-голямо ' + q.ans;
  if(q.kind === 'named' && q.shape === 3) return 'сбор ' + q.S +
    (q.loose ? '' : ' от ' + q.k + ' цифри') + ' → най-голяма разлика ' + q.ans;
  if(q.kind === 'named' && q.shape === 2) return 'най-' + (q.small ? 'малките ' : 'големите ') +
    q.k + ' числа → ' + q.ans;
  if(q.kind === 'named') return q.shape === 0 ? q.nm + ' = ' + q.ans
    : '10 + 9 = 19, ' + (q.R > 19 ? q.R + ' − 19' : '19 − ' + q.R) + ' = ' + q.ans;
}
function whyNamed(q, full){
  if(q.kind === 'named'){
    if(q.shape === 4){
      if(!full) return 'За да е най-голямо едното, останалите трябва да са възможно най-малки.';
      const rest = [];
      for(let v = 0; v <= q.k - 2; v++) rest.push(v);
      return 'останалите ' + (q.k - 1) + ' са най-малко ' + rest.join(' + ') + ' = <b>' + q.floor +
        '</b> &nbsp;→&nbsp; ' + q.S + ' − ' + q.floor + ' = ' + q.ans;
    }
    if(!full && q.shape === 3) return 'Опитай се да включиш най-малката и най-голямата цифра.';
    if(q.shape === 3) return q.loose
      ? 'вземаме <b>0</b> и <b>9</b>; останалите трябва да дадат ' + (q.S - 9) +
        ', което може с различни цифри &nbsp;→&nbsp; 9 − 0 = ' + q.ans
      : 'например ' + q.wit.join(' + ') + ' = ' + q.S + ' &nbsp;→&nbsp; ' +
        q.wit[q.wit.length-1] + ' − ' + q.wit[0] + ' = ' + q.ans;
    if(!full) return q.shape === 2 ? 'Вземи възможно най-' + (q.small ? 'малките' : 'големите') + ' различни числа.'
            : q.shape === 0 ? 'Колко цифри трябва да има числото?' : 'Първо сборът, после сравнението.';
    if(q.shape === 2) return 'най-' + (q.small ? 'малките' : 'големите') + ' са <b>' + q.list.join(', ') +
      '</b> &nbsp;→&nbsp; ' + q.list.join(' + ') + ' = ' + q.ans;
    if(q.shape === 0) return q.nm + ' е <b>' + q.ans + '</b>';
    return '10 + 9 = <b>19</b> &nbsp;→&nbsp; ' + (q.R > 19 ? q.R + ' − 19' : '19 − ' + q.R) + ' = ' + q.ans;
  }
}
KIND.named = { draw:drawNamed, eq:eqNamed, why:whyNamed };
