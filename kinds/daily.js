// Question kind 'daily': level 96 Всеки ден повече — The same amount more each day, and a few of the days added.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Коледно състезание 2025, задача 8: Ivo rode 3 km, then on each of the next 4 days 9 km more
// than the day before: 3, 12, 21, 30, 39, so the last two days make 69. "The next 4 days"
// come after the first one — five days in all, which is the trap.
const DAILY_KIDS = [['Иво', 'Іво', 0], ['Мая', 'Мая', 1], ['Асен', 'Асен', 0], ['Ния', 'Нія', 1]];
function genDaily(){
  for(;;){
    const [bg, uk, she] = DAILY_KIDS[rnd(DAILY_KIDS.length)];
    const a = 1 + rnd(9), d = 2 + rnd(9), k = 3 + rnd(3), days = [a];
    for(let i = 0; i < k; i++) days.push(days[i] + d);
    const shape = rnd(3), last2 = days[k] + days[k - 1], all = days.reduce((x, y) => x + y, 0);
    const ans = shape === 0 ? last2 : shape === 1 ? days[k] : all;
    if(ans > 150) continue;
    return {kind:'daily', bg, uk, she, a, d, k, days, shape, ans};
  }
}
function drawDaily(q){
  if(q.kind === 'daily'){
    const ask = q.shape === 0 ? tr('Колко километра е изминал' + (q.she ? 'а' : '') + ' <b>през последните два дни</b>?', 'Скільки кілометрів ' + (q.she ? 'вона проїхала' : 'він проїхав') + ' <b>за останні два дні</b>?')
      : q.shape === 1 ? tr('Колко километра е изминал' + (q.she ? 'а' : '') + ' <b>в последния ден</b>?', 'Скільки кілометрів ' + (q.she ? 'вона проїхала' : 'він проїхав') + ' <b>останнього дня</b>?')
      : tr('Колко километра е изминал' + (q.she ? 'а' : '') + ' <b>общо през всички дни</b>?', 'Скільки кілометрів ' + (q.she ? 'вона проїхала' : 'він проїхав') + ' <b>за всі дні разом</b>?');
    return '<div class="ask">' + tr(q.bg + ' изминал' + (q.she ? 'а' : '') + ' с колелото си <span class="num">' + q.a + '</span> км. През следващите <span class="num">' + q.k +
      '</span> дена изминавал' + (q.she ? 'а' : '') + ' с <span class="num">' + q.d + '</span> км повече от предния ден. ',
      q.uk + ' ' + (q.she ? 'проїхала' : 'проїхав') + ' на велосипеді <span class="num">' + q.a + '</span> км. Кожного з наступних <span class="num">' + q.k +
      '</span> днів ' + (q.she ? 'вона проїжджала' : 'він проїжджав') + ' на <span class="num">' + q.d + '</span> км більше, ніж попереднього. ') + ask + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + ' <span class="unit">км</span></div>';
  }
}
function eqDaily(q){
  if(q.kind === 'daily') return q.days.join(', ') + ' → ' + q.ans;
}
function whyDaily(q, full){
  if(q.kind === 'daily'){
    if(!full) return tr('Запиши всеки ден поотделно. Колко дни са общо — първият и още колко?', 'Випиши кожен день окремо. Скільки всього днів — перший і ще скільки?');
    const k = q.k, tail = q.shape === 0 ? q.days[k - 1] + ' + ' + q.days[k] + ' = ' + q.ans : q.shape === 1 ? tr('последният е ', 'останній — ') + q.ans : q.days.join(' + ') + ' = ' + q.ans;
    return tr((k + 1) + ' дена: ', ukN(k + 1, 'день', 'дні', 'днів') + ': ') + q.days.join(', ') + ' &nbsp;→&nbsp; ' + tail;
  }
}
KIND.daily = { draw:drawDaily, eq:eqDaily, why:whyDaily };
