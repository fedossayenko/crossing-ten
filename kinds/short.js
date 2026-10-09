// Question kind 'short': level 39 Не достигат — Short by so many — so how many are there now?.
import { KIND, SLOT, UK_PLURAL, popAt, rnd, svgText, tr } from '../js/core.js';

const SWEETS = ['бонбона', 'стикера', 'ябълки', 'монети'];

// Задача 10: being short of a total tells you how many there are now.
export function genShort(){
  const item = SWEETS[rnd(SWEETS.length)];
  const have = 2 + rnd(18);
  const T1 = have + 2 + rnd(18);
  const T2 = T1 + 2 + rnd(20);
  const shape = Math.random() < 0.3 ? 1 : 0;
  return {kind:'short', item, have, T1, T2, d1: T1 - have, shape, ans: shape === 0 ? T2 - have : have};
}

// Ukrainian forms keyed by the Bulgarian noun: [accusative singular, 2–4, genitive plural, genitive singular]
const shortUk = {'бонбона':['цукерку','цукерки','цукерок','цукерки'], 'стикера':['наліпку','наліпки','наліпок','наліпки'],
                 'ябълки':['яблуко','яблука','яблук','яблука'], 'монети':['монету','монети','монет','монети']};
// "мати N …" wants the accusative, "не вистачає N …" the genitive
const shortAcc = (n, f) => f[{one:0, few:1, many:2}[UK_PLURAL.select(n)]];
const shortGen = (n, f) => n % 10 === 1 && n % 100 !== 11 ? f[3] : f[2];
function drawShort(q){
  const f = shortUk[q.item];
  const tail = q.shape === 0
    ? tr('Колко ' + q.item + ' не ми достигат, за да имам <span class="num">' + q.T2 + '</span> ' + q.item + '?',
         'Скільки ' + f[2] + ' мені не вистачає, щоб мати <span class="num">' + q.T2 + '</span> ' + shortAcc(q.T2, f) + '?')
    : tr('Колко ' + q.item + ' имам?', 'Скільки ' + f[2] + ' у мене є?');
  return '<div class="ask">' + tr('Не ми достигат <span class="num">' + q.d1 + '</span> ' + q.item +
    ', за да имам <span class="num">' + q.T1 + '</span> ' + q.item + '. ',
    'Мені не вистачає <span class="num">' + q.d1 + '</span> ' + shortGen(q.d1, f) +
    ', щоб мати <span class="num">' + q.T1 + '</span> ' + shortAcc(q.T1, f) + '. ') + tail + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqShort(q){
  return tr('не достигат ', 'не вистачає ') + q.d1 + ' до ' + q.T1 + ' → ' + q.ans;
}
// The picture: a bar for each target — the part I have, and the dashed part that is short — under a bracket
// with the target. What I have is the same part in both bars: found from the first, carried into the second.
// The bars are drawn to scale past a fixed minimum, so a short of 2 still holds its label. The hint draws the
// first bar with words and no numbers.
function shortSvg(q, full){
  const bar = (y, wh, ws, top, hv, sv, at, hot) =>
    '<g' + popAt(at) + '><path d="M15,' + (y - 4) + ' v-6 H' + (15 + wh + ws).toFixed(1) + ' v6" stroke="var(--muted)" stroke-width="2" fill="none"/>' +
    '<rect x="15" y="' + y + '" width="' + wh.toFixed(1) + '" height="28" rx="6" fill="var(--accentbg)" stroke="var(--accent)" stroke-width="2"/>' +
    '<rect x="' + (15 + wh).toFixed(1) + '" y="' + y + '" width="' + ws.toFixed(1) + '" height="28" rx="6" fill="var(--warmbg)" stroke="var(--warm)" stroke-width="2" stroke-dasharray="5 3"/>' +
    svgText((15 + (wh + ws) / 2).toFixed(1), y - 14, top, 13, 'var(--muted)') + '</g>' +
    svgText((15 + wh / 2).toFixed(1), y + 19, hv, 14, 'var(--accent)', popAt(at + 1)) +
    svgText((15 + wh + ws / 2).toFixed(1), y + 19, sv, hot ? 15 : 14, 'var(--warmink)', popAt(at + (hot ? 2 : 1)));
  const svg = (h, g) => '<svg viewBox="0 0 260 ' + h + '" style="display:block; width:300px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('колко имам и колко не достигат', 'скільки в мене є і скільки бракує') + '">' + g + '</svg>';
  if(!full) return svg(56, bar(24, 118, 112, tr('за да имам', 'щоб мати'), tr('имам', 'у мене є'), tr('не достигат', 'не вистачає'), 0));
  const T = q.shape === 1 ? q.T1 : q.T2, u = (230 - 52) / T, w = v => 26 + v * u;
  let g = bar(24, w(q.have), w(q.d1), q.T1, q.have, q.d1, 1);
  if(q.shape === 1) return svg(96, g + svgText(130, 86, q.T1 + ' − ' + q.d1 + ' = ' + q.ans, 15, 'var(--ink)', popAt(3)));
  g += bar(84, w(q.have), w(q.ans), q.T2, q.have, q.ans, 3, true);
  return svg(156, g + svgText(130, 146, q.T2 + ' − ' + q.have + ' = ' + q.ans, 15, 'var(--ink)', popAt(6)));
}
function whyShort(q, full){
  if(!full) return tr('Първо намери колко имам сега.', 'Спочатку знайди, скільки в мене є зараз.') + shortSvg(q, false);
  const head = tr('имам ', 'у мене є ') + q.T1 + ' − ' + q.d1 + ' = <b>' + q.have + '</b>';
  return (q.shape === 1 ? head
    : head + tr(' &nbsp;→&nbsp; до ' + q.T2 + ' не достигат ', ' &nbsp;→&nbsp; до ' + q.T2 + ' не вистачає ') +
      q.T2 + ' − ' + q.have + ' = ' + q.ans) + shortSvg(q, true);
}
KIND.short = { draw:drawShort, eq:eqShort, why:whyShort };
