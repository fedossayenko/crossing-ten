// Question kind 'gears': level 433 Две зъбни колела — A small gear turns once round on a bigger one: where the big gear's black tooth ends up.

// Кенгуру 2021, 2 клас, задача 20: two gears with one black tooth each; show how they stand after the smaller makes one full turn clockwise (the paper's key C).
// A turn of the small gear takes its n teeth past the contact, and each tooth that passes pushes one tooth of the big gear (N teeth) the other way, so the big gear
// turns n teeth anticlockwise and its black tooth ends n teeth from the contact on that side; the small gear stands as it did. The teeth are drawn in code
// (a tooth is 360° / count), the five options differ only in how far the big gear's black tooth has gone: the right n teeth anticlockwise, and the slips
// (the same way round, not at all, a tooth more or fewer than n).
import { KIND, shuffle, rnd, tr } from '../js/core.js';
const P = 14, TH = 3, CONTACT = -135 * Math.PI / 180;   // a tooth's pitch along the pitch circle, half a tooth's height, the way from the big gear to the small one
const pitchR = n => n * P / (2 * Math.PI);
// teeth to the big gear's black tooth from the contact, anticlockwise positive: the right answer after one turn of the small gear
export const gearShift = (n, N) => ((n % N) + N) % N;
/** the gear as one polygon: n teeth, the first at angle a0 (radians, screen) */
function teeth(cx, cy, n, a0){
  const r = pitchR(n), D = 2 * Math.PI / n, pts = [];
  for(let k = 0; k < n; k++){
    const a = a0 + k * D;
    [[r - TH, -.28], [r + TH, -.14], [r + TH, .14], [r - TH, .28]].forEach(([rr, w]) => pts.push((cx + rr * Math.cos(a + w * D)).toFixed(1) + ',' + (cy + rr * Math.sin(a + w * D)).toFixed(1)));
  }
  return pts;
}
const tooth = (cx, cy, n, a0) => teeth(cx, cy, n, a0).slice(0, 4).join(' ');
// the two gears; the big gear's black tooth is `turn` teeth anticlockwise from the contact; arrow: the small gear's turn
function pic(q, turn, arrow){
  const n = q.n, N = q.N, rb = pitchR(N), rs = pitchR(n), sx = (rb + rs) * Math.cos(CONTACT), sy = (rb + rs) * Math.sin(CONTACT), D = 360 / N;
  const sa = CONTACT + Math.PI + Math.PI / n;   // the small gear's black tooth stands beside the gap that meets the big gear's black tooth
  let s = '<g transform="rotate(' + (-turn * D).toFixed(2) + ' 0 0)"><polygon points="' + teeth(0, 0, N, CONTACT).join(' ') + '" fill="var(--accentbg)" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round"/>' +
    '<circle r="' + (rb - TH - 5).toFixed(1) + '" fill="none" stroke="var(--accent)" stroke-width="1" opacity=".4"/><polygon points="' + tooth(0, 0, N, CONTACT) + '" fill="var(--ink)" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round"/><circle r="2.5" fill="var(--accent)"/></g>';
  s += '<polygon points="' + teeth(sx, sy, n, sa).join(' ') + '" fill="var(--warmbg)" stroke="var(--warm)" stroke-width="2" stroke-linejoin="round"/>' +
    '<polygon points="' + tooth(sx, sy, n, sa) + '" fill="var(--ink)" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round"/><circle cx="' + sx.toFixed(1) + '" cy="' + sy.toFixed(1) + '" r="2.5" fill="var(--warm)"/>';
  if(arrow){   // a clockwise arc round the small gear's far side
    const R = rs + TH + 9, a1 = -190 * Math.PI / 180, a2 = -95 * Math.PI / 180, p = a => [sx + R * Math.cos(a), sy + R * Math.sin(a)], [x1, y1] = p(a1), [x2, y2] = p(a2), tx = -Math.sin(a2), ty = Math.cos(a2);
    s += '<path d="M' + x1.toFixed(1) + ',' + y1.toFixed(1) + ' A' + R.toFixed(1) + ',' + R.toFixed(1) + ' 0 0 1 ' + x2.toFixed(1) + ',' + y2.toFixed(1) + '" fill="none" stroke="var(--ink)" stroke-width="2.5" stroke-linecap="round"/>' +
      '<polygon points="' + [[x2 + tx * 8, y2 + ty * 8], [x2 - ty * 5, y2 + tx * 5], [x2 + ty * 5, y2 - tx * 5]].map(v => v.map(c => c.toFixed(1)).join(',')).join(' ') + '" fill="var(--ink)"/>';
  }
  return s;
}
const DIR = [['горе', 'вгорі'], ['горе вдясно', 'вгорі праворуч'], ['вдясно', 'праворуч'], ['долу вдясно', 'внизу праворуч'], ['долу', 'внизу'], ['долу вляво', 'внизу ліворуч'], ['вляво', 'ліворуч'], ['горе вляво', 'вгорі ліворуч']];
// where the big gear's black tooth is, in words (nearest of eight ways)
const where = (q, turn, uk) => { const a = (CONTACT * 180 / Math.PI - turn * 360 / q.N + 90 + 720) % 360; return DIR[Math.round(a / 45) % 8][uk]; };
const view = q => { const rb = pitchR(q.N), rs = pitchR(q.n), e = Math.ceil(rb + 2 * rs + 2 * TH + 12); return (-e) + ' ' + (-e) + ' ' + (rb + e + 6).toFixed(0) + ' ' + (rb + e + 6).toFixed(0); };
const label = (q, turn, uk) => uk ? 'велике колесо: чорний зубець ' + where(q, turn, 1) : 'голямото колело: черният зъб е ' + where(q, turn, 0);
function optPic(q, turn, uk){
  return '<svg viewBox="' + view(q) + '" width="92" height="92" role="img" aria-label="' + label(q, turn, uk) + '">' + pic(q, turn, false) + '</svg>';
}
export function genGears(){
  for(;;){
    const n = 5 + rnd(5), N = n + 3 + rnd(10);
    if(N > 20 || n * 2 === N) continue;   // the big gear is bigger, and half a turn would look the same either way
    // five stops of the big gear's black tooth, in teeth anticlockwise: the right one, the other way, none, a tooth more, a tooth fewer
    const right = gearShift(n, N), slips = [N - n, 0, n + 1, n - 1, N - n - 1, N - n + 1, Math.floor(N / 2)].map(v => ((v % N) + N) % N).filter((v, i, a) => v !== right && a.indexOf(v) === i);
    if(slips.length < 4) continue;
    const turns = shuffle(slips).slice(0, 4).concat(right), q = {kind:'gears', n, N};
    shuffle(turns);
    // two stops that look the same to the eye (the same direction word) would be a coin toss: every direction word once
    if(new Set(turns.map(t => where(q, t, 0))).size < 5) continue;
    q.turns = turns; q.options = turns.map((t, id) => ({ id, v: id, text: [optPic(q, t, 0), optPic(q, t, 1)] })); q.pick = turns.indexOf(right); q.own = true; q.ans = q.pick;
    return q;
  }
}
function drawGears(q){
  return '<div class="ask">' + tr('Показани са две зъбни колела с по един черен зъб. Посочете разположението на колелата след една пълна обиколка на по-малкото, ако то се завърти по посока на часовниковата стрелка.',
    'Показано два зубчасті колеса з одним чорним зубцем. Вкажіть розташування коліс після одного повного оберту меншого, якщо воно обертається за годинниковою стрілкою.') + '</div>' +
    '<div class="fig tall"><svg viewBox="' + view(q) + '" style="display:block; max-width:100%" role="img" aria-label="' + tr('малко колело с черен зъб върху голямо колело с черен зъб, стрелка по часовниковата', 'мале колесо з чорним зубцем на великому колесі з чорним зубцем, стрілка за годинниковою') + '">' + pic(q, 0, true) + '</svg></div>';
}
const eqGears = q => tr('малкото минава ' + q.n + ' зъба, голямото се върти обратно: ' + q.n + ' зъба', 'мале проходить ' + q.n + ' зубців, велике крутиться проти: ' + q.n + ' зубців');
function whyGears(q, full){
  if(!full) return tr('Брой зъбите на малкото колело: толкова зъба минават през допира, докато то се завърти веднъж. Всеки зъб бута един зъб на голямото колело в обратна посока. Малкото се връща в същото положение.',
    'Порахуй зубці малого колеса: стільки зубців проходить через дотик, поки воно робить один оберт. Кожен зубець штовхає один зубець великого колеса в протилежний бік. Мале повертається в те саме положення.');
  return tr('Малкото колело има ' + q.n + ' зъба, голямото ' + q.N + '. За една обиколка на малкото голямото се завърта обратно на часовниковата стрелка с ' + q.n + ' зъба, а малкото остава както е: ',
    'Мале колесо має ' + q.n + ' зубців, велике ' + q.N + '. За один оберт малого велике повертається проти годинникової стрілки на ' + q.n + ' зубців, а мале лишається як було: ') +
    '<div class="fig tall"><svg viewBox="' + view(q) + '" style="display:block; max-width:100%" role="img" aria-label="' + tr(label(q, q.turns[q.pick], 0), label(q, q.turns[q.pick], 1)) + '">' + pic(q, q.turns[q.pick], false) + '</svg></div>';
}
KIND.gears = { draw:drawGears, eq:eqGears, why:whyGears };
