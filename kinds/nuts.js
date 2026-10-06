// Question kind 'nuts': level 118 Катеричките — A share where each gets more than a few: the most one can get.

// МБГ Зима 2020, задача 11: four squirrels share 16 nuts, each more than 2. For one to get as many
// as possible the other three get as few as allowed — 3 each, 9 — and she gets 16 − 9 = 7.
import { KIND, SLOT, rnd, tr, ukN } from '../js/core.js';
export function genNuts(){
  for(;;){
    const k = 3 + rnd(3), m = 1 + rnd(4), T = k*(m + 1) + 2 + rnd(12);
    if(T > 40) continue;
    return {kind:'nuts', k, m, T, ans: T - (k - 1)*(m + 1)};
  }
}
// МБГ Полуфинал 2025, 1 клас, задача 18: five balloons for three children, each at least one — the most the
// child with the most can have? The other two get one each, 1 + 1 = 2, and she gets 5 − 2 = 3.
export function genNutsLeast(){
  const k = 3 + rnd(2), T = k + 2 + rnd(7);
  return {kind:'nuts', shape:'least', k, T, traps:[T - k, T - 1], ans: T - (k - 1)};
}
// the balloons in words, as the paper writes them
const LEAST_BG = {5:'Пет', 6:'Шест', 7:'Седем', 8:'Осем', 9:'Девет', 10:'Десет', 11:'Единадесет', 12:'Дванадесет'};
const LEAST_UK = {5:'П’ять', 6:'Шість', 7:'Сім', 8:'Вісім', 9:'Дев’ять', 10:'Десять', 11:'Одинадцять', 12:'Дванадцять'};
function drawNuts(q){
  if(q.shape === 'least'){
    return '<div class="ask">' + tr(LEAST_BG[q.T] + ' балона трябва да се раздадат на ' + (q.k === 3 ? 'три' : 'четири') + ' деца. Всяко дете трябва да получи <b>поне един</b> балон. Колко най-много балона може да има детето с най-голям брой балони?',
      LEAST_UK[q.T] + ' кульок треба роздати ' + (q.k === 3 ? 'трьом' : 'чотирьом') + ' дітям. Кожна дитина має отримати <b>щонайменше одну</b> кульку. Яку найбільшу кількість кульок може мати дитина, в якої кульок найбільше?') + '</div>' +
      '<div class="line xl">' + SLOT + '</div>';
  }
  return '<div class="ask">' + tr(({3:'Три', 4:'Четири', 5:'Пет'})[q.k] + ' катерички си разделили общо <span class="num">' + q.T + '</span> ореха, като всяка е получила <b>повече от ' + q.m + '</b> ' + (q.m === 1 ? 'орех' : 'ореха') + '. Колко е най-големият възможен брой орехи, който е получила катеричката с най-много орехи?',
    ({3:'Три', 4:'Чотири', 5:'П’ять'})[q.k] + (q.k === 5 ? ' білочок' : ' білочки') + ' поділили <span class="num">' + ukN(q.T, 'горіх', 'горіхи', 'горіхів').replace(' ', '</span> ') + ', і кожна отримала <b>більше ніж ' + q.m + '</b>. Яку найбільшу кількість горіхів могла отримати білочка, в якої горіхів найбільше?') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqNuts(q){
  if(q.shape === 'least') return q.T + ' − ' + Array(q.k - 1).fill(1).join(' − ') + ' = ' + q.ans;
  return q.T + ' − ' + (q.k - 1) + ' · ' + (q.m + 1) + ' = ' + q.ans;
}
function whyNuts(q, full){
  if(q.shape === 'least'){
    if(!full) return tr('За да има едно дете колкото може повече, другите трябва да получат колкото може по-малко.', 'Щоб одна дитина мала якомога більше, інші мають отримати якомога менше.');
    return tr('„поне един" &nbsp;→&nbsp; другите ' + (q.k - 1) + ' деца получават по 1: ', '«щонайменше одну» &nbsp;→&nbsp; інші ' + (q.k - 1) + ' дитини отримують по 1: ') +
      Array(q.k - 1).fill(1).join(' + ') + ' = <b>' + (q.k - 1) + '</b> &nbsp;→&nbsp; ' + q.T + ' − ' + (q.k - 1) + ' = ' + q.ans;
  }
  if(!full) return tr('За да получи едната възможно най-много, другите трябва да получат възможно най-малко.', 'Щоб одна отримала якомога більше, інші мають отримати якомога менше.');
  return tr('„повече от ' + q.m + '" значи поне ' + (q.m + 1) + ' &nbsp;→&nbsp; другите ', '«більше ніж ' + q.m + '» означає щонайменше ' + (q.m + 1) + ' &nbsp;→&nbsp; інші ') + (q.k - 1) + ': ' + (q.k - 1) + ' · ' + (q.m + 1) + ' = <b>' + (q.k - 1)*(q.m + 1) + '</b> &nbsp;→&nbsp; ' + q.T + ' − ' + (q.k - 1)*(q.m + 1) + ' = ' + q.ans;
}
KIND.nuts = { draw:drawNuts, eq:eqNuts, why:whyNuts };
