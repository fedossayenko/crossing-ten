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

function drawWeekday(q){
  if(q.kind === 'weekday' && q.shape === 'bound'){
    return '<div class="ask">Колко <b>най-' + (q.most ? 'много' : 'малко') + '</b> ' + q.day.cnt +
      ' може да има сред <span class="num">' + q.n + '</span> последователни дни от календара?</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'weekday' && q.shape === 'which'){
    return '<div class="ask">Първият ден на месец <b>' + q.mon[0] + '</b> е <b>' + q.d1.nm +
      '</b>. Кой ден от седмицата ще бъде <b>' + q.n + '-ият</b> ден на същия месец?</div>' +
      '<div class="note">' + DAYS.map((d, i) => (i + 1) + ' ' + d.nm).join(' · ') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'weekday' && q.shape === 'last'){
    return '<div class="ask">Първият ден на месец <b>' + q.mon[0] + '</b> е <b>' + q.d1.nm +
      '</b>. На коя дата ще е <b>' + (q.day.f ? 'последната ' : 'последният ') + q.day.nm +
      '</b> през ' + q.mon[0] + '?</div>' +
      '<div class="note">Месец ' + q.mon[0] + ' има ' + q.mon[1] + ' дни.</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'weekday'){
    return '<div class="ask">Колко <b>' + q.day.cnt + '</b> може да има сред <span class="num">' + q.n +
      '</span> последователни дни?</div>' +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + SLOT +
      ' <span class="or">или</span> <span class="slot" id="slot1"></span></div>';
  }
}
function eqWeekday(q){
  if(q.kind === 'weekday' && q.shape === 'bound') return q.n + ' дни → най-' + (q.most ? 'много ' : 'малко ') + q.ans;
  if(q.kind === 'weekday' && q.shape === 'which') return q.mon[0] + ', 1-ви е ' + q.d1.nm + ', ден ' +
    q.n + ' → ' + DAYS[q.ans - 1].nm + ' (' + q.ans + ')';
  if(q.kind === 'weekday' && q.shape === 'last') return q.mon[0] + ', 1-ви е ' + q.d1.nm + ' → ' +
    q.day.nm + ' от ' + q.first + ' нататък → ' + q.ans;
  if(q.kind === 'weekday') return q.n + ' дни → ' + q.q + ' или ' + (q.q + 1) + ' ' + q.day.cnt;
}
function whyWeekday(q, full){
  if(q.kind === 'weekday' && q.shape === 'bound'){
    if(!full) return 'Колко цели седмици се събират, и какво остава след тях?';
    const w = Math.floor(q.n / 7), r = q.n % 7;
    return q.n + ' = ' + w + ' × 7 + ' + r + ' &nbsp;→&nbsp; <b>' + w + '</b> пъти е сигурно, а останалите ' +
      r + ' дни може ' + (q.most ? 'да хванат още един' : 'и да не хванат нито един') +
      ' &nbsp;→&nbsp; ' + q.ans;
  }
  if(q.kind === 'weekday' && q.shape === 'which'){
    if(!full) return 'Само остатъкът след цели седмици мести деня.';
    const gap = q.n - 1, weeks = Math.floor(gap / 7), left = gap % 7;
    return 'от първия до ' + q.n + '-ия ден има <b>' + gap + '</b> дни &nbsp;→&nbsp; ' + weeks +
      ' цели седмици и още ' + left + ' &nbsp;→&nbsp; ' + q.d1.nm + ' + ' + left + ' = <b>' +
      DAYS[q.ans - 1].nm + '</b>, тоест номер ' + q.ans;
  }
  if(q.kind === 'weekday' && q.shape === 'last'){
    if(!full) return 'Един и същи ден от седмицата се повтаря през всеки седем дни.';
    const all = [];
    for(let v = q.first; v <= q.mon[1]; v += 7) all.push(v);
    return (q.day.f ? 'първата ' : 'първият ') + q.day.nm + ' е на <b>' + q.first + '</b> &nbsp;→&nbsp; ' + all.join(', ') +
      ' &nbsp;→&nbsp; следващата би била на ' + (q.ans + 7) + ', а месецът има ' + q.mon[1] +
      ' дни &nbsp;→&nbsp; ' + q.ans;
  }
  if(q.kind === 'weekday'){
    if(!full) return 'Колко цели седмици се събират в толкова дни?';
    const weeks = q.q === 1 ? '1 седмица' : q.q + ' седмици';
    const left = q.r === 1 ? 'още 1 ден' : 'още ' + q.r + ' дни';
    const extra = q.r === 1 ? 'ако и последният ден е ' + q.day.nm
                            : 'ако и някой от останалите ' + q.r + ' дни е ' + q.day.nm;
    return q.n + ' дни са <b>' + weeks + '</b> и ' + left + ' &nbsp;→&nbsp; във всяка седмица има ' +
      (q.day.f ? 'по една ' : 'по един ') + q.day.nm + ', значи ' + q.q + '; ' + extra + ' → ' + (q.q + 1);
  }
}
KIND.weekday = { draw:drawWeekday, eq:eqWeekday, why:whyWeekday };
