// Question kind 'blocks': level 112 Винаги съседни — Arrangements where some numbers must stay side by side.

// МБГ Зима 2020, задача 7: 1, 2, 3, 4 in a row with 1 next to 2 and 3 next to 4. Glue each pair into
// a block: two blocks go 2 ways, and each block can be turned: 2 · 2 · 2 = 8. Counted here by
// listing every order.
import { KIND, SLOT, popAt, rnd, svgText, tr, ukN } from '../js/core.js';
function blocksCount(n, pairs){
  let c = 0;
  (function walk(cur, left){
    if(!left.length){ if(pairs.every(([a, b]) => Math.abs(cur.indexOf(a) - cur.indexOf(b)) === 1)) c++; return; }
    left.forEach((v, i) => walk(cur.concat(v), left.filter((_, j) => j !== i)));
  })([], [...Array(n).keys()].map(v => v + 1));
  return c;
}
const BLOCKS = [[3, [[1, 2]]], [4, [[1, 2]]], [4, [[1, 2], [3, 4]]], [5, [[1, 2], [3, 4]]], [4, [[1, 2], [2, 3]]]];
export function genBlocks(){
  const [n, pairs] = BLOCKS[rnd(BLOCKS.length)];
  return {kind:'blocks', n, pairs, ans: blocksCount(n, pairs)};
}
function drawBlocks(q){
  const nums = [...Array(q.n).keys()].map(v => v + 1), list = nums.slice(0, -1).join(', ');
  const cond = q.pairs.map(([a, b]) => a + tr(' и ', ' і ') + b).join(tr(', както и ', ', а також '));
  return '<div class="ask">' + tr('По колко начина можем да подредим числата ' + list + ' и ' + q.n + ' едно до друго, така че ' + cond + ' да са <b>винаги съседни</b>?',
    'Скількома способами можна розставити числа ' + list + ' і ' + q.n + ' в ряд так, щоб ' + cond + ' були <b>завжди сусідніми</b>?') + '</div>' +
    '<div class="note">' + tr('В подредбата 5, 6, 7 съседни са 5 и 6; 6 и 7.', 'У ряду 5, 6, 7 сусідні 5 і 6; 6 і 7.') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqBlocks(q){
  return q.n + tr(' числа, съседни ', ' чисел, сусідні ') + q.pairs.map(p => p.join('–')).join(', ') + ' → ' + q.ans;
}
// The picture: the glued neighbours as one piece each (a chain 1–2–3 is one piece), every order of the
// pieces drawn small, then each glued piece and the same piece turned round — and the product.
function blocksSvg(q, fact){
  const chain = q.pairs.length === 2 && q.pairs[0][1] === q.pairs[1][0], glued = chain ? [[1, 2, 3]] : q.pairs, nums = [...Array(q.n).keys()].map(v => v + 1);
  const pieces = glued.concat(nums.filter(v => !glued.some(p => p.includes(v))).map(v => [v]));
  const tile = (p, x, y, c, extra) => '<g' + (extra || '') + '><rect x="' + x + '" y="' + y + '" width="' + p.length*c + '" height="' + c + '" rx="' + (c/4) + '" fill="' + (p.length > 1 ? 'var(--accentbg)' : 'none') + '" stroke="' + (p.length > 1 ? 'var(--accent)' : 'var(--muted)') + '" stroke-width="1.8"/>' +
    p.slice(1).map((_, i) => '<line x1="' + (x + (i + 1)*c) + '" y1="' + (y + 3) + '" x2="' + (x + (i + 1)*c) + '" y2="' + (y + c - 3) + '" stroke="var(--accent)" stroke-dasharray="2 2"/>').join('') +
    p.map((v, i) => svgText(x + (i + 0.5)*c, y + c*0.7, v, Math.round(c*0.6), 'var(--ink)')).join('') + '</g>';
  const row = (ps, c, gap) => ps.reduce((w, p) => w + p.length*c + gap, -gap);
  const perms = a => a.length < 2 ? [a] : a.flatMap((p, i) => perms(a.filter((_, j) => j !== i)).map(r => [p].concat(r)));
  let g = '', x = 150 - row(pieces, 26, 10)/2;
  pieces.forEach(p => { g += tile(p, x, 0, 26, popAt(1)); x += p.length*26 + 10; });
  const orders = perms(pieces), ow = row(pieces, 16, 3), per = 3, rows = Math.ceil(orders.length / per);
  orders.forEach((o, i) => {
    const inRow = Math.min(per, orders.length - Math.floor(i / per)*per), col = i % per, gx = 150 - (inRow*ow + (inRow - 1)*14)/2 + col*(ow + 14), gy = 44 + Math.floor(i / per)*24;
    let xx = gx; o.forEach(p => { g += tile(p, xx, gy, 16, popAt(2 + i*0.5)); xx += p.length*16 + 3; });
  });
  const ty = 44 + rows*24 + 12, tw = glued.reduce((w, p) => w + 2*p.length*18 + 50, -32);
  x = 150 - tw/2;
  glued.forEach((p, i) => {
    g += tile(p, x, ty, 18, popAt(4 + orders.length*0.5 + i)) + svgText(x + p.length*18 + 9, ty + 13, '↔', 13, 'var(--muted)', popAt(4 + orders.length*0.5 + i)) +
      tile(p.slice().reverse(), x + p.length*18 + 18, ty, 18, popAt(4.5 + orders.length*0.5 + i));
    x += 2*p.length*18 + 50;
  });
  g += svgText(150, ty + 48, [fact].concat(glued.map(() => 2)).join(' · ') + ' = ' + q.ans, 15, 'var(--ink)', popAt(6 + orders.length*0.5 + glued.length));
  return '<svg viewBox="0 -4 300 ' + (ty + 60) + '" style="display:block; width:300px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('парчетата, подредбите им и обръщанията', 'шматки, їхні розстановки й повороти') + '">' + g + '</svg>';
}
function whyBlocks(q, full){
  if(!full) return tr('Слепи съседите в едно парче. Колко парчета се нареждат — и колко начина има всяко парче да се обърне?', 'Склей сусідів в один шматок. Скільки шматків ставиш у ряд — і скількома способами можна перевернути кожен?');
  const chain = q.pairs.length === 2 && q.pairs[0][1] === q.pairs[1][0];
  const units = chain ? q.n - 2 : q.n - q.pairs.length, fact = [...Array(units).keys()].map(v => v + 1).reduce((a, b) => a*b, 1), turns = chain ? 2 : Math.pow(2, q.pairs.length);
  return tr('парчета за нареждане: ', 'шматків у ряду: ') + units + ' &nbsp;→&nbsp; ' + tr(fact + ' подредби', ukN(fact, 'розстановка', 'розстановки', 'розстановок')) + ' · ' + tr(turns + ' обръщания', ukN(turns, 'поворот', 'повороти', 'поворотів')) + ' = ' + q.ans + blocksSvg(q, fact);
}
KIND.blocks = { draw:drawBlocks, eq:eqBlocks, why:whyBlocks };
