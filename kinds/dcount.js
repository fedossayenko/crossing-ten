// Question kind 'dcount': level 55 Преброй цифрата — How often one digit turns up across a run of numbers.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 9: writing out a run of numbers and counting how often one digit turns up. The
// run is walked rather than reasoned about, so the count is never a guess.
function genDigitRun(){
  if(Math.random() < 0.15){
    // Есен 2019, задача 3: how many digits it takes to write 12, 34, 60 and 79 — two each, 8. Here a
    // one- or three-digit number may be among them, so each is counted, not just the numbers.
    const list = []; for(let i = 0, k = 3 + rnd(3); i < k; i++) list.push(Math.random() < 0.2 ? 1 + rnd(9) : Math.random() < 0.15 ? 100 + rnd(900) : 10 + rnd(90));
    return {kind:'dcount', shape:2, list, traps:[list.length], ans: list.join('').length};
  }
  for(;;){
    const d = 1 + rnd(9), from = 1 + rnd(3);
    if(Math.random() < 0.45){
      const to = 25 + rnd(60);
      let n = 0;
      for(let v = from; v <= to; v++) n += String(v).split(String(d)).length - 1;
      if(n < 3) continue;
      return {kind:'dcount', shape:0, d, from, to, ans: n};
    }
    // …and the other way round: the run stops where the count is still exactly this many
    const k = 5 + rnd(12);
    let n = 0, last = 0;
    for(let v = from; v <= 220; v++){
      n += String(v).split(String(d)).length - 1;
      if(n === k) last = v;
      if(n > k) break;
    }
    if(!last) continue;
    return {kind:'dcount', shape:1, d, from, k, ans: last};
  }
}

function drawDcount(q){
  if(q.kind === 'dcount' && q.shape === 2){
    return '<div class="ask">' + tr('С колко <b>цифри</b> са записани числата <span class="num">' + bgList(q.list.map(String)) + '</span>?', 'Скільки <b>цифр</b> потрібно, щоб записати числа <span class="num">' + bgList(q.list.map(String)) + '</span>?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'dcount'){
    const ask = q.shape === 0
      ? tr('Записах последователните числа от <span class="num">' + q.from + '</span> до <span class="num">' + q.to +
        '</span>. <b>Колко пъти</b> използвах цифрата <span class="num">' + q.d + '</span>?',
        'Записали підряд числа від <span class="num">' + q.from + '</span> до <span class="num">' + q.to +
        '</span>. <b>Скільки разів</b> використали цифру <span class="num">' + q.d + '</span>?')
      : tr('Записах последователните числа от <span class="num">' + q.from +
        '</span> до <span class="circle">□</span>. За записването им използвах <span class="num">' + q.k +
        '</span> цифри <span class="num">' + q.d +
        '</span>. Кое е <b>най-голямото</b> число, което може да се постави вместо <span class="circle">□</span>?',
        'Записали підряд числа від <span class="num">' + q.from +
        '</span> до <span class="circle">□</span>. Для їхнього запису використали <span class="num">' + q.k +
        '</span> цифр <span class="num">' + q.d +
        '</span>. Яке <b>найбільше</b> число можна поставити замість <span class="circle">□</span>?');
    return '<div class="ask">' + ask + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqDcount(q){
  if(q.kind === 'dcount' && q.shape === 2) return q.list.map(v => String(v).length).join(' + ') + ' = ' + q.ans;
  if(q.kind === 'dcount') return q.shape === 0
    ? tr('цифрата ' + q.d + ' от ' + q.from + ' до ' + q.to, 'цифра ' + q.d + ' від ' + q.from + ' до ' + q.to) + ' → ' + q.ans
    : tr(q.k + ' пъти цифрата ' + q.d + ', от ', 'цифра ' + q.d + ' — ' + ukN(q.k, 'раз', 'рази', 'разів') + ', від ') + q.from + ' → ' + q.ans;
}
function whyDcount(q, full){
  if(q.kind === 'dcount' && q.shape === 2){
    if(!full) return tr('Пита се за цифрите, не за числата. Колко цифри има всяко число?', 'Питають про цифри, а не про числа. Скільки цифр у кожному числі?');
    return q.list.map(v => v + ' → ' + String(v).length).join(', ') + ' &nbsp;→&nbsp; ' + q.list.map(v => String(v).length).join(' + ') + ' = ' + q.ans;
  }
  if(q.kind === 'dcount'){
    if(!full) return tr('Числата с две еднакви цифри се броят два пъти.', 'Числа з двома однаковими цифрами рахуй двічі.');
    const top = q.shape === 0 ? q.to : q.ans, hits = [];
    for(let v = q.from; v <= top && hits.length < 12; v++)
      if(String(v).indexOf(String(q.d)) >= 0) hits.push(v);
    const list = hits.join(', ') + (hits.length >= 12 ? ', …' : '');
    if(q.shape === 0) return tr('цифрата я има в ', 'цифра є в числах ') + list + ' &nbsp;→&nbsp; ' + q.ans;
    return tr('до <b>' + q.ans + '</b> цифрата се е появила ' + q.k + ' пъти (' + list +
      ') &nbsp;→&nbsp; следващото число с нея идва по-нататък, значи ',
      'до <b>' + q.ans + '</b> цифра з’явилася ' + ukN(q.k, 'раз', 'рази', 'разів') + ' (' + list +
      ') &nbsp;→&nbsp; наступне число з нею буде далі, отже, ') + q.ans;
  }
}
KIND.dcount = { draw:drawDcount, eq:eqDcount, why:whyDcount };
