// Question kind 'blackpeter': level 344 — three players, the loser of each game doubles the others' chips: work back from the end.

// Кенгуру 2021, 2 клас, задача 26: Жоро, Пепи и Тошо; Жоро loses game 1, Пепи game 2, Тошо game 3; after it all have 8.
// Back from 8 8 8: Тошо lost, so the others had half before (4 4) and he had 8 + 4 + 4 = 16; then Пепи lost: Жоро 2, Тошо 8,
// Пепи 4 + 2 + 8 = 14; then Жоро lost: Пепи 7, Тошо 4, Жоро 2 + 7 + 4 = 13. The losers are asked in any order, 8 or 16 chips each at the end
// (halved three times without a fraction).
import { KIND, SLOT, rnd, shuffle, tr } from '../js/core.js';
// names: [Bulgarian, Ukrainian], f: feminine
const BP_NAMES = [{ f:false, n:[['Жоро', 'Жоро'], ['Пепи', 'Пепі'], ['Тошо', 'Тошо']] }, { f:true, n:[['Ани', 'Аня'], ['Мая', 'Мая'], ['Яна', 'Яна']] }];
const BP_BG = ['първата', 'втората', 'третата'], BP_UK = ['першу', 'другу', 'третю'];
// the states before each game, back from the end (8 or 16 at the end halves three times without a fraction, in any order): stages[0] = at the start … stages[3] = at the end (arrays of three)
export function bpStages(order, e){
  const stages = [[e, e, e]];
  for(let g = 2; g >= 0; g--){
    const after = stages[0], L = order[g], before = after.map(v => v / 2);
    before[L] = after[L] + after.reduce((s, v, i) => i === L ? s : s + v / 2, 0);
    stages.unshift(before);
  }
  return stages;
}
export function genBlackPeter(){
  const set = rnd(BP_NAMES.length), order = shuffle([0, 1, 2]), e = [8, 16][rnd(2)], who = rnd(3), stages = bpStages(order, e);
  return {kind:'blackpeter', set, order, e, who, stages, traps:[e, 3*e / 2].filter(v => v !== stages[0][who]), ans: stages[0][who]};
}
function drawBlackPeter(q){
  const S = BP_NAMES[q.set], f = S.f;
  const a = f ? 'а' : '';
  const bg = S.n.map(x => x[0]), uk = S.n.map(x => x[1]);
  return '<div class="ask">' + tr(bg[0] + ', ' + bg[1] + ' и ' + bg[2] + ' играят на „Черен Петър“ с жетони. Този, който загуби играта, дава на другите двама толкова жетона, колкото всеки от тях има в момента. ' +
    q.order.map((p, g) => bg[p] + ' загубил' + a + ' ' + BP_BG[g] + ' игра').join(', ') + '. След третата игра всеки от тримата имал по <span class="num">' + q.e + '</span> жетона. Колко жетона е имал' + a + ' ' + bg[q.who] + ' първоначално?',
    uk[0] + ', ' + uk[1] + ' і ' + uk[2] + ' грають у «Чорного Петра» на жетони. Той, хто програє гру, дає двом іншим стільки жетонів, скільки зараз має кожен із них. ' +
    q.order.map((p, g) => uk[p] + ' ' + (f ? 'програла' : 'програв') + ' ' + BP_UK[g] + ' гру').join(', ') + '. Після третьої гри в кожного з трьох стало по <span class="num">' + q.e + '</span> жетонів. Скільки жетонів ' + (f ? 'мала' : 'мав') + ' ' + uk[q.who] + ' спочатку?') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqBlackPeter(q){ return q.stages.map(s => s.join(' ')).join(' ← ') + ' → ' + q.ans; }
function whyBlackPeter(q, full){
  if(!full) return tr('Върви назад от края. Който е загубил играта, е дал на другите двама — те са удвоили жетоните си. Колко са имали преди това?', 'Іди назад від кінця. Той, хто програв, дав двом іншим — вони подвоїли свої жетони. Скільки було в них перед цим?');
  const S = BP_NAMES[q.set], nm = i => tr(S.n[i][0], S.n[i][1]), st = q.stages;
  let out = tr('в края: ', 'наприкінці: ') + st[3].join(', ');
  for(let g = 2; g >= 0; g--){
    const L = q.order[g], b = st[g], a = st[g + 1], half = a.filter((_, i) => i !== L).map(v => v / 2);
    out += '<br>' + tr('преди ' + (g + 1) + '-та игра (' + nm(L) + ' губи): ', 'перед ' + (g + 1) + '-ю грою (' + nm(L) + ' програє): ') +
      b.map((v, i) => nm(i) + ' ' + (i === L ? a[L] + ' + ' + half.join(' + ') + ' = <b>' + v + '</b>' : v)).join(', ');
  }
  return out + '<br>' + tr('отначало ', 'спочатку ') + nm(q.who) + ': <b>' + q.ans + '</b>';
}
KIND.blackpeter = { draw:drawBlackPeter, eq:eqBlackPeter, why:whyBlackPeter };
