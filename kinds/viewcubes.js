// Question kind 'viewcubes': levels 420 Отгоре (a row of stacks seen from above), 421 Кутия със стъкла (six cubes in a glass box, seen from
// above), 422 Двойки кубчета (which composition cannot be made of four two-cube bars). The answer is a picture: the kind brings its own А–Д.

// Кенгуру 2023 #2: 5 cubes seen from the front, three white, one black, one hatched; how do they look from above (key B: black, white, hatched).
// Кенгуру 2024 #17: 6 cubes in a glass box, which top view (key E). Кенгуру 2024 #9: which composition cannot be built from four bars of two
// stuck cubes (key D). The printed buildings are not readable to the last cube, so every building here is a 3-D model drawn from the model
// and the views are worked out from the model: a question with another building. A building is only drawn when every cube shows a face
// (every cube shows a face, none is hidden) and, for the bars, at most two pairs of cubes look stuck that are not, so what the child sees is the model.
import { KIND, BGNUM, rnd, shuffle, tr, ukN } from '../js/core.js';
import { isoSvg } from './isocubes.js';
import { SOLID_TURNS, growSolid, solidName, solidNorm, solidSpot } from './cubepaint.js';

const LET = 'АБВГД';
/** every cube shows a face and no two are drawn on the same spot (a stack beside a taller stack is fine: what touches is not in doubt) */
const shows = cells => {
  const has = (x, y, z) => cells.some(c => c.x === x && c.y === y && c.z === z);
  return cells.every(c => !(has(c.x + 1, c.y, c.z) && has(c.x, c.y + 1, c.z) && has(c.x, c.y, c.z + 1))) &&
    cells.every((a, i) => cells.every((b, j) => i >= j || b.x - a.x !== b.y - a.y || b.x + b.y - 2*b.z !== a.x + a.y - 2*a.z));
};
const cap = s => s[0].toUpperCase() + s.slice(1);
/** the options' pictures need a label that reads the same in both languages: the letter */
const opt = (items, svg) => items.map((it, id) => ({ id, v: id, text: [svg(it, id), svg(it, id)] }));
/** a vote on how alike the options are (the one nearest to all the others) must not give the right one away: false when it does */
export const nearest = (vecs, pick) => {
  const d = vecs.map(a => vecs.reduce((s, b) => s + a.reduce((n, x, i) => n + (x === b[i] ? 0 : 1), 0), 0));
  const lo = Math.min(...d);
  return !(d[pick] === lo && d.filter(x => x === lo).length === 1);
};

// ---- 420: a row of stacks, seen from above
const COL = { w: 'var(--paper)', g: 'var(--fur)', h: 'var(--paper)' };
const NAME = { w: ['бяло', 'біле'], g: ['сиво', 'сіре'], h: ['защриховано', 'заштриховане'] };
function topRow(codes){
  const u = 26, W = codes.length*u + 4;
  return '<svg viewBox="0 0 ' + W + ' ' + (u + 4) + '" width="' + W + '" height="' + (u + 4) + '" style="max-width:100%" role="img" aria-label="">' + codes.map((c, i) => '<rect x="' + (2 + i*u) + '" y="2" width="' + u + '" height="' + u + '" fill="' + COL[c] + '" stroke="var(--fur-dark)" stroke-width="1.6"/>' +
    (c === 'h' ? '<path d="M' + (2 + i*u) + ' 2L' + (2 + (i + 1)*u) + ' ' + (2 + u) + 'M' + (2 + (i + 1)*u) + ' 2L' + (2 + i*u) + ' ' + (2 + u) + '" stroke="var(--ink)" stroke-width="1.2"/>' : '')).join('') + '</svg>';
}
const labelled = (svg, label) => svg.replace('aria-label=""', 'aria-label="' + label + '"');
export function genViewRow(){
  for(;;){
    const cols = 3 + rnd(2), heights = Array(cols).fill(1);
    shuffle(Array.from({ length: cols }, (_, i) => i)).slice(0, 2).forEach(i => { heights[i] = 2; });
    const cells = [];
    heights.forEach((h, x) => { for(let z = 0; z < h; z++) cells.push({ x, y: 0, z, c: 3 }); });
    const [gi, hi] = shuffle(cells.map((_, i) => i)).slice(0, 2);
    cells[gi].c = 4; cells[hi].h = true;
    const code = c => c.h ? 'h' : c.c === 4 ? 'g' : 'w';
    const tops = heights.map((h, x) => code(cells.find(c => c.x === x && c.z === h - 1)));
    if(tops.every(t => t === 'w') || !shows(cells)) continue;
    const pool = [], all = ['w', 'g', 'h'];
    const rows = [];
    for(let i = 0; i < 3 ** cols; i++) rows.push(Array.from({ length: cols }, (_, k) => all[Math.floor(i/3 ** k) % 3]));
    rows.forEach(r => { const g = r.filter(c => c === 'g').length, h = r.filter(c => c === 'h').length; if(g <= 1 && h <= 1 && r.join() !== tops.join()) pool.push(r); });
    const wrong = shuffle(pool).slice(0, 4);
    const rowsAll = shuffle(wrong.concat([tops])), pick = rowsAll.findIndex(r => r.join() === tops.join());
    if(!nearest(rowsAll, pick)) continue;
    return {kind:'viewcubes', shape:'row', cols, n: cells.length, cells, tops, heights, options: opt(rowsAll, (r, id) => labelled(topRow(r), LET[id])), rows: rowsAll, pick, own:true, ans: pick};
  }
}

// ---- 421: six cubes in a glass box, seen from above. Plan: x to the right, y downwards, the far bottom corner (the white dot) at the top left.
const PLAN = 3;
const plan = cells => Array.from({ length: PLAN }, (_, y) => Array.from({ length: PLAN }, (_, x) => cells.some(c => c.x === x && c.y === y) ? 1 : 0));
const flat = g => g.flat();
/** the picture shows the plan: every way the drawn cubes could stand in the box (each moved along its line of sight, none floating) gives the same plan */
export function planFixed(cells){
  const spot = c => [0, 1, 2].flatMap(z => [0, 1, 2].flatMap(y => [0, 1, 2].filter(x => x - y === c.x - c.y && x + y - 2*z === c.x + c.y - 2*c.z).map(x => [x, y, z])));
  const options = cells.map(spot), plans = new Set(), at = [];
  const go = k => {
    if(k === cells.length){
      const has = (x, y, z) => at.some(p => p[0] === x && p[1] === y && p[2] === z);
      if(at.every(([x, y, z]) => !z || has(x, y, z - 1))) plans.add([0, 1, 2].map(y => [0, 1, 2].map(x => at.some(p => p[0] === x && p[1] === y) ? 1 : 0).join('')).join('|'));
      return;
    }
    for(const p of options[k]){ if(at.some(o => o[0] === p[0] && o[1] === p[1] && o[2] === p[2])) continue; at.push(p); go(k + 1); at.pop(); }
  };
  go(0);
  return plans.size === 1;
}
function planSvg(g){
  const u = 26, W = PLAN*u + 4;
  return '<svg viewBox="0 0 ' + W + ' ' + W + '" width="' + W + '" height="' + W + '" style="max-width:100%" role="img" aria-label="">' + g.map((r, y) => r.map((v, x) => '<rect x="' + (2 + x*u) + '" y="' + (2 + y*u) + '" width="' + u + '" height="' + u + '" fill="' + (v ? 'var(--lemon)' : 'var(--paper)') + '" stroke="var(--fur-dark)" stroke-width="1.6"/>').join('')).join('') +
    '<circle cx="2" cy="2" r="4.2" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.4"/></svg>';
}
const tf = [g => g[0].map((_, x) => g.map(r => r[x])), g => g.map(r => r.slice().reverse()), g => g.slice().reverse(), g => g.slice().reverse().map(r => r.slice().reverse()),
  g => g[0].map((_, x) => g.map(r => r[x]).reverse()), g => g[0].map((_, x) => g.map(r => r[x])).reverse()];   // flipped over the diagonal, left-right, up-down, turned half a turn, turned a quarter each way
export function genViewBox(){
  for(;;){
    const heights = Array.from({ length: PLAN*PLAN }, () => 0);
    for(let n = 0; n < 6; n++){ const i = rnd(PLAN*PLAN); if(heights[i] >= 3){ n--; continue; } heights[i]++; }
    const cells = [];
    heights.forEach((h, i) => { for(let z = 0; z < h; z++) cells.push({ x: i % PLAN, y: Math.floor(i/PLAN), z, c: 0 }); });
    const foot = plan(cells), n = flat(foot).reduce((a, b) => a + b, 0);
    if(n < 3 || n > 5 || !shows(cells) || !planFixed(cells)) continue;
    const key = g => flat(g).join('');
    const seen = new Set([key(foot)]), wrong = [];
    const add = g => { if(!seen.has(key(g)) && wrong.length < 4){ seen.add(key(g)); wrong.push(g); } };
    shuffle(tf.slice()).slice(0, 2 + rnd(2)).forEach(f => add(f(foot)));
    for(let k = 0; k < 40 && wrong.length < 4; k++){ const i = rnd(PLAN*PLAN), g = foot.map(r => r.slice()); g[Math.floor(i/PLAN)][i % PLAN] ^= 1; if(flat(g).some(v => v)) add(g); }
    if(wrong.length < 4) continue;
    const gs = shuffle(wrong.concat([foot])), pick = gs.indexOf(foot);
    if(!nearest(gs.map(flat), pick)) continue;
    return {kind:'viewcubes', shape:'box', n: cells.length, cells, foot, plans: gs, options: opt(gs, (g, id) => labelled(planSvg(g), LET[id])), pick, own:true, ans: pick};
  }
}

// ---- 422: which composition of 8 cubes cannot be made of four bars of two stuck cubes (bars may be put any way round)
export function barsFit(cells, fake){
  const key = c => c.x + ',' + c.y + ',' + c.z, at = new Map(cells.map(c => [key(c), c]));
  // fake: two cubes that only look stuck (lookAlike) count as stuck too: what a child who believes the picture would try
  const near = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z) === 1 || (fake && looksStuck(a, b));
  const go = left => {
    if(!left.size) return true;
    const [first] = left, a = at.get(first);
    for(const o of left){
      if(o === first || !near(a, at.get(o))) continue;
      const rest = new Set(left); rest.delete(first); rest.delete(o);
      if(go(rest)) return true;
    }
    return false;
  };
  return go(new Set(at.keys()));
}
/** two cubes drawn so that they seem to touch at an edge or to sit one on the other, while they share no face */
const looksStuck = (a, b) => { const dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z;
  return ['1,1', '-1,-1', '-1,1', '1,-1', '0,2', '0,-2'].includes([dx - dy, dx + dy - 2*dz].join()) && Math.abs(dx) + Math.abs(dy) + Math.abs(dz) !== 1; };
/** pairs of cubes drawn as if they touched at an edge or sat one on the other while they do not share a face; 99 when a cube is hidden or covered */
export function lookAlikes(cells){
  const has = (x, y, z) => cells.some(o => o.x === x && o.y === y && o.z === z);
  if(cells.some(a => has(a.x + 1, a.y, a.z) && has(a.x, a.y + 1, a.z) && has(a.x, a.y, a.z + 1))) return 99;
  let n = 0;
  for(let i = 0; i < cells.length; i++) for(let j = i + 1; j < cells.length; j++){
    const dx = cells[j].x - cells[i].x, dy = cells[j].y - cells[i].y, dz = cells[j].z - cells[i].z, p = [dx - dy, dx + dy - 2*dz];
    if(!p[0] && !p[1]) return 99;
    if(['1,1', '-1,-1', '-1,1', '1,-1', '0,2', '0,-2'].includes(p.join()) && Math.abs(dx) + Math.abs(dy) + Math.abs(dz) !== 1) n++;
  }
  return n;
}
/** the turn of a solid that misleads least (two such pairs at most: eight cubes in one piece cannot all be drawn clear of them) */
const poseOf = cells => { let best = null, lo = 3; shuffle(SOLID_TURNS.slice()).forEach(t => { const c = solidNorm(solidSpot(cells).map(t)), a = lookAlikes(c); if(a < lo){ lo = a; best = c; } }); return best; };
export function genViewBars(){
  for(;;){
    const yes = new Map(), no = new Map();
    for(let i = 0; i < 80 && (yes.size < 4 || no.size < 1); i++){
      const c = growSolid(8), name = solidName(c);
      if(yes.has(name) || no.has(name)) continue;
      const p = poseOf(c);
      if(p) (barsFit(c) ? yes : no).set(name, p);
    }
    if(yes.size < 4 || no.size < 1) continue;
    const good = [...yes.values()].slice(0, 4), bad = [...no.values()].find(c => !barsFit(c, true));
    if(!bad) continue;   // a child who read the false contacts as real would find it splits too: then no option would be the one that cannot
    const solids = shuffle(good.concat([bad])), pick = solids.indexOf(bad);
    return {kind:'viewcubes', shape:'bars', solids, fits: solids.map(barsFit), options: opt(solids, (c, id) => isoSvg(c, 20, LET[id], 100)), pick, own:true, ans: pick};
  }
}

// ---- drawing, worked line, hint and solution
const nameRow = (r, k) => r.map(c => NAME[c][k]).join(', ');
const sideBar = () => isoSvg([{ x: 0, y: 0, z: 0, c: 0 }, { x: 1, y: 0, z: 0, c: 0 }], 24, tr('блокче от две слепени кубчета', 'блок із двох склеєних кубиків'), 40);
function drawViewCubes(q){
  if(q.shape === 'row'){
    const w = q.n - 2;
    return '<div class="ask">' + tr('Показани са ' + q.n + ' кубчета, гледани отстрани. ' + cap(BGNUM[w]) + ' от кубчетата са бели, едното е сиво и едното е защриховано. <b>Как изглеждат кубчетата, гледани отгоре от високо?</b> (Редът отляво надясно е като на картинката.)',
      'Показано ' + ukN(q.n, 'кубик', 'кубики', 'кубиків') + ', вигляд збоку. Білих серед них ' + w + ', один сірий і один заштрихований. <b>Як виглядають кубики, якщо дивитися на них зверху?</b> (Порядок зліва направо такий самий, як на малюнку.)') + '</div>' +
      '<div class="fig">' + isoSvg(q.cells, 30, tr('кубчетата, гледани отстрани', 'кубики, вигляд збоку'), 100) + '</div>';
  }
  if(q.shape === 'box')
    return '<div class="ask">' + tr('В стъклената кутия вдясно са поставени ' + q.n + ' кубчета. Кубчетата лежат на дъното или едно върху друго, а съдържанието на кутията се вижда от всички страни. <b>Как изглежда снимка на кутията, направена отгоре?</b> Бялото кръгче в рисунката е най-далечният долен ъгъл на кутията. В снимките този ъгъл е горе вляво, ръбът, който тръгва от него надясно, тръгва надясно и в снимките, а ръбът наляво — надолу.',
      'У скляній коробці праворуч стоїть ' + ukN(q.n, 'кубик', 'кубики', 'кубиків') + '. Кубики лежать на дні або один на одному, а вміст коробки видно з усіх боків. <b>Як виглядає знімок коробки, зроблений зверху?</b> Білий кружечок на малюнку — найдальший нижній кут коробки. На знімках цей кут угорі ліворуч: ребро, що йде від нього вправо, йде вправо й на знімках, а ребро вліво — вниз.') + '</div>' +
      '<div class="fig">' + isoSvg(q.cells, 30, tr('шест кубчета в стъклена кутия', 'шість кубиків у скляній коробці'), 100, [PLAN, PLAN, 3], true) + '</div>';
  return '<div class="ask">' + tr('Имаш четири блокчета като показаното вдясно: двете кубчета във всяко от тях са слепени и не могат да се разделят. Блокчетата могат да се обръщат. <b>Коя от композициите НЕ може да се сглоби с тях?</b>',
    'Є чотири блоки, як показаний праворуч: два кубики в кожному склеєні й не розділяються. Блоки можна повертати. <b>Яку з композицій НЕ можна скласти з них?</b>') + '</div><div class="fig">' + sideBar() + '</div>';
}
function eqViewCubes(q){
  if(q.shape === 'row') return tr(nameRow(q.tops, 0), nameRow(q.tops, 1));
  if(q.shape === 'box') return (n => tr(n + ' стълба', ukN(n, 'стовпець', 'стовпці', 'стовпців')))(flat(q.foot).filter(Boolean).length);
  return tr('не става композицията ', 'не виходить композиція ') + LET[q.pick];
}
function whyViewCubes(q, full){
  if(!full){
    if(q.shape === 'row') return tr('Отгоре се вижда само най-горното кубче на всеки стълб. Какво е то във всеки стълб, като вървиш отляво надясно?', 'Зверху видно лише верхній кубик кожного стовпця. Який він у кожному стовпці, якщо йти зліва направо?');
    if(q.shape === 'box') return tr('Отгоре за всяко квадратче на пода е важно само дали над него има кубче. Колко и кои от тях са заети? Внимавай накъде е горе вляво.', 'Зверху для кожного квадрата підлоги важливо лише, чи є над ним кубик. Які квадрати зайняті? Зверни увагу, де вгорі ліворуч.');
    return tr('Опитай всяка композиция да я разделиш на четири двойки кубчета, които се допират. Тази, която не става, остава с кубче, за което няма двойка.', 'Спробуй розділити кожну композицію на чотири пари кубиків, що торкаються. Та, що не виходить, лишається з кубиком, якому немає пари.');
  }
  if(q.shape === 'row') return labelled(topRow(q.tops), tr('кубчетата отгоре', 'кубики зверху')) + '<br>' + tr('От всеки стълб се вижда само горното кубче: ' + nameRow(q.tops, 0) + '. Кубчетата под него не се виждат.', 'З кожного стовпця видно лише верхній кубик: ' + nameRow(q.tops, 1) + '. Кубиків під ним не видно.') + ' &nbsp;→&nbsp; <b>' + LET[q.pick] + '</b>';
  if(q.shape === 'box') return labelled(planSvg(q.foot), tr('кутията отгоре', 'коробка зверху')) + '<br>' + tr('Оцветени са квадратчетата, над които има кубче, на каквато и височина да е то. Белият кръг е горе вляво.', 'Зафарбовано квадрати, над якими є кубик, на якій би висоті він не був. Білий кружечок угорі ліворуч.') + ' &nbsp;→&nbsp; <b>' + LET[q.pick] + '</b>';
  return tr('Четири от композициите се разделят на четири двойки. Композиция ' + LET[q.pick] + ' не се разделя: остава кубче без съседно кубче за двойка.', 'Чотири композиції розбиваються на чотири пари. Композиція ' + LET[q.pick] + ' не розбивається: лишається кубик без сусіда для пари.') + ' &nbsp;→&nbsp; <b>' + LET[q.pick] + '</b>';
}
KIND.viewcubes = { draw:drawViewCubes, eq:eqViewCubes, why:whyViewCubes };
