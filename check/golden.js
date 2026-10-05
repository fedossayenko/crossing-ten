// Runs beside the app (in check.js's own scope, through eval).
// Golden output: what a child sees on every level, recorded. For each level and 30 seeds the question is
// drawn, offered as А/Б/В/Г, and everything shown about it — the task, the summary line, the hint and the
// worked solution, in Bulgarian and in Ukrainian, the accepted answers and the options — is hashed into
// check/golden.json. A restructure that changes any of it fails here; a change meant to show something
// new is recorded on purpose with `node check.js --golden`, and the diff of golden.json shows which
// levels it touched.
{
  const Q = eval('(function(){' + head + body + '; return { raw, drawQ, eqText, why, answers, withChoices, choiceHtml, LEVELS, lang: l => { LANG = l; } }; })()');
  const crypto = require('crypto'), file = __dirname + '/check/golden.json', SEEDS_PER_LEVEL = 30;
  const shown = q => ['bg', 'uk'].map(l => { Q.lang(l); return [Q.drawQ(q), Q.eqText(q), Q.why(q, true), Q.why(q, false), q.options ? Q.choiceHtml(q) : ''].join('\u0001'); }).join('\u0002') + '\u0002' + Q.answers(q).join();
  const now = {};
  try {
    for(const L of Q.LEVELS){
      now[L.id] = [];
      for(let seed = 1; seed <= SEEDS_PER_LEVEL; seed++){
        const text = seeded(seed, () => shown(Q.withChoices(Q.raw(L.id))));
        now[L.id].push(crypto.createHash('sha1').update(text).digest('hex').slice(0, 10));
      }
    }
  } finally { Q.lang('bg'); }
  if(process.argv.includes('--golden')){
    fs.writeFileSync(file, '{\n' + Object.keys(now).map(id => ' "' + id + '": ' + JSON.stringify(now[id])).join(',\n') + '\n}\n');
    console.log('golden output: recorded for ' + Object.keys(now).length + ' levels × ' + SEEDS_PER_LEVEL + ' seeds');
  } else {
    const was = JSON.parse(read('check/golden.json'));
    const changed = Object.keys(now).filter(id => JSON.stringify(now[id]) !== JSON.stringify(was[id]));
    const gone = Object.keys(was).filter(id => !(id in now));
    if(changed.length || gone.length){
      const id = changed[0], seed = id && now[id].findIndex((h, i) => !was[id] || h !== was[id][i]) + 1;
      throw new Error('golden output changed for levels ' + changed.concat(gone).join(', ') +
        (id ? ' — level ' + id + ', seed ' + seed + ' now shows: ' + seeded(seed, () => { const q = Q.withChoices(Q.raw(+id)); Q.lang('bg'); return Q.eqText(q) + ' | ' + Q.drawQ(q).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').slice(0, 300); }) : '') +
        '. If that is meant, record it: node check.js --golden');
    }
    console.log('golden output: every level shows exactly what was recorded (' + Object.keys(now).length + ' levels × ' + SEEDS_PER_LEVEL + ' seeds, both languages, hints, solutions, options)');
  }
}
