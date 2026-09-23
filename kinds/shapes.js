// Question kind 'shapes': level 37 Фигури — Add the fewest shapes to make two counts match.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 20: only additions are allowed. Raising the white circles costs three (the
// circle, a black square to match it, and a black circle), while raising the white
// squares costs two — so when the black circles already outnumber the whites, the
// squares are the cheaper way to catch up.
const SHAPE_GLYPH = { wo:'○', ws:'□', bs:'■', bc:'●' };
function genShapes(){
  for(;;){
    const wo = 1 + rnd(3), ws = rnd(3), bs = 1 + rnd(4), bc = rnd(5);
    const W = Math.max(wo, bs);
    const D = Math.max(ws, bc - W);
    const ans = 3*W + 2*D - (wo + ws + bs + bc);
    if(ans < 2 || ans > 12) continue;
    const row = shuffle(Array(wo).fill('wo').concat(
      Array(ws).fill('ws'), Array(bs).fill('bs'), Array(bc).fill('bc')));
    return {kind:'shapes', wo, ws, bs, bc, row, W, D, ans};
  }
}

function drawShapes(q){
  if(q.kind === 'shapes'){
    return '<div class="ask">Колко <b>най-малко</b> фигури общо трябва да добавим, така че черните квадрати ■ да са толкова, колкото белите кръгове ○, а черните кръгове ● да са толкова, колкото са <b>всичките бели</b> фигури?</div>' +
      '<div class="seq" style="letter-spacing:.2em">' + q.row.map(t => SHAPE_GLYPH[t]).join(' ') + '</div>' +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + SLOT + '</div>';
  }
}
function eqShapes(q){
  if(q.kind === 'shapes') return '○' + q.wo + ' □' + q.ws + ' ■' + q.bs + ' ●' + q.bc + ' → ' + q.ans;
}
function whyShapes(q, full){
  if(q.kind === 'shapes'){
    if(!full) return 'Белите квадратчета също се броят към белите фигури.';
    return 'сега ○' + q.wo + ' □' + q.ws + ' ■' + q.bs + ' ●' + q.bc +
      ' &nbsp;→&nbsp; накрая <b>○' + q.W + ' □' + q.D + ' ■' + q.W + ' ●' + (q.W + q.D) +
      '</b> &nbsp;→&nbsp; добавяме ' + (q.W - q.wo) + ' + ' + (q.D - q.ws) + ' + ' + (q.W - q.bs) +
      ' + ' + (q.W + q.D - q.bc) + ' = ' + q.ans;
  }
}
KIND.shapes = { draw:drawShapes, eq:eqShapes, why:whyShapes };
