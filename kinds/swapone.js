// Question kind 'swapone': level 248 Смени едно число — Change one number of an expression so its value goes up (or down) by 1.

// МБГ Есен 2023, 3 клас, задача 18: 6 : 3 + 2 · 2 − 10 : 2 = 2 + 4 − 5 = 1. Change exactly one number so it comes to 2: 6 → 9
// (9 : 3 = 3), 3 → 2 (6 : 2 = 3), 10 → 8 (8 : 2 = 4). The 2 · 2 would have to make 5 and 10 : □ would have to make 4 — no
// whole number does either. The numbers that can be changed add to 6 + 3 + 10 = 19. Asked the same way with other numbers,
// and with «намали с 1» and «увеличи с 2» (then the product may change too: 3 · 2 + 2 = 4 · 2).
import { KIND, SLOT, rnd, tr } from '../js/core.js';
// the value of a : b + c · d − e : f, and the three parts
const swapParts = n => [n[0] / n[1], n[2] * n[3], n[4] / n[5]];
// what each number would have to become, or 0 when no whole number above 0 does it: the part it stands in must move by
// the change (the part taken away the other way)
function swapTo(n, by){
  const [u1, u2, u3] = swapParts(n), t1 = u1 + by, t2 = u2 + by, t3 = u3 - by;
  const div = (x, y) => y > 0 && x % y === 0 ? x / y : 0;
  return [t1 * n[1], div(n[0], t1), div(t2, n[3]), div(t2, n[2]), t3 * n[5], div(n[4], t3)];
}
export function genSwapOne(){
  const r0 = Math.random(), by = r0 < 0.6 ? 1 : r0 < 0.8 ? -1 : 2;
  for(;;){
    const b = 2 + rnd(4), a = b*(1 + rnd(9)), c = 2 + rnd(4), d = 2 + rnd(4), f = 2 + rnd(4), e = f*(1 + rnd(9)), n = [a, b, c, d, e, f];
    const [u1, u2, u3] = swapParts(n), V = u1 + u2 - u3;
    // the value and the new one above 0, and every part's new value too: no number need become 0
    if(V < 1 || V + by < 1 || u1 + by < 1 || u3 - by < 1) continue;
    const to = swapTo(n, by), can = n.filter((_, i) => to[i]), cannot = n.filter((_, i) => !to[i]);
    // «the numbers that can be changed» must read one way: none of them twice, and none also standing where it cannot be
    if(new Set(can).size !== can.length || can.some(v => cannot.includes(v))) continue;
    const ans = can.reduce((s, v) => s + v, 0), all = n.reduce((s, v) => s + v, 0);
    // the slips: every number counted, or only the two that are divided
    return {kind:'swapone', n, by, V, to, traps:[all, a + e].filter(v => v !== ans), ans};
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
  // each part: what it is, what it must become, and each of its two numbers changed to get there (or not)
  const part = (text, u, t, i, j, show) => text + ' = ' + u + tr(' → трябва ', ' → треба ') + t + ': ' + [i, j].map(k => to[k] ? show(k, to[k]) + ok : show(k, '?') + no).join(', ');
  const p1 = part(n[0] + ' : ' + n[1], u1, u1 + q.by, 0, 1, (k, x) => k ? n[0] + ' : ' + x : x + ' : ' + n[1]);
  const p2 = part(n[2] + ' · ' + n[3], u2, u2 + q.by, 2, 3, (k, x) => k === 3 ? n[2] + ' · ' + x : x + ' · ' + n[3]);
  const p3 = part(n[4] + ' : ' + n[5], u3, u3 - q.by, 4, 5, (k, x) => k === 5 ? n[4] + ' : ' + x : x + ' : ' + n[5]);
  const can = swapCan(q);
  return u1 + ' + ' + u2 + ' − ' + u3 + ' = ' + q.V + tr(', трябва ', ', треба ') + (q.V + q.by) + '. &nbsp;' + [p1, p2, p3].join('; &nbsp;') +
    ' &nbsp;→&nbsp; ' + can.map(([v]) => v).join(' + ') + ' = ' + q.ans;
}
KIND.swapone = { draw:drawSwapOne, eq:eqSwapOne, why:whySwapOne };
