// Question kind 'seq': level 26 Редица — Smaller on the left, bigger on the right.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 20: near-sorted, so a few numbers sit with everything smaller to their left
// and everything bigger to their right. Counted directly, never inferred.
function genSeq(){
  for(;;){
    const n = 8 + rnd(3);
    const a = [];
    for(let i = 1; i <= n; i++) a.push(i);
    const swaps = 2 + rnd(3);
    for(let s = 0; s < swaps; s++){ const i = rnd(n - 1), t = a[i]; a[i] = a[i+1]; a[i+1] = t; }
    if(Math.random() < 0.5) a.push(a.splice(rnd(n - 2), 1)[0]);
    const hits = a.filter((v, i) =>
      a.every((w, j) => j === i || (j < i ? w < v : w > v)));
    if(hits.length < 1 || hits.length > n - 3) continue;
    return {kind:'seq', a, hits, ans: hits.length};
  }
}

function drawSeq(q){
  if(q.kind === 'seq'){
    return tr('<div class="ask">Колко са числата от редицата, вляво от които числата са по-малки, а вдясно — по-големи?</div>',
      '<div class="ask">Скільки чисел у ряду мають ліворуч лише менші числа, а праворуч — лише більші?</div>') +
      '<div class="seq">' + q.a.join(', ') + '</div>' +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + SLOT + '</div>';
  }
}
function eqSeq(q){
  if(q.kind === 'seq') return q.a.join(', ') + ' → ' + bgList(q.hits) + ' → ' + q.ans;
}
function whySeq(q, full){
  if(q.kind === 'seq'){
    if(!full) return tr('Провери всяко число: всички отляво по-малки, всички отдясно по-големи.',
      'Перевір кожне число: усі ліворуч менші, усі праворуч більші.');
    return (q.hits.length === 1 ? tr('това е само числото <b>', 'це лише число <b>') + q.hits[0] + '</b>'
                                : tr('това са <b>', 'це <b>') + bgList(q.hits) + '</b>') + ' &nbsp;→&nbsp; ' + q.ans;
  }
}
KIND.seq = { draw:drawSeq, eq:eqSeq, why:whySeq };
