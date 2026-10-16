// Question kind 'cuts': level 291 Разрези — Cuts and pieces, and things planted between others: one more, or one fewer.

// Аз и числата 2026, 2 клас, задача 1: a ribbon cut in 4 places makes 5 pieces — every cut adds one piece to what
// there was. Asked the other way round: so many pieces, how many cuts. Аз и числата 2024, задача 10: four pines,
// a rose bush between each two of them: 3 bushes, one fewer than the pines (the paper's picture shows two pines and
// a bush; the text counts). The slip is the number given, or one too many.
import { KIND, SLOT, UK_PLURAL, popAt, rnd, svgText, tr } from '../js/core.js';
// who: [Bulgarian, feminine, Ukrainian]
const CUT_WHO = [['Капитан Защо', false, 'Капітан Чому'], ['Пинки', true, 'Пінкі'], ['Мая', true, 'Мая'], ['Иво', false, 'Іво']];
// what is cut: [Bulgarian, which (by gender), with the article, Ukrainian (accusative), Ukrainian short]
const CUT_THING = [['лента за панделка', 'която', 'лентата', 'стрічку для бантика', 'стрічку'], ['въже', 'което', 'въжето', 'мотузку', 'мотузку'],
  ['дълга пръчка', 'която', 'пръчката', 'довгу палицю', 'палицю']];
// the trees between which the bushes go: [Bulgarian count form, Ukrainian 2–4, Ukrainian 5+]
const CUT_TREES = [['бора', 'сосни', 'сосен'], ['дъба', 'дуби', 'дубів'], ['кестена', 'каштани', 'каштанів']];
const CUT_BG = {3:'три', 4:'четири', 5:'пет', 6:'шест', 7:'седем', 8:'осем', 9:'девет'};
const CUT_UK = {3:'три', 4:'чотири', 5:'п’ять', 6:'шість', 7:'сім', 8:'вісім', 9:'дев’ять'};
const cutUk = (n, few, many) => UK_PLURAL.select(n) === 'few' ? few : many;
export function genCuts(){
  const w = Math.random();
  if(w < 0.35){
    const n = 3 + rnd(7), t = rnd(CUT_TREES.length);
    return {kind:'cuts', shape:'between', n, t, traps:[n, n + 1], ans: n - 1};
  }
  const who = rnd(CUT_WHO.length), th = rnd(CUT_THING.length);
  if(w < 0.6){
    const n = 3 + rnd(8);
    return {kind:'cuts', shape:'pieces', who, th, n, traps:[n, n + 1], ans: n - 1};
  }
  const k = 2 + rnd(8);
  return {kind:'cuts', shape:'cut', who, th, k, traps:[k, k + 2], ans: k + 1};
}
const num = x => '<span class="num">' + x + '</span>';
function drawCuts(q){
  if(q.shape === 'between'){
    const T = CUT_TREES[q.t];
    return '<div class="ask">' + tr('В парк засадили ' + CUT_BG[q.n] + ' ' + T[0] + '. Между тях засаждали по един розов храст. Колко розови храста засадили?',
      'У парку посадили ' + CUT_UK[q.n] + ' ' + cutUk(q.n, T[1], T[2]) + '. Між ними садили по одному кущу троянд. Скільки кущів троянд посадили?') + '</div>' +
      '<div class="line xl">' + SLOT + '</div>';
  }
  const [bgWho, f, ukWho] = CUT_WHO[q.who], T = CUT_THING[q.th], a = f ? 'а' : '';
  if(q.shape === 'pieces') return '<div class="ask">' + tr(bgWho + ' разрязал' + a + ' ' + T[0] + ' на ' + num(q.n) + ' парчета. На колко места е срязал' + a + ' ' + T[2] + '?',
      ukWho + (f ? ' розрізала ' : ' розрізав ') + T[3] + ' на ' + num(q.n) + ' ' + cutUk(q.n, 'шматки', 'шматків') + '. У скількох місцях ' + (f ? 'вона різала' : 'він різав') + ' ' + T[4] + '?') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
  return '<div class="ask">' + tr(bgWho + ' купил' + a + ' ' + T[0] + ', ' + T[1] + ' срязал' + a + ' на ' + num(q.k) + ' места. Колко парчета са се получили?',
    ukWho + (f ? ' купила ' : ' купив ') + T[3] + ', яку ' + (f ? 'розрізала' : 'розрізав') + ' у ' + num(q.k) + ' місцях. Скільки шматків вийшло?') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqCuts(q){
  if(q.shape === 'cut') return q.k + ' + 1 = ' + q.ans;
  return q.n + ' − 1 = ' + q.ans;
}
// The pictures: a ribbon with its cuts, or a row of trees with a bush in each gap. The hint's has no numbers;
// the solution's numbers the pieces, the cuts or the bushes, and ends on the count.
function cutsSvg(h, label, g){
  return '<svg viewBox="0 0 260 ' + h + '" style="display:block; width:300px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + label + '">' + g + '</svg>';
}
function ribbonSvg(cuts, full, q){
  const X0 = 10, W = 240, Y = 26, H = 20, step = W / (cuts + 1), at = i => (X0 + i*step).toFixed(1);
  let g = '<rect x="' + X0 + '" y="' + Y + '" width="' + W + '" height="' + H + '" rx="3" fill="var(--accentbg)" stroke="var(--accent)" stroke-width="2"/>';
  for(let i = 1; i <= cuts; i++) g += '<line' + (full ? popAt(i) : '') + ' x1="' + at(i) + '" y1="' + (Y - 8) + '" x2="' + at(i) + '" y2="' + (Y + H + 8) + '" stroke="var(--warm)" stroke-width="2.5" stroke-dasharray="4 3"/>';
  if(!full) return cutsSvg(64, tr('лента и разрезите по нея', 'стрічка і розрізи на ній'), g);
  const t0 = cuts + 1;
  if(q.shape === 'cut') for(let i = 0; i <= cuts; i++) g += svgText((X0 + (i + 0.5)*step).toFixed(1), Y + H + 22, i + 1, 13, 'var(--good)', popAt(t0 + i));
  else for(let i = 1; i <= cuts; i++) g += svgText(at(i), Y - 12, i, 12, 'var(--warm)', popAt(t0 + i));
  return cutsSvg(104, tr('парчетата на лентата', 'шматки стрічки'), g + svgText(130, 96, eqCuts(q), 15, 'var(--ink)', popAt(t0 + cuts + 2)));
}
function rowSvg(n, full, q){
  const X0 = 22, W = 216, step = W / (n - 1), x = i => X0 + i*step;
  const tree = (cx, extra) => '<g' + (extra || '') + '><rect x="' + (cx - 1.5).toFixed(1) + '" y="40" width="3" height="10" fill="var(--warm)"/>' +
    '<path d="M' + cx.toFixed(1) + ',14 l8,26 h-16 z" fill="var(--good)"/></g>';
  const bush = (cx, extra) => '<circle' + (extra || '') + ' cx="' + cx.toFixed(1) + '" cy="45" r="5" fill="var(--rose)"/>';
  let g = '<line x1="4" y1="50" x2="256" y2="50" stroke="var(--line)" stroke-width="2"/>';
  for(let i = 0; i < n; i++) g += tree(x(i));
  for(let i = 1; i < n; i++) g += bush(x(i) - step/2, full ? popAt(i) : '');
  if(!full) return cutsSvg(58, tr('дърветата и храстите между тях', 'дерева і кущі між ними'), g);
  for(let i = 1; i < n; i++) g += svgText((x(i) - step/2).toFixed(1), 68, i, 12, 'var(--rose)', popAt(n + i));
  return cutsSvg(100, tr('храстите между дърветата', 'кущі між деревами'), g + svgText(130, 92, eqCuts(q), 15, 'var(--ink)', popAt(2*n + 1)));
}
function whyCuts(q, full){
  if(q.shape === 'between'){
    if(!full) return tr('Храстите са само в празните места между две дървета. Колко са празните места?', 'Кущі лише в проміжках між двома деревами. Скільки цих проміжків?') + rowSvg(4, false, q);
    return tr('между ' + q.n + ' дървета има <b>' + (q.n - 1) + '</b> празни места — по един храст във всяко',
      'між ' + q.n + ' деревами <b>' + (q.n - 1) + '</b> ' + cutUk(q.n - 1, 'проміжки', 'проміжків') + ' — по одному кущу в кожному') + rowSvg(q.n, true, q);
  }
  if(q.shape === 'pieces'){
    if(!full) return tr('Всеки разрез прави от едно парче две. Колко разреза трябват за толкова парчета?', 'Кожен розріз робить з одного шматка два. Скільки розрізів треба на стільки шматків?') + ribbonSvg(2, false, q);
    return tr('парчетата са с едно повече от разрезите, значи разрезите са с едно по-малко от парчетата',
      'шматків на один більше, ніж розрізів, отже розрізів на один менше, ніж шматків') + ribbonSvg(q.n - 1, true, q);
  }
  const T = CUT_THING[q.th];
  if(!full) return tr('Нарисувай ' + T[2] + ' и разрезите. Всеки разрез прави от едно парче две.', 'Намалюй ' + T[4] + ' й розрізи. Кожен розріз робить з одного шматка два.') + ribbonSvg(2, false, q);
  return tr('преди първия разрез има едно парче, и всеки разрез добавя още едно', 'до першого розрізу є один шматок, і кожен розріз додає ще один') + ribbonSvg(q.k, true, q);
}
KIND.cuts = { draw:drawCuts, eq:eqCuts, why:whyCuts };
