// Question kind 'turnfig': level 371 Калинки — Which of five ladybugs is the one shown turned, or the print of a stamp.

// Кенгуру 2026, задача 1 (shape 'lady'): which ladybug is the one shown, turned round (the others are its mirror image, or have a spot
// elsewhere). Кенгуру 2024, задача 8 and 2022, задача 13 (shape 'stamp'): which one is printed by the stamp shown (the print is the
// mirror image, left to right). One ladybug is drawn in code, head up and its spots asymmetric, and every option is that ONE drawing
// inside a transform: rotate(a) for a turn, rotate(a) scale(-1 1) for a mirror image. A ladybug's body has no asymmetry of its own,
// so the spots (and the head) are what tells the options apart. The answer is a picture, so the kind brings its own А–Д.
import { KIND, shuffle, tr } from '../js/core.js';
// the places a spot can be: five on the left wing, the same five mirrored on the right (none on the head or the wing line)
const LEFT = [[-12, -6], [-13, 6], [-6, 12], [-7, -1], [-5, -8]], POOL = LEFT.concat(LEFT.map(([x, y]) => [-x, y]));
/** @typedef {{m: boolean, r: number}} FgT   a mirror image (left-right) first when m, then turned r quarter turns clockwise */
/** one ladybug as the eye sees it: the spots and the head after the transform (a body is round, so nothing else shows) */
export const fgSig = (/** @type {number[][]} */ spots, /** @type {FgT} */ t) => {
  const mv = (/** @type {number[]} */ p) => { let [x, y] = t.m ? [-p[0], p[1]] : p; for(let i = 0; i < t.r; i++) [x, y] = [-y, x]; return [x, y]; };
  return spots.map(mv).map(p => p.join(',')).sort().join(' ') + ' | head ' + mv([0, -21]).join(',');
};
const same = (/** @type {number[][]} */ a, /** @type {number[][]} */ b) => a.length === b.length && a.every(p => b.some(s => s[0] === p[0] && s[1] === p[1]));
export function genTurnFig(){
  for(;;){
    const shape = Math.random() < 0.6 ? 'lady' : 'stamp';
    const spots = shuffle(POOL.slice()).slice(0, 4);
    if(same(spots, spots.map(([x, y]) => [-x, y]))) continue;   // a mirror-symmetric ladybug has no mirror image to tell
    /** @type {{t: FgT, spots: number[][], kind: string}[]} */
    const opts = [];
    const add = (/** @type {FgT} */ t, /** @type {number[][]} */ sp, kind) => { if(!opts.some(o => fgSig(o.spots, o.t) === fgSig(sp, t))) opts.push({ t, spots: sp, kind }); };
    let right;
    if(shape === 'lady'){
      const a = 1 + Math.floor(Math.random() * 3);
      right = { t: { m: false, r: a }, spots, kind: 'turn' };
      opts.push(right);
      const mirrors = shuffle([0, 1, 2, 3]).slice(0, 2 + Math.floor(Math.random() * 2));
      mirrors.forEach(r => add({ m: true, r }, spots, 'mirror'));
      for(let tries = 0; opts.length < 5 && tries < 40; tries++){   // a spot moved elsewhere, turned some way
        const i = Math.floor(Math.random() * 4), free = POOL.filter(p => !spots.some(s => s[0] === p[0] && s[1] === p[1]));
        const sp = spots.slice(); sp[i] = free[Math.floor(Math.random() * free.length)];
        add({ m: Math.random() < 0.3, r: Math.floor(Math.random() * 4) }, sp, 'moved');
      }
    } else {
      right = { t: { m: true, r: 0 }, spots, kind: 'print' };
      opts.push(right);
      const others = [{ m: false, r: 0 }, { m: true, r: 2 }, { m: false, r: 2 }, { m: false, r: 1 }, { m: false, r: 3 }, { m: true, r: 1 }, { m: true, r: 3 }];
      shuffle(others.slice(0, 3)).concat(shuffle(others.slice(3))).forEach(t => { if(opts.length < 5) add(t, spots, 'slip'); });
    }
    if(opts.length < 5) continue;
    // exactly one option is the ladybug shown turned (lady), or the stamp's print (stamp): the mirror image, not turned
    const want = (/** @type {{t: FgT, spots: number[][]}} */ o) => shape === 'lady' ? [0, 1, 2, 3].some(r => fgSig(o.spots, o.t) === fgSig(spots, { m: false, r })) : fgSig(o.spots, o.t) === fgSig(spots, { m: true, r: 0 });
    if(opts.filter(want).length !== 1) continue;
    const order = shuffle(opts.slice()), pick = order.indexOf(right);
    return {kind:'turnfig', shape, spots, options: order.map((o, id) => ({ id, v: id, text: [lady(o.spots, o.t, 64), lady(o.spots, o.t, 64)], t: o.t, spots: o.spots, how: o.kind })), pick, own: true, ans: pick};
  }
}
/** the one ladybug, drawn head up on a 76 × 76 field; transform = how it is turned (and mirrored first) */
function body(/** @type {number[][]} */ spots){
  return '<circle r="23" fill="var(--bad)" stroke="var(--ink)" stroke-width="1.5"/><path d="M0,-14 V23" stroke="var(--ink)" stroke-width="1.6"/>' +
    '<circle cx="0" cy="-21" r="8" fill="var(--ink)"/><path d="M-4,-28 L-9,-35 M4,-28 L9,-35" stroke="var(--ink)" stroke-width="1.6" stroke-linecap="round"/>' +
    spots.map(([x, y]) => '<circle cx="' + x + '" cy="' + y + '" r="3.4" fill="var(--ink)"/>').join('');
}
function lady(/** @type {number[][]} */ spots, /** @type {FgT} */ t, /** @type {number} */ w, /** @type {string} */ frame = ""){
  const tf = (t.r ? 'rotate(' + t.r * 90 + ')' : '') + (t.m ? (t.r ? ' ' : '') + 'scale(-1 1)' : '');
  const lab = tr(t.m ? 'калинка, огледално обърната' : 'калинка', t.m ? 'сонечко, дзеркально обернене' : 'сонечко') + (t.r ? tr(', завъртяна на ' + t.r * 90 + '°', ', повернуте на ' + t.r * 90 + '°') : '');
  return '<svg viewBox="-40 -40 80 80" width="' + w + '" height="' + w + '" style="max-width:100%" role="img" aria-label="' + lab + '">' + (frame || '') + '<g' + (tf ? ' transform="' + tf + '"' : '') + '>' + body(spots) + '</g></svg>';
}
function given(q){
  if(q.shape === 'lady') return lady(q.spots, { m: false, r: 0 }, 84);
  // the stamp: a block of wood with the ladybug cut into its face, a handle above
  return lady(q.spots, { m: false, r: 0 }, 96, '<rect x="-38" y="-38" width="76" height="76" rx="8" fill="var(--warmbg)" stroke="var(--warm)" stroke-width="3"/>');
}
function drawTurnFig(q){
  return '<div class="ask">' + (q.shape === 'lady' ? tr('<b>Коя от калинките по-долу е като показаната?</b> Калинките може да са завъртени.', '<b>Яке з сонечок нижче таке саме, як показане?</b> Сонечка можуть бути повернуті.') :
    tr('<b>Коя от калинките по-долу е отпечатана с помощта на показания печат?</b> Печатът се притиска върху хартията, без да се върти.', '<b>Яке з сонечок нижче відбито за допомогою показаного штампа?</b> Штамп притискають до паперу, не повертаючи.')) + '</div>' +
    '<div class="given" style="text-align:center">' + given(q) + '</div>';
}
function eqTurnFig(q){
  return q.shape === 'lady' ? tr('същата калинка, завъртяна', 'те саме сонечко, повернуте') : tr('огледален образ на печата', 'дзеркальне відображення штампа');
}
function whyTurnFig(q, full){
  if(!full) return q.shape === 'lady'
    ? tr('Намери главата на калинката и завърти листа, докато главата е нагоре. После сравни точките: на същата калинка са на същите места.', 'Знайди голову сонечка і поверни аркуш, поки голова не буде вгорі. Потім порівняй цятки: у такого самого сонечка вони на тих самих місцях.')
    : tr('Печатът отпечатва огледален образ: това, което е отляво на печата, на отпечатъка е отдясно. Главата си остава нагоре.', 'Штамп відбиває дзеркальне відображення: що ліворуч на штампі, на відбитку праворуч. Голова лишається вгорі.');
  const right = q.options[q.pick];
  return given(q) + ' &nbsp;→&nbsp; ' + right.text[0] + '<br>' + (q.shape === 'lady'
    ? tr('Другите са като в огледало: точките им са от другата страна, или една точка е на друго място. Правилната е същата калинка, само завъртяна.', 'Інші, як у дзеркалі: їхні цятки з іншого боку, або одна цятка на іншому місці. Правильне — те саме сонечко, тільки повернуте.')
    : tr('Отпечатъкът е огледален образ на печата: лявото става дясно, главата остава горе.', 'Відбиток — дзеркальне відображення штампа: ліве стає правим, голова лишається вгорі.'));
}
KIND.turnfig = { draw:drawTurnFig, eq:eqTurnFig, why:whyTurnFig };
