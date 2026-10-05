// Self-check for the question generators. Run: node check.js
const fs = require('fs');
const src = fs.readFileSync(__dirname + '/index.html', 'utf8');
const read = f => fs.readFileSync(__dirname + '/' + f, 'utf8');
// The scripts, in the order the page loads them; app.js and sync.js are the page itself and need a DOM.
const scripts = [...src.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
const js = scripts.map(read).join('\n');
const head = `
const RAND = globalThis.REAL_RANDOM || (globalThis.REAL_RANDOM = Math.random); let RANDS = 0; Math.random = () => (RANDS++, RAND());   // counts every random draw (wrapping the real one, not the last copy's wrapper)
const localStorage = undefined;   // no browser storage here: players.js falls back to one player
let W = {max:1, m:{}};
const LOCAL = {mix:[1,2,4,5], plain:true};
function factKey(q){ return q.kind ? 'w:'+q.kind : q.op+':'+(q.a%10)+'-'+(q.b%10); }
`;
const body = scripts.filter(f => !['js/app.js', 'js/compete.js', 'js/sync.js'].includes(f)).map(read).join('\n');

// check/levels.js and check/kinds.js run inside the app's own scope: after the app's scripts, as classic
// scripts sharing one global scope the way the page loads them, each under its own file name so an
// error points at the real file and line.
const vm = require('vm');
vm.runInThisContext(head, { filename:'check/head.js' });
scripts.filter(f => !['js/app.js', 'js/compete.js', 'js/sync.js'].includes(f)).forEach(f => vm.runInThisContext(read(f), { filename:f }));
['check/levels.js', 'check/kinds.js'].forEach(f => vm.runInThisContext(read(f), { filename:f }));

// A printed task is replayed from a seed instead of searched for among hundreds of thousands of draws:
// seeded(seed, fn) (js/core.js) runs fn with Math.random drawn from that seed, so a level's generator
// asks the same question every time. check/seeds.json holds one seed per pin; when a generator changes
// and a seed no longer gives its task, the pin searches as before and fails naming the new seed —
// `node check.js --repin` records the new seeds instead of failing.
const REPIN = process.argv.includes('--repin'), SEEDS = JSON.parse(read('check/seeds.json')), USED = {};
let CHECK_FILE = '';   // the check file running: seeds are keyed by file and pin, as two papers may both have a task 3
// match(question): 2 = the printed question, 1 = the same question with other numbers (where a pin
// allows that), 0 = not it. Returns { q, exact } for the best match within `tries` seeds, or null.
function pinSeed(name, draw, match, tries = 300000){
  const key = CHECK_FILE + ': ' + name;
  if(USED[key] !== undefined) throw new Error('two pins named ' + key);
  const at = SEEDS[key];
  if(at !== undefined){ const q = seeded(at, draw), m = match(q); if(m){ USED[key] = at; return { q, exact: m === 2 }; } }
  let best = null;
  for(let seed = 1; seed <= tries; seed++){
    const q = seeded(seed, draw), m = match(q);
    if(m === 2){ best = { seed, q, exact: true }; break; }
    if(m === 1 && !best) best = { seed, q, exact: false };
  }
  if(!best) return null;
  if(!REPIN) throw new Error(key + ': ' + (at === undefined ? 'no seed recorded' : 'seed ' + at + ' no longer asks it') + ' — it is at seed ' + best.seed + '; run node check.js --repin');
  USED[key] = best.seed;
  return { q: best.q, exact: best.exact };
}

// The rest run beside the app, in this file's scope (they use read, head, body, scripts and js);
// sourceURL names the file in an error.
// Every check file runs: levels.js and kinds.js above, the rest here in name order, golden output last.
const inScope = ['check/levels.js', 'check/kinds.js'];
const beside = fs.readdirSync(__dirname + '/check').filter(f => f.endsWith('.js')).map(f => 'check/' + f)
  .filter(f => !inScope.includes(f) && f !== 'check/golden.js').sort().concat('check/golden.js');
// every kind file is loaded by the page, and the page loads no kind that is not there
{
  const files = fs.readdirSync(__dirname + '/kinds').filter(f => f.endsWith('.js')).map(f => 'kinds/' + f), listed = scripts.filter(f => f.startsWith('kinds/'));
  const missing = files.filter(f => !listed.includes(f)), extra = listed.filter(f => !files.includes(f));
  if(missing.length || extra.length) throw new Error('index.html and kinds/ disagree: not loaded ' + missing.join(', ') + '; loaded but missing ' + extra.join(', '));
}
for(const f of beside){ CHECK_FILE = f.slice(6, -3); eval(read(f) + '\n//# sourceURL=' + f); }

// every recorded seed belongs to a pin that ran; --repin rewrites the file with exactly those
const unused = Object.keys(SEEDS).filter(k => USED[k] === undefined);
if(REPIN){ fs.writeFileSync(__dirname + '/check/seeds.json', JSON.stringify(Object.fromEntries(Object.keys(USED).sort().map(k => [k, USED[k]])), null, 1) + '\n'); console.log('check/seeds.json: ' + Object.keys(USED).length + ' seeds recorded'); }
else if(unused.length) throw new Error('check/seeds.json has seeds no pin uses: ' + unused.join(', ') + ' — run node check.js --repin');
