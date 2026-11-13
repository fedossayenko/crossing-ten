// Question kind 'boards': level 346 — a bird jumps board to board along a fence, so many seconds a jump: count the jumps, then add.

// Кенгуру 2026, 2 клас, задача 12: the parrot Пиер jumps from a board to the next in 2 seconds, from board 1 to board 10. There are 9
// jumps, not 10 (the first board is where he starts), 2 + 2 + … = 18 seconds; 20 is the slip of counting the boards.
import { KIND, SLOT, addUp, popAt, rnd, svgText, tr, ukN } from '../js/core.js';
export function genBoards(){
  const t = [2, 2, 3, 5][rnd(4)], a = 1 + rnd(3), n = t === 2 ? 5 + rnd(5) : t === 3 ? 4 + rnd(5) : 3 + rnd(3), b = a + n, ans = n * t;
  return {kind:'boards', t, a, b, n, traps:[(n + 1) * t, b * t].filter(v => v !== ans), ans};
}
const secBg = 'секунди';
function drawBoards(q){
  return '<div class="ask">' + tr('За <span class="num">' + q.t + '</span> ' + secBg + ' папагалът Пиер скача от дъска на съседна дъска от дървената ограда. Той тръгва от дъската № <span class="num">' + q.a + '</span> и скача последователно на всяка следваща дъска до дъската № <span class="num">' + q.b + '</span>. За колко секунди папагалът Пиер ще достигне дъската № ' + q.b + '?',
    'За <span class="num">' + ukN(q.t, 'секунду', 'секунди', 'секунд') + '</span> папуга П’єр стрибає з дошки на сусідню дошку дерев’яної огорожі. Він починає з дошки № <span class="num">' + q.a + '</span> й стрибає послідовно на кожну наступну дошку до дошки № <span class="num">' + q.b + '</span>. За скільки секунд папуга П’єр дістанеться дошки № ' + q.b + '?') + '</div>' +
    '<div class="line xl">' + SLOT + ' <span class="unit">' + tr('сек', 'с') + '</span></div>';
}
function eqBoards(q){ return addUp(q.n, q.t) + ' → ' + q.ans; }
// the boards with an arc for each jump
function boardsSvg(q, full){
  const W = 260, step = Math.min(34, (W - 20) / q.n), x0 = (W - step * q.n) / 2;
  let g = '';
  for(let i = 0; i <= q.n; i++){
    const cx = x0 + i * step;
    g += '<rect x="' + (cx - 7).toFixed(1) + '" y="40" width="14" height="30" rx="3" fill="var(--accentbg)" stroke="var(--accent)" stroke-width="1.5"/>' + svgText(cx.toFixed(1), 60, q.a + i, 10, 'var(--ink)');
    if(i < q.n){
      g += '<path' + popAt(i + 1) + ' d="M' + cx.toFixed(1) + ',38 Q' + (cx + step / 2).toFixed(1) + ',8 ' + (cx + step).toFixed(1) + ',38" fill="none" stroke="var(--warm)" stroke-width="2"/>';
      if(full) g += svgText((cx + step / 2).toFixed(1), 22, q.t, 11, 'var(--good)', popAt(i + 1));
    }
  }
  return '<svg viewBox="0 0 260 78" style="display:block; width:300px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + tr('дъските на оградата и скоковете', 'дошки огорожі та стрибки') + '">' + g + '</svg>';
}
function whyBoards(q, full){
  if(!full) return tr('Нарисувай дъските и скоковете между тях. Колко са скоковете — повече или по-малко от дъските?', 'Намалюй дошки й стрибки між ними. Скільки стрибків — більше чи менше, ніж дошок?') + boardsSvg(q, false);
  return boardsSvg(q, true) + tr('от № ' + q.a + ' до № ' + q.b + ' са <b>' + q.n + '</b> скока (' + q.b + ' − ' + q.a + ' = ' + q.n + '), а не ' + (q.n + 1) + '. Всеки е ' + q.t + ' ' + secBg + ': ' + addUp(q.n, q.t) + ' &nbsp;→&nbsp; <b>' + q.ans + '</b>',
    'від № ' + q.a + ' до № ' + q.b + ' — <b>' + ukN(q.n, 'стрибок', 'стрибки', 'стрибків') + '</b> (' + q.b + ' − ' + q.a + ' = ' + q.n + '), а не ' + (q.n + 1) + '. Кожен триває ' + ukN(q.t, 'секунду', 'секунди', 'секунд') + ': ' + addUp(q.n, q.t) + ' &nbsp;→&nbsp; <b>' + q.ans + '</b>');
}
KIND.boards = { draw:drawBoards, eq:eqBoards, why:whyBoards };
