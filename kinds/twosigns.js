// Question kind 'twosigns': level 63 Два знака — Which two different signs make the equality true.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Есен, 3 клас, задача 5: (20 □ 2 + 5) □ 2 = 20 + 2 · 5, two different signs of + − · :.
// The right side is 30; only : then · gets there. A sign pair cannot be typed, so this
// kind always comes as А/Б/В/Г: its own options, each a pair, and ans is the right one's id.
const SIGNS4 = ['+', '−', '·', ':'];
function signCalc(x, o, y){
  if(o === '+') return x + y;
  if(o === '−') return x - y >= 0 ? x - y : null;
  if(o === '·') return x * y;
  return y && x % y === 0 ? x / y : null;
}
// (a o1 b + c) o2 d, or null where a step leaves the whole numbers
function twoSignsVal(a, b, c, d, o1, o2){
  const x = signCalc(a, o1, b);
  return x === null ? null : signCalc(x + c, o2, d);
}
const SIGN_PAIRS = [];
SIGNS4.forEach(x => SIGNS4.forEach(y => { if(x !== y) SIGN_PAIRS.push([x, y]); }));
function genTwoSigns(){
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
    return {kind:'twosigns', a, b, c, d, rhs, val: v, pair: SIGN_PAIRS[k], options, pick, own: true, ans: pick};
  }
}
const twoRhs = q => q.rhs ? q.rhs[0] + ' + ' + q.rhs[1] + ' · ' + q.rhs[2] : '' + q.val;
function drawTwoSigns(q){
  if(q.kind === 'twosigns'){
    const box = '<span class="op">□</span>';
    return '<div class="ask">' + tr('Кои <b>два различни</b> знака от „+“, „−“, „·“ и „:“ трябва да поставим вместо □, за да получим вярно равенство?',
      'Які <b>два різні</b> знаки з «+», «−», «·» і «:» треба поставити замість □, щоб отримати правильну рівність?') + '</div>' +
      '<div class="given">(' + q.a + ' ' + box + ' ' + q.b + ' + ' + q.c + ') ' + box + ' ' + q.d + ' = ' + twoRhs(q) + '</div>';
  }
}
function eqTwoSigns(q){
  if(q.kind === 'twosigns') return '(' + q.a + ' ' + q.pair[0] + ' ' + q.b + ' + ' + q.c + ') ' + q.pair[1] + ' ' + q.d + ' = ' + q.val;
}
function whyTwoSigns(q, full){
  if(q.kind === 'twosigns'){
    if(!full) return tr('Пресметни първо дясната страна, после пробвай знаците един по един.',
                        'Спершу обчисли праву частину, потім пробуй знаки по одному.');
    const x = signCalc(q.a, q.pair[0], q.b);
    return (q.rhs ? twoRhs(q) + ' = <b>' + q.val + '</b> &nbsp;→&nbsp; ' : '') + '(' + q.a + ' ' + q.pair[0] + ' ' + q.b + ' + ' + q.c + ') ' +
      q.pair[1] + ' ' + q.d + ' = ' + (x + q.c) + ' ' + q.pair[1] + ' ' + q.d + ' = ' + q.val;
  }
}
KIND.twosigns = { draw:drawTwoSigns, eq:eqTwoSigns, why:whyTwoSigns };
