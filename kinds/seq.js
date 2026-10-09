// Question kind 'seq': level 26 Редица — Smaller on the left, bigger on the right.

// Задача 20: near-sorted, so a few numbers sit with everything smaller to their left
// and everything bigger to their right. Counted directly, never inferred.
import { KIND, SLOT, bgList, popAt, rnd, svgText, tr } from '../js/core.js';
export function genSeq(){
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
  return tr('<div class="ask">Колко са числата от редицата, вляво от които числата са по-малки, а вдясно — по-големи?</div>',
    '<div class="ask">Скільки чисел у ряду мають ліворуч лише менші числа, а праворуч — лише більші?</div>') +
    '<div class="seq">' + q.a.join(', ') + '</div>' +
    '<div class="line lg">' + SLOT + '</div>';
}
function eqSeq(q){
  return q.a.join(', ') + ' → ' + bgList(q.hits) + ' → ' + q.ans;
}
// The picture: each number of the row with ✓ or ✗ under it, the ✓ ones ringed, then how many have a ✓.
// The hint draws the rule on empty boxes: the one being checked, all smaller to its left, all bigger to its right.
function seqSvg(q){
  const n = q.a.length, X = i => 15 + i*30 + (10 - n)*15;
  let g = '';
  q.a.forEach((v, i) => { const hit = q.hits.indexOf(v) >= 0;
    g += '<g' + popAt(1 + i*0.6) + '>' + (hit ? '<circle cx="' + X(i) + '" cy="-5" r="12" fill="var(--goodbg)" stroke="var(--good)" stroke-width="2"/>' : '') +
      svgText(X(i), 0, v, 15, hit ? 'var(--good)' : 'var(--ink)') + svgText(X(i), 28, hit ? '✓' : '✗', 15, hit ? 'var(--good)' : 'var(--muted)') + '</g>'; });
  g += svgText(150, 58, tr('числата с ✓: ', 'чисел із ✓: ') + q.ans, 15, 'var(--ink)', popAt(2 + n*0.6));
  return '<svg viewBox="0 -22 300 90" style="display:block; width:300px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('кои числа стават', 'які числа підходять') + '">' + g + '</svg>';
}
function seqRuleSvg(){
  const box = (i, mid) => '<rect x="' + (6 + i*38) + '" y="0" width="30" height="30" rx="6" fill="' + (mid ? 'var(--accentbg)' : 'none') + '" stroke="' + (mid ? 'var(--accent)' : 'var(--muted)') + '" stroke-width="2"/>';
  const brace = (a, b, t, col) => '<path d="M' + a + ',-4 v-6 H' + b + ' v6" stroke="' + col + '" stroke-width="2" fill="none"/>' + svgText((a + b)/2, -16, t, 12, col);
  let g = '';
  for(let i = 0; i < 7; i++) g += box(i, i === 3);
  g += brace(6, 112, tr('всички по-малки', 'усі менші'), 'var(--good)') + brace(158, 264, tr('всички по-големи', 'усі більші'), 'var(--warm)');
  return '<svg viewBox="0 -32 270 66" style="display:block; width:270px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('правилото за едно число', 'правило для одного числа') + '">' + g + '</svg>';
}
function whySeq(q, full){
  if(!full) return tr('Провери всяко число: всички отляво по-малки, всички отдясно по-големи.',
    'Перевір кожне число: усі ліворуч менші, усі праворуч більші.') + seqRuleSvg();
  return (q.hits.length === 1 ? tr('това е само числото <b>', 'це лише число <b>') + q.hits[0] + '</b>'
                              : tr('това са <b>', 'це <b>') + bgList(q.hits) + '</b>') + ' &nbsp;→&nbsp; ' + q.ans + seqSvg(q);
}
KIND.seq = { draw:drawSeq, eq:eqSeq, why:whySeq };
