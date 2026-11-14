// Question kind 'monsters': level 414 Семействата чудовища — Ten different monsters in two families (two ovals): which group of three is from one family only.

// Кенгуру 2026, 2 клас, задача 8: five monsters in each of two ovals; of the five ovals of three monsters below, only A has all three in one
// family; each of the others has two from one family and one from the other. The monsters are system emoji drawn as SVG text. The answer is a picture
// (an oval of three), so the kind brings its own А–Д: the right oval has its three from one family, every other has two from one and one from the other.
import { KIND, shuffle, rnd, tr } from '../js/core.js';

// [emoji, Bulgarian, Ukrainian]
export const MON = [['👹', 'огър', 'огр'], ['👻', 'призрак', 'привид'], ['👽', 'извънземно', 'прибулець'], ['🤖', 'робот', 'робот'], ['🎃', 'тиква', 'гарбуз'], ['🦖', 'динозавър', 'динозавр'],
  ['🐙', 'октопод', 'восьминіг'], ['👾', 'космическо чудовище', 'космічний монстр'], ['🧟', 'зомби', 'зомбі'], ['🦑', 'калмар', 'кальмар'], ['🦇', 'прилеп', 'кажан'], ['🦂', 'скорпион', 'скорпіон']];
const FAMPOS = [[-34, -12], [-2, -28], [32, -10], [-18, 20], [22, 22]], OPTPOS = [[-27, -7], [25, -9], [-1, 19]];
export function genMonsters(){
  for(;;){
    const all = shuffle(MON.map((_, i) => i)).slice(0, 10), fam = [all.slice(0, 5), all.slice(5)];
    const key = (/** @type {number[]} */ t) => t.slice().sort((a, b) => a - b).join();
    const rf = rnd(2), right = shuffle(fam[rf].slice()).slice(0, 3), sets = [right], seen = new Set([key(right)]);
    for(let tries = 0; sets.length < 5 && tries < 200; tries++){
      const a = shuffle(fam[rnd(2)].slice()).slice(0, 2), b = shuffle(fam[0].includes(a[0]) ? fam[1].slice() : fam[0].slice())[0], t = shuffle(a.concat(b));
      if(!seen.has(key(t))){ seen.add(key(t)); sets.push(t); }
    }
    if(sets.length < 5) continue;
    const order = shuffle(sets.slice()), pick = order.indexOf(right);
    return {kind:'monsters', fam, options: order.map((t, id) => ({ id, v: id, text: ['<span class="vw">' + oval(t, 0) + '</span>', '<span class="vw">' + oval(t, 1) + '</span>'], mons: t })), pick, own: true, ans: pick};
  }
}
const names = (/** @type {number[]} */ t, /** @type {number} */ k) => t.map(i => MON[i][1 + k]).join(', ');
const mons = (/** @type {number[]} */ t, /** @type {number[][]} */ pos, /** @type {number} */ cx, /** @type {number} */ cy, /** @type {number} */ size) =>
  t.map((m, i) => '<text x="' + (cx + pos[i][0]) + '" y="' + (cy + pos[i][1] + size * 0.35) + '" text-anchor="middle" font-size="' + size + '">' + MON[m][0] + '</text>').join('');
/** an oval of three monsters, the way an answer shows it */
function oval(/** @type {number[]} */ t, /** @type {number} */ k){
  return '<svg viewBox="0 0 112 80" width="112" height="80" style="max-width:100%" role="img" aria-label="' + ['овал с чудовища: ', 'овал із чудовиськами: '][k] + names(t, k) + '">' +
    '<ellipse cx="56" cy="40" rx="52" ry="35" fill="var(--glass)" stroke="var(--fur-dark)" stroke-width="2.4"/>' + mons(t, OPTPOS, 56, 40, 24) + '</svg>';
}
function given(q){
  const tint = ['var(--wash1)', 'var(--wash2)'], line = ['var(--accent)', 'var(--warm)'];
  const g = q.fam.map((/** @type {number[]} */ f, k) => '<ellipse cx="' + (78 + k * 148) + '" cy="58" rx="70" ry="48" fill="' + tint[k] + '" stroke="' + line[k] + '" stroke-width="2.6"/>' + mons(f, FAMPOS, 78 + k * 148, 58, 26)).join('');
  return '<div class="given" style="text-align:center"><svg viewBox="0 0 304 116" style="display:block; width:330px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('две семейства чудовища: първото — ', 'дві родини чудовиськ: перша — ') + tr(names(q.fam[0], 0), names(q.fam[0], 1)) + tr('; второто — ', '; друга — ') + tr(names(q.fam[1], 0), names(q.fam[1], 1)) + '">' + g + '</svg></div>';
}
function drawMonsters(q){
  return '<div class="ask">' + tr('Десет различни чудовища са членове на две семейства, показани на картинката. <b>В кой от отговорите чудовищата са само от едното семейство?</b>',
    'Десять різних чудовиськ — члени двох родин, показаних на малюнку. <b>У якій із відповідей чудовиська лише з однієї родини?</b>') + '</div>' + given(q);
}
function eqMonsters(q){ return tr('и трите чудовища са от един и същ овал', 'усі три чудовиська з одного овала'); }
function whyMonsters(q, full){
  if(!full) return tr('Първо запомни кои чудовища са в първия овал и кои във втория. После във всеки отговор виж: и трите ли са от един и същ овал.', 'Спершу запам’ятай, які чудовиська в першому овалі, а які в другому. Потім у кожній відповіді глянь, чи всі три з одного овала.');
  const o = q.options[q.pick];
  return tr('Първо семейство: ', 'Перша родина: ') + q.fam[0].map((/** @type {number} */ m) => MON[m][0]).join(' ') + '<br>' + tr('Второ семейство: ', 'Друга родина: ') + q.fam[1].map((/** @type {number} */ m) => MON[m][0]).join(' ') + '<br>' +
    tr('Само в един отговор и трите са от едно семейство: ', 'Лише в одній відповіді всі три з однієї родини: ') + o.mons.map((/** @type {number} */ m) => MON[m][0]).join(' ');
}
KIND.monsters = { draw: drawMonsters, eq: eqMonsters, why: whyMonsters };
