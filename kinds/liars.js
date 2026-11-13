// Question kind 'liars': level 315 И двамата лъжат — Three children came at different times; two of them say where they came, and both lie.

// Кенгуру 2026, задача 22: Ачо «Аз пристигнах пръв», Марко «Аз пристигнах преди Ачо»; both lie. A lie says the opposite: Ачо was not
// first, Марко came after Ачо. So Ачо is not first and is before Марко — Дарко is first: Дарко, Ачо, Марко. The answer is an order of
// names, so the kind brings its own А–Д: five of the six orders, the likeliest slips (one of the two believed) first.
import { KIND, shuffle, tr } from '../js/core.js';
// names that do not change in Ukrainian
/** @type {[string, string][]} */
const LR_KIDS = [['Ачо', 'Ачо'], ['Дарко', 'Дарко'], ['Марко', 'Марко'], ['Пешо', 'Пешо'], ['Гошо', 'Гошо'], ['Данчо', 'Данчо']];
// [Bulgarian «in the …», Ukrainian «to the …»]
/** @type {[string, string][]} */
const LR_PLACE = [['във фитнеса', 'до фітнес-зали'], ['на стадиона', 'на стадіон'], ['в басейна', 'до басейну']];
const PERMS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
// a statement of kid k: type 0 first, 1 last, 2 before t, 3 after t; order[] holds the kids, earliest first
const said = (s, order) => {
  const at = order.indexOf(s.k);
  return s.type === 0 ? at === 0 : s.type === 1 ? at === 2 : s.type === 2 ? at < order.indexOf(s.t) : at > order.indexOf(s.t);
};
export function genLiars(){
  for(;;){
    const kids = shuffle([0, 1, 2, 3, 4, 5]).slice(0, 3), place = Math.floor(Math.random() * 3);
    const who = shuffle([0, 1, 2]).slice(0, 2), say = who.map(k => {
      const type = Math.floor(Math.random() * 4), others = [0, 1, 2].filter(o => o !== k);
      return {k, type, t: others[Math.floor(Math.random() * 2)]};
    });
    const fits = PERMS.filter(p => say.every(s => !said(s, p)));
    if(fits.length !== 1) continue;
    const truth = fits[0], lies = p => say.filter(s => !said(s, p)).length;
    const wrong = shuffle(PERMS.filter(p => p.join() !== truth.join())).sort((a, b) => Math.abs(lies(a) - 1) - Math.abs(lies(b) - 1)).slice(0, 4);   // the ones where only one of them lies first: believing the other
    const rows = shuffle(wrong.concat([truth])), pick = rows.findIndex(r => r.join() === truth.join());
    return {kind:'liars', kids, place, say, truth, options: rows.map((r, id) => ({ id, v: id, text: orderText(kids, r) })), pick, own: true, ans: pick};
  }
}
/** @returns {[string, string]} */
const orderText = (kids, order) => {
  const w = '<span class="vw">' + order.map(k => LR_KIDS[kids[k]][0]).join(', ') + '</span>';
  return [w, '<span class="vw">' + order.map(k => LR_KIDS[kids[k]][1]).join(', ') + '</span>'];
};
const nm = (q, k) => tr(LR_KIDS[q.kids[k]][0], LR_KIDS[q.kids[k]][1]);
const BG = ['Аз пристигнах пръв.', 'Аз пристигнах последен.', 'Аз пристигнах преди ', 'Аз пристигнах след '];
const UK = ['Я прийшов першим.', 'Я прийшов останнім.', 'Я прийшов раніше за ', 'Я прийшов пізніше за '];
const stmt = (q, s) => s.type < 2 ? tr(BG[s.type], UK[s.type]) : tr(BG[s.type] + LR_KIDS[q.kids[s.t]][0] + '.', UK[s.type] + LR_KIDS[q.kids[s.t]][1] + '.');
// what it means that the statement is a lie
const lie = (q, s) => s.type === 0 ? tr('не е пръв', 'не перший') : s.type === 1 ? tr('не е последен', 'не останній')
  : s.type === 2 ? tr('е след ' + LR_KIDS[q.kids[s.t]][0], 'пізніше за ' + LR_KIDS[q.kids[s.t]][1]) : tr('е преди ' + LR_KIDS[q.kids[s.t]][0], 'раніше за ' + LR_KIDS[q.kids[s.t]][1]);
function drawLiars(q){
  const all = [0, 1, 2].map(k => nm(q, k)), allUk = all.join(', ').replace(/, ([^,]*)$/, ' і $1');
  const intro = tr(all.join(', ').replace(/, ([^,]*)$/, ' и $1') + ' пристигнали ' + LR_PLACE[q.place][0] + ' по различно време.', allUk + ' прийшли ' + LR_PLACE[q.place][1] + ' у різний час.');
  const says = q.say.map(s => tr(nm(q, s.k) + ' казал: „' + stmt(q, s) + '“', nm(q, s.k) + ' сказав: «' + stmt(q, s) + '»')).join(' ');
  return '<div class="ask">' + intro + ' ' + says + ' <b>' + tr('Ако и двете момчета лъжат, в какъв ред са пристигнали тримата?', 'Якщо обидва хлопчики брешуть, у якому порядку прийшли ці троє?') + '</b></div>';
}
const names = (q, order) => order.map(k => nm(q, k)).join(', ');
function eqLiars(q){
  return tr('ред: ', 'порядок: ') + names(q, q.truth);
}
function whyLiars(q, full){
  if(!full) return tr('Който лъже, казва обратното на истината. Какво значи тогава всяко от изреченията?', 'Хто бреше, говорить протилежне тому, що є насправді. Що тоді означає кожне з речень?');
  return q.say.map(s => nm(q, s.k) + ' ' + tr('лъже', 'бреше') + ': ' + lie(q, s)).join('; ') + ' &nbsp;→&nbsp; <b>' + names(q, q.truth) + '</b>';
}
KIND.liars = { draw:drawLiars, eq:eqLiars, why:whyLiars };
