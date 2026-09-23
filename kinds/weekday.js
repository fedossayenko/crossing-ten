// Question kind 'weekday': level 25 Колко вторника? — A weekday across a run of days — two answers.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

const DAYS = [                                   // f marks the feminine days: "по една", not "по един"
  { nm:'понеделник', cnt:'понеделника' }, { nm:'вторник', cnt:'вторника' },
  { nm:'сряда', cnt:'сряди', f:1 }, { nm:'четвъртък', cnt:'четвъртъка' },
  { nm:'петък', cnt:'петъка' }, { nm:'събота', cnt:'съботи', f:1 }, { nm:'неделя', cnt:'недели', f:1 }
];

// Задача 19: whole weeks give one each, the leftover days may or may not add another.
// Задача 19: the first of the month falls on a known weekday. The same weekday comes
// round every seven days, so the last one is as far along as another seven still fits.
const MONTHS = [['януари',31], ['март',31], ['април',30], ['май',31], ['юни',30], ['юли',31],
                ['август',31], ['септември',30], ['октомври',31], ['ноември',30], ['декември',31]];
function genLastDay(){
  const mon = MONTHS[rnd(MONTHS.length)];
  const first1 = rnd(7), want = rnd(7);
  const first = 1 + (want - first1 + 7) % 7;
  return {kind:'weekday', shape:'last', mon, d1: DAYS[first1], day: DAYS[want], first,
          ans: first + 7 * Math.floor((mon[1] - first) / 7)};
}
// Задача 17: the first of the month is a known weekday, so every later date is that many
// days on — and only what is left over after whole weeks matters.
function genWhichDay(){
  const mon = MONTHS[rnd(MONTHS.length)];
  const first1 = rnd(7), n = 8 + rnd(13);       // a date far enough in to be worth counting
  return {kind:'weekday', shape:'which', mon, d1: DAYS[first1], n,
          ans: (first1 + n - 1) % 7 + 1};
}
// Задача 17: the same run of days, but asked for only one of the two answers — which
// turns a pair of possibilities into a single number.
function genBound(){
  let n;
  do { n = 9 + rnd(37); } while(n % 7 === 0);   // a whole number of weeks has only one answer anyway
  const most = Math.random() < 0.6;
  return {kind:'weekday', shape:'bound', n, most, day: DAYS[rnd(7)],
          ans: most ? Math.ceil(n/7) : Math.floor(n/7)};
}
function genWeekday(){
  if(Math.random() < 0.25) return genBound();
  if(Math.random() < 0.3) return genWhichDay();
  if(Math.random() < 0.5) return genLastDay();
  let n;
  do { n = 8 + rnd(38); } while(n % 7 === 0);    // a multiple of 7 has a single answer
  const q = Math.floor(n / 7);
  return {kind:'weekday', n, q, r: n % 7, day: DAYS[rnd(7)], slots:2, ans: q, alt:[q + 1]};
}

// Ukrainian forms keyed by the Bulgarian name: count forms (2–4 / 5+), "по одному …", gender.
const weekdayUk = {
  понеделник:{nm:'понеділок', few:'понеділки', many:'понеділків', po:'по одному понеділку'},
  вторник:{nm:'вівторок', few:'вівторки', many:'вівторків', po:'по одному вівторку'},
  сряда:{nm:'середа', few:'середи', many:'серед', po:'по одній середі', f:1},
  четвъртък:{nm:'четвер', few:'четверги', many:'четвергів', po:'по одному четвергу'},
  петък:{nm:'п’ятниця', few:'п’ятниці', many:'п’ятниць', po:'по одній п’ятниці', f:1},
  събота:{nm:'субота', few:'суботи', many:'субот', po:'по одній суботі', f:1},
  неделя:{nm:'неділя', few:'неділі', many:'неділь', po:'по одній неділі', f:1}
};
// month: [nominative, genitive, locative]
const weekdayMonUk = {
  януари:['січень','січня','січні'], март:['березень','березня','березні'], април:['квітень','квітня','квітні'],
  май:['травень','травня','травні'], юни:['червень','червня','червні'], юли:['липень','липня','липні'],
  август:['серпень','серпня','серпні'], септември:['вересень','вересня','вересні'],
  октомври:['жовтень','жовтня','жовтні'], ноември:['листопад','листопада','листопаді'],
  декември:['грудень','грудня','грудні']
};
const weekdayPl = (n, one, few, many) => ({one, few}[new Intl.PluralRules('uk').select(n)] || many);
const weekdayDays = n => n + ' ' + weekdayPl(n, 'день', 'дні', 'днів');

function drawWeekday(q){
  if(q.kind === 'weekday' && q.shape === 'bound'){
    return '<div class="ask">' + tr('Колко <b>най-' + (q.most ? 'много' : 'малко') + '</b> ' + q.day.cnt +
      ' може да има сред <span class="num">' + q.n + '</span> последователни дни от календара?',
      'Скільки <b>' + (q.most ? 'найбільше' : 'найменше') + '</b> ' + weekdayUk[q.day.nm].many +
      ' може бути за <span class="num">' + q.n + '</span> ' + weekdayPl(q.n, 'день', 'дні', 'днів') + ' календаря поспіль?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'weekday' && q.shape === 'which'){
    return '<div class="ask">' + tr('Първият ден на месец <b>' + q.mon[0] + '</b> е <b>' + q.d1.nm +
      '</b>. Кой ден от седмицата ще бъде <b>' + q.n + '-ият</b> ден на същия месец?',
      'Перший день <b>' + weekdayMonUk[q.mon[0]][1] + '</b> — <b>' + weekdayUk[q.d1.nm].nm +
      '</b>. Яким днем тижня буде <b>' + q.n + '-й</b> день цього місяця?') + '</div>' +
      '<div class="note">' + DAYS.map((d, i) => (i + 1) + ' ' + tr(d.nm, weekdayUk[d.nm].nm)).join(' · ') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'weekday' && q.shape === 'last'){
    const u = weekdayUk[q.day.nm], m = weekdayMonUk[q.mon[0]];
    return '<div class="ask">' + tr('Първият ден на месец <b>' + q.mon[0] + '</b> е <b>' + q.d1.nm +
      '</b>. На коя дата ще е <b>' + (q.day.f ? 'последната ' : 'последният ') + q.day.nm +
      '</b> през ' + q.mon[0] + '?',
      'Перший день <b>' + m[1] + '</b> — <b>' + weekdayUk[q.d1.nm].nm +
      '</b>. Якого числа буде <b>' + (u.f ? 'остання ' : 'останній ') + u.nm + '</b> ' + m[1] + '?') + '</div>' +
      '<div class="note">' + tr('Месец ' + q.mon[0] + ' има ' + q.mon[1] + ' дни.',
      'У ' + m[2] + ' ' + weekdayDays(q.mon[1]) + '.') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'weekday'){
    return '<div class="ask">' + tr('Колко <b>' + q.day.cnt + '</b> може да има сред <span class="num">' + q.n +
      '</span> последователни дни?',
      'Скільки <b>' + weekdayUk[q.day.nm].many + '</b> може бути за <span class="num">' + q.n +
      '</span> ' + weekdayPl(q.n, 'день', 'дні', 'днів') + ' поспіль?') + '</div>' +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + SLOT +
      ' <span class="or">' + tr('или', 'або') + '</span> <span class="slot" id="slot1"></span></div>';
  }
}
function eqWeekday(q){
  if(q.kind === 'weekday' && q.shape === 'bound') return tr(q.n + ' дни → най-' + (q.most ? 'много ' : 'малко ') + q.ans,
    weekdayDays(q.n) + ' → ' + (q.most ? 'найбільше ' : 'найменше ') + q.ans);
  if(q.kind === 'weekday' && q.shape === 'which') return tr(q.mon[0] + ', 1-ви е ' + q.d1.nm + ', ден ' +
    q.n + ' → ' + DAYS[q.ans - 1].nm + ' (' + q.ans + ')',
    '1 ' + weekdayMonUk[q.mon[0]][1] + ' — ' + weekdayUk[q.d1.nm].nm + ', ' + q.n + '-й день → ' +
    weekdayUk[DAYS[q.ans - 1].nm].nm + ' (' + q.ans + ')');
  if(q.kind === 'weekday' && q.shape === 'last') return tr(q.mon[0] + ', 1-ви е ' + q.d1.nm + ' → ' +
    q.day.nm + ' от ' + q.first + ' нататък → ' + q.ans,
    '1 ' + weekdayMonUk[q.mon[0]][1] + ' — ' + weekdayUk[q.d1.nm].nm + ' → ' +
    weekdayUk[q.day.nm].nm + ' з ' + q.first + '-го і далі → ' + q.ans);
  if(q.kind === 'weekday') return tr(q.n + ' дни → ' + q.q + ' или ' + (q.q + 1) + ' ' + q.day.cnt,
    weekdayDays(q.n) + ' → ' + q.q + ' або ' + (q.q + 1) + ' ' +
    weekdayPl(q.q + 1, '', weekdayUk[q.day.nm].few, weekdayUk[q.day.nm].many));
}
function whyWeekday(q, full){
  if(q.kind === 'weekday' && q.shape === 'bound'){
    if(!full) return tr('Колко цели седмици се събират, и какво остава след тях?',
      'Скільки цілих тижнів уміщається і що лишається після них?');
    const w = Math.floor(q.n / 7), r = q.n % 7;
    return tr(q.n + ' = ' + w + ' × 7 + ' + r + ' &nbsp;→&nbsp; <b>' + w + '</b> пъти е сигурно, а останалите ' +
      r + ' дни може ' + (q.most ? 'да хванат още един' : 'и да не хванат нито един') +
      ' &nbsp;→&nbsp; ' + q.ans,
      q.n + ' = ' + w + ' × 7 + ' + r + ' &nbsp;→&nbsp; <b>' + w + '</b> — напевно, а ' +
      (r === 1 ? '1 день, що лишився, може ' : weekdayDays(r) + ', що лишилися, можуть ') +
      (q.most ? 'дати ще один такий день' : 'не дати жодного') + ' &nbsp;→&nbsp; ' + q.ans);
  }
  if(q.kind === 'weekday' && q.shape === 'which'){
    if(!full) return tr('Само остатъкът след цели седмици мести деня.', 'День зсуває лише остача після цілих тижнів.');
    const gap = q.n - 1, weeks = Math.floor(gap / 7), left = gap % 7;
    return tr('от първия до ' + q.n + '-ия ден има <b>' + gap + '</b> дни &nbsp;→&nbsp; ' + weeks +
      ' цели седмици и още ' + left + ' &nbsp;→&nbsp; ' + q.d1.nm + ' + ' + left + ' = <b>' +
      DAYS[q.ans - 1].nm + '</b>, тоест номер ' + q.ans,
      'від першого до ' + q.n + '-го дня минає <b>' + gap + '</b> ' + weekdayPl(gap, 'день', 'дні', 'днів') +
      ' &nbsp;→&nbsp; ' + weeks + ' ' + weekdayPl(weeks, 'цілий тиждень', 'цілі тижні', 'цілих тижнів') +
      ' і ще ' + left + ' &nbsp;→&nbsp; ' + weekdayUk[q.d1.nm].nm + ' + ' + left + ' = <b>' +
      weekdayUk[DAYS[q.ans - 1].nm].nm + '</b>, тобто номер ' + q.ans);
  }
  if(q.kind === 'weekday' && q.shape === 'last'){
    if(!full) return tr('Един и същи ден от седмицата се повтаря през всеки седем дни.',
      'Той самий день тижня повторюється кожні сім днів.');
    const all = [];
    for(let v = q.first; v <= q.mon[1]; v += 7) all.push(v);
    const u = weekdayUk[q.day.nm];
    return tr((q.day.f ? 'първата ' : 'първият ') + q.day.nm + ' е на <b>' + q.first + '</b> &nbsp;→&nbsp; ' + all.join(', ') +
      ' &nbsp;→&nbsp; следващата би била на ' + (q.ans + 7) + ', а месецът има ' + q.mon[1] +
      ' дни &nbsp;→&nbsp; ' + q.ans,
      (u.f ? 'перша ' : 'перший ') + u.nm + ' — <b>' + q.first + '</b>-го числа &nbsp;→&nbsp; ' + all.join(', ') +
      ' &nbsp;→&nbsp; ' + (u.f ? 'наступна була б ' : 'наступний був би ') + (q.ans + 7) + '-го, а в ' +
      weekdayMonUk[q.mon[0]][2] + ' ' + weekdayDays(q.mon[1]) + ' &nbsp;→&nbsp; ' + q.ans);
  }
  if(q.kind === 'weekday'){
    if(!full) return tr('Колко цели седмици се събират в толкова дни?', 'Скільки цілих тижнів уміщається в стільки днів?');
    const u = weekdayUk[q.day.nm];
    if(LANG === 'uk') return weekdayDays(q.n) + ' — це <b>' + q.q + ' ' + weekdayPl(q.q, 'тиждень', 'тижні', 'тижнів') +
      '</b> і ще ' + weekdayDays(q.r) + ' &nbsp;→&nbsp; у кожному тижні є ' + u.po + ', отже ' + q.q + '; ' +
      (q.r === 1 ? 'якщо й останній день — ' + u.nm
                 : 'якщо й один із ' + q.r + ' днів, що лишилися, — ' + u.nm) + ' → ' + (q.q + 1);
    const weeks = q.q === 1 ? '1 седмица' : q.q + ' седмици';
    const left = q.r === 1 ? 'още 1 ден' : 'още ' + q.r + ' дни';
    const extra = q.r === 1 ? 'ако и последният ден е ' + q.day.nm
                            : 'ако и някой от останалите ' + q.r + ' дни е ' + q.day.nm;
    return q.n + ' дни са <b>' + weeks + '</b> и ' + left + ' &nbsp;→&nbsp; във всяка седмица има ' +
      (q.day.f ? 'по една ' : 'по един ') + q.day.nm + ', значи ' + q.q + '; ' + extra + ' → ' + (q.q + 1);
  }
}
KIND.weekday = { draw:drawWeekday, eq:eqWeekday, why:whyWeekday };
