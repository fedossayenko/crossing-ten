// Question kind 'crates': level 47 Три щайги — A total, a part of it, and a gap between the rest.
import { KIND, SLOT, popAt, rnd, svgText, tr } from '../js/core.js';

const CRATES = [['щайги','щайга'], ['кутии','кутия'], ['кошници','кошница']];
const ORD = ['първата', 'втората', 'третата'];
// Ukrainian: locative plural, locative singular, feminine?
const cratesUk = {'щайги': ['ящиках', 'ящику', 0], 'кутии': ['коробках', 'коробці', 1], 'кошници': ['кошиках', 'кошику', 0]};
const cratesOrd = (q, i, loc) => (cratesUk[q.box[0]][2]
  ? (loc ? ['першій', 'другій', 'третій'] : ['перша', 'друга', 'третя'])
  : (loc ? ['першому', 'другому', 'третьому'] : ['перший', 'другий', 'третій']))[i];
// Задача 15: three amounts, a total, a total of two of them, and a gap between the other
// two. Peeled off one at a time, each step leaves one fewer unknown.
export function genCrates(){
  for(;;){
    const c = 4 + rnd(12), d = 1 + rnd(5), b = c - d, a = 2 + rnd(14);
    if(b < 1) continue;
    const asks = rnd(3);
    return {kind:'crates', box: CRATES[rnd(CRATES.length)], asks,
            T: a + b + c, ab: a + b, a, b, c, d, ans: [a, b, c][asks]};
  }
}

function drawCrates(q){
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
    '<div class="line lg">' + SLOT + ' <span class="unit">кг</span></div>';
}
function eqCrates(q){
  return tr(q.T + ' кг, първите две ' + q.ab + ', втората с ' + q.d +
    ' по-малко → ' + ORD[q.asks] + ' ',
    q.T + ' кг, перші ' + (cratesUk[q.box[0]][2] ? 'дві ' : 'два ') + q.ab + ', ' + cratesOrd(q, 1) + ' на ' + q.d +
    ' менше → ' + cratesOrd(q, q.asks) + ' ') + q.ans;
}
// The picture: the three boxes in a row, the total in a bracket over all three, the first two's total in a
// bracket over them, and an arrow from the third to the second marked with how much less it holds. The
// solution fills the boxes in the order they are found — the third, the second, the first — up to the one
// asked; the hint shows only the brackets, in words, and a ? on the third box.
function cratesSvg(q, full){
  const X = [22, 98, 174], two = tr('първите две', cratesUk[q.box[0]][2] ? 'перші дві' : 'перші два');
  const found = full ? [q.c, q.b, q.a].slice(0, 3 - q.asks) : [], hot = full ? q.asks : 2;
  const bracket = (x1, x2, y, label) => '<path d="M' + x1 + ',' + (y + 6) + ' v-6 H' + x2 + ' v6" stroke="var(--muted)" stroke-width="2" fill="none"/>' +
    svgText((x1 + x2) / 2, y - 5, label, 13, 'var(--muted)');
  let g = bracket(22, 238, 18, full ? q.T + ' кг' : tr('всичко', 'усього')) + bracket(22, 162, 44, full ? q.ab + ' кг' : two);
  X.forEach((x, i) => { g += '<rect x="' + x + '" y="56" width="64" height="40" rx="6" fill="' + (i === hot ? 'var(--warmbg)' : 'none') +
    '" stroke="' + (i === hot ? 'var(--warm)' : 'var(--muted)') + '" stroke-width="2"/>'; });
  if(!full) return svgWrap(g + svgText(206, 83, '?', 18, 'var(--warmink)'), 104);
  g += '<path d="M206,100 Q168,128 136,103" stroke="var(--accent)" stroke-width="2" fill="none"/><path d="M136,103 l9,1 m-9,-1 l3,8" stroke="var(--accent)" stroke-width="2" fill="none" stroke-linecap="round"/>' +
    svgText(168, 136, '− ' + q.d, 13, 'var(--accent)');
  found.forEach((v, k) => { const i = 2 - k; g += svgText(X[i] + 32, 83, v, 18, i === hot ? 'var(--warmink)' : 'var(--accent)', popAt(1 + k)); });
  const last = q.asks === 2 ? q.T + ' − ' + q.ab : q.asks === 1 ? q.c + ' − ' + q.d : q.ab + ' − ' + q.b;
  return svgWrap(g + svgText(130, 164, last + ' = ' + q.ans, 15, 'var(--ink)', popAt(4 - q.asks)), 172);
  function svgWrap(body, h){
    return '<svg viewBox="0 0 260 ' + h + '" style="display:block; width:300px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
      tr('трите ' + q.box[0], 'три ' + cratesUk[q.box[0]][0].replace(/ах$/, 'и')) + '">' + body + '</svg>';
  }
}
function whyCrates(q, full){
  if(!full) return tr('Третата се намира от двете, които вече знаеш заедно.',
    cratesUk[q.box[0]][2] ? 'Третю коробку знайдеш через перші дві — їх разом ти вже знаєш.'
                          : 'Третій ' + (q.box[0] === 'щайги' ? 'ящик' : 'кошик') + ' знайдеш через перші два — їх разом ти вже знаєш.') + cratesSvg(q, false);
  const steps = [tr('третата', cratesOrd(q, 2)) + ': ' + q.T + ' − ' + q.ab + ' = <b>' + q.c + '</b>',
                 tr('втората', cratesOrd(q, 1)) + ': ' + q.c + ' − ' + q.d + ' = <b>' + q.b + '</b>',
                 tr('първата', cratesOrd(q, 0)) + ': ' + q.ab + ' − ' + q.b + ' = <b>' + q.a + '</b>'];
  return steps.slice(0, q.asks === 2 ? 1 : q.asks === 1 ? 2 : 3).join(' &nbsp;→&nbsp; ') + cratesSvg(q, true);
}
KIND.crates = { draw:drawCrates, eq:eqCrates, why:whyCrates };
