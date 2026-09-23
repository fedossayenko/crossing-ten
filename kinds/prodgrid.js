// Question kind 'prodgrid': level 75 Кръстът — Four empty squares; each row and column multiplies to its shaded number.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Есен, 3 клас, задача 17: a 2 × 2 of empty squares with a shaded number at the end of each
// row and column: column 1 gives 8, row 1 gives 6, row 2 gives 4, column 2 is "?". Both columns
// together and both rows together are the same four numbers multiplied, so 8 · ? = 6 · 4: ? = 3.
// sh: [column 1, row 1, row 2, column 2]; ask: which of them is the "?".
function genProdGrid(){
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
  if(q.kind === 'prodgrid'){
    return '<div class="ask">' + tr('Попълнете празните квадратчета с числа така, че произведението на числата в реда или колоната да е равно на числото в оцветеното квадратче от същия ред или колона. Кое е числото, което трябва да поставим вместо „?“?',
      'Заповніть порожні клітинки числами так, щоб добуток чисел у рядку чи стовпці дорівнював числу в зафарбованій клітинці того самого рядка чи стовпця. Яке число треба поставити замість «?»?') +
      '</div>' + prodGridSvg(q) + '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqProdGrid(q){
  if(q.kind === 'prodgrid') return q.sh[q.pair[0]] + ' · ' + q.sh[q.pair[1]] + ' : ' + q.sh[q.same] + ' = ' + q.ans;
}
function whyProdGrid(q, full){
  if(q.kind === 'prodgrid'){
    if(!full) return tr('Двата реда заедно и двете колони заедно умножават едни и същи четири числа.', 'Два рядки разом і два стовпці разом перемножують ті самі чотири числа.');
    return tr('и двата реда, и двете колони дават произведението на четирите числа', 'і два рядки, і два стовпці дають добуток чотирьох чисел') + ' &nbsp;→&nbsp; ' +
      q.sh[q.same] + ' · ? = ' + q.sh[q.pair[0]] + ' · ' + q.sh[q.pair[1]] + ' = ' + q.sh[q.pair[0]]*q.sh[q.pair[1]] + ' &nbsp;→&nbsp; ? = ' + q.ans +
      tr(' &nbsp;(например ', ' &nbsp;(наприклад ') + q.c.join(', ') + ')';
  }
}
KIND.prodgrid = { draw:drawProdGrid, eq:eqProdGrid, why:whyProdGrid };
