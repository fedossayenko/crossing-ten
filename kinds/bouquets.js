// Question kind 'bouquets': level 114 Букети — Bunches of two sizes, how many of each.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Зима 2020, задача 18: 10 bouquets, 34 roses, some of 3 and the rest of 7. If all had 3 there
// would be 30; each bouquet of 7 adds 4 more, and 4 are missing: one of 7, nine of 3.
function genBouquets(){
  for(;;){
    const a = 2 + rnd(4), b = a + 2 + rnd(5), n = 5 + rnd(10), x = 1 + rnd(n - 1), T = x*a + (n - x)*b;
    if(T > 99) continue;
    const asksSmall = Math.random() < 0.65;
    return {kind:'bouquets', a, b, n, x, T, asksSmall, ans: asksSmall ? x : n - x};
  }
}
function drawBouquets(q){
  if(q.kind === 'bouquets'){
    return '<div class="ask">' + tr('В <span class="num">' + q.n + '</span> букета от рози има общо <span class="num">' + q.T + '</span> рози. Някои от букетите са от по <span class="num">' + q.a + '</span> рози, а останалите — по <span class="num">' + q.b + '</span>. Колко са букетите от <b>' + (q.asksSmall ? q.a : q.b) + '</b> рози?',
      'У <span class="num">' + q.n + '</span> букетах троянд усього <span class="num">' + q.T + '</span> троянд. Деякі букети — по <span class="num">' + q.a + '</span> троянди, а решта — по <span class="num">' + q.b + '</span>. Скільки букетів по <b>' + (q.asksSmall ? q.a : q.b) + '</b> троянд?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqBouquets(q){
  if(q.kind === 'bouquets') return q.x + ' · ' + q.a + ' + ' + (q.n - q.x) + ' · ' + q.b + ' = ' + q.T + ' → ' + q.ans;
}
function whyBouquets(q, full){
  if(q.kind === 'bouquets'){
    if(!full) return tr('Ако всички букети бяха малки — колко рози щяха да са? Колко не достигат?', 'Якби всі букети були малі — скільки було б троянд? Скільки бракує?');
    const low = q.n*q.a, big = q.n - q.x;
    return tr('ако всички са по ', 'якби всі були по ') + q.a + ': ' + q.n + ' · ' + q.a + ' = <b>' + low + '</b>, ' + tr('липсват ', 'бракує ') + (q.T - low) + ' &nbsp;→&nbsp; ' + tr('всеки голям дава още ', 'кожен великий дає ще ') + (q.b - q.a) +
      ' &nbsp;→&nbsp; ' + (q.T - low) + ' : ' + (q.b - q.a) + ' = ' + big + tr(' големи, ', ' великих, ') + q.x + tr(' малки', ' малих') + ' &nbsp;→&nbsp; ' + q.ans;
  }
}
KIND.bouquets = { draw:drawBouquets, eq:eqBouquets, why:whyBouquets };
