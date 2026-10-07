// Question kind 'legs': level 264 Крака и гърбици — So many legs or humps on each animal, all of them added.

// МБГ Есен 2024, 3 клас, задача 17 (shape 'legs'): how many legs have 9 beetles and 6 spiders, a spider with 8 legs
// and a beetle with 6, as the pictures say: 9 · 6 + 6 · 8 = 54 + 48 = 102.
// МБГ Есен 2023, 3 клас, задача 20 (shape 'humps'): 6 one-humped camels and twice as many two-humped ones — how many
// humps? 6 · 2 = 12 two-humped camels, 6 · 1 + 12 · 2 = 30. Sometimes it is the one-humped that are so many times more.
import { KIND, SLOT, popAt, rnd, svgText, tr, ukN } from '../js/core.js';
export function genLegs(){
  if(Math.random() < 0.5){
    // a beetles, b spiders; spiders: the spiders are named first
    const a = 3 + rnd(7), b = 3 + rnd(7), spiders = Math.random() < 0.3, ans = a*6 + b*8;
    return {kind:'legs', shape:'legs', a, b, spiders, traps: [a*8 + b*6, a + b].filter(v => v !== ans), ans};
  }
  // a camels of the kind given; t times more of the other; two: the given ones are the two-humped
  const a = 2 + rnd(8), t = 2 + rnd(2), two = Math.random() < 0.3, ans = two ? 2*a + t*a : a + 2*t*a;
  return {kind:'legs', shape:'humps', a, t, two, traps: [a + t*a, two ? 2*a : 2*t*a].filter(v => v !== ans), ans};
}
// after «у»: 3 жуків, 9 павуків (a and b are 3 to 9)
const legsBeetles = n => tr(n + ' бръмбара', n + ' жуків'), legsSpiders = n => tr(n + ' паяка', n + ' павуків');
// a spider and a beetle, every leg drawn apart from the others so they can be counted, each with what the paper says
// under it. The left legs are listed; the right ones are their mirror image.
const LEGS_SPIDER = [[75,32, 64,18, 56,26], [74,35, 60,28, 50,38], [74,38, 60,40, 50,54], [75,41, 64,50, 58,66]];
const LEGS_BEETLE = [[229,36, 218,30, 212,20], [228,46, 215,46, 208,52], [229,56, 218,62, 214,72]];
function legsSvg(){
  const leg = (p, c, w) => '<path d="M' + p[0] + ',' + p[1] + ' L' + p[2] + ',' + p[3] + ' L' + p[4] + ',' + p[5] + '" fill="none" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>';
  const flip = (p, cx) => p.map((v, i) => i % 2 ? v : 2*cx - v);
  const sp = LEGS_SPIDER.map(p => leg(p, 'var(--ink)', 2) + leg(flip(p, 80), 'var(--ink)', 2)).join('') +
    '<circle cx="80" cy="36" r="7" fill="var(--ink)"/><ellipse cx="80" cy="52" rx="9" ry="11" fill="var(--ink)"/>';
  const bt = LEGS_BEETLE.map(p => leg(p, 'var(--ant)', 2) + leg(flip(p, 240), 'var(--ant)', 2)).join('') +
    '<path d="M237,19 Q234,10 228,7 M243,19 Q246,10 252,7" fill="none" stroke="var(--ant)" stroke-width="1.6" stroke-linecap="round"/>' +
    '<circle cx="240" cy="24" r="6" fill="var(--ant)"/><ellipse cx="240" cy="46" rx="13" ry="17" fill="var(--ant)"/><path d="M240,31 V62" stroke="var(--card)" stroke-width="1.4"/>';
  const cap = (x, a, b) => svgText(x, 92, a, 12, 'var(--muted)') + svgText(x, 108, b, 12, 'var(--muted)');
  return '<div class="fig wide"><svg viewBox="0 0 320 114" role="img" aria-label="' + tr('паяк и бръмбар', 'павук і жук') + '">' +
    '<g' + popAt(1) + '>' + sp + '</g><g' + popAt(2) + '>' + bt + '</g>' +
    cap(80, tr('Всеки паяк', 'Кожен павук'), tr('има 8 крака', 'має 8 ніг')) + cap(240, tr('Всеки бръмбар', 'Кожен жук'), tr('има 6 крака', 'має 6 ніг')) + '</svg></div>';
}
const LEGS_TIMES_BG = {2:'два', 3:'три'}, LEGS_TIMES_UK = {2:'удвічі', 3:'утричі'};
function drawLegs(q){
  if(q.shape === 'humps'){
    const [given, other] = q.two ? [tr('двугърби', 'двогорбих'), tr('едногърби', 'одногорбих')] : [tr('едногърби', 'одногорбих'), tr('двугърби', 'двогорбих')];
    return '<div class="ask">' + tr('В едно стадо има <span class="num">' + q.a + '</span> ' + given + ' камили и ' + LEGS_TIMES_BG[q.t] + ' пъти повече ' + other +
        ' камили. <b>Колко общо са гърбиците на камилите от това стадо?</b>',
      'У стаді <span class="num">' + q.a + '</span> ' + given + ' ' + ukN(q.a, 'верблюд', 'верблюди', 'верблюдів').replace(/^\d+ /, '') + ' і ' + LEGS_TIMES_UK[q.t] + ' більше ' + other +
        ' верблюдів. <b>Скільки всього горбів у верблюдів цього стада?</b>') + '</div>' +
      '<div class="line xl">' + SLOT + '</div>';
  }
  const both = q.spiders ? legsSpiders(q.b) + tr(' и ', ' і ') + legsBeetles(q.a) : legsBeetles(q.a) + tr(' и ', ' і ') + legsSpiders(q.b);
  return '<div class="ask">' + tr('Колко крака общо имат ' + both.replace(/(\d+)/g, '<span class="num">$1</span>') + '?',
    'Скільки всього ніг у ' + both.replace(/(\d+)/g, '<span class="num">$1</span>') + '?') + '</div>' + legsSvg() +
    '<div class="line xl">' + SLOT + '</div>';
}
// the camels: the given kind first, then the other, t times as many
const legsHerd = q => q.two ? {one: q.t*q.a, two: q.a} : {one: q.a, two: q.t*q.a};
function eqLegs(q){
  if(q.shape === 'humps'){ const h = legsHerd(q); return q.a + ' · ' + q.t + ' = ' + q.t*q.a + ', ' + h.one + ' · 1 + ' + h.two + ' · 2 = ' + q.ans; }
  return q.a + ' · 6 + ' + q.b + ' · 8 = ' + q.a*6 + ' + ' + q.b*8 + ' = ' + q.ans;
}
function whyLegs(q, full){
  if(q.shape === 'humps'){
    if(!full) return q.two ? tr('Първо колко са едногърбите камили. После събери гърбиците — на двугърбите са по две.', 'Спершу скільки одногорбих верблюдів. Потім додай горби — у двогорбих їх по два.')
      : tr('Първо колко са двугърбите камили. После събери гърбиците — всяка от тях има по две.', 'Спершу скільки двогорбих верблюдів. Потім додай горби — у кожного з них по два.');
    const h = legsHerd(q);
    return (q.two ? tr('едногърбите: ', 'одногорбих: ') : tr('двугърбите: ', 'двогорбих: ')) + q.a + ' · ' + q.t + ' = <b>' + q.t*q.a + '</b>' + tr(' камили', ' ' + ukN(q.t*q.a, 'верблюд', 'верблюди', 'верблюдів').replace(/^\d+ /, '')) +
      ' &nbsp;→&nbsp; ' + tr('гърбиците: ', 'горбів: ') + h.one + ' · 1 + ' + h.two + ' · 2 = ' + h.one + ' + ' + 2*h.two + ' = ' + q.ans;
  }
  if(!full) return tr('Пресметни поотделно краката на бръмбарите и краката на паяците, после ги събери.', 'Порахуй окремо ноги жуків і ноги павуків, а потім додай.');
  return tr('бръмбарите: ', 'жуки: ') + q.a + ' · 6 = <b>' + q.a*6 + '</b>, ' + tr('паяците: ', 'павуки: ') + q.b + ' · 8 = <b>' + q.b*8 + '</b> &nbsp;→&nbsp; ' + q.a*6 + ' + ' + q.b*8 + ' = ' + q.ans;
}
KIND.legs = { draw:drawLegs, eq:eqLegs, why:whyLegs };
