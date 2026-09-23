// Shared by the question kinds: randomness, the answer box, and helpers more than one
// kind uses. Anything used by a single kind lives in that kind's file under kinds/.

const rnd = n => Math.floor(Math.random()*n);
const shuffle = a => { for(let i = a.length-1; i > 0; i--){ const j = rnd(i+1), x = a[i]; a[i] = a[j]; a[j] = x; } return a; };
const KIND = {};                     // kinds/*.js register { draw, eq, why } here
const SLOT = '<span class="slot" id="slot0"></span>';
const CM = ' <span class="unit">см</span>';

const exprText = terms => terms.map(t => (t.op ? t.op + ' ' : '') + t.n).join(' ');

const BGNUM = {2:'две', 3:'три', 4:'четири', 5:'пет', 6:'шест', 7:'седем'};
const bgList = a => a.length < 2 ? a.join('') : a.slice(0,-1).join(', ') + ' и ' + a[a.length-1];

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
const NAMES = [['Хари', 'посадил'], ['Мая', 'посадила'], ['Ния', 'посадила'],
               ['Борис', 'посадил'], ['Ива', 'посадила'], ['Асен', 'посадил']];
