// Question kind 'inrow': levels 310 В редицата and 311 От един до друг — Who stands where in a row, counted from both ends; level 454 — the same, told roundabout.

// Кенгуру 2019, задача 5 (shape 'between'): a queue of 12, Лъчо the 7th from the front and Кирчо the 2nd from the end — how many
// between them? 7 are counted up to Лъчо and 2 from Кирчо to the end, so 12 − 7 − 2 = 3.
// Кенгуру 2023, задача 21 (shape 'last'): Ема is 3rd, 3 dancers between her and the last — 3 + 3 + 1 = 7 (the last one counts too).
// Кенгуру 2025, задача 14 (shape 'span'): 12 in a row, Георги 5th from the left, Виктор 4th from the right; counting from Георги
// (he is 1st), which place is Виктор? Виктор is 12 − 4 + 1 = 9th from the left, so 9 − 5 + 1 = 5.
import { KIND, SLOT, bgWith, ordBg, ordUk, popAt, rnd, svgText, tr, ukPl } from '../js/core.js';
const M_BG = ['', 'първи', 'втори', 'трети', 'четвърти', 'пети', 'шести', 'седми', 'осми', 'девети', 'десети'];
const M_UK = ['', 'перший', 'другий', 'третій', 'четвертий', 'п’ятий', 'шостий', 'сьомий', 'восьмий', 'дев’ятий', 'десятий'];
const N_BG = ['', 'първо', 'второ', 'трето', 'четвърто', 'пето', 'шесто', 'седмо', 'осмо', 'девето', 'десето'];
const N_UK = ['', 'перше', 'друге', 'третє', 'четверте', 'п’яте', 'шосте', 'сьоме', 'восьме', 'дев’яте', 'десяте'];
// names that do not change in Ukrainian
/** @type {[string, string][]} */
const IR_BOYS = [['Лъчо', 'Лучо'], ['Кирчо', 'Кірчо'], ['Ники', 'Нікі'], ['Тони', 'Тоні'], ['Данчо', 'Данчо'], ['Пешо', 'Пешо'], ['Гошо', 'Гошо'], ['Мишо', 'Мішо']];
/** @type {[string, string][]} */
const IR_GIRLS = [['Ема', 'Ема'], ['Мая', 'Мая'], ['Ния', 'Нія'], ['Рая', 'Рая'], ['Ели', 'Елі']];
// [Bulgarian, Ukrainian, Ukrainian genitive]
/** @type {[string, string, string][]} */
const IR_PAIRS = [['Георги', 'Георгій', 'Георгія'], ['Виктор', 'Віктор', 'Віктора'], ['Иван', 'Іван', 'Івана'], ['Стефан', 'Стефан', 'Стефана'], ['Петър', 'Петро', 'Петра'], ['Борис', 'Борис', 'Бориса']];
export function genInRow(){
  for(;;){
    if(Math.random() < 0.5){
      const story = rnd(2), who = rnd(4), n = 9 + rnd(11), a = 2 + rnd(8), b = 2 + rnd(8), ans = n - a - b;
      if(ans < 1 || ans > 8 || a + b === ans) continue;   // a + b is the likeliest slip, so it may not be the answer
      return {kind:'inrow', shape:'between', story, who, n, a, b, traps:[ans + 1, ans - 1, a + b], ans};
    }
    const story = rnd(2), who = rnd(5), k = 2 + rnd(8), m = 2 + rnd(7), ans = k + m + 1;
    if(Math.random() < 0.3) return genCars();
    return {kind:'inrow', shape:'last', story, who, k, m, traps:[k + m, k + m + 2, m], ans};
  }
}
// Салабашев 2024 #12 (shape 'cars'): Ваньо rides in one car of a train; the cars before his are 17, 9 fewer than the cars after his: how many in all? The cars
// after are 17 + 9 = 26, and his own makes 17 + 26 + 1 = 44. The slip is leaving his car out. Drawn after the old question.
const IR_VAN = [['Ваньо', 'Ванько'], ['Мишо', 'Мішо'], ['Данчо', 'Данчо']];
function genCars(){
  const who = rnd(IR_VAN.length), a = 8 + rnd(18), k = 2 + rnd(8);
  return {kind:'inrow', shape:'cars', who, a, k, traps:[2*a + k], ans: 2*a + k + 1};
}
// Level 454, two shapes of places counted from both ends, both told roundabout. Салабашев 2024 #11 (shape 'cross'): 22 decorations in a row, the bell the 15th
// from the left, the star the 15th from the right — how many are right of the star but left of the bell? The star is 22 − 15 + 1 = 8th from the left, so
// 9 … 14, 15 − 8 − 1 = 6 (the two counts overlap, so k + m > n + 1). 2025 #12 (shape 'ahead'): 35 racers, Виктор was passed by 17 (Пепи among them), 25
// came in after Пепи: how many between Пепи and Виктор? Пепи is 35 − 25 = 10th, so 17 − 10 = 7.
export function genInRowPlaces(){
  for(;;){
    if(Math.random() < 0.5){
      const n = 15 + rnd(16), k = 8 + rnd(n - 7), m = 8 + rnd(n - 7), ans = k + m - n - 2;
      if(k > n || m > n || ans < 2 || ans > 9) continue;
      return {kind:'inrow', shape:'cross', n, k, m, traps:[ans + 1], ans};
    }
    const n = 25 + rnd(26), b = 12 + rnd(n - 17), pp = n - b, ans = 2 + rnd(8), a = pp + ans;
    if(pp < 5 || a + 1 >= n) continue;
    return {kind:'inrow', shape:'ahead', n, a, b, pp, traps:[ans + 1], ans};
  }
}
export function genInRowSpan(){
  for(;;){
    const who = rnd(3), n = 8 + rnd(12), a = 2 + rnd(8), b = 2 + rnd(8), ans = n - a - b + 2;
    if(a + b > n - 1) continue;             // the second stands to the right of the first, with someone between
    return {kind:'inrow', shape:'span', who, n, a, b, traps:[ans - 1, ans + 1, n - a - b + 3], ans};
  }
}
const num = n => '<span class="num">' + n + '</span>';
function askPlaces(q){
  if(q.shape === 'cars'){
    const w = IR_VAN[q.who];
    return tr(w[0] + ' се вози в един от вагоните на влак. Вагоните пред неговия са ' + num(q.a) + ' и са ' + bgWith(q.k) + ' ' + num(q.k) + ' по-малко от вагоните след неговия. <b>Колко общо са вагоните на този влак?</b>',
      w[1] + ' їде в одному з вагонів потяга. Вагонів перед його вагоном — ' + num(q.a) + ', і це на ' + num(q.k) + ' менше, ніж вагонів після його вагона. <b>Скільки всього вагонів у цьому потязі?</b>');
  }
  if(q.shape === 'cross') return tr('Еми подредила любимите си ' + num(q.n) + ' различни коледни украшения за елха в редица. Златистата камбанка е на ' + ordBg(q.k, 'n') + ' място отляво надясно в тази редица. Сребърната звезда е на ' + ordBg(q.m, 'n') +
      ' място отдясно наляво в редицата. <b>Колко от украшенията в редицата са вдясно от сребърната звезда, но вляво от златистата камбанка?</b>',
    'Емі розставила свої улюблені ' + ukPl(q.n, 'різну ялинкову прикрасу', 'різні ялинкові прикраси', 'різних ялинкових прикрас') + ' у ряд. Золотистий дзвіночок — на ' + q.k + '-му місці зліва направо в цьому ряду. Срібна зірка — на ' + q.m + '-му' +
      ' місці справа наліво в ряду. <b>Скільки прикрас у ряду праворуч від срібної зірки, але ліворуч від золотистого дзвіночка?</b>');
  return tr('Пепи и Виктор били сред ' + num(q.n) + ' участници в състезание. В крайното класиране Виктор бил изпреварен от ' + num(q.a) + ' души, сред които бил Пепи. При това ' + num(q.b) + ' от участниците се класирали след Пепи. <b>Колко състезатели са се класирали след Пепи, но пред Виктор?</b>',
    'У змаганні було ' + ukPl(q.n, 'учасник', 'учасники', 'учасників') + ', серед них Пепі й Віктор. У підсумковому рейтингу перед Віктором ' + finUk(q.a) + ' ' + ukPl(q.a, 'учасник', 'учасники', 'учасників') + ', серед яких був Пепі. При цьому ' + ukPl(q.b, 'учасник', 'учасники', 'учасників') +
      ' ' + finUk(q.b) + ' після Пепі. <b>Скільки учасників фінішували після Пепі, але перед Віктором?</b>');
}
// «фінішував» with 1, 21, 31 …, «фінішували» with the rest
const finUk = n => n % 10 === 1 && n % 100 !== 11 ? 'фінішував' : 'фінішували';
const eqPlaces = q => q.shape === 'cars' ? q.a + ' + ' + (q.a + q.k) + ' + 1 = ' + q.ans : q.shape === 'cross' ? q.n + ' − ' + q.m + ' + 1 = ' + (q.n - q.m + 1) + ', ' + q.k + ' − ' + (q.n - q.m + 1) + ' − 1 = ' + q.ans
  : q.n + ' − ' + q.b + ' = ' + q.pp + ', ' + q.a + ' − ' + q.pp + ' = ' + q.ans;
function whyPlaces(q, full){
  if(q.shape === 'cars'){
    if(!full) return tr('Първо колко са вагоните след неговия. Не забравяй и самия негов вагон.', 'Спершу скільки вагонів після його вагона. Не забудь і сам його вагон.');
    return tr('след неговия: ', 'після його вагона: ') + q.a + ' + ' + q.k + ' = <b>' + (q.a + q.k) + '</b> &nbsp;→&nbsp; ' + tr('общо: ', 'усього: ') + q.a + ' + ' + (q.a + q.k) + ' + 1 = ' + q.ans;
  }
  if(q.shape === 'cross'){
    if(!full) return tr('На кое място отляво е звездата? После брой местата между нея и камбанката — без самите тях.', 'На якому місці зліва зірка? Потім порахуй місця між нею й дзвіночком — без них самих.');
    return tr('звездата отляво: ', 'зірка зліва: ') + eqPlaces(q).split(', ')[0].replace(/(\d+)$/, '<b>$1</b>') + ' &nbsp;→&nbsp; ' + tr('между нея и камбанката: ', 'між нею і дзвіночком: ') + eqPlaces(q).split(', ')[1];
  }
  if(!full) return tr('На кое място е Пепи? От тези пред Виктор махни тези до Пепи, включително него.', 'На якому місці Пепі? Від тих, що перед Віктором, відніми тих, що до Пепі включно.');
  return tr('Пепи е на място: ', 'Пепі на місці: ') + eqPlaces(q).split(', ')[0].replace(/(\d+)$/, '<b>$1</b>') + ' &nbsp;→&nbsp; ' + tr('между Пепи и Виктор: ', 'між Пепі й Віктором: ') + eqPlaces(q).split(', ')[1];
}
function ask(q){
  if(q.shape === 'cars' || q.shape === 'cross' || q.shape === 'ahead') return askPlaces(q);
  if(q.shape === 'between'){
    const [A, B] = [IR_BOYS[2*q.who], IR_BOYS[2*q.who + 1]];
    return q.story === 0
      ? tr('На входа на зоологическата градина има опашка от ' + num(q.n) + ' деца. ' + A[0] + ' е ' + M_BG[q.a] + ' по ред от началото на опашката, а ' + B[0] + ' е ' + M_BG[q.b] + ' от края. <b>Колко деца има на опашката между ' + A[0] + ' и ' + B[0] + '?</b>',
        'Біля входу до зоопарку стоїть черга з ' + num(q.n) + ' дітей. ' + A[1] + ' — ' + M_UK[q.a] + ' за порядком від початку черги, а ' + B[1] + ' — ' + M_UK[q.b] + ' від кінця. <b>Скільки дітей у черзі між ' + A[1] + ' і ' + B[1] + '?</b>')
      : tr('Пред касата на киното има опашка от ' + num(q.n) + ' деца. ' + A[0] + ' е ' + M_BG[q.a] + ' по ред от началото на опашката, а ' + B[0] + ' е ' + M_BG[q.b] + ' от края. <b>Колко деца има на опашката между ' + A[0] + ' и ' + B[0] + '?</b>',
        'Біля каси кінотеатру стоїть черга з ' + num(q.n) + ' дітей. ' + A[1] + ' — ' + M_UK[q.a] + ' за порядком від початку черги, а ' + B[1] + ' — ' + M_UK[q.b] + ' від кінця. <b>Скільки дітей у черзі між ' + A[1] + ' і ' + B[1] + '?</b>');
  }
  if(q.shape === 'last'){
    const G = IR_GIRLS[q.who];
    return q.story === 0
      ? tr(G[0] + ' заела ' + N_BG[q.k] + ' място в състезание за девойки по индивидуални танци. Между нея и последната класирана имало ' + num(q.m) + ' танцьорки. <b>Колко са били участничките в състезанието?</b>',
        G[1] + ' посіла ' + N_UK[q.k] + ' місце у змаганні серед дівчат з індивідуальних танців. Між нею та останньою учасницею було ' + ukPl(q.m, 'танцівниця', 'танцівниці', 'танцівниць') + '. <b>Скільки було учасниць у змаганні?</b>')
      : tr(G[0] + ' заела ' + N_BG[q.k] + ' място в състезание по бягане за девойки. Между нея и последната класирана имало ' + num(q.m) + ' бегачки. <b>Колко са били участничките в състезанието?</b>',
        G[1] + ' посіла ' + N_UK[q.k] + ' місце у змаганні з бігу серед дівчат. Між нею та останньою учасницею було ' + ukPl(q.m, 'бігунка', 'бігунки', 'бігунок') + '. <b>Скільки було учасниць у змаганні?</b>');
  }
  const [A, B] = [IR_PAIRS[2*q.who], IR_PAIRS[2*q.who + 1]];
  return tr(num(q.n) + ' ученици са подредени в редица. Ако сме с лице към редицата и броим отляво надясно, ' + A[0] + ' е ' + M_BG[q.a] + ' в редицата, а ако броим отдясно наляво, ' + B[0] + ' е ' + M_BG[q.b] + '. <b>Кой по ред е ' + B[0] + ', ако започнем да броим от ' + A[0] + ' към ' + B[0] + '?</b>',
    'У ряду стоїть ' + ukPl(q.n, 'учень', 'учні', 'учнів') + '. Якщо дивитися на ряд і рахувати зліва направо, ' + A[1] + ' — ' + M_UK[q.a] + ', а якщо рахувати справа наліво, ' + B[1] + ' — ' + M_UK[q.b] + '. <b>Який за порядком ' + B[1] + ', якщо почати рахувати від ' + A[2] + ' до ' + B[2] + '?</b>');
}
function drawInRow(q){
  return '<div class="ask">' + ask(q) + '</div><div class="line xl">' + SLOT + '</div>';
}
function eqInRow(q){
  if(q.shape === 'cars' || q.shape === 'cross' || q.shape === 'ahead') return eqPlaces(q);
  return q.shape === 'between' ? q.n + ' − ' + q.a + ' − ' + q.b + ' = ' + q.ans : q.shape === 'last' ? q.k + ' + ' + q.m + ' + 1 = ' + q.ans : q.n + ' − ' + q.b + ' + 1 − ' + q.a + ' + 1 = ' + q.ans;
}
// the row of squares: the two named ones in the middle colour, the ones between them tinted and counted above
function rowSvg(n, hot, from, to, cnt){
  const w = Math.min(16, 290 / n), x0 = 150 - n*w/2;
  let g = '';
  for(let i = 1; i <= n; i++){
    const h = hot.includes(i), mid = i > from && i < to;
    g += '<rect x="' + (x0 + (i - 1)*w + 0.8).toFixed(1) + '" y="34" width="' + (w - 1.6).toFixed(1) + '" height="26" rx="1.5" fill="' + (h ? 'var(--warm)' : mid ? 'var(--accentbg)' : 'none') + '" stroke="' + (h ? 'var(--warm)' : 'var(--line)') + '"/>';
  }
  if(to - from > 1) g += svgText((x0 + (from*w + (to - from - 1)*w/2)).toFixed(1), 26, cnt, 13, 'var(--accent)', popAt(1));
  hot.forEach((h, k) => { g += svgText((x0 + (h - 0.5)*w).toFixed(1), 78, '★', 12, 'var(--warm)', popAt(2 + k)); });
  return '<svg viewBox="0 0 300 86" style="display:block; width:300px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + tr('редицата', 'ряд') + '">' + g + '</svg>';
}
function whyInRow(q, full){
  if(q.shape === 'cars' || q.shape === 'cross' || q.shape === 'ahead') return whyPlaces(q, full);
  if(q.shape === 'between'){
    if(!full) return tr('Колко деца са до първото, включително него, и колко от второто до края, включително него? Махни ги от всички.', 'Скільки дітей до першої дитини включно і скільки від другої до кінця включно? Відніми їх від усіх.');
    return rowSvg(q.n, [q.a, q.n - q.b + 1], q.a, q.n - q.b + 1, q.ans) + tr('до първия включително: ' + q.a + ', от втория до края включително: ' + q.b + ' — те двамата не са между тях', 'до першого включно: ' + q.a + ', від другого до кінця включно: ' + q.b + ' — вони двоє не між ними') + ' &nbsp;→&nbsp; ' + eqInRow(q);
  }
  if(q.shape === 'last'){
    if(!full) return tr('Не забравяй самата последна — и тя е участничка.', 'Не забудь саму останню — вона теж учасниця.');
    return rowSvg(q.k + q.m + 1, [q.k, q.ans], q.k, q.ans, q.m) + tr('тя е ' + ordBg(q.k, 'f') + ', после ' + q.m + ' между, и още една — последната', 'вона ' + ordUk(q.k, 'f') + ', потім ' + q.m + ' між, і ще одна — остання') + ' &nbsp;→&nbsp; ' + eqInRow(q);
  }
  const pos = q.n - q.b + 1;
  if(!full) return tr('Кое по ред е вторият отляво? После брой от първия като от 1.', 'Яке місце має другий зліва? Потім рахуй від першого як від 1.');
  return rowSvg(q.n, [q.a, pos], q.a, pos, pos - q.a - 1) + tr('вторият е отляво ' + q.n + ' − ' + q.b + ' + 1 = ' + ordBg(pos, 'm') + '; от първия (той е 1-ви) броим: ' + pos + ' − ' + q.a + ' + 1', 'другий зліва ' + q.n + ' − ' + q.b + ' + 1 = ' + ordUk(pos, 'm') + '; від першого (він 1-й) рахуємо: ' + pos + ' − ' + q.a + ' + 1') + ' = <b>' + q.ans + '</b>';
}
KIND.inrow = { draw:drawInRow, eq:eqInRow, why:whyInRow };
