// Question kind 'circfig': level 392 Всички кръгчета — A face made of circles, some inside others: how many circles in all.

// Кенгуру 2023, задача 1: a mouse-like figure, a face with two ears each holding a smaller circle, two eyes and a nose: 1 + 2 + 2 + 2 + 1 = 8.
// The trap is a circle inside a circle: it is a circle too. Each part may or may not be there (the circles inside the ears, a dot in each
// eye, the nose, two cheeks), at least one inside another circle, so the count that skips those is always a wrong one.
import { KIND, answerLine, rnd, svgFrame, tr } from '../js/core.js';
export function genCircFig(){
  if(rnd(6) === 0) return mk({ earIn: 1, pupil: 0, nose: 1, cheek: 0 });
  for(;;){
    const q = mk({ earIn: rnd(2), pupil: rnd(2), nose: rnd(2), cheek: rnd(2) });
    if((q.earIn || q.pupil) && q.ans >= 7) return q;
  }
}
function mk(p){
  const parts = [[1, 'главата', 'голова'], [2, 'ушите', 'вуха'], [p.earIn * 2, 'кръгчетата в ушите', 'кружечки у вухах'], [2, 'очите', 'очі'], [p.pupil * 2, 'зениците в очите', 'зіниці в очах'], [p.nose, 'носът', 'ніс'], [p.cheek * 2, 'бузите', 'щоки']].filter(x => x[0] > 0);
  const ans = parts.reduce((a, x) => a + x[0], 0);
  return {kind:'circfig', ...p, parts, ans, traps:[ans - p.earIn*2 - p.pupil*2]};
}
const circle = (/** @type {number} */ x, /** @type {number} */ y, /** @type {number} */ r, /** @type {string} */ f) => '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + f + '" stroke="var(--fur-dark)" stroke-width="2"/>';
function pic(q){
  const skin = 'color-mix(in srgb, var(--warm) 45%, var(--paper))', eye = 'var(--accent)', inner = 'var(--rose)';
  let s = circle(54, 50, 26, skin) + circle(146, 50, 26, skin);
  if(q.earIn) s += circle(54, 50, 12, inner) + circle(146, 50, 12, inner);
  s += circle(100, 104, 46, skin) + circle(82, 96, 9, 'var(--paper)') + circle(118, 96, 9, 'var(--paper)');
  if(q.pupil) s += circle(82, 96, 4, eye) + circle(118, 96, 4, eye);
  if(q.nose) s += circle(100, 116, 6, 'var(--grape)');
  if(q.cheek) s += circle(66, 120, 7, inner) + circle(134, 120, 7, inner);
  s += '<path d="M86,130 Q100,140 114,130" fill="none" stroke="var(--fur-dark)" stroke-width="2.4" stroke-linecap="round"/>';
  return svgFrame('0 0 200 156', 230, tr('глава на мишле, направена от кръгчета', 'голова мишеняти, зроблена з кружечків')) + s + '</svg>';
}
function drawCircFig(q){
  return '<div class="ask">' + tr('Колко са <b>всички</b> кръгчета на фигурата?', 'Скільки <b>всіх</b> кружечків на фігурі?') + '</div>' + pic(q) + answerLine('md');
}
function eqCircFig(q){
  return q.parts.map(x => x[0]).join(' + ') + ' = ' + q.ans;
}
function whyCircFig(q, full){
  if(!full) return tr('Кръгче в кръгче също е кръгче: брой и онези, които са вътре в други.', 'Кружечок у кружечку — теж кружечок: рахуй і ті, що всередині інших.');
  return q.parts.map(x => tr(x[1], x[2]) + ' ' + x[0]).join(', ') + ' &nbsp;→&nbsp; ' + q.parts.map(x => x[0]).join(' + ') + ' = ' + q.ans;
}
KIND.circfig = { draw:drawCircFig, eq:eqCircFig, why:whyCircFig };
