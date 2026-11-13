// Question kind 'cakes': level 334 Тортите — five children of different ages, one cake each with as many candles as
// years (the numbers on the cakes are given): which candle number is whose, from a chain of «two years older» clues
// and the youngest (or the oldest).

// Кенгуру 2023, задача 18: five children of different ages; the cakes show 8, 7, 6, 5, 4. Лена is 2 years older than
// Йоско but 1 year younger than Ангел; Виктор is the youngest; whose cake is Сашо's? Виктор has 4. Йоско, Лена, Ангел
// are x, x + 2, x + 3 among 5…8, so x = 5: Йоско 5, Лена 7, Ангел 8. Сашо has what is left: 6.
// (The paper shows the cakes as pictures and asks which one; here the numbers are listed and the age is asked.)
import { KIND, SLOT, rnd, shuffle, tr, ukPl } from '../js/core.js';
const num = n => '<span class="num">' + n + '</span>';
// [Bulgarian, Ukrainian, girl, Ukrainian genitive («у Сашка»)]
const CAKE_KIDS = [['Лена', 'Лена', 1, 'Лени'], ['Йоско', 'Йоско', 0, 'Йоска'], ['Ангел', 'Ангел', 0, 'Ангела'], ['Виктор', 'Віктор', 0, 'Віктора'], ['Сашо', 'Сашко', 0, 'Сашка'], ['Мая', 'Мая', 1, 'Маї'], ['Ники', 'Нікі', 0, 'Нікі'], ['Ива', 'Іва', 1, 'Іви'], ['Васко', 'Васько', 0, 'Васька'], ['Ема', 'Ема', 1, 'Еми']];
const cakeYears = n => n === 1 ? 'година' : 'години';
// every way to give the five roles [A, B, C, V, X] the ages lo…lo + 4 so that A = B + k, C = A + m and V is the youngest/oldest
function cakeSolutions(lo, k, m, young){
  const out = [], ages = [0, 1, 2, 3, 4].map(i => lo + i);
  const rec = (pick, left) => {
    if(!left.length){
      const [A, B, C, V] = pick;
      if(A === B + k && C === A + m && V === (young ? lo : lo + 4)) out.push(pick);
      return;
    }
    for(const v of left) rec(pick.concat(v), left.filter(x => x !== v));
  };
  rec([], ages);
  return out;
}
export function genCakes(){
  for(;;){
    const k = 1 + rnd(2), m = 1 + rnd(2), young = Math.random() < 0.75, lo = 3 + rnd(5), nm = shuffle(CAKE_KIDS.map((_, i) => i)).slice(0, 5);
    const sols = cakeSolutions(lo, k, m, young);
    if(sols.length !== 1) continue;
    const ages = sols[0];
    return {kind:'cakes', k, m, young, lo, nm, ages, traps:[ages[3]], ans: ages[4]};
  }
}
function drawCakes(q){
  const kid = i => CAKE_KIDS[q.nm[i]], [A, B, C, V, X] = [0, 1, 2, 3, 4].map(kid);
  const g = (kd, m, f) => kd[2] ? f : m;   // by the child's sex
  const cakes = [...Array(5)].map((_, i) => '<span class="num">🎂 ' + (q.lo + 4 - i) + '</span>').join(' &nbsp; ');
  const ext = q.young ? tr(V[0] + ' е най-' + g(V, 'малкият', 'малката'), V[1] + ' ' + g(V, 'наймолодший', 'наймолодша')) : tr(V[0] + ' е най-' + g(V, 'големият', 'голямата'), V[1] + ' ' + g(V, 'найстарший', 'найстарша'));
  return '<div class="ask">' + tr('Пет деца са на различна възраст, но са родени в един и същ ден. На тортите им има свещи колкото години са навършили: ',
      'П\'ятеро дітей різного віку, але народилися в один день. На їхніх тортах стільки свічок, скільки років їм виповнилося: ') + cakes + '. ' +
    tr(A[0] + ' е с ' + num(q.k) + ' ' + cakeYears(q.k) + ' ' + g(A, 'по-голям', 'по-голяма') + ' от ' + B[0] + ', но е с ' + num(q.m) + ' ' + cakeYears(q.m) + ' ' + g(A, 'по-малък', 'по-малка') + ' от ' + C[0] + '. ' + ext + '. ',
       A[1] + ' ' + g(A, 'старший', 'старша') + ' на ' + ukPl(q.k, 'рік', 'роки', 'років') + ', ніж ' + B[1] + ', але ' + g(A, 'молодший', 'молодша') + ' на ' + ukPl(q.m, 'рік', 'роки', 'років') + ', ніж ' + C[1] + '. ' + ext + '. ') +
    '<b>' + tr('Колко свещи има тортата на ' + X[0] + '?', 'Скільки свічок на торті в ' + X[3] + '?') + '</b></div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqCakes(q){
  return q.ages.slice(0, 4).join(', ') + ' → ' + q.ans;
}
function whyCakes(q, full){
  const kid = i => CAKE_KIDS[q.nm[i]], [A, B, C, V, X] = [0, 1, 2, 3, 4].map(kid);
  if(!full) return tr('Тези от веригата са ' + B[0] + ', ' + A[0] + ' и ' + C[0] + ': подреди ги една след друга с разликите. Къде са най-малкият и най-големият?',
                      'Ланцюжок: ' + B[1] + ', ' + A[1] + ', ' + C[1] + ': розстав їх з різницями. Де найменший і найбільший?');
  const [a, b, c, v, x] = q.ages, rest = [0, 1, 2, 3, 4].map(i => q.lo + i).filter(n => n !== v).join(', ');
  const gv = (m, f) => V[2] ? f : m;   // by the child's sex, as in the task
  return tr(V[0] + ' има ' + v + ' (' + (q.young ? gv('най-малкият', 'най-малката') : gv('най-големият', 'най-голямата')) + '). Останаха ' + rest + '. ' + B[0] + ', ' + A[0] + ' и ' + C[0] + ' са на ' + b + ', ' + b + ' + ' + q.k + ' = ' + a + ', ' + a + ' + ' + q.m + ' = ' + c +
      ' — само така пасват. За ' + X[0] + ' остава: <b>' + x + '</b>',
    V[1] + ' має ' + v + ' (' + (q.young ? gv('наймолодший', 'наймолодша') : gv('найстарший', 'найстарша')) + '). Лишилися ' + rest + '. ' + B[1] + ', ' + A[1] + ' і ' + C[1] + ': ' + b + ', ' + b + ' + ' + q.k + ' = ' + a + ', ' + a + ' + ' + q.m + ' = ' + c +
      ' — лише так пасують. Для ' + X[3] + ' лишається: <b>' + x + '</b>');
}
KIND.cakes = { draw:drawCakes, eq:eqCakes, why:whyCakes };
