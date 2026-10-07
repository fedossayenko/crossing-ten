// Question kind 'abcde': level 245 ABC + DE — The smallest (or largest) sum of numbers written in letters, a different digit each.

// МБГ Есен 2024, 3 клас, задача 20: different letters are different digits; the smallest ABC + DE. A hundred outweighs any
// tens and units, so A takes the smallest digit a number may start with, 1; the tens B and D the next two, 0 and 2 — D
// starts a number, so it is the 2; the units C and E what is left, 3 and 4: 103 + 24 = 127. The smallest ABC first
// (102) and then the smallest DE of the digits left (34) gives 136 — that order is the trap. The same with other
// lengths (AB + CD, ABC + DEF, ABC + D …), and the largest sum where it stays under a thousand.
import { KIND, SLOT, rnd, tr } from '../js/core.js';
const ABC_FORMS = [[[3, 2], false], [[3, 2], false], [[2, 3], false], [[2, 2], false], [[2, 2], true], [[3, 3], false], [[3, 1], false], [[3, 1], true], [[2, 1], true]];
const LETTERS = 'ABCDEF';
// every letter's place: its number, its weight (100, 10, 1), and whether it starts a number of two or more digits
const abcPlaces = lens => lens.flatMap((L, n) => Array.from({length: L}, (_, i) => ({ n, w: 10 ** (L - 1 - i), lead: i === 0 && L > 1 })))
  .map((p, at) => Object.assign(p, { at }));
// The best digits place by place, the heaviest first: each place gets the smallest (largest) digits still free, a 0 going
// to a letter that does not start a number. check/grade3b-B.js tries every number instead.
function abcBest(lens, max){
  const places = abcPlaces(lens), free = max ? [9, 8, 7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], dig = [];
  [100, 10, 1].forEach(w => places.filter(p => p.w === w).sort((x, y) => +x.lead - +y.lead).forEach(p => {
    const d = free.find(v => !(p.lead && v === 0));
    free.splice(free.indexOf(d), 1);
    dig[p.at] = d;
  }));
  return dig;
}
const abcNums = (lens, dig) => { let at = 0; return lens.map(L => +dig.slice(at, at += L).join('')); };
// the slip: the smallest (largest) first number, then the smallest (largest) second one of the digits left
function abcGreedy(lens, max){
  const used = new Set(), nums = lens.map(L => {
    let best = -1;
    for(let v = L > 1 ? 10 ** (L - 1) : 0; v < 10 ** L; v++){
      const s = String(v);
      if(new Set(s).size === L && ![...s].some(c => used.has(c)) && (best < 0 || (max ? v > best : v < best))) best = v;
    }
    [...String(best)].forEach(c => used.add(c));
    return best;
  });
  return nums.reduce((a, b) => a + b, 0);
}
export function genAbcSum(){
  const [lens, max] = ABC_FORMS[rnd(ABC_FORMS.length)], dig = abcBest(lens, max), ans = abcNums(lens, dig).reduce((a, b) => a + b, 0), slip = abcGreedy(lens, max);
  return {kind:'abcde', lens, max, dig, traps: slip !== ans ? [slip] : [], ans};
}
const abcWords = q => { let at = 0; return q.lens.map(L => LETTERS.slice(at, at += L)); };
const over = w => w.length > 1 ? '<span style="text-decoration:overline; text-decoration-thickness:.07em">' + w + '</span>' : w;
function drawAbcSum(q){
  return '<div class="ask">' + tr('Ако на различните букви съответстват различни цифри, пресметнете <b>' + (q.max ? 'най-големия' : 'най-малкия') + '</b> възможен сбор',
    'Якщо різним буквам відповідають різні цифри, обчисліть <b>' + (q.max ? 'найбільшу' : 'найменшу') + '</b> можливу суму') + '</div>' +
    '<div class="given">' + abcWords(q).map(over).join(' + ') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqAbcSum(q){
  return abcNums(q.lens, q.dig).join(' + ') + ' = ' + q.ans;
}
function whyAbcSum(q, full){
  if(!full) return q.max ? tr('Първата цифра на числото тежи най-много. Сложи най-големите цифри на най-тежките места.', 'Перша цифра числа важить найбільше. Постав найбільші цифри в найстарші розряди.')
    : tr('Първата цифра на числото тежи най-много. Сложи най-малките цифри на най-тежките места — но число не започва с нула.',
         'Перша цифра числа важить найбільше. Постав найменші цифри в найстарші розряди — але число не починається з нуля.');
  const places = abcPlaces(q.lens), name = { 100: tr('стотици', 'сотні'), 10: tr('десетици', 'десятки'), 1: tr('единици', 'одиниці') };
  let zero = !q.max;   // the 0 is still free
  const steps = [100, 10, 1].map(w => {
    const here = places.filter(p => p.w === w);
    if(!here.length) return '';
    const leadOnly = zero && here.every(p => p.lead);   // the 0 is free, but every one of these starts a number
    if(here.some(p => q.dig[p.at] === 0)) zero = false;
    return name[w] + ': ' + here.map(p => LETTERS[p.at] + ' = ' + q.dig[p.at]).join(', ') + (leadOnly ? tr(' (не 0: с 0 число не започва)', ' (не 0: з 0 число не починається)') : '');
  }).filter(Boolean);
  return steps.join('; &nbsp;') + ' &nbsp;→&nbsp; ' + abcNums(q.lens, q.dig).join(' + ') + ' = ' + q.ans;
}
KIND.abcde = { draw:drawAbcSum, eq:eqAbcSum, why:whyAbcSum };
