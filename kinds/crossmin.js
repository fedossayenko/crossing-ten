// Question kind 'crossmin': level 166 Зачеркни за най-малко — One digit crossed out of a sum, for the smallest or largest total.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Пролет 2023, 1 клас, задача 14: which digit of 19 + 23 to cross out for the smallest sum?
// Every try: 9 + 23 = 32, 1 + 23 = 24, 19 + 3 = 22, 19 + 2 = 21 — the smallest is 21, so the 3.
// The four digits are all different, so the digit names the try.
// [the digit crossed, the sum then] for each of the four digits of x + y
const crossTries = (x, y) => [[Math.floor(x / 10), x % 10 + y], [x % 10, Math.floor(x / 10) + y], [Math.floor(y / 10), x + y % 10], [y % 10, x + Math.floor(y / 10)]];
function genCrossMin(){
  for(;;){
    const x = 11 + rnd(89), y = 11 + rnd(89), ds = String(x) + y;
    if(ds.includes('0') || new Set(ds).size !== 4 || x + y > 99) continue;   // every sum tried stays under a hundred
    const least = Math.random() < 0.6, tries = crossTries(x, y), sums = tries.map(t => t[1]);
    const best = least ? Math.min(...sums) : Math.max(...sums);
    if(sums.filter(s => s === best).length !== 1) continue;
    const ans = tries.find(t => t[1] === best)[0];
    return {kind:'crossmin', x, y, least, best, traps: tries.map(t => t[0]).filter(d => d !== ans), ans};   // as А/Б/В/Г, the other three digits
  }
}
function drawCrossMin(q){
  if(q.kind === 'crossmin'){
    return '<div class="ask">' + tr('Коя цифра трябва да зачеркнем в <span class="num">' + q.x + ' + ' + q.y + '</span>, така че да се получи <b>' + (q.least ? 'най-малкият' : 'най-големият') + '</b> сбор?',
      'Яку цифру треба закреслити в <span class="num">' + q.x + ' + ' + q.y + '</span>, щоб вийшла <b>' + (q.least ? 'найменша' : 'найбільша') + '</b> сума?') + '</div>' +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + SLOT + '</div>';
  }
}
function eqCrossMin(q){
  if(q.kind === 'crossmin') return q.x + ' + ' + q.y + ', ' + tr(q.least ? 'най-малък ' : 'най-голям ', q.least ? 'найменша ' : 'найбільша ') + q.best + ' → ' + q.ans;
}
function whyCrossMin(q, full){
  if(q.kind === 'crossmin'){
    if(!full) return tr('Зачеркни всяка цифра поред и пресметни сбора, който остава. После сравни.',
      'Закресли по черзі кожну цифру й обчисли суму, що лишається. Потім порівняй.');
    const [x, y] = [String(q.x), String(q.y)], rest = [x[1] + ' + ' + y, x[0] + ' + ' + y, x + ' + ' + y[1], x + ' + ' + y[0]];
    return crossTries(q.x, q.y).map((t, i) => '<s>' + t[0] + '</s>: ' + rest[i] + ' = ' + (t[1] === q.best ? '<b>' + t[1] + '</b>' : t[1])).join(', &nbsp;') +
      ' &nbsp;→&nbsp; ' + tr(q.least ? 'най-малкият е ' : 'най-големият е ', q.least ? 'найменша — ' : 'найбільша — ') + q.best + tr(', зачеркваме ', ', закреслюємо ') + q.ans;
  }
}
KIND.crossmin = { draw:drawCrossMin, eq:eqCrossMin, why:whyCrossMin };
