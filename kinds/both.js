// Question kind 'both': level 48 Два езика — Two groups that overlap — who is counted twice.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

const SUBJECTS = ['английски', 'френски', 'немски', 'испански'];
// Задача 16: two groups that add up to more than the class, so the overlap is the excess.
// Есен 2019, задача 5: two overlapping circles, each with its total above it, and an example to
// read the rule from: 7 is 4 + 3, 5 is 3 + 2. Then 8 and 12 around a shared 3: □ = 5, △ = 9, 14.
function genVenn(){
  const ex = [1 + rnd(6), 1 + rnd(5), 1 + rnd(6)], m = 1 + rnd(6), L = m + 2 + rnd(10), R = m + 2 + rnd(12);
  return {kind:'both', shape:'venn', ex, m, L, R, traps:[L + R], ans: L + R - 2*m};
}
function genBoth(){
  if(Math.random() < 0.3) return genVenn();
  for(;;){
    const T = 18 + rnd(12);
    const A = Math.floor(T*0.6) + rnd(8), B = 3 + rnd(8);
    if(A >= T || B >= T) continue;
    const both = A + B - T;
    if(both < 1 || both >= B) continue;      // some overlap, and something left studying only the second
    const lang = shuffle(SUBJECTS.slice()).slice(0, 2);
    const asksBoth = Math.random() < 0.3;
    return {kind:'both', T, A, B, both, lang, asksBoth, ans: asksBoth ? both : B - both};
  }
}

const bothUkLang = {'английски':'англійську', 'френски':'французьку', 'немски':'німецьку', 'испански':'іспанську'};
const bothUkPl = (n, one, few, many) => ({one, few})[new Intl.PluralRules('uk').select(n)] || many;
const bothUkPupils = n => n + ' ' + bothUkPl(n, 'учень', 'учні', 'учнів');
const bothUkStudy = n => bothUkPl(n, 'вивчає', 'вивчають', 'вивчають');
function vennSvg(tl, tr_, a, m, b){
  const box = (x, y) => '<rect x="' + (x - 8) + '" y="' + (y - 14) + '" width="16" height="16" fill="none" stroke="var(--accent)" stroke-width="2"/>';
  const tri = (x, y) => '<polygon points="' + (x - 9) + ',' + (y + 2) + ' ' + (x + 9) + ',' + (y + 2) + ' ' + x + ',' + (y - 14) + '" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round"/>';
  const t = (x, y, v, big) => v === '□' ? box(x, y) : v === '△' ? tri(x, y) : '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-size="' + (big ? 17 : 15) + '" font-weight="800" fill="' + (big ? 'var(--ink)' : 'var(--muted)') + '" font-family="Nunito, sans-serif">' + v + '</text>';
  return '<svg viewBox="0 0 132 92" style="max-width:150px" role="img" aria-label="' + tr('два кръга', 'два кола') + '">' +
    '<circle cx="48" cy="56" r="30" fill="none" stroke="var(--ink)" stroke-width="1.6"/><circle cx="84" cy="56" r="30" fill="none" stroke="var(--ink)" stroke-width="1.6"/>' +
    t(40, 16, tl) + t(92, 16, tr_) + t(32, 62, a, 1) + t(66, 62, m, 1) + t(100, 62, b, 1) + '</svg>';
}
function drawBoth(q){
  if(q.kind === 'both' && q.shape === 'venn'){
    const [a, m, b] = q.ex;
    return '<div class="ask">' + tr('Пресметнете сбора', 'Обчисліть суму') + ' <span class="circle">□</span> + <span class="circle">△</span>.</div>' +
      '<div class="fig">' + vennSvg(a + m, m + b, a, m, b) + vennSvg(q.L, q.R, '□', q.m, '△') + '</div>' +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)"><span class="circle">□</span> + <span class="circle">△</span> = ' + SLOT + '</div>';
  }
  if(q.kind === 'both'){
    return '<div class="ask">' + tr('В един клас има <span class="num">' + q.T + '</span> ученика. От тях <span class="num">' +
      q.A + '</span> учат <b>' + q.lang[0] + '</b> език, а <span class="num">' + q.B + '</span> — <b>' +
      q.lang[1] + '</b>. Колко ученици от този клас учат ' +
      (q.asksBoth ? '<b>и двата</b> езика?' : '<b>само ' + q.lang[1] + '</b> език?'),
      'В одному класі <span class="num">' + q.T + '</span> ' + bothUkPl(q.T, 'учень', 'учні', 'учнів') +
      '. З них <span class="num">' + q.A + '</span> ' + bothUkStudy(q.A) + ' <b>' + bothUkLang[q.lang[0]] +
      '</b> мову, а <span class="num">' + q.B + '</span> — <b>' + bothUkLang[q.lang[1]] +
      '</b>. Скільки учнів цього класу вивчають ' +
      (q.asksBoth ? '<b>обидві</b> мови?' : '<b>лише ' + bothUkLang[q.lang[1]] + '</b> мову?')) + '</div>' +
      '<div class="note">' + tr('Всеки ученик учи поне един от двата езика.', 'Кожен учень вивчає щонайменше одну з двох мов.') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqBoth(q){
  if(q.kind === 'both' && q.shape === 'venn') return '□ = ' + q.L + ' − ' + q.m + ', △ = ' + q.R + ' − ' + q.m + ' → ' + q.ans;
  if(q.kind === 'both') return tr(q.T + ' ученика, ' + q.A + ' и ' + q.B + ', и двата: ',
    bothUkPupils(q.T) + ', ' + q.A + ' і ' + q.B + ', обидві: ') + q.both + ' → ' + q.ans;
}
function whyBoth(q, full){
  if(q.kind === 'both' && q.shape === 'venn'){
    if(!full) return tr('Виж примера: числото над кръга е сборът от двете числа в него.', 'Подивись на приклад: число над колом — сума двох чисел у ньому.');
    return '□ = ' + q.L + ' − ' + q.m + ' = <b>' + (q.L - q.m) + '</b>, △ = ' + q.R + ' − ' + q.m + ' = <b>' + (q.R - q.m) + '</b> &nbsp;→&nbsp; ' + (q.L - q.m) + ' + ' + (q.R - q.m) + ' = ' + q.ans;
  }
  if(q.kind === 'both'){
    if(!full) return tr('Събери двата броя — излиза повече от учениците. Кой се брои два пъти?',
      'Додай обидва числа — вийде більше, ніж учнів у класі. Кого пораховано двічі?');
    const head = tr(q.A + ' + ' + q.B + ' = ' + (q.A + q.B) + ', а учениците са ' + q.T + ' &nbsp;→&nbsp; <b>' +
      q.both + '</b> учат и двата езика',
      q.A + ' + ' + q.B + ' = ' + (q.A + q.B) + ', а учнів ' + q.T + ' &nbsp;→&nbsp; <b>' +
      q.both + '</b> ' + bothUkStudy(q.both) + ' обидві мови');
    return q.asksBoth ? head : head + tr(' &nbsp;→&nbsp; само ' + q.lang[1] + ': ',
      ' &nbsp;→&nbsp; лише ' + bothUkLang[q.lang[1]] + ': ') + q.B + ' − ' + q.both + ' = ' + q.ans;
  }
}
KIND.both = { draw:drawBoth, eq:eqBoth, why:whyBoth };
