// Question kind 'stepdig': level 82 0, 3, 6, …, x — The last number of a run, from how many digits it takes.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Зима 2024, задача 8: 0, 3, 6, 9, …, x written with 24 digits. The one-digit numbers
// take one digit each, every two-digit one takes two — count the first lot, halve the rest.
function genStepDig(){
  for(;;){
    const k = 2 + rnd(4), start = rnd(2) ? 0 : k;
    const run = [];
    for(let v = start; v < 100; v += k) run.push(v);
    const ones = run.filter(v => v < 10), twos = run.filter(v => v >= 10);
    if(k === 5 && Math.random() < 0.3){
      // Зима 2023: 0, 5, 10, 15, …, x in 41 digits — every two-digit one is used up, and the
      // last three digits are one three-digit number, 100
      const x = run[run.length - 1] + k;
      return {kind:'stepdig', k, start, first: run.slice(0, 4), ones: ones.length, twos, three: x, digits: ones.length + 2*twos.length + 3, ans: x};
    }
    const m = 3 + rnd(Math.min(12, twos.length - 2));          // how many two-digit numbers are written
    if(m > twos.length) continue;
    const x = twos[m - 1];
    return {kind:'stepdig', k, start, first: run.slice(0, 4), ones: ones.length, twos: twos.slice(0, m), digits: ones.length + 2*m, ans: x};
  }
}
function drawStepDig(q){
  if(q.kind === 'stepdig'){
    return '<div class="ask">' + tr('Кое е числото, означено с буквата <b>x</b>, ако числата <span class="num">' + q.first.join(', ') + ', …, x</span> са записани с <b>' + q.digits + ' цифри</b>?',
      'Яке число позначене буквою <b>x</b>, якщо числа <span class="num">' + q.first.join(', ') + ', …, x</span> записані за допомогою <b>' + q.digits + ' цифр</b>?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">x = ' + SLOT + '</div>';
  }
}
function eqStepDig(q){
  if(q.kind === 'stepdig') return q.first.join(', ') + tr(', … с ', ', … з ') + q.digits + tr(' цифри → ', ' цифр → ') + q.ans;
}
function whyStepDig(q, full){
  if(q.kind === 'stepdig'){
    if(!full) return tr('Колко цифри отиват за едноцифрените числа? А за всяко двуцифрено?',
                        'Скільки цифр ідуть на одноцифрові числа? А на кожне двоцифрове?');
    const m = q.twos.length, t = q.twos;
    return tr('едноцифрени: ', 'одноцифрові: ') + q.ones + tr(' числа — ', ' — ') + q.ones + tr(' цифри', ' цифр') +
      (q.three ? '' : ' &nbsp;→&nbsp; ' + q.digits + ' − ' + q.ones + ' = ' + 2*m + tr(' цифри, по две за число', ' цифр, по дві на число')) +
      (q.three ? ' &nbsp;→&nbsp; ' + tr('всички двуцифрени ', 'усі двоцифрові ') + t[0] + ', …, ' + t[m - 1] + ': ' + m + ' · 2 = ' + 2*m + tr(' цифри, остават ', ' цифр, лишається ') +
        (q.digits - q.ones - 2*m) + tr(' — едно трицифрено: <b>', ' — одне трицифрове: <b>') + q.ans + '</b> &nbsp;→&nbsp; x = ' + q.ans
      : ' &nbsp;→&nbsp; ' + m + tr(' двуцифрени: ', ' двоцифрових: ') + t[0] + ', ' + t[1] + ', …, <b>' + q.ans + '</b>' + ' &nbsp;→&nbsp; x = ' + q.ans);
  }
}
KIND.stepdig = { draw:drawStepDig, eq:eqStepDig, why:whyStepDig };
