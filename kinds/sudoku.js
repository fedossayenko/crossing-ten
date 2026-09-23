// Question kind 'sudoku': level 54 Судоку — Four by four: every row, column and box holds 1 to 4 once.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 5: a four by four sudoku. Every row, every column and every bold two by two box
// holds 1, 2, 3 and 4 exactly once. Two empty cells are named and their sum is asked.
// Cells are counted 0..15, reading across.
function sudokuFits(g, at, v){
  const r = (at / 4) | 0, c = at % 4, br = r - r % 2, bc = c - c % 2;
  for(let i = 0; i < 4; i++) if(g[r*4 + i] === v || g[i*4 + c] === v) return false;
  for(let i = 0; i < 2; i++) for(let j = 0; j < 2; j++) if(g[(br+i)*4 + bc + j] === v) return false;
  return true;
}
// Stops at two, since all we ever ask is whether the puzzle has one answer or more.
function sudokuCount(g){
  const at = g.indexOf(0);
  if(at < 0) return 1;
  let n = 0;
  for(let v = 1; v <= 4 && n < 2; v++){
    if(!sudokuFits(g, at, v)) continue;
    g[at] = v;
    n += sudokuCount(g);
    g[at] = 0;
  }
  return n;
}
// One valid grid, shuffled every way that keeps it valid.
function sudokuGrid(){
  const map = shuffle([1,2,3,4]);
  let m = [[1,2,3,4],[3,4,1,2],[2,1,4,3],[4,3,2,1]].map(r => r.map(v => map[v-1]));
  const rows = o => o.map(i => m[i]);
  if(Math.random() < 0.5) m = rows([1,0,2,3]);
  if(Math.random() < 0.5) m = rows([0,1,3,2]);
  if(Math.random() < 0.5) m = rows([2,3,0,1]);
  const cols = o => m.map(r => o.map(i => r[i]));
  if(Math.random() < 0.5) m = cols([1,0,2,3]);
  if(Math.random() < 0.5) m = cols([0,1,3,2]);
  if(Math.random() < 0.5) m = cols([2,3,0,1]);
  if(Math.random() < 0.5) m = m[0].map((_, c) => m.map(r => r[c]));
  return [].concat.apply([], m);
}
function genSudoku(){
  for(;;){
    const sol = sudokuGrid(), g = sol.slice();
    const want = 6 + rnd(3);
    const blank = [];
    for(const at of shuffle(sol.map((_, i) => i))){
      if(blank.length >= want) break;
      g[at] = 0;
      if(sudokuCount(g.slice()) === 1) blank.push(at); else g[at] = sol[at];
    }
    if(blank.length < 6) continue;
    const two = shuffle(blank.slice()).slice(0, 2).sort((a, b) => a - b);
    return {kind:'sudoku', g, sol, X: two[0], Y: two[1], ans: sol[two[0]] + sol[two[1]]};
  }
}
function sudokuSvg(q){
  const u = 42, P = 4;
  let cells = '';
  for(let i = 0; i < 16; i++){
    const r = (i / 4) | 0, c = i % 4;
    const t = i === q.X ? 'X' : i === q.Y ? 'Y' : q.g[i] ? String(q.g[i]) : '';
    if(t) cells += '<text x="' + (P + c*u + u/2) + '" y="' + (P + r*u + u/2 + 8) +
      '" text-anchor="middle" font-size="22" font-weight="700" fill="var(--ink)" ' +
      'font-family="Nunito, sans-serif">' + t + '</text>';
  }
  let lines = '';
  for(let k = 0; k <= 4; k++){
    const w = k % 2 === 0 ? 3 : 1.2, at = P + k*u;
    lines += '<line x1="' + at + '" y1="' + P + '" x2="' + at + '" y2="' + (P + 4*u) + '" stroke-width="' + w + '"/>' +
             '<line x1="' + P + '" y1="' + at + '" x2="' + (P + 4*u) + '" y2="' + at + '" stroke-width="' + w + '"/>';
  }
  return '<div class="fig"><svg viewBox="0 0 ' + (4*u + 2*P) + ' ' + (4*u + 2*P) +
    '" role="img" aria-label="судоку четири на четири">' +
    '<g stroke="var(--ink)" stroke-linecap="square">' + lines + '</g>' + cells + '</svg></div>';
}

function drawSudoku(q){
  if(q.kind === 'sudoku'){
    return '<div class="ask">Попълнете празните квадратчета с <span class="num">1</span>, <span class="num">2</span>, ' +
      '<span class="num">3</span> или <span class="num">4</span> така, че във всеки <b>ред</b>, всеки <b>стълб</b> ' +
      'и всяко <b>удебелено квадратче</b> числата от 1 до 4 да стоят точно по веднъж. ' +
      'Колко е <b>сборът</b> на числата в <b>X</b> и <b>Y</b>?</div>' +
      sudokuSvg(q) +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqSudoku(q){
  if(q.kind === 'sudoku') return 'судоку → X = ' + q.sol[q.X] + ', Y = ' + q.sol[q.Y] + ' → ' + q.ans;
}
function whySudoku(q, full){
  if(q.kind === 'sudoku'){
    if(!full) return 'Търси ред, стълб или квадратче, в което липсва само едно число.';
    // the whole solved grid, so she can see where her own filling went wrong
    const rows = [0,1,2,3].map(r => q.sol.slice(r*4, r*4 + 4).join(''));
    return 'решението е <b>' + rows.join(' / ') + '</b> &nbsp;→&nbsp; X = ' + q.sol[q.X] + ', Y = ' +
      q.sol[q.Y] + ' &nbsp;→&nbsp; ' + q.sol[q.X] + ' + ' + q.sol[q.Y] + ' = ' + q.ans;
  }
}
KIND.sudoku = { draw:drawSudoku, eq:eqSudoku, why:whySudoku };
