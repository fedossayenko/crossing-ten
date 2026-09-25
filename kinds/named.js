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
// every way to pick k different numbers 0, 1, 2, … adding to S, by the largest one: {largest: one such set}
function namedTops(k, S){
  const tops = {};
  (function walk(start, left, cur, sum){
    if(sum > S) return;
    if(left === 0){ if(sum === S) tops[cur[cur.length - 1]] = tops[cur[cur.length - 1]] || cur.slice(); return; }
    for(let v = start; v <= S; v++) walk(v + 1, left - 1, cur.concat(v), sum + v);
  })(0, k, [], 0);
  return tops;
}
// МБГ Зима 2022, задача 20: two two-digit numbers written with four different digits — the largest
// difference is 98 − 10 = 88. The same frame asks the smallest sum, the largest sum, the smallest difference.
const NAMED_FOUR = [['най-голямата разлика', 'найбільшу різницю', (x, y) => x - y, 1], ['най-малката разлика', 'найменшу різницю', (x, y) => x - y, -1],
                    ['най-големия сбор', 'найбільшу суму', (x, y) => x + y, 1], ['най-малкия сбор', 'найменшу суму', (x, y) => x + y, -1]];
function namedFour(v){
  let best = null, wit = null;
  for(let x = 10; x <= 99; x++) for(let y = 10; y < x; y++){
    const ds = String(x) + y;
    if(new Set(ds).size !== 4) continue;
    const r = NAMED_FOUR[v][2](x, y);
    if(r > 0 && (best === null || (r - best)*NAMED_FOUR[v][3] > 0)){ best = r; wit = [x, y]; }
  }
  return {best, wit};
}
function genNamed(){
  if(Math.random() < 0.06){
    const v = Math.random() < 0.5 ? 0 : rnd(4), f = namedFour(v);
    return {kind:'named', shape:5, v, wit: f.wit, ans: f.best};
  }
  if(Math.random() < 0.08){
    // Зима 2023: not «at most» but «what can it be» — five different numbers adding to 12 leave
    // the largest only 6 (0 1 2 3 6) or 5 (0 1 2 4 5), so both are the answer
    for(;;){
      const k = 3 + rnd(3), floor = (k - 1)*k/2, S = floor + 1 + rnd(3), tops = namedTops(k, S), vals = Object.keys(tops).map(Number).sort((a, b) => b - a);
      if(vals.length !== 2) continue;
      return {kind:'named', shape:4, may:1, k, S, tops: vals.map(v => tops[v]), slots:2, ans: vals[0], alt:[vals[1]]};
    }
  }
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

const namedUk = {
  'най-голямото едноцифрено число': 'найбільше одноцифрове число',
  'най-малкото двуцифрено число':   'найменше двоцифрове число',
  'най-голямото двуцифрено число':  'найбільше двоцифрове число',
  'най-малкото трицифрено число':   'найменше трицифрове число'
};
const namedGen = {2:'двох', 3:'трьох', 4:'чотирьох', 5:'п’яти', 6:'шести', 7:'семи'};
const namedNum = n => n + ' ' + (new Intl.PluralRules('uk').select(n) === 'few' ? 'числа' : n === 1 ? 'число' : 'чисел');

function drawNamed(q){
  if(q.kind === 'named'){
    if(q.shape === 5){
      return '<div class="ask">' + tr('Кое е <b>' + NAMED_FOUR[q.v][0] + '</b> на две двуцифрени числа, записани с <b>4 различни</b> цифри?',
        'Яку <b>' + NAMED_FOUR[q.v][1] + '</b> можуть мати два двоцифрові числа, записані <b>4 різними</b> цифрами?') + '</div>' +
        '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
    }
    if(q.shape === 4 && q.may){
      return tr('<div class="ask">Сборът на <b>' + BGNUM[q.k] + ' различни</b> числа е <span class="num">' + q.S + '</span>. Колко <b>може да бъде</b> най-голямото сред тях?</div>',
        '<div class="ask">Сума <b>' + namedGen[q.k] + ' різних</b> чисел дорівнює <span class="num">' + q.S + '</span>. Яким <b>може бути</b> найбільше з них?</div>') +
        '<div class="note">' + tr('Числата са 0, 1, 2, 3, …', 'Числа: 0, 1, 2, 3, …') + '</div>' +
        '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + ' <span class="or">' + tr('или', 'або') + '</span> <span class="slot" id="slot1"></span></div>';
    }
    if(q.shape === 4){
      return tr('<div class="ask">Сборът на <b>' + BGNUM[q.k] + ' различни</b> числа е <span class="num">' +
        q.S + '</span>. Колко <b>най-много</b> може да бъде <b>най-голямото</b> сред тях?</div>' +
        '<div class="note">Числата са 0, 1, 2, 3, …</div>',
        '<div class="ask">Сума <b>' + namedGen[q.k] + ' різних</b> чисел дорівнює <span class="num">' +
        q.S + '</span>. Яким <b>найбільшим</b> може бути <b>найбільше</b> з них?</div>' +
        '<div class="note">Числа: 0, 1, 2, 3, …</div>') +
        '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
    }
    const ask = q.shape === 3
      ? tr('Сборът на <b>' + (q.loose ? 'няколко' : BGNUM[q.k]) +
        ' различни</b> едноцифрени числа е <span class="num">' + q.S +
        '</span>. Пресметнете <b>най-голямата възможна разлика</b> на най-голямото и най-малкото сред тях.',
        'Сума <b>' + (q.loose ? 'кількох' : namedGen[q.k]) +
        ' різних</b> одноцифрових чисел дорівнює <span class="num">' + q.S +
        '</span>. Обчисліть <b>найбільшу можливу різницю</b> між найбільшим і найменшим із них.')
      : q.shape === 2
      ? tr('Колко е най-' + (q.small ? 'малкият' : 'големият') + ' сбор на <b>' + BGNUM[q.k] +
        ' различни</b> ' + (q.two ? 'двуцифрени' : 'едноцифрени') + ' числа?',
        'Яка ' + (q.small ? 'найменша' : 'найбільша') + ' сума <b>' + namedGen[q.k] +
        ' різних</b> ' + (q.two ? 'двоцифрових' : 'одноцифрових') + ' чисел?')
      : q.shape === 0
      ? tr('Кое е ' + q.nm + '?', 'Яке ' + namedUk[q.nm] + '?')
      : tr('Съберете най-малкото двуцифрено и най-голямото едноцифрено число. С колко полученият сбор е ' +
        (q.R > 19 ? 'по-малък' : 'по-голям') + ' от <span class="num">' + q.R + '</span>?',
        'Додайте найменше двоцифрове і найбільше одноцифрове числа. На скільки отримана сума ' +
        (q.R > 19 ? 'менша' : 'більша') + ' від <span class="num">' + q.R + '</span>?');
    return '<div class="ask">' + ask + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqNamed(q){
  if(q.kind === 'named' && q.shape === 5) return q.wit[0] + (q.v < 2 ? ' − ' : ' + ') + q.wit[1] + ' = ' + q.ans;
  if(q.kind === 'named' && q.shape === 4 && q.may) return q.tops.map(t => t.join('+')).join(tr(' или ', ' або ')) + ' → ' + q.ans + tr(' или ', ' або ') + q.alt[0];
  if(q.kind === 'named' && q.shape === 4) return tr(q.k + ' различни, сбор ' + q.S + ' → най-голямо ' + q.ans,
    q.k + ' різних, сума ' + q.S + ' → найбільше ' + q.ans);
  if(q.kind === 'named' && q.shape === 3) return tr('сбор ' + q.S +
    (q.loose ? '' : ' от ' + q.k + ' цифри') + ' → най-голяма разлика ' + q.ans,
    'сума ' + q.S + (q.loose ? '' : ' з ' + q.k + ' цифр') + ' → найбільша різниця ' + q.ans);
  if(q.kind === 'named' && q.shape === 2) return tr('най-' + (q.small ? 'малките ' : 'големите ') +
    q.k + ' числа → ' + q.ans, (q.small ? 'найменші ' : 'найбільші ') + namedNum(q.k) + ' → ' + q.ans);
  if(q.kind === 'named') return q.shape === 0 ? tr(q.nm, namedUk[q.nm]) + ' = ' + q.ans
    : '10 + 9 = 19, ' + (q.R > 19 ? q.R + ' − 19' : '19 − ' + q.R) + ' = ' + q.ans;
}
function whyNamed(q, full){
  if(q.kind === 'named'){
    if(q.shape === 5){
      if(!full) return q.v === 0 ? tr('Едното възможно най-голямо, другото — най-малкото с останалите цифри.', 'Одне якомога більше, друге — найменше з решти цифр.')
        : q.v === 1 ? tr('Двете числа трябва да са съвсем близо — едното малко над кръгло число, другото малко под него.', 'Два числа мають бути зовсім близько — одне трохи більше за кругле число, інше трохи менше.')
        : q.v === 2 ? tr('Най-големите цифри отиват в десетиците.', 'Найбільші цифри йдуть у десятки.')
        : tr('Най-малките цифри отиват в десетиците, но двуцифрено число не започва с 0.', 'Найменші цифри йдуть у десятки, але двоцифрове число не починається з 0.');
      return tr('например ', 'наприклад ') + q.wit[0] + (q.v < 2 ? ' − ' : ' + ') + q.wit[1] + tr(' (цифрите ', ' (цифри ') + (String(q.wit[0]) + q.wit[1]).split('').join(', ') + tr(' са различни)', ' різні)') + ' &nbsp;→&nbsp; ' + q.ans;
    }
    if(q.shape === 4 && q.may){
      if(!full) return tr('Започни от най-малките: 0, 1, 2, … — после виж как може да се раздели остатъкът.', 'Почни з найменших: 0, 1, 2, … — потім подивися, як можна розподілити решту.');
      return q.tops.map(t => t.join(' + ') + ' = ' + q.S + ' &nbsp;→&nbsp; <b>' + t[t.length - 1] + '</b>').join('; &nbsp;') + tr(' &nbsp;→&nbsp; други няма: ', ' &nbsp;→&nbsp; інших немає: ') + q.ans + tr(' или ', ' або ') + q.alt[0];
    }
    if(q.shape === 4){
      if(!full) return tr('За да е най-голямо едното, останалите трябва да са възможно най-малки.',
        'Щоб одне було найбільшим, решта мають бути якомога меншими.');
      const rest = [];
      for(let v = 0; v <= q.k - 2; v++) rest.push(v);
      return tr('останалите ' + (q.k - 1) + ' са най-малко ', 'інші ' + namedNum(q.k - 1) + ' — щонайменше ') +
        rest.join(' + ') + ' = <b>' + q.floor +
        '</b> &nbsp;→&nbsp; ' + q.S + ' − ' + q.floor + ' = ' + q.ans;
    }
    if(!full && q.shape === 3) return tr('Опитай се да включиш най-малката и най-голямата цифра.',
      'Спробуй узяти найменшу й найбільшу цифри.');
    if(q.shape === 3) return q.loose
      ? tr('вземаме <b>0</b> и <b>9</b>; останалите трябва да дадат ' + (q.S - 9) +
        ', което може с различни цифри',
        'беремо <b>0</b> і <b>9</b>; решта мають дати ' + (q.S - 9) +
        ', а це можна зробити різними цифрами') + ' &nbsp;→&nbsp; 9 − 0 = ' + q.ans
      : tr('например ', 'наприклад ') + q.wit.join(' + ') + ' = ' + q.S + ' &nbsp;→&nbsp; ' +
        q.wit[q.wit.length-1] + ' − ' + q.wit[0] + ' = ' + q.ans;
    if(!full) return q.shape === 2 ? tr('Вземи възможно най-' + (q.small ? 'малките' : 'големите') + ' различни числа.',
              'Візьми якомога ' + (q.small ? 'менші' : 'більші') + ' різні числа.')
            : q.shape === 0 ? tr('Колко цифри трябва да има числото?', 'Скільки цифр має бути в числі?')
            : tr('Първо сборът, после сравнението.', 'Спочатку сума, потім порівняння.');
    if(q.shape === 2) return tr('най-' + (q.small ? 'малките' : 'големите') + ' са <b>',
      (q.small ? 'найменші' : 'найбільші') + ': <b>') + q.list.join(', ') +
      '</b> &nbsp;→&nbsp; ' + q.list.join(' + ') + ' = ' + q.ans;
    if(q.shape === 0) return tr(q.nm + ' е <b>', namedUk[q.nm] + ' — це <b>') + q.ans + '</b>';
    return '10 + 9 = <b>19</b> &nbsp;→&nbsp; ' + (q.R > 19 ? q.R + ' − 19' : '19 − ' + q.R) + ' = ' + q.ans;
  }
}
KIND.named = { draw:drawNamed, eq:eqNamed, why:whyNamed };
