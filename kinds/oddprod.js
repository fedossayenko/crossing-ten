// Question kind 'oddprod': level 66 Цифрата на единиците — Two one-digit numbers a set distance apart, and the digits their product can end in.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Есен, 3 клас, задача 8: two odd one-digit numbers differ by 2 and their product has two
// digits. The pairs are 3 · 5 = 15, 5 · 7 = 35, 7 · 9 = 63 (1 · 3 = 3 has one digit), so the
// units digit is 5 or 3. Every pair is listed; the answers are the different digits, in any order.
function genOddProd(){
  for(;;){
    const odd = Math.random() < 0.7, d = Math.random() < 0.6 ? 2 : 4, tens = Math.random() < 0.3;
    const pairs = [];
    for(let x = 0; x + d <= 9; x++) if(x % 2 === (odd ? 1 : 0)) pairs.push([x, x + d]);
    const two = pairs.filter(([x, y]) => x*y >= 10 && x*y <= 99);
    const digits = [...new Set(two.map(([x, y]) => tens ? Math.floor(x*y / 10) : x*y % 10))];
    if(digits.length < 2 || digits.length > 3 || two.length === digits.length && two.length < 2) continue;
    return {kind:'oddprod', odd, d, tens, pairs, two, slots: digits.length, ans: digits[0], alt: digits.slice(1)};
  }
}
function drawOddProd(q){
  if(q.kind === 'oddprod'){
    const more = [];
    for(let i = 1; i < q.slots; i++) more.push(' <span class="or">' + tr('или', 'або') + '</span> <span class="slot" id="slot' + i + '"></span>');
    return '<div class="ask">' + tr('Разликата на две <b>' + (q.odd ? 'нечетни' : 'четни') + '</b> едноцифрени числа е <span class="num">' + q.d +
      '</span>, а произведението им е двуцифрено число. Кои са възможните цифри на <b>' + (q.tens ? 'десетиците' : 'единиците') + '</b> на произведението?',
      'Різниця двох <b>' + (q.odd ? 'непарних' : 'парних') + '</b> одноцифрових чисел дорівнює <span class="num">' + q.d +
      '</span>, а їхній добуток — двоцифрове число. Якими можуть бути цифри <b>' + (q.tens ? 'десятків' : 'одиниць') + '</b> добутку?') + '</div>' +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT + more.join('') + '</div>';
  }
}
function eqOddProd(q){
  if(q.kind === 'oddprod') return q.two.map(([x, y]) => x + ' · ' + y + ' = ' + x*y).join(', ') + ' → ' + [q.ans].concat(q.alt).join(', ');
}
function whyOddProd(q, full){
  if(q.kind === 'oddprod'){
    if(!full) return tr('Изброй всички двойки с разлика ' + q.d + ' и ги умножи; остави само двуцифрените.',
                        'Випиши всі пари з різницею ' + q.d + ' і перемнож їх; залиш лише двоцифрові добутки.');
    const one = q.pairs.filter(([x, y]) => x*y < 10).map(([x, y]) => x + ' · ' + y + ' = ' + x*y);
    return q.two.map(([x, y]) => x + ' · ' + y + ' = <b>' + x*y + '</b>').join(', ') +
      (one.length ? tr(' &nbsp;(' + one.join(', ') + ' е едноцифрено)', ' &nbsp;(' + one.join(', ') + ' — одноцифрове)') : '') +
      ' &nbsp;→&nbsp; ' + [q.ans].concat(q.alt).join(tr(' или ', ' або '));
  }
}
KIND.oddprod = { draw:drawOddProd, eq:eqOddProd, why:whyOddProd };
