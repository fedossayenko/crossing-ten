// Plays every level in headless Chrome through the real picker and keypad, and fails on
// any script error. Run: node smoke.js [page]   (needs Google Chrome; serves this folder itself)
const http = require('http'), fs = require('fs'), path = require('path'), { spawn } = require('child_process');
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.png':'image/png' };

const server = http.createServer((req, res) => {
  const f = path.join(__dirname, decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html'));
  if(!f.startsWith(__dirname) || !fs.existsSync(f)){ res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
}).listen(0, '127.0.0.1', async () => {
  const url = 'http://127.0.0.1:' + server.address().port + '/' + (process.argv[2] || '');
  const dir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'ct-smoke-'));
  const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--no-first-run', '--remote-debugging-port=0',
    '--user-data-dir=' + dir, '--window-size=390,844', 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
  const done = code => { chrome.on('exit', () => { fs.rmSync(dir, { recursive: true, force: true }); process.exit(code); }); chrome.kill(); server.close(); };
  setTimeout(() => { console.error('smoke: timed out'); done(1); }, 120000);
  let buf = '';
  const wsUrl = await new Promise(ok => chrome.stderr.on('data', d => {
    buf += d; const m = buf.match(/ws:\/\/[^\s]+/); if(m) ok(m[0]);
  }));
  const targets = await (await fetch(wsUrl.replace('ws://', 'http://').replace(/\/devtools.*/, '/json/list'))).json();
  const ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(ok => ws.onopen = ok);
  let id = 0; const wait = {}, errors = [];
  ws.onmessage = e => {
    const m = JSON.parse(e.data);
    if(m.id && wait[m.id]){ wait[m.id](m); delete wait[m.id]; }
    if(m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
    if(m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push(m.params.args.map(a => a.value ?? a.description).join(' '));
  };
  const cmd = (method, params = {}) => new Promise(ok => { wait[++id] = ok; ws.send(JSON.stringify({ id, method, params })); });
  await cmd('Runtime.enable'); await cmd('Page.enable');
  await cmd('Page.navigate', { url });
  await new Promise(r => setTimeout(r, 1500));
  // Load it a second time so the page runs through its service worker, as a returning device does.
  await cmd('Page.reload'); await new Promise(r => setTimeout(r, 1500));

  // Inside the page: for every level, pick it, miss the first question twice (hint, then
  // the reveal), answer the rest correctly, and land on the end-of-round sheet.
  const drive = `(async () => {
    const tick = () => new Promise(r => setTimeout(r, 0));
    const key = k => document.querySelector('.key[data-k="' + k + '"]').click();
    const type = v => String(v).split('').forEach(key);
    const out = [];
    if(!window.claude && !navigator.serviceWorker.controller && !location.pathname.endsWith('artifact.html')) out.push('the service worker is not serving the page');
    for(const l of LEVELS){
      $('levelPill').click();
      document.querySelector('.pick[data-lvl="' + l.id + '"]').click();
      for(let i = 0; i < S.qs.length; i++){
        const q = S.qs[S.i], want = answers(q).slice(0, q.slots || 1);
        if(i === 0){
          for(let t = 0; t < 2; t++){ want.forEach(v => { type(v + 100 > 999 ? 1 : v + 100); key('go'); }); await tick(); }
        } else {
          want.forEach(v => { type(v); key('go'); });
          if(!S.settled) out.push('level ' + l.id + ': right answer ' + want + ' not accepted');
        }
        await tick();
        if(!$('stage').innerHTML) out.push('level ' + l.id + ': empty question');
        key('go');
      }
      if($('sheet').hidden) out.push('level ' + l.id + ': round did not finish');
    }
    $('statsBtn').click(); await tick();
    if($('stats').hidden) out.push('progress did not open');
    return JSON.stringify({ out, rounds: LOCAL.rounds.length });
  })()`;
  const r = await cmd('Runtime.evaluate', { expression: drive, awaitPromise: true, returnByValue: true });
  if(r.result.exceptionDetails) errors.push(r.result.exceptionDetails.exception?.description);
  const res = r.result.result && r.result.result.value ? JSON.parse(r.result.result.value) : { out: ['driver returned nothing'] };
  const bad = errors.concat(res.out);
  if(bad.length){ console.error('smoke: FAILED\n  ' + bad.join('\n  ')); return done(1); }
  console.log('smoke: played every level in Chrome, ' + res.rounds + ' rounds logged, no script errors');
  done(0);
});
