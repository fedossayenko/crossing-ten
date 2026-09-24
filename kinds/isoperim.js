// Question kind 'isoperim': level 97 Бедро и основа — An isosceles triangle built from a square's side.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Коледно състезание 2025, задача 9: a square with perimeter 36 см; the triangle's leg is 12 см
// longer than the square's side, its base 14 см shorter than the leg. Side 9, leg 21, base 7:
// perimeter 21 + 21 + 7 = 49. Three steps, and the leg counts twice.
function genIsoPerim(){
  for(;;){
    const s = 3 + rnd(10), up = 3 + rnd(12), leg = s + up, down = 2 + rnd(leg - 3), base = leg - down;
    if(base < 2 || 2*leg + base > 99) continue;
    return {kind:'isoperim', s, P: 4*s, up, leg, down, base, ans: 2*leg + base};
  }
}
function drawIsoPerim(q){
  if(q.kind === 'isoperim'){
    return '<div class="ask">' + tr('Обиколката на квадрат е <span class="num">' + q.P + '</span> см. Бедрото на равнобедрен триъгълник е с <span class="num">' + q.up +
      '</span> см по-дълго от страната на квадрата, а основата на триъгълника е с <span class="num">' + q.down + '</span> см по-къса от бедрото му. Колко сантиметра е <b>обиколката на триъгълника</b>?',
      'Периметр квадрата — <span class="num">' + q.P + '</span> см. Бічна сторона рівнобедреного трикутника на <span class="num">' + q.up +
      '</span> см довша за сторону квадрата, а основа трикутника на <span class="num">' + q.down + '</span> см коротша за бічну сторону. Скільки сантиметрів становить <b>периметр трикутника</b>?') + '</div>' +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT + CM + '</div>';
  }
}
function eqIsoPerim(q){
  if(q.kind === 'isoperim') return q.P + ' : 4 = ' + q.s + ', ' + q.s + ' + ' + q.up + ' = ' + q.leg + ', ' + q.leg + ' − ' + q.down + ' = ' + q.base + ' → ' + q.ans;
}
function whyIsoPerim(q, full){
  if(q.kind === 'isoperim'){
    if(!full) return tr('Първо страната на квадрата, после бедрото, после основата. Бедрата са две.', 'Спершу сторона квадрата, потім бічна сторона, потім основа. Бічних сторін дві.');
    return tr('страната на квадрата: ', 'сторона квадрата: ') + q.P + ' : 4 = <b>' + q.s + '</b> &nbsp;→&nbsp; ' + tr('бедрото: ', 'бічна сторона: ') + q.s + ' + ' + q.up + ' = <b>' + q.leg +
      '</b> &nbsp;→&nbsp; ' + tr('основата: ', 'основа: ') + q.leg + ' − ' + q.down + ' = <b>' + q.base + '</b> &nbsp;→&nbsp; ' + q.leg + ' + ' + q.leg + ' + ' + q.base + ' = ' + q.ans;
  }
}
KIND.isoperim = { draw:drawIsoPerim, eq:eqIsoPerim, why:whyIsoPerim };
