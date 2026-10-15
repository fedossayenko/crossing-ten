// Question kind 'circop': level 74 Знакът ◎ and level 272 Знакът ◎ с + и − — A new sign, defined by an example, then used.

// МБГ Есен, 3 клас, задача 16: a ◎ b is the sum divided by the bigger minus the smaller;
// 8 ◎ 4 = 12 : 4 = 3, so 12 ◎ 4 = 16 : 8 = 2. Sometimes the smaller number comes first.
import { KIND, SLOT, rnd, tr } from '../js/core.js';
export function circPairs(){
  const out = [];
  for(let a = 2; a <= 40; a++) for(let b = 1; b < a; b++) if((a + b) % (a - b) === 0 && (a + b) / (a - b) > 1) out.push([a, b]);
  return out;
}
export function genCircOp(){
  const all = circPairs();
  for(;;){
    const ex = all[rnd(all.length)], q = all[rnd(all.length)];
    if(ex[0] === q[0] && ex[1] === q[1] || q[0] > 30) continue;
    const flip = Math.random() < 0.3, x = flip ? q[1] : q[0], y = flip ? q[0] : q[1];
    const ans = (x + y) / Math.abs(x - y);
    return {kind:'circop', ex, x, y, ans, traps: [(x + y) * Math.abs(x - y), x + y, Math.abs(x - y)].filter(v => v !== ans && v < 1000)};
  }
}
// 2nd grade, level 272 (shapes 'add' and 'sub'): no division yet — the sum, then the difference added or taken away.
// 8 ◎ 3 = (8 + 3) − (8 − 3) = 6: taking it away leaves twice the smaller number, adding it gives twice the bigger.
export function genCircOpPm(){
  const add = Math.random() < 0.5;
  for(;;){
    const a = 5 + rnd(8), b = 1 + rnd(a - 1), x = 11 + rnd(60), y = 2 + rnd(40);
    if(x === y || x + y > 100) continue;
    const flip = Math.random() < 0.3, [p, r] = flip ? [y, x] : [x, y], s = p + r, d = Math.abs(p - r), ans = add ? s + d : s - d;
    if(ans > 100) continue;
    return {kind:'circop', shape: add ? 'add' : 'sub', ex:[a, b], x:p, y:r, ans, traps: [s, d, add ? s - d : s + d].filter((v, i, t) => v !== ans && t.indexOf(v) === i)};
  }
}
const circPm = (q, x, y) => '(' + x + ' + ' + y + ') ' + (q.shape === 'add' ? '+' : '−') + ' (' + Math.max(x, y) + ' − ' + Math.min(x, y) + ')';
const circBig = (x, y) => '(' + x + ' + ' + y + ') : (' + Math.max(x, y) + ' − ' + Math.min(x, y) + ')';
function drawCircOp(q){
  const [a, b] = q.ex;
  return '<div class="ask">' + tr('Ако между две различни числа поставим знак ◎, това означава, че сборът на двете числа трябва да бъде разделен на разликата на по-голямото и по-малкото число.',
    'Якщо між двома різними числами поставити знак ◎, це означає, що суму двох чисел треба поділити на різницю більшого й меншого числа.') + '</div>' +
    '<div class="note">' + tr('Пример', 'Приклад') + ': ' + a + ' ◎ ' + b + ' = ' + circBig(a, b) + ' = ' + (a + b) / (a - b) + '</div>' +
    '<div class="given">' + q.x + ' ◎ ' + q.y + ' = ?</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqCircOp(q){
  return q.x + ' ◎ ' + q.y + ' = ' + circBig(q.x, q.y) + ' = ' + q.ans;
}
function whyCircOp(q, full){
  if(!full) return tr('Направи точно като в примера: сборът, после разликата — по-голямото минус по-малкото.',
                      'Зроби точно як у прикладі: сума, потім різниця — більше мінус менше.');
  return q.x + ' ◎ ' + q.y + ' = ' + circBig(q.x, q.y) + ' = ' + (q.x + q.y) + ' : ' + Math.abs(q.x - q.y) + ' = ' + q.ans;
}
function drawCircPm(q){
  const [a, b] = q.ex, add = q.shape === 'add';
  return '<div class="ask">' + tr('Ако между две различни числа поставим знак ◎, това означава, че ' + (add ? 'към сбора на двете числа трябва да прибавим' : 'от сбора на двете числа трябва да извадим') +
      ' разликата на по-голямото и по-малкото число.',
    'Якщо між двома різними числами поставити знак ◎, це означає, що ' + (add ? 'до суми двох чисел треба додати' : 'від суми двох чисел треба відняти') + ' різницю більшого й меншого числа.') + '</div>' +
    '<div class="note">' + tr('Пример', 'Приклад') + ': ' + a + ' ◎ ' + b + ' = ' + circPm(q, a, b) + ' = ' + (add ? 2*a : 2*b) + '</div>' +
    '<div class="given">' + q.x + ' ◎ ' + q.y + ' = ?</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
const circPmLine = q => q.x + ' ◎ ' + q.y + ' = ' + circPm(q, q.x, q.y) + ' = ' + (q.x + q.y) + (q.shape === 'add' ? ' + ' : ' − ') + Math.abs(q.x - q.y) + ' = ' + q.ans;
KIND.circop = { draw: q => q.shape ? drawCircPm(q) : drawCircOp(q), eq: q => q.shape ? circPmLine(q) : eqCircOp(q),
  why: (q, full) => q.shape && full ? circPmLine(q) : whyCircOp(q, full) };
