// Runs beside the app (in check.js's own scope, through eval).
// Number agreement in what a child reads. Every level is drawn from SEEDS seeds, in both languages, and everything it
// shows (task, summary line, hint, worked solution, options) is read for two things a hand-written plural gets wrong:
//  (a) a word that follows a number of one agreement class and, unchanged, a number of another class on the same level:
//      Ukrainian «3 стрибків» next to «5 стрибків» (classes: ends in 1 but not 11 / ends in 2–4 but not 12–14 / the rest),
//      Bulgarian «1 момичета» next to «5 момичета» (classes: 1 / any other number). The word has to change with the number
//      (ukN, ukPl, trN in js/core.js), or the sentence has to be built so no count stands before it.
//  (b) a digit ordinal whose ending does not fit its number: Bulgarian «6-и» (6-ти), «2-а» (2-ра), «1-та» (1-ва), «7-а» (7-ма);
//      Ukrainian «3-а» (3-я), «13-я» (13-а). Bulgarian «10-ият» (the article instead of -ти) is right, «8-ият» is not (8-мият).
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
  const OBLIQUE = new Set(['від', 'до', 'з', 'із', 'зі', 'без', 'для', 'після', 'біля', 'між', 'над', 'під', 'при', 'про', 'о', 'навколо', 'замість', 'серед', 'крім', 'допомогою',
    'у', 'вистачає', 'вистачило', 'бракує', 'бракувало']);   // «у 3 жуків», «не вистачає 5 монет»: the genitive plural, one form after every number
  const AND = new Set(['і', 'й', 'та', 'або']);
  // the word that governs a Ukrainian counted noun: the one before the number; «у 3 жуків і 9 павуків» — the one before the first
  // number when «і» joins them; a plural genitive adjective before the number («наступних 5 днів») puts the noun in the genitive too
  const governor = (text, at) => {
    const before = text.slice(0, at), p = /([а-яіїєґ]+) $/i.exec(before);
    if(!p) return '';
    const w = p[1].toLowerCase();
    if(AND.has(w)){ const q = /([а-яіїєґ]+) \d+ [а-яіїєґ]+ [а-яіїєґ]+ $/i.exec(before) || /([а-яіїєґ]+) \d+ [а-яіїєґ]+ $/i.exec(before); return q && OBLIQUE.has(q[1].toLowerCase()) ? q[1].toLowerCase() : w; }
    return /(?:их|іх)$/.test(w) ? 'з' : w;
  };
  const cls = (n, l, w) => l === 'uk' && PLURAL_UK.has(w) ? (n % 10 === 1 && n % 100 !== 11 ? 'one' : 'many') : l === 'uk' ? (n % 10 === 1 && n % 100 !== 11 ? 'one' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 'few' : 'many') : (n === 1 ? 'one' : 'many');
  // the ending a digit ordinal has to start with
  const bgOrd = n => n % 100 >= 11 && n % 100 <= 19 ? 'т' : n % 10 === 1 ? 'в' : n % 10 === 2 ? 'р' : n % 10 === 7 || n % 10 === 8 ? 'м' : 'т';
  const strip = h => String(h).replace(/<\/?(?:b|span|i|strong|em|sup|sub)\b[^>]*>/g, '').replace(/<[^>]*>/g, '\n').replace(/&nbsp;/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/[ \t]+/g, ' ');
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
            if(l === 'uk' && (OBLIQUE.has(governor(text, m.index + (m[1] ? m[1].length + 1 : 0))) || /(?:ами|ями|ах|ях|ам|ям)$/.test(w))) continue;
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
  if(process.env.GRAMMAR_DUMP) for(const h of hits) console.log((isNew(h[0]) ? 'NEW ' : 'old ') + h.join('  '));
  if(hits.length) throw new Error('number agreement: ' + hits.length + ' hits, e.g. ' + hits.slice(0, 6).map(h => 'level ' + h[0] + ' ' + h[1] + ' ' + h[2] + ' «' + h[3] + '» (' + h[4] + ')').join('; ') +
    '. A word after a count has to agree with it (ukN / ukPl / trN in js/core.js); an ordinal ending has to fit its number. GRAMMAR_DUMP=1 lists every hit.');
  console.log('number agreement: ' + Q.LEVELS.length + ' levels × ' + SEEDS + ' seeds, both languages — no counted word keeps one form after numbers of two classes, every digit ordinal ends as its number needs');
}
