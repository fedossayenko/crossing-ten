// Question kind 'letters': level 89 C + 1A + B7 = 86 — Letters for digits, where only one tens digit can work.

// МБГ Зима 2024, задача 18: C + 1A + B7 = 86, different letters different digits. Take
// the known digits away: C + A + 10·B = 69. Two digits add to at most 17, so B is 6 and
// C + A = 9 — which is all the question C + A − B needs, without finding A or C.
import { KIND, answerLine, rnd, tr } from '../js/core.js';
export function lettersSolve(d, e, N){
  const out = [];
  for(let A = 0; A <= 9; A++) for(let B = 1; B <= 9; B++) for(let C = 0; C <= 9; C++)
    if(A !== B && B !== C && A !== C && C + 10*d + A + 10*B + e === N) out.push({A, B, C});
  return out;
}
export function genLetters(){
  const q = genLettersOld();
  return Math.random() < 0.2 ? genLettersTwo() : q;   // drawn after the old shape, so it keeps its seeds
}
// Салабашев 2022, задача 14 (shape 'two'): КА + НА = 46, different letters different digits, К + А + Н + А? The ones: A + A ends in 6, so A is 3 or 8;
// the tens: К + Н is 4 or 3, and 4 = 1 + 3 would use A = 3 again, so А = 8, К + Н = 3 (1 and 2) and the answer is 3 + 8 + 8 = 19. A leading digit is not 0.
// Every solution is tried, and only a sum that all of them agree on is drawn.
export const lettersTwoSolve = N => {
  const out = [];
  for(let K = 1; K <= 9; K++) for(let H = 1; H <= 9; H++) for(let A = 0; A <= 9; A++)
    if(K !== H && K !== A && H !== A && 10*K + A + 10*H + A === N) out.push({K, H, A});
  return out;
};
function genLettersTwo(){
  for(;;){
    const K = 1 + rnd(9), H = 1 + rnd(9), A = rnd(10);
    if(K === H || K === A || H === A) continue;
    const N = 10*(K + H) + 2*A;
    if(N > 99) continue;
    const sols = lettersTwoSolve(N), v = sols[0].K + sols[0].H + 2*sols[0].A;
    if(sols.some(s => s.K + s.H + 2*s.A !== v) || new Set(sols.map(s => s.A)).size !== 1) continue;
    return {kind:'letters', shape:'two', N, A: sols[0].A, KH: sols[0].K + sols[0].H, ans: v};
  }
}
function genLettersOld(){
  for(;;){
    const d = 1 + rnd(4), e = rnd(10), minus = Math.random() < 0.7;
    const B = 1 + rnd(8), A = rnd(10), C = rnd(10);
    if(A === B || B === C || A === C) continue;
    const N = C + 10*d + A + 10*B + e;
    if(N > 99) continue;                                    // 2nd grade: within a hundred
    const sols = lettersSolve(d, e, N), val = s => minus ? s.C + s.A - s.B : s.A + s.B + s.C;
    const vals = new Set(sols.map(val));
    if(vals.size !== 1 || new Set(sols.map(s => s.B)).size !== 1 || val(sols[0]) < 0 || sols.length < 2) continue;
    const R = N - 10*d - e;
    return {kind:'letters', d, e, N, R, B, CA: R - 10*B, minus, ans: val(sols[0])};
  }
}
const lettersSum = q => 'C + ' + q.d + 'A + B' + q.e + ' = ' + q.N;
const lettersAsk = q => q.minus ? 'C + A − B' : 'A + B + C';
function drawLetters(q){
  if(q.shape === 'two') return '<div class="ask">' + tr('В ребуса', 'У ребусі') + '</div><div class="line md"><span class="num">КА + НА = ' + q.N + '</span></div>' +
    '<div class="ask">' + tr('на еднаквите букви съответстват <b>еднакви цифри</b>, а на различните букви — <b>различни цифри</b>. На колко е равен сборът <span class="num">К + А + Н + А</span>?',
      'однаковим буквам відповідають <b>однакові цифри</b>, а різним буквам — <b>різні цифри</b>. Чому дорівнює сума <span class="num">К + А + Н + А</span>?') + '</div>' + answerLine('xl');
  return '<div class="ask">' + tr('В числовото равенство', 'У числовій рівності') + '</div>' +
    '<div class="line md"><span class="num">' + lettersSum(q) + '</span></div>' +
    '<div class="ask">' + tr('на различните букви съответстват <b>различни цифри</b>. Пресметнете <span class="num">' + lettersAsk(q) + '</span>.',
                            'різним буквам відповідають <b>різні цифри</b>. Обчисліть <span class="num">' + lettersAsk(q) + '</span>.') + '</div>' +
    answerLine('xl');
}
function eqLetters(q){
  if(q.shape === 'two') return 'А = ' + q.A + ', К + Н = ' + q.KH + tr(' → сбор: ', ' → сума: ') + 'К + А + Н + А = ' + q.KH + ' + ' + q.A + ' + ' + q.A + ' = ' + q.ans;
  return 'B = ' + q.B + ', C + A = ' + q.CA + ' → ' + lettersAsk(q) + ' = ' + q.ans;
}
function whyLetters(q, full){
  if(q.shape === 'two'){
    if(!full) return tr('Започни от единиците: А + А завършва на цифрата на единиците на сбора. После десетиците.', 'Почни з одиниць: А + А закінчується на цифру одиниць суми. Потім десятки.');
    return 'А + А = ' + 2*q.A + tr(', завършва на ', ', закінчується на ') + q.N % 10 + ' &nbsp;→&nbsp; <b>А = ' + q.A + '</b>, ' + tr('десетиците: ', 'десятки: ') + 'К + Н = ' + q.KH + ' &nbsp;→&nbsp; ' + q.KH + ' + ' + q.A + ' + ' + q.A + ' = ' + q.ans;
  }
  if(!full) return tr('Раздели двуцифрените на десетици и единици. Колко най-много може да е сборът на две различни цифри?',
                      'Розклади двоцифрові на десятки й одиниці. Скільки найбільше може бути сума двох різних цифр?');
  return q.d + 'A = ' + 10*q.d + ' + A, B' + q.e + ' = B ' + tr('десетици', 'десятків') + ' + ' + q.e + ' &nbsp;→&nbsp; C + A + ' +
    tr('B десетици = ', 'B десятків = ') + q.N + ' − ' + (10*q.d + q.e) + ' = ' + q.R + ' &nbsp;→&nbsp; ' +
    tr('C + A е най-много 17, значи B = ', 'C + A щонайбільше 17, отже B = ') + q.B + ', C + A = <b>' + q.CA + '</b> &nbsp;→&nbsp; ' +
    (q.minus ? q.CA + ' − ' + q.B : q.CA + ' + ' + q.B) + ' = ' + q.ans;
}
KIND.letters = { draw:drawLetters, eq:eqLetters, why:whyLetters };
