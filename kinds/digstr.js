// Question kind 'digstr': level 205 Цифра по цифра — A run of numbers written one digit at a time, two digits hidden.

// МБГ Полуфинал 2024, 1 клас, задача 4: ● + ■ = ?  1, 3, 5, 7, 9, ●, 1, 1, ■, 1, 5, 1, 7, 1, 9. The odd numbers up to
// 19, written digit by digit: after 9 comes 11 — 1, 1 — then 13 — 1, 3 — so ● = 1, ■ = 3 and ● + ■ = 4.
// The one-digit numbers are all shown; the two hidden digits are in two different two-digit numbers, not the last.
import { KIND, SLOT, rnd, tr } from '../js/core.js';
const DIGSTR = [[1, 2], [2, 2], [1, 1]];   // [first, step]: the odd numbers, the even ones, every number
const digStrNums = q => { const r = []; for(let v = q.a; v <= q.to; v += q.step) r.push(v); return r; };
const digStrDigs = q => digStrNums(q).join('').split('').map(Number);
// the two-digit number a digit of the row belongs to, by its place (the one-digit numbers fill the start)
const digStrNumAt = (q, k) => { const ns = digStrNums(q), one = ns.filter(v => v < 10).length; return ns[one + Math.floor((k - one) / 2)]; };
export function genDigStr(){
  for(;;){
    const [a, step] = DIGSTR[rnd(3)], to = step === 1 ? 13 + rnd(3) : 15 + rnd(7);   // every number: to 15 at most, or the row gets too long
    if((to - a) % step) continue;
    const q = {kind:'digstr', a, step, to}, digs = digStrDigs(q), one = digStrNums(q).filter(v => v < 10).length;
    const i = one + rnd(digs.length - one), j = one + rnd(digs.length - one);
    if(digStrNumAt(q, i) === digStrNumAt(q, j) || Math.max(digStrNumAt(q, i), digStrNumAt(q, j)) === to) continue;   // a number after both, to show the run goes on
    const hide = [Math.min(i, j), Math.max(i, j)], pal = k => k + ((k - one) % 2 ? -1 : 1);   // pal: the other digit of the same number
    // the slips: the two numbers added instead of the digits, or their other digits
    const traps = [digStrNumAt(q, hide[0]) + digStrNumAt(q, hide[1]), digs[pal(hide[0])] + digs[pal(hide[1])]];
    return Object.assign(q, {hide, traps: traps.filter((v, k) => v !== digs[hide[0]] + digs[hide[1]] && traps.indexOf(v) === k), ans: digs[hide[0]] + digs[hide[1]]});
  }
}
const digStrRow = q => digStrDigs(q).map((d, k) => k === q.hide[0] ? '●' : k === q.hide[1] ? '■' : d).join(', ');
function drawDigStr(q){
  return '<div class="ask">' + tr('Пресметни ● + ■.', 'Обчисли ● + ■.') + '</div>' +
    '<div class="given" style="font-size:clamp(16px,4.4vw,26px)">' + digStrRow(q) + '.</div>' +
    '<div class="line lg">● + ■ = ' + SLOT + '</div>';
}
// 11 → 1, 1 for the number each hidden digit is in
const digStrSplit = (q, k) => { const n = digStrNumAt(q, k); return n + ' → ' + String(n).split('').join(', '); };
function eqDigStr(q){
  const digs = digStrDigs(q);
  return digStrSplit(q, q.hide[0]) + '; ' + digStrSplit(q, q.hide[1]) + ' → ' + digs[q.hide[0]] + ' + ' + digs[q.hide[1]] + ' = ' + q.ans;
}
function whyDigStr(q, full){
  if(!full) return tr('След едноцифрените числа идват двуцифрените, но всяко е записано цифра по цифра, със запетая между цифрите.',
    'Після одноцифрових чисел ідуть двоцифрові, але кожне записано цифра за цифрою, з комою між цифрами.');
  const digs = digStrDigs(q), n1 = digStrNumAt(q, q.hide[0]), n2 = digStrNumAt(q, q.hide[1]);
  const say = n => String(n).split('').join(', ');
  return tr('числата са ', 'числа: ') + digStrNums(q).join(', ') + ' &nbsp;→&nbsp; ' +
    n1 + tr(' се пише ', ' пишуть ') + say(n1) + tr(', а ', ', а ') + n2 + ' — ' + say(n2) + ' &nbsp;→&nbsp; ● = ' + digs[q.hide[0]] + ', ■ = ' + digs[q.hide[1]] +
    ' &nbsp;→&nbsp; <b>' + digs[q.hide[0]] + ' + ' + digs[q.hide[1]] + ' = ' + q.ans + '</b>';
}
KIND.digstr = { draw:drawDigStr, eq:eqDigStr, why:whyDigStr };
