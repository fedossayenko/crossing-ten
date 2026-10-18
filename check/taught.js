// Runs beside the app (in check.js's own scope, through eval).
// What she has been taught by then. The 2nd grade learns the times table last (МОН 2023: numbers to 100,
// ± without crossing ten, ± with crossing, then × and ÷), and no МБГ paper before spring needs it — they say
// «равни събираеми», «два пъти». So a 2nd-grade level with no needs path to the times table (141) shows no ×,
// no ÷, no «a : b», no «дели се» and no «разделени на 9» in its task, its summary line, its hint or its worked solution, in either
// language: it adds, counts in steps (3, 6, 9, …) or halves (17 + 17 = 34); a grid is «4 на 2», not «4×2».
// A form that needs the times table is a layer after 141.
// For now the levels an autumn paper asks; the winter, Коледно and Аз и числата ones come next.
{
  const byId = Object.fromEntries(APP.LEVELS.map(l => [l.id, l]));
  const times = l => l.op === 'x' || (l.needs || []).some(n => times(byId[n]));
  const MUL = /×|÷|\d\s*·\s*\d|\d\s+:\s+\d|дели се|делят се|ділиться|діляться|разделени на \d|поділені на \d/;
  const strip = h => String(h).replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');   // a tag gone, not a space: «<b>7</b>: 20» is no division
  const pre = APP.LEVELS.filter(l => l.grade === 2 && l.src !== 'basics' && !times(l) && l.papers.some(p => /^mbg-autumn/.test(p)));
  for(const L of pre){
    for(let s = 1; s <= 200; s++){
      const q = APP.seeded(s, () => APP.raw(L.id));
      for(const lang of ['bg', 'uk']){
        APP.setLang(lang);
        const parts = { task: APP.drawQ(q), summary: APP.eqText(q), hint: APP.why(q, false), solution: APP.why(q, true) };
        APP.setLang('bg');
        for(const k in parts){
          const m = strip(parts[k]).match(MUL);
          if(m) throw new Error('level ' + L.id + ' comes before the times table, but its ' + k + ' (' + lang + ', seed ' + s + ') shows «' + m[0] + '»: ' +
            strip(parts[k]).slice(Math.max(0, m.index - 60), m.index + 30).trim());
        }
      }
    }
  }
  console.log('taught: ' + pre.length + ' autumn 2nd-grade levels before the times table show no ×, ÷, «a : b» or «дели се», in task, summary, hint or solution');
}
