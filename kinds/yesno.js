// Question kind 'yesno': level 285 Вярно ли е? — One statement about a number or a perimeter, ДА or НЕ.

// Аз и числата 2025, задача 2: «За числото 100 е вярно, че: е двуцифрено число ДА НЕ …» — six statements,
// each its own question here. 100 is трицифрено and the smallest such; it has 1 стотица, 0 десетици and
// 0 единици, so «има 1 единица» is НЕ: the 1 is a стотица. Аз и числата 2022, задача 9, asks the same of 99.
// Аз и числата 2023, задача 8: can a rectangle's perimeter be found from its two opposite sides alone? НЕ —
// they are equal, so the other side is still missing. A square's from one side? ДА — all four are equal.
// A word cannot be typed, so this kind brings its own two options; ans is the right one's id.
import { KIND, rnd, tr, ukN } from '../js/core.js';
const YN_PROPS = ['one', 'two', 'three', 'max1', 'min2', 'max2', 'min3', 'ones', 'tens', 'hund'];
/** @type {() => { id: number, v: number, text: [string, string] }[]} */
const YN_OPTS = () => [{ id:0, v:0, text:['ДА', 'ТАК'] }, { id:1, v:1, text:['НЕ', 'НІ'] }];
// [figure, its Ukrainian genitive, what is given, in Ukrainian, can it be found, why, why in Ukrainian]
/** @type {[string, string, string, string, boolean, string, string][]} */
const YN_PERIM = [
  ['правоъгълник', 'прямокутника', 'са дадени само двете срещуположни страни', 'дано лише дві протилежні сторони', false,
    'срещуположните страни на правоъгълника са равни: двете дадени са една и съща дължина, а другата страна не я знаем', 'протилежні сторони прямокутника рівні: дві дані — це та сама довжина, а іншої сторони ми не знаємо'],
  ['квадрат', 'квадрата', 'е дадена само една от страните', 'дано лише одну зі сторін', true,
    'всички страни на квадрата са равни: обиколката е четири пъти дадената страна', 'усі сторони квадрата рівні: периметр — це чотири дані сторони'],
  ['правоъгълник', 'прямокутника', 'са дадени две съседни страни', 'дано дві сусідні сторони', true,
    'срещуположните страни са равни, а двете различни дължини са дадени', 'протилежні сторони рівні, а обидві різні довжини дано'],
  ['правоъгълник', 'прямокутника', 'е дадена само една от страните', 'дано лише одну зі сторін', false,
    'знаем само едната дължина, а другата страна може да е всякаква', 'ми знаємо лише одну довжину, а інша сторона може бути будь-якою'],
  ['равностранен триъгълник', 'рівностороннього трикутника', 'е дадена само една от страните', 'дано лише одну зі сторін', true,
    'трите страни на равностранния триъгълник са равни', 'усі три сторони рівностороннього трикутника рівні'],
  ['триъгълник с три различни страни', 'трикутника з трьома різними сторонами', 'са дадени само две от страните', 'дано лише дві сторони', false,
    'третата страна е различна и не я знаем', 'третя сторона інша, і ми її не знаємо'],
  ['равнобедрен триъгълник', 'рівнобедреного трикутника', 'са дадени бедрото и основата', 'дано бічну сторону й основу', true,
    'двете бедра са равни, така че знаем и трите страни', 'обидві бічні сторони рівні, тож ми знаємо всі три сторони'],
  ['квадрат', 'квадрата', 'са дадени само двете срещуположни страни', 'дано лише дві протилежні сторони', true,
    'всички страни на квадрата са равни, така че една дадена стига', 'усі сторони квадрата рівні, тож однієї даної досить'],
  ['равнобедрен триъгълник', 'рівнобедреного трикутника', 'е дадена само основата', 'дано лише основу', false,
    'бедрата не са дадени и могат да са всякакви', 'бічних сторін не дано, і вони можуть бути будь-якими']
];
const ynDigit = (N, p) => p === 'ones' ? N % 10 : p === 'tens' ? Math.floor(N / 10) % 10 : Math.floor(N / 100) % 10;
function ynTrue(N, p, k){
  if(p === 'one') return N <= 9;
  if(p === 'two') return N >= 10 && N <= 99;
  if(p === 'three') return N >= 100 && N <= 999;
  if(p === 'max1') return N === 9;
  if(p === 'min2') return N === 10;
  if(p === 'max2') return N === 99;
  if(p === 'min3') return N === 100;
  return ynDigit(N, p) === k;
}
export function genYesNo(){
  if(Math.random() < 0.25){
    const f = rnd(YN_PERIM.length), yes = YN_PERIM[f][4];
    return {kind:'yesno', shape:'perim', f, yes, options: YN_OPTS(), pick: yes ? 0 : 1, own: true, ans: yes ? 0 : 1};
  }
  // 9, 10, 99, 100 and 101 sit at the edges the statements are about; any other one- or two-digit number now and then
  const N = Math.random() < 0.65 ? [9, 10, 99, 100, 101][rnd(5)] : Math.random() < 0.3 ? 1 + rnd(8) : 11 + rnd(88);
  const ps = YN_PROPS.filter(p => (p !== 'tens' || N >= 10) && (p !== 'hund' || N >= 100)), p = ps[rnd(ps.length)];
  let k;
  if(p === 'ones' || p === 'tens' || p === 'hund'){
    // half the time the right digit; otherwise another digit of the number (the 1 of 100 as its ones) or one off
    const d = ynDigit(N, p), wrong = [...new Set(String(N).split('').map(Number).concat([d - 1, d + 1]))].filter(v => v !== d && v >= 0 && v <= 9);
    k = Math.random() < 0.5 ? d : wrong[rnd(wrong.length)];
  }
  const yes = ynTrue(N, p, k);
  return Object.assign({kind:'yesno', shape:'num', N, p}, k === undefined ? {} : {k}, {yes, options: YN_OPTS(), pick: yes ? 0 : 1, own: true, ans: yes ? 0 : 1});
}
const YN_BG = {one:'е едноцифрено число', two:'е двуцифрено число', three:'е трицифрено число', max1:'е най-голямото едноцифрено число',
  min2:'е най-малкото двуцифрено число', max2:'е най-голямото двуцифрено число', min3:'е най-малкото трицифрено число'};
const YN_UK = {one:'є одноцифровим числом', two:'є двоцифровим числом', three:'є трицифровим числом', max1:'є найбільшим одноцифровим числом',
  min2:'є найменшим двоцифровим числом', max2:'є найбільшим двоцифровим числом', min3:'є найменшим трицифровим числом'};
// a count of a place: 1 единица, 0 единици; in Ukrainian after «має»: 1 одиницю, 2 одиниці, 0 одиниць
const YN_PLACE = {ones:['единица', 'единици', 'одиницю', 'одиниці', 'одиниць', 'одиниця'], tens:['десетица', 'десетици', 'десяток', 'десятки', 'десятків', 'десяток'],
  hund:['стотица', 'стотици', 'сотню', 'сотні', 'сотень', 'сотня']};
const ynPlaceBg = (n, p) => n + ' ' + YN_PLACE[p][n === 1 ? 0 : 1];
const ynStatement = q => YN_BG[q.p] ? tr(YN_BG[q.p], YN_UK[q.p]) :
  tr('има ' + ynPlaceBg(q.k, q.p), 'має ' + ukN(q.k, YN_PLACE[q.p][2], YN_PLACE[q.p][3], YN_PLACE[q.p][4]));
const ynVerdict = q => q.yes ? tr('ДА', 'ТАК') : tr('НЕ', 'НІ');
function drawYesNo(q){
  if(q.shape === 'perim'){
    const s = YN_PERIM[q.f];
    return '<div class="ask">' + tr('Може ли да се намери обиколката на ' + s[0] + ', ако <b>' + s[2] + '</b>?', 'Чи можна знайти периметр ' + s[1] + ', якщо <b>' + s[3] + '</b>?') + '</div>';
  }
  return '<div class="ask">' + tr('Вярно ли е, че числото <span class="num">' + q.N + '</span> <b>' + ynStatement(q) + '</b>?',
    'Чи правда, що число <span class="num">' + q.N + '</span> <b>' + ynStatement(q) + '</b>?') + '</div>';
}
function eqYesNo(q){
  if(q.shape === 'perim') return tr('обиколката на ' + YN_PERIM[q.f][0], 'периметр ' + YN_PERIM[q.f][1]) + ': ' + tr(YN_PERIM[q.f][2], YN_PERIM[q.f][3]) + ' → ' + ynVerdict(q);
  return q.N + ' ' + ynStatement(q) + ' → ' + ynVerdict(q);
}
// the number taken apart into its places, as many as it has: 100 = 1 стотица, 0 десетици и 0 единици
function ynParts(N){
  const ps = N >= 100 ? ['hund', 'tens', 'ones'] : N >= 10 ? ['tens', 'ones'] : ['ones'];
  const bg = ps.map(p => ynPlaceBg(ynDigit(N, p), p)), uk = ps.map(p => ukN(ynDigit(N, p), YN_PLACE[p][5], YN_PLACE[p][3], YN_PLACE[p][4]));
  const join = (a, and) => a.length < 2 ? a[0] : a.slice(0, -1).join(', ') + and + a[a.length - 1];
  return N + ' = ' + tr(join(bg, ' и '), join(uk, ' і '));
}
function whyYesNo(q, full){
  if(q.shape === 'perim'){
    if(!full) return tr('Обиколката е сборът от всички страни. Кои страни на тази фигура са равни — и знаем ли всяка дължина?',
      'Периметр — це сума всіх сторін. Які сторони цієї фігури рівні — і чи знаємо ми кожну довжину?');
    return tr(YN_PERIM[q.f][5], YN_PERIM[q.f][6]) + ' &nbsp;→&nbsp; <b>' + ynVerdict(q) + '</b>';
  }
  const kind = ['one', 'two', 'three'].indexOf(q.p), edge = {max1:9, min2:10, max2:99, min3:100}[q.p];
  if(!full){
    if(kind >= 0) return tr('Преброй с колко цифри се записва числото.', 'Порахуй, скількома цифрами записується число.');
    if(edge !== undefined) return tr('Кои са най-малкото и най-голямото число със същия брой цифри?', 'Які найменше й найбільше числа з такою самою кількістю цифр?');
    return tr('Разложи числото: колко стотици, десетици и единици има в него?', 'Розклади число: скільки в ньому сотень, десятків і одиниць?');
  }
  if(kind >= 0){
    const n = String(q.N).length;
    return tr(q.N + ' се записва с ' + n + ' ' + (n === 1 ? 'цифра' : 'цифри') + ': то е <b>' + ['едноцифрено', 'двуцифрено', 'трицифрено'][n - 1] + '</b> число',
      q.N + ' записується ' + ukN(n, 'цифрою', 'цифрами', 'цифрами') + ': це <b>' + ['одноцифрове', 'двоцифрове', 'трицифрове'][n - 1] + '</b> число') + ' &nbsp;→&nbsp; <b>' + ynVerdict(q) + '</b>';
  }
  if(edge !== undefined){
    const bg = {max1:'най-голямото едноцифрено', min2:'най-малкото двуцифрено', max2:'най-голямото двуцифрено', min3:'най-малкото трицифрено'}[q.p],
      uk = {max1:'найбільше одноцифрове', min2:'найменше двоцифрове', max2:'найбільше двоцифрове', min3:'найменше трицифрове'}[q.p];
    return tr(bg + ' число е <b>' + edge + '</b>', uk + ' число — <b>' + edge + '</b>') + ' &nbsp;→&nbsp; <b>' + ynVerdict(q) + '</b>';
  }
  return ynParts(q.N) + ' &nbsp;→&nbsp; <b>' + ynVerdict(q) + '</b>';
}
KIND.yesno = { draw:drawYesNo, eq:eqYesNo, why:whyYesNo };
