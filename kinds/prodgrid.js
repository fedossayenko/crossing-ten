// Question kind 'prodgrid': level 75 Кръстът — Four empty squares; each row and column multiplies to its shaded number.

// МБГ Есен, 3 клас, задача 17: a 2 × 2 of empty squares with a shaded number at the end of each
// row and column: column 1 gives 8, row 1 gives 6, row 2 gives 4, column 2 is "?". Both columns
// together and both rows together are the same four numbers multiplied, so 8 · ? = 6 · 4: ? = 3.
// sh: [column 1, row 1, row 2, column 2]; ask: which of them is the "?".
// 2nd grade, level 273 (shape 'sum'): the same cross with sums. Both rows together and both columns together add up
// the same four numbers, so column 2 = row 1 + row 2 − column 1, without filling a square.
import { KIND, SLOT, rnd, tr } from '../js/core.js';
export function genSumGrid(){
  for(;;){
    const c = [0, 0, 0, 0].map(() => 1 + rnd(20));
    const sh = [c[0] + c[2], c[0] + c[1], c[2] + c[3], c[1] + c[3]], ask = rnd(4);
    if(new Set(sh).size < 3) continue;
    const pair = ask === 0 || ask === 3 ? [1, 2] : [0, 3], same = ask === 0 ? 3 : ask === 3 ? 0 : ask === 1 ? 2 : 1;
    return {kind:'prodgrid', shape:'sum', c, sh, ask, pair, same, ans: sh[ask],
            traps: [sh[pair[0]] + sh[pair[1]], sh[same]].filter((v, i, t) => v !== sh[ask] && t.indexOf(v) === i)};
  }
}
export function genProdGrid(){
  for(;;){
    const c = [0, 0, 0, 0].map(() => 1 + rnd(6));            // the empty squares: [r1c1, r1c2, r2c1, r2c2]
    const sh = [c[0]*c[2], c[0]*c[1], c[2]*c[3], c[1]*c[3]], ask = rnd(4);
    if(sh.some(v => v < 2 || v > 40) || new Set(sh).size < 3) continue;
    const pair = ask === 0 || ask === 3 ? [1, 2] : [0, 3], same = ask === 0 ? 3 : ask === 3 ? 0 : ask === 1 ? 2 : 1;
    return {kind:'prodgrid', c, sh, ask, pair, same, ans: sh[ask], traps: [sh[pair[0]] + sh[pair[1]] - sh[same], sh[pair[0]]*sh[pair[1]]].filter(v => v > 0 && v !== sh[ask] && v < 1000)};
  }
}
function prodGridSvg(q){
  const u = 34, cells = [[1,1],[1,2],[2,1],[2,2]], shaded = [[0,1],[1,3],[2,0],[3,2]];
  const rect = (r, k, fill) => '<rect x="' + k*u + '" y="' + r*u + '" width="' + u + '" height="' + u + '" fill="' + fill + '" stroke="var(--ink)" stroke-width="1.6"/>';
  const txt = (r, k, t) => '<text x="' + (k*u + u/2) + '" y="' + (r*u + u/2 + 7) + '" text-anchor="middle" font-size="20" font-family="Fredoka, sans-serif" fill="var(--ink)">' + t + '</text>';
  return '<div class="fig small"><svg viewBox="-2 -2 ' + (4*u + 4) + ' ' + (4*u + 4) + '" role="img" aria-label="' + tr('кръст от квадратчета', 'хрест із клітинок') + '">' +
    cells.map(([r, k]) => rect(r, k, 'none')).join('') +
    shaded.map(([r, k], i) => rect(r, k, 'var(--goodbg)') + txt(r, k, i === q.ask ? '?' : q.sh[i])).join('') + '</svg></div>';
}
function drawProdGrid(q){
  return '<div class="ask">' + tr('Попълнете празните квадратчета с числа така, че произведението на числата в реда или колоната да е равно на числото в оцветеното квадратче от същия ред или колона. Кое е числото, което трябва да поставим вместо „?“?',
    'Заповніть порожні клітинки числами так, щоб добуток чисел у рядку чи стовпці дорівнював числу в зафарбованій клітинці того самого рядка чи стовпця. Яке число треба поставити замість «?»?') +
    '</div>' + prodGridSvg(q) + '<div class="line xl">' + SLOT + '</div>';
}
function eqProdGrid(q){
  return q.sh[q.pair[0]] + ' · ' + q.sh[q.pair[1]] + ' : ' + q.sh[q.same] + ' = ' + q.ans;
}
function whyProdGrid(q, full){
  if(!full) return tr('Двата реда заедно и двете колони заедно умножават едни и същи четири числа.', 'Два рядки разом і два стовпці разом перемножують ті самі чотири числа.');
  return tr('и двата реда, и двете колони дават произведението на четирите числа', 'і два рядки, і два стовпці дають добуток чотирьох чисел') + ' &nbsp;→&nbsp; ' +
    q.sh[q.same] + ' · ? = ' + q.sh[q.pair[0]] + ' · ' + q.sh[q.pair[1]] + ' = ' + q.sh[q.pair[0]]*q.sh[q.pair[1]] + ' &nbsp;→&nbsp; ? = ' + q.ans +
    tr(' &nbsp;(например ', ' &nbsp;(наприклад ') + q.c.join(', ') + ')';
}
function drawSumGrid(q){
  return '<div class="ask">' + tr('Попълнете празните квадратчета с числа така, че сборът на числата в реда или колоната да е равен на числото в оцветеното квадратче от същия ред или колона. Кое е числото, което трябва да поставим вместо „?“?',
    'Заповніть порожні клітинки числами так, щоб сума чисел у рядку чи стовпці дорівнювала числу в зафарбованій клітинці того самого рядка чи стовпця. Яке число треба поставити замість «?»?') +
    '</div>' + prodGridSvg(q) + '<div class="line xl">' + SLOT + '</div>';
}
const sumGridLine = q => q.sh[q.pair[0]] + ' + ' + q.sh[q.pair[1]] + ' − ' + q.sh[q.same] + ' = ' + q.ans;
function whySumGrid(q, full){
  if(!full) return tr('Двата реда заедно и двете колони заедно събират едни и същи четири числа.', 'Два рядки разом і два стовпці разом додають ті самі чотири числа.');
  const S = q.sh[q.pair[0]] + q.sh[q.pair[1]];
  return tr('и двата реда, и двете колони събират четирите числа', 'і два рядки, і два стовпці додають чотири числа') + ' (' + tr('например ', 'наприклад ') + q.c.join(', ') + ') &nbsp;→&nbsp; ' +
    q.sh[q.same] + ' + ? = ' + q.sh[q.pair[0]] + ' + ' + q.sh[q.pair[1]] + ' = ' + S + ' &nbsp;→&nbsp; ? = ' + S + ' − ' + q.sh[q.same] + ' = ' + q.ans;
}
KIND.prodgrid = { draw: q => q.shape ? drawSumGrid(q) : drawProdGrid(q), eq: q => q.shape ? sumGridLine(q) : eqProdGrid(q),
  why: (q, full) => q.shape ? whySumGrid(q, full) : whyProdGrid(q, full) };
