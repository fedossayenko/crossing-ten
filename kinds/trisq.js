// Question kind 'trisq': level 72 Триъгълник и квадрат — A triangle's side against a square's perimeter, in millimetres.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Есен, 3 клас, задача 14: an equilateral triangle with perimeter 12 cm has a side 2 cm longer
// than a square's perimeter; the square's side in mm. Side 4 cm, so the square's perimeter is
// 2 cm = 20 mm and its side 5 mm.
function genTriVsSq(){
  for(;;){
    const t = 3 + rnd(12), d = 1 + rnd(t - 1), x = t - d;
    if(x < 1 || x % 2) continue;                               // 10x mm split in four must come out whole
    return {kind:'trisq', t, d, ans: 10*x / 4, traps: [10*x, x*10 / 2, t*10 / 4].filter(v => Number.isInteger(v) && v !== 10*x / 4)};
  }
}
function drawTriSq(q){
  if(q.kind === 'trisq'){
    return '<div class="ask">' + tr('Страната на равностранен триъгълник с обиколка <span class="num">' + 3*q.t + '</span> см е с <span class="num">' + q.d +
      '</span> см по-голяма от обиколката на квадрат. Колко милиметра е страната на квадрата?',
      'Сторона рівностороннього трикутника з периметром <span class="num">' + 3*q.t + '</span> см на <span class="num">' + q.d +
      '</span> см більша за периметр квадрата. Скільки міліметрів становить сторона квадрата?') + '</div>' +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT + ' <span class="unit">мм</span></div>';
  }
}
function eqTriSq(q){
  if(q.kind === 'trisq') return 3*q.t + ' : 3 = ' + q.t + ', ' + q.t + ' − ' + q.d + ' = ' + (q.t - q.d) + ' см = ' + 10*(q.t - q.d) + ' мм, : 4 = ' + q.ans + ' мм';
}
function whyTriSq(q, full){
  if(q.kind === 'trisq'){
    if(!full) return tr('Първо страната на триъгълника, после обиколката на квадрата — и я преведи в милиметри.',
                        'Спершу сторона трикутника, потім периметр квадрата — і переведи його в міліметри.');
    const x = q.t - q.d;
    return tr('страната на триъгълника: ', 'сторона трикутника: ') + 3*q.t + ' : 3 = ' + q.t + tr(' см &nbsp;→&nbsp; обиколката на квадрата: ', ' см &nbsp;→&nbsp; периметр квадрата: ') +
      q.t + ' − ' + q.d + ' = ' + x + ' см = ' + 10*x + ' мм &nbsp;→&nbsp; ' + 10*x + ' : 4 = ' + q.ans + ' мм';
  }
}
KIND.trisq = { draw:drawTriSq, eq:eqTriSq, why:whyTriSq };
