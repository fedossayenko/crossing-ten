// Question kind 'asmany': level 134 Толкова, колкото — Two counts of odd and even numbers made equal: where the second run ends.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Пролет 2025, задача 8: the even numbers from 1 to 11 are as many as the odd numbers from 12 to the
// even number X. Evens up to 11: 2, 4, 6, 8, 10 — five. Odd from 12 on: 13, 15, 17, 19, 21 — five,
// and the even number after 21 is 22.
function genAsMany(){
  for(;;){
    const evenFirst = Math.random() < 0.6, n = 7 + rnd(10), s = 10 + rnd(20);
    const E = [...Array(n).keys()].map(v => v + 1).filter(v => evenFirst ? v % 2 === 0 : v % 2).length;
    // the second run: the other parity, from s to X, X of the first parity
    if((s % 2 === 0) !== evenFirst) continue;
    return {kind:'asmany', evenFirst, n, s, E, traps:[s + 2*E - 1], ans: s + 2*E};
  }
}
function drawAsMany(q){
  if(q.kind === 'asmany'){
    const [p1, p2] = q.evenFirst ? [tr('Четните', 'Парних'), tr('нечетните', 'непарних')] : [tr('Нечетните', 'Непарних'), tr('четните', 'парних')];
    const x = q.evenFirst ? tr('четното', 'парного') : tr('нечетното', 'непарного');
    return '<div class="ask">' + tr(p1 + ' числа от 1 до <span class="num">' + q.n + '</span> са толкова, колкото ' + p2 + ' числа от <span class="num">' + q.s + '</span> до ' + x + ' число X. Кое е числото X?',
      p1 + ' чисел від 1 до <span class="num">' + q.n + '</span> стільки ж, скільки ' + p2 + ' чисел від <span class="num">' + q.s + '</span> до ' + x + ' числа X. Яке число X?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">X = ' + SLOT + '</div>';
  }
}
function asManyRuns(q){
  const a = [], b = [];
  for(let v = 1; v <= q.n; v++) if((v % 2 === 0) === q.evenFirst) a.push(v);
  for(let v = q.s; v <= q.ans; v++) if((v % 2 === 0) !== q.evenFirst) b.push(v);
  return [a, b];
}
function eqAsMany(q){
  if(q.kind === 'asmany'){ const [a, b] = asManyRuns(q); return a.length + ': ' + b.join(', ') + ' → ' + q.ans; }
}
function whyAsMany(q, full){
  if(q.kind === 'asmany'){
    if(!full) return tr('Първо преброй числата в първата редица. После изреди толкова от втората — и виж кое число идва след последното.', 'Спершу порахуй числа першого ряду. Потім випиши стільки ж із другого — і подивись, яке число йде після останнього.');
    const [a, b] = asManyRuns(q);
    return a.join(', ') + ' &nbsp;→&nbsp; <b>' + a.length + '</b>; &nbsp;' + b.join(', ') + ' &nbsp;→&nbsp; ' + tr('следващото е ', 'наступне — ') + q.ans;
  }
}
KIND.asmany = { draw:drawAsMany, eq:eqAsMany, why:whyAsMany };
