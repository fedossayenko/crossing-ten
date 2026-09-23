// Folds the page back into one self-contained file for the Claude artifact copy, which
// cannot load app.css or the scripts beside it. Run: node build-artifact.js [out.html]
const fs = require('fs');
const read = f => fs.readFileSync(__dirname + '/' + f, 'utf8');
let h = read('index.html');
// The artifact frame supplies its own head: no home-screen tags, icons or manifest.
h = '<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover">' +
    h.slice(h.indexOf('<title>'));
h = h.replace('<link rel="stylesheet" href="app.css">', () => '<style>\n' + read('app.css') + '</style>');
// One inline <script> per file keeps each one its own script, exactly as the page loads them.
h = h.replace(/<script src="([^"]+)"><\/script>/g, (_, f) => '<script>\n' + read(f).replace(/<\/script/gi, '<\\/script') + '</script>');
if(/<(script|link)[^>]+(src|href)="(?!https:)/.test(h)) throw new Error('a local file is still linked, not inlined');
const out = process.argv[2] || __dirname + '/artifact.html';
fs.writeFileSync(out, h);
console.log('artifact: ' + out + ', ' + Math.round(h.length / 1024) + ' KB');
