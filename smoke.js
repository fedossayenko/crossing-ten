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
  const url = 'http://127.0.0.1:' + server.address().port + '/';
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
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  // After a load, wait until the app has started, not a fixed time: on a busy machine (right after
  // a rebuild) the service worker's install can hold the page up for several seconds.
  // settle() follows a load: each page that settled is marked, so it waits for a new page, not the one going.
  // settle(ms) is a plain pause for something with no page load to watch (a sync), never under 1.5 s.
  const settle = async ms => {
    if(ms) return sleep(Math.max(ms, 1500));
    for(let i = 0; i < 300; i++){
      const r = await cmd('Runtime.evaluate', { expression: "!window.__settled && document.readyState === 'complete' && typeof S === 'object' && !!document.getElementById('stage')?.innerHTML", returnByValue: true });
      if(r.result?.result?.value === true){ await cmd('Runtime.evaluate', { expression: 'window.__settled = 1' }); return; }
      await sleep(50);
    }
  };
  const run = async expr => {
    const r = await cmd('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
    if(r.result.exceptionDetails) errors.push(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text);
    const v = r.result.result && r.result.result.value;
    return typeof v === 'string' ? v : undefined;
  };
  // Load it a second time so the page runs through its service worker, as a returning device does
  // (once the worker has finished installing: it fetches every file and the fonts first).
  await run("navigator.serviceWorker && Promise.race([navigator.serviceWorker.ready, new Promise(r => setTimeout(r, 20000))]).then(() => '')");
  await cmd('Page.reload'); await settle();

  // Inside the page: for every level, pick it, miss the first question twice (hint, then
  // the reveal), answer the rest correctly, and land on the end-of-round sheet.
  const play = `(async () => {
    // a turn of the event loop: a MessageChannel message, which browsers do not stretch to 4 ms as they do a
    // nested setTimeout(0) (22 of those a level were most of this run)
    const tick = () => new Promise(r => { const c = new MessageChannel(); c.port1.onmessage = () => r(); c.port2.postMessage(0); });
    const key = k => document.querySelector('.key[data-k="' + k + '"]').click();
    const type = v => String(v).split('').forEach(key);
    const out = [];
    if(!navigator.serviceWorker.controller) out.push('the service worker is not serving the page');
    for(const l of LEVELS){
      $('levelPill').click();
      if(!document.querySelector('.pick[data-lvl="' + l.id + '"]')) document.querySelector('#pickGrades [data-v="0"]').click();   // it opens on her grade
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
  // a launch opens on the recommended level, not on a fixed one
  const launch = JSON.parse(await run('JSON.stringify({ start: S.level, suggested: nextUp(mastery(LOCAL.rounds), null).id })') || '{}');
  const res = JSON.parse(await run(play) || '{"out":["driver returned nothing"]}');
  if(launch.start !== launch.suggested) res.out.push('the launch did not open the recommended level: ' + JSON.stringify(launch));
  const bad = res.out.slice();
  const expect = (cond, what) => { if(!cond) bad.push(what); };
  const t_bg_wrote = 'ти написа 35 · забравен заем от десетиците';
  const page = async expr => JSON.parse(await run('JSON.stringify(' + expr + ')') || '{}');

  // A first launch is one Bulgarian player with the cat, and asks nothing.
  const first = await page('{ lang: document.documentElement.lang, again: $("again").textContent, players: $("players").hidden, n: PLAYERS.list.length, welcome: !$("playerEdit").hidden && $("editTitle").textContent, rounds: LOCAL.rounds.length }');
  expect(first.lang === 'bg' && first.again === 'Нов рунд' && first.players && first.n === 1 && first.welcome === 'Добре дошли!', 'first launch is not one Bulgarian player: ' + JSON.stringify(first));
  // the picker opens on her grade; МБГ opens a row of its papers; a paper shows only its own levels,
  // and «Есен · други» only the autumn levels no year claims; a round picked is kept as her focus —
  // after a relaunch too — with its levels easiest first and the suggestion inside it
  const filt = await page(`(() => { PICK_FOR = null; delete LOCAL.focus; buildPicker(); const ids = () => [...document.querySelectorAll('#pickAll .pick')].map(b => +b.dataset.lvl);
    const r = { grade: document.querySelector('#pickGrades [aria-pressed="true"]').dataset.v, papersHidden: $('pickPapers').hidden, g2: ids().every(id => LEVELS.find(l => l.id === id).grade === 2) };
    document.querySelector('#pickComps [data-v="mbg"]').click(); r.papersShown = !$('pickPapers').hidden;
    r.rounds = !$('pickRounds').hidden; document.querySelector('#pickRounds [data-v="winter"]').click();
    r.winter = ids().length > 0 && ids().every(id => LEVELS.find(l => l.id === id).papers.some(p => p.startsWith('mbg-winter')));
    document.querySelector('#pickRounds [data-v=""]').click();
    document.querySelector('#pickPapers [data-v="mbg-autumn-2024-2"]').click(); r.y24 = ids().every(id => LEVELS.find(l => l.id === id).papers.includes('mbg-autumn-2024-2')) && ids().length;
    const other = document.querySelector('#pickPapers [data-v="mbg-autumn-2"]');   // shown only while some autumn level has no year
    r.other = other ? (other.click(), ids().every(id => !LEVELS.find(l => l.id === id).papers.some(p => /^mbg-autumn-\\d{4}/.test(p))) && ids().length) :
      LEVELS.filter(l => l.papers[0] === 'mbg-autumn-2' && !l.papers.some(p => /^mbg-autumn-\\d{4}/.test(p))).length === 0;
    document.querySelector('#pickRounds [data-v="autumn"]').click(); PICK_FOR = null; buildPicker();
    const ds = ids().map(id => LEVELS.find(l => l.id === id).d), nx = LEVELS.find(l => l.id === +document.querySelector('#nextUp [data-lvl]').dataset.lvl);
    r.focus = PICK_COMP === 'mbg' && PICK_ROUND === 'autumn' && ds.every((d, i) => !i || d >= ds[i-1]) && inFocus(nx);
    document.querySelector('#pickComps [data-v=""]').click(); r.back = $('pickPapers').hidden;
    // another grade picked on its own is a focus too: the suggestion stays in that grade
    document.querySelector('#pickGrades [data-v="1"]').click(); PICK_FOR = null; buildPicker();
    r.grade1 = PICK_GRADE === 1 && LEVELS.find(l => l.id === +document.querySelector('#nextUp [data-lvl]').dataset.lvl).grade === 1;
    document.querySelector('#pickGrades [data-v="2"]').click(); return r; })()`);
  expect(filt.grade === '2' && filt.papersHidden && filt.g2 && filt.papersShown && filt.y24 > 0 && filt.other && filt.back && filt.rounds && filt.winter && filt.focus && filt.grade1, 'the picker filters are wrong: ' + JSON.stringify(filt));
  // the welcome speaks the language she picks at once, and once saved it does not come back
  {
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
  {
    await run(`localStorage.setItem('crossingten.players', JSON.stringify({ cur:'p1', list:[
      { id:'p1', name:'Ани', mascot:'fox', lang:'en' }, { id:'p2', name:'Иво', mascot:'owl', lang:'uk' }] }));
      sessionStorage.clear(); location.reload(); 1`);
    await settle();
    const ask = await page('{ lang: document.documentElement.lang, open: !$("players").hidden || !$("playerEdit").hidden, fox: !!$("cat").querySelector("ellipse[rx=\'68\']") }');
    expect(ask.lang === 'en' && !ask.open && ask.fox, 'a later launch did not go straight to the exercise: ' + JSON.stringify(ask));
    const tiles = await page('(() => { $("who").click(); return document.querySelectorAll(".pchoose").length; })()');
    expect(tiles === 2, 'the mascot did not open the two players: ' + tiles);
    await run(`document.querySelector('.pchoose[data-id="p2"]').click(); 1`);
    await settle();
    const p2 = await page('{ id: PLAYER.id, lang: document.documentElement.lang, again: $("again").textContent, rounds: LOCAL.rounds.length, open: !$("players").hidden }');
    expect(p2.id === 'p2' && p2.lang === 'uk' && p2.again === 'Новий раунд' && p2.rounds === 0 && !p2.open, 'switching player went wrong: ' + JSON.stringify(p2));
    const res2 = JSON.parse(await run(play) || '{"out":["driver returned nothing"]}');
    bad.push(...res2.out.map(x => 'second player, in Ukrainian: ' + x));
    // Adding a player through the form: name, mascot, language, save.
    await run(`$('who').click(); $('pAdd').click(); $('pName').value = 'Мая';
      document.querySelector('.mchoice[data-m="bun"]').click(); document.querySelector('#pLang input[value="bg"]').click();
      document.querySelector('#pGrade input[value="3"]').click(); $('pSave').click(); 1`);
    await settle();
    const p3 = await page('{ n: PLAYERS.list.length, name: PLAYER.name, mascot: PLAYER.mascot, lang: document.documentElement.lang, ears: $("cat").querySelectorAll(".ear ellipse").length }');
    expect(p3.n === 3 && p3.name === 'Мая' && p3.mascot === 'bun' && p3.lang === 'bg' && p3.ears === 4, 'adding a player went wrong: ' + JSON.stringify(p3));
    // She is a 3rd-grader: her recommendation and her competitions are the 3rd grade's (the one below plays one).
    const g3 = await page('(buildPicker(), { grade: PLAYER.grade, next: LEVELS.find(l => l.id === +document.querySelector("#nextUp [data-lvl]").dataset.lvl).grade, comp: [...new Set(compTasks().map(q => LEVELS.find(l => l.id === q.lvl).grade))] })');
    expect(g3.grade === 3 && g3.next === 3 && g3.comp.join() === '3', 'a 3rd-grade profile went wrong: ' + JSON.stringify(g3));
  }
  // Multiple choice in training: a wrong option is crossed out, the right one ends the task.
  {
    const ch = JSON.parse(await run(`(async () => {
      const wait = ms => new Promise(r => setTimeout(r, ms));
      $('ansSeg').querySelector('[data-c="1"]').click(); await wait(100);
      const q = S.qs[S.i], shown = { opts: document.querySelectorAll('#choices .ch').length, pad: $('pad').hidden, choices: !$('choices').hidden };
      const wrong = q.options.find(o => o.id !== q.pick).id;
      document.querySelector('#choices .ch[data-o="' + wrong + '"]').click(); await wait(100);
      shown.crossed = document.querySelector('#choices .ch[data-o="' + wrong + '"]').disabled;
      shown.hint = !!document.querySelector('#hint .fb.no');
      document.querySelector('#choices .ch[data-o="' + q.pick + '"]').click(); await wait(100);
      shown.settled = S.settled; shown.dbg = [S.i, q.pick, S.parts, S.tries, S.revealed, JSON.stringify(q.options), q === S.qs[S.i]]; shown.green = !!document.querySelector('#choices .ch.ok');
      $('ansSeg').querySelector('[data-c="0"]').click(); newRound(); await wait(100);
      shown.back = !$('pad').hidden && $('choices').hidden;
      return JSON.stringify(shown); })()`) || '{}');
    expect(ch.opts === 4 && ch.pad && ch.choices && ch.crossed && ch.hint && ch.settled && ch.green && ch.back, 'multiple choice went wrong: ' + JSON.stringify(ch));

    // A competition: 20 tasks, 15 of them А/Б/В/Г; one skipped comes back last; 12 right; points at the end.
    const cp = JSON.parse(await run(`(async () => {
      const wait = ms => new Promise(r => setTimeout(r, ms));
      const K = k => document.querySelector('.key[data-k="' + k + '"]').click();
      $('levelPill').click(); await wait(100); $('compStart').click(); await wait(100);
      const out = { n: S.qs.length, choice: S.qs.filter(q => q.options).length, drill: S.qs.filter(q => !q.kind).length, clock: !!$('compClock'), skip: !$('skipBtn').hidden,
        header: $('levelName').textContent + ' ' + $('sub').textContent };
      $('skipBtn').click(); await wait(50); out.afterSkip = S.i;
      const order = [];
      for(let step = 0; step < 25 && COMP; step++){
        const q = S.qs[S.i], right = order.length < 12;
        order.push(S.i);
        if(q.options){
          const id = right ? q.pick : q.options.find(o => o.id !== q.pick).id;
          document.querySelector('#choices .ch[data-o="' + id + '"]').click();
        } else {
          for(let slot = 0; slot < (q.slots || 1); slot++){ [...(right ? String(answers(q)[slot]) : '999')].forEach(K); K('go'); }
        }
        // the paper moves on by itself (150 ms, or 450 after А/Б/В/Г): wait for the next task, not a fixed time
        const at = S.i;
        for(let t = 0; t < 100 && COMP && S.i === at; t++) await wait(20);
      }
      out.order = order; out.sheet = !$('sheet').hidden; out.score = $('score').textContent;
      const r = LOCAL.rounds[LOCAL.rounds.length - 1];
      out.round = { level: r.level, n: r.n, firstTry: r.firstTry, pts: r.pts, max: r.max, levels: (r.levels || []).length, secs: Number.isInteger(r.secs),
        // each task's record: drawn again from its level and seed, it has the recorded answer; its right/wrong marks add up
        tasks: r.t.length, redrawn: r.t.every(x => Number.isInteger(x[2]) && answer(seeded(x[2], () => raw(x[0]))) === x[5]), right: r.t.filter(x => x[4] === 1).length,
        small: JSON.stringify(r).length < 4096 };   // the sync server drops a round over 4 KB (MAX_ROUND)
      out.badge = $('earnedWrap').textContent.indexOf(badgeName(BADGES.find(b => b.id === 'racer'))) >= 0; out.comp = COMP;
      return JSON.stringify(out); })()`) || '{}');
    const want = cp.round && cp.round.pts + ' / ' + cp.round.max;
    expect(cp.n === 20 && cp.drill === 0 && cp.choice >= 12 && cp.clock && cp.skip && cp.afterSkip === 1 && cp.order.length === 20 && cp.order[19] === 0 &&
      cp.sheet && cp.score === want && cp.round.level === 'comp' && cp.round.firstTry === 12 && cp.round.levels === 20 &&
      cp.round.secs && cp.round.tasks === 20 && cp.round.redrawn && cp.round.right === 12 && cp.round.small &&
      cp.badge && cp.comp === null && !/undefined|NaN/.test(cp.header), 'the competition went wrong: ' + JSON.stringify(cp));
    await run(`$('sheet').hidden = true; 1`);
  }
  // A reload mid-round — an iPad dropping the app in the background, a new build — comes back to the same task
  {
    const want = await run(`S.level = 4; newRound(); S.results.push(true); next(); S.results.push(false); next(); JSON.stringify(S.qs[2])`);
    await cmd('Page.reload'); await settle();
    const back = await page(`{ level: S.level, i: S.i, results: S.results.length, q: JSON.stringify(S.qs[S.i]) }`);
    expect(back.level === 4 && back.i === 2 && back.results === 2 && back.q === want, 'a reload mid-round did not come back to the same task: ' + JSON.stringify(back));
    await run(`localStorage.removeItem(RS); newRound(); 1`);
  }
  // The archive: a log longer than localStorage's 400 comes back whole after a reload, and a level learned
  // in its oldest rounds — gone from localStorage — is still learned
  {
    const had = await page(`{ n: LOCAL.rounds.length }`);
    const kept = await run(`(async () => {
      const old = Array.from({ length: 450 }, (_, i) => ({ id: 'old' + i, ts: 1e12 + i*1000, day: '2001-09-09', level: i < 3 ? 5 : 4, n: 10, firstTry: 10, best: 10, lang: 'bg', seen: [], missed: [], slips: [] }));
      await ARCHIVE.put(PLAYER.id, old);
      LOCAL.rounds = unionRounds(old, LOCAL.rounds); saveLocal();
      return String(JSON.parse(localStorage.getItem(LS)).rounds.length); })()`);
    await cmd('Page.reload'); await settle();
    const arc = await page(`{ n: LOCAL.rounds.length, five: !!(mastery(LOCAL.rounds)[5] || {}).done }`);
    expect(kept === '400' && arc.n === had.n + 450 && arc.five, 'the archive did not bring the whole log back: ' + JSON.stringify({ kept, had, arc }));
    await run(`(async () => { await ARCHIVE.drop(PLAYER.id, 1e12 + 450*1000); LOCAL.rounds = LOCAL.rounds.filter(r => !r.id.startsWith('old')); saveLocal(); return ''; })()`);
  }
  // The answer line's size comes from its class (.line.xl in app.css): clamp(34px, 10vw, 56px) of this window
  {
    const ln = await page(`(() => { S.level = 190; newRound(); const l = document.querySelector('#stage .line.xl');
      return { size: l && getComputedStyle(l).fontSize, want: Math.min(56, Math.max(34, innerWidth / 10)) + 'px' }; })()`);
    expect(ln.size && ln.size === ln.want, 'the answer line is not sized by its class: ' + JSON.stringify(ln));
    await run(`localStorage.removeItem(RS); newRound(); 1`);
  }
  // R0, the framework trial: with ?ui=next the badges screen is a Preact component (js/ui/badges.js); it must
  // show what the hand-built screen shows for the same rounds, and answer a tapped badge the same way
  {
    await cmd('Page.navigate', { url: url + '?ui=next' }); await settle();
    const r0 = JSON.parse(await run(`(async () => {
      $('statsBtn').click();
      for(let i = 0; i < 100 && !document.querySelector('#statsNext .badge'); i++) await new Promise(r => setTimeout(r, 20));
      const box = $('statsNext'), txt = el => el ? el.textContent.replace(/\\s+/g, ' ').trim() : null, labels = root => [...root.querySelectorAll('.badge')].map(b => b.getAttribute('aria-label'));
      const out = { same: { labels: labels(box).join() === labels($('badges')).join() && labels(box).length === 16,
        next: txt(box.querySelector('.nextbadge')) === txt($('nextBadge')), tiles: txt(box.querySelector('.bigstat')) === txt($('tiles')),
        medals: box.querySelector('.badge svg').outerHTML.length > 400 } };
      const pickB = box.querySelectorAll('.badge')[4]; pickB.click(); await new Promise(r => setTimeout(r, 30));
      $('badges').querySelectorAll('.badge')[4].click();
      out.same.tap = txt(box.querySelector('.badgeneed')) === txt($('badgeNeed')) && pickB.getAttribute('aria-pressed') === 'true';
      const m = await import('./js/ui/badges.js'); let t = performance.now();
      for(let i = 0; i < 50; i++) m.showBadges(box, LOCAL.rounds);
      out.rerenderMs = ((performance.now() - t) / 50).toFixed(2);
      t = performance.now(); for(let i = 0; i < 50; i++) renderStats(); out.legacyMs = ((performance.now() - t) / 50).toFixed(2);
      return JSON.stringify(out); })()`) || '{}');
    expect(r0.same && Object.values(r0.same).every(Boolean), 'the Preact badges screen differs from the hand-built one: ' + JSON.stringify(r0));
    console.log('smoke: R0 trial — the Preact badges screen matches the hand-built one; re-render ' + r0.rerenderMs + ' ms, hand-built ' + r0.legacyMs + ' ms');
    await cmd('Page.navigate', { url }); await settle();
  }
  // Two devices through a running sync Worker (SMOKE_SYNC=http://127.0.0.1:8787 node smoke.js):
  // the page on 127.0.0.1 and on localhost has two separate storages, like an iPad and an iPhone.
  if(process.env.SMOKE_SYNC){
    const before = bad.length + errors.length;
    const A = url.replace('localhost', '127.0.0.1'), B = A.replace('127.0.0.1', 'localhost');
    const open = async at => { await cmd('Page.navigate', { url: at }); await settle(); };
    const fresh = `localStorage.clear(); sessionStorage.clear(); localStorage.setItem('crossingten.syncurl', '${process.env.SMOKE_SYNC}'); location.reload(); 1`;
    const playOne = `(async () => { newRound([{ a:42, b:17, op:'-' }]); const K = k => document.querySelector('.key[data-k="' + k + '"]').click();
      K('2'); K('5'); K('go'); K('go'); await syncNow(); return LOCAL.rounds[LOCAL.rounds.length - 1].id; })()`;
    const fam = 'Smoke ' + Date.now();
    const fill = (pass, btn) => `$('lName').value = '${fam}'; $('lPass').value = '${pass}'; $('${btn}').click(); 1`;
    await open(A); await run(fresh); await settle();
    await run(`$('pSave').click(); $('statsBtn').click(); $('toParent').click(); $('syncLogin').click(); 1`); await settle(300);
    await run(fill('smoke-pass', 'lSignup')); await settle(1500);
    const a1 = await page(`{ in: IN(), shown: $('syncCode').textContent, card: !$('syncOnRow').hidden, sheet: $('login').hidden }`);
    expect(a1.in && a1.shown === fam && a1.card && a1.sheet, 'signing up on A went wrong: ' + JSON.stringify(a1));
    const ra = await run(playOne);
    // B is a new device: its welcome screen logs in, a wrong password first
    await open(B); await run(fresh); await settle();
    await run(`$('welcomeJoin').click(); 1`); await settle(300);
    await run(fill('not-the-pass', 'lLogin')); await settle(1200);
    const wrong = await page(`{ msg: $('lMsg').textContent, right: $('lMsg').textContent === t('wrongPass'), in: IN() }`);
    expect(!wrong.in && wrong.right, 'a wrong password was not refused on B: ' + JSON.stringify(wrong));
    await run(fill('smoke-pass', 'lLogin')); await settle(2500);
    const b1 = await page(`{ has: LOCAL.rounds.some(r => r.id === '${ra}'), n: LOCAL.rounds.length, in: IN(), welcome: !$('playerEdit').hidden }`);
    expect(b1.in && b1.has && !b1.welcome, 'device B did not get the round played on A: ' + JSON.stringify(b1));
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
    // logging out on B ends only B's session; A keeps syncing
    await run(`$('syncLeave').click(); 1`); await settle(800);
    const b3 = await page(`{ in: IN(), login: !$('syncOff').hidden }`);
    await open(A); await settle(1500);
    const a3 = JSON.parse(await run(`syncNow().then(ok => JSON.stringify({ in: IN(), ok }))`) || '{}');
    expect(!b3.in && b3.login && a3.in && a3.ok, 'logging out went wrong: ' + JSON.stringify({ b3, a3 }));
    if(bad.length + errors.length === before) console.log('smoke: sync between two devices - signup, a wrong password, login from the welcome, rounds, a rename, a reset and logout all work');
  }
  // Offline, as on a plane: the server gone altogether, a fresh navigation, and a round played from
  // the service worker's copy
  if(!process.env.SMOKE_SYNC){
    server.close(); server.closeAllConnections();
    await cmd('Page.navigate', { url: url.split('?')[0] + '?offline=' + Date.now() }); await settle();
    const off = await page(`(() => { $('levelPill').click(); const b = document.querySelector('#pickAll .pick'); b.click();
      return { keys: document.querySelectorAll('.key').length, levels: LEVELS.length, q: !!S.qs.length, font: getComputedStyle(document.body).fontFamily.includes('Nunito') }; })()`);
    expect(off.keys >= 10 && off.levels > 100 && off.q, 'offline, the app does not start from its copy: ' + JSON.stringify(off));
    if(bad.length + errors.length === 0) console.log('smoke: offline (server stopped) the app starts and a round begins from the service worker copy');
  }
  bad.unshift(...errors);
  if(bad.length){ console.error('smoke: FAILED\n  ' + bad.join('\n  ')); return done(1); }
  console.log('smoke: played every level in Chrome for two players, ' + res.rounds +
    ' rounds logged, no script errors; asking, switching and adding players, А/Б/В/Г and a 20-task competition all work');
  done(0);
});
