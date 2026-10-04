// Question kind 'cuckoo': level 116 Кукувичката — So many times in so many seconds: how many in longer.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Зима 2020, задача 13: the clock's cuckoo calls 3 times every 4 seconds; in 16 seconds that is
// four lots of 4 seconds, so 4 · 3 = 12 calls.
function genCuckoo(){
  const k = 2 + rnd(4), s = 2 + rnd(5), m = 2 + rnd(4);
  return {kind:'cuckoo', k, s, m, t: s*m, ans: k*m};
}
function drawCuckoo(q){
  if(q.kind === 'cuckoo'){
    return '<div class="ask">' + tr('Кукувичката от часовника кука по <span class="num">' + q.k + '</span> пъти за <span class="num">' + q.s + '</span> секунди. Колко пъти ще изкука кукувичката за <span class="num">' + q.t + '</span> секунди?',
      'Зозуля з годинника кукає по <span class="num">' + ukN(q.k, 'разу', 'рази', 'разів').replace(' ', '</span> ') + ' за <span class="num">' + ukN(q.s, 'секунду', 'секунди', 'секунд').replace(' ', '</span> ') + '. Скільки разів вона кукне за <span class="num">' + ukN(q.t, 'секунду', 'секунди', 'секунд').replace(' ', '</span> ') + '?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqCuckoo(q){
  if(q.kind === 'cuckoo') return q.t + ' : ' + q.s + ' = ' + q.m + ', ' + q.m + ' · ' + q.k + ' = ' + q.ans;
}
// The picture counts both at once, with no proportion: the time line is cut into lots of so many
// seconds, each lot fills with its calls, and the seconds below and the calls above run on together
// (4, 8, 12, 16 seconds; 3, 6, 9, 12 calls) until the time is used up.
function cuckooSvg(q){
  const w = 50, x = i => 40 + i * w, end = x(q.m);
  let g = '<line x1="34" y1="0" x2="' + (end + 6) + '" y2="0" stroke="var(--line)" stroke-width="2"/>' +
    svgText(14, 17, tr('сек.', 'сек.'), 10, 'var(--muted)') + svgText(14, -27, tr('пъти', 'разів'), 10, 'var(--warm)') + svgText(x(0), 17, 0, 11, 'var(--muted)');
  for(let i = 0; i < q.m; i++){
    let dots = '';
    for(let j = 0; j < q.k; j++) dots += '<circle cx="' + (x(i) + w / 2 + (j - (q.k - 1) / 2) * 9) + '" cy="-12" r="3.6" fill="var(--warm)"/>';
    g += '<g' + popAt(1 + i * 1.5) + '><rect x="' + (x(i) + 2) + '" y="-5" width="' + (w - 4) + '" height="10" rx="5" fill="var(--accent)" opacity=".25"/>' +
      '<line x1="' + x(i + 1) + '" y1="-5" x2="' + x(i + 1) + '" y2="5" stroke="var(--ink)" stroke-width="2"/>' + dots +
      svgText(x(i + 1), 17, (i + 1) * q.s, 11, 'var(--ink)') + svgText(x(i) + w / 2, -25, (i + 1) * q.k, 13, 'var(--warm)') + '</g>';
  }
  g += svgText((40 + end) / 2, 44, Array(q.m).fill(q.k).join(' + ') + ' = ' + q.ans, 15, 'var(--ink)', popAt(2 + q.m * 1.5));
  return '<svg viewBox="0 -42 ' + (end + 16) + ' 94" style="display:block; width:' + Math.round((end + 16) * 1.3) + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('секундите и кукането заедно', 'секунди й кування разом') + '">' + g + '</svg>';
}
function whyCuckoo(q, full){
  if(q.kind === 'cuckoo'){
    if(!full) return tr('Колко пъти по толкова секунди се събират в цялото време?', 'Скільки разів по стільки секунд уміщається в увесь час?');
    return tr(q.t + ' секунди са ' + q.m + ' пъти по ', ukN(q.t, 'секунда', 'секунди', 'секунд') + ' — це ' + ukN(q.m, 'раз', 'рази', 'разів') + ' по ') + q.s + ' &nbsp;→&nbsp; ' + q.m + ' · ' + q.k + ' = ' + q.ans + cuckooSvg(q);
  }
}
KIND.cuckoo = { draw:drawCuckoo, eq:eqCuckoo, why:whyCuckoo };
