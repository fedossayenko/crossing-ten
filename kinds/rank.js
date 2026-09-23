// Question kind 'rank': level 57 Класирането — Who beat whom — and how many are above someone.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 3: how much bigger one sum is than the other. Asked the other way round
// some of the time, so the wording has to be read rather than guessed.
// Задача 3: the two sums line up term by term, so pairing them off beats adding both —
// one pair carries a ten, the rest nudge by one or two.
const BOYS = ['Алекс', 'Борис', 'Виктор', 'Георги', 'Даниел', 'Емил'];
// Задача 18: who beat whom. One boy is said to be above everybody, and another to be
// above only a named few — which pins how many are above him, whatever the rest did.
function genRank(){
  const n = 4 + rnd(2);
  const who = shuffle(BOYS.slice()).slice(0, n);      // who[0] is best, who[n-1] worst
  const k = 2 + rnd(n - 3);                           // the boy the second fact is about
  const asksAbove = Math.random() < 0.6;
  return {kind:'rank', who, n, k, asksAbove, ans: asksAbove ? k : n - 1 - k};
}

function drawRank(q){
  if(q.kind === 'rank'){
    const beaten = q.who.slice(1).map(x => 'от <b>' + x + '</b>');
    const only = q.who.slice(q.k + 1).map(x => '<b>' + x + '</b>');
    return '<div class="ask">В едно състезание по математика <b>' + q.who[0] + '</b> е с повече точки ' +
      bgList(beaten) + ', а <b>' + q.who[q.k] + '</b> е с повече точки <b>само</b> от ' + bgList(only) +
      '. Колко момчета са с <b>' + (q.asksAbove ? 'повече' : 'по-малко') + '</b> точки от <b>' +
      q.who[q.k] + '</b>?</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqRank(q){
  if(q.kind === 'rank') return q.who.join(' > ') + ', пита се за ' + q.who[q.k] + ' → ' + q.ans;
}
function whyRank(q, full){
  if(q.kind === 'rank'){
    if(!full) return 'Който е над само няколко, е под всички останали.';
    const below = q.n - 1 - q.k;
    return q.who[q.k] + ' е над ' + below + ' от тях, значи останалите ' + q.k + ' са над него' +
      ' &nbsp;→&nbsp; ' + (q.asksAbove ? 'над него са ' + q.ans : 'под него са ' + q.ans);
  }
}
KIND.rank = { draw:drawRank, eq:eqRank, why:whyRank };
