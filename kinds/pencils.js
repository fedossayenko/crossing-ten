// Question kind 'pencils': level 38 Моливи — Colours counted by what they are not.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 8: one clue is a negative — "not green" is every other colour together.
const PENCIL = [['жълти','жълт'], ['зелени','зелен'], ['сини','син'], ['червени','червен']];
// Задача 10: the other colour is the whole minus the named one, and then two lots are
// given away — three plain steps, with only the first one needing any thought.
function genGave(){
  for(;;){
    const nm = NAMES[rnd(NAMES.length)], f = nm[1].slice(-1) === 'а';
    const col = shuffle(PENCIL.slice()).slice(0, 2);
    const T = 14 + rnd(12), a = 4 + rnd(8);
    const rest = T - a, g1 = 2 + rnd(6), g2 = 1 + rnd(6);
    // some of the other colour may go too — it changes nothing, which is the thing to notice
    const other = Math.random() < 0.5 ? 1 + rnd(Math.min(3, a - 1)) : 0;
    if(rest - g1 - g2 < 1) continue;
    return {kind:'pencils', shape:'gave', who: nm[0], f, col, T, a, rest, g1, g2, other,
            ans: rest - g1 - g2};
  }
}
function genPencils(){
  if(Math.random() < 0.4) return genGave();
  const who = NAMES[rnd(NAMES.length)][0];
  const col = shuffle(PENCIL.slice()).slice(0, 3);
  const a = 2 + rnd(8), b = 2 + rnd(8), c = 2 + rnd(11);
  return {kind:'pencils', who, col, a, b, c, T: a + b + c, notA: b + c, ans: c};
}

function drawPencils(q){
  if(q.kind === 'pencils' && q.shape === 'gave'){
    const had = q.f ? 'имала' : 'имал', gave = q.f ? 'подарила' : 'подарил';
    const Gave = gave[0].toUpperCase() + gave.slice(1);   // it opens a sentence
    return '<div class="ask">' + q.who + ' ' + had + ' <span class="num">' + q.T + '</span> молива, от които <span class="num">' +
      q.a + '</span> ' + q.col[0][0] + ', а останалите — ' + q.col[1][0] + '. ' + Gave +
      ' на майка си <span class="num">' + q.g1 + '</span> ' + q.col[1][0] + ' молива, а на приятеля си ' +
      gave + ' <span class="num">' + q.g2 + '</span> ' + q.col[1][0] +
      (q.other ? ' и <span class="num">' + q.other + '</span> ' + q.col[0][0] : '') +
      ' молива. Колко <b>' + q.col[1][0] + '</b> молива са останали при ' + q.who + '?</div>' +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + SLOT + '</div>';
  }
  if(q.kind === 'pencils'){
    return '<div class="ask">' + q.who + ' има <span class="num">' + q.T + '</span> молива с различен цвят — ' +
      q.col.map(c => c[1]).join(', ') + '. От тях <span class="num">' + q.notA + '</span> <b>не са ' +
      q.col[0][0] + '</b>, а <span class="num">' + q.b + '</span> са ' + q.col[1][0] +
      '. Колко <b>' + q.col[2][0] + '</b> молива има ' + q.who + '?</div>' +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + SLOT + '</div>';
  }
}
function eqPencils(q){
  if(q.kind === 'pencils' && q.shape === 'gave') return q.T + ' молива, ' + q.a + ' ' + q.col[0][0] +
    ', подарени ' + q.g1 + ' и ' + q.g2 + ' → ' + q.ans;
  if(q.kind === 'pencils') return q.T + ' молива, ' + q.notA + ' не са ' + q.col[0][0] + ', ' +
    q.b + ' са ' + q.col[1][0] + ' → ' + q.ans;
}
function whyPencils(q, full){
  if(q.kind === 'pencils' && q.shape === 'gave'){
    if(!full) return 'Първо колко са останалите на цвят, чак после кой колко е подарил.';
    const aside = q.other ? ' (' + q.other + ' ' + q.col[0][0] + ' не се броят)' : '';
    return q.col[1][0] + ' са ' + q.T + ' − ' + q.a + ' = <b>' + q.rest + '</b> &nbsp;→&nbsp; подарени са ' +
      q.g1 + ' + ' + q.g2 + ' = <b>' + (q.g1 + q.g2) + '</b>' + aside + ' &nbsp;→&nbsp; ' + q.rest +
      ' − ' + (q.g1 + q.g2) + ' = ' + q.ans;
  }
  if(q.kind === 'pencils'){
    if(!full) return '„Не са ' + q.col[0][0] + '" значи всички останали цветове заедно.';
    return '<b>' + q.notA + '</b> не са ' + q.col[0][0] + ', значи ' + q.col[0][0] + ' са ' +
      q.T + ' − ' + q.notA + ' = <b>' + q.a + '</b> &nbsp;→&nbsp; ' + q.col[2][0] + ' са ' +
      q.notA + ' − ' + q.b + ' = ' + q.ans;
  }
}
KIND.pencils = { draw:drawPencils, eq:eqPencils, why:whyPencils };
