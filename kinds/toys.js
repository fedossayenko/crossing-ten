// Question kind 'toys': level 146 Играчките за елха — The four-part task: days of making toys, the weekday, boxes, money.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Коледно 2023, задача 10, solved in full, in four parts. Ели made 3 toys on Monday and each next day one more,
// until 63 in all: 3 + 4 + … + 11 = 63, so А) 9 days, Б) the 9th day from a Monday is a Tuesday, В) 63 : 9 = 7
// boxes, Г) 7 − 1 − 3 = 3 boxes sold, one for 11 лв. and the rest for 14 лв. each: 11 + 14 + 14 = 39.
// The weekday cannot be typed, so part Б brings its own А/Б/В/Г, with the days on either side as the traps.
const TOY_ON = ['в понеделник', 'във вторник', 'в сряда', 'в четвъртък', 'в петък', 'в събота', 'в неделя'];
const TOY_ON_UK = ['у понеділок', 'у вівторок', 'у середу', 'у четвер', 'у п’ятницю', 'у суботу', 'у неділю'];
function genToys(){
  const shape = rnd(4);
  for(;;){
    const a = 1 + rnd(5), n = 4 + rnd(7), day0 = Math.random() < 0.6 ? 0 : rnd(7), days = [];
    for(let i = 0; i < n; i++) days.push(a + i);
    const T = days.reduce((x, y) => x + y, 0);
    if(T > 99) continue;
    const ms = [3, 4, 5, 6, 7, 8, 9].filter(m => T % m === 0 && T / m >= 6 && T / m <= 12), m = ms[rnd(ms.length)];
    if(!m) continue;
    const boxes = T / m, f = 2 + rnd(Math.min(3, boxes - 4)), sold = boxes - 1 - f, p1 = 5 + rnd(12), p2 = 5 + rnd(12);
    if(sold < 2 || p1 === p2) continue;
    const last = (day0 + n - 1) % 7;
    const q = {kind:'toys', shape, a, n, day0, T, m, boxes, f, sold, p1, p2, last};
    if(shape === 0) return Object.assign(q, {traps:[n - 1, T], ans: n});
    if(shape === 2) return Object.assign(q, {traps:[n], ans: boxes});
    if(shape === 3) return Object.assign(q, {traps:[p1 + sold*p2, sold*p2], ans: p1 + (sold - 1)*p2});
    const wrong = shuffle([(last + 1) % 7, (last + 6) % 7, (day0 + n) % 7, (last + 3) % 7].filter((d, i, all) => d !== last && all.indexOf(d) === i)).slice(0, 3);
    const ids = shuffle(wrong.concat(last));
    const options = ids.map((d, id) => ({ id, v: id, text: [DAYS[d].nm, weekdayUk[DAYS[d].nm].nm] }));
    return Object.assign(q, {options, pick: ids.indexOf(last), own: true, ans: ids.indexOf(last)});
  }
}
const toyLv = n => tr(n + (n === 1 ? ' лев' : ' лева'), ukN(n, 'лев', 'леви', 'левів'));
function drawToys(q){
  if(q.kind === 'toys'){
    const story = tr('Ели направила ' + TOY_ON[q.day0] + ' <span class="num">' + q.a + '</span> ' + (q.a === 1 ? 'играчка' : 'играчки') + ' за елха. Всеки ден след това правила с по 1 играчка повече от предишния ден, докато направила общо <span class="num">' + q.T + '</span> играчки. ',
      'Елі зробила ' + TOY_ON_UK[q.day0] + ' <span class="num">' + ukN(q.a, 'іграшку', 'іграшки', 'іграшок').replace(' ', '</span> ') + ' на ялинку. Кожного наступного дня вона робила на 1 іграшку більше, ніж попереднього, доки не зробила всього <span class="num">' + ukN(q.T, 'іграшку', 'іграшки', 'іграшок').replace(' ', '</span> ') + '. ');
    const box = tr('Опаковала играчките по <span class="num">' + q.m + '</span> в кутия. ', 'Вона спакувала іграшки по <span class="num">' + q.m + '</span> у коробку. ');
    const ask = [tr('Колко дена е работила Ели?', 'Скільки днів працювала Елі?'),
      tr('В кой ден от седмицата е спряла да работи?', 'У який день тижня вона закінчила роботу?'),
      box + tr('Колко кутии е използвала?', 'Скільки коробок знадобилося?'),
      box + tr('Оставила една кутия за себе си, подарила по една на ' + q.f + ' свои приятелки и останалите продала на коледния базар. За едната кутия получила ' + toyLv(q.p1) + ', а за останалите — по ' + toyLv(q.p2) + '. Колко лева общо е получила?',
        'Одну коробку залишила собі, по одній подарувала ' + q.f + ' подругам, а решту продала на різдвяному ярмарку. За одну коробку отримала ' + toyLv(q.p1) + ', а за решту — по ' + toyLv(q.p2) + '. Скільки всього левів вона отримала?')][q.shape];
    return '<div class="ask">' + story + ask + '</div>' + (q.shape === 1 ? '' : '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>');
  }
}
const toyRun = q => { const d = []; for(let i = 0; i < q.n; i++) d.push(q.a + i); return d; };
function eqToys(q){
  if(q.kind === 'toys'){
    const run = toyRun(q).join(' + ') + ' = ' + q.T;
    return [run + ' → ' + q.n, run + ' → ' + tr(DAYS[q.last].nm, weekdayUk[DAYS[q.last].nm].nm), q.T + ' : ' + q.m + ' = ' + q.boxes,
      q.boxes + ' − 1 − ' + q.f + ' = ' + q.sold + ', ' + q.p1 + ' + ' + (q.sold - 1) + ' · ' + q.p2 + ' = ' + q.ans][q.shape];
  }
}
function whyToys(q, full){
  if(q.kind === 'toys'){
    if(!full) return [tr('Запиши колко играчки е направила всеки ден, докато сборът стане ' + q.T + '.', 'Випиши, скільки іграшок вона робила щодня, доки сума не стане ' + q.T + '.'),
      tr('Първо колко дена е работила. Първият ден е ' + DAYS[q.day0].nm + ' — кой е последният?', 'Спершу — скільки днів вона працювала. Перший день — ' + weekdayUk[DAYS[q.day0].nm].nm + '. Який останній?'),
      tr('По колко играчки в кутия — колко пъти се събират в ' + q.T + '?', 'По скільки іграшок у коробці — скільки разів це вміщується в ' + q.T + '?'),
      tr('Първо колко кутии е продала. Колко от тях са по ' + q.p2 + ' лева?', 'Спершу — скільки коробок вона продала. Скільки з них по ' + q.p2 + '?')][q.shape];
    const run = toyRun(q).join(' + ') + ' = ' + q.T;
    if(q.shape === 0) return run + ' &nbsp;→&nbsp; ' + tr(q.n + ' дена', ukN(q.n, 'день', 'дні', 'днів'));
    if(q.shape === 1) return run + ' &nbsp;→&nbsp; ' + tr(q.n + ' дена: ', ukN(q.n, 'день', 'дні', 'днів') + ': ') +
      toyRun(q).map((_, i) => tr(DAYS[(q.day0 + i) % 7].nm, weekdayUk[DAYS[(q.day0 + i) % 7].nm].nm)).join(', ') + ' &nbsp;→&nbsp; <b>' + tr(DAYS[q.last].nm, weekdayUk[DAYS[q.last].nm].nm) + '</b>';
    if(q.shape === 2) return q.T + ' : ' + q.m + ' = ' + q.boxes;
    return tr('кутии: ', 'коробок: ') + q.T + ' : ' + q.m + ' = ' + q.boxes + ', ' + tr('продадени: ', 'продано: ') + q.boxes + ' − 1 − ' + q.f + ' = <b>' + q.sold + '</b> &nbsp;→&nbsp; ' +
      q.p1 + ' + ' + Array(q.sold - 1).fill(q.p2).join(' + ') + ' = ' + q.ans;
  }
}
KIND.toys = { draw:drawToys, eq:eqToys, why:whyToys };
