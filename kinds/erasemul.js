// Question kind 'erasemul': level 64 Изтрий цифри — Erase digits from a product so that it makes the number asked for.
// Level 232: erase two digits to come as close as possible to a number (genEraseNear, shape 'near').

// МБГ Есен, 3 клас, задача 6: erase three digits in 12 · 31 · 41 so the result is 24; the sum
// of the erased digits. With the three 1s gone it is 2 · 3 · 4 = 24, so 3. Each number keeps a
// digit, every way of erasing is tried, and all the ways that reach the target erase the same sum.
import { KIND, SLOT, rnd, tr } from '../js/core.js';
// drop: a number may lose all its digits too, and then it is left out of vals (the product of the rest)
export function eraseWays(nums, k, drop){
  const per = nums.map(n => {
    const s = String(n), out = [];
    for(let m = 0; m < (1 << s.length) - (drop ? 0 : 1); m++){   // m: which digits go; never all of them, unless drop
      let keep = '', gone = [];
      for(let i = 0; i < s.length; i++) (m & (1 << i)) ? gone.push(+s[i]) : keep += s[i];
      out.push({ v: keep === '' ? null : +keep, gone });
    }
    return out;
  });
  const ways = [];
  (function walk(i, vals, gone){
    if(gone.length > k) return;
    if(i === nums.length){ if(gone.length === k) ways.push({ vals, gone }); return; }
    per[i].forEach(o => walk(i + 1, o.v === null ? vals : vals.concat(o.v), gone.concat(o.gone)));
  })(0, [], []);
  return ways;
}
export function genEraseMul(){
  for(;;){
    const nums = [0, 0, 0].map(() => 10*(1 + rnd(9)) + 1 + rnd(9));    // no 0 digit, so nothing leads with a 0
    const ways = eraseWays(nums, 3), w = ways[rnd(ways.length)];
    const T = w.vals.reduce((a, b) => a*b, 1);
    if(T < 2 || T > 999) continue;
    const hit = ways.filter(x => x.vals.reduce((a, b) => a*b, 1) === T), sum = g => g.reduce((a, b) => a + b, 0);
    if(hit.some(x => sum(x.gone) !== sum(w.gone))) continue;               // the answer must not depend on the way
    return {kind:'erasemul', nums, T, kept: w.vals, gone: w.gone, ans: sum(w.gone)};
  }
}
// МБГ Есен 2024, 3 клас, задача 5 (level 232, shape 'near'): erase two digits in 13 · 52 · 6 so the result is as close
// as possible to 35; the sum of the erased digits. The 6 cannot go (nothing would be left of it), so one digit goes from
// each two-digit number: 30, 12, 90 or 36, and 36 is the closest, with the 1 and the 5 gone: 6. T is never reached
// exactly, one product alone is closest, and every way to it erases the same sum. The text does not say that every
// number keeps a digit, so the answer must also stand when an emptied number drops out (25 · 31 · 4 near 25 would
// be 2 · 3 · 4 = 24, erasing 6, but 25 · 1 = 25 erasing 7): every way closest then still erases the same sum.
const prodOf = a => a.reduce((x, y) => x*y, 1), sumOf = a => a.reduce((x, y) => x + y, 0);
export function genEraseNear(){
  for(;;){
    const nums = [10*(1 + rnd(9)) + 1 + rnd(9), 10*(1 + rnd(9)) + 1 + rnd(9), 2 + rnd(8)];
    const ways = eraseWays(nums, 2), w = ways[rnd(ways.length)], best = prodOf(w.vals);
    const T = best + (rnd(2) ? 1 : -1)*(1 + rnd(2));
    const dist = ways.map(x => Math.abs(prodOf(x.vals) - T)), min = Math.min(...dist);
    const near = ways.filter((_, i) => dist[i] === min);
    if(T < 2 || min === 0 || near.some(x => prodOf(x.vals) !== best || sumOf(x.gone) !== sumOf(w.gone))) continue;
    const any = eraseWays(nums, 2, true), dAny = any.map(x => Math.abs(prodOf(x.vals) - T)), minAny = Math.min(...dAny);
    if(any.some((x, i) => dAny[i] === minAny && sumOf(x.gone) !== sumOf(w.gone))) continue;
    // the closest product itself, and the erased sum of the runner-up
    const next = ways.filter((_, i) => dist[i] > min).sort((x, y) => Math.abs(prodOf(x.vals) - T) - Math.abs(prodOf(y.vals) - T))[0];
    const traps = [best, next ? sumOf(next.gone) : -1].filter((v, i, all) => v >= 0 && v < 1000 && v !== sumOf(w.gone) && all.indexOf(v) === i);
    return {kind:'erasemul', shape:'near', nums, T, best, kept: w.vals, gone: w.gone, traps, ans: sumOf(w.gone)};
  }
}
function drawEraseMul(q){
  if(q.shape === 'near') return '<div class="ask">' + tr('Изтрийте <b>две</b> цифри в записа', 'Зітріть <b>дві</b> цифри в записі') + '</div>' +
    '<div class="given">' + q.nums.join(' · ') + '</div>' +
    '<div class="ask">' + tr('така че резултатът да бъде възможно най-близък до <span class="num">' + q.T + '</span>. Колко е сборът от изтритите цифри?',
      'так, щоб результат був якомога ближчим до <span class="num">' + q.T + '</span>. Чому дорівнює сума зітертих цифр?') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
  return '<div class="ask">' + tr('Изтрийте <b>три</b> цифри в израза', 'Зітріть <b>три</b> цифри у виразі') + '</div>' +
    '<div class="given">' + q.nums.join(' · ') + '</div>' +
    '<div class="ask">' + tr('така че резултатът да бъде <span class="num">' + q.T + '</span>. Колко е сборът от изтритите цифри?',
      'так, щоб результат дорівнював <span class="num">' + q.T + '</span>. Чому дорівнює сума зітертих цифр?') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqEraseMul(q){
  if(q.shape === 'near') return q.kept.join(' · ') + ' = ' + q.best + tr(', най-близо до ', ', найближче до ') + q.T + ' → ' + q.gone.join(' + ') + ' = ' + q.ans;
  return q.kept.join(' · ') + ' = ' + q.T + ' → ' + q.gone.join(' + ') + ' = ' + q.ans;
}
function whyEraseMul(q, full){
  if(q.shape === 'near'){
    if(!full) return tr('Никое число не бива да изчезне: от всяко двуцифрено изтрий по една цифра. Кое произведение е най-близо?',
                        'Жодне число не має зникнути: у кожному двоцифровому зітри по одній цифрі. Який добуток найближчий?');
    const all = eraseWays(q.nums, 2).map(x => x.vals.join(' · ') + ' = ' + prodOf(x.vals)).map(s => s === q.kept.join(' · ') + ' = ' + q.best ? '<b>' + s + '</b>' : s);
    return all.join(', ') + ' &nbsp;→&nbsp; ' + tr('най-близо до ' + q.T + ' е ', 'найближче до ' + q.T + ' — ') + q.best + ' &nbsp;→&nbsp; ' +
      tr('изтрити: ', 'зітерто: ') + q.gone.join(' + ') + ' = ' + q.ans;
  }
  if(!full) return tr('Кои три множителя, останали от числата, дават ' + q.T + '?', 'Які три множники, що залишаться від чисел, дають ' + q.T + '?');
  return q.kept.join(' · ') + ' = ' + q.T + ' &nbsp;→&nbsp; ' + tr('изтрити: ', 'зітерто: ') + q.gone.join(' + ') + ' = ' + q.ans;
}
KIND.erasemul = { draw:drawEraseMul, eq:eqEraseMul, why:whyEraseMul };
