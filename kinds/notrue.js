// Question kind 'notrue': level 147 Кое не е вярно? — Three numbers worked out, and the one false statement among four.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Коледно 2022, задача 1: A = 34 + 22, B = 87 − 25, C = 55. Which is NOT true: A < B, C < A, B > C, A > B?
// A = 56, B = 62, C = 55, so A > B is the false one. Each statement is checked against the worked numbers;
// exactly one of the four is false. The answer is a statement, so the kind brings its own А/Б/В/Г.
import { KIND, rnd, shuffle, tr } from '../js/core.js';
export function genNoTrue(){
  for(;;){
    const x = 11 + rnd(50), y = 11 + rnd(40), A = x + y, p = 40 + rnd(59), r = 11 + rnd(p - 20), B = p - r, C = Math.min(A, B) - 3 + rnd(Math.abs(A - B) + 7);
    if(A > 99 || new Set([A, B, C]).size < 3 || Math.abs(A - B) > 12) continue;
    const v = {A, B, C}, all = [];
    [['A', 'B'], ['A', 'C'], ['B', 'C'], ['B', 'A'], ['C', 'A'], ['C', 'B']].forEach(([l, r2]) => ['<', '>'].forEach(op => all.push({l, op, r: r2, ok: op === '<' ? v[l] < v[r2] : v[l] > v[r2]})));
    const no = shuffle(all.filter(s => !s.ok))[0], yes = shuffle(all.filter(s => s.ok && !(s.l === no.r && s.r === no.l))).slice(0, 3);
    if(yes.length < 3) continue;
    const st = shuffle(yes.concat(no)), txt = s => s.l + ' ' + s.op + ' ' + s.r;
    const options = st.map((s, id) => ({ id, v: id, text: [txt(s), txt(s)] }));
    return {kind:'notrue', x, y, p, r, A, B, C, st: st.map(txt), oks: st.map(s => s.ok), options, pick: st.indexOf(no), own: true, ans: st.indexOf(no)};
  }
}
function drawNoTrue(q){
  if(q.kind === 'notrue'){
    return '<div class="given">A = ' + q.x + ' + ' + q.y + ', &nbsp;B = ' + q.p + ' − ' + q.r + ', &nbsp;C = ' + q.C + '</div>' +
      '<div class="ask">' + tr('Кое твърдение <b>не е</b> вярно?', 'Яке твердження <b>хибне</b>?') + '</div>';
  }
}
function eqNoTrue(q){
  if(q.kind === 'notrue') return 'A = ' + q.A + ', B = ' + q.B + ', C = ' + q.C + ' → ' + q.st[q.pick];
}
function whyNoTrue(q, full){
  if(q.kind === 'notrue'){
    if(!full) return tr('Първо пресметни A и B. После провери всяко твърдение — търсим това, което не е вярно.', 'Спершу обчисли A і B. Потім перевір кожне твердження — шукаємо хибне.');
    return 'A = ' + q.A + ', B = ' + q.B + ', C = ' + q.C + ' &nbsp;→&nbsp; ' + q.st.map((s, i) => s + (q.oks[i] ? ' ✓' : ' <b>✗</b>')).join(', ');
  }
}
KIND.notrue = { draw:drawNoTrue, eq:eqNoTrue, why:whyNoTrue };
