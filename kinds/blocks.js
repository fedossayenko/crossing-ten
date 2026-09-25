// Question kind 'blocks': level 112 Винаги съседни — Arrangements where some numbers must stay side by side.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Зима 2020, задача 7: 1, 2, 3, 4 in a row with 1 next to 2 and 3 next to 4. Glue each pair into
// a block: two blocks go 2 ways, and each block can be turned: 2 · 2 · 2 = 8. Counted here by
// listing every order.
function blocksCount(n, pairs){
  let c = 0;
  (function walk(cur, left){
    if(!left.length){ if(pairs.every(([a, b]) => Math.abs(cur.indexOf(a) - cur.indexOf(b)) === 1)) c++; return; }
    left.forEach((v, i) => walk(cur.concat(v), left.filter((_, j) => j !== i)));
  })([], [...Array(n).keys()].map(v => v + 1));
  return c;
}
const BLOCKS = [[3, [[1, 2]]], [4, [[1, 2]]], [4, [[1, 2], [3, 4]]], [5, [[1, 2], [3, 4]]], [4, [[1, 2], [2, 3]]]];
function genBlocks(){
  const [n, pairs] = BLOCKS[rnd(BLOCKS.length)];
  return {kind:'blocks', n, pairs, ans: blocksCount(n, pairs)};
}
function drawBlocks(q){
  if(q.kind === 'blocks'){
    const nums = [...Array(q.n).keys()].map(v => v + 1), list = nums.slice(0, -1).join(', ');
    const cond = q.pairs.map(([a, b]) => a + tr(' и ', ' і ') + b).join(tr(', както и ', ', а також '));
    return '<div class="ask">' + tr('По колко начина можем да подредим числата ' + list + ' и ' + q.n + ' едно до друго, така че ' + cond + ' да са <b>винаги съседни</b>?',
      'Скількома способами можна розставити числа ' + list + ' і ' + q.n + ' в ряд так, щоб ' + cond + ' були <b>завжди сусідніми</b>?') + '</div>' +
      '<div class="note">' + tr('В подредбата 5, 6, 7 съседни са 5 и 6; 6 и 7.', 'У ряду 5, 6, 7 сусідні 5 і 6; 6 і 7.') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqBlocks(q){
  if(q.kind === 'blocks') return q.n + tr(' числа, съседни ', ' чисел, сусідні ') + q.pairs.map(p => p.join('–')).join(', ') + ' → ' + q.ans;
}
function whyBlocks(q, full){
  if(q.kind === 'blocks'){
    if(!full) return tr('Слепи съседите в едно парче. Колко парчета се нареждат — и колко начина има всяко парче да се обърне?', 'Склей сусідів в один шматок. Скільки шматків ставиш у ряд — і скількома способами можна перевернути кожен?');
    const chain = q.pairs.length === 2 && q.pairs[0][1] === q.pairs[1][0];
    const units = chain ? q.n - 2 : q.n - q.pairs.length, fact = [...Array(units).keys()].map(v => v + 1).reduce((a, b) => a*b, 1), turns = chain ? 2 : Math.pow(2, q.pairs.length);
    return tr('парчета за нареждане: ', 'шматків у ряду: ') + units + ' &nbsp;→&nbsp; ' + tr(fact + ' подредби', ukN(fact, 'розстановка', 'розстановки', 'розстановок')) + ' · ' + tr(turns + ' обръщания', ukN(turns, 'поворот', 'повороти', 'поворотів')) + ' = ' + q.ans;
  }
}
KIND.blocks = { draw:drawBlocks, eq:eqBlocks, why:whyBlocks };
