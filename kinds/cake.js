// Question kind 'cake': level 345 — a cake cut one way, then across: the pieces are rows of pieces added.

// Кенгуру 2026, 2 клас, задача 11: a cake cut with 3 parallel cuts, then with 4 more across them: the first cuts make 4 strips, each
// strip is cut by the 4 others into 5 pieces, 5 + 5 + 5 + 5 = 20. (The paper's picture shows the knife and the dashed lines.)
import { KIND, SLOT, popAt, rnd, tr, ukN } from '../js/core.js';
export function genCake(){
  for(;;){
    const a = 2 + rnd(4), b = 2 + rnd(4);
    if(a === b && Math.random() < 0.7) continue;
    const ans = (a + 1) * (b + 1);
    return {kind:'cake', a, b, traps:[(a + 1) + (b + 1), a + b, (a + 1) * b].filter(v => v !== ans), ans};
  }
}
function drawCake(q){
  return '<div class="ask">' + tr('Първоначално тортата е разрязана с нож с помощта на <span class="num">' + q.a + '</span> успоредни разреза, а след това е разрязана допълнително с помощта на <span class="num">' + q.b + '</span> разреза, перпендикулярни на първите. Колко са получените парчета?',
    'Спочатку торт розрізали ножем за допомогою <span class="num">' + q.a + '</span> паралельних розрізів, а потім додатково розрізали за допомогою <span class="num">' + q.b + '</span> розрізів, перпендикулярних до перших. Скільки вийшло шматків?') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
const rows = q => Array((q.a + 1)).fill(q.b + 1);
function eqCake(q){ return rows(q).join(' + ') + ' = ' + q.ans; }
// the cake from above: the first cuts (solid), and with the second ones the grid
function cakeSvg(q, full){
  const X0 = 20, Y0 = 8, W = 220, H = 100, sx = W / (q.a + 1), sy = H / (q.b + 1);
  let g = '<rect x="' + X0 + '" y="' + Y0 + '" width="' + W + '" height="' + H + '" rx="6" fill="var(--lemon)" stroke="var(--warm)" stroke-width="2"/>';
  for(let i = 1; i <= q.a; i++) g += '<line' + popAt(i) + ' x1="' + (X0 + i*sx).toFixed(1) + '" y1="' + (Y0 - 4) + '" x2="' + (X0 + i*sx).toFixed(1) + '" y2="' + (Y0 + H + 4) + '" stroke="var(--ink)" stroke-width="2" stroke-dasharray="5 3"/>';
  if(full) for(let j = 1; j <= q.b; j++) g += '<line' + popAt(q.a + j) + ' x1="' + (X0 - 4) + '" y1="' + (Y0 + j*sy).toFixed(1) + '" x2="' + (X0 + W + 4) + '" y2="' + (Y0 + j*sy).toFixed(1) + '" stroke="var(--accent)" stroke-width="2" stroke-dasharray="5 3"/>';
  return '<svg viewBox="0 0 260 116" style="display:block; width:260px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + tr('тортата отгоре и разрезите', 'торт зверху і розрізи') + '">' + g + '</svg>';
}
function whyCake(q, full){
  if(!full) return tr('Нарисувай тортата отгоре. Първите разрези я режат на ленти. Колко са лентите?', 'Намалюй торт зверху. Перші розрізи ріжуть його на смуги. Скільки смуг?') + cakeSvg(q, false);
  return cakeSvg(q, true) + tr(q.a + ' успоредни разреза правят <b>' + (q.a + 1) + '</b> ленти. Останалите ' + q.b + ' разреза режат всяка лента на <b>' + (q.b + 1) + '</b> парчета: ' + rows(q).join(' + ') + ' = <b>' + q.ans + '</b>',
    ukN(q.a, 'паралельний розріз', 'паралельні розрізи', 'паралельних розрізів') + ' дають <b>' + ukN(q.a + 1, 'смугу', 'смуги', 'смуг') + '</b>. Решта ' + ukN(q.b, 'розріз', 'розрізи', 'розрізів') + ' ріжуть кожну смугу на <b>' + ukN(q.b + 1, 'шматок', 'шматки', 'шматків') + '</b>: ' + rows(q).join(' + ') + ' = <b>' + q.ans + '</b>');
}
KIND.cake = { draw:drawCake, eq:eqCake, why:whyCake };
