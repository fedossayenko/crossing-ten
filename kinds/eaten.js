// Question kind 'eaten': level 349 — so many left after some were eaten: how many were there (the story form of undoing steps).

// Кенгуру 2025, 2 клас, задача 8: 28 buns were left after the sister ate 5 and the brother 6: 28 + 5 + 6 = 39. The slip is the numbers
// taken away from what is left, or the buns left and one of the eaters only.
import { KIND, SLOT, rnd, tr } from '../js/core.js';
// [baker, Ukrainian baker, what (Bulgarian), baked (Bulgarian), what (Ukrainian), baked (Ukrainian)]
const EATEN = [['Мария', 'Марія', 'банички', 'изпекла', 'пиріжків', 'спекла'], ['Мая', 'Мая', 'курабии', 'изпекла', 'печива', 'спекла'], ['Лили', 'Лілі', 'питки', 'приготвила', 'коржиків', 'приготувала']];
const WHO = [['сестра ѝ', 'сестра'], ['брат ѝ', 'брат'], ['мама ѝ', 'мама']];
export function genEaten(){
  const e = rnd(EATEN.length), k = Math.random() < 0.3 ? 3 : 2, ate = Array.from({length: k}, () => 2 + rnd(8)), left = 12 + rnd(50), total = left + ate.reduce((s, v) => s + v, 0);
  return {kind:'eaten', e, k, ate, left, traps:[left - ate[0] - ate[1], left + ate[0]].filter(v => v > 0 && v !== total), ans: total};
}
function drawEaten(q){
  const E = EATEN[q.e], who = WHO.slice(0, q.k), a = q.ate.map(v => '<span class="num">' + v + '</span>');
  return '<div class="ask">' + tr('Колко ' + E[2] + ' е ' + E[3] + ' ' + E[0] + ', ако са останали <span class="num">' + q.left + '</span>, след като ' + who.map(w => w[0]).join(', ').replace(/, ([^,]*)$/, ' и $1') + ' хапнали съответно ' + a.join(', ').replace(/, ([^,]*)$/, ' и $1') + '?',
    'Скільки ' + E[4] + ' ' + E[5] + ' ' + E[1] + ', якщо залишилося <span class="num">' + q.left + '</span>, після того як ' + who.map(w => w[1]).join(', ').replace(/, ([^,]*)$/, ' і $1') + ' з’їли відповідно ' + a.join(', ').replace(/, ([^,]*)$/, ' і $1') + '?') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
// «5 и 6», «5, 6 и 3»: as the task itself joins them
const andList = (a, w) => a.slice(0, -1).join(', ') + ' ' + w + ' ' + a[a.length - 1];
function eqEaten(q){ return q.left + ' + ' + q.ate.join(' + ') + ' = ' + q.ans; }
function whyEaten(q, full){
  if(!full) return tr('Върни се назад: каквото са изяли, е било там преди това. Какво правим с останалите — събираме или вадим?', 'Повернись назад: те, що з’їли, було раніше. Що робимо із залишком — додаємо чи віднімаємо?');
  return tr('останали ' + q.left + ' и изядени ' + andList(q.ate, 'и') + ' — били са повече: ' + q.left + ' + ' + q.ate.join(' + ') + ' = <b>' + q.ans + '</b>', 'залишилося ' + q.left + ' і з’їли ' + andList(q.ate, 'та') + ' — було більше: ' + q.left + ' + ' + q.ate.join(' + ') + ' = <b>' + q.ans + '</b>');
}
KIND.eaten = { draw:drawEaten, eq:eqEaten, why:whyEaten };
