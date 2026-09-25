// Question kind 'cuckoo': level 116 Кукувичката — So many times in so many seconds: how many in longer.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Зима 2020, задача 13: the clock's cuckoo calls 3 times every 4 seconds; in 16 seconds that is
// four lots of 4 seconds, so 4 · 3 = 12 calls.
function genCuckoo(){
  const k = 2 + rnd(4), s = 2 + rnd(5), m = 2 + rnd(4);
  return {kind:'cuckoo', k, s, m, t: s*m, ans: k*m};
}
function drawCuckoo(q){
  if(q.kind === 'cuckoo'){
    return '<div class="ask">' + tr('Кукувичката от часовника кука по <span class="num">' + q.k + '</span> пъти за <span class="num">' + q.s + '</span> секунди. Колко пъти ще изкука кукувичката за <span class="num">' + q.t + '</span> секунди?',
      'Зозуля з годинника кукає по <span class="num">' + q.k + '</span> рази за <span class="num">' + q.s + '</span> секунди. Скільки разів вона кукне за <span class="num">' + q.t + '</span> секунд?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqCuckoo(q){
  if(q.kind === 'cuckoo') return q.t + ' : ' + q.s + ' = ' + q.m + ', ' + q.m + ' · ' + q.k + ' = ' + q.ans;
}
function whyCuckoo(q, full){
  if(q.kind === 'cuckoo'){
    if(!full) return tr('Колко пъти по толкова секунди се събират в цялото време?', 'Скільки разів по стільки секунд уміщається в увесь час?');
    return q.t + tr(' секунди са ', ' секунд — це ') + q.m + tr(' пъти по ', ' рази по ') + q.s + ' &nbsp;→&nbsp; ' + q.m + ' · ' + q.k + ' = ' + q.ans;
  }
}
KIND.cuckoo = { draw:drawCuckoo, eq:eqCuckoo, why:whyCuckoo };
