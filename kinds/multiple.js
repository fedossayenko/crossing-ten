// Question kind 'multiple': level 49 Кратни — The smallest count that splits into equal parts both ways.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

const GARDEN = [['рози','розите','градината'], ['ябълки','ябълките','кошницата'],
                ['картички','картичките','кутията'], ['мидички','мидичките','торбичката']];

// Задача 17: "a sum of p equal addends" is another way of saying "divides by p". Wanted
// both ways at once, so the count divides by both — and the smallest one past the bound.
const PAIRS = [[2,3,6], [2,4,4], [2,5,10], [3,4,12], [2,6,6], [2,7,14], [3,2,6], [4,3,12]];
function genMultiple(){
  const [p, r, L] = PAIRS[rnd(PAIRS.length)];
  const t = 2 + rnd(4);
  const N = L*t + 1 + rnd(L - 1);              // never a multiple itself, so "more than" is clear cut
  return {kind:'multiple', g: GARDEN[rnd(GARDEN.length)], p, r, L, N, ans: L*(t + 1)};
}

function drawMultiple(q){
  if(q.kind === 'multiple'){
    return '<div class="ask">В ' + q.g[2] + ' има <b>повече от</b> <span class="num">' + q.N + '</span> ' + q.g[0] +
      '. Техният брой можем да запишем като сбор на <b>' + BGNUM[q.p] + ' равни</b> събираеми и като сбор на <b>' +
      BGNUM[q.r] + ' равни</b> събираеми. Колко <b>най-малко</b> може да са ' + q.g[1] + '?</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqMultiple(q){
  if(q.kind === 'multiple') return 'кратно на ' + q.p + ' и на ' + q.r + ', над ' + q.N + ' → ' + q.ans;
}
function whyMultiple(q, full){
  if(q.kind === 'multiple'){
    if(!full) return 'Сбор на равни събираеми значи, че числото се дели точно на техния брой.';
    return 'дели се и на ' + q.p + ', и на ' + q.r + ' &nbsp;→&nbsp; значи се дели на <b>' + q.L +
      '</b> &nbsp;→&nbsp; ' + [q.L*(q.ans/q.L - 1), q.ans].join(', ') + ' — първото над ' + q.N + ' е ' + q.ans;
  }
}
KIND.multiple = { draw:drawMultiple, eq:eqMultiple, why:whyMultiple };
