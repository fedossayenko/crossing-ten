// Question kind 'digeq': level 165 Скритата цифра — One digit hidden under every ■ of an equality.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Пролет 2025, 1 клас, задача 7: 1■ + 2 = 20 − ■. The same digit everywhere; try them:
// with 4, 14 + 2 = 16 and 20 − 4 = 16 — equal, so ■ = 4. Задача 15: ■0 − 1■ = 3■ — 50 − 15 = 35, ■ = 5.
// A and B are the constants each form takes; a form is kept only when exactly one digit fits.
import { KIND, SLOT, bgWith, rnd, tr } from '../js/core.js';
const DIGEQ = ['1■ + A = B − ■', '■0 − 1■ = A■', '■ + ■ + A = 1■', '■ + 1■ = B', 'A■ + ■ = B', '2■ − ■ − ■ = B', '■■ − B = 1■'];
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
    return {kind:'digeq', f, e, near: near === undefined ? -1 : near, traps, ans: fit[0]};
  }
}
function drawDigEq(q){
  if(q.kind === 'digeq'){
    return '<div class="ask">' + tr('Под всяко ■ е скрита <b>една и съща</b> цифра. Коя е тя, за да е вярно равенството?',
      'Під кожним ■ схована <b>одна й та сама</b> цифра. Яка вона, щоб рівність була правильною?') + '</div>' +
      '<div class="line" style="font-size:clamp(26px,7.5vw,44px)">' + q.e + '</div>' +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">■ = ' + SLOT + '</div>';
  }
}
// a side that is a sum shows its working, a side that is one number just the number: 14 + 2 = 16, 20 − 4 = 16
const digEqTry = (q, d) => { const s = digEqSides(q.e, d); return q.e.split(' = ').map((t, i) => (t = t.replace(/■/g, d)).includes(' ') ? t + ' = ' + s[i] : t).join(', &nbsp;') + ' &nbsp;→&nbsp; ' + s[0] + (s[0] === s[1] ? ' = ' : ' ≠ ') + s[1]; };
function eqDigEq(q){
  if(q.kind === 'digeq') return q.e + ' → ■ = ' + q.ans;
}
function whyDigEq(q, full){
  if(q.kind === 'digeq'){
    if(!full) return tr('Опитай цифрите една по една: сложи я под всяко ■ и пресметни двете страни.',
      'Пробуй по черзі кожну цифру: постав її під кожне ■ і обчисли обидві сторони.');
    return (q.near >= 0 ? tr(bgWith(q.near) + ' ', 'з ') + q.near + ': ' + digEqTry(q, q.near) + tr(' — не са равни; ', ' — не рівні; ') : '') +
      tr(bgWith(q.ans) + ' ', 'з ') + q.ans + ': <b>' + digEqTry(q, q.ans) + '</b>' + tr(' — равни', ' — рівні') + ' &nbsp;→&nbsp; ■ = ' + q.ans;
  }
}
KIND.digeq = { draw:drawDigEq, eq:eqDigEq, why:whyDigEq };
