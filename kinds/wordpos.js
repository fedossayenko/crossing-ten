// Question kind 'wordpos': level 94 КОЛЕДАКОЛЕДА… — Which letter stands at a place in a word written over and over.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Коледно състезание 2025, задача 6: КОЛЕДА written 10 times in one long word; the 46th letter
// counted from the right. 60 letters, so the 46th from the right is the 15th from the left,
// and every 6 letters the word starts again: 15 = 6 + 6 + 3, the 3rd letter, Л. A letter
// cannot be typed, so this kind brings its own А/Б/В/Г, and ans is the right one's id.
// Each pair is the word in Bulgarian and in Ukrainian, the same length, no letter twice.
const WORDPOS = [['КОЛЕДА', 'КОЛЯДА'], ['СНЯГ', 'СНІГ'], ['ШЕЙНА', 'САНКИ']];
function genWordPos(){
  for(;;){
    const w = rnd(WORDPOS.length), L = WORDPOS[w][0].length, n = 4 + rnd(8), right = Math.random() < 0.6;
    const p = 7 + rnd(n*L - 7);                                   // past the first word, or there is nothing to count
    const fromLeft = right ? n*L - p + 1 : p, at = (fromLeft - 1) % L;
    const wrong = shuffle([...Array(L).keys()].filter(i => i !== at)).slice(0, 3);
    const ids = shuffle(wrong.concat(at));
    const options = ids.map((li, id) => ({ id, v: id, text: [WORDPOS[w][0][li], WORDPOS[w][1][li]] }));
    const pick = ids.indexOf(at);
    return {kind:'wordpos', w, L, n, p, right, fromLeft, at, options, pick, own: true, ans: pick};
  }
}
const wordPosWord = q => tr(WORDPOS[q.w][0], WORDPOS[q.w][1]);
function drawWordPos(q){
  if(q.kind === 'wordpos'){
    const W = wordPosWord(q);
    return '<div class="ask">' + tr('Петя написала <span class="num">' + q.n + '</span> пъти ' + W + ' слято и получила една дълга дума, започваща с ',
      'Петя написала <span class="num">' + q.n + '</span> разів ' + W + ' разом і отримала одне довге слово, що починається з ') +
      '<b>' + W + W + W + '…</b> ' + tr('Коя буква е написана на <span class="num">' + q.p + '-то</span> място <b>' + (q.right ? 'отдясно наляво' : 'отляво надясно') + '</b>?',
      'Яка буква стоїть на <span class="num">' + q.p + '-му</span> місці, якщо рахувати <b>' + (q.right ? 'справа наліво' : 'зліва направо') + '</b>?') + '</div>';
  }
}
function eqWordPos(q){
  if(q.kind === 'wordpos') return (q.right ? q.n*q.L + ' − ' + q.p + ' + 1 = ' + q.fromLeft + ', ' : '') + q.fromLeft + tr('-ма → ', '-га → ') + wordPosWord(q)[q.at];
}
function whyWordPos(q, full){
  if(q.kind === 'wordpos'){
    if(!full) return tr('Думата се повтаря — на всеки толкова букви, колкото има в нея, започва отначало.', 'Слово повторюється — через стільки букв, скільки в ньому є, воно починається знову.');
    const W = wordPosWord(q), whole = Math.floor((q.fromLeft - 1) / q.L);
    return (q.right ? tr('всички букви: ', 'усього букв: ') + q.n + ' · ' + q.L + ' = ' + q.n*q.L + tr(', отляво това е ', ', зліва це ') + q.n*q.L + ' − ' + q.p + ' + 1 = <b>' + q.fromLeft + '</b> &nbsp;→&nbsp; ' : '') +
      q.fromLeft + ' = ' + (whole ? whole + ' · ' + q.L + ' + ' : '') + (q.at + 1) + ' &nbsp;→&nbsp; ' + tr('буква номер ', 'буква номер ') + (q.at + 1) + tr(' в ', ' у ') + W + ': <b>' + W[q.at] + '</b>';
  }
}
KIND.wordpos = { draw:drawWordPos, eq:eqWordPos, why:whyWordPos };
