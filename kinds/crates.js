// Question kind 'crates': level 47 Три щайги — A total, a part of it, and a gap between the rest.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

const CRATES = [['щайги','щайга'], ['кутии','кутия'], ['кошници','кошница']];
const ORD = ['първата', 'втората', 'третата'];
// Ukrainian: locative plural, locative singular, feminine?
const cratesUk = {'щайги': ['ящиках', 'ящику', 0], 'кутии': ['коробках', 'коробці', 1], 'кошници': ['кошиках', 'кошику', 0]};
const cratesOrd = (q, i, loc) => (cratesUk[q.box[0]][2]
  ? (loc ? ['першій', 'другій', 'третій'] : ['перша', 'друга', 'третя'])
  : (loc ? ['першому', 'другому', 'третьому'] : ['перший', 'другий', 'третій']))[i];
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
    const u = cratesUk[q.box[0]];
    return '<div class="ask">' + tr('В три <span class="num">' + q.box[0] + '</span> има <span class="num">' + q.T +
      '</span> кг плодове. В първите две има общо <span class="num">' + q.ab +
      '</span> кг. Във втората има <span class="num">' + q.d + '</span> кг <b>по-малко</b> от третата. ' +
      'Колко килограма плодове има ' + (q.asks === 1 ? 'във' : 'в') + ' <b>' + ORD[q.asks] + '</b> ' +
      q.box[1] + '?',
      'У трьох <span class="num">' + u[0] + '</span> є <span class="num">' + q.T +
      '</span> кг фруктів. У перших двох разом <span class="num">' + q.ab +
      '</span> кг. У ' + cratesOrd(q, 1, 1) + ' на <span class="num">' + q.d + '</span> кг <b>менше</b>, ніж у ' +
      cratesOrd(q, 2, 1) + '. Скільки кілограмів фруктів у <b>' + cratesOrd(q, q.asks, 1) + '</b> ' + u[1] + '?') + '</div>' +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + SLOT + ' <span class="unit">кг</span></div>';
  }
}
function eqCrates(q){
  if(q.kind === 'crates') return tr(q.T + ' кг, първите две ' + q.ab + ', втората с ' + q.d +
    ' по-малко → ' + ORD[q.asks] + ' ',
    q.T + ' кг, перші ' + (cratesUk[q.box[0]][2] ? 'дві ' : 'два ') + q.ab + ', ' + cratesOrd(q, 1) + ' на ' + q.d +
    ' менше → ' + cratesOrd(q, q.asks) + ' ') + q.ans;
}
function whyCrates(q, full){
  if(q.kind === 'crates'){
    if(!full) return tr('Третата се намира от двете, които вече знаеш заедно.',
      cratesUk[q.box[0]][2] ? 'Третю коробку знайдеш через перші дві — їх разом ти вже знаєш.'
                            : 'Третій ' + (q.box[0] === 'щайги' ? 'ящик' : 'кошик') + ' знайдеш через перші два — їх разом ти вже знаєш.');
    const steps = [tr('третата', cratesOrd(q, 2)) + ': ' + q.T + ' − ' + q.ab + ' = <b>' + q.c + '</b>',
                   tr('втората', cratesOrd(q, 1)) + ': ' + q.c + ' − ' + q.d + ' = <b>' + q.b + '</b>',
                   tr('първата', cratesOrd(q, 0)) + ': ' + q.ab + ' − ' + q.b + ' = <b>' + q.a + '</b>'];
    return steps.slice(0, q.asks === 2 ? 1 : q.asks === 1 ? 2 : 3).join(' &nbsp;→&nbsp; ');
  }
}
KIND.crates = { draw:drawCrates, eq:eqCrates, why:whyCrates };
