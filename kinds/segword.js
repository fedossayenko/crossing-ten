// Question kind 'segword': level 176 Три отсечки — Each segment told by how much longer or shorter
// it is than the one before. Generator, drawing, summary line and hints for this kind all live here;
// the level itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Пролет 2025, 1 клас, задача 14: the first is 12 см, the second 3 см shorter than the first, the
// third 8 см longer than the second. One step at a time: 12 − 3 = 9, then 9 + 8 = 17.
// [Bulgarian, Ukrainian, Bulgarian "drew", Ukrainian "drew"]
const SEGWORD_WHO = [['Мария', 'Марія', 'начертала', 'накреслила'], ['Петър', 'Петро', 'начертал', 'накреслив'],
                     ['Ива', 'Іва', 'начертала', 'накреслила'], ['Борис', 'Борис', 'начертал', 'накреслив']];
function genSegWord(){
  for(;;){
    const a = 8 + rnd(13), d1 = 2 + rnd(4), d2 = 2 + rnd(8), short1 = Math.random() < 0.6, long2 = Math.random() < 0.6;
    const b = short1 ? a - d1 : a + d1, c = long2 ? b + d2 : b - d2;
    if(b < 1 || c < 1 || b > 30 || c > 30) continue;
    return {kind:'segword', who: rnd(SEGWORD_WHO.length), a, d1, d2, short1, long2, b, ans: c};
  }
}
function drawSegWord(q){
  if(q.kind === 'segword'){
    const w = SEGWORD_WHO[q.who];
    return '<div class="ask">' + tr(w[0] + ' ' + w[2] + ' три отсечки. Първата е дълга <span class="num">' + q.a + '</span> см, втората е с <span class="num">' + q.d1 + '</span> см ' +
      (q.short1 ? 'по-къса' : 'по-дълга') + ' от първата, а третата отсечка е ' + (q.long2 ? 'по-дълга' : 'по-къса') + ' от втората с <span class="num">' + q.d2 + '</span> см. Колко сантиметра е <b>третата</b> отсечка?',
      w[1] + ' ' + w[3] + ' три відрізки. Перший завдовжки <span class="num">' + q.a + '</span> см, другий на <span class="num">' + q.d1 + '</span> см ' +
      (q.short1 ? 'коротший' : 'довший') + ' за перший, а третій відрізок ' + (q.long2 ? 'довший' : 'коротший') + ' за другий на <span class="num">' + q.d2 + '</span> см. Скільки сантиметрів має <b>третій</b> відрізок?') + '</div>' +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + SLOT + CM + '</div>';
  }
}
const segWordSteps = q => [q.a + (q.short1 ? ' − ' : ' + ') + q.d1 + ' = ' + q.b, q.b + (q.long2 ? ' + ' : ' − ') + q.d2 + ' = ' + q.ans];
function eqSegWord(q){
  if(q.kind === 'segword') return segWordSteps(q).join(', ');
}
// The picture: the three segments one under another, each with its length; the piece that one is
// longer or shorter than the one above it is marked orange.
function segWordSvg(q){
  const max = Math.max(q.a, q.b, q.ans), u = 200 / max, X = v => (40 + v*u).toFixed(1);
  let g = '';
  [q.a, q.b, q.ans].forEach((v, i) => { const y = 14 + i*30;
    g += '<g' + popAt(1 + 2*i) + '>' + svgText(16, y + 5, (i + 1) + '.', 12, 'var(--muted)') + '<line x1="40" y1="' + y + '" x2="' + X(v) + '" y2="' + y + '" stroke="var(--accent)" stroke-width="4" stroke-linecap="round"/>' +
      svgText(+X(v) + 18, y + 5, v, 12, 'var(--ink)') + '</g>';
    if(i){ const p = [q.a, q.b][i - 1], lo = Math.min(p, v), hi = Math.max(p, v);
      g += '<g' + popAt(2*i) + '><line x1="' + X(lo) + '" y1="' + (y - 30) + '" x2="' + X(lo) + '" y2="' + (y + 6) + '" stroke="var(--line)" stroke-width="1.4" stroke-dasharray="3 3"/>' +
        '<line x1="' + X(lo) + '" y1="' + (y - 8) + '" x2="' + X(hi) + '" y2="' + (y - 8) + '" stroke="var(--warm)" stroke-width="3"/>' +
        svgText(((+X(lo) + +X(hi)) / 2).toFixed(1), y - 12, [q.d1, q.d2][i - 1], 11, 'var(--warm)') + '</g>'; }
  });
  return '<svg viewBox="0 0 280 104" style="display:block; width:300px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + tr('трите отсечки', 'три відрізки') + '">' + g + '</svg>';
}
function whySegWord(q, full){
  if(q.kind === 'segword'){
    if(!full) return tr('Първо намери втората отсечка, после — третата.', 'Спершу знайди другий відрізок, потім — третій.');
    const s = segWordSteps(q);
    return segWordSvg(q) + tr('втората: ', 'другий: ') + s[0] + ' см &nbsp;→&nbsp; ' + tr('третата: ', 'третій: ') + s[1];
  }
}
KIND.segword = { draw:drawSegWord, eq:eqSegWord, why:whySegWord };
