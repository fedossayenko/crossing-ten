// Question kind 'robot': level 515 Роботът от фигури — A robot made of polygons, each priced by its number of corners: what it costs.

// Салабашев 2023, задача 7: «Кръгчетата струват по 2 лв., триъгълниците по 3, четириъгълниците по 4, петоъгълниците по 5 и шестоъгълниците по 6. Колко ще струва изработката на робота?»
// The printed robot, part by part (every part twice where it comes in a pair): a circle on top 2, a hexagon head 6, two circles for eyes 4, two triangles for
// eyebrows 6, a triangle nose 3, a four-cornered mouth 4, two rhombi for ears 8, a four-cornered neck 4, a body 4, two legs 8, two feet 8, a
// pentagon, a hexagon and a triangle on each arm 10 + 12 + 6: 85 (the neck is a trapezoid whose top lies on the head's lower side: four corners).
// A robot here has the same 14 places; each place holds a polygon of 2 to 6 corners (2 = a circle), drawn on its own place so that no corner is hidden.
// A part is drawn as the one shape it is: a circle, or a polygon with as many points as corners.
import { KIND, answerLine, popAt, rnd, svgFrame, tr } from '../js/core.js';
/** the places of the robot: [name, how many, centre x, centre y, width, height, what its four-cornered part looks like] (a pair stands on both sides) */
const S = (name, n, cx, cy, w, h, style) => ({ name, n, cx, cy, w, h, style });
export const ROBOT_SLOTS = [
  S('knob', 1, 120, 24, 30, 24, 'rect'),
  S('head', 1, 120, 74, 84, 70, 'rect'),
  S('eyes', 2, 100, 66, 22, 20, 'rect'),
  S('brows', 2, 100, 47, 22, 12, 'rect'),
  S('nose', 1, 120, 85, 20, 14, 'rect'),
  S('mouth', 1, 120, 100, 36, 10, 'rect'),
  S('ears', 2, 60, 74, 30, 50, 'rhomb'),
  S('neck', 1, 120, 119, 40, 16, 'trap'),
  S('body', 1, 120, 161, 64, 62, 'rect'),
  S('legs', 2, 105, 218, 16, 48, 'rect'),
  S('feet', 2, 100, 248, 30, 8, 'rect'),
  S('upper', 2, 72, 148, 26, 32, 'rect'),
  S('fore', 2, 44, 178, 28, 24, 'rect'),
  S('hand', 2, 26, 204, 26, 22, 'rect')
];
export const ROBOT_PRINTED = [2, 6, 2, 3, 3, 4, 4, 4, 4, 4, 4, 5, 6, 3];
const total = t => t.reduce((s, v, i) => s + v*ROBOT_SLOTS[i].n, 0);
export function genRobot(){
  for(;;){
    // the head is never a circle: a round head is narrower than its place, and the brows and eyes would reach over its edge
    const t = ROBOT_SLOTS.map((_, i) => i === 1 ? 3 + rnd(4) : 2 + rnd(5)), sum = total(t);
    if(sum < 60 || sum > 99 || new Set(t).size < 4) continue;
    return {kind:'robot', t, ans: sum};
  }
}
/** the points of a polygon of n corners fitted into the box, as [x, y] pairs; n = 4 follows the place's style */
function corners(n, style, cx, cy, w, h){
  const hw = w/2, hh = h/2;
  if(n === 3) return [[cx, cy - hh], [cx + hw, cy + hh], [cx - hw, cy + hh]];
  if(n === 4) return style === 'rhomb' ? [[cx, cy - hh], [cx + hw, cy], [cx, cy + hh], [cx - hw, cy]] : style === 'trap' ? [[cx - hw*0.55, cy - hh], [cx + hw*0.55, cy - hh], [cx + hw, cy + hh], [cx - hw, cy + hh]] :
    [[cx - hw, cy - hh], [cx + hw, cy - hh], [cx + hw, cy + hh], [cx - hw, cy + hh]];
  if(n === 5) return [0, 1, 2, 3, 4].map(i => { const a = (-90 + 72*i)*Math.PI/180; return [cx + hw*Math.cos(a)/0.951, cy + hh*(Math.sin(a) + 0.0955)/0.9045]; });
  return [0, 1, 2, 3, 4, 5].map(i => { const a = 60*i*Math.PI/180; return [cx + hw*Math.cos(a), cy + hh*Math.sin(a)/0.866]; });
}
const FILL = 'fill="var(--paper)" stroke="var(--coal)" stroke-width="2" stroke-linejoin="round"';
function partSvg(n, style, cx, cy, w, h){
  if(n === 2) return '<ellipse cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" rx="' + (Math.min(w, h)/2).toFixed(1) + '" ry="' + (Math.min(w, h)/2).toFixed(1) + '" ' + FILL + '/>';
  return '<polygon points="' + corners(n, style, cx, cy, w, h).map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ') + '" ' + FILL + '/>';
}
/** the robot's places in drawing order: a pair gives the left and the right part (x mirrored round 120) */
export function robotParts(t){
  const out = [];
  ROBOT_SLOTS.forEach(({ name, n, cx, cy, w, h, style }, i) => {
    const xs = n === 1 ? [cx] : [cx, 240 - cx];
    xs.forEach(x => out.push({ slot: i, name, n: t[i], style, x, cy, w, h }));
  });
  return out;
}
function robotSvg(q, marks){
  return svgFrame('0 0 240 254', 270, tr('робот, направен от кръгчета и многоъгълници', 'робот із кружечків і многокутників')) +
    robotParts(q.t).map(p => (marks ? '<g' + popAt(p.slot + 1) + '>' : '<g>') + partSvg(p.n, p.style, p.x, p.cy, p.w, p.h) + '</g>').join('') + '</svg>';
}
const PRICE = n => n === 2 ? 'кръгчета' : n === 3 ? 'триъгълници' : n === 4 ? 'четириъгълници' : n === 5 ? 'петоъгълници' : 'шестоъгълници';
const eur = n => n + tr(' евро', ' євро');
function drawRobot(q){
  return '<div class="ask">' + tr('В магазинчето за геометрични фигури кръгчетата струват по ' + eur(2) + ', триъгълниците — по ' + eur(3) + ', четириъгълниците — по ' + eur(4) + ', петоъгълниците — по ' + eur(5) + ' и шестоъгълниците — по ' + eur(6) + '. Колко ще струва изработката на робота, показан на картинката?',
    'У магазині геометричних фігур кружечки коштують по ' + eur(2) + ', трикутники — по ' + eur(3) + ', чотирикутники — по ' + eur(4) + ', п’ятикутники — по ' + eur(5) + ' і шестикутники — по ' + eur(6) + '. Скільки коштуватиме виготовлення робота, показаного на малюнку?') + '</div>' +
    robotSvg(q) + answerLine('xl');
}
function counts(q){ const c = {}; robotParts(q.t).forEach(p => c[p.n] = (c[p.n] || 0) + 1); return c; }
function eqRobot(q){
  const c = counts(q);
  return Object.keys(c).sort().map(n => Array(c[n]).fill(n).join(' + ')).join(' + ') + ' = ' + q.ans;
}
function whyRobot(q, full){
  if(!full) return tr('Преброй фигурите една по една и им дай цена по ъглите: кръгчето — 2, триъгълникът — 3 и така нататък. Не пропускай малките — очите, носа, устата.', 'Порахуй фігури одну за одною й дай їм ціну за кутами: кружечок — 2, трикутник — 3 і так далі. Не пропускай малі — очі, ніс, рот.');
  const c = counts(q), keys = Object.keys(c).map(Number).sort((a, b) => a - b), sums = keys.map(n => c[n]*n);
  return robotSvg(q, true) + tr(keys.map(n => PRICE(n) + ': ' + c[n] + ' — ' + Array(c[n]).fill(n).join(' + ') + ' = ' + n*c[n]).join('<br>'),
    keys.map(n => ({ 2: 'кружечків', 3: 'трикутників', 4: 'чотирикутників', 5: 'п’ятикутників', 6: 'шестикутників' }[n]) + ': ' + c[n] + ' — ' + Array(c[n]).fill(n).join(' + ') + ' = ' + n*c[n]).join('<br>')) +
    '<br>' + sums.join(' + ') + ' = ' + q.ans;
}
KIND.robot = { draw:drawRobot, eq:eqRobot, why:whyRobot };
