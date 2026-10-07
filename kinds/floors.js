// Question kind 'floors': level 263 Етажите — A block of floors: so many times more above my floor than below it.

// МБГ Есен 2024, 3 клас, задача 16: a block of 9 floors, 3 times as many floors above ours as below it. Our own floor
// is neither above nor below, so the other 8 are one part below and 3 parts above, 4 parts: 8 : 4 = 2 floors below
// us, and we live on the 3rd. Sometimes it is below that has so many times more.
import { KIND, SLOT, popAt, rnd, svgText, tr, ukN } from '../js/core.js';
export function genFloors(){
  for(;;){
    const k = 2 + rnd(4), x = 1 + rnd(6), N = x*(k + 1) + 1, below = Math.random() < 0.3;
    if(N > 21) continue;
    // x: the one part; below: the floors under ours are the k parts
    const ans = below ? k*x + 1 : x + 1;
    return {kind:'floors', k, x, N, below, traps: [ans - 1, N - ans].filter(v => v !== ans), ans};
  }
}
const floorsUk = n => ukN(n, 'поверх', 'поверхи', 'поверхів'), floorsParts = n => ukN(n, 'частина', 'частини', 'частин');
function drawFloors(q){
  const [up, down] = q.below ? [tr('Под', 'Під'), tr('над', 'над')] : [tr('Над', 'Над'), tr('под', 'під')];
  return '<div class="ask">' + tr('Аз живея в блок на <span class="num">' + q.N + '</span> етажа. ' + up + ' нашия етаж има <span class="num">' + q.k +
      '</span> пъти повече етажи, отколкото ' + down + ' нашия етаж. <b>На кой етаж живея аз?</b>',
    'Я живу в будинку на <span class="num">' + floorsUk(q.N).replace(' ', '</span> ') + '. ' + up + ' нашим поверхом у <span class="num">' + ukN(q.k, 'раз', 'рази', 'разів').replace(' ', '</span> ') +
      ' більше поверхів, ніж ' + down + ' нашим поверхом. <b>На якому поверсі я живу?</b>') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqFloors(q){
  return q.N + ' − 1 = ' + (q.N - 1) + ', ' + (q.N - 1) + ' : ' + (q.k + 1) + ' = ' + q.x + ', ' + (q.below ? q.x + ' · ' + q.k + ' = ' + q.k*q.x + ', ' + q.k*q.x : q.x) + ' + 1 = ' + q.ans;
}
// the block: the floors under ours, ours, and the ones above it, the k-part side a darker colour; no numbers on it,
// so the worked line still ends on the floor
function floorsSvg(q){
  const h = 13, W = 70, top = 6, under = q.ans - 1;
  let g = '';
  for(let f = 1; f <= q.N; f++){
    const y = top + (q.N - f)*h, mine = f === q.ans, isUnder = f < q.ans, many = q.below ? isUnder : f > q.ans;
    const fill = mine ? 'var(--warm)' : many ? 'var(--accentbg)' : 'var(--goodbg)', stroke = mine ? 'var(--warmink)' : many ? 'var(--accent)' : 'var(--good)';
    g += '<rect' + popAt(1 + f*0.15) + ' x="40" y="' + y + '" width="' + W + '" height="' + (h - 2) + '" rx="2" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.4"/>';
  }
  const yMine = top + (q.N - q.ans)*h, brace = (y0, y1, label, col) => '<path d="M118,' + y0 + ' h5 v' + (y1 - y0) + ' h-5" fill="none" stroke="' + col + '" stroke-width="1.6"/>' +
    svgText(168, (y0 + y1)/2 + 4, label, 11, col);
  g += svgText(22, yMine + 9, tr('аз', 'я'), 11, 'var(--warmink)');
  if(q.N - q.ans) g += brace(top + 1, yMine - 2, q.below ? tr('1 част', '1 частина') : tr(q.k + ' части', floorsParts(q.k)), q.below ? 'var(--good)' : 'var(--accent)');
  if(under) g += brace(yMine + h + 1, top + q.N*h - 2, q.below ? tr(q.k + ' части', floorsParts(q.k)) : tr('1 част', '1 частина'), q.below ? 'var(--accent)' : 'var(--good)');
  const H = top + q.N*h + 6;
  return '<svg viewBox="0 0 214 ' + H + '" style="display:block; width:' + Math.min(250, Math.round(214*230/H)) + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('етажите на блока', 'поверхи будинку') + '">' + g + '</svg>';
}
function whyFloors(q, full){
  if(!full) return tr('Нашият етаж не се брои нито в етажите над нас, нито в тези под нас. Другите етажи са една част от едната страна и няколко такива части от другата.',
                      'Наш поверх не рахується ні серед поверхів над нами, ні серед тих, що під нами. Інші поверхи — це одна частина з одного боку і кілька таких частин з іншого.');
  const parts = tr('без нашия етаж: ', 'без нашого поверху: ') + q.N + ' − 1 = ' + (q.N - 1) + tr(' етажа — ', ' ' + floorsUk(q.N - 1).replace(/^\d+ /, '') + ' — ') + '1 + ' + q.k + ' = ' + tr((q.k + 1) + ' части', floorsParts(q.k + 1)) +
    ' &nbsp;→&nbsp; ' + (q.N - 1) + ' : ' + (q.k + 1) + ' = ' + q.x;
  return floorsSvg(q) + parts + (q.below ? tr(' над нас, ', ' над нами, ') + q.x + ' · ' + q.k + ' = <b>' + q.k*q.x + '</b>' + tr(' под нас', ' під нами') : tr(' под нас', ' під нами')) +
    ' &nbsp;→&nbsp; ' + tr('живея на ', 'живу на ') + (q.below ? q.k*q.x : q.x) + ' + 1 = ' + q.ans;
}
KIND.floors = { draw:drawFloors, eq:eqFloors, why:whyFloors };
