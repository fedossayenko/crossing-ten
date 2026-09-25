// Question kind 'pickfit': level 80 Кои от числата? — Try each of a few given numbers in the box.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Зима 2024, задача 4: which of 9, 10 and 11 make □ + 1 > 11 true. The candidates
// are listed, so it is three tries rather than a search — the trap is the edge, where
// □ + 1 comes out equal and "greater" is not true.
function genPickFit(){
  const four = Math.random() < 0.3;              // Зима 2021: 15, 16, 17, 18 in □ + 17 < 34
  const lo = four ? 10 + rnd(10) : 3 + rnd(15), nums = four ? [lo, lo + 1, lo + 2, lo + 3] : [lo, lo + 1, lo + 2], add = four ? 11 + rnd(10) : 1 + rnd(9);
  const more = Math.random() < 0.6;
  // the edge falls on one of the three, so "equal" is always one of the tries
  const n = nums[rnd(nums.length)] + add;
  const fits = nums.filter(v => more ? v + add > n : v + add < n);
  return {kind:'pickfit', nums, add, n, more, fits, ans: fits.length};
}
const pickFitSt = q => '□ + ' + q.add + (q.more ? ' &gt; ' : ' &lt; ') + q.n;
function drawPickFit(q){
  if(q.kind === 'pickfit'){
    return '<div class="ask">' + tr('Колко от числата <span class="num">' + bgList(q.nums) + '</span> могат да се запишат в □ така, че да е <b>вярно</b>',
      'Скільки з чисел <span class="num">' + bgList(q.nums) + '</span> можна записати в □ так, щоб було <b>правильно</b>') + '</div>' +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)"><span class="num">' + pickFitSt(q) + '</span></div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqPickFit(q){
  if(q.kind === 'pickfit') return pickFitSt(q) + ': ' + (q.fits.length ? q.fits.join(', ') : '—') + ' → ' + q.ans;
}
function whyPickFit(q, full){
  if(q.kind === 'pickfit'){
    if(!full) return tr('Опитай всяко от числата поотделно — и внимавай, когато се получи равно.',
                        'Спробуй кожне з чисел окремо — і будь уважна, коли виходить рівно.');
    return q.nums.map(v => v + ' + ' + q.add + ' = ' + (v + q.add) + ' ' + (q.fits.includes(v) ? '✓' : '✗')).join('; ') +
      tr(' &nbsp;→&nbsp; стават ', ' &nbsp;→&nbsp; підходять ') + q.ans;
  }
}
KIND.pickfit = { draw:drawPickFit, eq:eqPickFit, why:whyPickFit };
