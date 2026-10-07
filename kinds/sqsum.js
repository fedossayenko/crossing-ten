// Question kind 'sqsum': levels 243 1 + 3 + 5 = M · M and 244 1 + 2 + … + N — A sum that is a number times itself, and the
// first sum of a run that has a property.

// МБГ Есен 2024, 3 клас, задача 19: 1 + 3 + 5 + 7 + 9 + 11 + 13 + 15 = M · M. The sum is 64 = 8 · 8, so M = 8 — and every
// run of odd numbers from 1 makes such a square: each one lays an L round the square before it. So does
// 1 + 2 + … + k + … + 2 + 1, the diagonals of the same square.
// Есен 2023, задача 16: the smallest N, N > 1, with 1 + 2 + … + N = M · M. Adding on: 3, 6, 10, 15, 21, 28, 36 = 6 · 6, so
// N = 8 (1 = 1 · 1 is why N > 1). The same listing of the sums from another start a (2 + 3 + 4 = 9, 3 + … + 7 = 25,
// 9 + … + 16 = 100), and the first sum that divides by a number, ends in a digit or has two equal digits: 1 + … + 6 = 21
// divides by 7, 4 + … + 7 = 22. The sums stay within 100, and at least three numbers are added.
import { KIND, SLOT, popAt, rnd, svgText, tr } from '../js/core.js';
export function genSqSumOdd(){
  // the slip: the sum itself for M
  if(Math.random() < 0.3){ const k = 3 + rnd(3); return {kind:'sqsum', shape:'updown', k, traps:[k*k], ans:k}; }
  const k = 4 + rnd(5);
  return {kind:'sqsum', shape:'odd', k, traps:[k*k], ans:k};
}
// whether a sum has the property asked: a number times itself, divisible by k, ending in the digit k, two equal digits
const leastFits = (q, v) => q.prop === 'sq' ? Math.round(Math.sqrt(v))**2 === v : q.prop === 'div' ? v % q.k === 0 : q.prop === 'end' ? v % 10 === q.k : v > 9 && v < 100 && v % 11 === 0;
export function genSqSumLeast(){
  const r0 = Math.random(), prop = r0 < 0.25 ? 'sq' : r0 < 0.55 ? 'div' : r0 < 0.85 ? 'end' : 'twin';
  for(;;){
    const a = 1 + rnd(9), q = {kind:'sqsum', shape:'least', a, prop, k: prop === 'div' ? 3 + rnd(7) : prop === 'end' ? rnd(10) : null};
    let N = a + 1, s = a + N;
    while(s <= 100 && !leastFits(q, s)){ N++; s += N; }
    if(s > 100 || N < a + 2) continue;
    // the slips: M, the number multiplied by itself, for N; the sum itself for N
    return Object.assign(q, {N, S: s, traps:[prop === 'sq' ? Math.round(Math.sqrt(s)) : s], ans: N});
  }
}
// the property in words, after «сборът … от a до N»
const leastProp = q => q.prop === 'sq' ? tr('е число, което е произведение на два равни множителя', '— це число, що є добутком двох рівних множників')
  : q.prop === 'div' ? tr('е число, което се дели на ' + q.k, '— це число, що ділиться на ' + q.k)
  : q.prop === 'end' ? tr('е число, което завършва на ' + q.k, '— це число, що закінчується цифрою ' + q.k)
  : tr('е двуцифрено число с две еднакви цифри', '— це двоцифрове число з двома однаковими цифрами');
// a sum shown with why it fits: 36 = 6 · 6, 21 = 3 · 7; a number ending in the digit, or with two equal ones, as it is
const leastShow = (q, v) => q.prop === 'sq' ? v + ' = ' + Math.round(Math.sqrt(v)) + ' · ' + Math.round(Math.sqrt(v)) : q.prop === 'div' ? v + ' = ' + v / q.k + ' · ' + q.k : String(v);
const sqTerms = q => q.shape === 'odd' ? Array.from({length: q.k}, (_, i) => 2*i + 1)
  : Array.from({length: 2*q.k - 1}, (_, i) => i < q.k ? i + 1 : 2*q.k - 1 - i);
// the running sums from a: a + (a + 1), then each next number added
const leastRuns = q => { const out = []; for(let n = q.a + 1, s = q.a; n <= q.N; n++){ s += n; out.push([n, s]); } return out; };
function drawSqSum(q){
  if(q.shape === 'least'){
    const a = q.a;
    return '<div class="ask">' + tr('Кое е най-малкото естествено число N, N &gt; ' + a + ', за което сборът от всички естествени числа от ' + a + ' до N ',
      'Яке найменше натуральне число N, N &gt; ' + a + ', для якого сума всіх натуральних чисел від ' + a + ' до N ') + leastProp(q) + '?</div>' +
      // the paper's 1 + 2 + 3 + … + N; from another start only its first number, as N may come soon after it
      '<div class="given">' + (a === 1 ? '1 + 2 + 3' : a) + ' + … + N' + (q.prop === 'sq' ? ' = M · M' : '') + '</div>' +
      '<div class="line xl">N = ' + SLOT + '</div>';
  }
  return '<div class="ask">' + tr('Пресметнете M, ако', 'Обчисліть M, якщо') + '</div>' +
    '<div class="given" style="text-wrap:balance">' + sqTerms(q).join(' + ') + ' = M · M</div>' +
    '<div class="line xl">M = ' + SLOT + '</div>';
}
function eqSqSum(q){
  if(q.shape === 'least') return (q.N - q.a < 3 ? leastRuns(q).map(([n]) => n).reduce((t, n) => t + ' + ' + n, String(q.a)) : q.a + ' + ' + (q.a + 1) + ' + … + ' + q.N) + ' = ' + leastShow(q, q.S) + ' → N = ' + q.N;
  return sqTerms(q).join(' + ') + ' = ' + q.k*q.k + ' = ' + q.k + ' · ' + q.k + ' → M = ' + q.k;
}
// The picture: a k by k square of cells, laid down a part at a time — for the odd numbers each one an L round the square
// before it (1, then 3 more, then 5 more …), for 1 + 2 + … + k + … + 1 one diagonal at a time.
function sqSumSvg(q){
  const k = q.k, c = 16, W = k*c, parts = q.shape === 'odd' ? k : 2*k - 1;
  let g = '';
  for(let i = 0; i < parts; i++){
    // the Ls by turns; the diagonals going up (1 … k) one colour, coming back down (k − 1 … 1) the other
    const tone = (q.shape === 'odd' ? i % 2 : i >= k) ? ['var(--accent)', 'var(--accentbg)'] : ['var(--warm)', 'var(--warmbg)'];
    let cells = '';
    for(let x = 0; x < k; x++) for(let y = 0; y < k; y++) if((q.shape === 'odd' ? Math.max(x, y) : x + y) === i)
      cells += '<rect x="' + (x*c + 1) + '" y="' + (y*c + 1) + '" width="' + (c - 2) + '" height="' + (c - 2) + '" rx="3" fill="' + tone[1] + '" stroke="' + tone[0] + '" stroke-width="1.5"/>';
    g += '<g' + popAt(1 + i*0.7) + '>' + cells + '</g>';
  }
  g += svgText(W / 2, W + 20, k*k + ' = ' + k + ' · ' + k, 15, 'var(--ink)', popAt(2 + parts*0.7));
  const VW = Math.max(W + 4, 96);   // room for the line under a small square
  return '<svg viewBox="' + (W - VW) / 2 + ' -2 ' + VW + ' ' + (W + 30) + '" style="display:block; width:' + VW + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('числата, наредени в квадрат', 'числа, складені у квадрат') + '">' + g + '</svg>';
}
function whySqSum(q, full){
  if(q.shape === 'least'){
    if(!full) return tr('Събирай числата едно по едно и след всяко провери дали сборът пасва.', 'Додавай числа по одному й після кожного перевір, чи підходить сума.');
    // a start that fits by itself does not count: N > a
    const start = leastFits(q, q.a) ? leastShow(q, q.a) + tr(', но N &gt; ', ', але N &gt; ') + q.a + '; &nbsp;' : '';
    return start + leastRuns(q).map(([n, s], i) => (i ? '+ ' + n : q.a + ' + ' + n) + ' = ' + (n === q.N ? '<b>' + leastShow(q, s) + '</b>' : s)).join(', ') +
      ' &nbsp;→&nbsp; N = ' + q.N;
  }
  if(!full) return tr('Събери числата. Кое число, умножено само по себе си, дава сбора?', 'Додай числа. Яке число, помножене саме на себе, дає суму?');
  const runs = [];
  sqTerms(q).reduce((s, v) => { runs.push(s + v); return s + v; }, 0);
  return tr('сборът расте така: ', 'сума зростає так: ') + runs.join(', ') + ' &nbsp;→&nbsp; ' + q.k*q.k + ' = ' + q.k + ' · ' + q.k + ' &nbsp;→&nbsp; M = ' + q.k + sqSumSvg(q);
}
KIND.sqsum = { draw:drawSqSum, eq:eqSqSum, why:whySqSum };
