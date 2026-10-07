// Question kind 'regroup': level 235 2 · 2 · 3 = 4 · N — Group the factors to find the missing one.

// МБГ Есен 2023, 3 клас, задача 10: 2 · 2 · 3 · 3 · 4 = 4 · 9 · N — 2 · 2 = 4 and 3 · 3 = 9, so N = 4, with no need to
// work out 144. Five factors from 2 to 5, smallest first, cut into three runs of two, two and one in some order; two runs
// stand on the right as their products, and N is what the third one makes.
import { KIND, SLOT, rnd, tr } from '../js/core.js';
const prodAll = a => a.reduce((x, y) => x*y, 1);
export function genRegroup(){
  const f = [0, 0, 0, 0, 0].map(() => 2 + rnd(4)).sort((x, y) => x - y);
  const lens = [[2, 2, 1], [2, 1, 2], [1, 2, 2]][rnd(3)], hide = rnd(3);
  const vals = regroupRuns({f, lens}).map(prodAll), ans = vals[hide], P = prodAll(f);
  // the whole product, not divided by what stands on the right
  return {kind:'regroup', f, lens, hide, shown: vals.filter((_, j) => j !== hide), traps: P < 1000 ? [P] : [], ans};
}
// the factors in their runs
function regroupRuns(q){
  const runs = [];
  let i = 0;
  for(const L of q.lens){ runs.push(q.f.slice(i, i + L)); i += L; }
  return runs;
}
function drawRegroup(q){
  const N = '<i>N</i>';
  return '<div class="ask">' + tr('Кое е числото ' + N + ', ако', 'Чому дорівнює число ' + N + ', якщо') + '</div>' +
    '<div class="given">' + q.f.join(' · ') + ' = ' + q.shown.join(' · ') + ' · ' + N + '</div>' +
    '<div class="line xl">' + N + ' = ' + SLOT + '</div>';
}
const grouped = q => regroupRuns(q).map(r => r.length > 1 ? '(' + r.join(' · ') + ')' : r[0]).join(' · ');
// the summary line is plain text
function eqRegroup(q){
  return grouped(q) + ' = ' + q.shown.join(' · ') + ' · ' + q.ans;
}
function whyRegroup(q, full){
  if(!full) return tr('Сгрупирай множителите отляво така, че да видиш числата отдясно.', 'Згрупуй множники зліва так, щоб побачити числа справа.');
  const vals = regroupRuns(q).map(prodAll);
  return grouped(q) + ' = ' + vals.map((v, j) => j === q.hide ? '<b>' + v + '</b>' : v).join(' · ') + ' &nbsp;→&nbsp; <i>N</i> = ' + q.ans;
}
KIND.regroup = { draw:drawRegroup, eq:eqRegroup, why:whyRegroup };
