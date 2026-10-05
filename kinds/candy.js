// Question kind 'candy': level 36 Бонбони — Ways to share sweets so everyone gets one.

// Задача 16: identical sweets, every child gets at least one. Small enough that the
// ways can be listed rather than reasoned about abstractly.
import { KIND, SLOT, UK_PLURAL, rnd, tr } from '../js/core.js';
export function genCandy(){
  const kids = 2 + rnd(2);
  const n = kids === 2 ? 3 + rnd(6) : 4 + rnd(3);
  return {kind:'candy', kids, n, ans: kids === 2 ? n - 1 : (n-1)*(n-2)/2};
}
export function candyWays(n, kids){
  const out = [];
  if(kids === 2){ for(let a = 1; a < n; a++) out.push(a + ' + ' + (n - a)); return out; }
  for(let a = 1; a <= n - 2; a++)
    for(let b = 1; a + b <= n - 1; b++) out.push(a + ' + ' + b + ' + ' + (n - a - b));
  return out;
}

const candyFew = n => UK_PLURAL.select(n) === 'few';
function drawCandy(q){
  return '<div class="ask">' + tr('По колко начина можем да подарим <span class="num">' + q.n +
    '</span> еднакви бонбона на <b>' + (q.kids === 2 ? 'две' : 'три') +
    '</b> деца, така че всяко да получи <b>поне един</b> бонбон?',
    'Скількома способами можна подарувати <span class="num">' + q.n + '</span> ' +
    (candyFew(q.n) ? 'однакові цукерки' : 'однакових цукерок') + ' <b>' + (q.kids === 2 ? 'двом' : 'трьом') +
    '</b> дітям так, щоб кожна дитина отримала <b>щонайменше одну</b> цукерку?') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqCandy(q){
  return tr(q.n + ' бонбона на ' + q.kids + ' деца → ' + q.ans,
    q.n + (candyFew(q.n) ? ' цукерки ' : ' цукерок ') + q.kids + ' дітям → ' + q.ans);
}
function whyCandy(q, full){
  if(!full) return tr('Изреди ги подред, за да не пропуснеш нито един начин.', 'Перелічи їх по порядку, щоб не пропустити жодного способу.');
  return candyWays(q.n, q.kids).join(', &nbsp;') + ' &nbsp;→&nbsp; ' + q.ans;
}
KIND.candy = { draw:drawCandy, eq:eqCandy, why:whyCandy };
