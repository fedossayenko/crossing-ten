// Runs beside the app (in check.js's own scope, through eval): each block loads its own copy of
// the app's modules (APP, from check.js) and checks them from outside. Run all checks with: node check.js
// МБГ Есен 2026, 2 клас — a forecast, not a paper: the levels its slots reuse, and its five new levels by brute force.

/* The forecast (key 'mbg-autumn-forecast2026'): its levels, and the five new ones worked the long way. */
{
  const Q = APP;
  const strip = h => String(h).replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
  const calc = e => Function('return ' + strip(e).replace(/−/g, '-'))();
  const TAG = 'mbg-autumn-forecast2026-2';
  // its slots: what every year asks, and what the papers around it suggest is coming
  // (29, 48, 95, 102: types on the 1 клас Есен 2025 paper the same children sat, as 2024's grade 1 pair sums came back in 2025's grade 2)
  const want = [8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 21, 22, 24, 25, 27, 29, 31, 32, 48, 95, 102, 269, 270, 271, 272, 273];
  const got = Q.LEVELS.filter(l => l.papers.includes(TAG)).map(l => l.id).sort((a, b) => a - b);
  if(got.join() !== want.join()) throw new Error('the forecast holds levels ' + got + ', expected ' + want);
  if(Q.LEVELS.some(l => l.papers.includes(TAG) && l.grade !== 2)) throw new Error('a forecast level is not 2nd grade');
  // a forecast is not a real paper: it never counts towards how often the papers ask a level
  if(/-\d{4}-\d+$/.test(TAG) || Q.LEVELS.find(l => l.id === 269).freq !== 0) throw new Error('the forecast counts as a real, dated paper');

  const n = {};
  [269, 270, 271, 272, 273].forEach(id => { for(let i = 0; i < (id === 273 ? 300 : 2000); i++){
    const q = Q.raw(id), text = strip(Q.drawQ(q)).replace(/\s+/g, ' ');
    const fail = m => { throw new Error('level ' + id + ': ' + m + ' ' + JSON.stringify(q)); };
    n[q.kind] = (n[q.kind] || 0) + 1;
    if(!Q.accepts(q, [String(q.ans)])) fail('its own answer is refused');
    if((q.traps || []).includes(q.ans)) fail('a trap is the answer');
    if(q.kind === 'backx'){
      // the steps done forwards from the answer land on the result, inside 1…100 all the way
      let v = q.ans;
      q.steps.forEach(s => { v += s; if(v < 1 || v > 100) fail('a step leaves 1…100'); });
      if(v !== q.r || !q.steps.some(s => s > 0) || !q.steps.some(s => s < 0)) fail('the steps do not lead to ' + q.r);
      // one-digit steps, as the papers with this task had (2 клас Есен 2013, 2015; 1 клас Есен 2024), that do not cancel out
      if(q.steps.some(s => Math.abs(s) > 9) || v === q.ans) fail('a step of two digits, or steps that cancel');
      if(q.shape === 'arrow' ? !text.includes('? ' + q.steps.map(s => (s < 0 ? '−' : '+') + Math.abs(s) + ' →').join(' ') + ' ' + q.r)
                             : !text.includes('Намислих си число.') || !text.includes('Получих ' + q.r + '.')) fail('not drawn as asked: ' + text);
    }
    if(q.kind === 'pmgap'){
      if(calc('(' + Q.pmBig(q) + ') - (' + Q.pmSmall(q) + ')') !== q.ans) fail('the gap is not ' + q.ans);
      if(q.a + q.b + Math.max(q.e, q.f) > 100 || q.a + q.b - q.f < 0 || !q.a || !q.b) fail('a number outside 0…100');
    }
    if(q.kind === 'midpt'){
      const B = q.AB, M = B / 2, N = M - q.m;
      if(!(N > 0 && N < M) || (q.toB ? B - N : N) !== q.ans || B > 40 || B % 2) fail('the points do not give ' + q.ans);
      if(!text.includes('Отсечката AB е дълга ' + q.AB + ' см')) fail('not drawn as asked: ' + text);
    }
    if(q.kind === 'circop'){
      const op = (x, y) => q.shape === 'add' ? (x + y) + Math.abs(x - y) : (x + y) - Math.abs(x - y);
      if(op(q.x, q.y) !== q.ans || q.x === q.y || q.x + q.y > 100 || q.ans > 100) fail('◎ does not give ' + q.ans);
      if(!text.includes(q.ex[0] + ' ◎ ' + q.ex[1] + ' = ') || !text.includes(' = ' + op(q.ex[0], q.ex[1]) + q.x + ' ◎ ' + q.y + ' = ?')) fail('the example is wrong: ' + text);
    }
    if(q.kind === 'prodgrid'){
      // every filling of the four squares that fits the three numbers shown gives the same "?", and one exists
      // (squares 0…40, a shown sum checked as soon as its two squares are known)
      const seen = new Set(), fits = (k, v) => k === q.ask || v === q.sh[k];
      for(let a = 0; a <= 40; a++) for(let c = 0; c <= 40; c++) if(fits(0, a + c))
        for(let b = 0; b <= 40; b++) if(fits(1, a + b))
          for(let d = 0; d <= 40; d++) if(fits(2, c + d) && fits(3, b + d)) seen.add([a + c, a + b, c + d, b + d][q.ask]);
      if(seen.size !== 1 || !seen.has(q.ans)) fail('the fillings give ' + [...seen]);
    }
  }});
  console.log('МБГ Есен 2026 прогноза: ' + want.length + ' levels; ' + Object.keys(n).map(k => n[k] + ' ' + k).join(', ') + ' of the new ones worked the long way');
}
