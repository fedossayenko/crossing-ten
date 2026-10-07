// Question kind 'swapone': level 248 Смени едно число — Change one number of an expression so its value goes up (or down) by 1 … 3.

// МБГ Есен 2023, 3 клас, задача 18: 6 : 3 + 2 · 2 − 10 : 2 = 2 + 4 − 5 = 1. Change exactly one number so it comes to 2: 6 → 9
// (9 : 3 = 3), 3 → 2 (6 : 2 = 3), 10 → 8 (8 : 2 = 4). The 2 · 2 would have to make 5 and 10 : □ would have to make 4 — no
// whole number does either. The numbers that can be changed add to 6 + 3 + 10 = 19. Asked the same way with other numbers,
// and going up or down by 1, 2 or 3. A dividend can change whenever its quotient may move that way (not below 0), so in
// most questions a divisor or a factor can change too (3 · 2 + 2 = 4 · 2), and in some a quotient is too small to drop by
// the change: «add the two divided numbers» is seldom the answer.
import { KIND, SLOT, rnd, tr } from '../js/core.js';
// the value of a : b + c · d − e : f, and the three parts
const swapParts = n => [n[0] / n[1], n[2] * n[3], n[4] / n[5]];
// what each number would have to become, or 0 when no whole number above 0 does it: the part it stands in must move by
// the change (the part taken away the other way), and cannot go below 0
function swapTo(n, by){
  const [u1, u2, u3] = swapParts(n), t1 = u1 + by, t2 = u2 + by, t3 = u3 - by;
  const div = (x, y) => x > 0 && y > 0 && x % y === 0 ? x / y : 0;
  return [t1 > 0 ? t1 * n[1] : 0, div(n[0], t1), div(t2, n[3]), div(t2, n[2]), t3 > 0 ? t3 * n[5] : 0, div(n[4], t3)];
}
const SWAP_BY = [1, 1, 1, 1, 1, 1, 1, -1, -1, -1, 2, 2, 2, 2, -2, -2, 3, 3, 3, -3];   // the paper's +1 a third of the time
export function genSwapOne(){
  // most questions have a divisor or a factor that can change; the rest only dividends
  const by = SWAP_BY[rnd(SWAP_BY.length)], inner = Math.random() < 0.85;
  for(;;){
    const b = 2 + rnd(4), a = b*(1 + rnd(9)), c = 2 + rnd(4), d = 2 + rnd(4), f = 2 + rnd(4), e = f*(1 + rnd(9)), n = [a, b, c, d, e, f];
    const [u1, u2, u3] = swapParts(n), V = u1 + u2 - u3;
    // the value and the new one above 0, and no part that would have to become exactly 0: no number need become 0
    if(V < 1 || V + by < 1 || u1 + by === 0 || u2 + by === 0 || u3 - by === 0) continue;
    const to = swapTo(n, by), can = n.filter((_, i) => to[i]), cannot = n.filter((_, i) => !to[i]);
    if(inner !== !!(to[1] || to[2] || to[3] || to[5])) continue;
    // «the numbers that can be changed» must read one way: none of them twice, and none also standing where it cannot be;
    // and they are numbers, so two at least
    if(new Set(can).size !== can.length || can.some(v => cannot.includes(v)) || can.length < 2) continue;
    const ans = can.reduce((s, v) => s + v, 0), all = n.reduce((s, v) => s + v, 0);
    // the slips: only the two that are divided, or every number counted
    return {kind:'swapone', n, by, V, to, traps:[a + e, all].filter(v => v !== ans), ans};
  }
}
const swapExpr = n => n[0] + ' : ' + n[1] + ' + ' + n[2] + ' · ' + n[3] + ' − ' + n[4] + ' : ' + n[5];
function drawSwapOne(q){
  const bg = (q.by < 0 ? 'намали' : 'увеличи') + ' с ' + Math.abs(q.by), uk = (q.by < 0 ? 'зменшилося' : 'збільшилося') + ' на ' + Math.abs(q.by);
  return '<div class="ask">' + tr('В израза', 'У виразі') + '</div>' +
    '<div class="given">' + swapExpr(q.n) + '</div>' +
    '<div class="ask">' + tr('заменете <b>точно едно</b> от участващите числа с друго число, така че първоначалната стойност на израза да се <b>' + bg +
      '</b>. Колко е сборът на числата в израза, които е възможно да се заменят?',
      'замініть <b>рівно одне</b> з чисел у ньому іншим числом так, щоб початкове значення виразу <b>' + uk +
      '</b>. Яка сума тих чисел у виразі, які можна замінити?') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
const swapCan = q => q.n.map((v, i) => [v, q.to[i]]).filter(([, x]) => x);
function eqSwapOne(q){
  const can = swapCan(q);
  return can.map(([v, x]) => v + ' → ' + x).join(', ') + ' → ' + can.map(([v]) => v).join(' + ') + ' = ' + q.ans;
}
function whySwapOne(q, full){
  if(!full) return tr('Пресметни стойността на израза. После вземи всяко число поотделно: колко трябва да стане неговата част? Делението трябва да излиза без остатък.',
                      'Обчисли значення виразу. Потім візьми кожне число окремо: скільки має стати його частина? Ділення має виходити без остачі.');
  const n = q.n, [u1, u2, u3] = swapParts(n), to = q.to, ok = ' ✓', no = ' ✗';
  // each part: what it is, what it must become, and each of its two numbers changed to get there (or not) — or that it
  // would have to go below 0
  const part = (text, u, t, i, j, show) => text + ' = ' + u + (t < 0 ? tr(' → трябва да стане с ' + (u - t) + ' по-малко — не може', ' → має стати на ' + (u - t) + ' менше — не може') + no
    : tr(' → трябва ', ' → треба ') + t + ': ' + [i, j].map(k => to[k] ? show(k, to[k]) + ok : show(k, '?') + no).join(', '));
  const p1 = part(n[0] + ' : ' + n[1], u1, u1 + q.by, 0, 1, (k, x) => k ? n[0] + ' : ' + x : x + ' : ' + n[1]);
  const p2 = part(n[2] + ' · ' + n[3], u2, u2 + q.by, 2, 3, (k, x) => k === 3 ? n[2] + ' · ' + x : x + ' · ' + n[3]);
  const p3 = part(n[4] + ' : ' + n[5], u3, u3 - q.by, 4, 5, (k, x) => k === 5 ? n[4] + ' : ' + x : x + ' : ' + n[5]);
  const can = swapCan(q);
  return u1 + ' + ' + u2 + ' − ' + u3 + ' = ' + q.V + tr(', трябва ', ', треба ') + (q.V + q.by) + '. &nbsp;' + [p1, p2, p3].join('; &nbsp;') +
    ' &nbsp;→&nbsp; ' + can.map(([v]) => v).join(' + ') + ' = ' + q.ans;
}
KIND.swapone = { draw:drawSwapOne, eq:eqSwapOne, why:whySwapOne };
