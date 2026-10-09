// Question kind 'bucket': level 56 Кофата — Filling a vessel until the two possible buckets tell apart.

// Задача 10: one vessel of a known size and a bucket that is one of two sizes. Pour and
// watch: the answer is the fill at which the bigger bucket has overflowed the vessel and
// the smaller one has not, because that is the first moment the two stories differ.
import { KIND, SLOT, UK_PLURAL, popAt, rnd, svgText, tr } from '../js/core.js';
export function genBucket(){
  for(;;){
    const p = 2 + rnd(4), q = p + 1 + rnd(4);
    const V = 10 + rnd(20);
    const k = Math.ceil(V / q);
    if(k < 2 || k > 6 || k*p >= V) continue;   // more fills than that and the pouring is the work, not the thinking
    return {kind:'bucket', p, q, V, ans: k};
  }
}

const bucketLitre = n => ({one:'літр', few:'літри', many:'літрів'})[UK_PLURAL.select(n)];
function drawBucket(q){
  return '<div class="ask">' + tr('Имам съд, който събира точно <span class="num">' + q.V +
    '</span> литра. Имам и кофа, която събира <b>или</b> <span class="num">' + q.p +
    '</span> литра, <b>или</b> <span class="num">' + q.q +
    '</span> литра. Колко <b>най-малко</b> пъти трябва да напълним кофата и да я изсипем в съда, ' +
    'за да разберем колко литра събира?',
    'Маю посудину, яка вміщує рівно <span class="num">' + q.V + '</span> ' + bucketLitre(q.V) +
    '. Маю також відро, яке вміщує <b>або</b> <span class="num">' + q.p + '</span> ' + bucketLitre(q.p) +
    ', <b>або</b> <span class="num">' + q.q + '</span> ' + bucketLitre(q.q) +
    '. Яку <b>найменшу</b> кількість разів треба наповнити відро й вилити його в посудину, ' +
    'щоб дізнатися, скільки літрів воно вміщує?') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqBucket(q){
  return q.V + tr(' л, кофа ' + q.p + ' или ', ' л, відро ' + q.p + ' або ') + q.q + ' → ' + q.ans;
}
// The two stories, a row of fills for each bucket, numbered, against the vessel's mark: the bigger bucket's row
// passes the mark first, and what spills over is red. The last fill, outlined, is where one has spilled and the
// other has not.
function bucketSvg(q){
  const u = 200 / (q.ans * q.q), x0 = 56, xV = x0 + q.V * u;
  let g = '<g' + popAt(0) + '><line x1="' + xV.toFixed(1) + '" y1="18" x2="' + xV.toFixed(1) + '" y2="96" stroke="var(--ink)" stroke-width="1.5" stroke-dasharray="4 3"/>' +
    svgText(xV.toFixed(1), 12, q.V + ' л', 12, 'var(--ink)') + '</g>';   // first, so the fills cover it: the red shows the mark there
  [q.q, q.p].forEach((b, r) => {
    const y = 28 + r * 38, end = x0 + q.ans * b * u;
    let row = svgText(24, y + 15, b + ' л', 12, 'var(--ink)');
    for(let j = 1; j <= q.ans; j++){
      const x = x0 + (j - 1) * b * u, last = j === q.ans;
      row += '<rect x="' + x.toFixed(1) + '" y="' + y + '" width="' + (b * u).toFixed(1) + '" height="22" fill="var(--accentbg)"/>';
      if(x + b * u > xV) row += '<rect x="' + Math.max(x, xV).toFixed(1) + '" y="' + y + '" width="' + (x + b * u - Math.max(x, xV)).toFixed(1) + '" height="22" fill="var(--badbg)"/>';
      row += '<rect x="' + x.toFixed(1) + '" y="' + y + '" width="' + (b * u).toFixed(1) + '" height="22" fill="none" stroke="' + (last ? 'var(--warm)' : 'var(--accent)') + '" stroke-width="' + (last ? 2.5 : 1.5) + '"/>';
      row += svgText((x + b * u / 2).toFixed(1), y + 15, j, b * u < 14 ? 8.5 : 10, last ? 'var(--warmink)' : 'var(--ink)');
    }
    g += '<g' + popAt(1 + r * 2) + '>' + row + svgText((end + 16).toFixed(1), y + 15, q.ans * b, 11, end > xV ? 'var(--bad)' : 'var(--muted)') + '</g>';
  });
  return '<svg viewBox="0 0 300 126" style="display:block; width:300px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('пълненията с двете кофи', 'наповнення двома відрами') + '">' + g +
    svgText(150, 120, tr('пълнене номер ', 'наповнення номер ') + q.ans, 14, 'var(--ink)', popAt(5)) + '</svg>';
}
function whyBucket(q, full){
  if(!full) return tr('Кога съдът ще прелее при едната кофа, а при другата още не?',
                      'Коли посудина переллється з одним відром, а з іншим ще ні?');
  const big = [], small = [];
  for(let i = 1; i <= q.ans; i++){ big.push(i*q.q); small.push(i*q.p); }
  return tr('ако е ' + q.q + ' л: ' + big.join(', ') + (q.ans*q.q > q.V ? ' — съдът прелива' : ' — съдът е пълен догоре') + '; ако е ' + q.p + ' л: ' +
    small.join(', ') + ' — още не е пълен &nbsp;→&nbsp; различават се при пълнене номер ',
    'якщо відро ' + q.q + ' л: ' + big.join(', ') + (q.ans*q.q > q.V ? ' — посудина переливається' : ' — посудина повна вщерть') + '; якщо ' + q.p + ' л: ' +
    small.join(', ') + ' — ще не повна &nbsp;→&nbsp; їх можна розрізнити на наповненні номер ') + q.ans + bucketSvg(q);
}
KIND.bucket = { draw:drawBucket, eq:eqBucket, why:whyBucket };
