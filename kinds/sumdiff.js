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
export function genSumBoard(){
  for(;;){
    const small = 1 + rnd(9), d = 1 + rnd(10), big = small + d, S = small + big;
    if(S > 20) continue;
    const asksBig = Math.random() < 0.7, ans = asksBig ? big : small;
    return {kind:'sumdiff', shape:'board', S, d, small, big, asksBig, traps: (S % 2 ? [S - d] : [S / 2, S - d]).filter(v => v !== ans), ans};
  }
}
export function genSumDiff(){
  if(Math.random() < 0.2) return genSumAndDiff();
  if(Math.random() < 0.4) return genGap();
  const d = 1 + rnd(6);
  const a = d + rnd(9);          // the smaller number stays at or above zero, so both sums exist
  return {kind:'sumdiff', a, d, slots:2, ans: 2*a + d, alt:[2*a - d]};
}

function drawSumdiff(q){
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
  if(q.shape === 'board') return q.small + ' + ' + q.big + ' = ' + q.S + ', ' + q.big + ' − ' + q.small + ' = ' + q.d + ' → ' + q.ans;
  if(q.shape === 'sd') return '(' + q.S + ' − ' + q.d + ') : 2 = ' + q.small + (q.asksBig ? ', ' + q.small + ' + ' + q.d + ' = ' + q.big : '') + ' → ' + q.ans;
  if(q.shape === 'gap') return 'A на ' + q.d1 + ', B на ' + q.d2 + tr(' от ', ' від ') + q.c + ' → ' + q.ans;
  return q.a + tr(' и разлика ', ' і різниця ') + q.d + ' → ' + (2*q.a - q.d) + tr(' и ', ' і ') + q.ans;
}
// The pictures. Two sums: the number, and the other one a step of the difference to its left or to
// its right. The widest gap: A and B each on either side of the number, and the widest pair across it.
// A sum and a difference: two bars, the longer one longer by the difference — take that off, and what
// is left is two equal halves.
function sumdiffSvg(q){
  if(q.shape === 'sd' || q.shape === 'board'){
    const u = 180 / q.big, half = q.small * u;
    let g = '';
    [[0, q.small, 0], [30, q.big, 1]].forEach(([y, v, i]) => { g += '<rect' + popAt(1 + i) + ' x="40" y="' + y + '" width="' + (v * u).toFixed(1) + '" height="20" rx="5" fill="none" stroke="var(--accent)" stroke-width="2"/>'; });
    g += svgText(20, 15, tr('по-м.', 'менше'), 10, 'var(--accent)') + svgText(20, 45, tr('по-г.', 'більше'), 10, 'var(--accent)');
    g += '<g' + popAt(3) + '><rect x="' + (40 + half).toFixed(1) + '" y="30" width="' + (q.d * u).toFixed(1) + '" height="20" rx="5" fill="var(--warmbg)" stroke="var(--warm)" stroke-width="2"/>' +
      svgText((40 + half + q.d * u / 2).toFixed(1), 45, q.d, 12, 'var(--warm)') + '</g>';
    g += '<g' + popAt(4) + '><path d="M' + (40 + half + q.d * u + 8).toFixed(1) + ',0 h5 v50 h-5" stroke="var(--ink)" stroke-width="1.6" fill="none"/>' + svgText((40 + half + q.d * u + 26).toFixed(1), 30, q.S, 13, 'var(--ink)') + '</g>';
    g += '<g' + popAt(5) + '>' + svgText((40 + half / 2).toFixed(1), 15, q.small, 13, 'var(--accent)') + svgText((40 + half / 2).toFixed(1), 45, q.small, 13, 'var(--accent)') + '</g>';
    const foot = q.asksBig ? q.small + ' + ' + q.d + ' = ' + q.big : q.shape === 'board' ? q.big + ' − ' + q.d + ' = ' + q.small : '(' + q.S + ' − ' + q.d + ') : 2 = ' + q.small;
    g += svgText(130, 78, foot, 15, 'var(--ink)', popAt(6));
    return '<svg viewBox="0 -8 272 96" style="display:block; width:326px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + tr('двете числа като ленти', 'два числа як смужки') + '">' + g + '</svg>';
  }
  if(q.shape === 'gap'){
    const m = Math.max(q.d1, q.d2), A = 'var(--warm)', B = 'var(--accent)';
    return lineSvg([{at:q.c, step:0}, {at:q.c - q.d1, name:'A', col:A, step:1}, {at:q.c + q.d1, name:'A', col:A, step:1},
        {at:q.c - q.d2, name:'B', col:B, step:2}, {at:q.c + q.d2, name:'B', col:B, step:2}],
      [{from:q.c - q.d1, to:q.c, label:q.d1, row:1, col:A, step:3}, {from:q.c, to:q.c + q.d2, label:q.d2, row:1, col:B, step:3.5},
       {from:q.c - q.d1, to:q.c + q.d2, label:q.d1 + ' + ' + q.d2 + ' = ' + q.ans, row:2, col:'var(--ink)', step:4.5}],
      q.c - m - 1, q.c + m + 1, tr('A и B около ', 'A і B навколо ') + q.c);
  }
  const lo = q.a - q.d, hi = q.a + q.d;
  return lineSvg([{at:q.a, name:String(q.a), step:0}, {at:lo, name:String(lo), col:'var(--warm)', step:1.5}, {at:hi, name:String(hi), col:'var(--accent)', step:2.5}],
    [{from:lo, to:q.a, label:q.d, row:1, col:'var(--warm)', step:1}, {from:q.a, to:hi, label:q.d, row:1, col:'var(--accent)', step:2}],
    lo - 1, hi + 1, tr('другото число от двете страни', 'інше число з обох боків'));
}
function whySumdiff(q, full){
  if(q.shape === 'board'){
    if(!full) return tr('Опитай две числа с този сбор, като започнеш от две равни половини. Каква е разликата им?',
      'Спробуй два числа з такою сумою, починаючи з двох рівних половин. Яка між ними різниця?');
    const tries = [];
    for(let b = Math.ceil(q.S / 2); b <= q.big; b++) tries.push(b + ' + ' + (q.S - b) + ' (' + tr('разлика ', 'різниця ') + (b === q.big ? '<b>' + (2*b - q.S) + '</b>' : 2*b - q.S) + ')');
    return tries.join(', ') + ' &nbsp;→&nbsp; ' + (q.asksBig ? tr('по-голямото е ', 'більше — ') : tr('по-малкото е ', 'менше — ')) + q.ans + sumdiffSvg(q);
  }
  if(q.shape === 'sd'){
    if(!full) return tr('Махни разликата — остават две равни части.', 'Прибери різницю — лишаються дві рівні частини.');
    return q.S + ' − ' + q.d + ' = ' + (q.S - q.d) + ', ' + (q.S - q.d) + ' : 2 = <b>' + q.small + '</b>' + (q.asksBig ? ' &nbsp;→&nbsp; ' + q.small + ' + ' + q.d + ' = ' + q.big : '') + ' &nbsp;→&nbsp; ' + q.ans + sumdiffSvg(q);
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
    q.a + ' + ' + (q.a - q.d) + ' = ' + (2*q.a - q.d) + ', &nbsp;' + q.a + ' + ' + (q.a + q.d) +
    ' = ' + q.ans;
}
KIND.sumdiff = { draw:drawSumdiff, eq:eqSumdiff, why:whySumdiff };
