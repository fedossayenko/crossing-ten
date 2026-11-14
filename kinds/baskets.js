// Question kind 'baskets': level 399 Кошниците на животните — Five baskets with a shape on each: the animals' beds are told by what looks alike, which basket is left.

// Кенгуру 2022, задача 10: the grey and the black kitten sleep in baskets of one shape with the same figure on them, the white and the brown
// puppy in baskets with the same figure; five baskets (box and square, box and triangle, bucket and square, box and triangle, bucket and
// circle): the kittens are 2 and 4, the puppies 1 and 3, the kangaroo 5. The generator tries every way of giving the four animals their own
// baskets, and keeps a set of baskets in which exactly one is left over whatever way works, with one pair of baskets that are quite alike.
import { KIND, answerLine, rnd, svgFrame, tr, SVG_FONT } from '../js/core.js';
const PRINTED = [[0, 0], [0, 1], [1, 0], [0, 1], [1, 2]];   // [shape, figure] of baskets 1 to 5: shape 0 a box, 1 a bucket; figure 0 square, 1 triangle, 2 circle, 3 diamond
/** every basket the kangaroo can be in, trying each way of giving the grey, black, white and brown their own basket */
export function basketAnswers(/** @type {number[][]} */ b){
  const out = new Set();
  for(let k = 0; k < 5; k++){
    const rest = [0, 1, 2, 3, 4].filter(i => i !== k);
    for(const g of rest) for(const bl of rest) for(const w of rest) for(const br of rest){
      if(new Set([g, bl, w, br]).size === 4 && b[g][0] === b[bl][0] && b[g][1] === b[bl][1] && b[w][1] === b[br][1]) out.add(k);
    }
  }
  return [...out];
}
const alike = (/** @type {number[][]} */ b) => { let n = 0; for(let i = 0; i < 5; i++) for(let j = i + 1; j < 5; j++) if(b[i][0] === b[j][0] && b[i][1] === b[j][1]) n++; return n; };
export function genBaskets(){
  if(rnd(6) === 0) return mk(PRINTED);
  for(;;){
    const b = Array.from({ length: 5 }, () => [rnd(2), rnd(4)]);
    if(alike(b) === 1 && basketAnswers(b).length === 1) return mk(b);
  }
}
function mk(b){
  const k = basketAnswers(b)[0], rest = [0, 1, 2, 3, 4].filter(i => i !== k);
  let cats = [], pups = [];
  for(const i of rest) for(const j of rest) if(i < j){
    if(b[i][0] === b[j][0] && b[i][1] === b[j][1]) cats = [i, j];
  }
  const left = rest.filter(i => !cats.includes(i));
  for(const i of left) for(const j of left) if(i < j && b[i][1] === b[j][1]) pups = [i, j];
  return {kind:'baskets', b, cats, pups, ans: k + 1, traps:[1, 2, 3, 4, 5].filter(v => v !== k + 1)};
}
function fig(f, cx, cy){
  return f === 0 ? '<rect x="' + (cx - 6) + '" y="' + (cy - 6) + '" width="12" height="12" fill="var(--accent)"/>'
    : f === 1 ? '<polygon points="' + (cx - 7) + ',' + (cy + 6) + ' ' + (cx + 7) + ',' + (cy + 6) + ' ' + cx + ',' + (cy - 7) + '" fill="var(--bad)"/>'
    : f === 2 ? '<circle cx="' + cx + '" cy="' + cy + '" r="6.5" fill="var(--good)"/>'
    : '<polygon points="' + cx + ',' + (cy - 8) + ' ' + (cx + 7) + ',' + cy + ' ' + cx + ',' + (cy + 8) + ' ' + (cx - 7) + ',' + cy + '" fill="var(--grape)"/>';
}
function pic(q, mark){
  let g = '';
  q.b.forEach(([shape, f], i) => {
    const x0 = 4 + i*58, cx = x0 + 26, lit = mark && (q.cats.includes(i) ? 'accent' : q.pups.includes(i) ? 'warm' : q.ans === i + 1 ? 'good' : '');
    if(lit) g += '<rect x="' + (x0 - 1) + '" y="4" width="54" height="78" rx="8" fill="color-mix(in srgb, var(--' + lit + ') 22%, transparent)" stroke="var(--' + lit + ')" stroke-width="2"/>';
    g += '<path d="M' + (x0 + 12) + ',24 Q' + cx + ',2 ' + (x0 + 40) + ',24" fill="none" stroke="var(--fur-dark)" stroke-width="3" stroke-linecap="round"/>';
    g += shape ? '<polygon points="' + (x0 + 4) + ',24 ' + (x0 + 48) + ',24 ' + (x0 + 40) + ',54 ' + (x0 + 12) + ',54" fill="var(--warm)" stroke="var(--fur-dark)" stroke-width="2" stroke-linejoin="round"/>'
      : '<rect x="' + (x0 + 3) + '" y="24" width="46" height="30" rx="3" fill="var(--warm)" stroke="var(--fur-dark)" stroke-width="2"/>';
    g += fig(f, cx, 39) + '<text x="' + cx + '" y="79" font-size="15" font-weight="800" text-anchor="middle" fill="var(--ink)" ' + SVG_FONT + '>' + (i + 1) + '</text>';
  });
  return svgFrame('0 0 296 88', 430, tr('пет кошници с различни фигурки', 'п’ять кошиків із різними фігурками')) + g + '</svg>';
}
function drawBaskets(q){
  return '<div class="ask">' + tr('Сивото и черното котета спят в кошници с <b>една и съща форма</b> и еднакви фигурки върху тях, бялото и кафявото кученца спят в кошници с <b>еднакви фигурки</b> върху тях. В коя кошница спи кенгурчето?',
    'Сіре й чорне кошенята сплять у кошиках <b>однакової форми</b> й з однаковими фігурками на них, біле й коричневе цуценята сплять у кошиках з <b>однаковими фігурками</b> на них. У якому кошику спить кенгуреня?') + '</div>' + pic(q, false) + answerLine('md');
}
function eqBaskets(q){
  return tr('кошница ', 'кошик ') + q.ans;
}
function whyBaskets(q, full){
  if(!full) return tr('Първо намери двете кошници, които са съвсем еднакви: там спят котетата. После от останалите търси две с еднаква фигурка: там спят кученцата.', 'Спершу знайди два кошики, що зовсім однакові: там сплять кошенята. Потім серед решти шукай два з однаковою фігуркою: там сплять цуценята.');
  const n = (/** @type {number[]} */ a) => a.map(i => i + 1).join(tr(' и ', ' і '));
  return pic(q, true) + '<div style="text-align:center">' + tr('Котета: кошници ' + n(q.cats) + ' (форма и фигурка). Кученца: кошници ' + n(q.pups) + ' (фигурка). Остава кошница ' + q.ans + '.',
    'Кошенята: кошики ' + n(q.cats) + ' (форма й фігурка). Цуценята: кошики ' + n(q.pups) + ' (фігурка). Лишається кошик ' + q.ans + '.') + '</div>';
}
KIND.baskets = { draw:drawBaskets, eq:eqBaskets, why:whyBaskets };
