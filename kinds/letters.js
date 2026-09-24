// Question kind 'letters': level 89 C + 1A + B7 = 86 — Letters for digits, where only one tens digit can work.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Зима 2024, задача 18: C + 1A + B7 = 86, different letters different digits. Take
// the known digits away: C + A + 10·B = 69. Two digits add to at most 17, so B is 6 and
// C + A = 9 — which is all the question C + A − B needs, without finding A or C.
function lettersSolve(d, e, N){
  const out = [];
  for(let A = 0; A <= 9; A++) for(let B = 1; B <= 9; B++) for(let C = 0; C <= 9; C++)
    if(A !== B && B !== C && A !== C && C + 10*d + A + 10*B + e === N) out.push({A, B, C});
  return out;
}
function genLetters(){
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
  if(q.kind === 'letters'){
    return '<div class="ask">' + tr('В числовото равенство', 'У числовій рівності') + '</div>' +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)"><span class="num">' + lettersSum(q) + '</span></div>' +
      '<div class="ask">' + tr('на различните букви съответстват <b>различни цифри</b>. Пресметнете <span class="num">' + lettersAsk(q) + '</span>.',
                              'різним буквам відповідають <b>різні цифри</b>. Обчисліть <span class="num">' + lettersAsk(q) + '</span>.') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqLetters(q){
  if(q.kind === 'letters') return 'B = ' + q.B + ', C + A = ' + q.CA + ' → ' + lettersAsk(q) + ' = ' + q.ans;
}
function whyLetters(q, full){
  if(q.kind === 'letters'){
    if(!full) return tr('Раздели двуцифрените на десетици и единици. Колко най-много може да е сборът на две различни цифри?',
                        'Розклади двоцифрові на десятки й одиниці. Скільки найбільше може бути сума двох різних цифр?');
    return q.d + 'A = ' + 10*q.d + ' + A, B' + q.e + ' = B ' + tr('десетици', 'десятків') + ' + ' + q.e + ' &nbsp;→&nbsp; C + A + ' +
      tr('B десетици = ', 'B десятків = ') + q.N + ' − ' + (10*q.d + q.e) + ' = ' + q.R + ' &nbsp;→&nbsp; ' +
      tr('C + A е най-много 17, значи B = ', 'C + A щонайбільше 17, отже B = ') + q.B + ', C + A = <b>' + q.CA + '</b> &nbsp;→&nbsp; ' +
      (q.minus ? q.CA + ' − ' + q.B : q.CA + ' + ' + q.B) + ' = ' + q.ans;
  }
}
KIND.letters = { draw:drawLetters, eq:eqLetters, why:whyLetters };
