// Question kind 'rectdm': level 91 Обиколка в дм — A rectangle's perimeter, asked in another unit.

// Коледно състезание 2025, задача 3: a 16 см by 24 см rectangle, its perimeter in дециметри.
// 16 + 24 = 40, twice is 80 см, and 10 см make a дециметър: 8. The trap is stopping at 80.
// МБГ Зима 2021–2023: one side given, the other «с 2 дм по-дълга», and the perimeter asked in
// метра — or in мм and дециметра. Two unit changes, one inside the problem and one at the end.
import { CM, KIND, SLOT, bgWith, popAt, rnd, svgText, tr } from '../js/core.js';
const RECT_U = { мм:1, см:10, дм:100, м:1000 }, RECT_W = { см:['сантиметра','сантиметрів'], дм:['дециметра','дециметрів'], м:['метра','метрів'] };
export function genRectLonger(){
  for(;;){
    const mm = Math.random() < 0.3, base = mm ? 'мм' : 'см', dU = mm ? 'мм' : 'дм';
    const a = 5 + rnd(40), d = mm ? 5 + rnd(40) : 1 + rnd(4), b = a + d*RECT_U[dU]/RECT_U[base], P = 2*(a + b);
    const to = (mm ? ['дм', 'см'] : ['м', 'дм']).find(u => P*RECT_U[base] % RECT_U[u] === 0);
    if(!to || (to === (mm ? 'см' : 'дм') && Math.random() < 0.7)) continue;   // mostly the bigger unit, as the papers ask
    return {kind:'rectdm', shape:1, a, d, base, dU, b, P, to, ans: P*RECT_U[base]/RECT_U[to]};
  }
}
// МБГ Полуфинал 2024, 1 клас, задача 15: one side 3 см, the other 2 см longer, all in сантиметри. The other
// side is 3 + 2 = 5, and the four sides 3 + 5 + 3 + 5 = 16. The slips stop at one side of each (3 + 5 = 8),
// or add the two numbers given (3 + 2 = 5).
export function genRectSame(){
  const a = 2 + rnd(8), d = 1 + rnd(4), b = a + d;
  return {kind:'rectdm', shape:2, a, d, b, traps:[a + b, a + d], ans: 2*(a + b)};
}
export function genRectDm(){
  for(;;){
    const a = 3 + rnd(28), b = a + 1 + rnd(25), P = 2*(a + b);
    if(P % 10 || P > 150) continue;
    return {kind:'rectdm', a, b, P, ans: P / 10};
  }
}
// Level 251. МБГ Есен 2024, 3 клас, задача 11: a square's side is 15 мм — how many сантиметри round? 4 · 15 = 60 мм = 6 см.
// Есен 2023, 3 клас, задача 12: the side is 5 см и 5 мм, that is 55 мм; 4 · 55 = 220 мм = 22 см. A side ending in
// 5 мм makes the four sides whole сантиметри. The slips: the 5 мм dropped (4 · 5 = 20), or the perimeter left in мм.
export function genSqPerimMm(){
  const cmmm = Math.random() < 0.5, s = cmmm ? 10*(1 + rnd(9)) + 5 : 10*rnd(10) + 5;
  return {kind:'rectdm', shape: cmmm ? 'cmmm' : 'mm', s, traps: cmmm ? [4*Math.floor(s / 10), 4*s] : [4*s], ans: 4*s / 10};
}
// Level 281 Обиколка на правоъгълник. Аз и числата 2026, задача 7: a school pool, one side 25 м, the other 8 м shorter —
// the other side 25 − 8 = 17 (shape 'side'), and the pool's perimeter 25 + 17 + 25 + 17 = 84 (shape 'perim'). The slip:
// «по-къса» added. Аз и числата 2025, задача 11 (shape 'row'): three squares of side 6 см in a row — the whole figure's
// perimeter: 18 + 6 + 18 + 6 = 48; the inner sides are not on its edge (all three squares' perimeters would be 72).
// Аз и числата 2025, задача 4 (shape 'house'): a rectangle 4 см long with an equilateral triangle of side 2 см on its short
// side — the width is the triangle's side, so 4 + 2 + 4 + 2 = 12.
// [Bulgarian, its definite form; Ukrainian, its genitive; the unit]
const RECT_POOL = [['Плувен басейн в училище', 'басейна', 'Плавальний басейн у школі', 'басейну', 'м'], ['Училищният двор', 'двора', 'Шкільне подвір’я', 'подвір’я', 'м'],
  ['Зеленчуковата градина', 'градината', 'Город', 'городу', 'м'], ['Картина', 'картината', 'Картина', 'картини', 'см'], ['Килимът в стаята', 'килима', 'Килим у кімнаті', 'килима', 'дм']];
export function genRectPool(){
  for(;;){
    const r = Math.random();
    if(r < 0.25){   // squares in a row
      const m = 2 + rnd(3), s = 2 + rnd(9), P = 2*(m*s + s);
      if(P > 100) continue;
      return {kind:'rectdm', shape:'row', m, s, traps:[4*s*m, 4*s, 2*m*s + s].filter(v => v !== P), ans: P};
    }
    if(r < 0.45){   // a rectangle with an equilateral triangle on its short side
      const t = 2 + rnd(8), L = t + 2 + rnd(10);
      return {kind:'rectdm', shape:'house', t, L, traps:[2*L + t, L + t, 2*L].filter(v => v !== 2*(L + t)), ans: 2*(L + t)};
    }
    const thing = rnd(RECT_POOL.length), a = 10 + rnd(31), d = 2 + rnd(14), short = Math.random() < 0.7, b = short ? a - d : a + d, P = 2*(a + b);
    if(b < 4 || P > 100) continue;
    const perim = r >= 0.65, wrong = short ? a + d : a - d;
    return {kind:'rectdm', shape: perim ? 'perim' : 'side', thing, a, d, short, b,
      traps: (perim ? [a + b, 2*(a + wrong)] : [wrong]).filter(v => v > 0 && v !== (perim ? P : b)), ans: perim ? P : b};
  }
}
// the squares in a row (the solution's: the edge of the whole figure in colour, its length and height written)
function rectRowSvg(q, full){
  const u = Math.min(30, 220 / (q.m*q.s)) * q.s, X = 26, Y = 18, w = q.m*u, edge = full ? 'var(--warm)' : 'var(--ink)';
  let inner = '';
  for(let i = 1; i < q.m; i++) inner += '<line x1="' + (X + i*u).toFixed(1) + '" y1="' + Y + '" x2="' + (X + i*u).toFixed(1) + '" y2="' + (Y + u).toFixed(1) + '" stroke="var(--ink)" stroke-width="2"' + (full ? ' stroke-dasharray="4 4" opacity="0.5"' : '') + '/>';
  return '<svg viewBox="0 0 ' + (w + 2*X).toFixed(1) + ' ' + (u + 2*Y + 4).toFixed(1) + '"' + (full ? ' style="display:block; width:' + Math.round((w + 2*X)*1.2) + 'px; max-width:100%; margin:6px auto 0"' : '') +
    ' role="img" aria-label="' + tr('квадрати в редица', 'квадрати в ряд') + '"><rect x="' + X + '" y="' + Y + '" width="' + w.toFixed(1) + '" height="' + u.toFixed(1) + '" fill="var(--accentbg)" stroke="' + edge + '" stroke-width="2.5"/>' + inner +
    (full ? svgText((X + w/2).toFixed(1), Y - 5, q.m*q.s + ' см', 13, 'var(--warm)', popAt(1)) + svgText((X - 13).toFixed(1), (Y + u/2 + 5).toFixed(1), q.s, 13, 'var(--ink)', popAt(2)) : '') + '</svg>';
}
// the rectangle and the triangle on its right-hand short side (the solution's: the width written as the triangle's side)
function rectHouseSvg(q, full){
  const k = Math.min(16, 150 / (q.L + q.t)), w = q.L*k, h = q.t*k, X = 22, Y = 16, tip = h*0.866;
  return '<svg viewBox="0 0 ' + (w + tip + 2*X).toFixed(1) + ' ' + (h + 2*Y + 4).toFixed(1) + '"' + (full ? ' style="display:block; width:' + Math.round((w + tip + 2*X)*1.3) + 'px; max-width:100%; margin:6px auto 0"' : '') +
    ' role="img" aria-label="' + tr('правоъгълник и триъгълник', 'прямокутник і трикутник') + '">' +
    '<path d="M' + (X + w).toFixed(1) + ' ' + Y + 'L' + (X + w + tip).toFixed(1) + ' ' + (Y + h/2).toFixed(1) + 'L' + (X + w).toFixed(1) + ' ' + (Y + h).toFixed(1) + '" fill="none" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round"/>' +
    '<rect x="' + X + '" y="' + Y + '" width="' + w.toFixed(1) + '" height="' + h.toFixed(1) + '" fill="var(--accentbg)" stroke="' + (full ? 'var(--accent)' : 'var(--ink)') + '" stroke-width="2.5"/>' +
    (full ? svgText((X + w/2).toFixed(1), Y - 5, q.L, 13, 'var(--ink)', popAt(1)) + svgText((X + w - 10).toFixed(1), (Y + h/2 + 5).toFixed(1), q.t, 13, 'var(--warm)', popAt(2)) : '') + '</svg>';
}
function drawRectPool(q){
  const line = '<div class="line xl">' + SLOT + CM + '</div>';
  if(q.shape === 'row') return '<div class="ask">' + tr('Страната на всеки квадрат е <span class="num">' + q.s + '&nbsp;см</span>. Пресметни обиколката на цялата фигура.',
    'Сторона кожного квадрата — <span class="num">' + q.s + '&nbsp;см</span>. Обчисли периметр усієї фігури.') + '</div><div class="fig small">' + rectRowSvg(q, false) + '</div>' + line;
  if(q.shape === 'house') return '<div class="ask">' + tr('Страната на равностранния триъгълник е <span class="num">' + q.t + '&nbsp;см</span>, а дължината на правоъгълника е <span class="num">' + q.L + '&nbsp;см</span>. Колко сантиметра е обиколката на правоъгълника?',
    'Сторона рівностороннього трикутника — <span class="num">' + q.t + '&nbsp;см</span>, а довжина прямокутника — <span class="num">' + q.L + '&nbsp;см</span>. Скільки сантиметрів становить периметр прямокутника?') + '</div><div class="fig small">' + rectHouseSvg(q, false) + '</div>' + line;
  const T = RECT_POOL[q.thing], u = T[4], w = RECT_W[u], len = n => '<span class="num">' + n + '&nbsp;' + u + '</span>';
  return '<div class="ask">' + tr(T[0] + ' има правоъгълна форма. Едната страна е ' + len(q.a) + ', а другата е ' + bgWith(q.d) + ' ' + len(q.d) + (q.short ? ' по-къса' : ' по-дълга') + '. ' +
      (q.shape === 'perim' ? 'Колко ' + w[0] + ' е <b>обиколката</b> на ' + T[1] + '?' : 'Колко ' + w[0] + ' е <b>втората страна</b>?'),
    T[2] + ' має прямокутну форму. Одна сторона — ' + len(q.a) + ', а інша на ' + len(q.d) + (q.short ? ' коротша' : ' довша') + '. ' +
      (q.shape === 'perim' ? 'Скільки ' + w[1] + ' становить <b>периметр</b> ' + T[3] + '?' : 'Скільки ' + w[1] + ' друга сторона?')) + '</div>' +
    '<div class="line xl">' + SLOT + ' <span class="unit">' + u + '</span></div>';
}
function eqRectPool(q){
  if(q.shape === 'row') return q.m*q.s + ' + ' + q.s + ' + ' + q.m*q.s + ' + ' + q.s + ' = ' + q.ans + ' см';
  if(q.shape === 'house') return q.L + ' + ' + q.t + ' + ' + q.L + ' + ' + q.t + ' = ' + q.ans + ' см';
  const u = RECT_POOL[q.thing][4], side = q.a + (q.short ? ' − ' : ' + ') + q.d + ' = ' + q.b + ' ' + u;
  return q.shape === 'perim' ? side + ', ' + q.a + ' + ' + q.b + ' + ' + q.a + ' + ' + q.b + ' = ' + q.ans + ' ' + u : side;
}
function whyRectPool(q, full){
  if(q.shape === 'row'){
    if(!full) return tr('Обиколката е само по края на цялата фигура: вътрешните страни не се броят. Колко е дълга цялата фигура и колко е висока?',
      'Периметр — лише по краю всієї фігури: внутрішні сторони не рахуються. Яка довжина всієї фігури і яка висота?');
    return tr('дължината: ', 'довжина: ') + Array(q.m).fill(q.s).join(' + ') + ' = <b>' + q.m*q.s + '</b> см, ' + tr('височината: ', 'висота: ') + q.s + ' см' + rectRowSvg(q, true) +
      q.m*q.s + ' + ' + q.s + ' + ' + q.m*q.s + ' + ' + q.s + ' = <b>' + q.ans + '</b> см';
  }
  if(q.shape === 'house'){
    if(!full) return tr('Виж къде триъгълникът допира правоъгълника: колко е широк правоъгълникът?', 'Подивись, де трикутник торкається прямокутника: яка ширина прямокутника?');
    return tr('късата страна на правоъгълника е страната на триъгълника: ', 'коротка сторона прямокутника — це сторона трикутника: ') + q.t + ' см' + rectHouseSvg(q, true) +
      q.L + ' + ' + q.t + ' + ' + q.L + ' + ' + q.t + ' = <b>' + q.ans + '</b> см';
  }
  const u = RECT_POOL[q.thing][4], side = q.a + (q.short ? ' − ' : ' + ') + q.d + ' = <b>' + q.b + '</b> ' + u;
  if(!full) return q.short ? tr('«По-къса» — значи по-малко. Първо втората страна.', '«Коротша» — отже, менше. Спершу друга сторона.') + (q.shape === 'perim' ? tr(' После четирите страни заедно.', ' Потім чотири сторони разом.') : '')
    : tr('«По-дълга» — значи повече. Първо втората страна.', '«Довша» — отже, більше. Спершу друга сторона.') + (q.shape === 'perim' ? tr(' После четирите страни заедно.', ' Потім чотири сторони разом.') : '');
  if(q.shape === 'side') return tr('втората страна: ', 'друга сторона: ') + side;
  return tr('втората страна: ', 'друга сторона: ') + side + ' &nbsp;→&nbsp; ' + tr('обиколката: ', 'периметр: ') + q.a + ' + ' + q.b + ' + ' + q.a + ' + ' + q.b + ' = <b>' + q.ans + '</b> ' + u;
}
const sqMmSide = (q, and) => q.shape === 'mm' ? q.s + '&nbsp;мм' : Math.floor(q.s / 10) + '&nbsp;см ' + and + ' ' + q.s % 10 + '&nbsp;мм';
function drawRectDm(q){
  if(['side', 'perim', 'row', 'house'].includes(q.shape)) return drawRectPool(q);
  if(q.shape === 'mm' || q.shape === 'cmmm'){
    return '<div class="ask">' + tr('Страната на квадрат е <span class="num">' + sqMmSide(q, 'и') + '</span>. Колко <b>сантиметра</b> е обиколката на квадрата?',
      'Сторона квадрата — <span class="num">' + sqMmSide(q, 'і') + '</span>. Скільки <b>сантиметрів</b> становить периметр квадрата?') + '</div>' +
      '<div class="line xl">' + SLOT + CM + '</div>';
  }
  if(q.shape === 2){
    return '<div class="ask">' + tr('Една от страните на правоъгълник е <span class="num">' + q.a + '&nbsp;см</span>, а другата е с <span class="num">' + q.d + '&nbsp;см</span> по-дълга. Колко сантиметра е обиколката на правоъгълника?',
      'Одна зі сторін прямокутника — <span class="num">' + q.a + '&nbsp;см</span>, а інша на <span class="num">' + q.d + '&nbsp;см</span> довша. Скільки сантиметрів становить периметр прямокутника?') + '</div>' +
      '<div class="line xl">' + SLOT + CM + '</div>';
  }
  if(q.shape === 1){
    const w = RECT_W[q.to];
    return '<div class="ask">' + tr('Една от страните на правоъгълник е <span class="num">' + q.a + '&nbsp;' + q.base + '</span>, а другата е с <span class="num">' + q.d + '&nbsp;' + q.dU + '</span> по-дълга. Колко <b>' + w[0] + '</b> е обиколката на правоъгълника?',
      'Одна зі сторін прямокутника — <span class="num">' + q.a + '&nbsp;' + q.base + '</span>, а інша на <span class="num">' + q.d + '&nbsp;' + q.dU + '</span> довша. Скільки <b>' + w[1] + '</b> становить периметр прямокутника?') + '</div>' +
      '<div class="line xl">' + SLOT + ' <span class="unit">' + q.to + '</span></div>';
  }
  return '<div class="ask">' + tr('Колко <b>дециметра</b> е обиколката на правоъгълник със страни <span class="num">' + q.a + '&nbsp;см</span> и <span class="num">' + q.b + '&nbsp;см</span>?',
    'Скільки <b>дециметрів</b> становить периметр прямокутника зі сторонами <span class="num">' + q.a + '&nbsp;см</span> і <span class="num">' + q.b + '&nbsp;см</span>?') + '</div>' +
    '<div class="line xl">' + SLOT + ' <span class="unit">дм</span></div>';
}
const rectSides = q => q.a + ' + ' + q.b + ' + ' + q.a + ' + ' + q.b + ' = ' + q.ans;
// the rectangle, its four sides labelled, the longer ones across
function rectSameSvg(q){
  const u = Math.min(18, 160 / q.b), w = q.b*u, h = q.a*u, X = 30, Y = 22;
  return '<svg viewBox="0 0 ' + (w + 2*X) + ' ' + (h + 2*Y) + '" style="display:block; width:' + Math.round((w + 2*X)*1.3) + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + tr('правоъгълникът и страните му', 'прямокутник і його сторони') + '">' +
    '<rect x="' + X + '" y="' + Y + '" width="' + w.toFixed(1) + '" height="' + h.toFixed(1) + '" fill="var(--accentbg)" stroke="var(--accent)" stroke-width="2.5"/>' +
    svgText((X + w/2).toFixed(1), Y - 6, q.b, 13, 'var(--warm)', popAt(1)) + svgText(X - 12, (Y + h/2 + 5).toFixed(1), q.a, 13, 'var(--ink)', popAt(2)) +
    svgText((X + w/2).toFixed(1), (Y + h + 17).toFixed(1), q.b, 13, 'var(--warm)', popAt(3)) + svgText((X + w + 12).toFixed(1), (Y + h/2 + 5).toFixed(1), q.a, 13, 'var(--ink)', popAt(4)) + '</svg>';
}
function eqRectDm(q){
  if(['side', 'perim', 'row', 'house'].includes(q.shape)) return eqRectPool(q);
  if(q.shape === 'mm') return '4 · ' + q.s + ' = ' + 4*q.s + ' мм = ' + q.ans + ' см';
  if(q.shape === 'cmmm') return Math.floor(q.s / 10) + ' см ' + q.s % 10 + ' мм = ' + q.s + ' мм, 4 · ' + q.s + ' = ' + 4*q.s + ' мм = ' + q.ans + ' см';
  if(q.shape === 2) return q.a + ' + ' + q.d + ' = ' + q.b + ', ' + rectSides(q);
  if(q.shape === 1) return q.a + ' + ' + q.d + ' ' + q.dU + ' = ' + q.b + ' ' + q.base + ', 2 · (' + q.a + ' + ' + q.b + ') = ' + q.P + ' ' + q.base + ' = ' + q.ans + ' ' + q.to;
  return '2 · (' + q.a + ' + ' + q.b + ') = ' + q.P + ' см = ' + q.ans + ' дм';
}
function whyRectDm(q, full){
  if(['side', 'perim', 'row', 'house'].includes(q.shape)) return whyRectPool(q, full);
  if(q.shape === 'mm' || q.shape === 'cmmm'){
    if(!full) return tr('Обиколката на квадрата е четири пъти страната му. Първо всичко в милиметри — после колко сантиметра прави.',
      'Периметр квадрата — це чотири його сторони. Спершу все в міліметрах — потім скільки це сантиметрів.');
    return (q.shape === 'cmmm' ? Math.floor(q.s / 10) + ' см = ' + 10*Math.floor(q.s / 10) + ' мм, ' + 10*Math.floor(q.s / 10) + ' + ' + q.s % 10 + ' = <b>' + q.s + '</b> мм &nbsp;→&nbsp; ' : '') +
      '4 · ' + q.s + ' = <b>' + 4*q.s + '</b> мм &nbsp;→&nbsp; 10 мм = 1 см' + tr(', значи ', ', отже ') + 4*q.s + ' мм = ' + q.ans + ' см';
  }
  if(q.shape === 2){
    if(!full) return tr('Първо намери другата страна. Обиколката е сборът от четирите страни.', 'Спершу знайди іншу сторону. Периметр — це сума чотирьох сторін.');
    return tr('другата страна: ', 'інша сторона: ') + q.a + ' + ' + q.d + ' = <b>' + q.b + '</b> см' + rectSameSvg(q) + tr('обиколката: ', 'периметр: ') + rectSides(q) + ' см';
  }
  if(q.shape === 1){
    if(!full) return tr('Първо двете страни в едни и същи мерки — после обиколката, и накрая в каквото е попитано.', 'Спершу обидві сторони в однакових одиницях — потім периметр, і нарешті в тому, про що питають.');
    return (q.dU === q.base ? '' : q.d + ' ' + q.dU + ' = ' + q.d*RECT_U[q.dU]/RECT_U[q.base] + ' ' + q.base + ', ') + tr('другата страна ', 'інша сторона ') + q.a + ' + ' + (q.b - q.a) + ' = <b>' + q.b + ' ' + q.base + '</b> &nbsp;→&nbsp; ' +
      q.a + ' + ' + q.b + ' = ' + (q.a + q.b) + tr(', два пъти', ', двічі') + ' → <b>' + q.P + ' ' + q.base + '</b> &nbsp;→&nbsp; 1 ' + q.to + ' = ' + RECT_U[q.to]/RECT_U[q.base] + ' ' + q.base + tr(', значи ', ', отже ') + q.ans + ' ' + q.to;
  }
  if(!full) return tr('Първо обиколката в сантиметри — после колко дециметра прави.', 'Спершу периметр у сантиметрах — потім скільки це дециметрів.');
  return q.a + ' + ' + q.b + ' = ' + (q.a + q.b) + tr(', два пъти', ', двічі') + ' → <b>' + q.P + ' см</b> &nbsp;→&nbsp; 10 см = 1 дм' +
    tr(', значи ', ', отже ') + q.ans + ' дм';
}
KIND.rectdm = { draw:drawRectDm, eq:eqRectDm, why:whyRectDm };
