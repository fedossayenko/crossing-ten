// Question kind 'together': level 292 Едновременно — Things done all at once take as long as one; one after another, the times add up.

// Аз и числата 2026, 2 клас, задача 10: an egg boils in 6 minutes — 5 eggs boiled at the same time are done in 6
// minutes too, not 5 · 6 = 30 (the paper's other options are 30 and 15). Shirts drying on a line are the same story.
// So that the word is read and not guessed, some eggs go into the pot one after another: then the minutes add up.
import { KIND, SLOT, UK_PLURAL, rnd, tr } from '../js/core.js';
const togUk = (n, one, few, many) => n + ' ' + ({one, few}[UK_PLURAL.select(n)] || many);
export function genTogether(){
  if(Math.random() < 0.3){
    const n = 2 + rnd(2), t = 3 + rnd(4);   // within 20: added up, no times table
    return {kind:'together', shape:'one', n, t, traps:[t, n + t], ans: n*t};
  }
  const shirts = Math.random() < 0.35, n = 2 + rnd(8), t = shirts ? 2 + rnd(5) : 3 + rnd(8);
  return {kind:'together', shape: shirts ? 'shirts' : 'eggs', n, t, traps:[n*t, n + t], ans: t};
}
const num = x => '<span class="num">' + x + '</span>';
function drawTogether(q){
  if(q.shape === 'shirts') return '<div class="ask">' + tr('Една риза изсъхва на простора за ' + num(q.t) + ' часа. За колко часа ще изсъхнат ' + num(q.n) + ' ризи, ако съхнат едновременно?',
      'Одна сорочка висихає на мотузці за ' + num(q.t) + ' ' + togUk(q.t, 'годину', 'години', 'годин').replace(/^\d+ /, '') + '. За скільки годин висохнуть ' + num(q.n) + ' ' +
      togUk(q.n, 'сорочка', 'сорочки', 'сорочок').replace(/^\d+ /, '') + ', якщо вони сохнуть одночасно?') + '</div>' +
    '<div class="line xl">' + SLOT + ' <span class="unit">' + tr('часа', 'год') + '</span></div>';
  const how = q.shape === 'one' ? tr('едно след друго — щом едното се свари, слагат следващото', 'одне за одним — щойно одне звариться, кладуть наступне') : tr('едновременно', 'одночасно');
  return '<div class="ask">' + tr('Едно яйце се сварява за ' + num(q.t) + ' минути. За колко минути ще се сварят ' + num(q.n) + ' яйца, ако се варят ' + how + '?',
    'Одне яйце варится ' + num(q.t) + ' ' + togUk(q.t, 'хвилину', 'хвилини', 'хвилин').replace(/^\d+ /, '') + '. За скільки хвилин зваряться ' + num(q.n) + ' ' +
    togUk(q.n, 'яйце', 'яйця', 'яєць').replace(/^\d+ /, '') + ', якщо їх варити ' + how + '?') + '</div>' +
    '<div class="line xl">' + SLOT + ' <span class="unit">' + tr('мин', 'хв') + '</span></div>';
}
function eqTogether(q){
  if(q.shape === 'one') return Array(q.n).fill(q.t).join(' + ') + ' = ' + q.ans;
  return tr(q.shape === 'shirts' ? 'заедно: колкото една риза, ' : 'заедно: колкото едно яйце, ', q.shape === 'shirts' ? 'разом: як одна сорочка, ' : 'разом: як одне яйце, ') + q.ans;
}
function whyTogether(q, full){
  if(q.shape === 'one'){
    if(!full) return tr('Яйцата се варят едно след друго: следващото чака, докато се свари предишното. Времената им се събират.',
      'Яйця варяться одне за одним: наступне чекає, доки звариться попереднє. Їхній час додається.');
    return tr('всяко яйце по ' + q.t + ' минути, едно след друго', 'кожне яйце по ' + q.t + ' хв, одне за одним') + ' &nbsp;→&nbsp; ' + eqTogether(q);
  }
  const shirts = q.shape === 'shirts';
  if(!full) return shirts ? tr('Всички ризи висят на простора по едно и също време. Една от друга ли чакат?', 'Усі сорочки висять на мотузці в один і той самий час. Хіба вони чекають одна на одну?')
    : tr('Всички яйца са в тенджерата по едно и също време. Едно от друго ли чакат?', 'Усі яйця в каструлі в один і той самий час. Хіба вони чекають одне на одне?');
  return shirts ? tr('ризите съхнат заедно, а не една след друга: всичките изсъхват за толкова, за колкото и една — за ', 'сорочки сохнуть разом, а не одна за одною: усі висихають за стільки ж, за скільки й одна, — за ') + q.t + tr(' часа', ' год')
    : tr('яйцата се варят заедно, а не едно след друго: всичките са готови за толкова, за колкото и едно — за ', 'яйця варяться разом, а не одне за одним: усі готові за стільки ж, за скільки й одне, — за ') + q.t + tr(' минути', ' хв');
}
KIND.together = { draw:drawTogether, eq:eqTogether, why:whyTogether };
