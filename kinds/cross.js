// Question kind 'cross': level 44 Зачеркни — Cross out one digit to make it true.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 19: one digit struck out makes the equation true. Built backwards, then every
// possible deletion is tried so the digit to cross is never in doubt.
function genCross(){
  for(;;){
    const A = 10*(1 + rnd(5)), C = 10*(1 + rnd(5)), B = 10*(1 + rnd(9));
    const D = A + C;
    if(D > 99) continue;
    const parts = [A, B, C, D];
    const hits = [];
    for(let t = 0; t < 4; t++){
      const str = String(parts[t]);
      for(let i = 0; i < str.length; i++){
        const left = str.slice(0, i) + str.slice(i + 1);
        if(left === '') continue;
        const p2 = parts.slice();
        p2[t] = Number(left);
        if(p2[0] + p2[1] + p2[2] === p2[3]) hits.push({t, i, digit: +str[i], left: p2[t]});
      }
    }
    const values = new Set(hits.map(h => h.digit));
    if(!hits.length || values.size !== 1) continue;      // the digit to cross must be beyond doubt
    return {kind:'cross', A, B, C, D, hit: hits[0], ans: hits[0].digit};
  }
}

function drawCross(q){
  if(q.kind === 'cross'){
    return '<div class="ask">' + tr('Коя цифра трябва да се зачеркне, за да се получи вярно равенство?', 'Яку цифру треба закреслити, щоб вийшла правильна рівність?') + '</div>' +
      '<div class="given">' + q.A + ' + ' + q.B + ' + ' + q.C + ' = ' + q.D + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqCross(q){
  if(q.kind === 'cross') return q.A + ' + ' + q.B + ' + ' + q.C + ' = ' + q.D + tr(' → зачерква се ', ' → закреслюємо ') + q.ans;
}
function whyCross(q, full){
  if(q.kind === 'cross'){
    const names = ['първото число', 'второто число', 'третото число', 'сбора'];
    const after = [q.A, q.B, q.C, q.D];
    after[q.hit.t] = q.hit.left;
    const ukIn = ['у першому числі', 'у другому числі', 'у третьому числі', 'у сумі'];
    return !full ? tr('Пресметни лявата страна — с колко се разминава?', 'Обчисли ліву сторону — на скільки вона відрізняється від правої?')
      : q.A + ' + ' + q.B + ' + ' + q.C + ' = ' + (q.A + q.B + q.C) + tr(', а трябва ', ', а має бути ') + q.D +
        ' &nbsp;→&nbsp; ' + tr((/^[вф]/.test(names[q.hit.t]) ? 'във ' : 'в ') + names[q.hit.t] + ' зачеркваме <b>',
                               ukIn[q.hit.t] + ' закреслюємо <b>') + q.ans + '</b>: ' +
        after[0] + ' + ' + after[1] + ' + ' + after[2] + ' = ' + after[3] + tr(' &nbsp;→&nbsp; цифрата е ', ' &nbsp;→&nbsp; це цифра ') + q.ans;
  }
}
KIND.cross = { draw:drawCross, eq:eqCross, why:whyCross };
