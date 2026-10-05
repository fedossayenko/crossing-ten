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
/** @type {[string, number][]} */
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
// МБГ Пролет 2025, 1 клас, задача 20: the same bound over a shorter run — the least Tuesdays among 20 days.
// short: the weeks are added up as sevens, not multiplied — there is no × in the 1st grade
function genBoundShort(){ const q = genBound(); return q.n > 30 ? genBoundShort() : Object.assign(q, {short:true}); }
// МБГ Пролет 2023, 1 клас, задача 17: mum's birthday is on a Sunday, dad's 3 days later, on a Wednesday; mine
// is 5 days after dad's — Thursday 1, Friday 2, … Monday 5. A day cannot be typed, so it brings its own four.
// [who first, Ukrainian genitive], [who second, Ukrainian genitive]
const SHIFT_WHO = [[['мама', 'мами'], ['баща ми', 'тата']], [['баба', 'бабусі'], ['дядо ми', 'дідуся']], [['сестра ми', 'сестри'], ['брат ми', 'брата']]];
function genShift(){
  const who = rnd(SHIFT_WHO.length), d0 = rnd(7), k = 1 + rnd(4), m = 2 + rnd(5), d1 = (d0 + k) % 7, at = (d1 + m) % 7;
  const wrong = [(d0 + m) % 7, (at + 6) % 7, (at + 1) % 7, d1, (at + 2) % 7].filter((v, i, a) => v !== at && a.indexOf(v) === i).slice(0, 3);
  const ids = shuffle(wrong.concat(at)), options = ids.map((di, id) => ({ id, v: id, text: [DAYS[di].nm, weekdayUk[DAYS[di].nm].nm] }));
  const pick = ids.indexOf(at);
  return {kind:'weekday', shape:'shift', who, d0, k, m, d1, at, options, pick, own: true, ans: pick};
}
const shiftIn = i => (/^[вф]/.test(DAYS[i].nm) ? 'във ' : 'в ') + DAYS[i].nm;
const shiftInUk = i => 'у ' + (weekdayUk[DAYS[i].nm].f ? weekdayUk[DAYS[i].nm].nm.replace(/а$/, 'у').replace(/я$/, 'ю') : weekdayUk[DAYS[i].nm].nm);
// МБГ Пролет 2022, 1 клас, задача 15: 1 април is a Friday; how many Fridays are there in April after it? 8, 15,
// 22 and 29 — 4. Or another weekday of the month, counted from its first date.
function genAfter(){
  const mon = MONTHS[rnd(MONTHS.length)], first1 = rnd(7), want = Math.random() < 0.6 ? first1 : rnd(7);
  let first = 1 + (want - first1 + 7) % 7;
  if(first === 1) first = 8;                      // the 1st itself is not after the 1st
  return {kind:'weekday', shape:'after', mon, d1: DAYS[first1], day: DAYS[want], first, ans: 1 + Math.floor((mon[1] - first) / 7)};
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
  if(q.kind === 'weekday' && q.shape === 'shift'){
    const [a, b] = SHIFT_WHO[q.who];
    return '<div class="ask">' + tr('Рожденият ден на ' + a[0] + ' е ' + shiftIn(q.d0) + ', а рожденият ден на ' + b[0] + ' е <span class="num">' + q.k + '</span> ' + (q.k === 1 ? 'ден' : 'дни') + ' по-късно – ' + shiftIn(q.d1) +
      '. Моят рожден ден ще бъде <span class="num">' + q.m + '</span> дни след рождения ден на ' + b[0] + '. <b>В кой ден от седмицата</b> ще е моят рожден ден?',
      'День народження ' + a[1] + ' — ' + shiftInUk(q.d0) + ', а день народження мого ' + b[1] + ' — на <span class="num">' + q.k + '</span> ' + weekdayPl(q.k, 'день', 'дні', 'днів') + ' пізніше, ' + shiftInUk(q.d1) +
      '. Мій день народження буде через <span class="num">' + q.m + '</span> ' + weekdayPl(q.m, 'день', 'дні', 'днів') + ' після дня народження ' + b[1] + '. <b>Яким днем тижня</b> буде мій день народження?') + '</div>';
  }
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
  if(q.kind === 'weekday' && q.shape === 'after'){
    const u = weekdayUk[q.day.nm], m = weekdayMonUk[q.mon[0]];
    return '<div class="ask">' + tr('Първият ден на месец <b>' + q.mon[0] + '</b> е <b>' + q.d1.nm + '</b>. Колко <b>' + q.day.cnt + '</b> има през ' + q.mon[0] + ' <b>след</b> първия ден?',
      'Перший день <b>' + m[1] + '</b> — <b>' + weekdayUk[q.d1.nm].nm + '</b>. Скільки <b>' + u.many + '</b> у ' + m[2] + ' <b>після</b> першого дня?') + '</div>' +
      '<div class="note">' + tr('Месец ' + q.mon[0] + ' има ' + q.mon[1] + ' дни.', 'У ' + m[2] + ' ' + weekdayDays(q.mon[1]) + '.') + '</div>' +
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
const afterDates = q => { const r = []; for(let d = q.first; d <= q.mon[1]; d += 7) r.push(d); return r; };
function eqWeekday(q){
  if(q.kind === 'weekday' && q.shape === 'after') return tr(q.day.nm, weekdayUk[q.day.nm].nm) + ': ' + afterDates(q).join(', ') + ' → ' + q.ans;
  if(q.kind === 'weekday' && q.shape === 'shift') return tr(DAYS[q.d1].nm, weekdayUk[DAYS[q.d1].nm].nm) + ' + ' + q.m + ' → ' + tr(DAYS[q.at].nm, weekdayUk[DAYS[q.at].nm].nm);
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
// The picture is a calendar, a row to a week. For a month it starts under the weekday of the 1st:
// the dates fill in, then the asked date and its weekday light up (or the asked weekday's dates are
// ringed one by one down to the last). For a run of days with no known start, every whole week is a
// green row with one of the asked day in it, and the days left over are an orange row that may or
// may not hold another.
function weekdaySvg(q){
  const C = 24, short = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
  const cell = (c, r, fill, stroke, extra) => '<rect' + (extra || '') + ' x="' + (c * C + 1) + '" y="' + (r * C + 1) + '" width="' + (C - 2) + '" height="' + (C - 2) + '" rx="4" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.5"/>';
  const svg = (w, h, g) => '<svg viewBox="-2 -' + (q.mon || q.shape === 'which' ? 22 : 2) + ' ' + w + ' ' + h + '" style="display:block; width:' + Math.round(w * 1.25) + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('календар', 'календар') + '">' + g + '</svg>';
  if(q.shape === 'which' || q.shape === 'last' || q.shape === 'after'){
    const c0 = DAYS.indexOf(q.d1), len = q.shape === 'which' ? q.n : q.mon[1], col = q.shape === 'which' ? (c0 + q.n - 1) % 7 : DAYS.indexOf(q.day);
    const pos = d => [(c0 + d - 1) % 7, Math.floor((c0 + d - 1) / 7)], rows = pos(len)[1] + 1;
    let g = short.map((nm, c) => svgText(c * C + C / 2, -7, nm, 10, 'var(--muted)')).join('');
    for(let d = 1; d <= len; d++){ const [c, r] = pos(d); g += '<g' + popAt(d / 4) + '>' + cell(c, r, 'none', 'var(--line)') + svgText(c * C + C / 2, r * C + 16, d, 11, 'var(--ink)') + '</g>'; }
    const t0 = len / 4 + 1, ring = (d, k) => { const [c, r] = pos(d);
      return '<g' + popAt(t0 + k) + '>' + cell(c, r, 'var(--warm)', 'var(--warm)') + svgText(c * C + C / 2, r * C + 16, d, 11, '#fff') + '</g>'; };
    g += '<rect' + popAt(t0) + ' x="' + (col * C) + '" y="-20" width="' + C + '" height="' + (rows * C + 20) + '" rx="6" fill="none" stroke="var(--warm)" stroke-width="2"/>';
    if(q.shape === 'which'){
      const nm = DAYS[q.ans - 1].nm;
      g += ring(q.n, 1) + svgText(84, rows * C + 22, tr(nm, weekdayUk[nm].nm) + ' → ' + q.ans, 15, 'var(--ink)', popAt(t0 + 2));
      return svg(172, rows * C + 52, g);
    }
    let k = 1; for(let d = q.first; d <= len; d += 7) g += ring(d, k++);
    if(q.shape === 'after'){ g += svgText(84, rows * C + 22, afterDates(q).join(', ') + ' → ' + q.ans, 15, 'var(--ink)', popAt(t0 + k)); return svg(172, rows * C + 52, g); }
    return svg(172, rows * C + 26, g);
  }
  // a run of n days: whole weeks, then what is left
  const w = Math.floor(q.n / 7), r = q.n % 7, rows = w + (r ? 1 : 0);
  let g = '';
  for(let i = 0; i < q.n; i++){ const c = i % 7, row = Math.floor(i / 7), whole = row < w;
    g += cell(c, row, whole ? 'var(--goodbg)' : 'none', whole ? 'var(--good)' : 'var(--warm)', popAt(row + c / 10)); }
  for(let row = 0; row < w; row++) g += svgText(7 * C + 14, row * C + 17, row + 1, 13, 'var(--good)', popAt(row + 0.8));
  if(r) g += svgText(7 * C + 14, w * C + 17, '?', 14, 'var(--warm)', popAt(w + 0.8));
  const foot = q.shape === 'bound' ? w + (q.most ? ' + 1' : ' + 0') + ' = ' + q.ans : q.q + tr(' или ', ' або ') + (q.q + 1);
  g += svgText(88, rows * C + 22, foot, 15, 'var(--ink)', popAt(rows + 1.5));
  return svg(196, rows * C + 32, g);
}
function whyWeekday(q, full){
  if(q.kind === 'weekday' && q.shape === 'shift'){
    if(!full) return tr('Тръгни от деня на ' + SHIFT_WHO[q.who][1][0] + ' и брой дните напред по пръсти.', 'Почни від дня ' + SHIFT_WHO[q.who][1][1] + ' і рахуй дні вперед на пальцях.');
    const nm = i => tr(DAYS[i].nm, weekdayUk[DAYS[i].nm].nm), walk = [];
    for(let j = 1; j <= q.m; j++) walk.push(nm((q.d1 + j) % 7) + ' ' + j);
    return tr('след ' + DAYS[q.d1].nm + ' — ', weekdayUk[DAYS[q.d1].nm].nm + ', а далі — ') + walk.join(', ') + ' &nbsp;→&nbsp; <b>' + nm(q.at) + '</b>' + tr(' — денят на ' + SHIFT_WHO[q.who][0][0] + ' не ни трябва', ' — день ' + SHIFT_WHO[q.who][0][1] + ' нам не потрібен');
  }
  const text = whyWeekdayText(q, full);
  return full && text ? text + weekdaySvg(q) : text;
}
function whyWeekdayText(q, full){
  if(q.kind === 'weekday' && q.shape === 'after'){
    if(!full) return tr('Един и същи ден от седмицата се повтаря през всеки седем дни. Първият ден не се брои.', 'Той самий день тижня повторюється кожні сім днів. Перший день не рахується.');
    return tr(q.day.nm + ' е на ', weekdayUk[q.day.nm].nm + ' — ') + afterDates(q).join(', ') + ' &nbsp;→&nbsp; ' + q.ans;
  }
  if(q.kind === 'weekday' && q.shape === 'bound'){
    if(!full) return tr('Колко цели седмици се събират, и какво остава след тях?',
      'Скільки цілих тижнів уміщається і що лишається після них?');
    const w = Math.floor(q.n / 7), r = q.n % 7, head = q.n + ' = ' + (q.short ? Array(w).fill(7).join(' + ') : w + ' × 7') + ' + ' + r;
    return tr(head + ' &nbsp;→&nbsp; <b>' + w + '</b> ' + (w === 1 ? 'е сигурен' : 'са сигурни') + ', а ' +
      (r === 1 ? 'оставащият 1 ден може ' : 'останалите ' + r + ' дни могат ') + (q.most ? 'да хванат още един' : 'и да не хванат нито един') +
      ' &nbsp;→&nbsp; ' + q.ans,
      head + ' &nbsp;→&nbsp; <b>' + w + '</b> — точно, а ' +
      (r === 1 ? '1 день, що лишився, може ' : weekdayDays(r) + ', що лишилися, можуть ') +
      (q.most ? 'дати ще один такий день' : 'не дати жодного') + ' &nbsp;→&nbsp; ' + q.ans);
  }
  if(q.kind === 'weekday' && q.shape === 'which'){
    if(!full) return tr('Само остатъкът след цели седмици мести деня.', 'День зсуває лише остача після цілих тижнів.');
    const gap = q.n - 1, weeks = Math.floor(gap / 7), left = gap % 7;
    return tr('от първия до ' + q.n + '-ия ден има <b>' + gap + '</b> дни &nbsp;→&nbsp; ' + (weeks === 1 ? '1 цяла седмица' : weeks + ' цели седмици') + ' и още ' + left + ' &nbsp;→&nbsp; ' + q.d1.nm + ' + ' + left + ' = <b>' +
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
