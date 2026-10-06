// Question kind 'blind': level 189 Със затворени очи — The fewest cubes to take blind to be sure.

// МБГ Пролет 2021, 1 клас, задача 20: 2 blue, 3 green and 4 yellow cubes; eyes closed, how few to take to be
// sure of two of different colours? The unluckiest hand takes all 4 yellow first — still one colour — and
// the next one cannot be yellow: 4 + 1 = 5. Asked the other way, two of the SAME colour: one of each
// colour first, 3 cubes, and the 4th must repeat one.
// [Bulgarian plural, Ukrainian plural for 2–4, Ukrainian plural for 5 and more, colour]
/** @type {[string, string, string, string][]} */
import { BGNUM, KIND, SLOT, UKNUM_F, popAt, rnd, shuffle, svgText, tr, ukN } from '../js/core.js';
const BLIND_COLS = [['сини', 'сині', 'синіх', 'var(--accent)'], ['зелени', 'зелені', 'зелених', 'var(--good)'], ['жълти', 'жовті', 'жовтих', 'var(--lemon)'], ['червени', 'червоні', 'червоних', 'var(--rose)']];
// МБГ Полуфинал 2022, 1 клас, задача 13: of five pens alike in size and colour, two write in blue and three in red;
// how many to take to be sure one writes in blue? The unluckiest hand is the three red ones first, so 3 + 1 = 4 —
// and all five are sure too: «Посочете всички възможни отговори!» wants 4 and 5. One ink's t pens and the
// other's o: every count from o + 1 to t + o, a box for each.
// [Bulgarian «пише в …», Ukrainian «пише …», colour]
const BLIND_INK = [['синьо', 'синім', 'var(--accent)'], ['червено', 'червоним', 'var(--bad)'], ['зелено', 'зеленим', 'var(--good)'], ['черно', 'чорним', 'var(--ink)']];
const BLIND_BG = Object.assign({}, BGNUM, {2:'два'}), BLIND_UK_OF = {4:'чотирьох', 5:'п’яти', 6:'шести', 7:'семи'};   // «два химикала», «з п’яти ручок»
function genBlindOne(){
  const t = 2 + rnd(2), o = 2 + rnd(6 - t), T = t + o, sure = [];
  for(let v = o + 1; v <= T; v++) sure.push(v);
  return {kind:'blind', shape:'one', cols: shuffle([0, 1, 2, 3]).slice(0, 2), n:[t, o], T, slots: t, ans: sure[0], alt: sure.slice(1)};
}
export function genBlind(){
  for(;;){
    const k = 2 + rnd(2), cols = shuffle([0, 1, 2, 3]).slice(0, k), n = cols.map(() => 2 + rnd(5)), T = n.reduce((t, v) => t + v, 0);
    if(T > 12 || new Set(n).size !== k) continue;
    const diff = Math.random() < 0.6, most = Math.max(...n);
    const q = {kind:'blind', cols, n, T, diff, traps: diff ? [most, k + 1] : [k, Math.max(...n) + 1], ans: diff ? most + 1 : k + 1};
    // the pens, drawn after the cubes, so a question about cubes keeps its seed
    return Math.random() < 0.2 ? genBlindOne() : q;
  }
}
// The pens standing in a row, all alike; full colours each by its ink, the other ink first (the unluckiest
// hand), and numbers them: from the first of the asked ink on, every count is sure.
function blindPens(q, full){
  const [t, o] = q.n;
  let g = '';
  for(let i = 0; i < q.T; i++){
    const x = 4 + i*24, ink = !full ? 'var(--muted)' : BLIND_INK[q.cols[i < o ? 1 : 0]][2];
    g += '<g' + (full ? popAt(1 + i*0.5) : '') + '><rect x="' + (x + 3) + '" y="2" width="10" height="16" rx="3" fill="' + ink + '" stroke="var(--ink)" stroke-width="1.1"/>' +
      '<rect x="' + (x + 2) + '" y="16" width="12" height="44" rx="3" fill="var(--solid)" stroke="var(--ink)" stroke-width="1.2"/>' +
      '<path d="M' + (x + 2) + ' 60L' + (x + 8) + ' 74L' + (x + 14) + ' 60Z" fill="var(--warmbg)" stroke="var(--ink)" stroke-width="1.1"/>' +
      '<path d="M' + (x + 6) + ' 69L' + (x + 8) + ' 75L' + (x + 10) + ' 69Z" fill="' + ink + '"/>' +
      (full ? svgText(x + 8, 90, i + 1, 12, i < o ? 'var(--muted)' : 'var(--warm)') : '') + '</g>';
  }
  const w = 8 + 24*q.T, h = full ? 96 : 80;
  return '<div class="fig small"><svg viewBox="0 0 ' + w + ' ' + h + '" style="max-width:' + Math.round(w*1.2) + 'px" role="img" aria-label="' + tr('еднаквите химикали', 'однакові ручки') + '">' + g + '</svg></div>';
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
  if(q.shape === 'one'){
    const [t, o] = q.n, a = BLIND_INK[q.cols[0]], b = BLIND_INK[q.cols[1]];
    const boxes = [q.ans].concat(q.alt).map((_, i) => i ? ', <span class="slot" id="slot' + i + '"></span>' : SLOT).join('');
    return '<div class="ask">' + tr('От ' + BLIND_BG[q.T] + ' еднакви по размер и цвят химикала ' + BLIND_BG[t] + ' пишат в ' + a[0] + ', а ' + BLIND_BG[o] + ' в ' + b[0] + '. Колко химикала трябва да взема, за да съм <b>сигурен</b>, че един от тях пише в ' + a[0] + '? Посочете <b>всички</b> възможни отговори!',
      'З ' + BLIND_UK_OF[q.T] + ' однакових за розміром і кольором ручок ' + UKNUM_F[t] + ' пишуть ' + a[1] + ', а ' + UKNUM_F[o] + ' — ' + b[1] + '. Скільки ручок мені треба взяти, щоб <b>точно</b> одна з них писала ' + a[1] + '? Укажіть <b>усі</b> можливі відповіді!') + '</div>' +
      blindPens(q, false) + '<div class="line md">' + boxes + '</div>';
  }
  return '<div class="ask">' + tr('Имам <span class="num">' + q.T + '</span> еднакви по големина кубчета – ' + blindList(q) + '. Колко <b>най-малко</b> кубчета трябва да взема със затворени очи, за да имам <b>със сигурност</b> две кубчета ' + (q.diff ? 'с <b>различен</b> цвят' : 'с <b>еднакъв</b> цвят') + '?',
    'У мене ' + ukN(q.T, 'однаковий за розміром кубик', 'однакові за розміром кубики', 'однакових за розміром кубиків').replace(/^(\d+)/, '<span class="num">$1</span>') + ' – ' + blindList(q) +
    '. Яку <b>найменшу</b> кількість кубиків треба взяти із заплющеними очима, щоб <b>точно</b> мати два кубики ' + (q.diff ? '<b>різного</b> кольору' : '<b>однакового</b> кольору') + '?') + '</div>' +
    blindSvg(q) + '<div class="line xl">' + SLOT + '</div>';
}
function eqBlind(q){
  if(q.shape === 'one') return q.n[1] + ' + 1 = ' + q.ans + ' → ' + [q.ans].concat(q.alt).join(', ');
  return q.diff ? Math.max(...q.n) + ' + 1 = ' + q.ans : q.n.length + ' + 1 = ' + q.ans;
}
function whyBlind(q, full){
  if(q.shape === 'one'){
    if(!full) return tr('Помисли за най-лошия случай: колко химикала може да вземеш, без нито един да пише в ' + BLIND_INK[q.cols[0]][0] + '? И ако вземеш още, пак ли е сигурно?',
      'Подумай про найгірший випадок: скільки ручок можна взяти так, щоб жодна не писала ' + BLIND_INK[q.cols[0]][1] + '? А якщо взяти ще, теж точно?');
    const [, o] = q.n, a = BLIND_INK[q.cols[0]], b = BLIND_INK[q.cols[1]];
    return blindPens(q, true) + tr('най-лошото: първо вземаш всичките ' + o + ', които пишат в ' + b[0] + '; следващият пише в ' + a[0], 'найгірше: спершу береш усі ' + o + ', що пишуть ' + b[1] + '; наступна вже пише ' + a[1]) +
      ' &nbsp;→&nbsp; ' + o + ' + 1 = ' + q.ans + tr('; и с повече е сигурно: ', '; і з більшою кількістю теж точно: ') + [q.ans].concat(q.alt).join(', ');
  }
  if(!full) return tr('Помисли за най-лошия случай: какво може да вземеш, преди да стане сигурно?', 'Подумай про найгірший випадок: що можна витягти, перш ніж стане точно відомо?');
  const most = Math.max(...q.n), c = BLIND_COLS[q.cols[q.n.indexOf(most)]];
  return q.diff
    ? tr('най-лошото: първо вземаш всичките ' + most + ' ' + c[0] + ' — още са от един цвят; следващото не може да е от тях', 'найгірше: спершу береш усі ' + most + ' ' + (most < 5 ? c[1] : c[2]) + ' — вони ще одного кольору; наступний уже іншого') + ' &nbsp;→&nbsp; ' + most + ' + 1 = ' + q.ans
    : tr('най-лошото: по едно от всеки цвят — ' + q.n.length + ' различни; следващото повтаря цвят', 'найгірше: по одному кожного кольору — ' + q.n.length + ' різні; наступний повторює колір') + ' &nbsp;→&nbsp; ' + q.n.length + ' + 1 = ' + q.ans;
}
KIND.blind = { draw:drawBlind, eq:eqBlind, why:whyBlind };
