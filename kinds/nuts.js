// Question kind 'nuts': level 118 Катеричките — A share where each gets more than a few: the most one can get.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Зима 2020, задача 11: four squirrels share 16 nuts, each more than 2. For one to get as many
// as possible the other three get as few as allowed — 3 each, 9 — and she gets 16 − 9 = 7.
function genNuts(){
  for(;;){
    const k = 3 + rnd(3), m = 1 + rnd(4), T = k*(m + 1) + 2 + rnd(12);
    if(T > 40) continue;
    return {kind:'nuts', k, m, T, ans: T - (k - 1)*(m + 1)};
  }
}
function drawNuts(q){
  if(q.kind === 'nuts'){
    return '<div class="ask">' + tr(({3:'Три', 4:'Четири', 5:'Пет'})[q.k] + ' катерички си разделили общо <span class="num">' + q.T + '</span> ореха, като всяка е получила <b>повече от ' + q.m + '</b> ' + (q.m === 1 ? 'орех' : 'ореха') + '. Колко е най-големият възможен брой орехи, който е получила катеричката с най-много орехи?',
      ({3:'Три', 4:'Чотири', 5:'П’ять'})[q.k] + (q.k === 5 ? ' білочок' : ' білочки') + ' поділили <span class="num">' + q.T + '</span> горіхів, і кожна отримала <b>більше ніж ' + q.m + '</b>. Яку найбільшу кількість горіхів могла отримати білочка, в якої горіхів найбільше?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqNuts(q){
  if(q.kind === 'nuts') return q.T + ' − ' + (q.k - 1) + ' · ' + (q.m + 1) + ' = ' + q.ans;
}
function whyNuts(q, full){
  if(q.kind === 'nuts'){
    if(!full) return tr('За да получи едната възможно най-много, другите трябва да получат възможно най-малко.', 'Щоб одна отримала якомога більше, інші мають отримати якомога менше.');
    return tr('„повече от ' + q.m + '" значи поне ' + (q.m + 1) + ' &nbsp;→&nbsp; другите ', '«більше ніж ' + q.m + '» означає щонайменше ' + (q.m + 1) + ' &nbsp;→&nbsp; інші ') + (q.k - 1) + ': ' + (q.k - 1) + ' · ' + (q.m + 1) + ' = <b>' + (q.k - 1)*(q.m + 1) + '</b> &nbsp;→&nbsp; ' + q.T + ' − ' + (q.k - 1)*(q.m + 1) + ' = ' + q.ans;
  }
}
KIND.nuts = { draw:drawNuts, eq:eqNuts, why:whyNuts };
