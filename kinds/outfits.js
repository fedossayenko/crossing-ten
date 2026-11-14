// Question kind 'outfits': level 294 Тоалети — Every top with every bottom: how many different outfits.

// Аз и числата 2023, 2 клас, задача 4: Антон has 5 shirts and 2 pairs of trousers, each a different colour. Each pair
// of trousers goes with all 5 shirts: 5 + 5 = 10 outfits. The slip adds the two numbers, 5 + 2 = 7. The tops stay
// few enough to add up, as a 2nd-grader does in January, before the times table.
import { KIND, UK_PLURAL, answerLine, numSpan, popAt, rnd, svgText, tr } from '../js/core.js';
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
// Салабашев 2019, 2 клас, задача 10: to beat the dragon two fighters with different weapons are needed — the dwarf Баин with an axe, the
// elves Лио and Нео with bows, the men Мат, Тед and Дан with swords. In how many ways can two of the six be chosen? From two different
// groups: the dwarf with an elf 2, the dwarf with a man 3, an elf with a man 3 + 3 = 6 — 2 + 3 + 6 = 11. The slip is any two of the six, 15.
// Written as sums, as the times table comes later. Level 479 (needs 294): three groups and «different weapons» is two dots up from
// every top with every bottom.
// a group: [names: [Bulgarian, Ukrainian]], and how the sentence names it — [Bulgarian one, Bulgarian many, Ukrainian one, Ukrainian many]
// (+ how it is named in «with …»: [Bulgarian one, many, Ukrainian one, many])
const DR_GROUPS = [
  { names:[['Баин', 'Баїн'], ['Зуг', 'Зуг'], ['Бофур', 'Бофур']], lead:['джуджето', 'джуджетата', 'гном', 'гноми'], rel:['което носи брадва', 'които носят брадви', 'який носить сокиру', 'які носять сокири'], with:['джуджето', 'джуджетата', 'гномом', 'гномами'] },
  { names:[['Лио', 'Ліо'], ['Нео', 'Нео'], ['Лин', 'Лін']], lead:['елфът', 'елфите', 'ельф', 'ельфи'], rel:['който стреля с лък', 'които стрелят с лъкове', 'який стріляє з лука', 'які стріляють з луків'], with:['елфа', 'елфите', 'ельфом', 'ельфами'] },
  { names:[['Мат', 'Мат'], ['Тед', 'Тед'], ['Дан', 'Дан']], lead:['човекът', 'хората', 'людина', 'люди'], rel:['който е с меч', 'които са с мечове', 'яка з мечем', 'які з мечами'], with:['човека', 'хората', 'людиною', 'людьми'] },
];
const DR_ALL = { 5:['петимата', 'п’яти'], 6:['шестимата', 'шести'], 7:['седмината', 'семи'] };
export function genDragon(){
  for(;;){
    const sizes = [1 + rnd(3), 1 + rnd(3), 1 + rnd(3)], N = sizes[0] + sizes[1] + sizes[2];
    if(N < 5 || N > 7) continue;
    const [a, b, c] = sizes, ans = a*b + a*c + b*c;
    return {kind:'outfits', shape:'dragon', sizes, traps:[N*(N - 1)/2].filter(v => v !== ans), ans};
  }
}
// a product as the sum the second grade writes: the bigger number as many times as the smaller
const drProd = (x, y) => Array(Math.min(x, y)).fill(Math.max(x, y)).join(' + ');
const drPairs = q => [[0, 1], [0, 2], [1, 2]].map(([i, j]) => ({ i, j, n: q.sizes[i]*q.sizes[j] }));
const drJoin = (a, and) => a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' ' + and + ' ' + a[a.length - 1];
const drLine = (q, g, uk) => { const G = DR_GROUPS[g], n = q.sizes[g], names = G.names.slice(0, n).map(v => v[uk ? 1 : 0]), one = n === 1;
  return uk ? G.lead[one ? 2 : 3] + ' ' + drJoin(names, 'і') + ', ' + G.rel[one ? 2 : 3] : G.lead[one ? 0 : 1] + ' ' + drJoin(names, 'и') + ', ' + G.rel[one ? 0 : 1]; };
const drWith = (q, g, uk) => DR_GROUPS[g].with[(uk ? 2 : 0) + (q.sizes[g] === 1 ? 0 : 1)];
const drTotal = q => q.sizes[0] + q.sizes[1] + q.sizes[2];
function drawDragon(q){
  const N = drTotal(q), lines = lang => [0, 1, 2].map(g => '• ' + drLine(q, g, lang)).join(',<br>');
  return '<div class="ask">' + tr('За да победим дракона, трябва да го нападнем с <b>два различни</b> вида оръжие. С дракона искат да се бият:', 'Щоб перемогти дракона, треба напасти його <b>двома різними</b> видами зброї. З драконом хочуть битися:') + '</div>' +
    '<div class="given" style="text-align:left">' + tr(lines(false), lines(true)) + '.</div>' +
    '<div class="ask">' + tr('По колко различни начина от ' + DR_ALL[N][0] + ' можем да изберем <b>двама</b>, които да победят дракона?', 'Скількома різними способами з усіх ' + DR_ALL[N][1] + ' можна вибрати <b>двох</b>, які переможуть дракона?') + '</div>' +
    answerLine('xl');
}
function drawOutfits(q){
  if(q.shape === 'dragon') return drawDragon(q);
  const [bgWho, ukWho] = OUT_WHO[q.who], S = OUT_SETS[q.set];
  return '<div class="ask">' + tr(bgWho + ' има ' + numSpan(q.a) + ' различни по цвят ' + S.bg[0] + ' и ' + numSpan(q.b) + ' различни по цвят ' + S.bg[1] + '. Колко различни тоалета може да облече ' + bgWho + '?',
    ukWho + ' має ' + numSpan(q.a) + ' ' + outUk(q.a, S.uk[0][0], S.uk[0][1]) + ' різного кольору і ' + numSpan(q.b) + ' ' + outUk(q.b, S.uk[1][0], S.uk[1][1]) +
      ' різного кольору. Скільки різних комплектів одягу може вдягнути ' + ukWho + '?') + '</div>' +
    answerLine('xl');
}
function eqOutfits(q){ if(q.shape === 'dragon') return drPairs(q).map(p => p.n).join(' + ') + ' = ' + q.ans; return Array(q.b).fill(q.a).join(' + ') + ' = ' + q.ans; }
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
  if(q.shape === 'dragon'){
    if(!full) return tr('Двамата трябва да са с различно оръжие, значи от две различни групи. От кои две групи може да са? Преброй двойките за всеки две групи поотделно.',
      'Двоє мають бути з різною зброєю, тож з двох різних груп. З яких двох груп вони можуть бути? Порахуй пари для кожних двох груп окремо.');
    const ps = drPairs(q), lab = (g, uk) => uk ? DR_GROUPS[g].lead[q.sizes[g] === 1 ? 2 : 3] : DR_GROUPS[g].lead[q.sizes[g] === 1 ? 0 : 1];
    const part = (p, uk) => lab(p.i, uk) + (uk ? ' з ' : ' с ') + drWith(q, p.j, uk) + ': ' + (q.sizes[p.i] === 1 || q.sizes[p.j] === 1 ? p.n : drProd(q.sizes[p.i], q.sizes[p.j]) + ' = ' + p.n);
    return tr(ps.map(p => part(p, false)).join('; &nbsp;'), ps.map(p => part(p, true)).join('; &nbsp;')) + ' &nbsp;→&nbsp; <b>' + ps.map(p => p.n).join(' + ') + ' = ' + q.ans + '</b>';
  }
  const S = OUT_SETS[q.set];
  if(!full) return tr('Вземи ' + S.one[0] + ': с колко различни ' + S.bg[0] + ' може да се облече? После направи същото с другите.',
    'Візьми ' + S.one[1] + ': зі скількома різними ' + S.with + ' її можна вдягнути? Потім зроби те саме з іншими.');
  return tr(S.each[0] + ' с всичките ' + q.a + ' ' + S.bg[0], S.each[1] + ' з усіма ' + q.a + ' ' + S.with) + outfitsSvg(q);
}
KIND.outfits = { draw:drawOutfits, eq:eqOutfits, why:whyOutfits };
