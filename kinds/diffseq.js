// Question kind 'diffseq': level 95 25, 24, 21, 16, 9, ? — A run whose steps grow by the same amount.

// Коледно състезание 2025, задача 7: 25, 24, 21, 16, 9, ? — then the sum of all six. The steps
// are 1, 3, 5, 7, so the next is 9 and the sixth number is 0; the six add to 95. The steps
// themselves make a run, which is the thing to see.
import { KIND, SLOT, popAt, rnd, svgText, tr } from '../js/core.js';
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
function drawDiffSeq(q){
  return '<div class="ask">' + (q.asksSum ? tr('Като откриете следващото число в редицата, пресметнете <b>сбора на всичките шест</b> числа.', 'Знайшовши наступне число в послідовності, обчисліть <b>суму всіх шести</b> чисел.')
                                          : tr('Кое е <b>следващото</b> число в редицата?', 'Яке <b>наступне</b> число в послідовності?')) + '</div>' +
    '<div class="seq">' + q.seq.slice(0, 5).join(', ') + ', ?</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqDiffSeq(q){
  return q.seq.join(', ') + (q.asksSum ? ' → ' + q.ans : '');
}
// The picture: a jump over each two neighbours with its size on it (the sizes the text calls the steps), and
// above the jumps how much each one grows on the one before — the same every time, so the last jump and the number it lands on follow. The
// hint draws the five numbers and their jumps with a question mark on each, and none of the sizes.
function diffSeqSvg(q, full){
  const X = i => 25 + i*50, steps = q.seq.slice(1).map((v, i) => Math.abs(v - q.seq[i]));
  let g = '';
  for(let i = 0; i < 5; i++){
    const col = i === 4 ? 'var(--warm)' : 'var(--accent)', at = full ? popAt(1 + i) : '';
    g += '<g' + at + '><path d="M' + (X(i) + 6) + ',-12 Q' + (X(i) + 25) + ',-30 ' + (X(i + 1) - 6) + ',-12" stroke="' + col + '" stroke-width="2.2" fill="none"/>' +
      svgText(X(i) + 25, -28, full ? steps[i] : '?', 12, col) + '</g>';
    if(full && i) g += svgText(X(i), -48, '+' + q.g, 10, 'var(--muted)', popAt(6 + i));
  }
  q.seq.forEach((v, i) => { g += i < 5 ? svgText(X(i), 5, v, 15, 'var(--ink)')
    : full ? svgText(X(i), 5, v, 15, 'var(--good)', popAt(11)) : svgText(X(i), 5, '?', 15, 'var(--warm)'); });
  if(full && q.asksSum) g += svgText(150, 34, tr('сборът на шестте: ', 'сума всіх шести: ') + q.ans, 15, 'var(--ink)', popAt(12));
  return '<svg viewBox="0 ' + (full ? -60 : -44) + ' 300 ' + (full ? (q.asksSum ? 102 : 74) : 58) + '" style="display:block; width:300px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('числата и стъпките между тях', 'числа і кроки між ними') + '">' + g + '</svg>';
}
function whyDiffSeq(q, full){
  if(!full) return tr('Виж с колко се променя всяко число — а после как се променят самите стъпки.', 'Подивись, на скільки змінюється кожне число, — а потім як змінюються самі кроки.') + diffSeqSvg(q, false);
  const steps = q.seq.slice(1).map((v, i) => Math.abs(v - q.seq[i]));
  return tr('стъпките са ', 'кроки: ') + steps.slice(0, 4).join(', ') + tr(', следващата е ', ', наступний: ') + steps[4] + ' &nbsp;→&nbsp; ' +
    q.seq[4] + (q.down ? ' − ' : ' + ') + steps[4] + ' = <b>' + q.seq[5] + '</b>' + (q.asksSum ? ' &nbsp;→&nbsp; ' + q.seq.join(' + ') + ' = ' + q.ans : '') + diffSeqSvg(q, true);
}
KIND.diffseq = { draw:drawDiffSeq, eq:eqDiffSeq, why:whyDiffSeq };
