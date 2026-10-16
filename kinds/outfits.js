// Question kind 'outfits': level 294 Тоалети — Every top with every bottom: how many different outfits.

// Аз и числата 2023, 2 клас, задача 4: Антон has 5 shirts and 2 pairs of trousers, each a different colour. Each pair
// of trousers goes with all 5 shirts: 5 + 5 = 10 outfits. The slip adds the two numbers, 5 + 2 = 7. The tops stay
// few enough to add up, as a 2nd-grader does in January, before the times table.
import { KIND, SLOT, UK_PLURAL, popAt, rnd, svgText, tr } from '../js/core.js';
// who wears it: [Bulgarian, Ukrainian, feminine]; what: [tops, bottoms] — Bulgarian count forms, Ukrainian 2–4 and 5+
const OUT_WHO = [['Антон', 'Антон', false], ['Ива', 'Іва', true], ['Петър', 'Петро', false], ['Мая', 'Мая', true]];
const OUT_SETS = [
  { bg:['ризи', 'панталона'], uk:[['сорочки', 'сорочок'], ['пари штанів', 'пар штанів']], one:['един панталон', 'одну пару штанів'], each:['всеки панталон', 'кожна пара штанів'], with:'сорочками' },
  { bg:['блузи', 'поли'], uk:[['блузки', 'блузок'], ['спідниці', 'спідниць']], one:['една пола', 'одну спідницю'], each:['всяка пола', 'кожна спідниця'], with:'блузками' },
  { bg:['тениски', 'шапки'], uk:[['футболки', 'футболок'], ['кепки', 'кепок']], one:['една шапка', 'одну кепку'], each:['всяка шапка', 'кожна кепка'], with:'футболками' },
];
const outUk = (n, few, many) => UK_PLURAL.select(n) === 'few' ? few : many;
export function genOutfits(){
  const who = rnd(OUT_WHO.length), set = rnd(OUT_SETS.length), a = 2 + rnd(5), b = 2 + rnd(2);
  return {kind:'outfits', who, set, a, b, traps:[a + b, a*b + 1].filter(t => t !== a*b), ans: a*b};   // 2 + 2 is 2 · 2: no slip there
}
const num = x => '<span class="num">' + x + '</span>';
function drawOutfits(q){
  const [bgWho, ukWho] = OUT_WHO[q.who], S = OUT_SETS[q.set];
  return '<div class="ask">' + tr(bgWho + ' има ' + num(q.a) + ' различни по цвят ' + S.bg[0] + ' и ' + num(q.b) + ' различни по цвят ' + S.bg[1] + '. Колко различни тоалета може да облече ' + bgWho + '?',
    ukWho + ' має ' + num(q.a) + ' ' + outUk(q.a, S.uk[0][0], S.uk[0][1]) + ' різного кольору і ' + num(q.b) + ' ' + outUk(q.b, S.uk[1][0], S.uk[1][1]) +
      ' різного кольору. Скільки різних комплектів одягу може вдягнути ' + ukWho + '?') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqOutfits(q){ return Array(q.b).fill(q.a).join(' + ') + ' = ' + q.ans; }
// The picture: one row for each bottom, with every top beside it — the rows hold as many as there are tops,
// and the outfits are numbered along them, ending on the count.
const OUT_COLORS = ['var(--accent)', 'var(--good)', 'var(--warm)', 'var(--rose)', 'var(--grape)', 'var(--lemon)'];
function outfitsSvg(q){
  const top = (x, y, c) => '<path d="M' + (x - 9) + ',' + (y - 8) + ' l6,-4 h6 l6,4 l-3,5 h-1 v11 h-10 v-11 h-1 z" fill="' + c + '"/>';
  // trousers, a skirt or a cap, by the set
  const bot = (x, y) => '<path d="' + ['M' + (x - 8) + ',' + (y - 11) + ' h16 v22 h-6 l-2,-13 l-2,13 h-6 z',
    'M' + (x - 5) + ',' + (y - 10) + ' h10 l6,19 h-22 z', 'M' + (x - 9) + ',' + (y + 2) + ' a9,9 0 0 1 18,0 h5 v3 h-23 z'][q.set] + '" fill="var(--muted)"/>';
  const rowH = 38, W = 40 + q.a*36, H = q.b*rowH + 34;
  let g = '', k = 0;
  for(let r = 0; r < q.b; r++){
    const y = 22 + r*rowH;
    g += bot(16, y);
    for(let i = 0; i < q.a; i++){
      k++;
      g += '<g' + popAt(k) + '>' + top(52 + i*36, y, OUT_COLORS[i % OUT_COLORS.length]) + svgText(52 + i*36, y + 24, k, 11, 'var(--ink)') + '</g>';
    }
  }
  g += svgText(W / 2, H - 4, eqOutfits(q), 14, 'var(--ink)', popAt(k + 1));
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" style="display:block; width:' + Math.min(300, W*1.2) + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('всяка долна дреха с всяка горна', 'кожна нижня річ з кожною верхньою') + '">' + g + '</svg>';
}
function whyOutfits(q, full){
  const S = OUT_SETS[q.set];
  if(!full) return tr('Вземи ' + S.one[0] + ': с колко различни ' + S.bg[0] + ' може да се облече? После направи същото с другите.',
    'Візьми ' + S.one[1] + ': зі скількома різними ' + S.with + ' її можна вдягнути? Потім зроби те саме з іншими.');
  return tr(S.each[0] + ' с всичките ' + q.a + ' ' + S.bg[0], S.each[1] + ' з усіма ' + q.a + ' ' + S.with) + outfitsSvg(q);
}
KIND.outfits = { draw:drawOutfits, eq:eqOutfits, why:whyOutfits };
