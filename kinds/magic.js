// Question kind 'magic': level 100 Магически квадрат — One number is wrong: find what it should be.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Зима 2023, задача 12: 20 10 12 / 6 4 22 / 16 18 8 — every row, column and diagonal
// adds to 42 except those through the 4, so the 4 must be 14. One wrong number spoils exactly
// its own row, column and diagonals, and where they cross is the culprit.
const LO_SHU = [8, 1, 6, 3, 5, 7, 4, 9, 2];
const MAGIC_LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
function genMagic(){
  for(;;){
    const a = 1 + rnd(6), k = 1 + rnd(3), turn = rnd(8);
    let g = LO_SHU.map(v => a + k*(v - 1));
    // one of the eight turns and flips of the square
    for(let i = 0; i < turn % 4; i++) g = [6,3,0,7,4,1,8,5,2].map(j => g[j]);
    if(turn >= 4) g = [2,1,0,5,4,3,8,7,6].map(j => g[j]);
    const at = rnd(9), right = g[at], wrong = right + (rnd(2) ? 1 : -1)*k*(1 + rnd(5));
    if(wrong < 0 || g.includes(wrong)) continue;
    const shown = g.slice(); shown[at] = wrong;
    return {kind:'magic', g, shown, at, wrong, S: 3*g[4], ans: right};
  }
}
function drawMagic(q){
  if(q.kind === 'magic'){
    const cells = q.shown.map(v => '<td>' + v + '</td>');
    return '<div class="ask">' + tr('Кое число трябва да поставим вместо едно от числата, за да се получи <b>магически квадрат</b>?',
      'Яке число треба поставити замість одного з чисел, щоб вийшов <b>магічний квадрат</b>?') + '</div>' +
      '<table class="tix magic"><tr>' + cells.slice(0, 3).join('') + '</tr><tr>' + cells.slice(3, 6).join('') + '</tr><tr>' + cells.slice(6).join('') + '</tr></table>' +
      '<div class="note">' + tr('В магическия квадрат сборът на всеки ред, стълб и диагонал е един и същ.', 'У магічному квадраті сума кожного рядка, стовпця й діагоналі однакова.') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqMagic(q){
  if(q.kind === 'magic') return tr('сбор ', 'сума ') + q.S + ', ' + q.wrong + ' → ' + q.ans;
}
function whyMagic(q, full){
  if(q.kind === 'magic'){
    if(!full) return tr('Събери всеки ред и всеки стълб. Кое число е в реда и в стълба, които не пасват?', 'Додай кожен рядок і кожен стовпець. Яке число стоїть у рядку й стовпці, що не збігаються?');
    const r = Math.floor(q.at / 3), c = q.at % 3, row = [0, 1, 2].map(i => q.shown[3*r + i]), col = [0, 1, 2].map(i => q.shown[3*i + c]);
    const other = MAGIC_LINES.find(l => !l.includes(q.at)).map(i => q.shown[i]);
    return tr('сборът е ', 'сума ') + other.join(' + ') + ' = <b>' + q.S + '</b>, ' + tr('а ', 'а ') + row.join(' + ') + ' = ' + (row.reduce((x, y) => x + y) ) + tr(' и ', ' і ') + col.join(' + ') + ' = ' + col.reduce((x, y) => x + y) +
      ' &nbsp;→&nbsp; ' + tr('сгрешено е ', 'помилкове ') + q.wrong + tr(', другите две в реда му дават ', ', два інші в його рядку дають ') + (q.S - q.g[q.at]) + ' &nbsp;→&nbsp; ' + q.S + ' − ' + (q.S - q.g[q.at]) + ' = ' + q.ans;
  }
}
KIND.magic = { draw:drawMagic, eq:eqMagic, why:whyMagic };
