// Question kind 'fruit': level 28 Ябълки и круши — Count two groups, then add to reach a difference.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 6: count two mixed groups, then work out how many to add to reach a gap.
function genFruit(){
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
    '" role="img" aria-label="круши и ябълки">' + g + '</svg></div>';
}

function drawFruit(q){
  if(q.kind === 'fruit'){
    return '<div class="ask">Колко <b>ябълки</b> трябва да добавим, така че броят им да е с <span class="num">' +
      q.k + '</span> по-голям от броя на <b>крушите</b>?</div>' + fruitSvg(q.row) +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + SLOT + '</div>';
  }
}
function eqFruit(q){
  if(q.kind === 'fruit') return q.pears + ' круши, ' + q.apples + ' ябълки, с ' + q.k + ' повече → ' + q.ans;
}
function whyFruit(q, full){
  if(q.kind === 'fruit'){
    if(!full) return 'Преброй първо крушите, после ябълките.';
    return 'круши: <b>' + q.pears + '</b>, ябълки: <b>' + q.apples + '</b> &nbsp;→&nbsp; трябват ' +
      (q.pears + q.k) + ' ябълки &nbsp;→&nbsp; ' + (q.pears + q.k) + ' − ' + q.apples + ' = ' + q.ans;
  }
}
KIND.fruit = { draw:drawFruit, eq:eqFruit, why:whyFruit };
