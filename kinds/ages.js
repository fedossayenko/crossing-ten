// Question kind 'ages': level 125 Годините на семейството — Ages linked one to the next, read from the one given.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Коледно 2024, задача 8: Ани is 4 years older than her brother and 20 years younger than her
// mother; her father is 31 and 3 years older than the mother. Only the father's age is given, so
// the chain is read from him: mother 28, Ани 8, brother 4.
function genAges(){
  for(;;){
    const F = 26 + rnd(20), m = 2 + rnd(6), older = Math.random() < 0.75, M = older ? F - m : F + m;
    const g = 18 + rnd(13), A = M - g, b = 2 + rnd(5), B = A - b, asksAni = Math.random() < 0.25;
    if(B < 1 || A > 16) continue;
    return {kind:'ages', F, m, older, M, g, A, b, B, asksAni, ans: asksAni ? A : B};
  }
}
const agesUk = n => ukN(n, 'рік', 'роки', 'років');
function drawAges(q){
  if(q.kind === 'ages'){
    return '<div class="ask">' + tr('Ани е ' + bgWith(q.b) + ' <span class="num">' + q.b + '</span> години по-голяма от брат си и ' + bgWith(q.g) + ' <span class="num">' + q.g + '</span> години по-малка от майка си. Бащата на Ани е на <span class="num">' + q.F +
      '</span> години и е ' + bgWith(q.m) + ' <span class="num">' + q.m + '</span> години ' + (q.older ? 'по-стар' : 'по-млад') + ' от майка ѝ. ' + (q.asksAni ? 'На колко години е <b>Ани</b>?' : 'На колко години е <b>брат ѝ</b>?'),
      'Аня на <span class="num">' + agesUk(q.b).replace(' ', '</span> ') + ' старша за брата і на <span class="num">' + agesUk(q.g).replace(' ', '</span> ') + ' молодша за маму. Татові Ані <span class="num">' + agesUk(q.F).replace(' ', '</span> ') +
      ', і він на <span class="num">' + agesUk(q.m).replace(' ', '</span> ') + ' ' + (q.older ? 'старший' : 'молодший') + ' за її маму. ' + (q.asksAni ? 'Скільки років <b>Ані</b>?' : 'Скільки років <b>її братові</b>?')) + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqAges(q){
  if(q.kind === 'ages') return q.F + (q.older ? ' − ' : ' + ') + q.m + ' = ' + q.M + ', ' + q.M + ' − ' + q.g + ' = ' + q.A + (q.asksAni ? '' : ', ' + q.A + ' − ' + q.b + ' = ' + q.B);
}
function whyAges(q, full){
  if(q.kind === 'ages'){
    if(!full) return tr('Започни от единствения, чиито години са дадени — бащата. После майката, после Ани.', 'Почни з єдиного, чий вік відомий, — тата. Потім мама, потім Аня.');
    return tr('майката: ', 'мама: ') + q.F + (q.older ? ' − ' : ' + ') + q.m + ' = <b>' + q.M + '</b> &nbsp;→&nbsp; ' + tr('Ани: ', 'Аня: ') + q.M + ' − ' + q.g + ' = <b>' + q.A + '</b>' +
      (q.asksAni ? '' : ' &nbsp;→&nbsp; ' + tr('брат ѝ: ', 'її брат: ') + q.A + ' − ' + q.b + ' = ' + q.B);
  }
}
KIND.ages = { draw:drawAges, eq:eqAges, why:whyAges };
