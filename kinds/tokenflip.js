// Question kind 'tokenflip': level 373 Жетони — Tokens in a triangle, white on one side and coloured on the other: how they look after every one is turned over.

// Кенгуру 2026, задача 6: top coloured; then white, coloured; then coloured, white, white. Each token turned over changes its colour in
// place: white on top, then coloured and white, then white, coloured, coloured — E. The answer is a picture, so the kind brings its own
// А–Д; the slips are the real ones: nothing turned (the same picture), the picture mirrored left to right, the mirror image of the
// right one, and one token left unturned (or turned twice).
import { KIND, rnd, shuffle, tr } from '../js/core.js';
/** a triangle of n rows, row i has i + 1 tokens: 1 coloured, 0 white, row by row */
/** @typedef {number[]} Toks */
export const tokFlip = (/** @type {Toks} */ t) => t.map(x => 1 - x);
export const tokMirror = (/** @type {Toks} */ t, /** @type {number} */ n) => { const r = []; for(let i = 0; i < n; i++) for(let j = 0; j <= i; j++) r.push(t[i * (i + 1) / 2 + i - j]); return r; };
export function genTokenFlip(){
  for(;;){
    const n = 3 + rnd(2), cnt = n * (n + 1) / 2;   // 3 or 4 rows
    const base = Array.from({ length: cnt }, () => rnd(2));
    const right = tokFlip(base), key = (/** @type {Toks} */ t) => t.join('');
    if(key(tokMirror(base, n)) === key(base) || base.every(x => x === base[0])) continue;   // a left-right symmetric picture has no mirror image to tell
    const cand = [base, tokMirror(base, n), tokMirror(right, n)];
    const one = shuffle(Array.from({ length: cnt }, (_, i) => i)).map(i => right.map((x, j) => j === i ? 1 - x : x));
    const opts = [right];
    cand.concat(one).forEach(t => { if(opts.length < 5 && !opts.some(o => key(o) === key(t))) opts.push(t); });
    if(opts.length < 5) continue;
    const order = shuffle(opts.slice()), pick = order.indexOf(right);
    return {kind:'tokenflip', n, base, options: order.map((t, id) => ({ id, v: id, text: ['<span class="vw">' + toks(t, n, 12) + '</span>', '<span class="vw">' + toks(t, n, 12) + '</span>'], toks: t })), pick, own: true, ans: pick};
  }
}
/** the triangle as a picture; a coloured token is filled, a white one is an empty ring */
function toks(/** @type {Toks} */ t, n, r){
  const step = r * 2 + 4, w = n * step + 4, h = (n - 1) * (r * 1.8 + 3) + r * 2 + 6;
  let g = '', k = 0;
  for(let i = 0; i < n; i++) for(let j = 0; j <= i; j++){
    const x = w / 2 + (j - i / 2) * step, y = r + 3 + i * (r * 1.8 + 3);
    g += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + r + '" fill="' + (t[k++] ? 'var(--accent)' : 'var(--solid)') + '" stroke="var(--accent)" stroke-width="2.2"/>';
  }
  const names = t.map(x => tr(x ? 'цветен' : 'бял', x ? 'кольоровий' : 'білий')).join(', ');
  return '<svg viewBox="0 0 ' + w + ' ' + h.toFixed(0) + '" width="' + w + '" height="' + h.toFixed(0) + '" style="max-width:100%" role="img" aria-label="' + tr('жетони, ред по ред: ', 'жетони, рядок за рядком: ') + names + '">' + g + '</svg>';
}
function drawTokenFlip(q){
  return '<div class="ask">' + tr('Показаните жетони са бели от едната страна и цветни от другата. <b>Как изглеждат те след като се преобърнат?</b>', 'Показані жетони білі з одного боку і кольорові з іншого. <b>Як вони виглядатимуть, коли їх перевернуть?</b>') + '</div>' +
    '<div class="given" style="text-align:center">' + toks(q.base, q.n, 16) + '</div>';
}
function eqTokenFlip(q){ return tr('всеки жетон сменя цвета си: белият става цветен, цветният — бял', 'кожен жетон змінює колір: білий стає кольоровим, кольоровий — білим'); }
function whyTokenFlip(q, full){
  if(!full) return tr('Обърни всеки жетон на място: бялата му страна става цветна, а цветната — бяла. Жетоните не си сменят местата.', 'Переверни кожен жетон на місці: його біла сторона стає кольоровою, а кольорова — білою. Жетони не міняються місцями.');
  return toks(q.base, q.n, 14) + ' &nbsp;→&nbsp; ' + toks(tokFlip(q.base), q.n, 14) + '<br>' + tr('Всеки жетон е на същото място, само с другия цвят. Другите картинки сменят и местата, или оставят някой жетон необърнат.', 'Кожен жетон лишається на тому самому місці, лише з іншим кольором. Інші малюнки змінюють ще й місця або залишають якийсь жетон неперевернутим.');
}
KIND.tokenflip = { draw:drawTokenFlip, eq:eqTokenFlip, why:whyTokenFlip };
