// Question kind 'age': level 88 След 10 години — An age from how many times older someone will be.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Зима 2024, задача 17: in 10 years Claire will be 3 times as old as now. The 10 years
// are the two "nows" added on top of the first, so she is 5 now — and the question asks
// about 5 years on, which is 10.
const AGE_KIDS = [['Клеър', 'Клер', 1], ['Мая', 'Мая', 1], ['Ния', 'Нія', 1], ['Асен', 'Асен', 0], ['Борис', 'Борис', 0]];
function genAge(){
  const [bg, uk, she] = AGE_KIDS[rnd(AGE_KIDS.length)];
  const m = 2 + rnd(3), now = 2 + rnd(m === 2 ? 9 : 5), a = now*(m - 1);
  const b = 1 + rnd(9), shape = Math.random() < 0.25 ? 0 : 1;
  return {kind:'age', bg, uk, she, m, now, a, b, shape, ans: shape === 0 ? now : now + b};
}
const ageYearsUk = n => ['рік', 'роки', 'років'][{one:0, few:1, many:2}[new Intl.PluralRules('uk').select(n)]];
const ageYearsBg = n => n === 1 ? 'година' : 'години';
function drawAge(q){
  if(q.kind === 'age'){
    const ask = q.shape === 0 ? tr('<b>На колко години е ' + q.bg + ' сега?</b>', '<b>Скільки років ' + q.uk + ' зараз?</b>')
      : tr('<b>На колко години ще бъде ' + q.bg + ' след <span class="num">' + q.b + '</span> ' + ageYearsBg(q.b) + '?</b>',
           '<b>Скільки років буде ' + q.uk + ' через <span class="num">' + q.b + '</span> ' + ageYearsUk(q.b) + '?</b>');
    return '<div class="ask">' + tr('След <span class="num">' + q.a + '</span> години ' + q.bg + ' ще бъде <span class="num">' + q.m + '</span> пъти ' +
      (q.she ? 'по-голяма' : 'по-голям') + ', отколкото е сега. ',
      'Через <span class="num">' + q.a + '</span> ' + ageYearsUk(q.a) + ' ' + q.uk + ' буде у <span class="num">' + q.m + '</span> рази ' +
      (q.she ? 'старшою' : 'старшим') + ', ніж зараз. ') + ask + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqAge(q){
  if(q.kind === 'age') return tr('сега ', 'зараз ') + q.a + ' : ' + (q.m - 1) + ' = ' + q.now + (q.shape ? ', ' + q.now + ' + ' + q.b + ' = ' + q.ans : '');
}
function whyAge(q, full){
  if(q.kind === 'age'){
    if(!full) return tr('Годините, които ще минат, трябва да добавят още няколко пъти сегашната възраст. Колко пъти?',
                        'Роки, які минуть, мають додати ще кілька разів теперішній вік. Скільки разів?');
    return tr('после ще е ' + q.m + ' пъти колкото сега, значи ' + q.a + ' години са ' + (q.m - 1) + ' пъти колкото сега',
              'потім буде у ' + q.m + ' рази більше, ніж зараз, отже ' + q.a + ' ' + ageYearsUk(q.a) + ' — це ' + (q.m - 1) + ' рази теперішній вік') +
      ' &nbsp;→&nbsp; ' + q.a + ' : ' + (q.m - 1) + ' = <b>' + q.now + '</b>' +
      (q.shape ? ' &nbsp;→&nbsp; ' + q.now + ' + ' + q.b + ' = ' + q.ans : '');
  }
}
KIND.age = { draw:drawAge, eq:eqAge, why:whyAge };
