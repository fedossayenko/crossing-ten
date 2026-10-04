// Shared by the question kinds: randomness, the answer box, and helpers more than one
// kind uses. Anything used by a single kind lives in that kind's file under kinds/.

const rnd = n => Math.floor(Math.random()*n);
const shuffle = a => { for(let i = a.length-1; i > 0; i--){ const j = rnd(i+1), x = a[i]; a[i] = a[j]; a[j] = x; } return a; };
const KIND = {};                     // kinds/*.js register { draw, eq, why } here
// Task text in the player's language: tr('Колко са?', 'Скільки їх?'). Bulgarian is the
// original and the fallback; anything not yet translated simply stays Bulgarian. Both
// sides are plain strings, so a translation may regroup a whole phrase, not just a word.
const tr = (bg, uk) => LANG === 'uk' && uk !== undefined ? uk : bg;
// a Ukrainian noun after a number, whatever the page's language: 1 фігура, 2 фігури, 5 фігур, 21 фігура
const ukN = (n, one, few, many) => n + ' ' + ({one, few}[new Intl.PluralRules('uk').select(n)] || many);
// Bulgarian «с» becomes «със» before a word that starts with с or з — седем, седемнадесет, сто
const bgWith = n => /^(7|1[7]|7\d|100)$/.test(String(n)) ? 'със' : 'с';
const SLOT = '<span class="slot" id="slot0"></span>';
// A solution picture that builds up: the part drawn at step n pops in n·0.12 s after the picture appears
// (still, all at once, when motion is reduced). Attributes for an SVG element: '<g' + popAt(3) + '>'.
const popAt = n => ' class="pop" style="transform-box:fill-box; transform-origin:center; animation-delay:' + (n*0.12).toFixed(2) + 's"';
// a label in a solution picture, centred on x
const svgText = (x, y, t, size, fill, extra) => '<text' + (extra || '') + ' x="' + x + '" y="' + y + '" text-anchor="middle" font-size="' + size + '" font-weight="800" fill="' + fill + '" font-family="Nunito, sans-serif">' + t + '</text>\n';   // the line break keeps labels apart as text
// A line with points and distances, for the pictures of the line levels. Points: [{at, name, col, step}];
// distances: [{from, to, label, row, col, step}], drawn as brackets in rows above (row < 0) or below the line.
// The coordinates are lengths; lo and hi are the ends of the line. A step makes that part pop in.
function lineSvg(pts, spans, lo, hi, label){
  const X = v => (20 + (v - lo) / (hi - lo) * 200).toFixed(1), rows = spans.map(s => s.row).concat(0);
  const top = Math.min(...rows) * 22 - 24, bottom = Math.max(...rows) * 22 + 34, at = st => st === undefined ? '' : popAt(st);
  let g = '<line x1="8" y1="0" x2="232" y2="0" stroke="var(--ink)" stroke-width="2"/>';
  spans.forEach(s => { const y = s.row * 22, col = s.col || 'var(--accent)', x1 = X(Math.min(s.from, s.to)), x2 = X(Math.max(s.from, s.to));
    g += '<g' + at(s.step) + '><path d="M' + x1 + ',' + (y - 5) + ' v10 M' + x1 + ',' + y + ' H' + x2 + ' M' + x2 + ',' + (y - 5) + ' v10" stroke="' + col + '" stroke-width="2.5" fill="none"/>' +
      (s.label === '' ? '' : svgText(((+x1 + +x2) / 2).toFixed(1), s.row < 0 ? y - 6 : y + 16, s.label, 13, col)) + '</g>'; });
  pts.forEach(p => { g += '<g' + at(p.step) + '><circle cx="' + X(p.at) + '" cy="0" r="5" fill="' + (p.col || 'var(--ink)') + '"/>' + (p.name ? svgText(X(p.at), -10, p.name, 14, 'var(--ink)') : '') + '</g>'; });
  return '<svg viewBox="0 ' + top + ' 240 ' + (bottom - top) + '" style="display:block; width:230px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + label + '">' + g + '</svg>';
}
// Two bars to compare, the shorter one's length marked on the longer, and what sticks out —
// the difference — in orange with its size. rows: [label, value, colour]; foot ends on the answer.
function diffBars(rows, extra, foot, label){
  const max = Math.max(...rows.map(r => r[1])), min = Math.min(...rows.map(r => r[1])), u = 180 / max;
  let g = '';
  rows.forEach(([name, v, col], i) => { const y = i * 30;
    g += '<g' + popAt(1 + i) + '>' + svgText(22, y + 14, name, 11, col) + '<rect x="46" y="' + y + '" width="' + (v * u).toFixed(1) + '" height="20" rx="5" fill="none" stroke="' + col + '" stroke-width="2"/>' +
      svgText((46 + v * u + 16).toFixed(1), y + 15, v, 12, col) + '</g>'; });   // the length beside the bar, never under the difference
  if(max > min){
    const y = rows.findIndex(r => r[1] === max) * 30;
    g += '<g' + popAt(3.5) + '><rect x="' + (46 + min * u).toFixed(1) + '" y="' + y + '" width="' + ((max - min) * u).toFixed(1) + '" height="20" rx="5" fill="var(--warmbg)" stroke="var(--warm)" stroke-width="2"/>' +
      svgText((46 + (min + max) / 2 * u).toFixed(1), y + 15, extra, 12, 'var(--warm)') + '</g>' +
      '<line' + popAt(3) + ' x1="' + (46 + min * u).toFixed(1) + '" y1="-4" x2="' + (46 + min * u).toFixed(1) + '" y2="' + (rows.length * 30 - 6) + '" stroke="var(--ink)" stroke-width="1.5" stroke-dasharray="3 3"/>';
  }
  g += svgText(136, rows.length * 30 + 20, foot, 15, 'var(--ink)', popAt(5));
  return '<svg viewBox="0 -8 262 ' + (rows.length * 30 + 38) + '" style="display:block; width:327px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + label + '">' + g + '</svg>';
}
const CM = ' <span class="unit">см</span>';

const exprText = terms => terms.map(t => (t.op ? t.op + ' ' : '') + t.n).join(' ');

const BGNUM = {2:'две', 3:'три', 4:'четири', 5:'пет', 6:'шест', 7:'седем'};
// Ukrainian number words: masculine and neuter nouns take UKNUM (два числа), feminine ones UKNUM_F (дві цифри).
const UKNUM = {2:'два', 3:'три', 4:'чотири', 5:'п’ять', 6:'шість', 7:'сім', 8:'вісім', 9:'дев’ять', 10:'десять'};
const UKNUM_F = Object.assign({}, UKNUM, {2:'дві'});
const bgList = a => a.length < 2 ? a.join('') : a.slice(0,-1).join(', ') + tr(' и ', ' і ') + a[a.length-1];

function antSvg(x, y, u){
  const k = (u/34).toFixed(3);
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + k + ')" stroke="var(--ant)" ' +
    'stroke-width="1.2" stroke-linecap="round">' +
    '<g fill="none"><path d="M-4,-4 L-8,-9 M0,-4.5 L2,-10"/>' +
    '<path d="M-2,0 L-9,-3 M-2,1 L-9,3 M-1,2 L-7,8 M2,0 L9,-3 M2,1 L9,3 M3,2 L8,8"/></g>' +
    '<g fill="var(--ant)" stroke="none">' +
    '<ellipse cx="-5" cy="-3" rx="3.1" ry="2.7"/><ellipse cx="0" cy="0" rx="2.7" ry="2.5"/>' +
    '<ellipse cx="6" cy="2.4" rx="4.2" ry="3.4"/></g></g>';
}
function gridSvg(W, H, c, r){   // c = 0 draws the bare grid, with no ant
  const u = 36, w = W*u, h = H*u;
  let g = '';
  for(let i = 0; i <= W; i++) g += '<line x1="' + i*u + '" y1="0" x2="' + i*u + '" y2="' + h + '"/>';
  for(let j = 0; j <= H; j++) g += '<line x1="0" y1="' + j*u + '" x2="' + w + '" y2="' + j*u + '"/>';
  return '<div class="fig"><svg viewBox="-3 -3 ' + (w+6) + ' ' + (h+6) + '" role="img" aria-label="решетка с мравка">' +
    '<g stroke="var(--ink)" stroke-width="1.7" fill="none">' + g + '</g>' +
    (c ? antSvg((c - 0.5)*u, (H - r + 0.5)*u, u) : '') + '</svg></div>';
}
function fruitBody(t){
  const stem = '<path d="M0,-12 v4" stroke="var(--ant)" stroke-width="1.6" fill="none"/>';
  if(t === 'p') return stem + '<circle cx="0" cy="-3" r="4.4" fill="var(--pear)"/>' +
    '<circle cx="0" cy="4" r="6.9" fill="var(--pear)"/>';
  if(t === 'a') return stem + '<ellipse cx="4.5" cy="-9" rx="3.4" ry="1.7" fill="var(--good)"/>' +
    '<circle cx="0" cy="1" r="7.5" fill="var(--apple)"/>';
  if(t === 'l') return '<ellipse cx="5" cy="-6" rx="3.6" ry="1.8" fill="var(--good)"/>' +
    '<ellipse cx="0" cy="1" rx="8.6" ry="5.8" fill="var(--lemon)"/>';
  return stem + '<g fill="var(--grape)"><circle cx="0" cy="-4" r="3.1"/><circle cx="-4" cy="1" r="3.1"/>' +
    '<circle cx="4" cy="1" r="3.1"/><circle cx="-2" cy="6" r="3.1"/><circle cx="2" cy="6" r="3.1"/>' +
    '<circle cx="0" cy="10" r="3.1"/></g>';
}

// Задача 11: n trees in a row leave n − 1 gaps. Asked three ways round.
// [name, Bulgarian "planted", Ukrainian name, Ukrainian "planted"]
const NAMES = [['Хари', 'посадил', 'Харі', 'посадив'], ['Мая', 'посадила', 'Мая', 'посадила'], ['Ния', 'посадила', 'Нія', 'посадила'],
               ['Борис', 'посадил', 'Борис', 'посадив'], ['Ива', 'посадила', 'Іва', 'посадила'], ['Асен', 'посадил', 'Асен', 'посадив']];
