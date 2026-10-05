// Question kind 'whocolor': level 187 Чий е балонът? — Three children, three colours, two «not» clues.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Пролет 2021, 1 клас, задача 18: Алекс, Борис и Катрин have one balloon each — blue, green and yellow.
// Алекс's is neither yellow nor blue, Борис's is not yellow. Катрин's? Алекс has the green one, so Борис,
// not yellow, has the blue, and the yellow is left for Катрин. A colour cannot be typed, so this kind
// brings its own four: the three colours and «cannot be told».
// [Bulgarian, Ukrainian, Ukrainian genitive]
/** @type {[string, string, string][]} */
const WC_KIDS = [['Алекс', 'Алекс', 'Алекса'], ['Борис', 'Борис', 'Бориса'], ['Катрин', 'Катрін', 'Катрін'], ['Мая', 'Мая', 'Маї'],
                 ['Иван', 'Іван', 'Івана'], ['Ния', 'Нія', 'Нії']];
// [Bulgarian, for a balloon; Ukrainian, for a balloon (кулька)]
/** @type {[string, string][]} */
const WC_COLS = [['син', 'синя'], ['зелен', 'зелена'], ['жълт', 'жовта'], ['червен', 'червона']];
// every way to give the three colours out, kept when it fits both clues
const wcFits = q => [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]].filter(p => !q.not1.includes(p[0]) && p[1] !== q.not2);
function genWhoColor(){
  for(;;){
    const kids = shuffle([0, 1, 2, 3, 4, 5]).slice(0, 3), cols = shuffle([0, 1, 2, 3]).slice(0, 3);
    const has = shuffle([0, 1, 2]);                       // has[k]: the colour (0–2, into cols) of the k-th child
    const not1 = shuffle([0, 1, 2].filter(c => c !== has[0])), not2 = [0, 1, 2].filter(c => c !== has[1] && c !== has[0])[0];
    const q = {kind:'whocolor', kids, cols, has, not1, not2};
    const fits = wcFits(q);
    if(fits.length !== 1) continue;
    const ask = Math.random() < 0.7 ? 2 : 1, at = has[ask];
    const texts = cols.map(c => [WC_COLS[c][0], WC_COLS[c][1]]).concat([['Не може да се каже', 'Не можна визначити']]);
    const ids = shuffle([0, 1, 2, 3]), pick = ids.indexOf(at);
    return Object.assign(q, {ask, options: ids.map((t, id) => ({ id, v: id, text: texts[t] })), pick, own: true, ans: pick});
  }
}
const wcKid = (q, k) => WC_KIDS[q.kids[k]], wcCol = (q, c) => WC_COLS[q.cols[c]];
function drawWhoColor(q){
  if(q.kind === 'whocolor'){
    const [a, b, c] = [0, 1, 2].map(k => wcKid(q, k)), cs = [0, 1, 2].map(k => wcCol(q, k)), n1 = q.not1.map(k => wcCol(q, k)), n2 = wcCol(q, q.not2), who = wcKid(q, q.ask);
    return '<div class="ask">' + tr(a[0] + ', ' + b[0] + ' и ' + c[0] + ' имат по един балон с различен цвят – ' + cs.map(x => x[0]).join(', ').replace(/, ([^,]*)$/, ' и $1') +
      '. Балонът на ' + a[0] + ' не е нито ' + n1[0][0] + ', нито ' + n1[1][0] + '. Балонът на ' + b[0] + ' не е ' + n2[0] + '. <b>Какъв цвят е балонът на ' + who[0] + '?</b>',
      'У ' + a[2] + ', ' + b[2] + ' і ' + c[2] + ' є по одній кульці різного кольору – ' + cs.map(x => x[1]).join(', ').replace(/, ([^,]*)$/, ' і $1') +
      '. Кулька ' + a[2] + ' ні ' + n1[0][1] + ', ні ' + n1[1][1] + '. Кулька ' + b[2] + ' не ' + n2[1] + '. <b>Якого кольору кулька ' + who[2] + '?</b>') + '</div>';
  }
}
function eqWhoColor(q){
  if(q.kind === 'whocolor') return [0, 1, 2].map(k => tr(wcKid(q, k)[0], wcKid(q, k)[1]) + ' — ' + tr(wcCol(q, q.has[k])[0], wcCol(q, q.has[k])[1])).join(', ');
}
function whyWhoColor(q, full){
  if(q.kind === 'whocolor'){
    if(!full) return tr('Започни от детето, за което се казва кои два цвята не са неговите.', 'Почни з дитини, про яку сказано, яких двох кольорів у неї немає.');
    const [a, b, c] = [0, 1, 2].map(k => wcKid(q, k)), col = k => wcCol(q, q.has[k]);
    return tr(a[0] + ': не ' + q.not1.map(k => wcCol(q, k)[0]).join(', не ') + ' → <b>' + col(0)[0] + '</b>; &nbsp;' + b[0] + ': не ' + wcCol(q, q.not2)[0] + ', не ' + col(0)[0] + ' → <b>' + col(1)[0] + '</b>; &nbsp;' +
        c[0] + ' → остава <b>' + col(2)[0] + '</b>',
      a[1] + ': не ' + q.not1.map(k => wcCol(q, k)[1]).join(', не ') + ' → <b>' + col(0)[1] + '</b>; &nbsp;' + b[1] + ': не ' + wcCol(q, q.not2)[1] + ', не ' + col(0)[1] + ' → <b>' + col(1)[1] + '</b>; &nbsp;' +
        c[1] + ' → лишається <b>' + col(2)[1] + '</b>');
  }
}
KIND.whocolor = { draw:drawWhoColor, eq:eqWhoColor, why:whyWhoColor };
