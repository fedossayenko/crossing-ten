// Question kind 'diffseq': level 95 25, 24, 21, 16, 9, ? — A run whose steps grow by the same amount.

// Коледно състезание 2025, задача 7: 25, 24, 21, 16, 9, ? — then the sum of all six. The steps
// are 1, 3, 5, 7, so the next is 9 and the sixth number is 0; the six add to 95. The steps
// themselves make a run, which is the thing to see.
import { KIND, SLOT, bgWith, popAt, rnd, svgText, tr } from '../js/core.js';
export function genDiffSeq(){
  for(;;){
    const down = Math.random() < 0.6, d0 = 1 + rnd(3), g = 1 + rnd(3), a0 = down ? 20 + rnd(40) : 1 + rnd(10);
    const seq = [a0];
    for(let i = 0; i < 5; i++) seq.push(seq[i] + (down ? -1 : 1) * (d0 + i*g));
    if(seq[5] < 0 || seq[5] > 99) continue;
    const asksSum = Math.random() < 0.55, sum = seq.reduce((a, b) => a + b, 0);
    if(asksSum && sum > 250) continue;
    return {kind:'diffseq', seq, down, d0, g, asksSum, ans: asksSum ? sum : seq[5]};
  }
}
// Level 290, the easy end of the same idea. Аз и числата 2025, задача 9: 1, 3, 7, 13, 21, ? — the steps 2, 4, 6, 8
// grow by 2, so the next is 10: 31; Аз и числата 2023, задача 3 shows one more, 31, and asks 43. Always growing,
// five or six numbers shown, never the sum. The slip is the last step again: 21 + 8 = 29, 31 + 10 = 41.
// Аз и числата 2022, задача 10 (shape 'const'): «Запиши 5 числа, първото от които да е 12, а всяко следващо – с 13
// по-голямо от предходното» — 25, 38, 51, 64 in the four boxes; or from 49, each 7 less: 42, 35, 28, 21.
export function genDiffSeqNext(){
  if(Math.random() < 0.4){
    const up = Math.random() < 0.5, d = 2 + rnd(18), a = up ? 1 + rnd(99 - 4*d) : 4*d + rnd(100 - 4*d);
    const seq = [0, 1, 2, 3, 4].map(i => a + (up ? i*d : -i*d));
    return {kind:'diffseq', shape:'const', up, d, seq, slots:4, ans: seq[1], alt: seq.slice(2)};
  }
  for(;;){
    const a0 = 1 + rnd(9), d0 = 1 + rnd(3), g = 1 + rnd(2), n = Math.random() < 0.5 ? 5 : 6, seq = [a0];
    for(let i = 0; i < n; i++) seq.push(seq[i] + d0 + i*g);
    if(seq[n] > 99) continue;
    return {kind:'diffseq', shape:'grow', seq, down:false, d0, g, asksSum:false, traps:[seq[n - 1] + d0 + (n - 2)*g], ans: seq[n]};
  }
}
function drawDiffSeq(q){
  if(q.shape === 'const'){
    return '<div class="ask">' + tr('Запиши 5 числа, първото от които да е <span class="num">' + q.seq[0] + '</span>, а всяко следващо – ' + bgWith(q.d) + ' <span class="num">' + q.d + '</span> <b>' + (q.up ? 'по-голямо' : 'по-малко') + '</b> от предходното.',
      'Напиши 5 чисел, перше з яких — <span class="num">' + q.seq[0] + '</span>, а кожне наступне на <span class="num">' + q.d + '</span> <b>' + (q.up ? 'більше' : 'менше') + '</b> за попереднє.') + '</div>' +
      // five on a phone's line, each comma kept with what it follows
      '<div class="line" style="font-size:clamp(20px,5.5vw,34px)">' + [q.seq[0], SLOT, 1, 2, 3].map((x, i) => '<span style="white-space:nowrap">' + (i > 1 ? '<span class="slot" id="slot' + x + '"></span>' : x) + (i < 4 ? ',' : '') + '</span>').join(' ') + '</div>';
  }
  return '<div class="ask">' + (q.asksSum ? tr('Като откриете следващото число в редицата, пресметнете <b>сбора на всичките шест</b> числа.', 'Знайшовши наступне число в послідовності, обчисліть <b>суму всіх шести</b> чисел.')
                                          : tr('Кое е <b>следващото</b> число в редицата?', 'Яке <b>наступне</b> число в послідовності?')) + '</div>' +
    '<div class="seq">' + q.seq.slice(0, -1).join(', ') + ', ?</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqDiffSeq(q){
  if(q.shape === 'const') return q.seq.join(', ');
  return q.seq.join(', ') + (q.asksSum ? ' → ' + q.ans : '');
}
// The picture: a jump over each two neighbours with its size on it (the sizes the text calls the steps), and
// above the jumps how much each one grows on the one before — the same every time, so the last jump and the number it lands on follow. The
// hint draws the five numbers and their jumps with a question mark on each, and none of the sizes.
function diffSeqSvg(q, full){
  const n = q.seq.length - 1, X = i => 25 + i*50, steps = q.seq.slice(1).map((v, i) => Math.abs(v - q.seq[i]));
  let g = '';
  for(let i = 0; i < n; i++){
    const col = i === n - 1 ? 'var(--warm)' : 'var(--accent)', at = full ? popAt(1 + i) : '';
    g += '<g' + at + '><path d="M' + (X(i) + 6) + ',-12 Q' + (X(i) + 25) + ',-30 ' + (X(i + 1) - 6) + ',-12" stroke="' + col + '" stroke-width="2.2" fill="none"/>' +
      svgText(X(i) + 25, -28, full ? steps[i] : '?', 12, col) + '</g>';
    if(full && i) g += svgText(X(i), -48, '+' + q.g, 10, 'var(--muted)', popAt(n + 1 + i));
  }
  q.seq.forEach((v, i) => { g += i < n ? svgText(X(i), 5, v, 15, 'var(--ink)')
    : full ? svgText(X(i), 5, v, 15, 'var(--good)', popAt(2*n + 1)) : svgText(X(i), 5, '?', 15, 'var(--warm)'); });
  if(full && q.asksSum) g += svgText(150, 34, tr('сборът на шестте: ', 'сума всіх шести: ') + q.ans, 15, 'var(--ink)', popAt(2*n + 2));
  return '<svg viewBox="0 ' + (full ? -60 : -44) + ' ' + (50*n + 50) + ' ' + (full ? (q.asksSum ? 102 : 74) : 58) + '" style="display:block; width:' + (50*n + 50) + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('числата и стъпките между тях', 'числа і кроки між ними') + '">' + g + '</svg>';
}
function whyDiffSeq(q, full){
  if(q.shape === 'const'){
    if(!full) return q.up ? tr('Към всяко число прибави едно и също, за да получиш следващото.', 'До кожного числа додай те саме, щоб отримати наступне.')
                          : tr('От всяко число извади едно и също, за да получиш следващото.', 'Від кожного числа відніми те саме, щоб отримати наступне.');
    return q.seq.slice(1).map((v, i) => q.seq[i] + (q.up ? ' + ' : ' − ') + q.d + ' = <b>' + v + '</b>').join(', &nbsp;');
  }
  if(!full) return tr('Виж с колко се променя всяко число — а после как се променят самите стъпки.', 'Подивись, на скільки змінюється кожне число, — а потім як змінюються самі кроки.') + diffSeqSvg(q, false);
  const steps = q.seq.slice(1).map((v, i) => Math.abs(v - q.seq[i]));
  const n = q.seq.length - 1;
  return tr('стъпките са ', 'кроки: ') + steps.slice(0, n - 1).join(', ') + tr(', следващата е ', ', наступний: ') + steps[n - 1] + ' &nbsp;→&nbsp; ' +
    q.seq[n - 1] + (q.down ? ' − ' : ' + ') + steps[n - 1] + ' = <b>' + q.seq[n] + '</b>' + (q.asksSum ? ' &nbsp;→&nbsp; ' + q.seq.join(' + ') + ' = ' + q.ans : '') + diffSeqSvg(q, true);
}
KIND.diffseq = { draw:drawDiffSeq, eq:eqDiffSeq, why:whyDiffSeq };
