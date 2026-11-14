// Question kind 'cupsets': level 412 Чаши и чинийки — Cups and saucers with numbers on them: how many sets (a cup and the saucer with the same number).

// Кенгуру 2019, 2 клас, задача 7: cups 10, 1, 7, 5, 2, 9, 6, 3 and saucers 5, 3, 9, 1, 11, 8, 4, 6, 10 lie scattered; a number that is on a cup and
// on a saucer makes one set: 1, 3, 5, 6, 9, 10, six of them (D). A number twice on one side still makes one set (a cup needs its own saucer).
// The cups are cups, the saucers are saucers, both drawn in code and scattered over a grid of places. The answer is typed.
import { KIND, answerLine, rnd, shuffle, svgText, tr } from '../js/core.js';

/** @param {number[]} cups @param {number[]} saucers: the numbers on them; the sets they make: each cup takes a saucer with its number, one to one */
export function cupSets(cups, saucers, pos){
  const left = saucers.slice();
  let ans = 0;
  cups.forEach(n => { const i = left.indexOf(n); if(i >= 0){ left.splice(i, 1); ans++; } });
  return { kind: 'cupsets', cups, saucers, pos: pos || cups.concat(saucers).map((_, i) => i), ans };
}
export function genCupSets(){
  for(;;){
    const k = 3 + rnd(4), e1 = 1 + rnd(3), e2 = 1 + rnd(3), nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    const M = nums.slice(0, k), E1 = nums.slice(k, k + e1), E2 = nums.slice(k + e1, k + e1 + e2);
    const cups = M.concat(E1), saucers = M.concat(E2);
    if(rnd(2)) cups.push(M[rnd(k)]);   // a number twice on the cups: still one set
    else if(rnd(2)) saucers.push(M[rnd(k)]);
    if(cups.length > 10 || saucers.length > 10) continue;
    shuffle(cups); shuffle(saucers);
    return cupSets(cups, saucers, shuffle(Array.from({ length: 20 }, (_, i) => i)).slice(0, cups.length + saucers.length));
  }
}
const spot = (/** @type {number} */ i) => [29 + (i % 5) * 53 + (Math.floor(i / 5) % 2 ? 13 : -7), 22 + Math.floor(i / 5) * 44];
function pic(q){
  const parts = q.cups.map((/** @type {number} */ n, i) => [0, n, q.pos[i]]).concat(q.saucers.map((/** @type {number} */ n, i) => [1, n, q.pos[q.cups.length + i]]));
  const g = parts.map(([saucer, n, p]) => {
    const [x, y] = spot(p);
    return saucer
      ? '<ellipse cx="' + x + '" cy="' + y + '" rx="19" ry="15" fill="var(--warmbg)" stroke="var(--warm)" stroke-width="2.2"/><ellipse cx="' + x + '" cy="' + y + '" rx="12.5" ry="9.5" fill="none" stroke="var(--warm)" stroke-width="1" opacity=".7"/>' + svgText(x, y + 5, n, 14, 'var(--ink)')
      : '<path d="M' + (x - 16) + ',' + (y - 13) + ' H' + (x + 14) + ' V' + (y + 4) + ' Q' + (x + 14) + ',' + (y + 14) + ' ' + (x - 1) + ',' + (y + 14) + ' Q' + (x - 16) + ',' + (y + 14) + ' ' + (x - 16) + ',' + (y + 4) + ' Z" fill="var(--accentbg)" stroke="var(--accent)" stroke-width="2.2" stroke-linejoin="round"/>' +
        '<path d="M' + (x + 14) + ',' + (y - 8) + ' h5 q5,0 5,6 q0,6 -5,6 h-5" fill="none" stroke="var(--accent)" stroke-width="2.2"/>' + svgText(x - 1, y + 5, n, 14, 'var(--ink)');
  }).join('');
  const label = tr('чаши с номера ' + q.cups.join(', ') + ' и чинийки с номера ' + q.saucers.join(', '), 'чашки з номерами ' + q.cups.join(', ') + ' і блюдця з номерами ' + q.saucers.join(', '));
  return '<svg viewBox="0 0 280 196" style="display:block; width:330px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + label + '">' + g + '</svg>';
}
const matched = (/** @type {any} */ q) => [...new Set(q.cups.filter((/** @type {number} */ n) => q.saucers.includes(n)))].sort((/** @type {number} */ a, /** @type {number} */ b) => a - b);
function drawCupSets(q){
  return '<div class="ask">' + tr('Всяка чашка трябва да се комплектова с чинийка със същия номер. <b>Колко такива комплекта най-много могат да се направят?</b>',
    'Кожну чашку треба скомплектувати з блюдцем із тим самим номером. <b>Скільки таких комплектів найбільше можна зібрати?</b>') + '</div>' + pic(q) + answerLine('xl');
}
function eqCupSets(q){ return tr('номера и на чашка, и на чинийка: ', 'номери і на чашці, і на блюдці: ') + matched(q).join(', ') + ' → ' + q.ans; }
function whyCupSets(q, full){
  if(!full) return tr('Търси номерата, които има и на чашка, и на чинийка. Номер, който е само на едната, не прави комплект. Ако един номер е два пъти на едната страна, пак е един комплект.', 'Шукай номери, які є і на чашці, і на блюдці. Номер, що є лише на одному, комплекту не робить. Якщо номер двічі з одного боку, комплект усе одно один.');
  return tr('Номерата и на чашка, и на чинийка: ', 'Номери і на чашці, і на блюдці: ') + matched(q).join(', ') + '<br>' + tr('Всеки прави един комплект, общо ', 'Кожен робить один комплект, разом ') + '<b>' + q.ans + '</b>';
}
KIND.cupsets = { draw: drawCupSets, eq: eqCupSets, why: whyCupSets };
