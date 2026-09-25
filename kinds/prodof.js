// Question kind 'prodof': level 131 1 · 3 · 5 — The product of every number that fits, and (level 136)
// three different numbers with a given product.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Пролет 2025, задача 6: the product of all odd numbers less than 6: 1 · 3 · 5 = 15.
function genProdOf(){
  const odd = Math.random() < 0.6, n = odd ? 4 + rnd(5) : 3 + rnd(4);
  const list = []; for(let v = 1; v < n; v++) if(!odd || v % 2) list.push(v);
  return {kind:'prodof', shape:0, odd, n, list, traps:[list.reduce((t, v) => t + v, 0)], ans: list.reduce((t, v) => t*v, 1)};
}
// Задача 20: three different numbers multiply to 24 — at least how big must the biggest be? 1 · 2 · 12,
// 1 · 3 · 8, 1 · 4 · 6, 2 · 3 · 4: the biggest is 4 at least. Or the smallest their sum can be.
function prod3Ways(N){ const w = []; for(let a = 1; a*a*a < N; a++) for(let b = a + 1; a*b*b < N; b++) if(N % (a*b) === 0 && N / (a*b) > b) w.push([a, b, N / (a*b)]); return w; }
function genProd3(){
  const N = [12, 18, 20, 24, 30, 36, 40, 48, 60][rnd(9)], w = prod3Ways(N), sum = Math.random() < 0.35;
  const ans = sum ? Math.min(...w.map(t => t[0] + t[1] + t[2])) : Math.min(...w.map(t => t[2]));
  return {kind:'prodof', shape:1, N, sum, traps:[sum ? 1 + 2 + N / 2 : N / 2], ans};
}
function drawProdOf(q){
  if(q.kind === 'prodof' && q.shape === 1){
    return '<div class="ask">' + tr('Произведението на <b>3 различни</b> естествени числа е <span class="num">' + q.N + '</span>. ' + (q.sum ? 'Колко най-малко може да бъде <b>сборът</b> на тези числа?' : 'Колко най-малко може да бъде <b>най-голямото</b> сред тези числа?'),
      'Добуток <b>3 різних</b> натуральних чисел дорівнює <span class="num">' + q.N + '</span>. ' + (q.sum ? 'Якою найменшою може бути <b>сума</b> цих чисел?' : 'Яким найменшим може бути <b>найбільше</b> з цих чисел?')) + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'prodof'){
    return '<div class="ask">' + (q.odd ? tr('Пресметнете произведението на всички <b>нечетни</b> числа, по-малки от <span class="num">' + q.n + '</span>.', 'Обчисліть добуток усіх <b>непарних</b> чисел, менших від <span class="num">' + q.n + '</span>.')
      : tr('Пресметнете произведението на всички естествени числа, по-малки от <span class="num">' + q.n + '</span>.', 'Обчисліть добуток усіх натуральних чисел, менших від <span class="num">' + q.n + '</span>.')) + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqProdOf(q){
  if(q.kind === 'prodof' && q.shape === 1) return prod3Ways(q.N).map(t => t.join(' · ')).join(', ') + ' → ' + q.ans;
  if(q.kind === 'prodof') return q.list.join(' · ') + ' = ' + q.ans;
}
function whyProdOf(q, full){
  if(q.kind === 'prodof' && q.shape === 1){
    if(!full) return tr('Изреди всички тройки различни числа с това произведение, като започнеш с най-малкото число.', 'Випиши всі трійки різних чисел із цим добутком, починаючи з найменшого числа.');
    const w = prod3Ways(q.N);
    return w.map(t => t.join(' · ') + (q.sum ? ' → ' + (t[0] + t[1] + t[2]) : '')).join(', ') + ' &nbsp;→&nbsp; ' + tr('най-малко ', 'найменше ') + q.ans;
  }
  if(q.kind === 'prodof'){
    if(!full) return q.odd ? tr('Кои са нечетните числа преди него? Числото 1 също е нечетно.', 'Які непарні числа перед ним? Число 1 теж непарне.') : tr('Естествените числа започват от 1.', 'Натуральні числа починаються з 1.');
    return q.list.join(' · ') + ' = ' + q.ans;
  }
}
KIND.prodof = { draw:drawProdOf, eq:eqProdOf, why:whyProdOf };
