// Question kind 'twosigns': level 63 Два знака — Which two different signs make the equality true.

// МБГ Есен, 3 клас, задача 5: (20 □ 2 + 5) □ 2 = 20 + 2 · 5, two different signs of + − · :.
// The right side is 30; only : then · gets there. A sign pair cannot be typed, so this
// kind always comes as А/Б/В/Г: its own options, each a pair, and ans is the right one's id.
// МБГ Есен 2024, 3 клас, задача 4 (shape 'prod'): (1 □ 2 + 3) □ 6 = 2 · 2 · 3 · 3, the right side written as a product
// of small factors, 36: + then ·. Есен 2023, задача 3 (shape 'two'): (20 □ 2) □ 3 = 6, no + c in the bracket: − then :.
// Both are drawn after the old question, so a seed that asked the old one still does, unless the draw after it
// turns it into a new shape.
import { KIND, rnd, shuffle, tr } from '../js/core.js';
const SIGNS4 = ['+', '−', '·', ':'];
function signCalc(x, o, y){
  if(o === '+') return x + y;
  if(o === '−') return x - y >= 0 ? x - y : null;
  if(o === '·') return x * y;
  return y && x % y === 0 ? x / y : null;
}
// (a o1 b + c) o2 d, or null where a step leaves the whole numbers
export function twoSignsVal(a, b, c, d, o1, o2){
  const x = signCalc(a, o1, b);
  return x === null ? null : signCalc(x + c, o2, d);
}
export const SIGN_PAIRS = [];
SIGNS4.forEach(x => SIGNS4.forEach(y => { if(x !== y) SIGN_PAIRS.push([x, y]); }));
export function genTwoSigns(){
  for(;;){
    const a = 6 + rnd(25), b = 2 + rnd(8), c = 1 + rnd(9), d = 2 + rnd(4);
    const vals = SIGN_PAIRS.map(([x, y]) => twoSignsVal(a, b, c, d, x, y));
    const k = rnd(SIGN_PAIRS.length), v = vals[k];
    if(v === null || v < 2 || v > 200 || vals.filter(w => w === v).length !== 1) continue;
    // the right side written as the paper writes it, x + y · z, when it can be
    const rs = [];
    for(let y = 2; y <= 9; y++) for(let z = 2; z <= 9; z++) if(v - y*z >= 1 && v - y*z !== a) rs.push([v - y*z, y, z]);
    const rhs = rs.length ? rs[rnd(rs.length)] : null;
    const wrong = shuffle(SIGN_PAIRS.map((_, i) => i).filter(i => i !== k)).slice(0, 3);
    const ids = shuffle(wrong.concat(k));
    const options = ids.map((pi, id) => ({ id, v: id, signs: SIGN_PAIRS[pi] }));
    const pick = ids.indexOf(k);
    const old = {kind:'twosigns', a, b, c, d, rhs, val: v, pair: SIGN_PAIRS[k], options, pick, own: true, ans: pick};
    const w = Math.random();
    return w < 0.2 ? genTwoSignsProd() : w < 0.4 ? genTwoSignsTwo() : old;
  }
}
// the pair at k among three other pairs, shuffled, as the old shape draws them
function signOptions(q, k){
  const ids = shuffle(shuffle(SIGN_PAIRS.map((_, i) => i).filter(i => i !== k)).slice(0, 3).concat(k));
  q.options = ids.map((pi, id) => ({ id, v: id, signs: SIGN_PAIRS[pi] }));
  q.pick = q.ans = ids.indexOf(k);
  return q;
}
const primeFactors = n => { const f = []; for(let p = 2; n > 1; p++) while(n % p === 0){ f.push(p); n /= p; } return f; };
// (a □ b + c) □ d = a product of three or more factors, none above 7, as 2 · 2 · 3 · 3
function genTwoSignsProd(){
  for(;;){
    const a = 1 + rnd(9), b = 2 + rnd(8), c = 1 + rnd(9), d = 2 + rnd(8);
    const vals = SIGN_PAIRS.map(([x, y]) => twoSignsVal(a, b, c, d, x, y));
    const k = rnd(SIGN_PAIRS.length), v = vals[k];
    if(v === null || v < 2 || v > 200 || vals.filter(w => w === v).length !== 1) continue;
    const fac = primeFactors(v);
    if(fac.length < 3 || fac[fac.length - 1] > 7) continue;
    return signOptions({kind:'twosigns', shape:'prod', a, b, c, d, fac, val: v, pair: SIGN_PAIRS[k], own: true}, k);
  }
}
// (a □ b) □ d = v: no + c in the bracket, so c is 0
function genTwoSignsTwo(){
  for(;;){
    const a = 6 + rnd(25), b = 2 + rnd(8), d = 2 + rnd(4);
    const vals = SIGN_PAIRS.map(([x, y]) => twoSignsVal(a, b, 0, d, x, y));
    const k = rnd(SIGN_PAIRS.length), v = vals[k];
    if(v === null || v < 2 || v > 200 || vals.filter(w => w === v).length !== 1) continue;
    return signOptions({kind:'twosigns', shape:'two', a, b, c: 0, d, val: v, pair: SIGN_PAIRS[k], own: true}, k);
  }
}
export const twoRhs = q => q.fac ? q.fac.join(' · ') : q.rhs ? q.rhs[0] + ' + ' + q.rhs[1] + ' · ' + q.rhs[2] : '' + q.val;
// the left side with these two signs in the boxes
const twoLhs = (q, s1, s2) => '(' + q.a + ' ' + s1 + ' ' + q.b + (q.shape === 'two' ? '' : ' + ' + q.c) + ') ' + s2 + ' ' + q.d;
function drawTwoSigns(q){
  const box = '<span class="op">□</span>';
  return '<div class="ask">' + tr('Кои <b>два различни</b> знака от „+“, „−“, „·“ и „:“ трябва да поставим вместо □, за да получим вярно равенство?',
    'Які <b>два різні</b> знаки з «+», «−», «·» і «:» треба поставити замість □, щоб отримати правильну рівність?') + '</div>' +
    '<div class="given">' + twoLhs(q, box, box) + ' = ' + twoRhs(q) + '</div>';
}
function eqTwoSigns(q){
  return twoLhs(q, q.pair[0], q.pair[1]) + ' = ' + q.val;
}
function whyTwoSigns(q, full){
  if(!full) return q.shape === 'two' ? tr('Пробвай двойките знаци една по една — двата знака трябва да са различни.',
                                          'Пробуй пари знаків по одній — два знаки мають бути різні.')
    : tr('Пресметни първо дясната страна, после пробвай знаците един по един.',
         'Спершу обчисли праву частину, потім пробуй знаки по одному.');
  const x = signCalc(q.a, q.pair[0], q.b);
  return (q.rhs || q.fac ? twoRhs(q) + ' = <b>' + q.val + '</b> &nbsp;→&nbsp; ' : '') + twoLhs(q, q.pair[0], q.pair[1]) + ' = ' +
    (x + q.c) + ' ' + q.pair[1] + ' ' + q.d + ' = ' + q.val;
}
KIND.twosigns = { draw:drawTwoSigns, eq:eqTwoSigns, why:whyTwoSigns };
