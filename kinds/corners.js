// Question kind 'corners': level 143 Страни и върхове — The sides and corners of a few figures, counted together.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Коледно 2023, задача 3: two rectangles, a square and three triangles — their sides and vertices together.
// A figure has as many vertices as sides, so a rectangle gives 8, a triangle 6: 8 + 8 + 8 + 6 + 6 + 6 = 42.
// The trap is to count the sides only (21), or one triangle as 3.
// [Bulgarian singular, Bulgarian count form, Ukrainian genitive singular, Ukrainian genitive plural, sides]
/** @type {[string, string, string, string, number][]} */
const CORNER_FIGS = [['правоъгълник', 'правоъгълника', 'прямокутника', 'прямокутників', 4],
                     ['квадрат', 'квадрата', 'квадрата', 'квадратів', 4],
                     ['триъгълник', 'триъгълника', 'трикутника', 'трикутників', 3]];
function genCorners(){
  for(;;){
    const n = [rnd(4), rnd(3), rnd(4)], asks = Math.random() < 0.7 ? 0 : 1 + rnd(2);
    if(n.filter(Boolean).length < 2) continue;
    const sides = n.reduce((t, k, i) => t + k*CORNER_FIGS[i][4], 0);
    return {kind:'corners', n, asks, sides, traps: asks ? [2*sides] : [sides], ans: asks ? sides : 2*sides};
  }
}
function cornersList(q, uk){
  const parts = q.n.map((k, i) => !k ? '' : uk ? ['', 'одного', 'двох', 'трьох'][k] + ' ' + CORNER_FIGS[i][k === 1 ? 2 : 3]
                                                : ['', 'един', 'два', 'три'][k] + ' ' + CORNER_FIGS[i][k === 1 ? 0 : 1]).filter(Boolean);
  return parts.slice(0, -1).join(', ') + (uk ? ' і ' : ' и ') + parts[parts.length - 1];
}
function drawCorners(q){
  if(q.kind === 'corners'){
    const what = [['страните и върховете', 'сторін і вершин'], ['страните', 'сторін'], ['върховете', 'вершин']][q.asks];
    return '<div class="ask">' + tr('Колко общо са <b>' + what[0] + '</b> на ' + cornersList(q) + '?',
      'Скільки всього <b>' + what[1] + '</b> у ' + cornersList(q, true) + '?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
// every figure's own share, one figure at a time: 8 + 8 + 6
const cornersEach = q => [].concat(...q.n.map((k, i) => Array(k).fill(CORNER_FIGS[i][4]*(q.asks ? 1 : 2))));
function eqCorners(q){
  if(q.kind === 'corners') return cornersEach(q).join(' + ') + ' = ' + q.ans;
}
function whyCorners(q, full){
  if(q.kind === 'corners'){
    if(!full) return q.asks ? tr('Колко ' + (q.asks === 1 ? 'страни' : 'върха') + ' има всяка фигура?', 'Скільки ' + (q.asks === 1 ? 'сторін' : 'вершин') + ' у кожної фігури?')
      : tr('Колко страни и колко върха има всяка фигура? Брой и двете.', 'Скільки сторін і скільки вершин у кожної фігури? Рахуй і ті, і ті.');
    const one = CORNER_FIGS.filter((_, i) => q.n[i]).map(f => tr(f[0], f[2].replace(/а$/, '')) + ': ' + (q.asks ? f[4] : f[4] + ' + ' + f[4] + ' = ' + 2*f[4]));
    return one.join(', ') + ' &nbsp;→&nbsp; ' + cornersEach(q).join(' + ') + ' = ' + q.ans;
  }
}
KIND.corners = { draw:drawCorners, eq:eqCorners, why:whyCorners };
