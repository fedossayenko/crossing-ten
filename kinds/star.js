// Question kind 'star': level 69 Звезда — Equilateral triangles built on the sides of a square, and the square's perimeter.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Есен, 3 клас, задача 11: an outer equilateral triangle on every side of a square makes a
// star with perimeter 9 cm; the square's perimeter in mm. The star has 8 sides the length of the
// square's side and the square 4 of them, so it is half: 90 : 2 = 45 mm (a side, 11.25 mm, is not
// whole — the trick is not to need it). k: how many sides carry a triangle.
function genStar(){
  for(;;){
    const k = [4, 4, 3, 2][rnd(4)], P = 6 + rnd(25), n = 4 + k;     // the figure's outline: 4 − k square sides + 2k triangle sides
    if(40*P % n) continue;
    return {kind:'star', k, P, n, ans: 40*P / n, traps: [10*P, 5*P].filter(v => v !== 40*P / n)};
  }
}
function starSvg(q){
  const s = 50, o = 60, h = s * 0.866, sq = [[o, o], [o + s, o], [o + s, o + s], [o, o + s]];
  const tips = [[o + s/2, o - h], [o + s + h, o + s/2], [o + s/2, o + s + h], [o - h, o + s/2]];
  let lines = '<polygon points="' + sq.map(p => p.join(',')).join(' ') + '" fill="none" stroke="var(--ink)" stroke-width="2"/>';
  for(let i = 0; i < q.k; i++){
    const a = sq[i], b = sq[(i + 1) % 4], t = tips[i];
    lines += '<polyline points="' + [a, t, b].map(p => p.map(v => v.toFixed(1)).join(',')).join(' ') + '" fill="none" stroke="var(--ink)" stroke-width="2"/>';
  }
  return '<div class="fig small"><svg viewBox="10 10 150 150" role="img" aria-label="' + tr('квадрат с триъгълници', 'квадрат із трикутниками') + '">' + lines + '</svg></div>';
}
function drawStar(q){
  if(q.kind === 'star'){
    const where = { 4: ['всяка страна', 'кожній стороні'], 3: ['три от страните', 'трьох сторонах'], 2: ['две от страните', 'двох сторонах'] }[q.k];
    return '<div class="ask">' + tr('Върху ' + where[0] + ' на квадрат е построен ' + (q.k < 4 ? 'по един ' : '') + 'външен равностранен триъгълник. ' +
      'Получената фигура има обиколка <span class="num">' + q.P + '</span> см. Колко милиметра е обиколката на квадрата?',
      'На ' + where[1] + ' квадрата побудовано ' + (q.k < 4 ? 'по одному зовнішньому рівносторонньому трикутнику' : 'зовнішній рівносторонній трикутник') + '. ' +
      'Отримана фігура має периметр <span class="num">' + q.P + '</span> см. Скільки міліметрів становить периметр квадрата?') + '</div>' +
      starSvg(q) + '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT + ' <span class="unit">мм</span></div>';
  }
}
function eqStar(q){
  if(q.kind === 'star') return q.P*10 + ' · 4 : ' + q.n + ' = ' + q.ans + tr(' мм', ' мм');
}
function whyStar(q, full){
  if(q.kind === 'star'){
    if(!full) return tr('Всички страни на фигурата са равни на страната на квадрата. Колко са те — и колко от тях има квадратът?',
                        'Усі сторони фігури дорівнюють стороні квадрата. Скільки їх — і скільки з них має квадрат?');
    return tr('фигурата има <b>' + q.n + '</b> равни страни, квадратът — <b>4</b> от тях', 'фігура має <b>' + q.n + '</b> рівних сторін, квадрат — <b>4</b> з них') +
      ' &nbsp;→&nbsp; ' + q.P + tr(' см = ', ' см = ') + q.P*10 + ' мм &nbsp;→&nbsp; ' + q.P*10 + ' · 4 : ' + q.n + ' = ' + q.ans + ' мм';
  }
}
KIND.star = { draw:drawStar, eq:eqStar, why:whyStar };
