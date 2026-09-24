// Question kind 'diffseq': level 95 25, 24, 21, 16, 9, ? — A run whose steps grow by the same amount.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Коледно състезание 2025, задача 7: 25, 24, 21, 16, 9, ? — then the sum of all six. The steps
// are 1, 3, 5, 7, so the next is 9 and the sixth number is 0; the six add to 95. The steps
// themselves make a run, which is the thing to see.
function genDiffSeq(){
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
  if(q.kind === 'diffseq'){
    return '<div class="ask">' + (q.asksSum ? tr('Като откриете следващото число в редицата, пресметнете <b>сбора на всичките шест</b> числа.', 'Знайшовши наступне число в послідовності, обчисліть <b>суму всіх шести</b> чисел.')
                                            : tr('Кое е <b>следващото</b> число в редицата?', 'Яке <b>наступне</b> число в послідовності?')) + '</div>' +
      '<div class="seq">' + q.seq.slice(0, 5).join(', ') + ', ?</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqDiffSeq(q){
  if(q.kind === 'diffseq') return q.seq.join(', ') + (q.asksSum ? ' → ' + q.ans : '');
}
function whyDiffSeq(q, full){
  if(q.kind === 'diffseq'){
    if(!full) return tr('Виж с колко се променя всяко число — а после как се променят самите стъпки.', 'Подивись, на скільки змінюється кожне число, — а потім як змінюються самі кроки.');
    const steps = q.seq.slice(1).map((v, i) => Math.abs(v - q.seq[i]));
    return tr('стъпките са ', 'кроки: ') + steps.slice(0, 4).join(', ') + tr(', следващата е ', ', наступний: ') + steps[4] + ' &nbsp;→&nbsp; ' +
      q.seq[4] + (q.down ? ' − ' : ' + ') + steps[4] + ' = <b>' + q.seq[5] + '</b>' + (q.asksSum ? ' &nbsp;→&nbsp; ' + q.seq.join(' + ') + ' = ' + q.ans : '');
  }
}
KIND.diffseq = { draw:drawDiffSeq, eq:eqDiffSeq, why:whyDiffSeq };
