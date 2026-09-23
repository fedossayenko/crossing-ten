// Question kind 'rewrite': level 77 Изтрих и записах — Numbers rewritten in two steps, then added.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Есен, 3 клас, задача 19: 6, 8, 24, 16. The two-digit ones become themselves divided by 4
// (6, 8, 6, 4), then every one that divides by 3 becomes itself times 2 (12, 8, 12, 4): 36.
// The second step works on what the first one left, so the 24 counts in it as 6.
function genRewrite(){
  for(;;){
    const d = 2 + rnd(3), m = [3, 2, 5][rnd(3)], p = 2 + rnd(2), nums = [];
    while(nums.length < 4){
      const two = Math.random() < 0.5, v = two ? d * (Math.ceil(10 / d) + rnd(Math.floor(99 / d) - Math.ceil(10 / d) + 1)) : 1 + rnd(9);
      if(nums.indexOf(v) < 0 && v <= 99) nums.push(v);
    }
    const two = nums.filter(v => v >= 10).length;
    if(two < 1 || two > 3) continue;
    const s1 = nums.map(v => v >= 10 ? v / d : v), s2 = s1.map(v => v % m === 0 ? v * p : v);
    if(s2.join() === s1.join()) continue;                     // the second step must change something
    const ans = s2.reduce((a, b) => a + b, 0), wrong = nums.map(v => v % m === 0 ? v * p : v).map(v => v >= 10 ? v / d : v);
    return {kind:'rewrite', nums, d, m, p, s1, s2, ans, traps: [s1.reduce((a, b) => a + b, 0), wrong.every(Number.isInteger) ? wrong.reduce((a, b) => a + b, 0) : -1].filter(v => v > 0 && v !== ans)};
  }
}
function drawRewrite(q){
  if(q.kind === 'rewrite'){
    const list = q.nums.slice(0, -1).join(', ') + tr(' и ', ' і ') + q.nums[3];
    return '<div class="ask">' + tr('Записах следните четири числа: <span class="num">' + list + '</span>. Първо изтрих двуцифрените числа и на тяхно място записах резултата от делението им на <span class="num">' +
      q.d + '</span>. След това изтрих всички числа, които се делят на <span class="num">' + q.m + '</span>, и на тяхно място записах произведението им с <span class="num">' + q.p +
      '</span>. Колко е сборът на числата, които се получиха накрая?',
      'Я записав такі чотири числа: <span class="num">' + list + '</span>. Спершу я стер двоцифрові числа і замість них записав результат їх ділення на <span class="num">' +
      q.d + '</span>. Потім стер усі числа, які діляться на <span class="num">' + q.m + '</span>, і замість них записав їхній добуток із <span class="num">' + q.p +
      '</span>. Чому дорівнює сума чисел, які вийшли в кінці?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqRewrite(q){
  if(q.kind === 'rewrite') return q.nums.join(', ') + ' → ' + q.s1.join(', ') + ' → ' + q.s2.join(' + ') + ' = ' + q.ans;
}
function whyRewrite(q, full){
  if(q.kind === 'rewrite'){
    if(!full) return tr('Направи стъпките една след друга и записвай какво остава след всяка.', 'Роби кроки один за одним і записуй, що залишається після кожного.');
    return q.nums.join(', ') + ' &nbsp;→&nbsp; ' + q.s1.join(', ') + ' &nbsp;→&nbsp; ' + q.s2.join(', ') + ' &nbsp;→&nbsp; ' + q.s2.join(' + ') + ' = ' + q.ans;
  }
}
KIND.rewrite = { draw:drawRewrite, eq:eqRewrite, why:whyRewrite };
