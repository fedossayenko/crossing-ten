// Question kind 'mazebones': level 353 Кучето в лабиринта — A dog in a maze of walls: how many bones can it get to.

// Кенгуру 2026, 2 клас, задача 3: the dog Шаро runs in a maze, bones lie in its rooms; to how many bones can it get at most? The walls
// shut some rooms off from the others, so the dog reaches only the bones in the rooms joined to its own through gaps in the walls: the
// paper's key is 10. The maze is 6 rooms by 4, the gaps drawn at random, the dog in a random room. The answer is typed.
import { KIND, SVG_FONT, answerLine, popAt, rnd, svgFrame, svgText, tr } from '../js/core.js';
const R = 4, C = 6, U = 40;
// the rooms the dog can walk to: open is a list of 'r,c-r,c' gaps between neighbouring rooms, the room as r * C + c
export function mazeReach(open, dog){
  const gap = new Set(open), seen = new Set([dog]), todo = [dog];
  while(todo.length){
    const at = todo.pop(), r = Math.floor(at / C), c = at % C;
    [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].forEach(([nr, nc]) => {
      if(nr < 0 || nr >= R || nc < 0 || nc >= C) return;
      const to = nr * C + nc;
      if(seen.has(to) || !gap.has(Math.min(at, to) + '-' + Math.max(at, to))) return;
      seen.add(to); todo.push(to);
    });
  }
  return seen;
}
export function genMazeBones(){
  for(;;){
    const open = [];
    for(let r = 0; r < R; r++) for(let c = 0; c < C; c++){
      if(c < C - 1 && rnd(100) < 52) open.push((r * C + c) + '-' + (r * C + c + 1));
      if(r < R - 1 && rnd(100) < 52) open.push((r * C + c) + '-' + ((r + 1) * C + c));
    }
    const dog = rnd(R * C), bones = [];
    for(let i = 0; i < R * C; i++) if(i !== dog && rnd(100) < 75) bones.push(i);
    const reach = mazeReach(open, dog), mine = bones.filter(b => reach.has(b)).length;
    // the dog's own part holds most of the room count, not all: some bones are shut away, and the biggest shut-away part has plenty
    if(reach.size < 6 || reach.size > 15 || mine < 6 || mine > 12 || bones.length - mine < 4) continue;
    return {kind:'mazebones', open, dog, bones, traps:[bones.length], ans: mine};
  }
}
function maze(q, full){
  const W = C * U + 8, H = R * U + 8, reach = mazeReach(q.open, q.dog), gap = new Set(q.open), at = i => [4 + (i % C) * U, 4 + Math.floor(i / C) * U];
  let s = '';
  if(full) for(const i of reach){ const [x, y] = at(i); s += '<rect x="' + x + '" y="' + y + '" width="' + U + '" height="' + U + '" fill="var(--accentbg)"/>'; }
  let walls = '';
  for(let r = 0; r < R; r++) for(let c = 0; c < C; c++){
    const i = r * C + c, [x, y] = at(i);
    if(c < C - 1 && !gap.has(i + '-' + (i + 1))) walls += 'M' + (x + U) + ',' + y + ' v' + U + ' ';
    if(r < R - 1 && !gap.has(i + '-' + (i + C))) walls += 'M' + x + ',' + (y + U) + ' h' + U + ' ';
  }
  s += '<rect x="4" y="4" width="' + C * U + '" height="' + R * U + '" fill="none" stroke="var(--ink)" stroke-width="4"/><path d="' + walls + '" stroke="var(--ink)" stroke-width="4" stroke-linecap="round" fill="none"/>';
  const em = (i, t, size, dy) => { const [x, y] = at(i); return '<text x="' + (x + U / 2) + '" y="' + (y + U / 2 + dy) + '" text-anchor="middle" font-size="' + size + '" ' + SVG_FONT + '>' + t + '</text>\n'; };
  q.bones.forEach(b => { s += em(b, '🦴', 22, 8); });
  s += em(q.dog, '🐶', 26, 9);
  if(full){
    let k = 0;
    q.bones.filter(b => reach.has(b)).forEach(b => { const [x, y] = at(b); k++;
      s += '<g' + popAt(k * 0.6) + '><circle cx="' + (x + U - 9) + '" cy="' + (y + 9) + '" r="8" fill="var(--good)"/>' + svgText(x + U - 9, y + 13.5, k, 11, 'var(--solid)') + '</g>'; });
  }
  return svgFrame('0 0 ' + W + ' ' + H, W, tr('лабиринт със стени, кучето и кокалите', 'лабіринт зі стінами, собака й кістки')) + s + '</svg>';
}
function drawMazeBones(q){
  return '<div class="ask">' + tr('Кучето Шаро тича в лабиринта. До колко кокала най-много може да стигне Шаро?', 'Собака Шаро бігає лабіринтом. До скількох кісток найбільше може дістатися Шаро?') + '</div>' +
    '<div class="fig maze">' + maze(q, false) + '</div>' + answerLine('xl');
}
const eqMaze = q => tr('кокалите в стаите, до които стига: ', 'кістки в кімнатах, до яких він дістається: ') + q.ans;
function whyMazeBones(q, full){
  if(!full) return tr('Шаро не може да минава през стени. Намери всички места, до които стига, като тръгнеш от него, и брой само кокалите там. Кокалите зад стените не се броят.',
    'Шаро не може проходити крізь стіни. Знайди всі місця, до яких він дістається, і порахуй кістки лише там. Кістки за стінами не рахуються.') + '<div class="fig maze">' + maze(q, false) + '</div>';
  return tr('Шаро стига до оцветените стаи; кокалите в тях са: ', 'Шаро дістається до зафарбованих кімнат; кісток у них: ') + maze(q, true) + '<div><b>' + q.ans + '</b></div>';
}
KIND.mazebones = { draw:drawMazeBones, eq:eqMaze, why:whyMazeBones };
