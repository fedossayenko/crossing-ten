// Question kind 'short': level 39 Не достигат — Short by so many — so how many are there now?.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

const SWEETS = ['бонбона', 'стикера', 'ябълки', 'монети'];

// Задача 10: being short of a total tells you how many there are now.
function genShort(){
  const item = SWEETS[rnd(SWEETS.length)];
  const have = 2 + rnd(18);
  const T1 = have + 2 + rnd(18);
  const T2 = T1 + 2 + rnd(20);
  const shape = Math.random() < 0.3 ? 1 : 0;
  return {kind:'short', item, have, T1, T2, d1: T1 - have, shape, ans: shape === 0 ? T2 - have : have};
}

function drawShort(q){
  if(q.kind === 'short'){
    const tail = q.shape === 0
      ? 'Колко ' + q.item + ' не ми достигат, за да имам <span class="num">' + q.T2 + '</span> ' + q.item + '?'
      : 'Колко ' + q.item + ' имам?';
    return '<div class="ask">Не ми достигат <span class="num">' + q.d1 + '</span> ' + q.item +
      ', за да имам <span class="num">' + q.T1 + '</span> ' + q.item + '. ' + tail + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqShort(q){
  if(q.kind === 'short') return 'не достигат ' + q.d1 + ' до ' + q.T1 + ' → ' + q.ans;
}
function whyShort(q, full){
  if(q.kind === 'short'){
    if(!full) return 'Първо намери колко имам сега.';
    const head = 'имам ' + q.T1 + ' − ' + q.d1 + ' = <b>' + q.have + '</b>';
    return q.shape === 1 ? head
      : head + ' &nbsp;→&nbsp; до ' + q.T2 + ' не достигат ' + q.T2 + ' − ' + q.have + ' = ' + q.ans;
  }
}
KIND.short = { draw:drawShort, eq:eqShort, why:whyShort };
