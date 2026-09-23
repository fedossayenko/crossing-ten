// Question kind 'dropone': level 76 Кое не е избрано? — Leave one number out so the rest add to a multiple.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Есен, 3 клас, задача 18: choose five different numbers from 2, 3, 5, 6, 7 and 18 so that
// their sum divides by 3 — which one is left out? All six add to 41; leaving out 2 gives 39 and
// leaving out 5 gives 36, so the answer is 2 or 5: both boxes, in any order.
function genDropOne(){
  for(;;){
    const m = 3 + rnd(2), nums = [];
    while(nums.length < 6){ const v = 2 + rnd(19); if(nums.indexOf(v) < 0) nums.push(v); }
    nums.sort((a, b) => a - b);
    const tot = nums.reduce((a, b) => a + b, 0), out = nums.filter(v => (tot - v) % m === 0);
    if(out.length < 1 || out.length > 2) continue;
    return {kind:'dropone', nums, m, tot, slots: out.length, ans: out[0], alt: out.slice(1)};
  }
}
function drawDropOne(q){
  if(q.kind === 'dropone'){
    const list = q.nums.slice(0, -1).join(', ') + tr(' и ', ' і ') + q.nums[q.nums.length - 1];
    const box = q.slots > 1 ? ' <span class="or">' + tr('или', 'або') + '</span> <span class="slot" id="slot1"></span>' : '';
    return '<div class="ask">' + tr('Изберете пет различни числа от следните: <span class="num">' + list + '</span>, така че сборът им да се дели на <span class="num">' + q.m + '</span>. Кое число не е избрано?',
      'Виберіть п’ять різних чисел із таких: <span class="num">' + list + '</span>, щоб їхня сума ділилася на <span class="num">' + q.m + '</span>. Яке число не вибрано?') + '</div>' +
      (q.slots > 1 ? '<div class="note">' + tr('Възможни са два отговора.', 'Можливі дві відповіді.') + '</div>' : '') +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT + box + '</div>';
  }
}
function eqDropOne(q){
  if(q.kind === 'dropone') return q.nums.join(' + ') + ' = ' + q.tot + ' → ' + [q.ans].concat(q.alt).map(v => q.tot + ' − ' + v + ' = ' + (q.tot - v)).join(', ');
}
function whyDropOne(q, full){
  if(q.kind === 'dropone'){
    if(!full) return tr('Събери всичките шест, после виж кое число да махнеш, за да стане сборът кратен на ' + q.m + '.',
                        'Додай усі шість, потім подивися, яке число прибрати, щоб сума ділилася на ' + q.m + '.');
    return tr('всички заедно: ', 'усі разом: ') + q.tot + ' &nbsp;→&nbsp; ' + [q.ans].concat(q.alt).map(v => q.tot + ' − ' + v + ' = <b>' + (q.tot - v) + '</b>').join(', ') +
      tr(' — делят се на ', ' — діляться на ') + q.m;
  }
}
KIND.dropone = { draw:drawDropOne, eq:eqDropOne, why:whyDropOne };
