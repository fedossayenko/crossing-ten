// Question kind 'bothseq': level 150 И в двете редици — Two lists given by rules, and the numbers on both.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Коледно 2022, задача 4: A holds every number under 50 ending in 1 (1, 11, 21, 31, 41), C every two-digit
// number whose digits add to 3 or 4. Only 21 and 31 are on both — 1 is not two-digit, 41's digits make 5.
// Every number is tried; the question is asked only when two or three are on both lists.
import { KIND, SLOT, rnd, tr } from '../js/core.js';
const digSum = v => Math.floor(v / 10) + v % 10;
export function genBothSeq(){
  for(;;){
    const u = rnd(10), N = 30 + rnd(70), s = 2 + rnd(9);
    const A = [], both = [];
    for(let v = 0; v < N; v++) if(v % 10 === u) A.push(v);
    A.forEach(v => { if(v >= 10 && (digSum(v) === s || digSum(v) === s + 1)) both.push(v); });
    if(both.length < 2 || both.length > 3 || A.length < 4) continue;
    return {kind:'bothseq', u, N, s, A, both, slots: both.length, ans: both[0], alt: both.slice(1)};
  }
}
function drawBothSeq(q){
  if(q.kind === 'bothseq'){
    const slots = q.both.map((_, i) => i ? ' <span class="or">' + tr('и', 'і') + '</span> <span class="slot" id="slot' + i + '"></span>' : SLOT).join('');
    return '<div class="ask">' + tr('Редицата <b>A</b> е образувана от всички числа, по-малки от <span class="num">' + q.N + '</span>, които имат цифра на единиците <span class="num">' + q.u +
      '</span>. Редицата <b>C</b> е образувана от всички двуцифрени числа, на които сборът от цифрите е <span class="num">' + q.s + '</span> или <span class="num">' + (q.s + 1) + '</span>. Кои са числата, които са едновременно от редиците A и C?',
      'Ряд <b>A</b> утворено з усіх чисел, менших від <span class="num">' + q.N + '</span>, у яких цифра одиниць <span class="num">' + q.u +
      '</span>. Ряд <b>C</b> утворено з усіх двоцифрових чисел, сума цифр яких <span class="num">' + q.s + '</span> або <span class="num">' + (q.s + 1) + '</span>. Які числа є одночасно в рядах A і C?') + '</div>' +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + slots + '</div>';
  }
}
function eqBothSeq(q){
  if(q.kind === 'bothseq') return 'A: ' + q.A.join(', ') + ' → ' + q.both.join(tr(' и ', ' і '));
}
function whyBothSeq(q, full){
  if(q.kind === 'bothseq'){
    if(!full) return tr('Запиши редицата A. После за всяко число от нея пресметни сбора на цифрите. Двуцифрено ли е?', 'Випиши ряд A. Потім для кожного числа з нього обчисли суму цифр. Чи воно двоцифрове?');
    return 'A: ' + q.A.map(v => v + ' (' + (v < 10 ? tr('едноцифрено', 'одноцифрове') : digSum(v)) + ')').join(', ') + ' &nbsp;→&nbsp; ' + q.both.map(v => '<b>' + v + '</b>').join(tr(' и ', ' і '));
  }
}
KIND.bothseq = { draw:drawBothSeq, eq:eqBothSeq, why:whyBothSeq };
