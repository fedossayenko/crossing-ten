// Question kind 'both': level 48 Два езика — Two groups that overlap — who is counted twice.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

const SUBJECTS = ['английски', 'френски', 'немски', 'испански'];
// Задача 16: two groups that add up to more than the class, so the overlap is the excess.
function genBoth(){
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
function drawBoth(q){
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
  if(q.kind === 'both') return tr(q.T + ' ученика, ' + q.A + ' и ' + q.B + ', и двата: ',
    bothUkPupils(q.T) + ', ' + q.A + ' і ' + q.B + ', обидві: ') + q.both + ' → ' + q.ans;
}
function whyBoth(q, full){
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
