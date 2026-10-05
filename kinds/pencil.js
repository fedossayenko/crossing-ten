// Question kind 'pencil': level 161 Моливите — Two pencils on two rulers; how long is the longer, or the shorter.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Пролет 2023, 1 клас, задача 10 (and Пролет 2025, задача 11, the shorter one): a pencil lies
// over a ruler from 7 to 14, another from 3 to 11. Neither starts at 0, so the length is not
// the mark the tip reaches but the marks between: 14 − 7 = 7 and 11 − 3 = 8.
import { CM, KIND, SLOT, popAt, rnd, svgText, tr } from '../js/core.js';
export function genPencil(){
  for(;;){
    const a = 1 + rnd(7), la = 3 + rnd(8), c = 1 + rnd(7), lc = 3 + rnd(8);   // never from 0: reading the start is the task
    if(a + la > 15 || c + lc > 15 || la === lc) continue;
    const long = Math.random() < 0.5, top = (la > lc) === long;
    // the slip: the mark the tip of the wanted pencil reaches, read as its length
    return {kind:'pencil', a, b: a + la, c, d: c + lc, long, traps:[top ? a + la : c + lc], ans: long ? Math.max(la, lc) : Math.min(la, lc)};
  }
}
// The two rulers, each with its pencil lying over it between two dashed lines; full adds the
// length of each pencil, counted off the ruler, and rings the one asked for.
function pencilSvg(q, full){
  const u = 18, X0 = 10, x = v => X0 + v*u, RW = 15*u, rowH = full ? 96 : 66;
  let g = '';
  [[q.a, q.b], [q.c, q.d]].forEach(([s, e], i) => {
    const y = i*rowH, ry = y + 24, len = e - s;
    // the ruler: millimetre ticks, longer every half and every whole centimetre, the numbers under them
    let ticks = '';
    for(let m = 0; m <= 150; m++){ const h = m % 10 === 0 ? 8 : m % 5 === 0 ? 5.5 : 3.5; ticks += 'M' + (X0 + m*u/10).toFixed(1) + ' ' + ry + 'v' + h; }
    g += '<rect x="' + (X0 - 6) + '" y="' + ry + '" width="' + (RW + 12) + '" height="26" rx="2" fill="var(--solid)" stroke="var(--ink)" stroke-width="1.3"/>' +
      '<path d="' + ticks + '" stroke="var(--ink)" stroke-width=".7"/>';
    for(let v = 0; v <= 15; v++) g += svgText(x(v), ry + 21, v, 8.5, 'var(--ink)');
    // the pencil: an eraser at the left, a striped body, then the sharpened wood and the lead at the mark
    const py = y + 6, ph = 10, tip = Math.min(18, len*u*0.3), bodyEnd = x(e) - tip;
    g += '<path d="M' + x(s) + ' ' + (y - 2) + 'V' + (ry + 2) + 'M' + x(e) + ' ' + (y - 2) + 'V' + (ry + 2) + '" stroke="var(--muted)" stroke-width="1" stroke-dasharray="2.5 2.5"/>' +
      '<rect x="' + x(s) + '" y="' + py + '" width="' + (bodyEnd - x(s)).toFixed(1) + '" height="' + ph + '" rx="2" fill="var(--lemon)" stroke="var(--ink)" stroke-width="1.2"/>' +
      '<rect x="' + x(s) + '" y="' + py + '" width="6" height="' + ph + '" rx="2" fill="var(--rose)" stroke="var(--ink)" stroke-width="1.2"/>' +
      '<path d="M' + (x(s) + 6) + ' ' + (py + ph/2) + 'H' + bodyEnd.toFixed(1) + '" stroke="var(--ink)" stroke-width=".6"/>' +
      '<path d="M' + bodyEnd.toFixed(1) + ' ' + py + 'L' + x(e) + ' ' + (py + ph/2) + 'L' + bodyEnd.toFixed(1) + ' ' + (py + ph) + 'Z" fill="var(--warmbg)" stroke="var(--ink)" stroke-width="1.2"/>' +
      '<path d="M' + (x(e) - tip*0.35).toFixed(1) + ' ' + (py + ph*0.33).toFixed(1) + 'L' + x(e) + ' ' + (py + ph/2) + 'L' + (x(e) - tip*0.35).toFixed(1) + ' ' + (py + ph*0.67).toFixed(1) + 'Z" fill="var(--ink)"/>';
    if(full){
      // the centimetres the pencil covers, counted one by one under the ruler, then its length
      const asked = len === q.ans, col = asked ? 'var(--warm)' : 'var(--accent)';
      let steps = '';
      for(let k = 0; k < len; k++) steps += '<path d="M' + (x(s + k) + 1.5) + ' ' + (ry + 32) + 'q' + (u/2 - 1.5) + ' 7 ' + (u - 3) + ' 0" fill="none" stroke="' + col + '" stroke-width="1.6"/>';
      g += '<g' + popAt(1 + i*2) + '>' + steps + '</g>' +
        svgText((x(s) + x(e))/2, ry + 52, e + ' − ' + s + ' = ' + len, 12, col, popAt(2 + i*2));
    }
  });
  const H = 2*rowH - 8;
  return '<svg viewBox="0 -4 ' + (RW + 20) + ' ' + H + '" style="display:block; width:' + Math.round((RW + 20)*1.25) + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('два молива върху две линийки', 'два олівці на двох лінійках') + '">' + g + '</svg>';
}
function drawPencil(q){
  if(q.kind === 'pencil'){
    return '<div class="ask">' + tr('Колко сантиметра е <b>' + (q.long ? 'по-дългият' : 'по-късият') + '</b> молив?',
      'Скільки сантиметрів завдовжки <b>' + (q.long ? 'довший' : 'коротший') + '</b> олівець?') + '</div>' +
      '<div class="fig wide">' + pencilSvg(q, false) + '</div>' +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + SLOT + CM + '</div>';
  }
}
function eqPencil(q){
  if(q.kind === 'pencil') return q.a + '→' + q.b + ', ' + q.c + '→' + q.d + ' → ' + q.ans;
}
function whyPencil(q, full){
  if(q.kind === 'pencil'){
    if(!full) return tr('Моливите не започват от нулата — виж откъде тръгва всеки и докъде стига.',
      'Олівці не починаються з нуля — подивись, звідки починається кожен і докуди доходить.');
    return tr('горният: от ' + q.a + ' до ' + q.b + ' → <b>' + (q.b - q.a) + '</b> см, долният: от ' + q.c + ' до ' + q.d + ' → <b>' + (q.d - q.c) + '</b> см',
      'верхній: від ' + q.a + ' до ' + q.b + ' → <b>' + (q.b - q.a) + '</b> см, нижній: від ' + q.c + ' до ' + q.d + ' → <b>' + (q.d - q.c) + '</b> см') + pencilSvg(q, true) +
      tr(q.long ? 'по-дългият е ' : 'по-късият е ', q.long ? 'довший — ' : 'коротший — ') + q.ans + ' см';
  }
}
KIND.pencil = { draw:drawPencil, eq:eqPencil, why:whyPencil };
