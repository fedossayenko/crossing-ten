// Question kind 'order': level 46 Подреди — Place the numbers so a chain of inequalities holds.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 11: one number and the difference. Two numbers fit unless the smaller one
// would go below zero — so both sums are accepted, and both are shown afterwards.
// Задача 9: three numbers to drop into three boxes so a chain of inequalities holds.
// Exactly one arrangement fits, so it is found by trying, not by computing — and what
// is asked is read off the arrangement, not off the numbers.
function genOrder(){
  for(;;){
    const base = 2 + rnd(8), step = 2 + rnd(3);
    const nums = [base, base + step, base + 2*step];
    const p = 1 + rnd(3), g = 1 + rnd(3);
    const fits = [];
    for(let i = 0; i < 3; i++) for(let j = 0; j < 3; j++) for(let k = 0; k < 3; k++){
      if(i === j || j === k || i === k) continue;
      if(nums[i] + p > nums[j] && nums[j] > nums[k] + g) fits.push([nums[i], nums[j], nums[k]]);
    }
    if(fits.length !== 1) continue;            // two arrangements would leave the question without one answer
    const fit = fits[0], asksMid = Math.random() < 0.35;
    return {kind:'order', nums, p, g, fit, asksMid, ans: asksMid ? fit[1] : fit[0] + fit[2]};
  }
}

function drawOrder(q){
  if(q.kind === 'order'){
    return '<div class="ask">' + tr('Поставете числата', 'Поставте числа') + ' <span class="num">' + bgList(q.nums) +
      '</span> ' + tr('в квадратчетата, така че да е вярно:', 'у квадратики так, щоб було правильно:') + '</div>' +
      '<div class="given">■ + ' + q.p + ' &gt; □ &gt; ■ + ' + q.g + '</div>' +
      '<div class="ask">' + (q.asksMid ? tr('Кое число е в <b>празното</b> квадратче □?', 'Яке число в <b>порожньому</b> квадратику □?')
                                       : tr('Колко е <b>сборът</b> на числата в <b>оцветените</b> квадратчета ■?',
                                            'Яка <b>сума</b> чисел у <b>зафарбованих</b> квадратиках ■?')) + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqOrder(q){
  if(q.kind === 'order') return q.nums.join(', ') + ' → ' + q.fit.join(', ') + ' → ' + q.ans;
}
function whyOrder(q, full){
  if(q.kind === 'order'){
    if(!full) return tr('Пробвай подрежданията — само едно от тях става.', 'Спробуй різні розстановки — підходить лише одна.');
    const f = q.fit;
    const head = tr('става само ', 'підходить лише ') + f[0] + ' + ' + q.p + ' &gt; ' + f[1] + ' &gt; ' + f[2] + ' + ' + q.g +
      ' &nbsp;→&nbsp; <b>' + (f[0] + q.p) + ' &gt; ' + f[1] + ' &gt; ' + (f[2] + q.g) + '</b> &nbsp;→&nbsp; ';
    return head + (q.asksMid ? tr('в празното квадратче е ', 'у порожньому квадратику ') + q.ans : f[0] + ' + ' + f[2] + ' = ' + q.ans);
  }
}
KIND.order = { draw:drawOrder, eq:eqOrder, why:whyOrder };
