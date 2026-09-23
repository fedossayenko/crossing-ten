// Question kind 'circop': level 74 Знакът ◎ — A new sign, defined by an example, then used.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Есен, 3 клас, задача 16: a ◎ b is the sum divided by the bigger minus the smaller;
// 8 ◎ 4 = 12 : 4 = 3, so 12 ◎ 4 = 16 : 8 = 2. Sometimes the smaller number comes first.
function circPairs(){
  const out = [];
  for(let a = 2; a <= 40; a++) for(let b = 1; b < a; b++) if((a + b) % (a - b) === 0 && (a + b) / (a - b) > 1) out.push([a, b]);
  return out;
}
function genCircOp(){
  const all = circPairs();
  for(;;){
    const ex = all[rnd(all.length)], q = all[rnd(all.length)];
    if(ex[0] === q[0] && ex[1] === q[1] || q[0] > 30) continue;
    const flip = Math.random() < 0.3, x = flip ? q[1] : q[0], y = flip ? q[0] : q[1];
    const ans = (x + y) / Math.abs(x - y);
    return {kind:'circop', ex, x, y, ans, traps: [(x + y) * Math.abs(x - y), x + y, Math.abs(x - y)].filter(v => v !== ans && v < 1000)};
  }
}
const circBig = (x, y) => '(' + x + ' + ' + y + ') : (' + Math.max(x, y) + ' − ' + Math.min(x, y) + ')';
function drawCircOp(q){
  if(q.kind === 'circop'){
    const [a, b] = q.ex;
    return '<div class="ask">' + tr('Ако между две различни числа поставим знак ◎, това означава, че сборът на двете числа трябва да бъде разделен на разликата на по-голямото и по-малкото число.',
      'Якщо між двома різними числами поставити знак ◎, це означає, що суму двох чисел треба поділити на різницю більшого й меншого числа.') + '</div>' +
      '<div class="note">' + tr('Пример', 'Приклад') + ': ' + a + ' ◎ ' + b + ' = ' + circBig(a, b) + ' = ' + (a + b) / (a - b) + '</div>' +
      '<div class="given">' + q.x + ' ◎ ' + q.y + ' = ?</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqCircOp(q){
  if(q.kind === 'circop') return q.x + ' ◎ ' + q.y + ' = ' + circBig(q.x, q.y) + ' = ' + q.ans;
}
function whyCircOp(q, full){
  if(q.kind === 'circop'){
    if(!full) return tr('Направи точно като в примера: сборът, после разликата — по-голямото минус по-малкото.',
                        'Зроби точно як у прикладі: сума, потім різниця — більше мінус менше.');
    return q.x + ' ◎ ' + q.y + ' = ' + circBig(q.x, q.y) + ' = ' + (q.x + q.y) + ' : ' + Math.abs(q.x - q.y) + ' = ' + q.ans;
  }
}
KIND.circop = { draw:drawCircOp, eq:eqCircOp, why:whyCircOp };
