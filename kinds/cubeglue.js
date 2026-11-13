// Question kind 'cubeglue': level 381 Капки лепило — Cubes stuck together: one drop for every two that touch.

// Кенгуру 2023, 2 клас, задача 15: a building of 12 cubes, every two cubes with a common face stuck by one drop of glue. How many
// drops? Here the building is a 3-D model and the drops are counted from it, pair by pair: a building grown cube by cube,
// each new one against the others it touches. A building with no loop (every new cube touches just one) takes one drop fewer
// than it has cubes: 12 cubes, 11 drops.
import { KIND, answerLine, rnd, tr, ukN } from '../js/core.js';
import { isoReadable, isoSvg, touching } from './isocubes.js';

const DIRS = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
export function genCubeGlue(){
  for(;;){
    const n = 6 + rnd(7), loops = rnd(2) === 1, cells = [{ x: 1, y: 1, z: 0 }];
    for(let guard = 0; cells.length < n && guard < 400; guard++){
      const from = cells[rnd(cells.length)], d = DIRS[rnd(rnd(3) ? 4 : 6)], c = { x: from.x + d[0], y: from.y + d[1], z: from.z + d[2] };
      if(c.x < 0 || c.y < 0 || c.z < 0 || c.x > 4 || c.y > 4 || c.z > 2 || cells.some(o => o.x === c.x && o.y === c.y && o.z === c.z)) continue;
      const near = cells.filter(o => Math.abs(o.x - c.x) + Math.abs(o.y - c.y) + Math.abs(o.z - c.z) === 1).length;
      if(!loops && near > 1) continue;
      cells.push(c);
    }
    if(cells.length < n || !isoReadable(cells)) continue;
    return {kind:'cubeglue', n, cells, ans: touching(cells).length};
  }
}
function drawCubeGlue(q){
  return '<div class="ask">' + tr('Показана е конструкция от ' + q.n + ' кубчета. Всеки две кубчета с обща стена са залепени с по една капка лепило. Колко капки лепило са използвани?',
    'Показано конструкцію з ' + ukN(q.n, 'кубик', 'кубики', 'кубиків') + '. Кожні два кубики зі спільною гранню склеєні однією краплею клею. Скільки крапель клею використано?') + '</div>' +
    '<div class="fig">' + isoSvg(q.cells, 30, tr('конструкция от ' + q.n + ' кубчета', 'конструкція з ' + ukN(q.n, 'кубик', 'кубики', 'кубиків')), 100) + '</div>' + answerLine('xl');
}
function eqCubeGlue(q){
  return q.cells.map((c, i) => touching(q.cells.slice(0, i + 1)).filter(p => p[1] === i).length).join(' + ') + ' = ' + q.ans;
}
function whyCubeGlue(q, full){
  if(!full) return tr('Брой двойките кубчета, които се допират. Върви кубче по кубче и не брой една двойка два пъти.', 'Рахуй пари кубиків, які торкаються. Йди кубик за кубиком і не рахуй одну пару двічі.');
  const per = q.cells.map((c, i) => touching(q.cells.slice(0, i + 1)).filter(p => p[1] === i).length);
  const lab = isoSvg(q.cells.map((c, i) => Object.assign({}, c, { t: i + 1 })), 30, tr('същите кубчета с номера', 'ті самі кубики з номерами'), 100);
  return '<div class="fig">' + lab + '</div>' + tr('Номерирах кубчетата. Всяко ново се залепва за ' + per.join(', ') + ' от предишните', 'Я пронумерував кубики. Кожен новий приклеєно до попередніх: ' + per.join(', ')) +
    ' &nbsp;→&nbsp; ' + per.join(' + ') + ' = <b>' + q.ans + '</b>';
}
KIND.cubeglue = { draw:drawCubeGlue, eq:eqCubeGlue, why:whyCubeGlue };
