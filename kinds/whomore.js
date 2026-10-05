// Question kind 'whomore': level 177 Кой и с колко? — Two children add the same numbers, one of them
// with one more addend. Generator, drawing, summary line and hints for this kind all live here; the
// level itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Пролет 2025, 1 клас, задача 17: Лили пресметнала 1 + 2 + 28, а Ники — 3 + 1 + 2 + 28. Кой е получил
// по-голям сбор и с колко? Niki added the very same numbers and a 3 besides: Ники, by 3 — no sum needs
// working out. The answer is a name and a number, so this kind brings its own А/Б/В/Г; ans is the right id.
/** @type {[string, string][]} */
const WM_GIRLS = [['Лили', 'Лілі'], ['Мая', 'Мая'], ['Ани', 'Ані'], ['Ива', 'Іва']];
/** @type {[string, string][]} */
const WM_BOYS = [['Ники', 'Нікі'], ['Боби', 'Бобі'], ['Тони', 'Тоні'], ['Асен', 'Асен']];
function genWhoMore(){
  const g = rnd(WM_GIRLS.length), b = rnd(WM_BOYS.length);
  const base = [1 + rnd(9), 1 + rnd(9), 20 + rnd(10)], e = 1 + rnd(9), at = rnd(4), boy = Math.random() < 0.6;
  const S = base.reduce((t, v) => t + v, 0);
  const win = boy ? WM_BOYS[b] : WM_GIRLS[g], lose = boy ? WM_GIRLS[g] : WM_BOYS[b];
  const opt = (who, n) => [who[0] + ', ' + bgWith(n) + ' ' + n, who[1] + ', на ' + n];
  const texts = [opt(win, e), opt(lose, e), opt(win, S + e), ['Равни са', 'Порівну']];
  const ids = shuffle([0, 1, 2, 3]), pick = ids.indexOf(0);
  return {kind:'whomore', g, b, base, e, at, boy, S, options: ids.map((t, id) => ({ id, v: id, text: texts[t] })), pick, own: true, ans: pick};
}
const wmMore = q => q.base.slice(0, q.at).concat(q.e, q.base.slice(q.at));
function drawWhoMore(q){
  if(q.kind === 'whomore'){
    const G = WM_GIRLS[q.g], B = WM_BOYS[q.b], gs = (q.boy ? q.base : wmMore(q)).join(' + '), bs = (q.boy ? wmMore(q) : q.base).join(' + ');
    return '<div class="ask">' + tr(G[0] + ' пресметнала вярно <span class="num">' + gs + '</span>, а ' + B[0] + ' пресметнал вярно <span class="num">' + bs + '</span>. Кой е получил <b>по-голям</b> сбор и с колко?',
      G[1] + ' правильно обчислила <span class="num">' + gs + '</span>, а ' + B[1] + ' правильно обчислив <span class="num">' + bs + '</span>. Хто отримав <b>більшу</b> суму і на скільки?') + '</div>';
  }
}
function eqWhoMore(q){
  if(q.kind === 'whomore'){ const w = q.boy ? WM_BOYS[q.b] : WM_GIRLS[q.g]; return tr(w[0], w[1]) + ': ' + q.S + ' + ' + q.e + ' = ' + (q.S + q.e) + ' → +' + q.e; }
}
function whyWhoMore(q, full){
  if(q.kind === 'whomore'){
    if(!full) return tr('Сравни двата сбора число по число — не е нужно да ги пресмяташ.', 'Порівняй дві суми число за числом — обчислювати їх не треба.');
    const w = q.boy ? WM_BOYS[q.b] : WM_GIRLS[q.g], o = q.boy ? WM_GIRLS[q.g] : WM_BOYS[q.b];
    return tr(w[0] + ' събира същите числа като ' + o[0] + ' и още <b>' + q.e + '</b> &nbsp;→&nbsp; ' + q.S + ' и ' + (q.S + q.e) + ' &nbsp;→&nbsp; сборът на ' + w[0] + ' е по-голям ' + bgWith(q.e) + ' ' + q.e,
      w[1] + ' додає ті самі числа, що й ' + o[1] + ', і ще <b>' + q.e + '</b> &nbsp;→&nbsp; ' + q.S + ' і ' + (q.S + q.e) + ' &nbsp;→&nbsp; сума в ' + w[1] + ' більша на ' + q.e);
  }
}
KIND.whomore = { draw:drawWhoMore, eq:eqWhoMore, why:whyWhoMore };
