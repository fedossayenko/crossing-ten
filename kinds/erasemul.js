// Question kind 'erasemul': level 64 Изтрий цифри — Erase digits from a product so that it makes the number asked for.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Есен, 3 клас, задача 6: erase three digits in 12 · 31 · 41 so the result is 24; the sum
// of the erased digits. With the three 1s gone it is 2 · 3 · 4 = 24, so 3. Each number keeps a
// digit, every way of erasing is tried, and all the ways that reach the target erase the same sum.
function eraseWays(nums, k){
  const per = nums.map(n => {
    const s = String(n), out = [];
    for(let m = 0; m < (1 << s.length) - 1; m++){             // m: which digits go; never all of them
      let keep = '', gone = [];
      for(let i = 0; i < s.length; i++) (m & (1 << i)) ? gone.push(+s[i]) : keep += s[i];
      out.push({ v: +keep, gone });
    }
    return out;
  });
  const ways = [];
  (function walk(i, vals, gone){
    if(gone.length > k) return;
    if(i === nums.length){ if(gone.length === k) ways.push({ vals, gone }); return; }
    per[i].forEach(o => walk(i + 1, vals.concat(o.v), gone.concat(o.gone)));
  })(0, [], []);
  return ways;
}
function genEraseMul(){
  for(;;){
    const nums = [0, 0, 0].map(() => 10*(1 + rnd(9)) + 1 + rnd(9));    // no 0 digit, so nothing leads with a 0
    const ways = eraseWays(nums, 3), w = ways[rnd(ways.length)];
    const T = w.vals.reduce((a, b) => a*b, 1);
    if(T < 2 || T > 999) continue;
    const hit = ways.filter(x => x.vals.reduce((a, b) => a*b, 1) === T), sum = g => g.reduce((a, b) => a + b, 0);
    if(hit.some(x => sum(x.gone) !== sum(w.gone))) continue;               // the answer must not depend on the way
    return {kind:'erasemul', nums, T, kept: w.vals, gone: w.gone, ans: sum(w.gone)};
  }
}
function drawEraseMul(q){
  if(q.kind === 'erasemul'){
    return '<div class="ask">' + tr('Изтрийте <b>три</b> цифри в израза', 'Зітріть <b>три</b> цифри у виразі') + '</div>' +
      '<div class="given">' + q.nums.join(' · ') + '</div>' +
      '<div class="ask">' + tr('така че резултатът да бъде <span class="num">' + q.T + '</span>. Колко е сборът от изтритите цифри?',
        'так, щоб результат дорівнював <span class="num">' + q.T + '</span>. Чому дорівнює сума зітертих цифр?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqEraseMul(q){
  if(q.kind === 'erasemul') return q.kept.join(' · ') + ' = ' + q.T + ' → ' + q.gone.join(' + ') + ' = ' + q.ans;
}
function whyEraseMul(q, full){
  if(q.kind === 'erasemul'){
    if(!full) return tr('Кои три множителя, останали от числата, дават ' + q.T + '?', 'Які три множники, що залишаться від чисел, дають ' + q.T + '?');
    return q.kept.join(' · ') + ' = ' + q.T + ' &nbsp;→&nbsp; ' + tr('изтрити: ', 'зітерто: ') + q.gone.join(' + ') + ' = ' + q.ans;
  }
}
KIND.erasemul = { draw:drawEraseMul, eq:eqEraseMul, why:whyEraseMul };
