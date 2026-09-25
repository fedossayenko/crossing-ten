// Question kind 'weights': level 104 Тежестите — Three weights, both pans, every packet from 1 up.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Зима 2022, задача 17: weights of 1, 2 and x kg weigh every packet from 1 to 10 kg. The
// heaviest packet needs all three: 1 + 2 + x = 10, so x = 7 — and then 4, 5, 6 come from putting
// a small weight on the packet's pan (7 − 3, 7 − 2, 7 − 1). Checked by trying every placing.
function weighable(ws){
  const got = new Set();
  (function walk(i, s){ if(i === ws.length){ if(s > 0) got.add(s); return; } walk(i + 1, s); walk(i + 1, s + ws[i]); walk(i + 1, s - ws[i]); })(0, 0);
  return got;
}
function genWeights(){
  for(;;){
    const pairs = [[1, 2], [1, 3], [2, 3], [1, 4]], [a, b] = pairs[rnd(pairs.length)];
    const x = b + 1 + rnd(10), N = a + b + x, all = weighable([a, b, x]);
    if(![...Array(N).keys()].every(v => all.has(v + 1))) continue;
    // exactly one x does it, among every weight up to 30
    const fits = []; for(let y = 1; y <= 30; y++) if(y !== a && y !== b){ const w = weighable([a, b, y]); if([...Array(N).keys()].every(v => w.has(v + 1))) fits.push(y); }
    if(fits.length !== 1) continue;
    return {kind:'weights', a, b, N, ans: x};
  }
}
function drawWeights(q){
  if(q.kind === 'weights'){
    return '<div class="ask">' + tr('С три различни тежести от <span class="num">' + q.a + '</span> кг, <span class="num">' + q.b + '</span> кг и <b>x</b> кг можем да претеглим на везна всеки пакет с тегло от <span class="num">1</span> кг до <span class="num">' + q.N + '</span> кг. Кое е числото x?',
      'Трьома різними гирями по <span class="num">' + q.a + '</span> кг, <span class="num">' + q.b + '</span> кг і <b>x</b> кг можна зважити на терезах кожен пакет вагою від <span class="num">1</span> кг до <span class="num">' + q.N + '</span> кг. Яке число x?') + '</div>' +
      '<div class="note">' + tr('Тежести може да се слагат и на двете блюда.', 'Гирі можна класти на обидві шальки.') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">x = ' + SLOT + '</div>';
  }
}
function eqWeights(q){
  if(q.kind === 'weights') return q.a + ' + ' + q.b + ' + x = ' + q.N + ' → x = ' + q.ans;
}
function whyWeights(q, full){
  if(q.kind === 'weights'){
    if(!full) return tr('Кой е най-тежкият пакет? За него трябват и трите тежести.', 'Який пакет найважчий? Для нього потрібні всі три гирі.');
    const x = q.ans, mid = [];
    for(let v = q.a + q.b + 1; v < x; v++) mid.push(v);          // lighter than x: the small ones go on the packet's pan
    return tr('най-тежкият: ', 'найважчий: ') + q.a + ' + ' + q.b + ' + x = ' + q.N + ' &nbsp;→&nbsp; x = <b>' + x + '</b>' +
      (mid.length ? tr('; а между тях: ', '; а між ними: ') + mid.map(v => v + ' = ' + x + ' − ' + (x - v)).join(', ') : '') + ' &nbsp;→&nbsp; x = ' + x;
  }
}
KIND.weights = { draw:drawWeights, eq:eqWeights, why:whyWeights };
