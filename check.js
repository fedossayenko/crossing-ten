// Self-check for the question generators. Run: node check.js
const fs = require('fs');
const src = fs.readFileSync(__dirname + '/index.html', 'utf8');
const read = f => fs.readFileSync(__dirname + '/' + f, 'utf8');
// The scripts, in the order the page loads them; app.js and sync.js are the page itself and need a DOM.
const scripts = [...src.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
const js = scripts.map(read).join('\n');
const head = `
const RAND = Math.random; let RANDS = 0; Math.random = () => (RANDS++, RAND());   // counts every random draw
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

// The rest run beside the app, in this file's scope (they use read, head, body, scripts and js);
// sourceURL names the file in an error.
for(const f of ['check/app.js', 'check/grade3.js', 'check/papers.js', 'check/grade1.js', 'check/grade1b.js', 'check/grade1b-C.js', 'check/grade1b-B.js', 'check/grade1b-A.js']) eval(read(f) + '\n//# sourceURL=' + f);
