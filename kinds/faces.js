// Question kind 'faces': level 396 Лице без двойка — Fifteen faces of eight kinds, every kind twice but one: which face is there only once.

// Кенгуру 2024, задача 5: «8 различни лица. Всяко лице с изключение на едно се появява два пъти. Кое лице участва само веднъж?»: 15 faces
// (3 rows of 5), C. A face is three yes-or-no things: a hat, glasses, an open mouth, so there are eight kinds. The answer is a picture, so
// the kind brings its own А–Д: the right face and four others, kinds which the grid shows twice. No vote on the three things gives it away
// (what most of the five options have, or what most do not, is never the right face).
import { KIND, rnd, shuffle, svgFrame, tr } from '../js/core.js';
const LETTERS = 'АБВГД';
export function genFaces(){
  for(;;){
    const alone = rnd(8), others = shuffle([0, 1, 2, 3, 4, 5, 6, 7].filter(t => t !== alone)), opts = [alone].concat(others.slice(0, 4));
    const vote = (/** @type {boolean} */ most) => [1, 2, 4].reduce((a, bit) => a + ((opts.filter(t => t & bit).length*2 > 5) === most ? bit : 0), 0);
    if(vote(true) === alone || vote(false) === alone) continue;
    const order = shuffle(opts.slice()), pick = order.indexOf(alone), grid = shuffle([alone].concat(others, others));
    return {kind:'faces', grid, alone, own:true, pick, ans:pick, options: order.map((t, id) => ({ id, v:id, text:face(t, 56, 'вариант ' + LETTERS[id], 'варіант ' + LETTERS[id]), type:t }))};
  }
}
/** one face, kind t: bit 1 a hat, bit 2 glasses, bit 4 an open mouth, drawn in a 44 x 46 box */
function faceG(t){
  const f = 'var(--fur-dark)';
  return '<circle cx="22" cy="28" r="16" fill="color-mix(in srgb, var(--warm) 55%, var(--paper))" stroke="' + f + '" stroke-width="1.6"/>' +
    '<circle cx="16" cy="26" r="2" fill="' + f + '"/><circle cx="28" cy="26" r="2" fill="' + f + '"/>' +
    (t & 2 ? '<circle cx="16" cy="26" r="5.5" fill="none" stroke="' + f + '" stroke-width="1.6"/><circle cx="28" cy="26" r="5.5" fill="none" stroke="' + f + '" stroke-width="1.6"/><path d="M21.5,26 h1" stroke="' + f + '" stroke-width="1.6"/>' : '') +
    (t & 4 ? '<ellipse cx="22" cy="35" rx="3.2" ry="4" fill="' + f + '"/>' : '<path d="M15,34 Q22,41 29,34" fill="none" stroke="' + f + '" stroke-width="2" stroke-linecap="round"/>') +
    (t & 1 ? '<path d="M12,16 L12,6 Q22,1 32,6 L32,16Z M6,16 H38" fill="var(--grape)" stroke="var(--grape)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>' : '');
}
function face(t, w, bg, uk){
  return ['<span class="vw">' + svgFrame('0 0 44 46', w, bg).replace('margin:6px auto 0', 'margin:0') + faceG(t) + '</svg></span>', '<span class="vw">' + svgFrame('0 0 44 46', w, uk).replace('margin:6px auto 0', 'margin:0') + faceG(t) + '</svg></span>'];
}
function grid(q){
  return svgFrame('0 0 230 150', 330, tr('15 лица в три реда по пет', '15 облич у три рядки по п’ять')) + q.grid.map((t, i) => '<g transform="translate(' + ((i % 5)*46) + ' ' + (Math.floor(i / 5)*50) + ')">' + faceG(t) + '</g>').join('') + '</svg>';
}
function drawFaces(q){
  return '<div class="ask">' + tr('На картинката са показани 8 различни лица. Всяко лице с изключение на едно се появява два пъти. <b>Кое лице участва само веднъж</b> на картинката?',
    'На картинці показано 8 різних облич. Кожне обличчя, крім одного, з’являється двічі. <b>Яке обличчя є лише один раз</b> на картинці?') + '</div>' + grid(q);
}
function eqFaces(q){
  return tr('лицето без двойка', 'обличчя без пари');
}
const describe = (/** @type {number} */ t) => tr((t & 1 ? 'с шапка' : 'без шапка') + ', ' + (t & 2 ? 'с очила' : 'без очила') + ', ' + (t & 4 ? 'с отворена уста' : 'с усмихната уста'),
  (t & 1 ? 'у капелюсі' : 'без капелюха') + ', ' + (t & 2 ? 'в окулярах' : 'без окулярів') + ', ' + (t & 4 ? 'з відкритим ротом' : 'з усмішкою'));
function whyFaces(q, full){
  if(!full) return tr('За всяко лице потърси второто такова: със същата шапка, очила и уста. Лицето без двойка е това.', 'Для кожного обличчя шукай друге таке саме: з тим самим капелюхом, окулярами й ротом. Обличчя без пари — це воно.');
  return tr('Само веднъж е лицето ' + LETTERS[q.pick] + ': ' + describe(q.alone) + '. Всички други лица на картинката имат двойка.', 'Лише раз є обличчя ' + LETTERS[q.pick] + ': ' + describe(q.alone) + '. Усі інші обличчя на картинці мають пару.');
}
KIND.faces = { draw:drawFaces, eq:eqFaces, why:whyFaces };
