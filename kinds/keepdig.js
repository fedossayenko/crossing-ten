// Question kind 'keepdig': level 223 Останалите цифри — Digits erased until every number keeps one, all different.

// МБГ Полуфинал 2025, 1 клас, задача 16: Алекс wrote 123, Борис 342, Васил 13 and Мими 1; Мими erased some digits of
// the boys' numbers and 4 different digits were left. Which of Алекс's digits is left? Four numbers and four digits:
// each number keeps exactly one (none is erased whole — the key's reading, said in the text), all different.
// Мими's 1 stays, so Васил's 13 keeps 3, Алекс's 123 keeps 2 (not 1, not 3) and Борис's 342 keeps 4.
import { KIND, SLOT, rnd, shuffle, tr } from '../js/core.js';
// [Bulgarian, Ukrainian, Ukrainian genitive]
/** @type {[string, string, string][]} */
const KD_BOYS = [['Алекс', 'Алекс', 'Алекса'], ['Борис', 'Борис', 'Бориса'], ['Васил', 'Василь', 'Василя']];
// The boys in the order their digit is forced: each time a number has only one digit that is not yet left on
// another, it keeps that one. [boy, digit] steps, or null when some number is never forced (then the digits
// left could be told apart more than one way, or not at all).
function keepDigSteps(nums, g){
  const kept = [g], steps = [], todo = nums.map((_, i) => i);
  while(todo.length){
    const i = todo.find(k => String(nums[k]).split('').map(Number).filter(d => !kept.includes(d)).length === 1);
    if(i === undefined) return null;
    const d = String(nums[i]).split('').map(Number).find(x => !kept.includes(x));
    kept.push(d); steps.push([i, d]); todo.splice(todo.indexOf(i), 1);
  }
  return steps;
}
export function genKeepDig(){
  for(;;){
    const m = 2 + rnd(2), digs = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, m + 1), g = digs[0];
    // each boy's number: the digit he keeps, and one or two of the other digits left on the board
    const nums = digs.slice(1).map(d => +shuffle([d].concat(shuffle(digs.filter(x => x !== d)).slice(0, 1 + rnd(2)))).join(''));
    const steps = keepDigSteps(nums, g);
    if(!steps) continue;
    const ask = rnd(m), ans = steps.find(s => s[0] === ask)[1];
    return {kind:'keepdig', nums, g, ask, traps: String(nums[ask]).split('').map(Number).filter(d => d !== ans), ans};
  }
}
function drawKeepDig(q){
  const m = q.nums.length, B = KD_BOYS;
  return '<div class="ask">' + tr(q.nums.map((v, i) => B[i][0] + ' записал' + (i ? '' : ' на дъската') + ' <span class="num">' + v + '</span>').join(', ') + ', а Мими – <span class="num">' + q.g + '</span>. ' +
      'След това Мими изтрила няколко цифри от числата на момчетата, но не изтрила изцяло нито едно число. На дъската останали ' + (m + 1) + ' различни цифри. Коя от цифрите на ' + B[q.ask][0] + ' е останала на дъската?',
    q.nums.map((v, i) => B[i][1] + ' записав' + (i ? '' : ' на дошці') + ' <span class="num">' + v + '</span>').join(', ') + ', а Мімі — <span class="num">' + q.g + '</span>. ' +
      'Потім Мімі стерла кілька цифр із чисел хлопчиків, але жодного числа не стерла повністю. На дошці залишилися ' + (m + 1) + ' різні цифри. Яка з цифр ' + B[q.ask][2] + ' залишилася на дошці?') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqKeepDig(q){
  return tr('Мими ', 'Мімі ') + q.g + ', ' + keepDigSteps(q.nums, q.g).map(([i, d]) => tr(KD_BOYS[i][0], KD_BOYS[i][1]) + ' ' + d).join(', ') + ' → ' + q.ans;
}
function whyKeepDig(q, full){
  if(!full) return tr('Цифрата на Мими остава. Всяко число запазва само една цифра и всички са различни — започни от числото, на което остава само един избор.',
    'Цифра Мімі залишається. Кожне число зберігає лише одну цифру, і всі вони різні, — почни з числа, де лишається тільки один вибір.');
  const steps = keepDigSteps(q.nums, q.g), upto = steps.findIndex(s => s[0] === q.ask), kept = [q.g];
  return tr('Мими: <b>', 'Мімі: <b>') + q.g + '</b>' + steps.slice(0, upto + 1).map(([i, d]) => {
    const gone = String(q.nums[i]).split('').map(Number).filter(x => kept.includes(x));
    kept.push(d);
    return ' &nbsp;→&nbsp; ' + tr(KD_BOYS[i][0], KD_BOYS[i][1]) + ': ' + q.nums[i] + ' без ' + gone.join(', ') + ' → <b>' + d + '</b>';
  }).join('');
}
KIND.keepdig = { draw:drawKeepDig, eq:eqKeepDig, why:whyKeepDig };
