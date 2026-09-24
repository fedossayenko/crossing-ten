// What a level asks: prints distinct questions and their answers, to compare a printed task with
// the levels that might already cover it. Run: node sample.js 12,38 [how many, default 6]
const fs = require('fs');
const read = f => fs.readFileSync(__dirname + '/' + f, 'utf8');
const scripts = [...read('index.html').matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1])
  .filter(f => !['js/app.js', 'js/compete.js', 'js/sync.js'].includes(f));
const head = `const localStorage = undefined; let W = {max:1, m:{}}; const LOCAL = {mix:[1,2,4,5], plain:true};
function factKey(q){ return q.kind ? 'w:'+q.kind : q.op+':'+(q.a%10)+'-'+(q.b%10); }`;
const Q = eval('(function(){' + head + scripts.map(read).join('\n') + '; return { raw, drawQ, answer, LEVELS }; })()');
const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
if(!process.argv[2]){ console.log('usage: node sample.js <level ids, comma-separated> [how many]'); process.exit(1); }
const n = +(process.argv[3] || 6);
for(const id of process.argv[2].split(',').map(Number)){
  const l = Q.LEVELS.find(x => x.id === id);
  if(!l){ console.log('== ' + id + ': no such level'); continue; }
  console.log('== ' + id + ' · ' + l.desc + ' · d' + l.d + ' · ' + (l.papers || [l.src + '-' + l.grade]).join(', '));
  const seen = new Set();
  for(let i = 0; i < 400 && seen.size < n; i++){   // ponytail: 400 tries caps a level with few distinct questions
    const q = Q.raw(id), s = strip(Q.drawQ(q)) + '  => ' + Q.answer(q);
    if(!seen.has(s)){ seen.add(s); console.log('  ' + s); }
  }
}
