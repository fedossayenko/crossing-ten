// Question kind 'sumdiff': level 17 Сбор и разлика — A number given by how far it sits from another.

// Задача 10: each letter sits a given distance from the same number, on either side of
// it. Sending them opposite ways opens the widest gap — the two distances added.
import { KIND, SLOT, lineSvg, popAt, rnd, svgText, tr } from '../js/core.js';
function genGap(){
  const c = 10 + rnd(30);
  const d1 = 1 + rnd(8);
  let d2 = 1 + rnd(8);
  while(d2 === d1) d2 = 1 + rnd(8);            // equal distances would make the two letters interchangeable
  return {kind:'sumdiff', shape:'gap', c, d1, d2, ans: d1 + d2};
}
// Зима 2020: two numbers add to 25, one is 9 bigger — the bigger is 17. Take the 9 off, share
// what is left equally (8 each), then put the 9 back on one.
function genSumAndDiff(){
  for(;;){
    const small = 2 + rnd(30), d = 1 + rnd(20), big = small + d, S = small + big;
    if(S > 99) continue;
    const asksBig = Math.random() < 0.65;
    return {kind:'sumdiff', shape:'sd', S, d, small, big, asksBig, ans: asksBig ? big : small};
  }
}
// МБГ Полуфинал 2024, 1 клас, задача 17: two numbers on the board; Иван added them and got 20, Петър took the
// smaller from the larger and got 4 — which is the larger? Pairs that make 20, from two equal halves out:
// 10 + 10 differ by 0, 11 + 9 by 2, 12 + 8 by 4 — so 12. Sometimes the smaller is asked.
// Полуфинал 2023, задача 17, asks it plainly, without the board: the difference of two numbers is 12 and their sum
// 22 — which is the larger? 17 (17 − 5 = 12, 17 + 5 = 22). The plain wording is drawn after the question is built.
// the bigger numbers (a sum up to 22, a difference up to 12) and the plain wording are drawn after the old
// question, so a seed recorded before them still asks what it asked
export function genSumBoard(){
  let q = sumBoard(9, 10, 20);
  if(Math.random() < 0.2) q = sumBoard(10, 12, 22, true);
  return Math.random() < 0.3 ? Object.assign(q, {plain: true}) : q;
}
function sumBoard(sm, dm, top, wide){
  for(;;){
    const small = 1 + rnd(sm), d = 1 + rnd(dm), big = small + d, S = small + big;
    if(S > top || (wide && S <= 20 && d <= 10)) continue;
    const asksBig = Math.random() < 0.7, ans = asksBig ? big : small;
    return {kind:'sumdiff', shape:'board', S, d, small, big, asksBig, traps: (S % 2 ? [S - d] : [S / 2, S - d]).filter(v => v !== ans), ans};
  }
}
// Level 289. Аз и числата 2024, задача 8: «Маймунката Мунка те пита кои две числа имат сбор 12 и разлика 4» — both
// of them, 8 and 4. Take the difference off the sum and two equal halves are left: 12 − 4 = 8, 8 : 2 = 4, and
// 4 + 4 = 8. Level 216 asks one of the two in the 1st grade; here both, with sums up to 60.
export function genSumDiffPair(){
  for(;;){
    const small = 1 + rnd(25), d = 1 + rnd(20), big = small + d, S = small + big;
    if(S > 60) continue;
    return {kind:'sumdiff', shape:'two', S, d, small, big, slots:2, stated:true, ans: big, alt:[small]};
  }
}
export function genSumDiff(){
  if(Math.random() < 0.2) return genSumAndDiff();
  if(Math.random() < 0.4) return genGap();
  const d = 1 + rnd(6);
  const a = d + rnd(9);          // the smaller number stays at or above zero, so both sums exist
  return {kind:'sumdiff', a, d, slots:2, stated:true, ans: 2*a + d, alt:[2*a - d]};
}

function drawSumdiff(q){
  if(q.shape === 'two'){
    return '<div class="ask">' + tr('Маймунката Мунка те пита кои две числа имат <b>сбор</b> <span class="num">' + q.S + '</span> и <b>разлика</b> <span class="num">' + q.d + '</span>. Запиши ги.',
      'Мавпочка Мунка питає тебе, які два числа мають <b>суму</b> <span class="num">' + q.S + '</span> і <b>різницю</b> <span class="num">' + q.d + '</span>. Напиши їх.') + '</div>' +
      '<div class="line md"><span class="or">' + tr('Числата са', 'Числа:') + '</span> ' + SLOT + ' <span class="or">' + tr('и', 'і') + '</span> <span class="slot" id="slot1"></span></div>';
  }
  if(q.shape === 'board' && q.plain){
    return '<div class="ask">' + tr('Разликата на две числа е <span class="num">' + q.d + '</span>, а сборът им е <span class="num">' + q.S + '</span>. Кое е <b>' + (q.asksBig ? 'по-голямото' : 'по-малкото') + '</b> число?',
      'Різниця двох чисел дорівнює <span class="num">' + q.d + '</span>, а їхня сума — <span class="num">' + q.S + '</span>. Яке з цих чисел <b>' + (q.asksBig ? 'більше' : 'менше') + '</b>?') + '</div>' +
      '<div class="line xl">' + SLOT + '</div>';
  }
  if(q.shape === 'board'){
    return '<div class="ask">' + tr('На дъската са написани две числа. Иван ги събрал и получил <span class="num">' + q.S + '</span>. Петър извадил по-малкото от по-голямото и получил <span class="num">' + q.d + '</span>. Кое е <b>' + (q.asksBig ? 'по-голямото' : 'по-малкото') + '</b> число?',
      'На дошці записано два числа. Іван їх додав і отримав <span class="num">' + q.S + '</span>. Петро відняв від більшого менше й отримав <span class="num">' + q.d + '</span>. Яке з цих чисел <b>' + (q.asksBig ? 'більше' : 'менше') + '</b>?') + '</div>' +
      '<div class="line xl">' + SLOT + '</div>';
  }
  if(q.shape === 'sd'){
    return '<div class="ask">' + tr('Сборът на две числа, едно от които е с <span class="num">' + q.d + '</span> по-голямо от другото, е <span class="num">' + q.S + '</span>. Кое е <b>' + (q.asksBig ? 'по-голямото' : 'по-малкото') + '</b> число?',
      'Сума двох чисел, одне з яких на <span class="num">' + q.d + '</span> більше за інше, дорівнює <span class="num">' + q.S + '</span>. Яке число <b>' + (q.asksBig ? 'більше' : 'менше') + '</b>?') + '</div>' +
      '<div class="line xl">' + SLOT + '</div>';
  }
  if(q.shape === 'gap'){
    return '<div class="ask">' + tr('Разликата на числото <b>A</b> и <span class="num">' + q.c +
      '</span> е <span class="num">' + q.d1 + '</span>. Разликата на числото <b>B</b> и <span class="num">' +
      q.c + '</span> е <span class="num">' + q.d2 +
      '</span>. Колко е <b>най-голямата възможна</b> разлика на числата A и B?',
      'Різниця числа <b>A</b> і <span class="num">' + q.c +
      '</span> дорівнює <span class="num">' + q.d1 + '</span>. Різниця числа <b>B</b> і <span class="num">' +
      q.c + '</span> дорівнює <span class="num">' + q.d2 +
      '</span>. Якою може бути <b>найбільша</b> різниця чисел A і B?') + '</div>' +
      '<div class="line xl">' + SLOT + '</div>';
  }
  return '<div class="ask">' + tr('Пресметнете <b>двата възможни сбора</b> на две числа, едно от които е <span class="num">' +
    q.a + '</span>, ако разликата им е <span class="num">' + q.d + '</span>.',
    'Обчисліть <b>обидві можливі суми</b> двох чисел, одне з яких дорівнює <span class="num">' +
    q.a + '</span>, якщо їхня різниця дорівнює <span class="num">' + q.d + '</span>.') + '</div>' +
    '<div class="line md">' + SLOT +
    ' <span class="or">' + tr('или', 'або') + '</span> <span class="slot" id="slot1"></span></div>';
}
function eqSumdiff(q){
  if(q.shape === 'two') return q.small + ' + ' + q.big + ' = ' + q.S + ', ' + q.big + ' − ' + q.small + ' = ' + q.d + ' → ' + q.small + tr(' и ', ' і ') + q.big;
  if(q.shape === 'board') return q.small + ' + ' + q.big + ' = ' + q.S + ', ' + q.big + ' − ' + q.small + ' = ' + q.d + ' → ' + q.ans;
  if(q.shape === 'sd') return q.S + ' − ' + q.d + ' = ' + q.small + ' + ' + q.small + (q.asksBig ? ', ' + q.small + ' + ' + q.d + ' = ' + q.big : '') + ' → ' + q.ans;
  if(q.shape === 'gap') return 'A на ' + q.d1 + ', B на ' + q.d2 + tr(' от ', ' від ') + q.c + ' → ' + q.ans;
  return q.a + tr(' и разлика ', ' і різниця ') + q.d + ' → ' + (2*q.a - q.d) + tr(' и ', ' і ') + q.ans;
}
// The pictures. Two sums: the number, and the other one a step of the difference to its left or to
// its right. The widest gap: A and B each on either side of the number, and the widest pair across it.
// A sum and a difference: two bars, the longer one longer by the difference — take that off, and what
// is left is two equal halves.
// The widest gap, a line for each: A as far from the number on one side as on the other, every point with its
// number over it; then B; then A and B sent opposite ways, and how far apart that puts them. A point keeps at least
// 28 px from the middle, so a number over it never runs into the middle one.
function gapSvg(q){
  const A = 'var(--warm)', B = 'var(--accent)', M = 132, k = 90 / Math.max(q.d1, q.d2), f = v => v.toFixed(1);
  const X = d => M + Math.sign(d) * Math.max(28, Math.abs(d) * k);
  const row = (y, pts, name, st) => '<g' + popAt(st) + '>' + svgText(14, y + 5, name, 14, 'var(--ink)') +
    '<line x1="30" y1="' + y + '" x2="234" y2="' + y + '" stroke="var(--line)" stroke-width="2"/>' +
    pts.map(([d, col]) => '<line x1="' + M + '" y1="' + y + '" x2="' + f(X(d)) + '" y2="' + y + '" stroke="' + col + '" stroke-width="4" stroke-linecap="round"/>' +
      svgText(f((M + X(d)) / 2), y + 18, Math.abs(d), 12, col) + '<circle cx="' + f(X(d)) + '" cy="' + y + '" r="5" fill="' + col + '"/>' +
      svgText(f(X(d)), y - 10, q.c + d, 13, col)).join('') +
    '<circle cx="' + M + '" cy="' + y + '" r="4" fill="var(--ink)"/>' + svgText(M, y - 10, q.c, 13, 'var(--ink)') + '</g>';
  const x1 = f(X(-q.d1)), x2 = f(X(q.d2));
  const g = row(0, [[-q.d1, A], [q.d1, A]], '<tspan fill="' + A + '">A</tspan>', 1) +
    row(52, [[-q.d2, B], [q.d2, B]], '<tspan fill="' + B + '">B</tspan>', 2) +
    row(104, [[-q.d1, A], [q.d2, B]], '<tspan fill="' + A + '">A</tspan> <tspan fill="' + B + '">B</tspan>', 3.5) +
    '<g' + popAt(4.5) + '><path d="M' + x1 + ',127 v10 M' + x1 + ',132 H' + x2 + ' M' + x2 + ',127 v10" stroke="var(--ink)" stroke-width="2.5" fill="none"/>' +
    svgText(f((+x1 + +x2) / 2), 150, q.d1 + ' + ' + q.d2 + ' = ' + q.ans, 14, 'var(--ink)') + '</g>';
  return '<svg viewBox="0 -28 240 186" style="display:block; width:260px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('A и B около ', 'A і B навколо ') + q.c + '">' + g + '</svg>';
}
function sumdiffSvg(q){
  if(q.shape === 'sd' || q.shape === 'board' || q.shape === 'two'){
    const u = 180 / q.big, half = q.small * u;
    let g = '';
    [[0, q.small, 0], [30, q.big, 1]].forEach(([y, v, i]) => { g += '<rect' + popAt(1 + i) + ' x="40" y="' + y + '" width="' + (v * u).toFixed(1) + '" height="20" rx="5" fill="none" stroke="var(--accent)" stroke-width="2"/>'; });
    g += svgText(20, 15, tr('по-м.', 'менше'), 10, 'var(--accent)') + svgText(20, 45, tr('по-г.', 'більше'), 10, 'var(--accent)');
    g += '<g' + popAt(3) + '><rect x="' + (40 + half).toFixed(1) + '" y="30" width="' + (q.d * u).toFixed(1) + '" height="20" rx="5" fill="var(--warmbg)" stroke="var(--warm)" stroke-width="2"/>' +
      svgText((40 + half + q.d * u / 2).toFixed(1), 45, q.d, 12, 'var(--warm)') + '</g>';
    g += '<g' + popAt(4) + '><path d="M' + (40 + half + q.d * u + 8).toFixed(1) + ',0 h5 v50 h-5" stroke="var(--ink)" stroke-width="1.6" fill="none"/>' + svgText((40 + half + q.d * u + 26).toFixed(1), 30, q.S, 13, 'var(--ink)') + '</g>';
    g += '<g' + popAt(5) + '>' + svgText((40 + half / 2).toFixed(1), 15, q.small, 13, 'var(--accent)') + svgText((40 + half / 2).toFixed(1), 45, q.small, 13, 'var(--accent)') + '</g>';
    const foot = q.asksBig || q.shape === 'two' ? q.small + ' + ' + q.d + ' = ' + q.big : q.shape === 'board' ? q.big + ' − ' + q.d + ' = ' + q.small : (q.S - q.d) + ' = ' + q.small + ' + ' + q.small;
    g += svgText(130, 78, foot, 15, 'var(--ink)', popAt(6));
    return '<svg viewBox="0 -8 272 96" style="display:block; width:326px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + tr('двете числа като ленти', 'два числа як смужки') + '">' + g + '</svg>';
  }
  if(q.shape === 'gap') return gapSvg(q);
  const lo = q.a - q.d, hi = q.a + q.d;
  return lineSvg([{at:q.a, name:String(q.a), step:0}, {at:lo, name:String(lo), col:'var(--warm)', step:1.5}, {at:hi, name:String(hi), col:'var(--accent)', step:2.5}],
    [{from:lo, to:q.a, label:q.d, row:1, col:'var(--warm)', step:1}, {from:q.a, to:hi, label:q.d, row:1, col:'var(--accent)', step:2}],
    lo - 1, hi + 1, tr('другото число от двете страни', 'інше число з обох боків'));
}
function whySumdiff(q, full){
  if(q.shape === 'two'){
    if(!full) return tr('Махни разликата от сбора — остават две равни части.', 'Прибери різницю із суми — лишаються дві рівні частини.');
    return q.S + ' − ' + q.d + ' = ' + (q.S - q.d) + ' = <b>' + q.small + '</b> + ' + q.small + ' &nbsp;→&nbsp; ' + q.small + ' + ' + q.d + ' = <b>' + q.big + '</b>' + sumdiffSvg(q);
  }
  if(q.shape === 'board'){
    if(!full) return tr('Опитай две числа с този сбор, като започнеш от две равни половини. Каква е разликата им?',
      'Спробуй два числа з такою сумою, починаючи з двох рівних половин. Яка між ними різниця?');
    const tries = [];
    for(let b = Math.ceil(q.S / 2); b <= q.big; b++) tries.push(b + ' + ' + (q.S - b) + ' (' + tr('разлика ', 'різниця ') + (b === q.big ? '<b>' + (2*b - q.S) + '</b>' : 2*b - q.S) + ')');
    return tries.join(', ') + ' &nbsp;→&nbsp; ' + (q.asksBig ? tr('по-голямото е ', 'більше — ') : tr('по-малкото е ', 'менше — ')) + q.ans + sumdiffSvg(q);
  }
  if(q.shape === 'sd'){
    if(!full) return tr('Махни разликата — остават две равни части.', 'Прибери різницю — лишаються дві рівні частини.');
    return q.S + ' − ' + q.d + ' = ' + (q.S - q.d) + ' = <b>' + q.small + '</b> + ' + q.small + (q.asksBig ? ' &nbsp;→&nbsp; ' + q.small + ' + ' + q.d + ' = ' + q.big : '') + ' &nbsp;→&nbsp; ' + q.ans + sumdiffSvg(q);
  }
  if(q.shape === 'gap'){
    if(!full) return tr('Всяко от двете може да е от едната или от другата страна.',
      'Кожне з двох чисел може бути як з одного, так і з іншого боку.');
    return 'A ' + tr('е ', '— ') + (q.c - q.d1) + tr(' или ', ' або ') + (q.c + q.d1) + ', B ' + tr('е ', '— ') +
      (q.c - q.d2) + tr(' или ', ' або ') + (q.c + q.d2) + sumdiffSvg(q) +
      tr('най-далече са <b>', 'найдалі одне від одного <b>') + (q.c - q.d1) +
      tr('</b> и <b>', '</b> і <b>') + (q.c + q.d2) + '</b> &nbsp;→&nbsp; ' +
      (q.c + q.d2) + ' − ' + (q.c - q.d1) + ' = ' + q.ans;
  }
  if(!full) return tr('Другото число може да е по-малко или по-голямо — намери и двата сбора.',
    'Інше число може бути меншим або більшим — знайди обидві суми.');
  return tr('другото е <b>', 'інше — <b>') + (q.a - q.d) + tr('</b> или <b>', '</b> або <b>') + (q.a + q.d) + '</b>' + sumdiffSvg(q) +
    tr('въпросът е за сборовете: ', 'питають про суми: ') + q.a + ' + ' + (q.a - q.d) + ' = ' + (2*q.a - q.d) + ', &nbsp;' + q.a + ' + ' + (q.a + q.d) +
    ' = ' + q.ans;
}
// the other number, both ways (her «11 · 3» for 10 and 18 on 2026-10-18): the question asks for the sums
function slipSumdiff(q, parts){
  if(q.shape || parts.length !== 2) return null;
  const v = parts.map(Number).sort((x, y) => x - y);
  return v[0] === q.a - q.d && v[1] === q.a + q.d ? 'otherQuestion' : null;
}
KIND.sumdiff = { draw:drawSumdiff, eq:eqSumdiff, why:whySumdiff, slip:slipSumdiff };
