// Question kind 'isoperim': level 97 Бедро и основа — An isosceles triangle built from a square's side.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Коледно състезание 2025, задача 9: a square with perimeter 36 см; the triangle's leg is 12 см
// longer than the square's side, its base 14 см shorter than the leg. Side 9, leg 21, base 7:
// perimeter 21 + 21 + 7 = 49. Three steps, and the leg counts twice.
// Коледно 2024, задача 9: two triangles, legs 15 см each; one base 2 см shorter than the other; the
// perimeters add to 9 дм. Four legs are 60, so the two bases are 90 − 60 = 30: 14 and 16.
function genTwoIso(){
  for(;;){
    const leg = 5 + rnd(16), d = 1 + rnd(6), b = 2 + rnd(20), T = 4*leg + 2*b + d;
    if(T % 10 || b + d >= 2*leg || T > 150) continue;
    const short = Math.random() < 0.7;
    return {kind:'isoperim', shape:1, leg, d, b, T, short, traps:[(T - 4*leg) / 2], ans: short ? b : b + d};
  }
}
function genIsoPerim(){
  for(;;){
    const s = 3 + rnd(10), up = 3 + rnd(12), leg = s + up, down = 2 + rnd(leg - 3), base = leg - down;
    if(base < 2 || 2*leg + base > 99) continue;
    return {kind:'isoperim', s, P: 4*s, up, leg, down, base, ans: 2*leg + base};
  }
}
function drawIsoPerim(q){
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
  if(q.kind === 'isoperim' && q.shape === 1) return q.T + ' − 4 · ' + q.leg + ' = ' + (q.T - 4*q.leg) + ', ' + (q.T - 4*q.leg) + ' − ' + q.d + ' = ' + 2*q.b + ' → ' + q.ans;
  if(q.kind === 'isoperim') return q.P + ' : 4 = ' + q.s + ', ' + q.s + ' + ' + q.up + ' = ' + q.leg + ', ' + q.leg + ' − ' + q.down + ' = ' + q.base + ' → ' + q.ans;
}
function whyIsoPerim(q, full){
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
