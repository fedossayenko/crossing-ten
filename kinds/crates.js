// Question kind 'crates': level 47 Три щайги — A total, a part of it, and a gap between the rest.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

const CRATES = [['щайги','щайга'], ['кутии','кутия'], ['кошници','кошница']];
const ORD = ['първата', 'втората', 'третата'];
// Задача 15: three amounts, a total, a total of two of them, and a gap between the other
// two. Peeled off one at a time, each step leaves one fewer unknown.
function genCrates(){
  for(;;){
    const c = 4 + rnd(12), d = 1 + rnd(5), b = c - d, a = 2 + rnd(14);
    if(b < 1) continue;
    const asks = rnd(3);
    return {kind:'crates', box: CRATES[rnd(CRATES.length)], asks,
            T: a + b + c, ab: a + b, a, b, c, d, ans: [a, b, c][asks]};
  }
}

function drawCrates(q){
  if(q.kind === 'crates'){
    return '<div class="ask">В три <span class="num">' + q.box[0] + '</span> има <span class="num">' + q.T +
      '</span> кг плодове. В първите две има общо <span class="num">' + q.ab +
      '</span> кг. Във втората има <span class="num">' + q.d + '</span> кг <b>по-малко</b> от третата. ' +
      'Колко килограма плодове има ' + (q.asks === 1 ? 'във' : 'в') + ' <b>' + ORD[q.asks] + '</b> ' +
      q.box[1] + '?</div>' +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + SLOT + ' <span class="unit">кг</span></div>';
  }
}
function eqCrates(q){
  if(q.kind === 'crates') return q.T + ' кг, първите две ' + q.ab + ', втората с ' + q.d +
    ' по-малко → ' + ORD[q.asks] + ' ' + q.ans;
}
function whyCrates(q, full){
  if(q.kind === 'crates'){
    if(!full) return 'Третата се намира от двете, които вече знаеш заедно.';
    const steps = ['третата: ' + q.T + ' − ' + q.ab + ' = <b>' + q.c + '</b>',
                   'втората: ' + q.c + ' − ' + q.d + ' = <b>' + q.b + '</b>',
                   'първата: ' + q.ab + ' − ' + q.b + ' = <b>' + q.a + '</b>'];
    return steps.slice(0, q.asks === 2 ? 1 : q.asks === 1 ? 2 : 3).join(' &nbsp;→&nbsp; ');
  }
}
KIND.crates = { draw:drawCrates, eq:eqCrates, why:whyCrates };
