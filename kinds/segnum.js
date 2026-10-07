// Question kind 'segnum': level 256 Номерирани точки — Points numbered along a segment, and the one halfway between two.

// МБГ Есен 2023, 3 клас, задача 13: AB is 1 м, cut into 10 equal parts by points numbered 1 (A) to 11 (B). C is as far
// from point 3 as from point 9, so it is point (3 + 9) : 2 = 6; from point 6 to point 11 are 5 parts of 100 : 10 = 10 см:
// 50 см. The slips: 10 − 6 = 4 parts (the last number is not the number of parts), or point 6 taken as 6 parts from A.
// Other lengths (1 or 2 м, 3 to 9 дм), 4 to 10 parts, C at a numbered point, measured to B or to A.
import { CM, KIND, SLOT, rnd, tr, ukN } from '../js/core.js';
export function genSegNum(){
  for(;;){
    const n = 4 + rnd(7), m = Math.random() < 0.6, L = m ? 100*(1 + rnd(2)) : 10*(3 + rnd(7));
    const i = 1 + rnd(n + 1), j = 1 + rnd(n + 1), toB = Math.random() < 0.6;
    if(L % n || j - i < 2 || (i + j) % 2 || (i === 1 && j === n + 1)) continue;
    const p = L / n, c = (i + j) / 2, ans = toB ? (n + 1 - c)*p : (c - 1)*p;
    return {kind:'segnum', n, m, L, i, j, toB, c, p, traps: [toB ? (n - c)*p : c*p].filter(v => v !== ans), ans};
  }
}
const segNumLen = q => q.m ? q.L / 100 + ' м' : q.L / 10 + ' дм';
// the points numbered above, A and B under the ends; the worked picture marks the two points and C between them
function segNumSvg(q, mark){
  const W = 250, at = k => (12 + (k - 1) / q.n * (W - 24)).toFixed(1), text = (x, y, t, col) =>
    '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-size="13" font-weight="700" fill="' + col + '" font-family="Nunito, sans-serif">' + t + '</text>';
  let g = '<line x1="' + at(1) + '" y1="0" x2="' + at(q.n + 1) + '" y2="0" stroke="var(--ink)" stroke-width="2.4"/>';
  for(let k = 1; k <= q.n + 1; k++){
    const col = mark && k === q.c ? 'var(--warm)' : mark && (k === q.i || k === q.j) ? 'var(--accent)' : 'var(--ink)';
    g += '<circle cx="' + at(k) + '" cy="0" r="' + (col === 'var(--ink)' ? 3.6 : 5) + '" fill="' + col + '"/>' + text(at(k), -10, k, col);
  }
  g += text(at(1), 22, 'A', 'var(--ink)') + text(at(q.n + 1), 22, 'B', 'var(--ink)') + (mark ? text(at(q.c), 22, 'C', 'var(--warm)') : '');
  return '<svg viewBox="0 -26 ' + W + ' 54"' + (mark ? ' style="display:block; width:300px; max-width:100%; margin:6px auto 0"' : '') + ' role="img" aria-label="' + tr('номерираните точки на отсечката', 'пронумеровані точки відрізка') + '">' + g + '</svg>';
}
function drawSegNum(q){
  const to = q.toB ? 'B' : 'A';
  return '<div class="ask">' + tr('Отсечка <b>AB</b> е дълга <span class="num">' + segNumLen(q) + '</span> и е разделена на <span class="num">' + q.n + '</span> равни части чрез точки. Те са номерирани и точката A е първата точка, а точката B е последната. ' +
    'Точка <b>C</b> се намира на еднакво разстояние от точките с номер <span class="num">' + q.i + '</span> и номер <span class="num">' + q.j + '</span>. Колко <b>сантиметра</b> е разстоянието от точка C до точка ' + to + '?',
    'Відрізок <b>AB</b> має довжину <span class="num">' + segNumLen(q) + '</span> і поділений точками на ' + ukN(q.n, 'рівну частину', 'рівні частини', 'рівних частин').replace(/^(\d+)/, '<span class="num">$1</span>') + '. Точки пронумеровано: точка A — перша, а точка B — остання. ' +
    'Точка <b>C</b> розташована на однаковій відстані від точок з номером <span class="num">' + q.i + '</span> і номером <span class="num">' + q.j + '</span>. Скільки <b>сантиметрів</b> становить відстань від точки C до точки ' + to + '?') +
    '</div><div class="fig wide">' + segNumSvg(q, false) + '</div><div class="line md">' + SLOT + CM + '</div>';
}
// the parts from C to the asked end, and how long that is
const segNumParts = q => q.toB ? (q.n + 1) + ' − ' + q.c : q.c + ' − 1';
function eqSegNum(q){
  return q.L + ' : ' + q.n + ' = ' + q.p + ', (' + q.i + ' + ' + q.j + ') : 2 = ' + q.c + ', (' + segNumParts(q) + ') · ' + q.p + ' = ' + q.ans + ' см';
}
function whySegNum(q, full){
  if(!full) return tr('Колко сантиметра е една част? Точките са с една повече от частите.', 'Скільки сантиметрів одна частина? Точок на одну більше, ніж частин.');
  const k = q.toB ? q.n + 1 - q.c : q.c - 1, end = q.toB ? q.n + 1 : 1;
  return segNumLen(q) + ' = ' + q.L + ' см, ' + q.L + ' : ' + q.n + ' = <b>' + q.p + '</b> см' + tr(' всяка част', ' кожна частина') + ' &nbsp;→&nbsp; ' +
    tr('C е по средата между точките ', 'C посередині між точками ') + q.i + tr(' и ', ' і ') + q.j + ': (' + q.i + ' + ' + q.j + ') : 2 = ' + tr('точка ', 'точка ') + '<b>' + q.c + '</b>' + segNumSvg(q, true) +
    tr('от точка ' + q.c + ' до точка ' + end + ' (' + (q.toB ? 'B' : 'A') + ') са ', 'від точки ' + q.c + ' до точки ' + end + ' (' + (q.toB ? 'B' : 'A') + ') — ') + segNumParts(q) + ' = ' +
    tr(k + (k === 1 ? ' част' : ' части'), ukN(k, 'частина', 'частини', 'частин')) + ' &nbsp;→&nbsp; ' + k + ' · ' + q.p + ' = ' + q.ans + ' см';
}
KIND.segnum = { draw:drawSegNum, eq:eqSegNum, why:whySegNum };
