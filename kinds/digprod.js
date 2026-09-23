// Question kind 'digprod': level 60 Цифрите — The digits of the smallest or largest three-digit number that fits.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Есен, 3 клас, задача 2: the product of the digits of the smallest three-digit number
// written with different digits. That number is 102, and its 0 makes the product 0.
const digMul = n => [...String(n)].reduce((a, b) => a * b, 1);
const DIG_COND = [
  ['записано с различни цифри', 'записаного різними цифрами', n => new Set(String(n)).size === 3],
  ['записано само с четни цифри', 'записаного лише парними цифрами', n => [...String(n)].every(c => c % 2 === 0)],
  ['записано само с нечетни цифри', 'записаного лише непарними цифрами', n => [...String(n)].every(c => c % 2 === 1)],
  ['записано с различни четни цифри', 'записаного різними парними цифрами', n => new Set(String(n)).size === 3 && [...String(n)].every(c => c % 2 === 0)],
  ['записано с различни нечетни цифри', 'записаного різними непарними цифрами', n => new Set(String(n)).size === 3 && [...String(n)].every(c => c % 2 === 1)],
  // МБГ Есен, 3 клас, задача 9: the largest three-digit number whose digits multiply to a one-digit
  // number. 0 is a one-digit number too, so it is 990, not 911 — and the digits add to 18.
  ['чието произведение на цифрите е едноцифрено число', 'добуток цифр якого — одноцифрове число', n => digMul(n) <= 9],
  ['чието произведение на цифрите е 12', 'добуток цифр якого дорівнює 12', n => digMul(n) === 12],
  ['чието произведение на цифрите е 18', 'добуток цифр якого дорівнює 18', n => digMul(n) === 18],
  ['чието произведение на цифрите е 24', 'добуток цифр якого дорівнює 24', n => digMul(n) === 24]
];
function genDigSum(){
  const c = DIG_BASIC + rnd(DIG_COND.length - DIG_BASIC), big = Math.random() < 0.75;
  const fit = [];
  for(let n = 100; n <= 999; n++) if(DIG_COND[c][2](n)) fit.push(n);
  const n = big ? fit[fit.length - 1] : fit[0], ds = [...String(n)].map(Number);
  // the likeliest slip: forgetting that a 0 digit is allowed (911 instead of 990)
  const no0 = fit.filter(m => String(m).indexOf('0') < 0), alt = big ? no0[no0.length - 1] : no0[0];
  const altSum = alt ? [...String(alt)].reduce((a, b) => a + +b, 0) : -1, ans = ds.reduce((a, b) => a + b, 0);
  return {kind:'digprod', c, big, prod:false, n, ds, ans, traps: altSum >= 0 && altSum !== ans ? [altSum] : []};
}
// The first five ask for the product or the sum; the rest, set by the digits' product, only for the sum.
const DIG_BASIC = 5;
function genDigProd(){
  const c = rnd(DIG_BASIC), big = Math.random() < 0.35, prod = Math.random() < 0.7;
  const fit = [];
  for(let n = 100; n <= 999; n++) if(DIG_COND[c][2](n)) fit.push(n);
  const n = big ? fit[fit.length - 1] : fit[0], ds = [...String(n)].map(Number);
  const p = ds.reduce((a, b) => a*b, 1), s = ds.reduce((a, b) => a + b, 0);
  return {kind:'digprod', c, big, prod, n, ds, ans: prod ? p : s, traps: [prod ? s : p].filter(v => v !== (prod ? p : s))};
}
function drawDigProd(q){
  if(q.kind === 'digprod'){
    return '<div class="ask">' + tr('Пресметнете <b>' + (q.prod ? 'произведението' : 'сбора') + '</b> на цифрите на <b>' +
      (q.big ? 'най-голямото' : 'най-малкото') + '</b> трицифрено число, ' + DIG_COND[q.c][0] + '.',
      'Обчисліть <b>' + (q.prod ? 'добуток' : 'суму') + '</b> цифр <b>' + (q.big ? 'найбільшого' : 'найменшого') +
      '</b> тризначного числа, ' + DIG_COND[q.c][1] + '.') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqDigProd(q){
  if(q.kind === 'digprod') return q.n + ' → ' + q.ds.join(q.prod ? ' · ' : ' + ') + ' = ' + q.ans;
}
function whyDigProd(q, full){
  if(q.kind === 'digprod'){
    if(!full) return q.big ? tr('Първо намери числото: отпред най-голямата цифра, която може, после следващите.',
                                'Спершу знайди число: спереду найбільша цифра, яка можлива, потім наступні.')
                           : tr('Първо намери числото: отпред не може да стои 0, после най-малките цифри, които може.',
                                'Спершу знайди число: спереду не може стояти 0, потім найменші цифри, які можна.');
    const zero = q.prod && q.ds.indexOf(0) >= 0 ? tr(' — има 0, значи произведението е 0', ' — є 0, тож добуток дорівнює 0')
      : q.c >= DIG_BASIC && q.ds.indexOf(0) >= 0 ? tr(' (0 също е едноцифрено число)', ' (0 — теж одноцифрове число)') : '';
    return tr('числото е ', 'число — ') + '<b>' + q.n + '</b> &nbsp;→&nbsp; ' + q.ds.join(q.prod ? ' · ' : ' + ') + ' = ' + q.ans + zero;
  }
}
KIND.digprod = { draw:drawDigProd, eq:eqDigProd, why:whyDigProd };
