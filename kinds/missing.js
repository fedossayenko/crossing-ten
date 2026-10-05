// Question kind 'missing': level 27 Пропуснатите — Find the rule, fill the gaps — then read what is asked.

// Задача 5: find the rule, fill the two gaps — then read whether the question wants
// the digits of the missing numbers or the numbers themselves.
import { KIND, SLOT, popAt, rnd, svgText, tr } from '../js/core.js';
export function genMissing(){
  if(Math.random() < 0.2){
    // Коледно 2024, задача 2: 2, 3, 5, 8, 12, …, 23, …, 38, 47 — the step grows by one each time,
    // and both gaps are wanted, one on each side of a number that is shown
    const a0 = 1 + rnd(6), s0 = 1 + rnd(3), seq = [a0];
    for(let i = 0; i < 9; i++) seq.push(seq[i] + s0 + i);
    const g1 = 4 + rnd(2), g2 = g1 + 2;
    return {kind:'missing', grows:1, seq, gaps:[g1, g2], slots:2, ans: seq[g1], alt:[seq[g2]]};
  }
  if(Math.random() < 0.3){
    // Задача 6: a single gap, and the missing number itself is the answer. The rule has
    // to be worked out first — a constant step, doubling, or adding the two before.
    for(;;){
      const rule = rnd(3);
      const seq = [];
      if(rule === 0){
        const a0 = rnd(4) * (Math.random() < 0.5 ? 1 : 5);
        seq.push(a0, a0 + rnd(9) + (a0 ? 0 : 1));   // never a step down, or the run reads as a mistake
        while(seq.length < 9) seq.push(seq[seq.length-1] + seq[seq.length-2]);
      } else if(rule === 1){
        const start = 1 + rnd(9), d = 2 + rnd(8);
        for(let i = 0; i < 8; i++) seq.push(start + i*d);
      } else {
        const start = 1 + rnd(4);
        for(let i = 0; i < 7; i++) seq.push(start * Math.pow(2, i));
      }
      // …and it may be the number after the run, which is the same reading of the rule
      const next = Math.random() < 0.4;
      const at = next ? seq.length - 1 : 3 + rnd(seq.length - 4);
      if(seq[at] < 1 || seq[seq.length-1] > 250) continue;
      return {kind:'missing', one:1, next, seq: next ? seq.slice(0, -1) : seq, at, rule, ans: seq[at]};
    }
  }
  if(Math.random() < 0.3){
    // Two runs woven together: every other number belongs to the same run.
    const dA = 6 + rnd(9), dB = 2 + rnd(3);
    const runA = [], runB = [];
    let a0 = 5 + rnd(15), b0 = 1 + rnd(5);
    for(let i = 0; i < 5; i++){ runA.push(a0 + i*dA); runB.push(b0 + i*dB); }
    const k = 1 + rnd(2);                     // hide runB[k] then runA[k+1], side by side
    const star = runA[k + 1], dot = runB[k];
    if(star <= dot) return genMissing();
    const woven = [];
    for(let i = 0; i < 5; i++) woven.push(runA[i], runB[i]);
    return {kind:'missing', woven, hideAt:[2*k + 1, 2*k + 2], runA, runB, dA, dB,
            star, dot, ans: star - dot};
  }
  for(;;){
    const rule = rnd(3);
    const seq = [];
    if(rule === 0){                                  // each is the sum of the two before it
      seq.push(1, 1 + rnd(2));
      while(seq.length < 9) seq.push(seq[seq.length-1] + seq[seq.length-2]);
    } else if(rule === 1){                           // a constant step
      const start = 1 + rnd(9), d = 2 + rnd(8);
      for(let i = 0; i < 8; i++) seq.push(start + i*d);
    } else {                                         // doubling
      const start = 1 + rnd(4);
      for(let i = 0; i < 7; i++) seq.push(start * Math.pow(2, i));
    }
    const at = 2 + rnd(seq.length - 4);              // never the opening terms, never the last
    const hidden = [seq[at], seq[at+1]];
    const asksDigits = Math.random() < 0.6;
    const ans = asksDigits ? String(hidden[0]).length + String(hidden[1]).length : hidden[0] + hidden[1];
    if(ans > 999) continue;
    return {kind:'missing', seq, at, hidden, asksDigits, rule, ans};
  }
}

function drawMissing(q){
  if(q.grows){
    return '<div class="ask">' + tr('<b>Кои са</b> пропуснатите числа в редицата?', '<b>Які</b> числа пропущено в ряду?') + '</div>' +
      '<div class="seq">' + q.seq.map((v, i) => q.gaps.includes(i) ? '…' : v).join(', ') + '</div>' +
      '<div class="line md">' + SLOT + ' <span class="or">' + tr('и', 'і') + '</span> <span class="slot" id="slot1"></span></div>';
  }
  if(q.woven){
    const shown = q.woven.map((v, i) =>
      i === q.hideAt[0] ? '<span class="circle">●</span>'
      : i === q.hideAt[1] ? '<span class="circle">★</span>' : v).join(', ');
    return '<div class="ask"><span class="circle">★</span> − <span class="circle">●</span> = ?</div>' +
      '<div class="seq">' + shown + '</div>' +
      '<div class="line lg">' + SLOT + '</div>';
  }
  if(q.one){
    const shown = q.next ? q.seq.join(', ') + ', …' : q.seq.map((v, i) => i === q.at ? '…' : v).join(', ');
    return '<div class="ask">' + tr('Кое е <b>' + (q.next ? 'следващото' : 'пропуснатото') + '</b> число?',
      'Яке число <b>' + (q.next ? 'наступне' : 'пропущене') + '</b>?') + '</div>' +
      '<div class="seq">' + shown + '</div>' +
      '<div class="line lg">' + SLOT + '</div>';
  }
  const shown = q.seq.map((v, i) => i === q.at || i === q.at + 1 ? '…' : v).join(', ');
  return '<div class="ask">' + (q.asksDigits
      ? tr('Колко е <b>броят на цифрите</b> на пропуснатите числа?', 'Скільки <b>всього цифр</b> у пропущених числах?')
      : tr('Колко е <b>сборът</b> на пропуснатите числа?', 'Чому дорівнює <b>сума</b> пропущених чисел?')) + '</div>' +
    '<div class="seq">' + shown + '</div>' +
    '<div class="line lg">' + SLOT + '</div>';
}
function eqMissing(q){
  if(q.grows) return tr('стъпките ', 'кроки ') + q.seq.slice(1).map((v, i) => v - q.seq[i]).join(', ') + ' → ' + q.ans + tr(' и ', ' і ') + q.alt[0];
  if(q.one) return tr('правило ' + q.rule + ', липсва на място ', 'правило ' + q.rule + ', пропуск на місці ') + (q.at + 1) + ' → ' + q.ans;
  if(q.woven) return '★ ' + q.star + ', ● ' + q.dot + ' → ' + q.ans;
  return tr('липсват ', 'пропущено ') + q.hidden[0] + tr(' и ', ' і ') + q.hidden[1] +
    (q.asksDigits ? tr(' → цифри: ', ' → цифр: ') : tr(' → сбор: ', ' → сума: ')) + q.ans;
}
// The picture: the run again, an arc over every step with what it adds, walking left to right; the
// missing places stand in an orange frame and fill in as the arcs reach them. Two runs woven together
// step over every other number, one run above and the other below.
function missingSvg(q){
  const vals = q.woven || (q.one && q.next ? q.seq.concat(q.ans) : q.seq);
  const gone = q.grows ? q.gaps : q.woven ? q.hideAt : q.one ? [q.at] : [q.at, q.at + 1];
  const N = vals.length, cw = 30, x = i => 15 + i * cw, W = N * cw, below = !!q.woven;
  let g = '';
  vals.forEach((v, i) => {
    if(gone.includes(i)) g += '<rect x="' + (x(i) - 14) + '" y="-13" width="28" height="19" rx="6" fill="none" stroke="var(--warm)" stroke-width="2"/>' +
      svgText(x(i), 1, v, v > 99 ? 11 : 13, 'var(--warm)', popAt(1.5 + i * 0.45));
    else g += svgText(x(i), 1, v, v > 99 ? 11 : 13, 'var(--ink)');
  });
  const step = (i, j, up) => {   // an arc from place i to place j, above or below the numbers, with what it adds
    const a = x(i) + 3, b = x(j) - 3, m = (a + b) / 2, y0 = up ? -15 : 9, y1 = up ? -33 : 27;
    return '<g' + popAt(1 + j * 0.45) + '><path d="M' + a + ',' + y0 + ' Q' + m + ',' + y1 + ' ' + b + ',' + y0 + '" stroke="var(--accent)" stroke-width="1.8" fill="none"/>' +
      svgText(m, up ? -27 : 35, '+' + (vals[j] - vals[i]), 10, 'var(--accent)') + '</g>';
  };
  for(let j = 1; j < N; j++){
    if(!below) g += step(j - 1, j, true);
    else if(j >= 2) g += step(j - 2, j, j % 2 === 0);
  }
  const a = q.one && q.seq[q.at - 1], b = q.one && q.seq[q.at - 2];
  const foot = q.grows ? vals[q.gaps[0]] + tr(' и ', ' і ') + vals[q.gaps[1]]
    : q.woven ? q.star + ' − ' + q.dot + ' = ' + q.ans
    : q.one ? (q.rule === 0 ? b + ' + ' + a : a + ' + ' + (q.ans - a)) + ' = ' + q.ans
    : q.asksDigits ? String(q.hidden[0]).length + ' + ' + String(q.hidden[1]).length + ' = ' + q.ans
    : q.hidden[0] + ' + ' + q.hidden[1] + ' = ' + q.ans;
  const y = below ? 60 : 32;
  g += svgText(W / 2, y, foot, 15, 'var(--ink)', popAt(2.5 + N * 0.45));
  return '<svg viewBox="0 -42 ' + W + ' ' + (y + 50) + '" style="display:block; width:' + Math.round(W * 1.3) + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('стъпките на редицата', 'кроки ряду') + '">' + g + '</svg>';
}
function whyMissing(q, full){
  const text = whyMissingText(q, full);
  return full && text ? text + missingSvg(q) : text;
}
function whyMissingText(q, full){
  if(q.kind === 'missing' && q.grows){
    if(!full) return tr('С колко расте всяко число? Виж как се мени и самата стъпка.', 'На скільки зростає кожне число? Подивись, як змінюється сам крок.');
    const st = q.seq.slice(1).map((v, i) => v - q.seq[i]);
    return tr('стъпките растат с по 1: ', 'кроки зростають на 1: ') + st.join(', ') + ' &nbsp;→&nbsp; ' +
      q.gaps.map(g => q.seq[g - 1] + ' + ' + st[g - 1] + ' = <b>' + q.seq[g] + '</b>').join(', ');
  }
  if(q.kind === 'missing' && q.woven){
    if(!full) return tr('Погледни числата през едно — това са две редици.', 'Подивись на числа через одне — це два ряди.');
    const grow = tr(', … растат с <b>', ', … зростають на <b>');
    return q.runA.slice(0, 3).join(', ') + grow + q.dA + '</b> → ★ = ' + q.star +
      '; &nbsp;' + q.runB.slice(0, 2).join(', ') + grow + q.dB + '</b> → ● = ' + q.dot +
      ' &nbsp;→&nbsp; ' + q.star + ' − ' + q.dot + ' = ' + q.ans;
  }
  if(q.kind === 'missing' && q.one){
    if(!full) return tr('Виж как се получава всяко число от тези преди него.', 'Подивись, як кожне число виходить із попередніх.');
    const a = q.seq[q.at - 1], b = q.seq[q.at - 2];
    return q.rule === 0 ? tr('всяко е сборът на двете преди него', 'кожне — сума двох попередніх') + ' &nbsp;→&nbsp; ' + b + ' + ' + a + ' = ' + q.ans
         : q.rule === 1 ? tr('стъпката е <b>', 'крок — <b>') + (q.seq[1] - q.seq[0]) + '</b> &nbsp;→&nbsp; ' + a + ' + ' +
                          (q.seq[1] - q.seq[0]) + ' = ' + q.ans
         : tr('всяко е двойно по-голямо от предното', 'кожне вдвічі більше за попереднє') + ' &nbsp;→&nbsp; ' + a + ' + ' + a + ' = ' + q.ans;
  }
  if(q.kind === 'missing'){
    if(!full) return q.rule === 0 ? tr('Всяко число е сборът на двете преди него.', 'Кожне число — сума двох попередніх.')
            : q.rule === 1 ? tr('Стъпката между числата е една и съща.', 'Крок між числами однаковий.')
            : tr('Всяко число е двойно по-голямо от предното.', 'Кожне число вдвічі більше за попереднє.');
    const dg = v => String(v).length === 1 ? tr('1 цифра', '1 цифру') : String(v).length + ' цифри';
    const head = tr('липсват <b>', 'пропущено <b>') + q.hidden[0] + tr('</b> и <b>', '</b> і <b>') + q.hidden[1] + '</b> &nbsp;→&nbsp; ';
    const has = tr(' има ', ' має ');
    return head + (q.asksDigits
      ? q.hidden[0] + has + dg(q.hidden[0]) + ', ' + q.hidden[1] + has + dg(q.hidden[1]) + ' &nbsp;→&nbsp; ' + q.ans
      : q.hidden[0] + ' + ' + q.hidden[1] + ' = ' + q.ans);
  }
}
KIND.missing = { draw:drawMissing, eq:eqMissing, why:whyMissing };
