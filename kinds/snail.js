// Question kind 'snail': level 58 Охлювът — Up by day, back by night — when the top is reached.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 20: a snail that climbs by day and slips back by night. It only has to reach the
// top once, so the last climb is not followed by a slip — the slipping stops there.
function genSnail(){
  for(;;){
    const up = 5 + rnd(6), down = 2 + rnd(up - 3);
    const gain = up - down;
    const H = up + 1 + rnd(30);
    const k = Math.ceil((H - up) / gain);
    if(k < 2 || k > 12) continue;
    return {kind:'snail', H, up, down, gain, k, ans: 2*k + 1};
  }
}

function drawSnail(q){
  if(q.kind === 'snail'){
    return '<div class="ask">Един охлюв се катери по дървена греда, висока <span class="num">' + q.H +
      '</span> метра. През деня се изкачва <span class="num">' + q.up +
      '</span> метра нагоре, а през нощта се смъква <span class="num">' + q.down +
      '</span> метра надолу. След колко <b>дни</b> охлювът ще стигне върха, ако тръгва от земята?</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + ' <span class="unit">дни</span></div>';
  }
}
function eqSnail(q){
  if(q.kind === 'snail') return q.H + ' м, +' + q.up + '/−' + q.down + ' → ' + q.ans;
}
function whySnail(q, full){
  if(q.kind === 'snail'){
    if(!full) return 'Всяко денонощие го качва с малко, но последното изкачване няма връщане назад.';
    const before = q.gain * (q.k - 1);
    return 'за всяко денонощие печели ' + q.up + ' − ' + q.down + ' = <b>' + q.gain +
      '</b> м &nbsp;→&nbsp; трябва преди последното изкачване да е на ' + q.H + ' − ' + q.up + ' = <b>' +
      (q.H - q.up) + '</b> м или повече &nbsp;→&nbsp; това става след ' + q.k + ' денонощия (' +
      (q.gain*q.k) + ' м) &nbsp;→&nbsp; ' + q.k + ' × 2 + 1 = ' + q.ans;
  }
}
KIND.snail = { draw:drawSnail, eq:eqSnail, why:whySnail };
