// Question kind 'multiple': level 49 Кратни — The smallest count that splits into equal parts both ways.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

const GARDEN = [['рози','розите','градината'], ['ябълки','ябълките','кошницата'],
                ['картички','картичките','кутията'], ['мидички','мидичките','торбичката']];

// Задача 17: "a sum of p equal addends" is another way of saying "divides by p". Wanted
// both ways at once, so the count divides by both — and the smallest one past the bound.
const PAIRS = [[2,3,6], [2,4,4], [2,5,10], [3,4,12], [2,6,6], [2,7,14], [3,2,6], [4,3,12]];
function genMultiple(){
  if(Math.random() < 0.25){
    // Зима 2021: how many of 1 … 20 can be written both ways — the multiples of 6: 6, 12, 18
    const [p, r, L] = PAIRS[rnd(PAIRS.length)], N = L*(2 + rnd(3)) + rnd(L);
    const list = []; for(let v = L; v <= N; v += L) list.push(v);
    return {kind:'multiple', shape:'count', p, r, L, N, list, ans: list.length};
  }
  const [p, r, L] = PAIRS[rnd(PAIRS.length)];
  const t = 2 + rnd(4);
  const N = L*t + 1 + rnd(L - 1);              // never a multiple itself, so "more than" is clear cut
  return {kind:'multiple', g: GARDEN[rnd(GARDEN.length)], p, r, L, N, ans: L*(t + 1)};
}

// Ukrainian [where, noun in the genitive plural], keyed by the Bulgarian noun
const multipleUk = {'рози':['У саду','троянд'], 'ябълки':['У кошику','яблук'],
                    'картички':['У коробці','листівок'], 'мидички':['У торбинці','черепашок']};
const multipleUkGen = {2:'двох', 3:'трьох', 4:'чотирьох', 5:'п’яти', 6:'шести', 7:'семи'};
function drawMultiple(q){
  if(q.kind === 'multiple' && q.shape === 'count'){
    return '<div class="ask">' + tr('Колко от числата от <span class="num">1</span> до <span class="num">' + q.N + '</span> можем да запишем и като сбор на <b>' + BGNUM[q.p] + ' равни</b> събираеми, и като сбор на <b>' + BGNUM[q.r] + ' равни</b> събираеми?',
      'Скільки чисел від <span class="num">1</span> до <span class="num">' + q.N + '</span> можна записати і як суму <b>' + multipleUkGen[q.p] + ' однакових</b> доданків, і як суму <b>' + multipleUkGen[q.r] + ' однакових</b> доданків?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'multiple'){
    const uk = multipleUk[q.g[0]];
    return '<div class="ask">' + tr('В ' + q.g[2] + ' има <b>повече от</b> <span class="num">' + q.N + '</span> ' + q.g[0] +
      '. Техният брой можем да запишем като сбор на <b>' + BGNUM[q.p] + ' равни</b> събираеми и като сбор на <b>' +
      BGNUM[q.r] + ' равни</b> събираеми. Колко <b>най-малко</b> може да са ' + q.g[1] + '?',
      uk[0] + ' <b>більше ніж</b> <span class="num">' + q.N + '</span> ' + uk[1] +
      '. Їхню кількість можна записати як суму <b>' + multipleUkGen[q.p] + ' однакових</b> доданків і як суму <b>' +
      multipleUkGen[q.r] + ' однакових</b> доданків. Яка <b>найменша</b> кількість ' + uk[1] + ' може бути?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqMultiple(q){
  if(q.kind === 'multiple' && q.shape === 'count') return q.list.join(', ') + ' → ' + q.ans;
  if(q.kind === 'multiple') return tr('кратно на ' + q.p + ' и на ' + q.r + ', над ' + q.N,
                                      'кратне ' + q.p + ' і ' + q.r + ', більше за ' + q.N) + ' → ' + q.ans;
}
function whyMultiple(q, full){
  if(q.kind === 'multiple' && q.shape === 'count'){
    if(!full) return tr('Сбор на равни събираеми значи, че числото се дели точно на техния брой — и на двата.', 'Сума однакових доданків означає, що число ділиться націло на їхню кількість — на обидві.');
    return tr('дели се и на ' + q.p + ', и на ' + q.r + ' &nbsp;→&nbsp; на <b>', 'ділиться і на ' + q.p + ', і на ' + q.r + ' &nbsp;→&nbsp; на <b>') + q.L + '</b> &nbsp;→&nbsp; ' + q.list.join(', ') + ' &nbsp;→&nbsp; ' + q.ans;
  }
  if(q.kind === 'multiple'){
    if(!full) return tr('Сбор на равни събираеми значи, че числото се дели точно на техния брой.',
                        'Сума однакових доданків означає, що число ділиться націло на їхню кількість.');
    return tr('дели се и на ' + q.p + ', и на ' + q.r + ' &nbsp;→&nbsp; значи се дели на <b>',
              'ділиться і на ' + q.p + ', і на ' + q.r + ' &nbsp;→&nbsp; отже, ділиться на <b>') + q.L +
      '</b> &nbsp;→&nbsp; ' + [q.L*(q.ans/q.L - 1), q.ans].join(', ') +
      tr(' — първото над ' + q.N + ' е ', ' — перше більше за ' + q.N + ': ') + q.ans;
  }
}
KIND.multiple = { draw:drawMultiple, eq:eqMultiple, why:whyMultiple };
