// Question kind 'paint': level 34 Оцветени — Paint whole rows and columns — what is left.
import { KIND, SLOT, UK_PLURAL, gridSvg, popAt, rnd, svgText, tr } from '../js/core.js';

const BGROW = {1:['един ред','един стълб'], 2:['два реда','два стълба'], 3:['три реда','три стълба']};

// Задача 14: whole rows and columns painted. What survives is the leftover rows
// times the leftover columns — the crossings are counted twice the other way.
export function genPaint(){
  const R = 3 + rnd(3), C = 4 + rnd(4);
  const r = 1 + rnd(Math.min(3, R - 1)), c = 1 + rnd(Math.min(3, C - 1));
  const left = (R - r) * (C - c);
  const asksLeft = Math.random() < 0.7;
  return {kind:'paint', R, C, r, c, left, asksLeft, ans: asksLeft ? left : R*C - left};
}

const paintRowUk = {1:['одному рядку','одному стовпці'], 2:['двох рядках','двох стовпцях'], 3:['трьох рядках','трьох стовпцях']};
const paintPl = (n, one, few, many) => ({one, few}[UK_PLURAL.select(n)] || many);

function drawPaint(q){
  return '<div class="ask">' + tr('Правоъгълник е съставен от <span class="num">' + (q.R*q.C) +
    '</span> квадратчета в <span class="num">' + q.R + '</span> реда и <span class="num">' + q.C +
    '</span> стълба. Ако оцветим квадратчетата в <b>' + BGROW[q.r][0] + '</b> и в <b>' + BGROW[q.c][1] +
    '</b>, колко квадратчета ще останат <b>' + (q.asksLeft ? 'неоцветени' : 'оцветени') + '</b>?',
    'Прямокутник складено з <span class="num">' + (q.R*q.C) + '</span> ' + paintPl(q.R*q.C, 'квадратика', 'квадратиків', 'квадратиків') + ', розміщених у <span class="num">' +
    q.R + '</span> рядках і <span class="num">' + q.C + '</span> стовпцях. Якщо зафарбувати квадратики в <b>' +
    paintRowUk[q.r][0] + '</b> і в <b>' + paintRowUk[q.c][1] + '</b>, скільки квадратиків ' +
    (q.asksLeft ? 'залишиться <b>незафарбованими</b>' : 'буде <b>зафарбовано</b>') + '?') + '</div>' +
    gridSvg(q.C, q.R, 0, 0) +
    '<div class="line md">' + SLOT + '</div>';
}
function eqPaint(q){
  return tr(q.R + '×' + q.C + ', оцветени ' + q.r + ' реда и ' + q.c + ' стълба → ' + q.ans,
    q.R + '×' + q.C + ', зафарбовано ' + q.r + ' ' + paintPl(q.r, 'рядок', 'рядки', 'рядків') + ' і ' + q.c + ' ' +
    paintPl(q.c, 'стовпець', 'стовпці', 'стовпців') + ' → ' + q.ans);
}
// The picture: the painted rows on top, the painted columns on the left, each a see-through layer, so a crossing
// painted twice shows darker but is still one square; what is left is one block in the corner, counted row by row.
// The hint draws a small grid of its own (one row, one column, their crossing) with no numbers.
function paintSvg(q, full){
  const R = full ? q.R : 3, C = full ? q.C : 4, r = full ? q.r : 1, c = full ? q.c : 1, u = 26, w = C*u, h = R*u;
  const layer = (x, y, ww, hh, st) => '<rect' + popAt(st) + ' x="' + x + '" y="' + y + '" width="' + ww + '" height="' + hh + '" fill="var(--accent)" fill-opacity=".32"/>';
  let lines = '';
  for(let i = 0; i <= C; i++) lines += '<line x1="' + i*u + '" y1="0" x2="' + i*u + '" y2="' + h + '"/>';
  for(let j = 0; j <= R; j++) lines += '<line x1="0" y1="' + j*u + '" x2="' + w + '" y2="' + j*u + '"/>';
  let g = layer(0, 0, w, r*u, 1) + layer(0, 0, c*u, h, 2) + '<g stroke="var(--ink)" stroke-width="1.5">' + lines + '</g>';
  if(!full) g += '<rect' + popAt(3) + ' x="1" y="1" width="' + (u - 2) + '" height="' + (u - 2) + '" fill="none" stroke="var(--warm)" stroke-width="3"/>';
  else {
    const rr = R - r, cc = C - c;
    g += '<rect' + popAt(3) + ' x="' + c*u + '" y="' + r*u + '" width="' + cc*u + '" height="' + rr*u + '" fill="var(--warm)" fill-opacity=".22" stroke="var(--warm)" stroke-width="3"/>';
    const left = rr === 1 ? String(q.left) : rr <= 5 ? Array(rr).fill(cc).join(' + ') + ' = ' + q.left : rr + ' × ' + cc + ' = ' + q.left;
    const foot = q.asksLeft ? left : (rr === 1 ? '' : left + ', ') + (R*C) + ' − ' + q.left + ' = ' + q.ans;
    g += svgText(w/2, h + 24, foot, 15, 'var(--ink)', popAt(4));
  }
  const W = full ? Math.max(w, 230) : w, x0 = (W - w)/2, H = h + (full ? 34 : 0);
  // the line break keeps the worked line's last number apart from the foot's when the foot is that one number
  return '\n<svg viewBox="' + (-x0 - 3) + ' -3 ' + (W + 6) + ' ' + (H + 6) + '" style="display:block; width:' + Math.round((W + 6)*(full ? 1.1 : 0.9)) + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('оцветените редове и стълбове', 'зафарбовані рядки й стовпці') + '">' + g + '</svg>';
}
function whyPaint(q, full){
  if(!full) return tr('Квадратчетата в кръстовищата се броят само веднъж.', 'Квадратики на перетинах рахуються лише один раз.') + paintSvg(q, false);
  const rr = q.R - q.r, cc = q.C - q.c;
  const rows = tr(rr === 1 ? '<b>1</b> неоцветен ред' : '<b>' + rr + '</b> неоцветени реда',
    '<b>' + rr + '</b> ' + paintPl(rr, 'незафарбований рядок', 'незафарбовані рядки', 'незафарбованих рядків'));
  const cols = tr(cc === 1 ? '<b>1</b> неоцветен стълб' : '<b>' + cc + '</b> неоцветени стълба',
    '<b>' + cc + '</b> ' + paintPl(cc, 'незафарбований стовпець', 'незафарбовані стовпці', 'незафарбованих стовпців'));
  const body = tr('остават ', 'лишаються ') + rows + tr(' и ', ' і ') + cols + ' &nbsp;→&nbsp; ' +
    (rr === 1 ? String(q.left)
     : rr <= 5 ? Array(rr).fill(cc).join(' + ') + ' = ' + q.left
     : rr + ' × ' + cc + ' = ' + q.left);
  return (q.asksLeft ? body : body + ' &nbsp;→&nbsp; ' + (q.R*q.C) + ' − ' + q.left + ' = ' + q.ans) + paintSvg(q, true);
}
KIND.paint = { draw:drawPaint, eq:eqPaint, why:whyPaint };
