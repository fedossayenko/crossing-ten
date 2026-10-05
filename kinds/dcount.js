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

// МБГ Пролет 2021, 1 клас, задача 13: I wrote all the numbers below 25 — 24, 23, 22, …, 3, 2, 1. How many
// times did I write the digit 2? 2, 12, 20, 21, 22 (twice), 23, 24: 8. The same count as from 1 to 24.
function genDigitBelow(){
  for(;;){
    const d = 1 + rnd(3), N = 12 + rnd(19);
    let n = 0; for(let v = 1; v < N; v++) n += String(v).split(String(d)).length - 1;
    if(n >= 2) return {kind:'dcount', shape:0, below:true, d, from:1, to:N - 1, N, ans:n};
  }
}
function drawDcount(q){
  if(q.kind === 'dcount' && q.below){
    return '<div class="ask">' + tr('Записах всички числа, по-малки от <span class="num">' + q.N + '</span>: ', 'Я записав усі числа, менші за <span class="num">' + q.N + '</span>: ') +
      '<span class="num">' + [q.N - 1, q.N - 2, q.N - 3].join(', ') + ', …, 3, 2, 1</span>. ' +
      tr('<b>Колко пъти</b> съм записал цифрата <span class="num">' + q.d + '</span>?', '<b>Скільки разів</b> я записав цифру <span class="num">' + q.d + '</span>?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
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
// The picture is the hundred chart from the first number to the last: the numbers that end in the
// digit make a column and light up first (orange), the ones that start with it make a row and light
// up next (blue), and the one where they cross, like 33, is in both — so it is counted twice.
function dcountSvg(q){
  const top = q.shape === 0 ? q.to : q.ans, d = q.d, C = 23, R = 21;
  const end = q.shape === 0 ? top : top + 1;   // asked for the largest end: the next number, which would bring one too many
  if(end > 99) return '';
  const r0 = Math.floor(q.from / 10), rows = Math.floor(end / 10) - r0 + 1, inRun = v => v >= q.from && v <= top;
  const xy = v => [(v % 10) * C, (Math.floor(v / 10) - r0) * R];
  const num = (v, col) => { const [x, y] = xy(v), s = String(v);
    return svgText(x + C / 2, y + 15, s.split('').map((ch, i) => +ch === d && (i === s.length - 1 ? col === 'o' : col === 't') ?
      '<tspan fill="' + (col === 'o' ? 'var(--warm)' : 'var(--accent)') + '">' + ch + '</tspan>' : ch).join(''), 11.5, 'var(--ink)'); };
  let g = '';
  for(let v = r0 * 10; v < (r0 + rows) * 10; v++) if(inRun(v)) g += num(v, '');
  const ones = [], tens = [];
  for(let v = q.from; v <= top; v++){ if(v % 10 === d) ones.push(v); if(Math.floor(v / 10) === d) tens.push(v); }
  const mark = (v, k, col, fill) => { const [x, y] = xy(v);
    return '<g' + popAt(k) + '><rect x="' + (x + 1.5) + '" y="' + (y + 1.5) + '" width="' + (C - 3) + '" height="' + (R - 3) + '" rx="5" fill="' + fill + '" stroke="' + col + '" stroke-width="2"/>' + num(v, col === 'var(--warm)' ? 'o' : 't') + '</g>'; };
  ones.forEach((v, i) => { g += mark(v, 1 + i * 0.5, 'var(--warm)', 'var(--warmbg)'); });
  const t0 = 2 + ones.length * 0.5;
  tens.forEach((v, i) => { g += mark(v, t0 + i * 0.4, 'var(--accent)', v % 10 === d ? 'var(--warmbg)' : 'rgba(47,111,143,.14)'); });
  if(end > top){ const [x, y] = xy(end);
    g += '<g' + popAt(t0 + tens.length * 0.4 + 0.5) + '><rect x="' + (x + 1.5) + '" y="' + (y + 1.5) + '" width="' + (C - 3) + '" height="' + (R - 3) + '" rx="5" fill="none" stroke="var(--bad)" stroke-width="2"/>' +
      svgText(x + C / 2, y + 15, end, 11.5, 'var(--bad)') + '<path d="M' + (x + 4) + ',' + (y + R - 4) + ' L' + (x + C - 4) + ',' + (y + 4) + '" stroke="var(--bad)" stroke-width="2"/></g>'; }
  const sum = '<tspan fill="var(--warm)">' + ones.length + '</tspan> + <tspan fill="var(--accent)">' + tens.length + '</tspan> = ' + (ones.length + tens.length);
  g += svgText(5 * C, rows * R + 24, q.shape === 0 ? sum : sum + tr(', до ', ', до ') + q.ans, 15, 'var(--ink)', popAt(t0 + tens.length * 0.4 + 1));
  return '<svg viewBox="-2 -2 ' + (10 * C + 4) + ' ' + (rows * R + 36) + '" style="display:block; width:' + Math.round((10 * C + 4) * 1.3) + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('таблицата на числата', 'таблиця чисел') + '">' + g + '</svg>';
}
function whyDcount(q, full){
  if(q.kind === 'dcount' && q.shape === 2){
    if(!full) return tr('Пита се за цифрите, не за числата. Колко цифри има всяко число?', 'Питають про цифри, а не про числа. Скільки цифр у кожному числі?');
    return q.list.map(v => v + ' → ' + String(v).length).join(', ') + ' &nbsp;→&nbsp; ' + q.list.map(v => String(v).length).join(' + ') + ' = ' + q.ans;
  }
  if(q.kind === 'dcount'){
    // below a bound with no number like 22 in it, that hint would send her looking for one
    if(!full) return q.below && 11*q.d >= q.N ? tr('Търси цифрата и в единиците, и в десетиците.', 'Шукай цифру і в одиницях, і в десятках.')
      : tr('Числата с две еднакви цифри се броят два пъти.', 'Числа з двома однаковими цифрами рахуй двічі.');
    const top = q.shape === 0 ? q.to : q.ans, hits = [];
    for(let v = q.from; v <= top; v++)
      if(String(v).indexOf(String(q.d)) >= 0) hits.push(v);
    const list = hits.slice(0, 12).join(', ') + (hits.length > 12 ? ', …' : '');   // the dots only when the list goes on
    if(q.shape === 0) return tr('цифрата я има в ', 'цифра є в числах ') + list + ' &nbsp;→&nbsp; ' + q.ans + dcountSvg(q);
    return tr('до <b>' + q.ans + '</b> цифрата се е появила ' + q.k + ' пъти (' + list +
      ') &nbsp;→&nbsp; следващото число с нея идва по-нататък, значи ',
      'до <b>' + q.ans + '</b> цифра з’явилася ' + ukN(q.k, 'раз', 'рази', 'разів') + ' (' + list +
      ') &nbsp;→&nbsp; наступне число з нею буде далі, отже, ') + q.ans + dcountSvg(q);
  }
}
KIND.dcount = { draw:drawDcount, eq:eqDcount, why:whyDcount };
