// Question kind 'rank': level 57 Класирането — Who beat whom — and how many are above someone.

// Задача 3: how much bigger one sum is than the other. Asked the other way round
// some of the time, so the wording has to be read rather than guessed.
// Задача 3: the two sums line up term by term, so pairing them off beats adding both —
// one pair carries a ten, the rest nudge by one or two.
import { KIND, SLOT, bgList, popAt, rnd, shuffle, svgText, tr } from '../js/core.js';
import { LANG } from '../js/i18n.js';
const BOYS = ['Алекс', 'Борис', 'Виктор', 'Георги', 'Даниел', 'Емил'];
// Задача 18: who beat whom. One boy is said to be above everybody, and another to be
// above only a named few — which pins how many are above him, whatever the rest did.
export function genRank(){
  const n = 4 + rnd(2);
  const who = shuffle(BOYS.slice()).slice(0, n);      // who[0] is best, who[n-1] worst
  const k = 2 + rnd(n - 3);                           // the boy the second fact is about
  const asksAbove = Math.random() < 0.6;
  const tall = Math.random() < 0.4;   // Есен 2019, задача 18: the same order, told by height
  return {kind:'rank', who, n, k, asksAbove, tall, ans: asksAbove ? k : n - 1 - k};
}

const rankUk = {'Алекс':'Алекс', 'Борис':'Борис', 'Виктор':'Віктор', 'Георги':'Георгі', 'Даниел':'Даніел', 'Емил':'Еміл'};
const rankAcc = {'Алекс':'Алекса', 'Борис':'Бориса', 'Виктор':'Віктора', 'Георги':'Георгі', 'Даниел':'Даніела', 'Емил':'Еміла'};
const rankNm = x => tr(x, rankUk[x]);

function drawRank(q){
  if(q.tall){
    return '<div class="ask">' + tr('<b>' + q.who[0] + '</b> е по-висок ' + q.who.slice(1).map(x => 'и от <b>' + x + '</b>').join(', ') + ', а <b>' + q.who[q.k] + '</b> е по-висок <b>само</b> от ' + bgList(q.who.slice(q.k + 1).map(x => '<b>' + x + '</b>')) +
      '. Колко момчета са <b>' + (q.asksAbove ? 'по-високи' : 'по-ниски') + '</b> от <b>' + q.who[q.k] + '</b>?',
      '<b>' + rankNm(q.who[0]) + '</b> вищий ' + q.who.slice(1).map(x => 'і за <b>' + rankAcc[x] + '</b>').join(', ') + ', а <b>' + rankNm(q.who[q.k]) + '</b> вищий <b>лише</b> за ' + bgList(q.who.slice(q.k + 1).map(x => '<b>' + rankAcc[x] + '</b>')) +
      '. Скільки хлопців <b>' + (q.asksAbove ? 'вищі' : 'нижчі') + '</b> за <b>' + rankAcc[q.who[q.k]] + '</b>?') + '</div>' +
      '<div class="line xl">' + SLOT + '</div>';
  }
  if(LANG === 'uk') return '<div class="ask">На змаганні з математики <b>' + rankNm(q.who[0]) + '</b> набрав більше балів, ніж ' +
    bgList(q.who.slice(1).map(x => '<b>' + rankNm(x) + '</b>')) + ', а <b>' + rankNm(q.who[q.k]) +
    '</b> випередив <b>лише</b> ' + bgList(q.who.slice(q.k + 1).map(x => '<b>' + rankAcc[x] + '</b>')) +
    '. Скільки хлопців мають <b>' + (q.asksAbove ? 'більше' : 'менше') + '</b> балів, ніж <b>' +
    rankNm(q.who[q.k]) + '</b>?</div>' +
    '<div class="line xl">' + SLOT + '</div>';
  const beaten = q.who.slice(1).map(x => 'от <b>' + x + '</b>');
  const only = q.who.slice(q.k + 1).map(x => '<b>' + x + '</b>');
  return '<div class="ask">В едно състезание по математика <b>' + q.who[0] + '</b> е с повече точки ' +
    bgList(beaten) + ', а <b>' + q.who[q.k] + '</b> е с повече точки <b>само</b> от ' + bgList(only) +
    '. Колко момчета са с <b>' + (q.asksAbove ? 'повече' : 'по-малко') + '</b> точки от <b>' +
    q.who[q.k] + '</b>?</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqRank(q){
  return q.who.map(rankNm).join(' > ') + tr(', пита се за ' + q.who[q.k], ', питання про ' + rankAcc[q.who[q.k]]) + ' → ' + q.ans;
}
// Who is over whom: the boy asked about in the middle, the few he is over under him, everybody else over him — side
// by side, since the question gives no order among them. The group asked about is blue and counted.
function rankSvg(q){
  const W = 72, gap = 8, above = q.who.slice(0, q.k), below = q.who.slice(q.k + 1);
  const tier = (names, y, fill, stroke, step) => { const x0 = 150 - (names.length * W + (names.length - 1) * gap) / 2;
    return '<g' + popAt(step) + '>' + names.map((nm, i) => '<rect x="' + (x0 + i * (W + gap)) + '" y="' + y + '" width="' + W + '" height="26" rx="13" fill="' + fill + '" stroke="' + stroke + '" stroke-width="2"/>' +
      svgText(x0 + i * (W + gap) + W / 2, y + 18, rankNm(nm), 12, 'var(--ink)')).join('') + '</g>'; };
  const asked = (on, y, v, step) => svgText(284, y + 18, v, 15, on ? 'var(--accent)' : 'var(--muted)', popAt(step));
  const foot = q.tall ? tr(q.asksAbove ? 'по-високи от него: ' : 'по-ниски от него: ', q.asksAbove ? 'вищі за нього: ' : 'нижчі за нього: ')
    : tr(q.asksAbove ? 'с повече точки: ' : 'с по-малко точки: ', q.asksAbove ? 'більше балів: ' : 'менше балів: ');
  return '<svg viewBox="0 0 300 170" style="display:block; width:300px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('кой над кого е', 'хто кого випередив') + '">' +
    '<path d="M16,128 V14 M10,22 L16,12 L22,22" stroke="var(--muted)" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
    tier([q.who[q.k]], 56, 'var(--warmbg)', 'var(--warm)', 0) +
    tier(below, 100, q.asksAbove ? 'none' : 'var(--accentbg)', q.asksAbove ? 'var(--line)' : 'var(--accent)', 1) +
    tier(above, 12, q.asksAbove ? 'var(--accentbg)' : 'none', q.asksAbove ? 'var(--accent)' : 'var(--line)', 2) +
    asked(q.asksAbove, 12, above.length, 3) + asked(!q.asksAbove, 100, below.length, 3) +
    svgText(150, 160, foot + q.ans, 14, 'var(--ink)', popAt(4)) + '</svg>';
}
function whyRank(q, full){
  if(!full) return tr('Който е над само няколко, е под всички останали.', 'Хто випередив лише кількох, той поступився всім іншим.');
  const below = q.n - 1 - q.k;
  return tr(q.who[q.k] + ' е над ' + below + ' от тях, значи останалите ' + q.k + ' са над него' +
    ' &nbsp;→&nbsp; ' + (q.asksAbove ? 'над него са ' + q.ans : 'под него са ' + q.ans),
    rankNm(q.who[q.k]) + ' випередив ' + below + ' з них, отже інші ' + q.k + ' випередили його' +
    ' &nbsp;→&nbsp; ' + (q.tall ? (q.asksAbove ? 'вищі за нього: ' : 'нижчі за нього: ') : q.asksAbove ? 'більше балів мають ' : 'менше балів мають ') + q.ans) + rankSvg(q);
}
KIND.rank = { draw:drawRank, eq:eqRank, why:whyRank };
