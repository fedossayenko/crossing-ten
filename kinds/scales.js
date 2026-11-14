// Question kind 'scales': level 182 Везните — Two balances: swap the pears for apples, then share out the lemons.

// МБГ Пролет 2022, 1 клас, задача 13: an apple and two pears weigh as much as eight lemons, and two pears
// as much as three apples. Put three apples in place of the two pears: four apples weigh eight lemons,
// 2 + 2 + 2 + 2 = 8, so one apple weighs two lemons.
import { KIND, SVG_FONT, answerLine, fruitBody, popAt, rnd, svgFrame, svgText, tr, ukN } from '../js/core.js';
export function genScales(){
  for(;;){
    const p = 2 + rnd(2), m = 2 + rnd(3), a = 1 + rnd(3), L = (1 + m)*a;   // p pears = m apples, an apple = a lemons
    if(m === p || L > 12) continue;
    return {kind:'scales', a, m, p, L, traps:[L - m, m], ans: a};
  }
}
// a balance: a stand, a level beam and two pans with their loads drawn as fruit standing in rows
function scalesSvg(left, right, label, extra){
  const row = (items, cx, y) => { let g = ''; const per = 4, rows = [];
    for(let i = 0; i < items.length; i += per) rows.push(items.slice(i, i + per));
    rows.reverse().forEach((r, j) => r.forEach((t, i) => { g += '<g transform="translate(' + (cx + (i - (r.length - 1) / 2) * 17).toFixed(1) + ' ' + (y - 9 - j * 15) + ') scale(0.85)">' + fruitBody(t) + '</g>'; }));
    return g; };
  const pan = cx => '<path d="M' + (cx - 38) + ',66 Q' + cx + ',80 ' + (cx + 38) + ',66 Z" fill="var(--warmbg)" stroke="var(--ink)" stroke-width="1.6"/>';
  return '<svg viewBox="0 -14 240 ' + (110 + (extra ? 20 : 0)) + '" style="display:inline-block; width:270px; max-width:100%; margin:2px 4px" role="img" aria-label="' + label + '">' +
    '<path d="M120,66 V92 M96,92 H144" stroke="var(--ink)" stroke-width="2.4" fill="none"/><path d="M42,62 H198" stroke="var(--ink)" stroke-width="2.4"/>' +
    '<circle cx="120" cy="62" r="3.4" fill="var(--ink)"/>' + pan(62) + pan(178) + row(left, 62, 64) + row(right, 178, 64) + (extra || '') + '</svg>';
}
const scalesFig = q => '<div class="fig">' + scalesSvg(['a'].concat(Array(q.p).fill('p')), Array(q.L).fill('l'), tr('първата везна', 'перші терези')) +
  scalesSvg(Array(q.p).fill('p'), Array(q.m).fill('a'), tr('втората везна', 'другі терези')) + '</div>';
// Салабашев 2020, задача 15 (shape 'pans', level 514): three balances with a cat, a rabbit and chicks on one pan and a weight on the other, and a
// fourth with only animals: how many kilograms balance it. Cat + a chicks = W1, cat + rabbit = W2, rabbit + b chicks = W3; the last pan holds
// p chicks and q rabbits. Every weight is whole here (the printed one has a chick of half a kilogram: 3 + 1 = 4, 3 + 2 = 5, 2 + 2 = 4, 1 + 4 = 5).
// The rabbit weighs d kilograms more than a chicks (W2 − W1), so a + b chicks and d kilograms make W3.
export function genScalesPans(){
  for(;;){
    const a = 1 + rnd(3), b = 1 + rnd(4), c = 1 + rnd(2), d = 1 + rnd(2), r = a*c + d, k = 1 + rnd(5), p = 1 + rnd(3), q = 1 + rnd(2);
    const W = [k + a*c, k + r, r + b*c];
    if(Math.max(...W) > 14 || p*c + q*r > 20) continue;
    return {kind:'scales', shape:'pans', a, b, p, q, c, d, r, k, W, ans: p*c + q*r};
  }
}
const ANIMAL = { cat:'🐱', rabbit:'🐰', chick:'🐤' };
/** one balance: animals [[kind, n], …] on the left pan, a weight (or nothing) on the right; tilted when it is the unknown one */
function panBalance(items, kg, tilt, i){
  const yl = tilt ? 76 : 66, yr = tilt ? 56 : 66;
  let g = '<path d="M120,66 L108,104 H132 Z" fill="var(--muted)" stroke="var(--ink)" stroke-width="1.4"/><line x1="40" y1="' + yl + '" x2="200" y2="' + yr + '" stroke="var(--ink)" stroke-width="3" stroke-linecap="round"/><circle cx="120" cy="66" r="4" fill="var(--ink)"/>';
  const pan = (cx, y) => '<path d="M' + (cx - 40) + ',' + (y + 2) + ' Q' + cx + ',' + (y + 22) + ' ' + (cx + 40) + ',' + (y + 2) + ' Z" fill="var(--warmbg)" stroke="var(--ink)" stroke-width="1.6"/>';
  g += pan(50, yl) + pan(190, yr);
  const flat = items.flatMap(([k, n]) => Array(n).fill(k)), per = 5, step = 15;
  flat.forEach((k, i) => { const row = Math.floor(i / per), col = i % per, inRow = Math.min(per, flat.length - row*per), x = 50 + (col - (inRow - 1) / 2)*step;
    g += '<text x="' + x.toFixed(1) + '" y="' + (yl - 2 - row*19) + '" text-anchor="middle" font-size="18" ' + SVG_FONT + '>' + ANIMAL[k] + '</text>'; });
  if(kg !== null) g += '<rect x="174" y="' + (yr - 24) + '" width="32" height="24" rx="2" fill="color-mix(in srgb, var(--coal) 18%, var(--paper))" stroke="var(--ink)" stroke-width="1.4"/><text x="190" y="' + (yr - 7) + '" text-anchor="middle" font-size="12" font-weight="800" fill="var(--coal)" ' + SVG_FONT + '>' + kg + ' кг</text>';
  else g += svgText(190, yr - 8, '?', 22, 'var(--accent)');
  return '<g class="bal" transform="translate(0 ' + (i*84 - 22) + ')">' + g + '</g>';
}
const panFig = q => svgFrame('0 0 240 336', 290, tr('четири везни: три в равновесие и последната без тежест', 'четверо терезів: троє в рівновазі й останні без гирі')) +
  panBalance([['cat', 1], ['chick', q.a]], q.W[0], false, 0) + panBalance([['cat', 1], ['rabbit', 1]], q.W[1], false, 1) +
  panBalance([['rabbit', 1], ['chick', q.b]], q.W[2], false, 2) + panBalance([['chick', q.p], ['rabbit', q.q]], null, true, 3) + '</svg>';
function drawPans(q){
  return '<div class="ask">' + tr('Животните от един вид тежат еднакво. Колко <b>килограма</b> трябва да се сложат на последната везна, за да е в равновесие?', 'Тварини одного виду важать однаково. Скільки <b>кілограмів</b> треба покласти на останні терези, щоб вони були в рівновазі?') + '</div>' + panFig(q) + answerLine('lg');
}
const sum = (n, v) => Array(n).fill(v).join(' + ');
function whyPans(q, full){
  if(!full) return tr('Котката е на първата и на втората везна. Сравни ги: с колко килограма зайчето тежи повече от пилетата? После сложи това на третата везна.', 'Кішка є на перших і на других терезах. Порівняй їх: на скільки кілограмів кролик важить більше за курчат? Потім поклади це на треті терези.');
  const d = q.W[1] - q.W[0], X = q.W[2] - d, n = q.a + q.b;
  return tr('котката е на двете везни: зайчето е с ' + d + ' кг по-тежко от ' + q.a + (q.a === 1 ? ' пиле' : ' пилета') + ' &nbsp;→&nbsp; на третата везна ' + n + (n === 1 ? ' пиле' : ' пилета') + ' и ' + d + ' кг тежат ' + q.W[2] + ' кг &nbsp;→&nbsp; ' + n +
    ' пилета тежат ' + X + ' кг: ' + sum(n, q.c) + ' = ' + X + ', едно пиле — ' + q.c + ' кг &nbsp;→&nbsp; зайче: ' + sum(q.a, q.c) + ' + ' + d + ' = ' + q.r + ' кг &nbsp;→&nbsp; ' + [].concat(Array(q.p).fill(q.c), Array(q.q).fill(q.r)).join(' + ') + ' = ',
    'кішка на обох терезах: кролик на ' + d + ' кг важчий за ' + ukN(q.a, 'курча', 'курчати', 'курчат') + ' &nbsp;→&nbsp; на третіх терезах ' + ukN(n, 'курча', 'курчати', 'курчат') + ' і ' + d + ' кг важать ' + q.W[2] + ' кг &nbsp;→&nbsp; ' + ukN(n, 'курча', 'курчати', 'курчат') +
    ' важать ' + X + ' кг: ' + sum(n, q.c) + ' = ' + X + ', одне курча — ' + q.c + ' кг &nbsp;→&nbsp; кролик: ' + sum(q.a, q.c) + ' + ' + d + ' = ' + q.r + ' кг &nbsp;→&nbsp; ' + [].concat(Array(q.p).fill(q.c), Array(q.q).fill(q.r)).join(' + ') + ' = ') + q.ans;
}
function drawScales(q){
  if(q.shape === 'pans') return drawPans(q);
  return '<div class="ask">' + tr('Една ябълка и <span class="num">' + q.p + '</span> круши тежат общо колкото <span class="num">' + q.L + '</span> лимона. <span class="num">' + q.p +
    '</span> круши тежат колкото <span class="num">' + q.m + '</span> ябълки. Колко лимона тежи <b>1 ябълка</b>?',
    'Одне яблуко і <span class="num">' + ukN(q.p, 'груша', 'груші', 'груш').replace(' ', '</span> ') + ' разом важать стільки, скільки <span class="num">' + ukN(q.L, 'лимон', 'лимони', 'лимонів').replace(' ', '</span> ') +
    '. <span class="num">' + ukN(q.p, 'груша', 'груші', 'груш').replace(' ', '</span> ') + ' важать стільки, скільки <span class="num">' + ukN(q.m, 'яблуко', 'яблука', 'яблук').replace(' ', '</span> ') +
    '. Скільки лимонів важить <b>1 яблуко</b>?') + '</div>' + scalesFig(q) +
    answerLine('lg');
}
function eqScales(q){
  if(q.shape === 'pans') return [].concat(Array(q.p).fill(q.c), Array(q.q).fill(q.r)).join(' + ') + ' = ' + q.ans;
  return tr(q.p + ' круши = ' + q.m + ' ябълки → ' + (1 + q.m) + ' ябълки = ' + q.L + ' лимона → ', ukN(q.p, 'груша', 'груші', 'груш') + ' = ' + ukN(q.m, 'яблуко', 'яблука', 'яблук') + ' → ' +
    ukN(1 + q.m, 'яблуко', 'яблука', 'яблук') + ' = ' + ukN(q.L, 'лимон', 'лимони', 'лимонів') + ' → ') + q.ans;
}
// The picture: the first balance again with the pears swapped for apples, and the lemons in groups, one under each apple.
function scalesSolSvg(q){
  let g = '';
  const n = 1 + q.m, w = 220 / n;
  for(let i = 0; i < n; i++){
    const cx = 10 + w * (i + 0.5);
    g += '<g' + popAt(1 + i) + '><g transform="translate(' + cx.toFixed(1) + ' 10)">' + fruitBody('a') + '</g>' +
      Array.from({length: q.a}, (_, j) => '<g transform="translate(' + (cx + (j - (q.a - 1) / 2) * 15).toFixed(1) + ' 44) scale(0.85)">' + fruitBody('l') + '</g>').join('') +
      '<path d="M' + (cx - w / 2 + 4).toFixed(1) + ',58 H' + (cx + w / 2 - 4).toFixed(1) + '" stroke="var(--warm)" stroke-width="2"/></g>';
  }
  g += svgText(120, 82, Array(n).fill(q.a).join(' + ') + ' = ' + q.L, 15, 'var(--ink)', popAt(n + 2));
  return svgFrame('0 -6 240 96', 260, tr('всяка ябълка с нейните лимони', 'кожне яблуко з його лимонами')) + g + '</svg>';
}
function whyScales(q, full){
  if(q.shape === 'pans') return whyPans(q, full);
  if(!full) return tr('Смени крушите на първата везна с ябълки — втората везна казва с колко ябълки.', 'Заміни груші на перших терезах яблуками — другі терези кажуть, скількома яблуками.');
  return tr(q.p + ' круши тежат колкото ' + q.m + ' ябълки &nbsp;→&nbsp; на първата везна вместо крушите слагаме ' + q.m + ' ябълки &nbsp;→&nbsp; <b>' + (1 + q.m) + ' ябълки</b> тежат колкото ' + q.L +
    ' лимона &nbsp;→&nbsp; всяка ябълка — по ' + q.a + (q.a === 1 ? ' лимон' : ' лимона'),
    ukN(q.p, 'груша', 'груші', 'груш') + ' важать стільки, скільки ' + ukN(q.m, 'яблуко', 'яблука', 'яблук') + ' &nbsp;→&nbsp; на перші терези замість груш кладемо ' + ukN(q.m, 'яблуко', 'яблука', 'яблук') +
    ' &nbsp;→&nbsp; <b>' + ukN(1 + q.m, 'яблуко', 'яблука', 'яблук') + '</b> важать стільки, скільки ' + ukN(q.L, 'лимон', 'лимони', 'лимонів') + ' &nbsp;→&nbsp; кожне яблуко — ' + ukN(q.a, 'лимон', 'лимони', 'лимонів')) +
    scalesSolSvg(q) + tr('1 ябълка = ', '1 яблуко = ') + q.ans;
}
KIND.scales = { draw:drawScales, eq:eqScales, why:whyScales };
