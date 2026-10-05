// Question kind 'diagsq': level 168 Квадратчетата по диагонала — Shaded squares corner to corner give the big square's side.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Пролет 2023, 1 клас, задача 11: 4 equal shaded squares, each with a side of 1 см, run
// corner to corner across a big square. Each takes one centimetre of the bottom side, so the side
// is 4 см, and the perimeter four such sides: 4 + 4 + 4 + 4 = 16.
import { CM, KIND, SLOT, popAt, rnd, svgText, tr, ukN } from '../js/core.js';
export function genDiagSq(){
  const n = 3 + rnd(4), s = Math.random() < 0.75 ? 1 : 2, side = Math.random() < 0.25;
  // the slips: the side for the perimeter, or the four sides of one small square
  return {kind:'diagsq', n, s, side, traps: side ? [n] : [n*s, 4*s], ans: side ? n*s : 4*n*s};
}
// The big square and its shaded diagonal; full drops each small square onto the bottom side,
// where they fill it, then writes the side on all four sides.
function diagSqSvg(q, full){
  const u = Math.round(120 / q.n), W = q.n*u;
  let g = '<rect x="0" y="0" width="' + W + '" height="' + W + '" fill="none" stroke="var(--ink)" stroke-width="1.8"/>';
  for(let i = 0; i < q.n; i++) g += '<rect x="' + i*u + '" y="' + i*u + '" width="' + u + '" height="' + u + '" fill="var(--muted)" fill-opacity=".45" stroke="var(--ink)" stroke-width="1.4"/>';
  if(full){
    for(let i = 0; i < q.n; i++) g += '<g' + popAt(1 + i*0.6) + '><path d="M' + (i*u + 2) + ' ' + ((i + 1)*u) + 'V' + (W - 2) + 'M' + ((i + 1)*u - 2) + ' ' + ((i + 1)*u) + 'V' + (W - 2) + '" stroke="var(--accent)" stroke-width="1" stroke-dasharray="2.5 2.5"/>' +
      '<path d="M' + (i*u + 2) + ' ' + (W + 6) + 'H' + ((i + 1)*u - 2) + '" stroke="var(--accent)" stroke-width="3" stroke-linecap="round"/>' + svgText(i*u + u/2, W + 20, q.s, 11, 'var(--accent)') + '</g>';
    const t = 2 + q.n*0.6, L = q.n*q.s + ' см';
    g += '<g' + popAt(t) + '>' + svgText(W/2, -8, L, 12, 'var(--warm)') + svgText(-24, W/2 + 4, L, 12, 'var(--warm)') + svgText(W + 24, W/2 + 4, L, 12, 'var(--warm)') + '</g>';
  }
  return '<svg viewBox="' + (full ? '-50 -22 ' + (W + 100) + ' ' + (W + 50) : '-4 -4 ' + (W + 8) + ' ' + (W + 8)) + '" style="display:block; width:' + (full ? W + 100 : W + 8)*1.2 + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('квадрат със защриховани квадратчета по диагонала', 'квадрат із заштрихованими квадратиками по діагоналі') + '">' + g + '</svg>';
}
function drawDiagSq(q){
  if(q.kind === 'diagsq'){
    return '<div class="ask">' + tr('Защриховани са <span class="num">' + q.n + '</span> еднакви квадратчета, всяко със страна <span class="num">' + q.s + '</span> см. Колко сантиметра е <b>' + (q.side ? 'страната' : 'обиколката') + '</b> на големия квадрат?',
      'Заштриховано <span class="num">' + ukN(q.n, 'однаковий квадратик', 'однакові квадратики', 'однакових квадратиків').replace(' ', '</span> ') + ', кожен зі стороною <span class="num">' + q.s + '</span> см. Скільки сантиметрів становить <b>' + (q.side ? 'сторона' : 'периметр') + '</b> великого квадрата?') + '</div>' +
      '<div class="fig">' + diagSqSvg(q, false) + '</div>' +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + SLOT + CM + '</div>';
  }
}
function eqDiagSq(q){
  if(q.kind === 'diagsq'){
    const side = q.n*q.s;
    return tr('страна ', 'сторона ') + (q.s === 1 ? '' : Array(q.n).fill(q.s).join(' + ') + ' = ') + side + (q.side ? '' : ' → ' + [side, side, side, side].join(' + ') + ' = ' + q.ans);
  }
}
function whyDiagSq(q, full){
  if(q.kind === 'diagsq'){
    if(!full) return tr('Квадратчетата стигат от единия ъгъл до другия. Колко от тях се нареждат по една страна на големия квадрат?',
      'Квадратики тягнуться від одного кута до іншого. Скільки їх уміщується вздовж однієї сторони великого квадрата?');
    const side = q.n*q.s, run = Array(q.n).fill(q.s).join(' + ');
    return tr('по долната страна се нареждат ' + q.n + ' квадратчета', 'вздовж нижньої сторони вміщується ' + ukN(q.n, 'квадратик', 'квадратики', 'квадратиків')) +
      ' &nbsp;→&nbsp; ' + tr('страната е ', 'сторона — ') + (q.s === 1 ? '' : run + ' = ') + '<b>' + side + '</b> см' + diagSqSvg(q, true) +
      (q.side ? tr('страната е ', 'сторона — ') + side : tr('обиколката: ', 'периметр: ') + side + ' + ' + side + ' + ' + side + ' + ' + side + ' = ' + q.ans);
  }
}
KIND.diagsq = { draw:drawDiagSq, eq:eqDiagSq, why:whyDiagSq };
