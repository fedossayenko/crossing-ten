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
function genSumDiff(){
  if(Math.random() < 0.4) return genGap();
  const d = 1 + rnd(6);
  const a = d + rnd(9);          // the smaller number stays at or above zero, so both sums exist
  return {kind:'sumdiff', a, d, slots:2, ans: 2*a + d, alt:[2*a - d]};
}

function drawSumdiff(q){
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
  if(q.kind === 'sumdiff' && q.shape === 'gap') return 'A на ' + q.d1 + ', B на ' + q.d2 + tr(' от ', ' від ') + q.c + ' → ' + q.ans;
  if(q.kind === 'sumdiff') return q.a + tr(' и разлика ', ' і різниця ') + q.d + ' → ' + (2*q.a - q.d) + tr(' и ', ' і ') + q.ans;
}
function whySumdiff(q, full){
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
