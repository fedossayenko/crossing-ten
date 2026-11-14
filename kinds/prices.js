// Question kind 'prices': level 185 Цените — School things priced in pairs, and one on its own.

// МБГ Пролет 2021, 1 клас, задача 14: a ruler and an eraser cost 50 стотинки, a ruler and a triangle 60,
// the triangle alone 40 — the eraser? (Asked in цента, as Bulgaria pays in euro since 2026.) The triangle's price takes the ruler out of the second pair:
// 60 − 40 = 20 for the ruler, and then 50 − 20 = 30 for the eraser.
// [Bulgarian, Bulgarian with the article, Ukrainian]
/** @type {[string, string, string][]} */
import { KIND, SLOT, rnd, shuffle, svgText, tr } from '../js/core.js';
const PRICE_THINGS = [['линийка', 'линийката', 'лінійка'], ['гума', 'гумата', 'гумка'], ['триъгълник', 'триъгълникът', 'трикутник'],
                      ['молив', 'моливът', 'олівець'], ['острилка', 'острилката', 'стругачка']];
export function genPrices(){
  for(;;){
    // x the thing in both pairs, y the one asked, z the one priced alone; prices in round tens
    const it = shuffle([0, 1, 2, 3, 4]).slice(0, 3), x = 10*(1 + rnd(5)), y = 10*(1 + rnd(5)), z = 10*(1 + rnd(5));
    if(x === y || y === z || x === z) continue;
    return {kind:'prices', it, x, y, z, A: x + y, B: x + z, traps:[x + y - z], ans: y};
  }
}
// Level 461. Салабашев 2023, задача 3: soup 5, a main dish 9 and a dessert 6 лева, the three together as a menu 16 — how much does
// ordering the menu save? 5 + 9 + 6 = 20, and 20 − 16 = 4. A second set: a cinema ticket, popcorn and a drink as a combo.
// [Bulgarian ×3 with the place, Ukrainian ×3, the offer's name in both]
const COMBO = [{ bg:['супа', 'основно ястие', 'десерт'], uk:['суп', 'основну страву', 'десерт'], at:['В ресторанта предлагат', 'комбинирано меню от трите ястия', 'комбинираното меню', 'трите ястия'],
    atUk:['У ресторані пропонують', 'комбіноване меню з трьох страв', 'комбіноване меню', 'три страви'] },
  { bg:['билет за кино', 'пуканки', 'напитка'], uk:['квиток у кіно', 'попкорн', 'напій'], at:['В киното предлагат', 'комбо от трите неща', 'комбото', 'трите неща'],
    atUk:['У кінотеатрі пропонують', 'комбо з трьох речей', 'комбо', 'три речі'] }];
export function genCombo(){
  for(;;){
    const set = rnd(COMBO.length), p = [3 + rnd(8), 4 + rnd(9), 3 + rnd(8)], S = p[0] + p[1] + p[2], save = 1 + rnd(6);
    return {kind:'prices', shape:'combo', set, p, S, M: S - save, traps:[S].filter(v => v !== save && v > 0), ans: save};
  }
}
// the things, drawn small: a ruler, an eraser, a set square, a pencil, a sharpener
function priceThing(i, x, y){
  const g = '<g transform="translate(' + x + ' ' + y + ')">';
  if(i === 0) return g + '<rect x="-30" y="-6" width="60" height="12" rx="2" fill="var(--lemon)" stroke="var(--ink)" stroke-width="1.2"/>' +
    [-24, -18, -12, -6, 0, 6, 12, 18, 24].map((t, k) => '<line x1="' + t + '" y1="-6" x2="' + t + '" y2="' + (k % 2 ? -2 : 0) + '" stroke="var(--ink)" stroke-width="1"/>').join('') + '</g>';
  if(i === 1) return g + '<rect x="-14" y="-8" width="28" height="16" rx="4" fill="var(--rose)" stroke="var(--ink)" stroke-width="1.2"/><rect x="2" y="-8" width="12" height="16" rx="0" fill="var(--accent)" opacity=".7"/></g>';
  if(i === 2) return g + '<path d="M-16,12 L-16,-14 L16,12 Z" fill="var(--good)" fill-opacity=".35" stroke="var(--ink)" stroke-width="1.4"/><path d="M-11,7 L-11,-3 L1,7 Z" fill="var(--solid)" stroke="var(--ink)" stroke-width="1"/></g>';
  if(i === 3) return g + '<rect x="-24" y="-4" width="40" height="8" fill="var(--warm)" stroke="var(--ink)" stroke-width="1.2"/><path d="M16,-4 L26,0 L16,4 Z" fill="var(--pear)" stroke="var(--ink)" stroke-width="1"/><rect x="-28" y="-4" width="4" height="8" fill="var(--rose)" stroke="var(--ink)" stroke-width="1"/></g>';
  return g + '<rect x="-11" y="-9" width="22" height="18" rx="3" fill="var(--accent)" fill-opacity=".5" stroke="var(--ink)" stroke-width="1.2"/><circle cx="0" cy="0" r="4" fill="var(--solid)" stroke="var(--ink)" stroke-width="1"/></g>';
}
// four panels: x with y, x with z, z alone, y alone — each with its price under it
function pricesSvg(q){
  const [x, y, z] = q.it, panels = [[[x, y], q.A], [[x, z], q.B], [[z], q.z], [[y], '?']];
  let g = '';
  panels.forEach(([things, price], k) => {
    const cx = 40 + k*80;
    g += '<rect x="' + (cx - 36) + '" y="0" width="72" height="92" rx="10" fill="var(--solid)" stroke="var(--line)" stroke-width="1.4"/>';
    things.forEach((t, j) => { g += priceThing(t, cx, things.length === 1 ? 32 : 18 + j*30); });
    g += svgText(cx, 82, price === '?' ? '?' : price + tr(' цента', ' центів'), 13, 'var(--ink)');
  });
  return '<div class="fig wide"><svg viewBox="0 -2 320 96" role="img" aria-label="' + tr('нещата и цените им', 'речі та їхні ціни') + '">' + g + '</svg></div>';
}
const priceName = (q, k) => tr(PRICE_THINGS[q.it[k]][0], PRICE_THINGS[q.it[k]][2]);
function drawPrices(q){
  if(q.shape === 'combo'){
    const c = COMBO[q.set], n = x => '<span class="num">' + x + '</span>';
    return '<div class="ask">' + tr(c.at[0] + ' ' + c.bg[0] + ' за ' + n(q.p[0]) + ' евро, ' + c.bg[1] + ' за ' + n(q.p[1]) + ' евро и ' + c.bg[2] + ' за ' + n(q.p[2]) + ' евро. Предлага се и ' + c.at[1] + ', което струва ' + n(q.M) + ' евро. <b>Колко евро спестява човек, ако си поръча ' + c.at[2] + ', вместо ' + c.at[3] + ' поотделно?</b>',
      c.atUk[0] + ' ' + c.uk[0] + ' за ' + n(q.p[0]) + ' євро, ' + c.uk[1] + ' за ' + n(q.p[1]) + ' євро і ' + c.uk[2] + ' за ' + n(q.p[2]) + ' євро. Є також ' + c.atUk[1] + ', що коштує ' + n(q.M) + ' євро. <b>Скільки євро заощадить людина, якщо замовить ' + c.atUk[2] + ' замість того, щоб купувати ' + c.atUk[3] + ' окремо?</b>') + '</div>' +
      '<div class="line lg">' + SLOT + ' <span class="unit">' + tr('евро', 'євро') + '</span></div>';
  }
  const t = PRICE_THINGS[q.it[1]];
  return '<div class="ask">' + tr('Колко цента струва <b>' + t[1] + '</b>?', 'Скільки центів коштує <b>' + t[2] + '</b>?') + '</div>' + pricesSvg(q) +
    '<div class="line lg">' + SLOT + ' <span class="unit">' + tr('цента', 'ц.') + '</span></div>';
}
function eqPrices(q){
  if(q.shape === 'combo') return q.p.join(' + ') + ' = ' + q.S + ', ' + q.S + ' − ' + q.M + ' = ' + q.ans;
  return priceName(q, 0) + ' ' + q.B + ' − ' + q.z + ' = ' + q.x + ', ' + priceName(q, 1) + ' ' + q.A + ' − ' + q.x + ' = ' + q.ans;
}
function whyPrices(q, full){
  if(q.shape === 'combo'){
    if(!full) return tr('Колко струват трите поотделно? Сравни с цената на менюто.', 'Скільки коштують три окремо? Порівняй з ціною меню.');
    return q.p.join(' + ') + ' = <b>' + q.S + '</b> ' + tr('евро поотделно', 'євро окремо') + ' &nbsp;→&nbsp; ' + q.S + ' − ' + q.M + ' = ' + q.ans;
  }
  if(!full) return tr('Във втората картинка има нещо, чиято цена знаеш. Махни го — какво остава?', 'На другому малюнку є річ, ціну якої ти знаєш. Прибери її — що лишається?');
  return priceName(q, 0) + ' + ' + priceName(q, 2) + ' = ' + q.B + ', ' + priceName(q, 2) + ' = ' + q.z + ' &nbsp;→&nbsp; ' + priceName(q, 0) + ' = ' + q.B + ' − ' + q.z + ' = <b>' + q.x + '</b> &nbsp;→&nbsp; ' +
    priceName(q, 1) + ' = ' + q.A + ' − ' + q.x + ' = ' + q.ans;
}
KIND.prices = { draw:drawPrices, eq:eqPrices, why:whyPrices };
