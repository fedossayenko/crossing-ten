// Question kind 'scales': level 182 Везните — Two balances: swap the pears for apples, then share out the lemons.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Пролет 2022, 1 клас, задача 13: an apple and two pears weigh as much as eight lemons, and two pears
// as much as three apples. Put three apples in place of the two pears: four apples weigh eight lemons,
// 2 + 2 + 2 + 2 = 8, so one apple weighs two lemons.
function genScales(){
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
function drawScales(q){
  if(q.kind === 'scales'){
    return '<div class="ask">' + tr('Една ябълка и <span class="num">' + q.p + '</span> круши тежат общо колкото <span class="num">' + q.L + '</span> лимона. <span class="num">' + q.p +
      '</span> круши тежат колкото <span class="num">' + q.m + '</span> ябълки. Колко лимона тежи <b>1 ябълка</b>?',
      'Одне яблуко і <span class="num">' + ukN(q.p, 'груша', 'груші', 'груш').replace(' ', '</span> ') + ' разом важать стільки, скільки <span class="num">' + ukN(q.L, 'лимон', 'лимони', 'лимонів').replace(' ', '</span> ') +
      '. <span class="num">' + ukN(q.p, 'груша', 'груші', 'груш').replace(' ', '</span> ') + ' важать стільки, скільки <span class="num">' + ukN(q.m, 'яблуко', 'яблука', 'яблук').replace(' ', '</span> ') +
      '. Скільки лимонів важить <b>1 яблуко</b>?') + '</div>' + scalesFig(q) +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + SLOT + '</div>';
  }
}
function eqScales(q){
  if(q.kind === 'scales') return tr(q.p + ' круши = ' + q.m + ' ябълки → ' + (1 + q.m) + ' ябълки = ' + q.L + ' лимона → ', ukN(q.p, 'груша', 'груші', 'груш') + ' = ' + ukN(q.m, 'яблуко', 'яблука', 'яблук') + ' → ' +
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
  return '<svg viewBox="0 -6 240 96" style="display:block; width:260px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + tr('всяка ябълка с нейните лимони', 'кожне яблуко з його лимонами') + '">' + g + '</svg>';
}
function whyScales(q, full){
  if(q.kind === 'scales'){
    if(!full) return tr('Смени крушите на първата везна с ябълки — втората везна казва с колко ябълки.', 'Заміни груші на перших терезах яблуками — другі терези кажуть, скількома яблуками.');
    return tr(q.p + ' круши тежат колкото ' + q.m + ' ябълки &nbsp;→&nbsp; на първата везна вместо крушите слагаме ' + q.m + ' ябълки &nbsp;→&nbsp; <b>' + (1 + q.m) + ' ябълки</b> тежат колкото ' + q.L +
      ' лимона &nbsp;→&nbsp; всяка ябълка — по ' + q.a + (q.a === 1 ? ' лимон' : ' лимона'),
      ukN(q.p, 'груша', 'груші', 'груш') + ' важать стільки, скільки ' + ukN(q.m, 'яблуко', 'яблука', 'яблук') + ' &nbsp;→&nbsp; на перші терези замість груш кладемо ' + ukN(q.m, 'яблуко', 'яблука', 'яблук') +
      ' &nbsp;→&nbsp; <b>' + ukN(1 + q.m, 'яблуко', 'яблука', 'яблук') + '</b> важать стільки, скільки ' + ukN(q.L, 'лимон', 'лимони', 'лимонів') + ' &nbsp;→&nbsp; кожне яблуко — ' + ukN(q.a, 'лимон', 'лимони', 'лимонів')) +
      scalesSolSvg(q) + tr('1 ябълка = ', '1 яблуко = ') + q.ans;
  }
}
KIND.scales = { draw:drawScales, eq:eqScales, why:whyScales };
