// Question kind 'isoperim': level 97 Бедро и основа — An isosceles triangle built from a square's side.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Коледно състезание 2025, задача 9: a square with perimeter 36 см; the triangle's leg is 12 см
// longer than the square's side, its base 14 см shorter than the leg. Side 9, leg 21, base 7:
// perimeter 21 + 21 + 7 = 49. Three steps, and the leg counts twice.
// Коледно 2024, задача 9: two triangles, legs 15 см each; one base 2 см shorter than the other; the
// perimeters add to 9 дм. Four legs are 60, so the two bases are 90 − 60 = 30: 14 and 16.
// Коледно 2023, задача 4: an ant walks ABCA twice (equilateral, side 4 м), a tortoise walks MEKME round an
// isosceles MEK (base ME 3 м, legs 5 м) — four sides, not five. 24 against 16: 8 м more.
const ISO_ROUTES = ['MEKM', 'MEKME', 'MKEM', 'MKEMK', 'EKMEK', 'KMEKM'];
function isoRouteLen(q){ let t = 0; for(let i = 1; i < q.route.length; i++) t += 'ME EM'.includes(q.route[i-1] + q.route[i]) ? q.base : q.leg; return t; }
function genIsoRoute(){
  for(;;){
    const a = 2 + rnd(8), laps = 1 + rnd(3), base = 2 + rnd(6), leg = base + 1 + rnd(5), route = ISO_ROUTES[rnd(ISO_ROUTES.length)];
    const q = {kind:'isoperim', shape:2, a, laps, base, leg, route};
    q.ant = 3*a*laps; q.tort = isoRouteLen(q);
    if(q.ant === q.tort || Math.abs(q.ant - q.tort) > 30) continue;
    q.traps = [Math.abs(3*a - q.tort), Math.abs(q.ant - q.tort - (q.route[1] === 'E' || q.route[1] === 'M' ? q.base : q.leg))].filter(v => v > 0 && v !== Math.abs(q.ant - q.tort));
    q.ans = Math.abs(q.ant - q.tort);
    return q;
  }
}
// Коледно 2023, задача 8: 12, 8, 18, 4, 5, 20 are the perimeters of an equilateral triangle, a square and an
// isosceles triangle with base 1. Its perimeter is 1 + two legs, so odd: only 5 can be it, and the leg is 2.
function genIsoOdd(){
  for(;;){
    const t = 2*(1 + rnd(4)), sq = 1 + rnd(6), b = Math.random() < 0.75 ? 1 : 3, leg = b + rnd(8), list = [3*t, 4*sq, b + 2*leg];
    while(list.length < 6){ const v = 2*(2 + rnd(12)); if(!list.includes(v)) list.push(v); }
    if(new Set(list).size < 6 || leg <= b / 2) continue;
    return {kind:'isoperim', shape:3, t, sq, b, leg, list: shuffle(list), P: b + 2*leg, traps:[b + 2*leg - b, b + 2*leg], ans: leg};
  }
}
function isoRouteSvg(q){
  const u = 16, hA = q.a*u*0.87, base = q.a*u, mx = base + 30, mb = q.base*u, kh = Math.sqrt(Math.max(1, q.leg*q.leg - q.base*q.base/4))*u;
  const H = Math.max(hA, kh) + 30, y0 = H - 6;
  const lab = (x, y, t) => '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" text-anchor="middle" font-size="12" font-weight="700" fill="var(--muted)" font-family="Nunito, sans-serif">' + t + '</text>';
  const pt = (x, y, t, dx) => lab(x + (dx || 0), y, t);
  return '<div class="fig"><svg viewBox="-14 0 ' + (mx + mb + 28).toFixed(1) + ' ' + (H + 14).toFixed(1) + '" role="img" aria-label="' + tr('два триъгълника', 'два трикутники') + '">' +
    '<g stroke="var(--ink)" stroke-width="2" fill="none" stroke-linejoin="round"><path d="M0 ' + y0 + 'L' + base + ' ' + y0 + 'L' + base/2 + ' ' + (y0 - hA).toFixed(1) + 'Z"/>' +
    '<path d="M' + mx + ' ' + y0 + 'L' + (mx + mb) + ' ' + y0 + 'L' + (mx + mb/2) + ' ' + (y0 - kh).toFixed(1) + 'Z"/></g>' +
    pt(0, y0 + 13, 'A', -6) + pt(base, y0 + 13, 'B', 6) + pt(base/2, y0 - hA - 5, 'C') + lab(base/2, y0 - 4, q.a + ' м') +
    pt(mx, y0 + 13, 'M', -6) + pt(mx + mb, y0 + 13, 'E', 6) + pt(mx + mb/2, y0 - kh - 5, 'K') + lab(mx + mb/2, y0 + 13, q.base + ' м') +
    lab(mx + mb*0.75 + 16, y0 - kh/2, q.leg + ' м') + '</svg></div>';
}
function genTwoIso(){
  if(Math.random() < 0.3) return genIsoOdd();
  for(;;){
    const leg = 5 + rnd(16), d = 1 + rnd(6), b = 2 + rnd(20), T = 4*leg + 2*b + d;
    if(T % 10 || b + d >= 2*leg || T > 150) continue;
    const short = Math.random() < 0.7;
    return {kind:'isoperim', shape:1, leg, d, b, T, short, traps:[(T - 4*leg) / 2], ans: short ? b : b + d};
  }
}
function genIsoPerim(){
  if(Math.random() < 0.3) return genIsoRoute();
  for(;;){
    const s = 3 + rnd(10), up = 3 + rnd(12), leg = s + up, down = 2 + rnd(leg - 3), base = leg - down;
    if(base < 2 || 2*leg + base > 99) continue;
    return {kind:'isoperim', s, P: 4*s, up, leg, down, base, ans: 2*leg + base};
  }
}
function drawIsoPerim(q){
  if(q.kind === 'isoperim' && q.shape === 2){
    const times = ['', 'веднъж', 'два пъти', 'три пъти'][q.laps], timesUk = ['', 'один раз', 'двічі', 'тричі'][q.laps];
    return '<div class="ask">' + tr('Мравка изминала ' + times + ' пътечката <b>ABCA</b> (триъгълник ABC е равностранен). Костенурка се разходила по равнобедрения триъгълник MEK по следния начин: <b>' + q.route.split('').join('') + '</b>. Колко метра повече е изминало едното животно от другото?',
      'Мурашка пройшла ' + timesUk + ' доріжкою <b>ABCA</b> (трикутник ABC рівносторонній). Черепаха пройшлася рівнобедреним трикутником MEK так: <b>' + q.route + '</b>. На скільки метрів більше пройшла одна тварина, ніж інша?') + '</div>' +
      isoRouteSvg(q) + '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT + ' <span class="unit">м</span></div>';
  }
  if(q.kind === 'isoperim' && q.shape === 3){
    return '<div class="ask">' + tr('Числата в редицата <span class="num">' + q.list.join(', ') + '</span> са обиколки в сантиметри на фигурите равностранен триъгълник, квадрат и равнобедрен триъгълник с основа <span class="num">' + q.b + '</span>. Колко сантиметра е бедрото на равнобедрения триъгълник?',
      'Числа в ряду <span class="num">' + q.list.join(', ') + '</span> — це периметри в сантиметрах фігур: рівносторонній трикутник, квадрат і рівнобедрений трикутник з основою <span class="num">' + q.b + '</span>. Скільки сантиметрів бічна сторона рівнобедреного трикутника?') + '</div>' +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT + CM + '</div>';
  }
  if(q.kind === 'isoperim' && q.shape === 1){
    return '<div class="ask">' + tr('Бедрата на два равнобедрени триъгълника са по <span class="num">' + q.leg + '</span> см. Основата на единия е с <span class="num">' + q.d +
      '</span> см по-къса от основата на другия. Сборът от обиколките им е <span class="num">' + q.T / 10 + '</span> дм. Колко сантиметра е <b>' + (q.short ? 'по-късата' : 'по-дългата') + ' основа</b>?',
      'Бічні сторони двох рівнобедрених трикутників — по <span class="num">' + q.leg + '</span> см. Основа одного на <span class="num">' + q.d +
      '</span> см коротша за основу другого. Сума їхніх периметрів — <span class="num">' + q.T / 10 + '</span> дм. Скільки сантиметрів становить <b>' + (q.short ? 'коротша' : 'довша') + ' основа</b>?') + '</div>' +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT + CM + '</div>';
  }
  if(q.kind === 'isoperim'){
    return '<div class="ask">' + tr('Обиколката на квадрат е <span class="num">' + q.P + '</span> см. Бедрото на равнобедрен триъгълник е с <span class="num">' + q.up +
      '</span> см по-дълго от страната на квадрата, а основата на триъгълника е с <span class="num">' + q.down + '</span> см по-къса от бедрото му. Колко сантиметра е <b>обиколката на триъгълника</b>?',
      'Периметр квадрата — <span class="num">' + q.P + '</span> см. Бічна сторона рівнобедреного трикутника на <span class="num">' + q.up +
      '</span> см довша за сторону квадрата, а основа трикутника на <span class="num">' + q.down + '</span> см коротша за бічну сторону. Скільки сантиметрів становить <b>периметр трикутника</b>?') + '</div>' +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT + CM + '</div>';
  }
}
function eqIsoPerim(q){
  if(q.kind === 'isoperim' && q.shape === 2) return q.laps + ' · ' + 3*q.a + ' = ' + q.ant + ', ' + q.route + ' = ' + q.tort + ' → ' + q.ans;
  if(q.kind === 'isoperim' && q.shape === 3) return q.b + ' + 2 · ' + tr('бедро', 'бічна') + ' = ' + q.P + ' → ' + q.ans;
  if(q.kind === 'isoperim' && q.shape === 1) return q.T + ' − 4 · ' + q.leg + ' = ' + (q.T - 4*q.leg) + ', ' + (q.T - 4*q.leg) + ' − ' + q.d + ' = ' + 2*q.b + ' → ' + q.ans;
  if(q.kind === 'isoperim') return q.P + ' : 4 = ' + q.s + ', ' + q.s + ' + ' + q.up + ' = ' + q.leg + ', ' + q.leg + ' − ' + q.down + ' = ' + q.base + ' → ' + q.ans;
}
function whyIsoPerim(q, full){
  if(q.kind === 'isoperim' && q.shape === 2){
    if(!full) return tr('Колко отсечки има всеки път и колко е дълга всяка? Внимавай кои страни на MEK са равни.', 'Скільки відрізків у кожному шляху і яка довжина кожного? Зверни увагу, які сторони MEK рівні.');
    const segs = []; for(let i = 1; i < q.route.length; i++) segs.push('ME EM'.includes(q.route[i-1] + q.route[i]) ? q.base : q.leg);
    return tr('мравката: ', 'мурашка: ') + (q.laps > 1 ? q.laps + ' · ' : '') + '(' + q.a + ' + ' + q.a + ' + ' + q.a + ') = <b>' + q.ant + '</b>, ' + tr('костенурката: ', 'черепаха: ') + segs.join(' + ') + ' = <b>' + q.tort + '</b> &nbsp;→&nbsp; ' +
      Math.max(q.ant, q.tort) + ' − ' + Math.min(q.ant, q.tort) + ' = ' + q.ans;
  }
  if(q.kind === 'isoperim' && q.shape === 3){
    if(!full) return tr('Обиколката на равнобедрения е основата и две равни бедра. Четно или нечетно число излиза?', 'Периметр рівнобедреного — основа й дві рівні бічні сторони. Парне чи непарне число виходить?');
    return tr('две равни бедра дават четно число, с основа ' + q.b + ' обиколката е нечетна', 'дві рівні бічні сторони дають парне число, з основою ' + q.b + ' периметр непарний') + ' &nbsp;→&nbsp; <b>' + q.P + '</b> &nbsp;→&nbsp; (' + q.P + ' − ' + q.b + ') : 2 = ' + q.ans;
  }
  if(q.kind === 'isoperim' && q.shape === 1){
    if(!full) return tr('Дециметрите в сантиметри. Колко бедра има общо — и колко остава за двете основи?', 'Дециметри — у сантиметри. Скільки всього бічних сторін — і скільки залишається на дві основи?');
    const B = q.T - 4*q.leg;
    return q.T / 10 + tr(' дм = ', ' дм = ') + q.T + tr(' см; четири бедра: ', ' см; чотири бічні сторони: ') + 4*q.leg + ' &nbsp;→&nbsp; ' + tr('двете основи: ', 'дві основи: ') + q.T + ' − ' + 4*q.leg + ' = <b>' + B +
      '</b> &nbsp;→&nbsp; ' + B + ' − ' + q.d + ' = ' + 2*q.b + ', ' + 2*q.b + ' : 2 = <b>' + q.b + '</b>' + (q.short ? '' : ', ' + q.b + ' + ' + q.d + ' = ' + q.ans);
  }
  if(q.kind === 'isoperim'){
    if(!full) return tr('Първо страната на квадрата, после бедрото, после основата. Бедрата са две.', 'Спершу сторона квадрата, потім бічна сторона, потім основа. Бічних сторін дві.');
    return tr('страната на квадрата: ', 'сторона квадрата: ') + q.P + ' : 4 = <b>' + q.s + '</b> &nbsp;→&nbsp; ' + tr('бедрото: ', 'бічна сторона: ') + q.s + ' + ' + q.up + ' = <b>' + q.leg +
      '</b> &nbsp;→&nbsp; ' + tr('основата: ', 'основа: ') + q.leg + ' − ' + q.down + ' = <b>' + q.base + '</b> &nbsp;→&nbsp; ' + q.leg + ' + ' + q.leg + ' + ' + q.base + ' = ' + q.ans;
  }
}
KIND.isoperim = { draw:drawIsoPerim, eq:eqIsoPerim, why:whyIsoPerim };
