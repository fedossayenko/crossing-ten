// Question kind 'ladygrid': level 408 Калинки в таблица — A 4 × 4 table, a ladybug with 1–4 dots in each square, none repeated in a row or column: the top row.

// Кенгуру 2025, 2 клас, задача 21: four ladybugs are given (3 dots, 4, 4, 1 in rows 2–4); in the table, every row and column holds 1, 2, 3 and
// 4 dots once. Of all ways to fill it only one top row is possible, 4 2 3 1 (key A). The kind takes a full table, shows four ladybugs below the top
// row that leave one top row only, and offers five top rows: the right one and four that no way of filling the table gives (some break a
// shown ladybug at once, some only later). The answer is a picture, so the kind brings its own five options.
import { KIND, rnd, shuffle, tr } from '../js/core.js';

/** every 4 × 4 table of 1–4 with none repeated in a row or column (576 of them), by rows of digits */
export const LADY_ALL = (() => {
  const perms = [], out = [];
  (function p(/** @type {number[]} */ a, /** @type {number[]} */ r){ if(!a.length){ perms.push(r.join('')); return; } a.forEach((x, i) => p(a.filter((_, j) => j !== i), r.concat(x))); })([1, 2, 3, 4], []);
  (function go(/** @type {string[]} */ rows){
    if(rows.length === 4){ out.push(rows); return; }
    perms.forEach(r => { if(rows.every(o => [...r].every((x, j) => x !== o[j]))) go(rows.concat(r)); });
  })([]);
  return out;
})();
const agree = (/** @type {string} */ a, /** @type {string} */ b) => [...a].filter((x, i) => x === b[i]).length;
/** the tables that fit the ladybugs shown: [row, column, dots] each */
export const ladyFits = (/** @type {number[][]} */ given) => LADY_ALL.filter(t => given.every(([i, j, d]) => +t[i][j] === d));
export function genLadyGrid(){
  const cellsAll = [];
  for(let i = 1; i < 4; i++) for(let j = 0; j < 4; j++) cellsAll.push([i, j]);
  for(;;){
    const t = LADY_ALL[rnd(LADY_ALL.length)], given = shuffle(cellsAll.slice()).slice(0, 4).map(([i, j]) => [i, j, +t[i][j]]);
    const fits = ladyFits(given), tops = new Set(fits.map(f => f[0]));
    if(tops.size !== 1) continue;
    const right = t[0], perms = [...new Set(LADY_ALL.map(x => x[0]))];
    const bad = shuffle(perms.filter(p => p !== right && !fits.some(f => f[0] === p)));
    const direct = (/** @type {string} */ p) => given.some(([, j, d]) => +p[j] === d);   // the same dots in the same column as a shown ladybug
    const wrong = bad.filter(direct).slice(0, 3).concat(bad.filter(p => !direct(p)).slice(0, 1));
    if(wrong.length < 4 || (new Set(wrong)).size < 4) continue;
    const all = [right].concat(wrong), near = all.map(w => all.reduce((s, x) => s + (x === w ? 0 : agree(w, x)), 0));
    if(near[0] === Math.max(...near) && near.filter(x => x === near[0]).length === 1) continue;
    const opts = shuffle(all.slice()), pick = opts.indexOf(right);
    return {kind:'ladygrid', given, right, options: opts.map((w, id) => ({ id, v: id, text: [rowPic(w, 0), rowPic(w, 1)] })), pick, own:true, ans: pick};
  }
}
// the dots of a ladybug: left wing first, then the right wing
const DOTS = [[[5, 1]], [[-5, -3], [5, 3]], [[-5, -5], [-5, 5], [5, 0]], [[-5, -5], [-5, 5], [5, -5], [5, 5]]];
function bug(/** @type {number} */ d, /** @type {number} */ x, /** @type {number} */ y){
  return '<g class="lb" transform="translate(' + x + ',' + y + ')" stroke="var(--ink)" stroke-width="1.6"><path d="M-5,-12 Q0,-19 5,-12" fill="var(--ink)" stroke="none"/><ellipse cx="0" cy="2" rx="12" ry="13" fill="var(--bad)"/>' +
    '<path d="M0,-11 V15" fill="none"/>' + DOTS[d - 1].map(([a, b]) => '<circle class="dot" cx="' + a + '" cy="' + (b + 2) + '" r="2.6" fill="var(--ink)" stroke="none"/>').join('') + '</g>';
}
const dotsText = (/** @type {string} */ w, /** @type {number} */ k) => [...w].map(d => d + (k ? ' кр.' : ' т.')).join(', ');
function rowPic(/** @type {string} */ w, /** @type {number} */ k){
  return '<svg viewBox="0 0 176 46" width="176" height="46" role="img" aria-label="' + (k ? 'ряд сонечок із цятками: ' : 'ред калинки с точки: ') + dotsText(w, k) + '"><g fill="var(--solid)" stroke="var(--ink)" stroke-width="1.6">' +
    [0, 1, 2, 3].map(j => '<rect x="' + (2 + j*43) + '" y="2" width="43" height="42"/>').join('') + '</g>' + [...w].map((d, j) => bug(+d, 2 + j*43 + 21.5, 22)).join('') + '</svg>';
}
function tableSvg(q){
  const u = 48;
  let g = '';
  for(let i = 0; i < 4; i++) for(let j = 0; j < 4; j++) g += '<rect x="' + (2 + j*u) + '" y="' + (2 + i*u) + '" width="' + u + '" height="' + u + '" fill="var(--solid)" stroke="var(--ink)" stroke-width="2"/>';
  q.given.forEach((/** @type {number[]} */ [i, j, d]) => { g += bug(d, 2 + j*u + u/2, 2 + i*u + 24); });
  return '<svg viewBox="0 0 ' + (4*u + 4) + ' ' + (4*u + 4) + '" style="display:block; width:200px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + tr('таблица 4 на 4, горният ред е празен; калинки: ', 'таблиця 4 на 4, верхній рядок порожній; сонечка: ') +
    q.given.map((/** @type {number[]} */ [i, j, d]) => tr('ред ', 'рядок ') + (i + 1) + tr(', колона ', ', стовпець ') + (j + 1) + ': ' + d).join('; ') + '">' + g + '</svg>';
}
function drawLadyGrid(q){
  return '<div class="ask">' + tr('Поставете в квадратчетата на таблицата вдясно по една калинка с 1, 2, 3 или 4 точки, така че във всеки ред и във всяка колонка да няма калинки с един и същ брой точки. <b>Как ще изглеждат четирите квадратчета в най-горния ред на таблицата?</b>',
    'Покладіть у клітинки таблиці праворуч по одному сонечку з 1, 2, 3 або 4 цятками так, щоб у кожному рядку й у кожному стовпці не було сонечок з однаковою кількістю цяток. <b>Як виглядатимуть чотири клітинки в найвищому рядку таблиці?</b>') + '</div>' + tableSvg(q);
}
function eqLadyGrid(q){
  return tr('най-горният ред: ', 'найвищий рядок: ') + [...q.right].join(', ');
}
function whyLadyGrid(q, full){
  if(!full) return tr('Започни от реда и колоната, където калинките вече стоят. Във всеки ред и колона всеки брой точки е по веднъж: така отпадат възможностите, докато остане една.', 'Почни з рядка й стовпця, де сонечка вже стоять. У кожному рядку й стовпці кожна кількість цяток є по одному разу: так відпадають можливості, поки не лишиться одна.');
  return tr('Само един най-горен ред е възможен: ', 'Можливий лише один найвищий рядок: ') + '<b>' + [...q.right].join(' ') + '</b>';
}
KIND.ladygrid = { draw:drawLadyGrid, eq:eqLadyGrid, why:whyLadyGrid };
