// Question kind 'circcut': level 259 Разрязан кръг — The most pieces a circle makes with so many straight cuts.

// МБГ Есен 2024, 3 клас, задача 18: one cut makes 2 pieces, three cuts at most 7 (both drawn); how many with 4? A new cut
// can cross every cut before it, each at its own point inside the circle, so it runs through one piece more than there
// are cuts before it and halves each: 2, 2 + 2 = 4, 4 + 3 = 7, 7 + 4 = 11. The slips: the last step kept (7 + 3 = 10),
// or every cut through the middle (2 · 4 = 8). Two or three cuts shown, one to three more asked.
import { KIND, SLOT, rnd, tr, ukN } from '../js/core.js';
const circParts = c => 1 + c*(c + 1) / 2;
export function genCircCut(){
  const k = 2 + rnd(2), n = k + 1 + rnd(3), ans = circParts(n);
  return {kind:'circcut', k, n, traps: [circParts(k) + (n - k)*k, 2*n].filter((v, i, a) => v !== ans && a.indexOf(v) === i), ans};
}
// k cuts as chords touching a small circle in the middle at evenly turned angles: every two cross inside the circle,
// never three at one point, so they make the most pieces
function circSvg(k, x, R){
  // two chords touching it cross at r / cos(half the turn between them): the widest turn crosses at 0.65 R
  const r = k === 1 ? 2 : 0.65*R*Math.cos(Math.PI*(k - 1) / (2*k)), h = Math.sqrt(R*R - r*r);
  let g = '<circle cx="' + x + '" cy="0" r="' + R + '" fill="var(--accentbg)" stroke="var(--ink)" stroke-width="1.6"/>';
  for(let i = 0; i < k; i++){
    const f = 0.7 + i*Math.PI / k, cx = x + r*Math.cos(f), cy = r*Math.sin(f), dx = -h*Math.sin(f), dy = h*Math.cos(f);
    g += '<line x1="' + (cx - dx).toFixed(1) + '" y1="' + (cy - dy).toFixed(1) + '" x2="' + (cx + dx).toFixed(1) + '" y2="' + (cy + dy).toFixed(1) + '" stroke="var(--accent)" stroke-width="2"/>';
  }
  return g;
}
const bgCuts = k => ({2:'две', 3:'три'})[k], ukCuts = k => ({2:'Двома', 3:'Трьома'})[k];
function drawCircCut(q){
  return '<div class="ask">' + tr('Кръг можем да разрежем на <span class="num">2</span> части с <span class="num">1</span> разрязване, а с ' + bgCuts(q.k) + ' разрязвания кръга можем да разрежем <b>най-много</b> на <span class="num">' + circParts(q.k) + '</span> части:',
    'Круг можна розрізати на <span class="num">2</span> частини <span class="num">1</span> розрізом, а ' + ukCuts(q.k).toLowerCase() + ' розрізами круг можна розрізати <b>щонайбільше</b> на ' + ukN(circParts(q.k), 'частину', 'частини', 'частин').replace(/^(\d+)/, '<span class="num">$1</span>') + ':') + '</div>' +
    '<div class="fig small"><svg viewBox="-44 -44 196 88" role="img" aria-label="' + tr('разрязаните кръгове', 'розрізані круги') + '">' + circSvg(1, 0, 40) + circSvg(q.k, 108, 40) + '</svg></div>' +
    '<div class="ask">' + tr('На колко <b>най-много</b> части можем да разрежем кръг с <span class="num">' + q.n + '</span> разрязвания?',
      'На скільки <b>найбільше</b> частин можна розрізати круг <span class="num">' + q.n + '</span> розрізами?') + '</div>' +
    '<div class="line md">' + SLOT + '</div>';
}
// the pieces cut by cut: 2, then each new cut adds as many as its number
const circSteps = q => { const s = []; for(let c = 2; c <= q.n; c++) s.push(c); return s; };
function eqCircCut(q){
  return '2 + ' + circSteps(q).join(' + ') + ' = ' + q.ans;
}
function whyCircCut(q, full){
  if(!full) return tr('Всяко ново разрязване може да пресече всички предишни. На колко парчета го делят те — и колко части прибавя?',
    'Кожен новий розріз може перетнути всі попередні. На скільки відрізків вони його ділять — і скільки частин він додає?');
  return tr('Новото разрязване пресича всички предишни, всяко в различна точка в кръга. Така минава през толкова части, колкото са предишните разрязвания, и още една — и разделя всяка на две.',
    'Новий розріз перетинає всі попередні, кожен в іншій точці круга. Так він проходить через стільки частин, скільки було попередніх розрізів, і ще одну — і ділить кожну навпіл.') +
    '<svg viewBox="-44 -44 88 88" style="display:block; width:150px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + tr('кръгът, разрязан на най-много части', 'круг, розрізаний на найбільше частин') + '">' + circSvg(q.n, 0, 40) + '</svg>' +
    tr('1 разрязване: 2 части', '1 розріз: 2 частини') + circSteps(q).map(c => ' &nbsp;→&nbsp; ' + circParts(c - 1) + ' + ' + c + ' = ' + circParts(c)).join('');
}
KIND.circcut = { draw:drawCircCut, eq:eqCircCut, why:whyCircCut };
