// Question kind 'replaced': level 111 Изтрих и записах сбора — Some numbers rubbed out and replaced by their sum.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Зима 2020, задача 6: 20 numbers, several rubbed out and their sum written, 10 numbers now.
// Rubbing out k and writing one takes the count down by k − 1: 20 − 10 = 10 = k − 1, so k = 11.
function genReplaced(){
  const N = 8 + rnd(23), M = 2 + rnd(N - 3);
  return {kind:'replaced', N, M, ans: N - M + 1};
}
function drawReplaced(q){
  if(q.kind === 'replaced'){
    return '<div class="ask">' + tr('Записах <span class="num">' + q.N + '</span> числа. Няколко от тях изтрих и записах <b>сбора им</b>. Числата са вече <span class="num">' + q.M + '</span>. Колко са изтритите числа?',
      'Я записала <span class="num">' + q.N + '</span> чисел. Кілька з них стерла й записала <b>їхню суму</b>. Тепер чисел <span class="num">' + q.M + '</span>. Скільки чисел стерто?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqReplaced(q){
  if(q.kind === 'replaced') return q.N + ' − ' + q.M + ' + 1 = ' + q.ans;
}
function whyReplaced(q, full){
  if(q.kind === 'replaced'){
    if(!full) return tr('Сборът също е число, което остава записано. С колко намалява броят?', 'Сума — це теж число, яке лишається записаним. На скільки зменшується кількість?');
    return tr('изтрити k, записано 1 — броят намалява с k − 1', 'стерто k, записано 1 — кількість зменшується на k − 1') + ' &nbsp;→&nbsp; ' + q.N + ' − ' + q.M + ' = ' + (q.N - q.M) + ' = k − 1 &nbsp;→&nbsp; k = ' + q.ans;
  }
}
KIND.replaced = { draw:drawReplaced, eq:eqReplaced, why:whyReplaced };
