// Runs beside the app (in check.js's own scope, through eval).
// Number agreement in what a child reads. Every level is drawn from SEEDS seeds, in both languages, and everything it
// shows (task, summary line, hint, worked solution, options) is read for two things a hand-written plural gets wrong:
//  (a) a word that follows a number of one agreement class and, unchanged, a number of another class on the same level:
//      Ukrainian «3 стрибків» next to «5 стрибків» (classes: ends in 1 but not 11 / ends in 2–4 but not 12–14 / the rest),
//      Bulgarian «1 момичета» next to «5 момичета» (classes: 1 / any other number). The word has to change with the number
//      (ukN, ukPl, trN in js/core.js), or the sentence has to be built so no count stands before it.
//  (b) a digit ordinal whose ending does not fit its number: Bulgarian «6-и» (6-ти), «2-а» (2-ра), «1-та» (1-ва), «7-а» (7-ма);
//      Ukrainian «3-а» (3-я), «13-я» (13-а). Bulgarian «10-ият» (the article instead of -ти) is right.
// Words that do not agree with the number before them stay the same after any number and are listed in INVARIANT.
{
  const Q = Object.assign(Object.create(APP), { lang: l => { APP.LANG = l; } });
  const SEEDS = 150;
  // a unit, a sign or a word that is the same after every number (never a counted thing)
  const INVARIANT = new Set([
    // units and abbreviations do not decline
    'кг', 'см', 'дм', 'м', 'мм', 'км', 'л', 'г', 'мин', 'хв', 'сек', 'с', 'ч', 'лв', 'евро', 'євро', 'год', 'ст', 'ц', 'шт', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'нд', 'нед', 'пъти',
    // conjunctions, prepositions, particles and adverbs: one form after every number
    'и', 'і', 'й', 'та', 'а', 'но', 'але', 'или', 'або', 'ли', 'по', 'на', 'в', 'във', 'у', 'з', 'със', 'от', 'до', 'за', 'при', 'под', 'над', 'без', 'между', 'през', 'срещу', 'проти', 'від', 'із', 'про', 'через', 'перед', 'між', 'під', 'над',
    'не', 'да', 'като', 'ако', 'що', 'як', 'ще', 'още', 'вече', 'вже', 'само', 'лише', 'най', 'тогава', 'сега', 'зараз', 'тоді', 'спочатку', 'наприкінці', 'отначало', 'накрая', 'после', 'потім', 'отляво', 'отдясно', 'зліва', 'справа', 'ліворуч', 'праворуч', 'нататък', 'напред', 'назад', 'вперед',
    'повече', 'по-малко', 'малко', 'більше', 'менше', 'більший', 'менший', 'по-голям', 'по-малък', 'по-голямо', 'по-малко', 'поне', 'принаймні', 'щонайменше', 'найбільше', 'найменше',
    // a verb or pronoun that has one form for the sentence, not for the count (they stand after a number written as a list entry, a step or a result)
    'януари', 'февруари', 'март', 'април', 'май', 'юни', 'юли', 'август', 'септември', 'октомври', 'ноември', 'декември', 'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня',   // dates
    'більша', 'менша', 'більші', 'менші', 'більшу', 'меншу', 'дорівнює', 'дорівнюють', 'збільш', 'зменш', 'зменшуване', 'збільшили', 'зменшили', 'скорочуються', 'записується', 'записано', 'використано', 'несуть', 'включно', 'правильно', 'виберіть', 'завширшки', 'я', 'се',   // a sentence's own predicate or adjective
    'е', 'са', 'има', 'няма', 'є', 'має', 'мають', 'немає', 'можна', 'було', 'лишилося', 'залишилося', 'закінчується', 'це', 'то', 'тож', 'отже', 'значи', 'тоді', 'ще', 'один', 'одна', 'одне', 'един', 'една', 'едно',
  ]);
  // uk adjectives, participles and verbs in the plural: «2 / 5 світловолосі» are both right, only «1 світловолосі» is not
  const PLURAL_UK = new Set(['світловолосі', 'темноволосі', 'пораховані', 'різні', 'вивчають', 'мають', 'обоє', 'інші', 'ті', 'перші', 'надруковано', 'їх', 'кожен']);
  // prepositions after which a Ukrainian counted noun is not in the nominative/accusative form that agrees with the number
  const OBLIQUE = new Set(['від', 'до', 'з', 'із', 'зі', 'без', 'для', 'після', 'біля', 'між', 'над', 'під', 'при', 'про', 'о', 'навколо', 'замість', 'серед', 'крім', 'допомогою']);
  const cls = (n, l, w) => l === 'uk' && PLURAL_UK.has(w) ? (n % 10 === 1 && n % 100 !== 11 ? 'one' : 'many') : l === 'uk' ? (n % 10 === 1 && n % 100 !== 11 ? 'one' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 'few' : 'many') : (n === 1 ? 'one' : 'many');
  // the ending a digit ordinal has to start with
  const bgOrd = n => n % 100 >= 11 && n % 100 <= 19 ? 'т' : n % 10 === 1 ? 'в' : n % 10 === 2 ? 'р' : n % 10 === 7 || n % 10 === 8 ? 'м' : 'т';
  const strip = h => String(h).replace(/<\/?(?:b|span|i|strong|em|sup|sub)\b[^>]*>/g, '').replace(/<[^>]*>/g, '\n').replace(/&nbsp;/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/[ \t]+/g, ' ');
  // Levels older than the Кенгуру ones (before 310) that still do it, left for a decision: [level]: { 'lang:word' (or 'lang:ordinal'): a sample of what she reads }
  const ALLOW = {
    12: { 'uk:чисел': '9 чисел | 3 чисел' },
    13: { 'uk:різних': '5 різних | 4 різних', 'uk:цифр': '4 цифр | 5 цифр' },
    25: { 'bg:ordinal': '8-ият' },
    28: { 'bg:ябълки': '2 ябълки | 1 ябълки', 'uk:червоних': '4 червоних | 5 червоних' },
    31: { 'bg:метра': '18 метра | 1 метра' },
    34: { 'bg:реда': '4 реда | 1 реда', 'bg:стълба': '4 стълба | 1 стълба' },
    38: { 'bg:жълти': '7 жълти | 1 жълти', 'bg:зелени': '3 зелени | 1 зелени', 'bg:червени': '3 червени | 1 червени', 'bg:сини': '9 сини | 1 сини' },
    39: { 'uk:яблук': '11 яблук | 3 яблук', 'uk:монет': '5 монет | 3 монет', 'uk:цукерок': '19 цукерок | 4 цукерок', 'uk:наліпок': '12 наліпок | 2 наліпок' },
    43: { 'uk:монет': '3 монет | 5 монет' },
    48: { 'uk:німецьку': '14 німецьку | 22 німецьку | 21 німецьку', 'uk:французьку': '10 французьку | 22 французьку', 'uk:іспанську': '10 іспанську | 4 іспанську | 21 іспанську', 'uk:англійську': '8 англійську | 23 англійську | 21 англійську' },
    73: { 'uk:однакових': '2 однакових | 8 однакових' },
    82: { 'uk:цифр': '5 цифр | 22 цифр' },
    94: { 'bg:ordinal': '46-ма', 'uk:букв': '6 букв | 4 букв', 'uk:символів': '3 символів | 6 символів' },
    96: { 'uk:днів': '5 днів | 4 днів' },
    102: { 'uk:відрізків': '6 відрізків | 3 відрізків' },
    112: { 'uk:чисел': '5 чисел | 4 чисел' },
    114: { 'uk:малих': '9 малих | 4 малих', 'uk:великих': '3 великих | 8 великих' },
    128: { 'bg:обиколката': '1 обиколката | 3 обиколката', 'uk:периметр': '1 периметр | 3 периметр' },
    129: { 'uk:доданків': '8 доданків | 3 доданків' },
    133: { 'uk:однакових': '7 однакових | 4 однакових' },
    164: { 'uk:чисел': '2 чисел | 10 чисел' },
    201: { 'uk:чисел': '2 чисел | 5 чисел' },
    264: { 'uk:одногорбих': '2 одногорбих | 8 одногорбих', 'uk:двогорбих': '2 двогорбих | 5 двогорбих', 'uk:жуків': '3 жуків | 7 жуків', 'uk:павуків': '9 павуків | 3 павуків' },
  };
  const hits = [];   // [level, lang, kind, word, one sample]
  const isNew = id => id >= 310 && id <= 349 && id !== 317;
  try {
    for(const L of Q.LEVELS){
      const seen = { bg: {}, uk: {} }, ords = new Set();
      for(let seed = 1; seed <= SEEDS; seed++){
        const q = seeded(seed, () => Q.withChoices(Q.raw(L.id)));
        for(const l of ['bg', 'uk']){
          Q.lang(l);
          const text = strip([Q.drawQ(q), Q.eqText(q), Q.why(q, true), Q.why(q, false), q.options ? Q.choiceHtml(q) : ''].join('\n'));
          for(const m of text.matchAll(/(?<![\d,.−+×÷=\-])(?:([а-яіїєґ]+) )?(\d+) ([а-яіїєґ]+)(?![а-яіїєґ'’-])/g)){
            const w = m[3].toLowerCase();
            if(INVARIANT.has(w)) continue;
            // Ukrainian after a preposition that takes another case (від 2 років, з 3 малими) and in an oblique plural (-ами, -ах) keeps one form
            if(l === 'uk' && (OBLIQUE.has((m[1] || '').toLowerCase()) || /(?:ами|ями|ах|ях|ам|ям)$/.test(w))) continue;
            const c = cls(+m[2], l, w);
            ((seen[l][w] = seen[l][w] || {})[c] = seen[l][w][c] || m[2] + ' ' + m[3]);
          }
          for(const m of text.matchAll(/(?<![\d,.])(\d+)-([а-яіїєґ]{1,5})(?![а-яіїєґ])/g)){
            const n = +m[1], suf = m[2], key = l + ':' + m[0];
            if(ords.has(key)) continue;
            const bad = l === 'bg' ? !(suf[0] === bgOrd(n) || (bgOrd(n) === 'т' && suf.startsWith('ия'))) : (n % 10 === 3 && n % 100 !== 13 ? suf === 'а' : /^[яє]/.test(suf));
            if(bad){ ords.add(key); hits.push([L.id, l, 'ordinal', m[0], m[0]]); }
          }
        }
      }
      for(const l of ['bg', 'uk']) for(const [w, byClass] of Object.entries(seen[l]))
        if(Object.keys(byClass).length > 1) hits.push([L.id, l, 'plural', w, Object.values(byClass).join(' | ')]);
    }
  } finally { Q.lang('bg'); }
  const key = h => h[1] + ':' + (h[2] === 'ordinal' ? 'ordinal' : h[3]);
  const allowed = h => ALLOW[h[0]] && ALLOW[h[0]][key(h)] !== undefined;
  if(process.env.GRAMMAR_DUMP) for(const h of hits) console.log((isNew(h[0]) ? 'NEW ' : 'old ') + (allowed(h) ? 'allowed ' : '') + h.join('  '));
  const bad = hits.filter(h => !allowed(h));
  const staleAllow = Object.entries(ALLOW).flatMap(([id, o]) => Object.keys(o).filter(k => !hits.some(h => h[0] === +id && key(h) === k)).map(k => id + ' ' + k));
  if(bad.length) throw new Error('number agreement: ' + bad.length + ' hits, e.g. ' + bad.slice(0, 6).map(h => 'level ' + h[0] + ' ' + h[1] + ' ' + h[2] + ' «' + h[3] + '» (' + h[4] + ')').join('; ') +
    '. A word after a count has to agree with it (ukN / ukPl / trN in js/core.js); an ordinal ending has to fit its number. GRAMMAR_DUMP=1 lists every hit.');
  if(staleAllow.length) throw new Error('check/grammar.js allows hits that no longer happen: ' + staleAllow.join(', '));
  console.log('number agreement: ' + Q.LEVELS.length + ' levels × ' + SEEDS + ' seeds, both languages — no counted word keeps one form after numbers of two classes, every digit ordinal ends as its number needs (' + Object.values(ALLOW).reduce((t, o) => t + Object.keys(o).length, 0) + ' old-level cases allowed)');
}
