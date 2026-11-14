// Question kind 'faces': level 396 Лице без двойка — Fifteen faces of eight kinds, every kind twice but one: which face is there only once.

// Кенгуру 2024, задача 5: «8 различни лица. Всяко лице с изключение на едно се появява два пъти. Кое лице участва само веднъж?»: 15 faces
// (3 rows of 5), C. A face is three yes-or-no things: a hat, glasses, an open mouth, so there are eight kinds. The answer is a picture, so
// the kind brings its own А–Д: the right face and four others, kinds which the grid shows twice. No vote on the three things gives it away
// (what most of the five options have, or what most do not, is never the right face).
import { KIND, rnd, shuffle, svgFrame, svgText, tr } from '../js/core.js';
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
// Салабашев 2020, задача 9 (shape 'latin', level 513): a 3 × 3 grid of faces, each face its eyes, its nose and its mouth, each of three kinds
// (a circle, a square, a triangle; a straight, a smiling, a sad mouth). Every row and every column has each kind of each part once, so the
// face in the empty place is the one the row and the column leave out. The answer is a picture: its own А–Г, the right face and three that
// differ from it in one, two or all three parts; no vote on the parts (the face most like the others, or least) picks the right one.
const KINDS = ['circle', 'square', 'triangle'];
const latin = () => { const p = shuffle([0, 1, 2]), d = 1 + rnd(2); return [0, 1, 2].map(r => [0, 1, 2].map(c => p[(c + d*r) % 3])); };
export function genFacesLatin(){
  for(;;){
    const sq = [latin(), latin(), latin()], hole = rnd(9), r = Math.floor(hole / 3), c = hole % 3, right = sq.map(L => L[r][c]);
    const wrong = [];
    while(wrong.length < 3){
      const f = right.map(v => rnd(2) ? v : (v + 1 + rnd(2)) % 3);
      if(f.join() !== right.join() && !wrong.some(w => w.join() === f.join())) wrong.push(f);
    }
    const opts = [right].concat(wrong), score = opts.map((o, i) => opts.reduce((t, p, j) => t + (i === j ? 0 : o.filter((v, k) => v === p[k]).length), 0));
    const best = Math.max(...score), worst = Math.min(...score);
    if((score.filter(v => v === best).length === 1 && score[0] === best) || (score.filter(v => v === worst).length === 1 && score[0] === worst)) continue;
    // nor the face with the most, or the fewest, circles, squares or triangles among its three parts
    const feats = [0, 1, 2].map(v => opts.map(o => o.filter(x => x === v).length));
    if(feats.some(vv => [1, -1].some(sg => { const b = Math.max(...vv.map(x => x*sg)), at = vv.map((x, i) => x*sg === b ? i : -1).filter(i => i >= 0); return at.length === 1 && at[0] === 0; }))) continue;
    const order = shuffle(opts.map((f, i) => i)), pick = order.indexOf(0);
    return {kind:'faces', shape:'latin', sq, hole, own:true, pick, ans:pick, options: order.map((i, id) => ({ id, v:id, text:faceL(opts[i], 56, id), parts:opts[i] }))};
  }
}
/** a face of three parts [eyes, nose, mouth], each 0, 1 or 2, in a 44 x 46 box */
function faceLG(f){
  const k = 'var(--coal)', fill = 'fill="' + k + '"', eye = x => f[0] === 0 ? '<circle cx="' + x + '" cy="14" r="4.4" ' + fill + '/>' : f[0] === 1 ? '<rect x="' + (x - 4) + '" y="10" width="8" height="8" ' + fill + '/>' :
    '<polygon points="' + (x - 4.6) + ',10 ' + (x + 4.6) + ',10 ' + x + ',18" ' + fill + '/>';
  const nose = f[1] === 0 ? '<circle cx="22" cy="27" r="3.8" ' + fill + '/>' : f[1] === 1 ? '<rect x="18.2" y="23.2" width="7.6" height="7.6" ' + fill + '/>' : '<polygon points="17.5,30.5 26.5,30.5 22,23" ' + fill + '/>';
  const mouth = f[2] === 0 ? '<line x1="10" y1="39" x2="34" y2="39" stroke="' + k + '" stroke-width="1.6"/>' : f[2] === 1 ? '<path d="M10,36 Q22,45 34,36" fill="none" stroke="' + k + '" stroke-width="1.6"/>' : '<path d="M10,42 Q22,33 34,42" fill="none" stroke="' + k + '" stroke-width="1.6"/>';
  return '<rect x="0.8" y="0.8" width="42.4" height="44.4" rx="2" fill="color-mix(in srgb, var(--warm) 22%, var(--paper))" stroke="var(--ink)" stroke-width="1.2"/>' + eye(12.5) + eye(31.5) + nose + mouth;
}
function faceL(f, w, id){
  const lt = 'АБВГ'[id];
  return ['<span class="vw">' + svgFrame('0 0 44 46', w, 'вариант ' + lt).replace('margin:6px auto 0', 'margin:0') + faceLG(f) + '</svg></span>', '<span class="vw">' + svgFrame('0 0 44 46', w, 'варіант ' + lt).replace('margin:6px auto 0', 'margin:0') + faceLG(f) + '</svg></span>'];
}
function latinGrid(q){
  return svgFrame('0 0 144 150', 240, tr('3 реда по 3 лица, едно липсва', '3 ряди по 3 обличчя, одного не вистачає')) + Array.from({ length: 9 }, (v, i) => {
    const x = (i % 3)*50, y = Math.floor(i / 3)*52;
    return i === q.hole ? '<g transform="translate(' + x + ' ' + y + ')"><rect x="0.8" y="0.8" width="42.4" height="44.4" rx="2" fill="color-mix(in srgb, var(--warm) 12%, var(--paper))" stroke="var(--ink)" stroke-width="1.2"/>' + svgText(22, 31, '?', 26, 'var(--ink)') + '</g>'
      : '<g transform="translate(' + x + ' ' + y + ')">' + faceLG(q.sq.map(L => L[Math.floor(i / 3)][i % 3])) + '</g>'; }).join('') + '</svg>';
}
const PART = [['кръгли очи', 'квадратни очи', 'триъгълни очи'], ['кръгъл нос', 'квадратен нос', 'триъгълен нос'], ['права уста', 'усмихната уста', 'тъжна уста']];
const PART_UK = [['круглі очі', 'квадратні очі', 'трикутні очі'], ['круглий ніс', 'квадратний ніс', 'трикутний ніс'], ['прямий рот', 'усміхнений рот', 'сумний рот']];
const missing = q => q.sq.map(L => L[Math.floor(q.hole / 3)][q.hole % 3]);
function drawFaces(q){
  if(q.shape === 'latin') return '<div class="ask">' + tr('В таблицата всеки ред и всяка колона имат очи, нос и уста от всеки вид по веднъж. Коя картинка трябва да е на мястото на <b>въпросителния знак</b>?',
    'У таблиці кожен ряд і кожен стовпець мають очі, ніс і рот кожного виду по одному разу. Яка картинка має бути на місці <b>знака питання</b>?') + '</div><div class="fig">' + latinGrid(q) + '</div>';
  return '<div class="ask">' + tr('На картинката са показани 8 различни лица. Всяко лице с изключение на едно се появява два пъти. <b>Кое лице участва само веднъж</b> на картинката?',
    'На картинці показано 8 різних облич. Кожне обличчя, крім одного, з’являється двічі. <b>Яке обличчя є лише один раз</b> на картинці?') + '</div>' + grid(q);
}
function eqFaces(q){
  if(q.shape === 'latin') return tr('във всеки ред и колона по веднъж от всеки вид', 'у кожному ряду й стовпці по одному разу кожного виду');
  return tr('лицето без двойка', 'обличчя без пари');
}
const describe = (/** @type {number} */ t) => tr((t & 1 ? 'с шапка' : 'без шапка') + ', ' + (t & 2 ? 'с очила' : 'без очила') + ', ' + (t & 4 ? 'с отворена уста' : 'с усмихната уста'),
  (t & 1 ? 'у капелюсі' : 'без капелюха') + ', ' + (t & 2 ? 'в окулярах' : 'без окулярів') + ', ' + (t & 4 ? 'з відкритим ротом' : 'з усмішкою'));
function whyFaces(q, full){
  if(q.shape === 'latin'){
    if(!full) return tr('Гледай части по части: очите, носа, устата. В реда и колоната на въпросителния знак вече има два вида; липсва третият.', 'Дивись частинами: очі, ніс, рот. У ряду й стовпці знака питання вже є два види; бракує третього.');
    const m = missing(q);
    return tr('липсват: ' + m.map((v, i) => PART[i][v]).join(', ') + ' — това е лице ' + LETTERS[q.pick], 'бракує: ' + m.map((v, i) => PART_UK[i][v]).join(', ') + ' — це обличчя ' + LETTERS[q.pick]);
  }
  if(!full) return tr('За всяко лице потърси второто такова: със същата шапка, очила и уста. Лицето без двойка е това.', 'Для кожного обличчя шукай друге таке саме: з тим самим капелюхом, окулярами й ротом. Обличчя без пари — це воно.');
  return tr('Само веднъж е лицето ' + LETTERS[q.pick] + ': ' + describe(q.alone) + '. Всички други лица на картинката имат двойка.', 'Лише раз є обличчя ' + LETTERS[q.pick] + ': ' + describe(q.alone) + '. Усі інші обличчя на картинці мають пару.');
}
KIND.faces = { draw:drawFaces, eq:eqFaces, why:whyFaces };
