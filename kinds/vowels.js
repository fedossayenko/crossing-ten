// Question kind 'vowels': level 483 Гласни и съгласни — By how many the consonants of a name outnumber its vowels.

// Салабашев 2021, 2 клас, задача 9: by how many the consonants are more than the vowels in the name ИВАН САЛАБАШЕВ. Vowels И, А, А, А, А,
// Е — 6; consonants В, Н, С, Л, Б, Ш, В — 7: 7 − 6 = 1. The name stays as the Bulgarian paper writes it in the Ukrainian text, and the same
// letters are counted. Only names without Ъ, Ь, Й, Ю and Я, which the two languages sort differently (Й is no vowel, Ю and Я are two
// sounds), so a letter is a vowel (А, Е, И, О, У) or a consonant in both.
import { KIND, answerLine, popAt, svgFrame, svgText, rnd, tr } from '../js/core.js';
const FIRST = ['ИВАН', 'НИКОЛА', 'ТОДОР', 'СТЕФАН', 'ГЕОРГИ', 'БОРИС', 'ЕЛЕНА', 'ЕМИЛ', 'ДАНИЕЛ', 'ЛИЛИ', 'ТОНИ', 'ЦВЕТАН', 'РАДОСТ', 'КРАСИМИР', 'ВЕНЕТА', 'ОЛЕГ'];
const LAST = ['САЛАБАШЕВ', 'ПЕТРОВ', 'ГЕОРГИЕВ', 'СТАНЕВ', 'ДИМИТРОВ', 'КОЛЕВ', 'МАРИНОВ', 'ТОДОРОВ', 'ВЕЛЕВ', 'ИВАНОВ', 'СТЕФАНОВ', 'ЦВЕТКОВ', 'ЖЕЛЕВ', 'ХРИСТОВ', 'ЕЛЕНИН', 'УЗУНОВ'];
const isVowel = ch => 'АЕИОУ'.includes(ch);
const letters = name => [...name].filter(ch => ch !== ' ');
export function genVowels(){
  for(;;){
    const name = FIRST[rnd(FIRST.length)] + ' ' + LAST[rnd(LAST.length)], ls = letters(name), v = ls.filter(isVowel).length, c = ls.length - v;
    if(v === c) continue;
    const more = c > v;   // the paper asks for the consonants; a name with more vowels is asked the other way round
    if(!more && Math.random() < 0.5) continue;
    return {kind:'vowels', name, more, traps:[ls.length, Math.min(v, c)].filter(t => t !== Math.abs(c - v)), ans: Math.abs(c - v)};
  }
}
const split = q => { const ls = letters(q.name); return { vow: ls.filter(isVowel), con: ls.filter(ch => !isVowel(ch)) }; };
function drawVowels(q){
  return '<div class="ask">' + tr('С колко ' + (q.more ? 'съгласните са повече от гласните' : 'гласните са повече от съгласните') + ' в името:',
    'На скільки ' + (q.more ? 'приголосних більше, ніж голосних,' : 'голосних більше, ніж приголосних,') + ' в імені:') + '</div>' +
    '<div class="given"><b>' + q.name + '</b></div>' + answerLine('xl');
}
function eqVowels(q){ const { vow, con } = split(q); return tr('гласни ', 'голосних ') + vow.length + tr(', съгласни ', ', приголосних ') + con.length + ' → ' + q.ans; }
// the letters of the name in boxes: the vowels filled, the consonants plain
function lettersSvg(q){
  const names = q.name.split(' '), W = 22, rows = names.map(n => [...n]), wide = Math.max(...rows.map(r => r.length)) * W + 8;
  let g = '';
  rows.forEach((r, ri) => r.forEach((ch, i) => {
    const x = 4 + i * W, y = 4 + ri * 30, v = isVowel(ch);
    g += '<g' + popAt(i * 0.3 + ri * 2) + '><rect x="' + x + '" y="' + y + '" width="' + (W - 3) + '" height="25" rx="5" fill="' + (v ? 'var(--accent)' : 'var(--solid)') + '" stroke="var(--ink)" stroke-width="1.3"/>' +
      svgText(x + (W - 3) / 2, y + 18, ch, 14, v ? '#fff' : 'var(--ink)') + '</g>';
  }));
  const { vow, con } = split(q);
  g += svgText(wide / 2, rows.length * 30 + 18, (q.more ? con.length + ' − ' + vow.length : vow.length + ' − ' + con.length) + ' = ' + q.ans, 14, 'var(--ink)', popAt(6));
  return svgFrame('0 0 ' + wide + ' ' + (rows.length * 30 + 26), Math.round(wide * 1.3), tr('буквите на името', 'літери імені')) + g + '</svg>';
}
function whyVowels(q, full){
  if(!full) return tr('Гласните са А, Е, И, О и У. Всички други букви са съгласни. Преброй всеки вид поотделно, буква по буква.', 'Голосні — А, Е, И, О і У. Усі інші літери — приголосні. Порахуй кожен вид окремо, літера за літерою.');
  const { vow, con } = split(q), big = q.more ? con.length : vow.length, small = q.more ? vow.length : con.length;
  return tr('гласни: ' + vow.join(', ') + ' — ' + vow.length + '; съгласни: ' + con.join(', ') + ' — ' + con.length, 'голосні: ' + vow.join(', ') + ' — ' + vow.length + '; приголосні: ' + con.join(', ') + ' — ' + con.length) +
    ' &nbsp;→&nbsp; <b>' + big + ' − ' + small + ' = ' + q.ans + '</b>' + lettersSvg(q);
}
KIND.vowels = { draw:drawVowels, eq:eqVowels, why:whyVowels };
