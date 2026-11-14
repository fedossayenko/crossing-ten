// Question kind 'codegrid': level 402 Шифър по таблица — A table of letters, a code of squares (B4|D2|A2|A4): which word it spells.

// Кенгуру 2021, 2 клас, задача 12: columns A–D, rows 1–4 of letters К Р С А / Л К Я О / Е И П К / А К Т Н; the word ПЛИСКА has the code
// C3|A2|B3|C1|A1|D1 (the first square of each letter, reading the table like a page), and B4|D2|A2|A4 is К О Л А (key E). The answer is a
// word among five, so the kind brings its own options: other words of the same table (any of them can be written with its letters),
// chosen so that the right one is not the word the other four resemble most (a vote on the letters would give it away).
import { KIND, rnd, shuffle, svgText, tr } from '../js/core.js';

// the tables, by row, and the words every one of whose letters is in the table
export const CODE_GRIDS = [
  { g: ['КРСА', 'ЛКЯО', 'ЕИПК', 'АКТН'], ex: 'ПЛИСКА',
    words: ['КОЛА', 'КРАН', 'РАНА', 'ПЛАН', 'СКОК', 'КАТЯ', 'ПАНК', 'ТАНК', 'СЛОН', 'ПОСТ', 'РОСА', 'КОРА'] },
  { g: ['МАСР', 'ОЗКИ', 'БЛПВ', 'ДЖУН'], ex: 'ЗИМА', words: ['МАСА', 'РОЗА', 'КОЗА', 'РИБА', 'ЛИПА', 'ВОДА', 'ЖАБА', 'ЛУНА', 'КОЛА', 'ПИЛА', 'ЛАМА', 'ВИЗА', 'ЗАЛА'] },
];
const COLS = 'ABCD';
/** the layouts a question draws: the two tables, each as printed and with every row read right to left */
export const CODE_LAYOUTS = CODE_GRIDS.flatMap((t, k) => [0, 1].map(m => ({ k, m, g: t.g.map(r => m ? [...r].reverse().join('') : r), words: t.words, ex: t.ex })));
const cellsOf = (/** @type {string[]} */ g, /** @type {string} */ ch) => { const o = []; g.forEach((r, i) => [...r].forEach((x, j) => { if(x === ch) o.push(COLS[j] + (i + 1)); })); return o; };   // reading order
export const decodeCell = (/** @type {string[]} */ g, /** @type {string} */ cell) => g[+cell[1] - 1][COLS.indexOf(cell[0])];
const agree = (/** @type {string} */ a, /** @type {string} */ b) => [...a].filter((x, i) => x === b[i]).length;
export function genCodeGrid(){
  for(;;){
    const lay = rnd(CODE_LAYOUTS.length), L = CODE_LAYOUTS[lay], word = L.words[rnd(L.words.length)];
    const code = [...word].map(ch => { const c = cellsOf(L.g, ch); return c[rnd(c.length)]; });
    const words = [word].concat(shuffle(L.words.filter(w => w !== word)).slice(0, 4));
    // the right word must not be the one the other four are closest to, letter by letter
    const near = words.map(w => words.reduce((s, x) => s + (x === w ? 0 : agree(w, x)), 0));
    if(near[0] === Math.max(...near) && near.filter(x => x === near[0]).length === 1) continue;
    const opts = shuffle(words.slice()), pick = opts.indexOf(word);
    return {kind:'codegrid', lay, code, word, options: opts.map((w, id) => ({ id, v: id, text: [w, w] })), pick, own:true, ans: pick};
  }
}
const exCode = (/** @type {{g: string[], ex: string}} */ L) => [...L.ex].map(ch => cellsOf(L.g, ch)[0]).join('|');
function tableSvg(q){
  const L = CODE_LAYOUTS[q.lay], u = 40, W = 4*u + 30, H = 4*u + 30;
  let g = '';
  for(let j = 0; j < 4; j++) g += svgText(26 + j*u + u/2, 18, COLS[j], 16, 'var(--accent)', ' font-style="italic"');
  for(let i = 0; i < 4; i++){
    g += svgText(10, 26 + i*u + u/2 + 6, i + 1, 16, 'var(--accent)', ' font-style="italic"');
    for(let j = 0; j < 4; j++) g += '<rect x="' + (26 + j*u) + '" y="' + (26 + i*u) + '" width="' + u + '" height="' + u + '" fill="var(--solid)" stroke="var(--accent)" stroke-width="2"/>' +
      svgText(26 + j*u + u/2, 26 + i*u + u/2 + 7, L.g[i][j], 20, 'var(--ink)', ' class="cl"');
  }
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" style="display:block; width:' + Math.min(W*1.5, 300) + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('таблица с букви, колони A–D, редове 1–4: ', 'таблиця з літерами, стовпці A–D, рядки 1–4: ') + L.g.map((r, i) => (i + 1) + ': ' + [...r].join(' ')).join('; ') + '">' + g + '</svg>';
}
function drawCodeGrid(q){
  const L = CODE_LAYOUTS[q.lay];
  return '<div class="ask">' + tr('С помощта на таблицата вдясно могат да се изчитат и да се кодират думи. Например думата ' + L.ex + ' има код ' + exCode(L) + '. <b>Коя е думата с код ' + q.code.join('|') + '?</b>',
    'За допомогою таблиці праворуч можна читати й кодувати слова. Наприклад, слово ' + L.ex + ' має код ' + exCode(L) + '. <b>Яке слово має код ' + q.code.join('|') + '?</b>') + '</div>' + tableSvg(q);
}
function eqCodeGrid(q){
  return q.code.join('|') + ' → ' + tr('думата ', 'слово ') + q.word;
}
function whyCodeGrid(q, full){
  if(!full) return tr('Намери всеки код в таблицата: буквата е в колоната и реда му. Подреди буквите една след друга.', 'Знайди кожен код у таблиці: літера стоїть у його стовпці й рядку. Склади літери одну за одною.');
  const L = CODE_LAYOUTS[q.lay];
  return q.code.map(c => c + ' = ' + decodeCell(L.g, c)).join('<br>') + '<br>' + tr('Думата е ', 'Слово — ') + '<b>' + q.word + '</b>';
}
KIND.codegrid = { draw:drawCodeGrid, eq:eqCodeGrid, why:whyCodeGrid };
