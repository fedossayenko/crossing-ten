// Question kind 'fruit': level 28 Ябълки и круши — Count two groups, then add to reach a difference.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 6: count two mixed groups, then work out how many to add to reach a gap.
function genFruit(){
  if(Math.random() < 0.3){
    // Есен 2019, задача 6: 11 apples, 5 of them red and the rest yellow; 2 yellow ones eaten. The
    // yellow ones first (11 − 5 = 6), and only then the eaten ones: 4 left.
    const T = 8 + rnd(12), r = 2 + rnd(T - 5), y = T - r, e = 1 + rnd(y - 1);
    return {kind:'fruit', shape:'rest', T, r, y, e, traps:[T - e], ans: y - e};
  }
  const pears = 3 + rnd(4);
  const apples = 1 + rnd(pears - 1);
  const k = 2 + rnd(5);
  const row = shuffle(Array(pears).fill('p').concat(Array(apples).fill('a')));
  return {kind:'fruit', pears, apples, k, row, ans: pears + k - apples};
}

function fruitSvg(row){
  const cols = Math.min(6, row.length), u = 30;
  const rows = Math.ceil(row.length / cols);
  const g = row.map((t, i) => {
    const x = (i % cols)*u + u/2, y = Math.floor(i/cols)*u + u/2;
    return '<g transform="translate(' + x + ' ' + y + ')">' + fruitBody(t) + '</g>';
  }).join('');
  return '<div class="fig"><svg viewBox="0 0 ' + cols*u + ' ' + rows*u +
    '" role="img" aria-label="' + tr('круши и ябълки', 'груші та яблука') + '">' + g + '</svg></div>';
}

const fruitUk = (n, forms) => forms[{one:0, few:1}[new Intl.PluralRules('uk').select(n)] ?? 2];
const fruitPear = n => fruitUk(n, ['груша', 'груші', 'груш']), fruitApple = n => fruitUk(n, ['яблуко', 'яблука', 'яблук']);
function drawFruit(q){
  if(q.kind === 'fruit' && q.shape === 'rest'){
    return '<div class="ask">' + tr('Петьо имал <span class="num">' + q.T + '</span> ябълки, от които <span class="num">' + q.r + '</span> червени, а останалите — жълти. Изял <span class="num">' + q.e + '</span> ' + (q.e === 1 ? 'жълта ябълка' : 'жълти ябълки') + '. Колко <b>жълти</b> ябълки са му останали?',
      'У Петра було <span class="num">' + fruitApple(q.T).replace(/^/, q.T + '</span> ') + ', з них <span class="num">' + q.r + '</span> червоних, а решта — жовті. Він з’їв <span class="num">' + q.e + '</span> ' + fruitUk(q.e, ['жовте яблуко', 'жовті яблука', 'жовтих яблук']) + '. Скільки <b>жовтих</b> яблук у нього залишилося?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'fruit'){
    return tr('<div class="ask">Колко <b>ябълки</b> трябва да добавим, така че броят им да е с <span class="num">' +
      q.k + '</span> по-голям от броя на <b>крушите</b>?</div>',
      '<div class="ask">Скільки <b>яблук</b> треба додати, щоб їх стало на <span class="num">' +
      q.k + '</span> більше, ніж <b>груш</b>?</div>') + fruitSvg(q.row) +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + SLOT + '</div>';
  }
}
function eqFruit(q){
  if(q.kind === 'fruit' && q.shape === 'rest') return q.T + ' − ' + q.r + ' = ' + q.y + ', ' + q.y + ' − ' + q.e + ' = ' + q.ans;
  if(q.kind === 'fruit') return tr(q.pears + ' круши, ' + q.apples + ' ябълки, с ' + q.k + ' повече → ',
    q.pears + ' ' + fruitPear(q.pears) + ', ' + q.apples + ' ' + fruitApple(q.apples) + ', на ' + q.k + ' більше → ') + q.ans;
}
function whyFruit(q, full){
  if(q.kind === 'fruit' && q.shape === 'rest'){
    if(!full) return tr('Колко жълти е имал отначало?', 'Скільки жовтих було спочатку?');
    return tr('жълти: ', 'жовтих: ') + q.T + ' − ' + q.r + ' = <b>' + q.y + '</b> &nbsp;→&nbsp; ' + q.y + ' − ' + q.e + ' = ' + q.ans;
  }
  if(q.kind === 'fruit'){
    if(!full) return tr('Преброй първо крушите, после ябълките.', 'Спочатку порахуй груші, потім яблука.');
    return tr('круши: <b>' + q.pears + '</b>, ябълки: <b>' + q.apples + '</b> &nbsp;→&nbsp; трябват ' +
      (q.pears + q.k) + ' ябълки &nbsp;→&nbsp; ',
      'груш: <b>' + q.pears + '</b>, яблук: <b>' + q.apples + '</b> &nbsp;→&nbsp; треба ' +
      (q.pears + q.k) + ' ' + fruitApple(q.pears + q.k) + ' &nbsp;→&nbsp; ') + (q.pears + q.k) + ' − ' + q.apples + ' = ' + q.ans;
  }
}
KIND.fruit = { draw:drawFruit, eq:eqFruit, why:whyFruit };
