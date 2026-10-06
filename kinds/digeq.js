// Question kind 'digeq': level 165 Скритата цифра — One digit hidden under every ■ of an equality.

// МБГ Пролет 2025, 1 клас, задача 7: 1■ + 2 = 20 − ■. The same digit everywhere; try them:
// with 4, 14 + 2 = 16 and 20 − 4 = 16 — equal, so ■ = 4. Задача 15: ■0 − 1■ = 3■ — 50 − 15 = 35, ■ = 5.
// A and B are the constants each form takes; a form is kept only when exactly one digit fits.
// МБГ Полуфинал 2024, 1 клас, задача 6: 2■ + 4 = 30 − ■ — 23 + 4 = 27 = 30 − 3, ■ = 3. Полуфинал 2025, задача 8:
// 1■ + ■ = 19 − ■, and then 1■ − ■ is asked: ■ = 3, 13 − 3 = 10 — the ones take each other away, so it is 10 whatever ■ is.
import { KIND, SLOT, bgWith, rnd, tr } from '../js/core.js';
const DIGEQ = ['1■ + A = B − ■', '■0 − 1■ = A■', '■ + ■ + A = 1■', '■ + 1■ = B', 'A■ + ■ = B', '2■ − ■ − ■ = B', '■■ − B = 1■',
  '2■ + A = B − ■', '1■ + ■ = B − ■'];
const DIGEQ_CALC = 8;   // the form after which 1■ − ■ is asked
// every side worked left to right, and every number on the way a whole number from 0 to 99;
// a ■ leading a two-digit number cannot be 0. null when the digit does not make sense there.
function digEqSides(e, d){
  const sides = e.split(' = ').map(s => s.split(' '));
  if(sides.some(t => t.some(w => /^■\S/.test(w))) && d === 0) return null;
  const val = t => { let v = +t[0].replace(/■/g, d); for(let i = 1; i < t.length; i += 2){ const n = +t[i + 1].replace(/■/g, d); v = t[i] === '+' ? v + n : v - n; if(v < 0 || v > 99) return null; } return v; };
  const L = val(sides[0]), R = val(sides[1]);
  return L === null || R === null ? null : [L, R];
}
const digEqFits = e => [0,1,2,3,4,5,6,7,8,9].filter(d => { const s = digEqSides(e, d); return s && s[0] === s[1]; });
export function genDigEq(){
  for(;;){
    const f = rnd(DIGEQ.length), A = 1 + rnd(9), B = 10 + rnd(21);
    const e = DIGEQ[f].replace('A', String(A)).replace('B', String(B));
    const fit = digEqFits(e);
    if(fit.length !== 1) continue;
    const near = [fit[0] - 1, fit[0] + 1].find(d => d >= 0 && d <= 9 && digEqSides(e, d));   // one wrong try, to show what "not equal" looks like
    // as А/Б/В/Г the wrong options are digits too: the wrong try first, then the digits next to the answer
    const traps = [near, fit[0] + 2, fit[0] - 2, fit[0] + 3, fit[0] - 3].filter(d => d !== undefined && d >= 0 && d <= 9).slice(0, 3);
    if(f === DIGEQ_CALC){
      // the slips: ■ itself, 1■ not taken away from, 1■ + ■
      if(!fit[0]) continue;
      return {kind:'digeq', shape:'calc', f, e, near: near === undefined ? -1 : near, dig: fit[0], traps:[fit[0], 10 + fit[0], 10 + 2*fit[0]], ans: 10};
    }
    return {kind:'digeq', f, e, near: near === undefined ? -1 : near, traps, ans: fit[0]};
  }
}
// МБГ Полуфинал 2024, 1 клас, задача 3: ☺ = ?  2☺ − 2 − 4 = 16. One digit, hidden once: the steps undone,
// 16 + 2 + 4 = 22, so 2☺ = 22 and ☺ = 2. Kept with ■ in e (as every form is worked out); drawn with q.sym.
export function genDigEqOne(){
  for(;;){
    const T = 1 + rnd(3), d = rnd(10), A = 1 + rnd(6), B = 1 + rnd(6), sA = Math.random() < 0.6 ? '−' : '+', sB = Math.random() < 0.6 ? '−' : '+';
    const step = (v, s, n) => s === '+' ? v + n : v - n, C = step(step(10*T + d, sA, A), sB, B), e = T + '■ ' + sA + ' ' + A + ' ' + sB + ' ' + B + ' = ' + C;
    const fit = digEqFits(e);
    if(fit.length !== 1 || fit[0] !== d) continue;
    // the slips: 2☺ read straight off the 16, or the steps done again instead of undone (16 − 2 − 4 = 10)
    const again = step(step(C, sA, A), sB, B);
    return {kind:'digeq', shape:'one', sym:'☺', e, traps:[C % 10, again % 10].filter((v, i, a) => v >= 0 && v !== d && a.indexOf(v) === i), ans: d};
  }
}
const digEqShown = q => q.e.replace(/■/g, q.sym);
function drawDigEq(q){
  if(q.shape === 'one'){
    return '<div class="ask">' + tr('Под ' + q.sym + ' е скрита цифра. Коя е тя?', 'Під ' + q.sym + ' схована цифра. Яка це цифра?') + '</div>' +
      '<div class="line" style="font-size:clamp(26px,7.5vw,44px)">' + digEqShown(q) + '</div>' +
      '<div class="line lg">' + q.sym + ' = ' + SLOT + '</div>';
  }
  if(q.shape === 'calc'){
    return '<div class="ask">' + tr('Една и съща цифра е закрита с квадрати:', 'Одну й ту саму цифру закрито квадратами:') + '</div>' +
      '<div class="line" style="font-size:clamp(26px,7.5vw,44px)">' + q.e + '</div>' +
      '<div class="ask">' + tr('Пресметнете 1■ − ■.', 'Обчисліть 1■ − ■.') + '</div>' +
      '<div class="line lg">1■ − ■ = ' + SLOT + '</div>';
  }
  return '<div class="ask">' + tr('Под всяко ■ е скрита <b>една и съща</b> цифра. Коя е тя, за да е вярно равенството?',
    'Під кожним ■ схована <b>одна й та сама</b> цифра. Яка вона, щоб рівність була правильною?') + '</div>' +
    '<div class="line" style="font-size:clamp(26px,7.5vw,44px)">' + q.e + '</div>' +
    '<div class="line lg">■ = ' + SLOT + '</div>';
}
// a side that is a sum shows its working, a side that is one number just the number: 14 + 2 = 16, 20 − 4 = 16
const digEqTry = (q, d) => { const s = digEqSides(q.e, d); return q.e.split(' = ').map((t, i) => (t = t.replace(/■/g, d)).includes(' ') ? t + ' = ' + s[i] : t).join(', &nbsp;') + ' &nbsp;→&nbsp; ' + s[0] + (s[0] === s[1] ? ' = ' : ' ≠ ') + s[1]; };
function eqDigEq(q){
  if(q.shape === 'one') return digEqShown(q) + ' → ' + q.sym + ' = ' + q.ans;
  if(q.shape === 'calc') return q.e + ' → ■ = ' + q.dig + ' → ' + (10 + q.dig) + ' − ' + q.dig + ' = ' + q.ans;
  return q.e + ' → ■ = ' + q.ans;
}
function whyDigEq(q, full){
  if(q.shape === 'one'){
    if(!full) return tr('Върни стъпките назад от числото вдясно: каквото е извадено, прибави го; каквото е прибавено, извади го.',
      'Поверни кроки назад від числа праворуч: що відняли — додай, що додали — відніми.');
    const w = q.e.split(' '), X = 10*parseInt(w[0], 10) + q.ans, back = s => s === '−' ? '+' : '−';
    return tr('връщаме стъпките: ', 'повертаємо кроки: ') + w[6] + ' ' + back(w[1]) + ' ' + w[2] + ' ' + back(w[3]) + ' ' + w[4] + ' = ' + X +
      ' &nbsp;→&nbsp; ' + w[0].replace('■', q.sym) + ' = ' + X + ' &nbsp;→&nbsp; <b>' + q.sym + ' = ' + q.ans + '</b>';
  }
  if(q.shape === 'calc'){
    if(!full) return tr('Намери ■: опитай цифрите една по една. Или забележи: 1■ и ■ имат една и съща цифра на единиците.',
      'Знайди ■: пробуй цифри по черзі. Або зауваж: у 1■ і ■ та сама цифра одиниць.');
    return (q.near >= 0 ? tr(bgWith(q.near) + ' ', 'з ') + q.near + ': ' + digEqTry(q, q.near) + tr(' — не са равни; ', ' — не рівні; ') : '') +
      tr(bgWith(q.dig) + ' ', 'з ') + q.dig + ': ' + digEqTry(q, q.dig) + tr(' — равни', ' — рівні') + ' &nbsp;→&nbsp; ■ = ' + q.dig +
      ' &nbsp;→&nbsp; <b>' + (10 + q.dig) + ' − ' + q.dig + ' = ' + q.ans + '</b>' + tr(' (единиците се изваждат една от друга, остава ', ' (одиниці віднімаються одна від одної, лишається ') + q.ans + ')';
  }
  if(!full) return tr('Опитай цифрите една по една: сложи я под всяко ■ и пресметни двете страни.',
    'Пробуй по черзі кожну цифру: постав її під кожне ■ і обчисли обидві сторони.');
  return (q.near >= 0 ? tr(bgWith(q.near) + ' ', 'з ') + q.near + ': ' + digEqTry(q, q.near) + tr(' — не са равни; ', ' — не рівні; ') : '') +
    tr(bgWith(q.ans) + ' ', 'з ') + q.ans + ': <b>' + digEqTry(q, q.ans) + '</b>' + tr(' — равни', ' — рівні') + ' &nbsp;→&nbsp; ■ = ' + q.ans;
}
KIND.digeq = { draw:drawDigEq, eq:eqDigEq, why:whyDigEq };
