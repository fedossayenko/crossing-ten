// Question kind 'candy': level 36 Бонбони — Ways to share sweets so everyone gets one.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 16: identical sweets, every child gets at least one. Small enough that the
// ways can be listed rather than reasoned about abstractly.
function genCandy(){
  const kids = 2 + rnd(2);
  const n = kids === 2 ? 3 + rnd(6) : 4 + rnd(3);
  return {kind:'candy', kids, n, ans: kids === 2 ? n - 1 : (n-1)*(n-2)/2};
}
function candyWays(n, kids){
  const out = [];
  if(kids === 2){ for(let a = 1; a < n; a++) out.push(a + ' + ' + (n - a)); return out; }
  for(let a = 1; a <= n - 2; a++)
    for(let b = 1; a + b <= n - 1; b++) out.push(a + ' + ' + b + ' + ' + (n - a - b));
  return out;
}

function drawCandy(q){
  if(q.kind === 'candy'){
    return '<div class="ask">По колко начина можем да подарим <span class="num">' + q.n +
      '</span> еднакви бонбона на <b>' + (q.kids === 2 ? 'две' : 'три') +
      '</b> деца, така че всяко да получи <b>поне един</b> бонбон?</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqCandy(q){
  if(q.kind === 'candy') return q.n + ' бонбона на ' + q.kids + ' деца → ' + q.ans;
}
function whyCandy(q, full){
  if(q.kind === 'candy'){
    if(!full) return 'Изреди ги подред, за да не пропуснеш нито един начин.';
    return candyWays(q.n, q.kids).join(', &nbsp;') + ' &nbsp;→&nbsp; ' + q.ans;
  }
}
KIND.candy = { draw:drawCandy, eq:eqCandy, why:whyCandy };
