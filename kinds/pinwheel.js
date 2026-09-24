// Question kind 'pinwheel': level 85 Четири правоъгълника — A figure of four equal rectangles, from its perimeter.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Зима 2024, задача 12: four equal rectangles, each twice as long as it is wide, make
// the figure. Going round it: 4 long sides and 8 short ones, and two short make a long —
// so the perimeter is 8 long sides. 8 дм = 80 см → 10 см.
// The outline in short sides, clockwise from the top of the upright arm.
const PINWHEEL = [[2,0],[3,0],[3,2],[4,2],[4,3],[2,3],[2,4],[1,4],[1,2],[0,2],[0,1],[2,1]];
function genPinwheel(){
  const L = 2*(2 + rnd(5)), P = 8*L;                 // the long side, 4 to 12 см
  const dm = P % 10 === 0 && Math.random() < 0.7, long = Math.random() < 0.65;
  return {kind:'pinwheel', L, P, dm, long, ans: long ? L : L/2};
}
function pinwheelSvg(){
  const u = 38, pts = PINWHEEL.map(([x, y]) => (10 + x*u) + ',' + (10 + y*u)).join(' ');
  return '<div class="fig"><svg viewBox="0 0 ' + (20 + 4*u) + ' ' + (20 + 4*u) + '" role="img" aria-label="' +
    tr('фигура от четири правоъгълника', 'фігура з чотирьох прямокутників') + '" style="max-width:190px">' +
    '<polygon points="' + pts + '" fill="none" stroke="var(--ink)" stroke-width="2.2" stroke-linejoin="round"/></svg></div>';
}
function drawPinwheel(q){
  if(q.kind === 'pinwheel'){
    const P = q.dm ? q.P/10 + ' дм' : q.P + ' см';
    return '<div class="ask">' + tr('Фигура с обиколка <span class="num">' + P + '</span> се състои от <b>4 еднакви правоъгълника</b>. Колко сантиметра е дължината на ' +
      (q.long ? '<b>по-голямата</b>' : '<b>по-малката</b>') + ' страна на един от тези правоъгълници?',
      'Фігура з периметром <span class="num">' + P + '</span> складається з <b>4 однакових прямокутників</b>. Скільки сантиметрів становить довжина ' +
      (q.long ? '<b>більшої</b>' : '<b>меншої</b>') + ' сторони одного з цих прямокутників?') + '</div>' +
      pinwheelSvg() + '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT + CM + '</div>';
  }
}
function eqPinwheel(q){
  if(q.kind === 'pinwheel') return q.P + ' : 8 = ' + q.L + (q.long ? '' : ', ' + q.L + ' : 2 = ' + q.ans) + ' → ' + q.ans;
}
function whyPinwheel(q, full){
  if(q.kind === 'pinwheel'){
    if(!full) return tr('Обиколи фигурата и преброй дългите и късите страни. Колко къси правят една дълга?',
                        'Обійди фігуру й порахуй довгі й короткі сторони. Скільки коротких дорівнюють одній довгій?');
    return (q.dm ? q.P/10 + ' дм = ' + q.P + tr(' см; ', ' см; ') : '') +
      tr('наоколо има 4 дълги и 8 къси страни, а 2 къси са колкото 1 дълга → 8 дълги', 'навколо 4 довгі й 8 коротких сторін, а 2 короткі — як 1 довга → 8 довгих') +
      ' &nbsp;→&nbsp; ' + q.P + ' : 8 = <b>' + q.L + '</b> ' + 'см' + (q.long ? '' : ' &nbsp;→&nbsp; ' + q.L + ' : 2 = ' + q.ans);
  }
}
KIND.pinwheel = { draw:drawPinwheel, eq:eqPinwheel, why:whyPinwheel };
