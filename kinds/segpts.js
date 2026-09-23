// Question kind 'segpts': level 70 Точки на отсечка — Points that cut a segment into equal parts, plus a piece beyond.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Есен, 3 клас, задача 12: B on AC, 5 cm from C; 5 points split AB into equal parts of 5 cm.
// Five points make six parts, so AB = 30 and AC = 35 (not 5 · 5 + 5).
function genSegPts(){
  const k = 3 + rnd(5), p = 2 + rnd(5), d = 2 + rnd(8), ans = (k + 1)*p + d;
  return {kind:'segpts', k, p, d, ans, traps: [k*p + d, (k - 1)*p + d]};
}
function drawSegPts(q){
  if(q.kind === 'segpts'){
    return '<div class="ask">' + tr('Върху отсечката <b>AC</b> е отбелязана точка <b>B</b>, която се намира на разстояние <span class="num">' + q.d +
      '</span> см от точка <b>C</b>. След това върху отсечката <b>AB</b> са отбелязани <span class="num">' + q.k +
      '</span> точки, които я разделят на равни части с дължина <span class="num">' + q.p + '</span> см всяка. Колко сантиметра е дължината на отсечката <b>AC</b>?',
      'На відрізку <b>AC</b> позначено точку <b>B</b>, яка знаходиться на відстані <span class="num">' + q.d +
      '</span> см від точки <b>C</b>. Потім на відрізку <b>AB</b> позначено <span class="num">' + q.k + '</span> ' + (q.k < 5 ? 'точки' : 'точок') +
      ', які ділять його на рівні частини завдовжки <span class="num">' + q.p + '</span> см кожна. Скільки сантиметрів становить довжина відрізка <b>AC</b>?') +
      '</div><div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT + CM + '</div>';
  }
}
function eqSegPts(q){
  if(q.kind === 'segpts') return (q.k + 1) + ' · ' + q.p + ' + ' + q.d + ' = ' + q.ans + ' см';
}
function whySegPts(q, full){
  if(q.kind === 'segpts'){
    if(!full) return tr('Точките вътре в отсечката я делят на една част повече, отколкото са те.', 'Точки всередині відрізка ділять його на одну частину більше, ніж їх самих.');
    return q.k + tr(' точки → ', ' точок → ') + (q.k + 1) + tr(' части', ' частин') + ' &nbsp;→&nbsp; AB = ' + (q.k + 1) + ' · ' + q.p + ' = ' + (q.k + 1)*q.p +
      ' &nbsp;→&nbsp; AC = ' + (q.k + 1)*q.p + ' + ' + q.d + ' = ' + q.ans + ' см';
  }
}
KIND.segpts = { draw:drawSegPts, eq:eqSegPts, why:whySegPts };
