// Question kind 'sqsum': levels 243 1 + 3 + 5 = M · M and 244 1 + 2 + … + N = M · M — A sum that is a number times itself.

// МБГ Есен 2024, 3 клас, задача 19: 1 + 3 + 5 + 7 + 9 + 11 + 13 + 15 = M · M. The sum is 64 = 8 · 8, so M = 8 — and every
// run of odd numbers from 1 makes such a square: each one lays an L round the square before it. So does
// 1 + 2 + … + k + … + 2 + 1, the diagonals of the same square.
// Есен 2023, задача 16: the smallest N, N > 1, with 1 + 2 + … + N = M · M. Adding on: 3, 6, 10, 15, 21, 28, 36 = 6 · 6, so
// N = 8 (1 = 1 · 1 is why N > 1). The same question from another start a: 2 + 3 + 4 = 9, 3 + … + 7 = 25, 4 + 5 = 9 (not
// 4 = 2 · 2 alone: N > 4), 5 + … + 13 = 81, 9 + … + 16 = 100.
import { KIND, SLOT, popAt, rnd, svgText, tr } from '../js/core.js';
export function genSqSumOdd(){
  // the slip: the sum itself for M
  if(Math.random() < 0.3){ const k = 3 + rnd(3); return {kind:'sqsum', shape:'updown', k, traps:[k*k], ans:k}; }
  const k = 4 + rnd(5);
  return {kind:'sqsum', shape:'odd', k, traps:[k*k], ans:k};
}
const LEAST_FROM = [1, 1, 2, 3, 4, 5, 9];   // the paper's start twice
export function genSqSumLeast(){
  const a = LEAST_FROM[rnd(LEAST_FROM.length)];
  for(let N = a + 1, s = a + N; ; N++, s += N){
    const M = Math.round(Math.sqrt(s));
    // the slip: M, the number that is multiplied by itself, for N
    if(M*M === s) return {kind:'sqsum', shape:'least', a, N, M, traps:[M], ans:N};
  }
}
const sqTerms = q => q.shape === 'odd' ? Array.from({length: q.k}, (_, i) => 2*i + 1)
  : Array.from({length: 2*q.k - 1}, (_, i) => i < q.k ? i + 1 : 2*q.k - 1 - i);
// the running sums from a: a + (a + 1), then each next number added
const leastRuns = q => { const out = []; for(let n = q.a + 1, s = q.a; n <= q.N; n++){ s += n; out.push([n, s]); } return out; };
function drawSqSum(q){
  if(q.shape === 'least'){
    const a = q.a;
    return '<div class="ask">' + tr('Кое е най-малкото естествено число N, N &gt; ' + a + ', за което сборът от всички естествени числа от ' + a +
      ' до N е число, което е произведение на два равни множителя?',
      'Яке найменше натуральне число N, N &gt; ' + a + ', для якого сума всіх натуральних чисел від ' + a + ' до N — це число, що є добутком двох рівних множників?') + '</div>' +
      // the paper's 1 + 2 + 3 + … + N; from another start only its first number, as N may come soon after it
      '<div class="given">' + (a === 1 ? '1 + 2 + 3' : a) + ' + … + N = M · M</div>' +
      '<div class="line xl">N = ' + SLOT + '</div>';
  }
  return '<div class="ask">' + tr('Пресметнете M, ако', 'Обчисліть M, якщо') + '</div>' +
    '<div class="given" style="text-wrap:balance">' + sqTerms(q).join(' + ') + ' = M · M</div>' +
    '<div class="line xl">M = ' + SLOT + '</div>';
}
function eqSqSum(q){
  if(q.shape === 'least') return (q.N - q.a < 3 ? leastRuns(q).map(([n]) => n).reduce((t, n) => t + ' + ' + n, String(q.a)) : q.a + ' + ' + (q.a + 1) + ' + … + ' + q.N) + ' = ' + q.M*q.M + ' = ' + q.M + ' · ' + q.M + ' → N = ' + q.N;
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
    if(!full) return tr('Събирай числата едно по едно и след всяко провери дали сборът е някое число, умножено само по себе си.',
                        'Додавай числа по одному й після кожного перевір, чи сума — це якесь число, помножене саме на себе.');
    // a start that is itself a number times itself does not count: N > a
    const r = Math.round(Math.sqrt(q.a)), start = r*r === q.a ? q.a + ' = ' + r + ' · ' + r + tr(', но N &gt; ', ', але N &gt; ') + q.a + '; &nbsp;' : '';
    return start + leastRuns(q).map(([n, s], i) => (i ? '+ ' + n : q.a + ' + ' + n) + ' = ' + (n === q.N ? '<b>' + s + ' = ' + q.M + ' · ' + q.M + '</b>' : s)).join(', ') +
      ' &nbsp;→&nbsp; N = ' + q.N;
  }
  if(!full) return tr('Събери числата. Кое число, умножено само по себе си, дава сбора?', 'Додай числа. Яке число, помножене саме на себе, дає суму?');
  const runs = [];
  sqTerms(q).reduce((s, v) => { runs.push(s + v); return s + v; }, 0);
  return tr('сборът расте така: ', 'сума зростає так: ') + runs.join(', ') + ' &nbsp;→&nbsp; ' + q.k*q.k + ' = ' + q.k + ' · ' + q.k + ' &nbsp;→&nbsp; M = ' + q.k + sqSumSvg(q);
}
KIND.sqsum = { draw:drawSqSum, eq:eqSqSum, why:whySqSum };
