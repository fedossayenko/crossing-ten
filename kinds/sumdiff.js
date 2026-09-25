// Question kind 'sumdiff': level 17 Сбор и разлика — A number given by how far it sits from another.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 10: each letter sits a given distance from the same number, on either side of
// it. Sending them opposite ways opens the widest gap — the two distances added.
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
function genSumDiff(){
  if(Math.random() < 0.2) return genSumAndDiff();
  if(Math.random() < 0.4) return genGap();
  const d = 1 + rnd(6);
  const a = d + rnd(9);          // the smaller number stays at or above zero, so both sums exist
  return {kind:'sumdiff', a, d, slots:2, ans: 2*a + d, alt:[2*a - d]};
}

function drawSumdiff(q){
  if(q.kind === 'sumdiff' && q.shape === 'sd'){
    return '<div class="ask">' + tr('Сборът на две числа, едно от които е с <span class="num">' + q.d + '</span> по-голямо от другото, е <span class="num">' + q.S + '</span>. Кое е <b>' + (q.asksBig ? 'по-голямото' : 'по-малкото') + '</b> число?',
      'Сума двох чисел, одне з яких на <span class="num">' + q.d + '</span> більше за інше, дорівнює <span class="num">' + q.S + '</span>. Яке число <b>' + (q.asksBig ? 'більше' : 'менше') + '</b>?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'sumdiff' && q.shape === 'gap'){
    return '<div class="ask">' + tr('Разликата на числото <b>A</b> и <span class="num">' + q.c +
      '</span> е <span class="num">' + q.d1 + '</span>. Разликата на числото <b>B</b> и <span class="num">' +
      q.c + '</span> е <span class="num">' + q.d2 +
      '</span>. Колко е <b>най-голямата възможна</b> разлика на числата A и B?',
      'Різниця числа <b>A</b> і <span class="num">' + q.c +
      '</span> дорівнює <span class="num">' + q.d1 + '</span>. Різниця числа <b>B</b> і <span class="num">' +
      q.c + '</span> дорівнює <span class="num">' + q.d2 +
      '</span>. Якою може бути <b>найбільша</b> різниця чисел A і B?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'sumdiff'){
    return '<div class="ask">' + tr('Пресметнете <b>двата възможни сбора</b> на две числа, едно от които е <span class="num">' +
      q.a + '</span>, ако разликата им е <span class="num">' + q.d + '</span>.',
      'Обчисліть <b>обидві можливі суми</b> двох чисел, одне з яких дорівнює <span class="num">' +
      q.a + '</span>, якщо їхня різниця дорівнює <span class="num">' + q.d + '</span>.') + '</div>' +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT +
      ' <span class="or">' + tr('или', 'або') + '</span> <span class="slot" id="slot1"></span></div>';
  }
}
function eqSumdiff(q){
  if(q.kind === 'sumdiff' && q.shape === 'sd') return '(' + q.S + ' − ' + q.d + ') : 2 = ' + q.small + (q.asksBig ? ', ' + q.small + ' + ' + q.d + ' = ' + q.big : '') + ' → ' + q.ans;
  if(q.kind === 'sumdiff' && q.shape === 'gap') return 'A на ' + q.d1 + ', B на ' + q.d2 + tr(' от ', ' від ') + q.c + ' → ' + q.ans;
  if(q.kind === 'sumdiff') return q.a + tr(' и разлика ', ' і різниця ') + q.d + ' → ' + (2*q.a - q.d) + tr(' и ', ' і ') + q.ans;
}
function whySumdiff(q, full){
  if(q.kind === 'sumdiff' && q.shape === 'sd'){
    if(!full) return tr('Махни разликата — остават две равни части.', 'Прибери різницю — лишаються дві рівні частини.');
    return q.S + ' − ' + q.d + ' = ' + (q.S - q.d) + ', ' + (q.S - q.d) + ' : 2 = <b>' + q.small + '</b>' + (q.asksBig ? ' &nbsp;→&nbsp; ' + q.small + ' + ' + q.d + ' = ' + q.big : '') + ' &nbsp;→&nbsp; ' + q.ans;
  }
  if(q.kind === 'sumdiff' && q.shape === 'gap'){
    if(!full) return tr('Всяко от двете може да е от едната или от другата страна.',
      'Кожне з двох чисел може бути як з одного, так і з іншого боку.');
    return 'A ' + tr('е ', '— ') + (q.c - q.d1) + tr(' или ', ' або ') + (q.c + q.d1) + ', B ' + tr('е ', '— ') +
      (q.c - q.d2) + tr(' или ', ' або ') + (q.c + q.d2) +
      tr(' &nbsp;→&nbsp; най-далече са <b>', ' &nbsp;→&nbsp; найдалі одне від одного <b>') + (q.c - q.d1) +
      tr('</b> и <b>', '</b> і <b>') + (q.c + q.d2) + '</b> &nbsp;→&nbsp; ' +
      (q.c + q.d2) + ' − ' + (q.c - q.d1) + ' = ' + q.ans;
  }
  if(q.kind === 'sumdiff'){
    if(!full) return tr('Другото число може да е по-малко или по-голямо — намери и двата сбора.',
      'Інше число може бути меншим або більшим — знайди обидві суми.');
    return tr('другото е <b>', 'інше — <b>') + (q.a - q.d) + tr('</b> или <b>', '</b> або <b>') + (q.a + q.d) + '</b> &nbsp;→&nbsp; ' +
      q.a + ' + ' + (q.a - q.d) + ' = ' + (2*q.a - q.d) + ', &nbsp;' + q.a + ' + ' + (q.a + q.d) +
      ' = ' + q.ans;
  }
}
KIND.sumdiff = { draw:drawSumdiff, eq:eqSumdiff, why:whySumdiff };
