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
  const settle = () => new Promise(r => setTimeout(r, 1500));
  const run = async expr => {
    const r = await cmd('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
    if(r.result.exceptionDetails) errors.push(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text);
    const v = r.result.result && r.result.result.value;
    return typeof v === 'string' ? v : undefined;
  };
  // Load it a second time so the page runs through its service worker, as a returning device does.
  await cmd('Page.reload'); await settle();

  // Inside the page: for every level, pick it, miss the first question twice (hint, then
  // the reveal), answer the rest correctly, and land on the end-of-round sheet.
  const play = `(async () => {
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
  const res = JSON.parse(await run(play) || '{"out":["driver returned nothing"]}');
  const bad = res.out.slice();
  const expect = (cond, what) => { if(!cond) bad.push(what); };
  const t_bg_wrote = 'ти написа 35 · забравен заем от десетиците';
  const page = async expr => JSON.parse(await run('JSON.stringify(' + expr + ')') || '{}');

  // A first launch is one Bulgarian player with the cat, and asks nothing.
  const first = await page('{ lang: document.documentElement.lang, again: $("again").textContent, players: $("players").hidden, n: PLAYERS.list.length, welcome: !$("playerEdit").hidden && $("editTitle").textContent, rounds: LOCAL.rounds.length }');
  expect(first.lang === 'bg' && first.again === 'Нов рунд' && first.players && first.n === 1 && first.welcome === 'Добре дошли!', 'first launch is not one Bulgarian player: ' + JSON.stringify(first));
  // the welcome speaks the language she picks at once, and once saved it does not come back
  if(!process.argv[2]){
    const uk = await page(`(() => { document.querySelector('#pLang input[value="uk"]').click(); const r = { title: $('editTitle').textContent, save: $('pSave').textContent };
      document.querySelector('#pLang input[value="bg"]').click(); $('pName').value = 'Ани'; return r; })()`);
    expect(uk.title === 'Ласкаво просимо!' && uk.save === 'Почати', 'the welcome did not switch language: ' + JSON.stringify(uk));
    await run(`$('pSave').click(); 1`); await settle();
    const after = await page('{ welcome: !$("playerEdit").hidden, name: PLAYER.name, lang: document.documentElement.lang }');
    expect(!after.welcome && after.name === 'Ани' && after.lang === 'bg', 'the welcome did not save the player: ' + JSON.stringify(after));
  }

  // A named mistake: 35 for 42 − 17 is a borrowed ten never taken off. The hint names it and
  // draws the ten-frame; the end-of-round sheet says what she wrote and what it was.
  const slip = await page(`(() => {
    $('sheet').hidden = true; $('stats').hidden = true;
    newRound([{ a:42, b:17, op:'-' }]);
    const key = k => document.querySelector('.key[data-k="' + k + '"]').click();
    key('3'); key('5'); key('go');
    const hint = { slip: /махна ли я от десетиците/.test($('hint').textContent) && !!$('hint').querySelector('.fb.no'), frame: !!$('hint').querySelector('.fb.tip .tenframe') };
    key('3'); key('5'); key('go'); key('go');
    return Object.assign(hint, { wrote: ($('misslist').querySelector('.wrote') || {}).textContent || '',
      logged: LOCAL.rounds[LOCAL.rounds.length - 1].slips });
  })()`);
  expect(slip.slip && slip.frame && slip.wrote === t_bg_wrote && JSON.stringify(slip.logged) === '["forgotBorrow"]',
    'the forgotten borrow was not named: ' + JSON.stringify(slip));
  // ...and the grown-ups see it: the slip counted, the groups charted, every round in the CSV
  const grown = await page(`(() => { $('statsBtn').click(); $('toParent').click();
    const csv = csvOf(LOCAL.rounds).split('\\r\\n');
    return { slips: $('slips').textContent, groups: $('byGroup').children.length, rows: csv.length, n: LOCAL.rounds.length,
             head: csv[0], last: csv[csv.length - 1] }; })()`);
  expect(/забравен заем/.test(grown.slips) && grown.groups > 0 && grown.rows === grown.n + 1 && /^"дата"/.test(grown.head) &&
    /забравен заем/.test(grown.last), 'the grown-ups view is wrong: ' + JSON.stringify(grown));

  // Two players: the launch asks who is playing; picking the other one reloads into her
  // language, mascot and (empty) log, and every level still plays.
  if(!process.argv[2]){
    await run(`localStorage.setItem('crossingten.players', JSON.stringify({ cur:'p1', list:[
      { id:'p1', name:'Ани', mascot:'fox', lang:'en' }, { id:'p2', name:'Иво', mascot:'owl', lang:'uk' }] }));
      sessionStorage.clear(); location.reload(); 1`);
    await settle();
    const ask = await page('{ lang: document.documentElement.lang, open: !$("players").hidden, tiles: document.querySelectorAll(".pchoose").length, fox: !!$("cat").querySelector("ellipse[rx=\'68\']") }');
    expect(ask.lang === 'en' && ask.open && ask.tiles === 2 && ask.fox, 'two players did not ask who is playing: ' + JSON.stringify(ask));
    await run(`document.querySelector('.pchoose[data-id="p2"]').click(); 1`);
    await settle();
    const p2 = await page('{ id: PLAYER.id, lang: document.documentElement.lang, again: $("again").textContent, rounds: LOCAL.rounds.length, open: !$("players").hidden }');
    expect(p2.id === 'p2' && p2.lang === 'uk' && p2.again === 'Новий раунд' && p2.rounds === 0 && !p2.open, 'switching player went wrong: ' + JSON.stringify(p2));
    const res2 = JSON.parse(await run(play) || '{"out":["driver returned nothing"]}');
    bad.push(...res2.out.map(x => 'second player, in Ukrainian: ' + x));
    // Adding a player through the form: name, mascot, language, save.
    await run(`$('who').click(); $('pAdd').click(); $('pName').value = 'Мая';
      document.querySelector('.mchoice[data-m="bun"]').click(); document.querySelector('#pLang input[value="bg"]').click();
      $('pSave').click(); 1`);
    await settle();
    const p3 = await page('{ n: PLAYERS.list.length, name: PLAYER.name, mascot: PLAYER.mascot, lang: document.documentElement.lang, ears: $("cat").querySelectorAll(".ear ellipse").length }');
    expect(p3.n === 3 && p3.name === 'Мая' && p3.mascot === 'bun' && p3.lang === 'bg' && p3.ears === 4, 'adding a player went wrong: ' + JSON.stringify(p3));
  }
  // Two devices through a running sync Worker (SMOKE_SYNC=http://127.0.0.1:8787 node smoke.js):
  // the page on 127.0.0.1 and on localhost has two separate storages, like an iPad and an iPhone.
  if(process.env.SMOKE_SYNC && !process.argv[2]){
    const before = bad.length + errors.length;
    const A = url.replace('localhost', '127.0.0.1'), B = A.replace('127.0.0.1', 'localhost');
    const open = async at => { await cmd('Page.navigate', { url: at }); await settle(); };
    const fresh = `localStorage.clear(); sessionStorage.clear(); localStorage.setItem('crossingten.syncurl', '${process.env.SMOKE_SYNC}'); location.reload(); 1`;
    const playOne = `(async () => { newRound([{ a:42, b:17, op:'-' }]); const K = k => document.querySelector('.key[data-k="' + k + '"]').click();
      K('2'); K('5'); K('go'); K('go'); await syncNow(); return LOCAL.rounds[LOCAL.rounds.length - 1].id; })()`;
    await open(A); await run(fresh); await settle();
    await run(`$('statsBtn').click(); $('syncStart').click(); 1`); await settle(1500);
    const code = await run(`FAMILY && FAMILY.code`);
    const ra = await run(playOne);
    await open(B); await run(fresh); await settle();
    await run(`startSync('${code}')`);
    const b1 = await page(`{ has: LOCAL.rounds.some(r => r.id === '${ra}'), n: LOCAL.rounds.length }`);
    expect(code && b1.has, 'device B did not get the round played on A: ' + JSON.stringify(b1));
    // B names the player and plays; A, on its next launch, has both
    await run(`$('who').click(); document.querySelector('.pedit[data-edit="p1"]').click(); $('pName').value = 'Ани'; $('pSave').click(); 1`);
    await settle(2500);
    const rb = await run(playOne);
    await open(A); await settle(1500);
    const a2 = await page(`{ name: PLAYER.name, has: LOCAL.rounds.some(r => r.id === '${rb}'), synced: $('synced').textContent }`);
    expect(a2.name === 'Ани' && a2.has, 'device A did not get the name and round from B: ' + JSON.stringify(a2));
    // A resets her progress; B drops the older rounds on its next sync
    await run(`$('statsBtn').click(); $('reset').click(); $('reset').click(); 1`); await settle(1500);
    await open(B); await settle(2000);
    const b2 = await page(`{ n: LOCAL.rounds.length }`);
    expect(b2.n === 0, 'a reset on A did not reach B: ' + JSON.stringify(b2));
    if(bad.length + errors.length === before) console.log('smoke: sync between two devices - rounds, a rename and a reset all crossed');
  }
  bad.unshift(...errors);
  if(bad.length){ console.error('smoke: FAILED\n  ' + bad.join('\n  ')); return done(1); }
  console.log('smoke: played every level in Chrome' + (process.argv[2] ? '' : ' for two players') + ', ' + res.rounds +
    ' rounds logged, no script errors' + (process.argv[2] ? '' : '; asking, switching and adding players all work'));
  done(0);
});
