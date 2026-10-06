// Question kind 'nest': level 221 Кутии в кутии — Boxes put inside boxes, all of them counted.

// МБГ Полуфинал 2025, 1 клас, задача 17: two smaller boxes were put in a box, and three boxes in each of the smaller
// ones — how many boxes are there? The big one, the 2 smaller ones and 3 + 3 = 6 small ones: 1 + 2 + 6 = 9.
// Or how many are empty: only the smallest, 6.
import { BGNUM, KIND, SLOT, UKNUM_F, popAt, rnd, tr } from '../js/core.js';
export function genNest(){
  const a = 2 + rnd(3), b = 2 + rnd(3), empty = Math.random() < 0.35, all = 1 + a + a*b, ans = empty ? a*b : all;
  return {kind:'nest', a, b, empty, traps: [...new Set(empty ? [all, a + b, a + a*b] : [a*b, a + b, a + a*b])].filter(v => v !== ans), ans};
}
const nestSmall = q => Array(q.a).fill(q.b).join(' + ') + ' = ' + q.a*q.b;
function drawNest(q){
  return '<div class="ask">' + tr('В една кутия поставили ' + BGNUM[q.a] + ' по-малки, а във всяка от по-малките кутии поставили по ' + BGNUM[q.b] + ' кутии. ' +
      (q.empty ? 'Колко от всички кутии са <b>празни</b>?' : 'Колко са <b>всичките</b> кутии?'),
    'В одну коробку поклали ' + UKNUM_F[q.a] + ' менші, а в кожну з менших коробок поклали по ' + UKNUM_F[q.b] + ' коробки. ' +
      (q.empty ? 'Скільки з усіх коробок <b>порожні</b>?' : 'Скільки <b>всього</b> коробок?')) + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqNest(q){
  return q.empty ? nestSmall(q) : '1 + ' + q.a + ' + ' + q.a*q.b + ' = ' + q.ans;
}
// the boxes, one inside the other: the big one, the smaller ones in it, and the smallest in each of those
function nestSvg(q){
  const mw = (244 - (q.a - 1)*6) / q.a, s = Math.min(16, (mw - 8 - (q.b - 1)*4) / q.b);
  let g = '<rect' + popAt(1) + ' x="4" y="4" width="252" height="70" rx="6" fill="none" stroke="var(--accent)" stroke-width="2.5"/>';
  for(let i = 0; i < q.a; i++){
    const x = 10 + i*(mw + 6);
    g += '<rect' + popAt(2 + i*0.3) + ' x="' + x.toFixed(1) + '" y="14" width="' + mw.toFixed(1) + '" height="50" rx="4" fill="none" stroke="var(--warm)" stroke-width="2"/>';
    const x0 = x + (mw - q.b*s - (q.b - 1)*4) / 2;
    for(let j = 0; j < q.b; j++) g += '<rect' + popAt(3 + q.a*0.3 + (i*q.b + j)*0.2) + ' x="' + (x0 + j*(s + 4)).toFixed(1) + '" y="' + (39 - s/2).toFixed(1) + '" width="' + s.toFixed(1) + '" height="' + s.toFixed(1) +
      '" rx="2" fill="' + (q.empty ? 'var(--goodbg)' : 'none') + '" stroke="var(--good)" stroke-width="1.8"/>';
  }
  return '<svg viewBox="0 0 260 78" style="display:block; width:300px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + tr('кутиите една в друга', 'коробки одна в одній') + '">' + g + '</svg>';
}
function whyNest(q, full){
  if(q.empty){
    if(!full) return tr('Празни са само кутиите, в които няма нищо — най-малките.', 'Порожні лише коробки, в яких нічого немає, — найменші.');
    return tr('празни са най-малките: ', 'порожні — найменші: ') + nestSmall(q) + nestSvg(q);
  }
  if(!full) return tr('Брой ги на етажи: голямата кутия, по-малките в нея и най-малките в тях. Не забравяй голямата!',
    'Рахуй їх поверхами: велика коробка, менші в ній і найменші в них. Не забудь про велику!');
  return tr('голямата: <b>1</b>; в нея: <b>' + q.a + '</b>; най-малките: ', 'велика: <b>1</b>; у ній: <b>' + q.a + '</b>; найменші: ') + nestSmall(q) +
    ' &nbsp;→&nbsp; 1 + ' + q.a + ' + ' + q.a*q.b + ' = ' + q.ans + nestSvg(q);
}
KIND.nest = { draw:drawNest, eq:eqNest, why:whyNest };
