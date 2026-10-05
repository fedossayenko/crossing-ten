// Question kind 'blind': level 189 Със затворени очи — The fewest cubes to take blind to be sure.

// МБГ Пролет 2021, 1 клас, задача 20: 2 blue, 3 green and 4 yellow cubes; eyes closed, how few to take to be
// sure of two of different colours? The unluckiest hand takes all 4 yellow first — still one colour — and
// the next one cannot be yellow: 4 + 1 = 5. Asked the other way, two of the SAME colour: one of each
// colour first, 3 cubes, and the 4th must repeat one.
// [Bulgarian plural, Ukrainian plural for 2–4, Ukrainian plural for 5 and more, colour]
/** @type {[string, string, string, string][]} */
import { KIND, SLOT, rnd, shuffle, tr, ukN } from '../js/core.js';
const BLIND_COLS = [['сини', 'сині', 'синіх', 'var(--accent)'], ['зелени', 'зелені', 'зелених', 'var(--good)'], ['жълти', 'жовті', 'жовтих', 'var(--lemon)'], ['червени', 'червоні', 'червоних', 'var(--rose)']];
export function genBlind(){
  for(;;){
    const k = 2 + rnd(2), cols = shuffle([0, 1, 2, 3]).slice(0, k), n = cols.map(() => 2 + rnd(5)), T = n.reduce((t, v) => t + v, 0);
    if(T > 12 || new Set(n).size !== k) continue;
    const diff = Math.random() < 0.6, most = Math.max(...n);
    return {kind:'blind', cols, n, T, diff, traps: diff ? [most, k + 1] : [k, Math.max(...n) + 1], ans: diff ? most + 1 : k + 1};
  }
}
// the cubes, a row for each colour
function blindSvg(q){
  let g = '';
  q.n.forEach((c, r) => { for(let i = 0; i < c; i++) g += '<rect x="' + (4 + i*26) + '" y="' + (4 + r*26) + '" width="22" height="22" rx="4" fill="' + BLIND_COLS[q.cols[r]][3] + '" stroke="var(--ink)" stroke-width="1.2"/>'; });
  const w = 8 + 26*Math.max(...q.n), h = 8 + 26*q.n.length;
  return '<div class="fig small"><svg viewBox="0 0 ' + w + ' ' + h + '" style="max-width:' + Math.round(w*1.1) + 'px" role="img" aria-label="' + tr('кубчетата по цветове', 'кубики за кольорами') + '">' + g + '</svg></div>';
}
const blindList = q => tr(q.n.map((c, i) => c + ' ' + BLIND_COLS[q.cols[i]][0]).join(', ').replace(/, ([^,]*)$/, ' и $1'),
  q.n.map((c, i) => c + ' ' + BLIND_COLS[q.cols[i]][c < 5 ? 1 : 2]).join(', ').replace(/, ([^,]*)$/, ' і $1'));
function drawBlind(q){
  return '<div class="ask">' + tr('Имам <span class="num">' + q.T + '</span> еднакви по големина кубчета – ' + blindList(q) + '. Колко <b>най-малко</b> кубчета трябва да взема със затворени очи, за да имам <b>със сигурност</b> две кубчета ' + (q.diff ? 'с <b>различен</b> цвят' : 'с <b>еднакъв</b> цвят') + '?',
    'У мене ' + ukN(q.T, 'однаковий за розміром кубик', 'однакові за розміром кубики', 'однакових за розміром кубиків').replace(/^(\d+)/, '<span class="num">$1</span>') + ' – ' + blindList(q) +
    '. Яку <b>найменшу</b> кількість кубиків треба взяти із заплющеними очима, щоб <b>точно</b> мати два кубики ' + (q.diff ? '<b>різного</b> кольору' : '<b>однакового</b> кольору') + '?') + '</div>' +
    blindSvg(q) + '<div class="line xl">' + SLOT + '</div>';
}
function eqBlind(q){
  return q.diff ? Math.max(...q.n) + ' + 1 = ' + q.ans : q.n.length + ' + 1 = ' + q.ans;
}
function whyBlind(q, full){
  if(!full) return tr('Помисли за най-лошия случай: какво може да вземеш, преди да стане сигурно?', 'Подумай про найгірший випадок: що можна витягти, перш ніж стане точно відомо?');
  const most = Math.max(...q.n), c = BLIND_COLS[q.cols[q.n.indexOf(most)]];
  return q.diff
    ? tr('най-лошото: първо вземаш всичките ' + most + ' ' + c[0] + ' — още са от един цвят; следващото не може да е от тях', 'найгірше: спершу береш усі ' + most + ' ' + (most < 5 ? c[1] : c[2]) + ' — вони ще одного кольору; наступний уже іншого') + ' &nbsp;→&nbsp; ' + most + ' + 1 = ' + q.ans
    : tr('най-лошото: по едно от всеки цвят — ' + q.n.length + ' различни; следващото повтаря цвят', 'найгірше: по одному кожного кольору — ' + q.n.length + ' різні; наступний повторює колір') + ' &nbsp;→&nbsp; ' + q.n.length + ' + 1 = ' + q.ans;
}
KIND.blind = { draw:drawBlind, eq:eqBlind, why:whyBlind };
