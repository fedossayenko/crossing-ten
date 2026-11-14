// Question kind 'shapedig': level 404 Цифра под фигурка — A row of shapes with a digit under each: the same shape the same digit, different shapes different digits.

// Кенгуру 2022, 2 клас, задача 9: a triangle, two circles, a square and a pentagon; under different shapes different digits and under equal
// shapes equal digits, so 3 4 4 2 6 (key A): 34526 gives the circles two digits, 34423 gives the triangle and the pentagon one, 34424 the
// circle and the pentagon one, 32446 splits the circles. The answer is a string of digits among five, so the kind brings its own options:
// slips of the right one, but from a slip that is already wrong, so a vote on the digits would not pick the right one.
import { KIND, rnd, shuffle, svgText, tr } from '../js/core.js';

// name (Bulgarian, Ukrainian) and the drawing in a 36 × 36 box
const SHAPE = [
  ['триъгълник', 'трикутник', '<polygon points="18,4 33,31 3,31" stroke-linejoin="round"/>'],
  ['кръг', 'коло', '<circle cx="18" cy="18" r="14"/>'],
  ['квадрат', 'квадрат', '<rect x="4" y="4" width="28" height="28" rx="2"/>'],
  ['петоъгълник', 'п’ятикутник', '<polygon points="18,3 33,14 27,32 9,32 3,14" stroke-linejoin="round"/>'],
  ['шестоъгълник', 'шестикутник', '<polygon points="10,5 26,5 34,18 26,31 10,31 2,18" stroke-linejoin="round"/>'],
  ['звезда', 'зірка', '<polygon points="18,3 22,13 33,14 25,21 27,32 18,26 9,32 11,21 3,14 14,13" stroke-linejoin="round"/>'],
];
/** does a string of digits match the row: the same shape the same digit, different shapes different digits */
export const shapeOk = (/** @type {number[]} */ seq, /** @type {string} */ s) => seq.every((a, i) => seq.every((b, j) => (a === b) === (s[i] === s[j])));
const agree = (/** @type {string} */ a, /** @type {string} */ b) => [...a].filter((x, i) => x === b[i]).length;
const edit = (/** @type {string} */ s) => { const i = rnd(s.length); let d; do d = String(1 + rnd(9)); while(d === s[i]); return s.slice(0, i) + d + s.slice(i + 1); };
export function genShapeDig(){
  for(;;){
    const kinds = shuffle([0, 1, 2, 3, 4, 5]).slice(0, 3 + rnd(2)), len = 5 + rnd(2);
    const seq = kinds.concat(Array.from({ length: len - kinds.length }, () => kinds[rnd(kinds.length)]));
    shuffle(seq);
    if(new Set(seq).size === len) continue;
    const dig = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]), right = seq.map(s => dig[kinds.indexOf(s)]).join('');
    // one slip first (wrong already), then every other option is that slip with one more change
    const slip = edit(right);
    if(shapeOk(seq, slip)) continue;
    const wrong = [];
    for(let k = 0; k < 40 && wrong.length < 4; k++){ const w = edit(slip); if(!shapeOk(seq, w) && w !== right && !wrong.includes(w)) wrong.push(w); }
    if(wrong.length < 4) continue;
    const all = [right].concat(wrong), near = all.map(w => all.reduce((s, x) => s + (x === w ? 0 : agree(w, x)), 0));
    if(near[0] === Math.max(...near) && near.filter(x => x === near[0]).length === 1) continue;   // not the one the others are closest to
    const opts = shuffle(all.slice()), pick = opts.indexOf(right);
    return {kind:'shapedig', seq, right, options: opts.map((w, id) => ({ id, v: id, text: [w, w] })), pick, own:true, ans: pick};
  }
}
function rowSvg(/** @type {number[]} */ seq){
  const u = 46, W = seq.length*u + 8;
  let g = '';
  seq.forEach((s, i) => { g += '<g transform="translate(' + (4 + i*u + 5) + ',6)" fill="var(--accentbg)" stroke="var(--accent)" stroke-width="2.4">' + SHAPE[s][2] + '</g>'; });
  return '<svg viewBox="0 0 ' + W + ' 50" style="display:block; width:' + Math.min(W*1.4, 340) + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('фигурки подред: ', 'фігурки підряд: ') + seq.map(s => tr(SHAPE[s][0], SHAPE[s][1])).join(', ') + '">' + g + '</svg>';
}
function drawShapeDig(q){
  return '<div class="ask">' + tr('Под всяка от фигурките има цифра: под различните фигурки — различни цифри и под еднаквите фигурки — еднакви цифри. <b>Кое от показаните подреждания на цифри е вярното?</b>',
    'Під кожною з фігурок є цифра: під різними фігурками — різні цифри, а під однаковими — однакові. <b>Яке з наведених розташувань цифр правильне?</b>') + '</div>' + rowSvg(q.seq);
}
function eqShapeDig(q){
  return q.right;
}
function whyShapeDig(q, full){
  if(!full) return tr('Еднаквите фигурки трябва да имат една и съща цифра, а различните — различни. Провери всяко подреждане: има ли две еднакви фигурки с различни цифри или две различни с една и съща цифра?',
    'Однакові фігурки мають мати однакову цифру, а різні — різні. Перевір кожне розташування: чи є дві однакові фігурки з різними цифрами або дві різні з однаковою?');
  const shown = q.options.map((o, i) => 'АБВГД'[i] + ') ' + o.text[0] + ' ' + (i === q.pick ? '&nbsp;<b>✓</b>' : '✗')).join('<br>');
  return shown + '<br>' + tr('Вярно е ', 'Правильно — ') + '<b>' + q.right + '</b>';
}
KIND.shapedig = { draw:drawShapeDig, eq:eqShapeDig, why:whyShapeDig };
