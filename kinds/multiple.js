// Question kind 'multiple': level 49 Кратни — The smallest count that splits into equal parts both ways.
import { BGNUM, KIND, SLOT, popAt, rnd, svgText, tr, ukN } from '../js/core.js';

const GARDEN = [['рози','розите','градината'], ['ябълки','ябълките','кошницата'],
                ['картички','картичките','кутията'], ['мидички','мидичките','торбичката']];

// Задача 17: "a sum of p equal addends" is another way of saying "divides by p". Wanted
// both ways at once, so the count divides by both — and the smallest one past the bound.
const PAIRS = [[2,3,6], [2,4,4], [2,5,10], [3,4,12], [2,6,6], [2,7,14], [3,2,6], [4,3,12]];
export function genMultiple(){
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
const multipleUk = {'рози':['У саду','троянд','троянда','троянди'], 'ябълки':['У кошику','яблук','яблуко','яблука'],
                    'картички':['У коробці','листівок','листівка','листівки'], 'мидички':['У торбинці','черепашок','черепашка','черепашки']};
const multipleUkGen = {2:'двох', 3:'трьох', 4:'чотирьох', 5:'п’яти', 6:'шести', 7:'семи'};
function drawMultiple(q){
  if(q.shape === 'count'){
    return '<div class="ask">' + tr('Колко от числата от <span class="num">1</span> до <span class="num">' + q.N + '</span> можем да запишем и като сбор на <b>' + BGNUM[q.p] + ' равни</b> събираеми, и като сбор на <b>' + BGNUM[q.r] + ' равни</b> събираеми?',
      'Скільки чисел від <span class="num">1</span> до <span class="num">' + q.N + '</span> можна записати і як суму <b>' + multipleUkGen[q.p] + ' однакових</b> доданків, і як суму <b>' + multipleUkGen[q.r] + ' однакових</b> доданків?') + '</div>' +
      '<div class="line xl">' + SLOT + '</div>';
  }
  const uk = multipleUk[q.g[0]];
  return '<div class="ask">' + tr('В ' + q.g[2] + ' има <b>повече от</b> <span class="num">' + q.N + '</span> ' + q.g[0] +
    '. Техният брой можем да запишем като сбор на <b>' + BGNUM[q.p] + ' равни</b> събираеми и като сбор на <b>' +
    BGNUM[q.r] + ' равни</b> събираеми. Колко <b>най-малко</b> може да са ' + q.g[1] + '?',
    uk[0] + ' <b>більше ніж</b> <span class="num">' + ukN(q.N, uk[2], uk[3], uk[1]).replace(' ', '</span> ') +
    '. Їхню кількість можна записати як суму <b>' + multipleUkGen[q.p] + ' однакових</b> доданків і як суму <b>' +
    multipleUkGen[q.r] + ' однакових</b> доданків. Яка <b>найменша</b> кількість ' + uk[1] + ' може бути?') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqMultiple(q){
  if(q.shape === 'count') return q.list.join(', ') + ' → ' + q.ans;
  return tr('кратно на ' + q.p + ' и на ' + q.r + ', над ' + q.N,
                                      'кратне ' + q.p + ' і ' + q.r + ', більше за ' + q.N) + ' → ' + q.ans;
}
// The picture: the numbers in rows of ten, as on a hundred chart. One that divides by the first count is
// ringed, one that divides by the second sits on a warm square, so the ones that split both ways carry both
// marks. The garden question starts a row before the bound, greys the numbers up to it (too few) and ends
// on the answer, the first number past it with both marks.
function multipleSvg(q){
  const C = 24, count = q.shape === 'count', from = count ? 1 : Math.max(0, Math.floor((q.N - 1) / 10) - 1) * 10 + 1, end = count ? q.N : q.ans;
  let g = '', k = 0;
  for(let v = from; v <= end; v++){
    const x = ((v - 1) % 10) * C + C/2, y = Math.floor((v - from) / 10) * C + C/2, low = !count && v <= q.N, both = v % q.L === 0;
    const cell = (v % q.r ? '' : '<rect x="' + (x - 10.5) + '" y="' + (y - 10.5) + '" width="21" height="21" rx="5" fill="var(--warmbg)" stroke="var(--warm)" stroke-width="1.5"/>') +
      (v % q.p ? '' : '<circle cx="' + x + '" cy="' + y + '" r="9" fill="none" stroke="var(--accent)" stroke-width="2"/>') +
      svgText(x, y + 4, v, 11, low ? 'var(--muted)' : both ? 'var(--good)' : 'var(--ink)');
    g += both && !low ? '<g' + popAt(1 + k++) + '>' + cell + '</g>' : low ? '<g opacity=".45">' + cell + '</g>' : cell;
  }
  const h = Math.ceil((end - from + 1) / 10) * C, by = tr('дели се на ', 'ділиться на ');
  const note = (x, t) => '<text x="' + x + '" y="' + (h + 20) + '" font-size="11" font-weight="800" fill="var(--muted)">' + t + '</text>';   // left-aligned beside its mark
  g += '<circle cx="26" cy="' + (h + 16) + '" r="8" fill="none" stroke="var(--accent)" stroke-width="2"/>' + note(39, by + q.p) +
    '<rect x="128" y="' + (h + 7.5) + '" width="17" height="17" rx="4" fill="var(--warmbg)" stroke="var(--warm)" stroke-width="1.5"/>' + note(152, by + q.r);
  g += svgText(120, h + 46, count ? q.list.join(', ') + ' → ' + q.ans : tr('първото над ' + q.N + ': ', 'перше більше за ' + q.N + ': ') + q.ans, 15, 'var(--ink)', popAt(2 + k));
  return '<svg viewBox="-4 -4 248 ' + (h + 58) + '" style="display:block; width:270px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('числата, които се делят и на двата броя', 'числа, що діляться на обидві кількості') + '">' + g + '</svg>';
}
function whyMultiple(q, full){
  if(q.shape === 'count'){
    if(!full) return tr('Сбор на равни събираеми значи, че числото се дели точно на техния брой — и на двата.', 'Сума однакових доданків означає, що число ділиться націло на їхню кількість — на обидві.');
    return tr('дели се и на ' + q.p + ', и на ' + q.r + ' &nbsp;→&nbsp; на <b>', 'ділиться і на ' + q.p + ', і на ' + q.r + ' &nbsp;→&nbsp; на <b>') + q.L + '</b> &nbsp;→&nbsp; ' + q.list.join(', ') + ' &nbsp;→&nbsp; ' + q.ans + multipleSvg(q);
  }
  if(!full) return tr('Сбор на равни събираеми значи, че числото се дели точно на техния брой.',
                      'Сума однакових доданків означає, що число ділиться націло на їхню кількість.');
  return tr('дели се и на ' + q.p + ', и на ' + q.r + ' &nbsp;→&nbsp; значи се дели на <b>',
            'ділиться і на ' + q.p + ', і на ' + q.r + ' &nbsp;→&nbsp; отже, ділиться на <b>') + q.L +
    '</b> &nbsp;→&nbsp; ' + [q.L*(q.ans/q.L - 1), q.ans].join(', ') +
    tr(' — първото над ' + q.N + ' е ', ' — перше більше за ' + q.N + ': ') + q.ans + multipleSvg(q);
}
KIND.multiple = { draw:drawMultiple, eq:eqMultiple, why:whyMultiple };
