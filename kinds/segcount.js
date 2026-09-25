// Question kind 'segcount': level 102 Точки и отсечки — Points on a line and the segments between them.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Зима 2020, задача 15: 4 points on a line make 6 segments; Зима 2022, задача 16 the other
// way round — how many points for exactly 6. From the first point 3 segments start, from the
// next 2 new ones, then 1: 3 + 2 + 1.
function genSegCount(){
  const n = 3 + rnd(4), S = n*(n - 1)/2, rev = Math.random() < 0.45;
  return {kind:'segcount', n, S, rev, ans: rev ? n : S};
}
function segCountSvg(n){
  const W = 220, gap = W / (n + 1);
  let pts = '', labs = '';
  for(let i = 1; i <= n; i++){
    pts += '<circle cx="' + (i*gap).toFixed(1) + '" cy="20" r="4.5" fill="var(--accent)"/>';
    labs += '<text x="' + (i*gap).toFixed(1) + '" y="42" text-anchor="middle" font-size="13" font-weight="800" fill="var(--muted)" font-family="Nunito, sans-serif">' + 'ABCDEF'[i - 1] + '</text>';
  }
  return '<div class="fig wide"><svg viewBox="0 0 ' + W + ' 50" role="img" aria-label="' + tr('точки върху права', 'точки на прямій') + '">' +
    '<line x1="4" y1="20" x2="' + (W - 4) + '" y2="20" stroke="var(--ink)" stroke-width="2"/>' + pts + labs + '</svg></div>';
}
function drawSegCount(q){
  if(q.kind === 'segcount'){
    if(q.rev) return '<div class="ask">' + tr('Колко точки трябва да отбележим на една права, за да се получат <b>точно <span class="num">' + q.S + '</span> отсечки</b>?',
      'Скільки точок треба позначити на прямій, щоб утворилося <b>рівно <span class="num">' + q.S + '</span> відрізків</b>?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
    return '<div class="ask">' + tr('На една права са отбелязани <span class="num">' + q.n + '</span> точки. Колко <b>отсечки</b> се получават с краища тези точки?',
      'На прямій позначено <span class="num">' + q.n + '</span> ' + (q.n < 5 ? 'точки' : 'точок') + '. Скільки <b>відрізків</b> з кінцями в цих точках утворилося?') + '</div>' +
      segCountSvg(q.n) + '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
const segCountSum = n => Array.from({length: n - 1}, (_, i) => n - 1 - i).join(' + ');
function eqSegCount(q){
  if(q.kind === 'segcount') return q.n + ' • → ' + segCountSum(q.n) + ' = ' + q.S + (q.rev ? ' → ' + q.ans : '');
}
function whySegCount(q, full){
  if(q.kind === 'segcount'){
    if(!full) return q.rev ? tr('Опитай с малко точки и брой отсечките, после добавяй по една точка.', 'Спробуй з кількома точками й рахуй відрізки, потім додавай по одній точці.')
                           : tr('Започни от първата точка: колко отсечки тръгват от нея? После от втората — само новите.', 'Почни з першої точки: скільки відрізків від неї виходить? Потім від другої — лише нові.');
    if(q.rev){
      const rows = []; for(let k = 2; k <= q.n; k++) rows.push(k + ' • → ' + k*(k - 1)/2);
      return rows.join(', ') + ' &nbsp;→&nbsp; ' + q.ans;
    }
    return tr('от първата ', 'від першої ') + (q.n - 1) + tr(', от втората още ', ', від другої ще ') + (q.n - 2) + ', … &nbsp;→&nbsp; ' + segCountSum(q.n) + ' = ' + q.ans;
  }
}
KIND.segcount = { draw:drawSegCount, eq:eqSegCount, why:whySegCount };
